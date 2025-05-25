import base64
import logging
import os
from datetime import datetime, timedelta

import requests
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.models.auth_model import User
from src.services.chatIA_service import Agent

# Configuración de entorno y logging
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


def refresh_spotify_token(user: User, db: Session):
    logger.info(f"Refrescando token Spotify para usuario {user.email}")
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
            logger.error(f"Error al refrescar el token: {response.status_code} {response.text}")
            raise HTTPException(status_code=502, detail="Error al refrescar el token de Spotify")

        token_info = response.json()
        user.spotify_access_token = token_info.get("access_token")
        user.spotify_token_expires_at = datetime.utcnow() + timedelta(seconds=token_info.get("expires_in", 3600))

        db.commit()
        logger.info(f"Token actualizado correctamente para usuario {user.email}")
        return user.spotify_access_token

    except Exception as e:
        logger.exception(f"Excepción al refrescar token Spotify: {e}")
        raise HTTPException(status_code=500, detail="Error interno al refrescar token de Spotify")


def get_valid_spotify_token(user: User, db: Session):
    logger.info(f"Obteniendo token válido para usuario {user.email}")
    if not user.spotify_access_token:
        logger.warning(f"Usuario {user.email} no tiene token de acceso de Spotify.")
        raise HTTPException(status_code=401, detail="El usuario no está vinculado con Spotify")

    if user.spotify_token_expires_at is None or user.spotify_token_expires_at <= datetime.utcnow():
        logger.info(f"Token expirado para usuario {user.email}, refrescando...")
        return refresh_spotify_token(user, db)

    logger.info(f"Token válido obtenido para usuario {user.email}")
    return user.spotify_access_token


def get_all_user_playlists(user: User, db: Session):
    try:
        access_token = get_valid_spotify_token(user, db)
        headers = {"Authorization": f"Bearer {access_token}"}

        playlists = []
        limit = 50
        offset = 0

        while True:
            url = f"https://api.spotify.com/v1/me/playlists?limit={limit}&offset={offset}"
            response = requests.get(url, headers=headers)

            if response.status_code == 401:
                logger.warning(f"Token inválido incluso después del refresh para usuario {user.email}")
                raise HTTPException(status_code=401, detail="Token inválido incluso después de refrescar")

            if response.status_code != 200:
                logger.error(f"Error al obtener playlists: {response.status_code}, {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Error al obtener playlists")

            data = response.json()
            items = data.get("items", [])

            if not items:
                break  # No hay más playlists

            for item in items:
                playlist_id = item["id"]
                playlist_name = item["name"]
                image_url = item["images"][0]["url"] if item.get("images") else None

                # Obtener tracks de la playlist (opcional, si quieres)
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

            offset += limit

            if not data.get("next"):
                break

        logger.info(f"Se obtuvieron {len(playlists)} playlists para usuario {user.email}")
        return {"playlists": playlists}

    except Exception as e:
        logger.exception(f"Error inesperado al obtener playlists para usuario {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al obtener playlists")



def update_playlist(playlist_id: str, title: str | None, image_base64: str | None, user: User, db: Session):
    logger.info(f"Actualizando playlist {playlist_id} para usuario {user.email}")
    access_token = get_valid_spotify_token(user, db)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Verificar propiedad
    playlist_response = requests.get(
        f"https://api.spotify.com/v1/playlists/{playlist_id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if playlist_response.status_code != 200:
        logger.error(f"Error al obtener info playlist {playlist_id}: {playlist_response.status_code}, {playlist_response.text}")
        raise HTTPException(status_code=playlist_response.status_code, detail="No se pudo verificar la propiedad de la playlist")

    playlist_data = playlist_response.json()
    owner_id = playlist_data.get("owner", {}).get("id")
    if owner_id != user.spotify_user_id:
        logger.warning(f"Usuario {user.email} intentó modificar playlist ajena (owner: {owner_id})")
        raise HTTPException(status_code=403, detail="No tienes permiso para modificar esta playlist")

    # Actualizar título
    if title:
        logger.info(f"Actualizando título playlist {playlist_id} a '{title}'")
        response = requests.put(
            f"https://api.spotify.com/v1/playlists/{playlist_id}",
            headers=headers,
            json={"name": title}
        )
        if response.status_code != 200:
            logger.error(f"Error al actualizar título: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Error al actualizar el título")

    # Actualizar imagen
    if image_base64:
        logger.info(f"Actualizando imagen playlist {playlist_id}")
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
            logger.error(f"Error al actualizar imagen: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Error al actualizar la imagen")

    logger.info(f"Playlist {playlist_id} actualizada correctamente por usuario {user.email}")
    return {"message": "Playlist actualizada correctamente"}


async def generate_playlist_auto(prompt: str, user, db):
    logger.info(f"Generando playlist automática para tema: {prompt}")
    access_token = get_valid_spotify_token(user, db)
    headers = {"Authorization": f"Bearer {access_token}"}

    system_message = (
        "Eres un asistente experto en música. Devuélveme un título para una playlist y una lista de 20 canciones relacionadas con el siguiente tema. "
        "Formato:\nTítulo: <aquí el título>\nCanciones:\nCada canción en una línea, 'Título - Artista'. Sin otra explicación."
    )
    user_message = f"{system_message}\nTema: {prompt}"

    agent = Agent()
    try:
        response_text = await agent.chat(user_message)
        logger.info(f"Respuesta del modelo recibida, longitud: {len(response_text)} caracteres")
    except Exception as e:
        logger.error(f"Error al generar canciones con el modelo: {e}")
        raise HTTPException(status_code=500, detail="Error al generar canciones con el modelo")

    # Parsear título y canciones
    title = None
    canciones = []

    lines = response_text.split("\n")
    for i, line in enumerate(lines):
        if line.lower().startswith("título:"):
            title = line.split(":", 1)[1].strip()
            logger.info(f"Título extraído: {title}")
        elif "-" in line:
            try:
                titulo, artista = map(str.strip, line.split("-", 1))
                if titulo and artista:
                    canciones.append((titulo, artista))
            except Exception as e:
                logger.warning(f"Línea ignorada por formato inválido: {line}")

    if not title or not canciones:
        logger.error("No se pudo extraer título o canciones correctamente del texto del modelo")
        raise HTTPException(status_code=500, detail="Error al procesar la respuesta del modelo")

    # Buscar las canciones en Spotify para obtener sus URIs
    track_uris = []
    for titulo, artista in canciones:
        query = f"track:{titulo} artist:{artista}"
        search_url = f"https://api.spotify.com/v1/search?q={requests.utils.quote(query)}&type=track&limit=1"
        search_resp = requests.get(search_url, headers=headers)
        if search_resp.status_code != 200:
            logger.warning(f"No se pudo buscar la canción '{titulo}' de '{artista}' en Spotify")
            continue

        items = search_resp.json().get("tracks", {}).get("items", [])
        if items:
            track_uris.append(items[0]["uri"])
        else:
            logger.info(f"No se encontró en Spotify la canción '{titulo}' de '{artista}'")

    # Crear playlist en Spotify
    create_url = f"https://api.spotify.com/v1/users/{user.spotify_user_id}/playlists"
    create_resp = requests.post(create_url, headers=headers, json={"name": title, "description": f"Playlist generada con IA sobre: {prompt}"})

    if create_resp.status_code != 201:
        logger.error(f"Error al crear playlist en Spotify: {create_resp.status_code}, {create_resp.text}")
        raise HTTPException(status_code=create_resp.status_code, detail="Error al crear playlist en Spotify")

    playlist_id = create_resp.json()["id"]
    logger.info(f"Playlist creada en Spotify con ID: {playlist_id}")

    # Agregar canciones a la playlist por chunks para no exceder límite
    chunk_size = 100
    for i in range(0, len(track_uris), chunk_size):
        uris_chunk = track_uris[i:i + chunk_size]
        add_tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
        add_resp = requests.post(add_tracks_url, headers=headers, json={"uris": uris_chunk})

        if add_resp.status_code != 201:
            logger.error(f"Error al agregar canciones a la playlist: {add_resp.status_code}, {add_resp.text}")
            raise HTTPException(status_code=add_resp.status_code, detail="Error al agregar canciones a la playlist")

    logger.info(f"Playlist automática generada correctamente con {len(track_uris)} canciones")
    return {"message": "Playlist creada exitosamente", "playlist_id": playlist_id, "title": title}
