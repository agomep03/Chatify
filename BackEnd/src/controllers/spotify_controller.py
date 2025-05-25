from fastapi import HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import requests
import base64
import os
import logging
from src.models.auth_model import User

# Configuración de entorno y logging
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def refresh_spotify_token(user: User, db: Session):
    if not user.spotify_refresh_token:
        logger.warning(f"Usuario {user.email} no tiene refresh token de Spotify.")
        raise HTTPException(status_code=401, detail="Usuario no autorizó Spotify correctamente.")

    token_url = "https://accounts.spotify.com/api/token"
    auth_str = f"{CLIENT_ID}:{CLIENT_SECRET}"
    b64_auth = base64.b64encode(auth_str.encode()).decode()

    headers = {
        "Authorization": f"Basic {b64_auth}",
        "Content-Type": "application/x-www-form-urlencoded"
    }

    data = {
        "grant_type": "refresh_token",
        "refresh_token": user.spotify_refresh_token
    }

    try:
        response = requests.post(token_url, headers=headers, data=data)
        if response.status_code != 200:
            logger.error(f"Error al refrescar el token de Spotify: {response.status_code}, {response.text}")
            raise HTTPException(status_code=502, detail="Error al refrescar el token de Spotify")

        token_info = response.json()
        user.spotify_access_token = token_info.get("access_token")
        user.spotify_token_expires_at = datetime.utcnow() + timedelta(seconds=token_info.get("expires_in", 3600))

        db.commit()
        logger.info(f"Token de acceso de Spotify actualizado para usuario {user.email}")
        return user.spotify_access_token

    except Exception as e:
        logger.exception(f"Excepción al refrescar el token de Spotify: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al refrescar token de Spotify")

def get_valid_spotify_token(user: User, db: Session):
    if not user.spotify_access_token:
        logger.warning(f"Usuario {user.email} no tiene token de acceso de Spotify.")
        raise HTTPException(status_code=401, detail="El usuario no está vinculado con Spotify")

    if user.spotify_token_expires_at is None or user.spotify_token_expires_at <= datetime.utcnow():
        logger.info(f"Token de Spotify expirado para usuario {user.email}, refrescando...")
        return refresh_spotify_token(user, db)

    return user.spotify_access_token

def get_user_playlists(user: User, db: Session):
    try:
        access_token = get_valid_spotify_token(user, db)

        headers = {
            "Authorization": f"Bearer {access_token}"
        }

        # Obtener listas de reproducción del usuario
        url = f"https://api.spotify.com/v1/users/{user.spotify_user_id}/playlists"
        response = requests.get(url, headers=headers)

        if response.status_code == 401:
            logger.warning(f"Token inválido incluso después del refresh para usuario {user.email}")
            raise HTTPException(status_code=401, detail="Token inválido incluso después de refrescar")

        if response.status_code != 200:
            logger.error(f"Error al obtener playlists: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Error al obtener playlists")

        data = response.json()
        playlists = []

        for item in data.get("items", []):
            playlist_id = item["id"]
            playlist_name = item["name"]
            image_url = item["images"][0]["url"] if item.get("images") else None

            # Obtener tracks de la playlist
            tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
            tracks_response = requests.get(tracks_url, headers=headers)

            if tracks_response.status_code != 200:
                logger.warning(f"No se pudieron obtener tracks de la playlist {playlist_name}")
                tracks = []
            else:
                track_items = tracks_response.json().get("items", [])
                tracks = []
                for track_item in track_items:
                    track = track_item.get("track", {})
                    if not track:
                        continue
                    track_name = track.get("name")
                    artists = [artist["name"] for artist in track.get("artists", [])]
                    tracks.append({
                        "name": track_name,
                        "artists": artists
                    })

            playlists.append({
                "name": playlist_name,
                "id": playlist_id,
                "image": image_url,
                "tracks": tracks
            })

        logger.info(f"Playlists obtenidas correctamente para usuario {user.email}")
        return {"playlists": playlists}

    except Exception as e:
        logger.exception(f"Error inesperado al obtener playlists para usuario {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al obtener playlists")

def update_playlist(playlist_id: str, title: str | None, image_base64: str | None, user: User, db: Session):
    access_token = get_valid_spotify_token(user, db)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Verificar que el usuario es el dueño de la playlist
    playlist_response = requests.get(
        f"https://api.spotify.com/v1/playlists/{playlist_id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if playlist_response.status_code != 200:
        logger.error(f"Error al obtener información de la playlist {playlist_id}: {playlist_response.status_code}, {playlist_response.text}")
        raise HTTPException(status_code=playlist_response.status_code, detail="No se pudo verificar la propiedad de la playlist")

    playlist_data = playlist_response.json()
    owner_id = playlist_data.get("owner", {}).get("id")
    if owner_id != user.spotify_user_id:
        logger.warning(f"El usuario {user.email} intentó modificar una playlist que no le pertenece (owner: {owner_id})")
        raise HTTPException(status_code=403, detail="No tienes permiso para modificar esta playlist")

    # Actualizar título si se proporciona
    if title:
        logger.info(f"Actualizando título de la playlist {playlist_id} a '{title}'")
        response = requests.put(
            f"https://api.spotify.com/v1/playlists/{playlist_id}",
            headers=headers,
            json={"name": title}
        )
        if response.status_code != 200:
            logger.error(f"Error al actualizar el título: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Error al actualizar el título")

    # Actualizar imagen si se proporciona
    if image_base64:
        logger.info(f"Actualizando imagen de la playlist {playlist_id}")
        img_headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "image/jpeg"
        }
        try:
            image_data = base64.b64decode(image_base64)
        except Exception as e:
            logger.exception("Falló la decodificación base64 de la imagen")
            raise HTTPException(status_code=400, detail="La imagen no está correctamente codificada en base64")

        response = requests.put(
            f"https://api.spotify.com/v1/playlists/{playlist_id}/images",
            headers=img_headers,
            data=image_data
        )
        if response.status_code != 202:
            logger.error(f"Error al actualizar la imagen: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Error al actualizar la imagen")

    logger.info(f"Playlist {playlist_id} actualizada correctamente por usuario {user.email}")
    return {"message": "Playlist actualizada correctamente"}
