# === Standard Libraries ===
import base64
import logging
import os
from datetime import datetime, timedelta

# === Third-Party Libraries ===
import requests
from fastapi import HTTPException
from sqlalchemy.orm import Session

# === Internal Imports ===
from src.models.auth_model import User
from src.services.chatIA_service import Agent

# === Configuration ===
CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# === Token Management ===

def refresh_spotify_token(user: User, db: Session) -> str:
    """Refresca el token de acceso de Spotify para el usuario dado."""
    logger.info(f"[TOKEN] Refrescando token para {user.email}")

    if not user.spotify_refresh_token:
        logger.warning(f"[TOKEN] Usuario {user.email} sin refresh token.")
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
            logger.error(f"[TOKEN] Error al refrescar: {response.status_code} {response.text}")
            raise HTTPException(status_code=502, detail="Error al refrescar el token de Spotify")

        token_info = response.json()
        user.spotify_access_token = token_info.get("access_token")
        user.spotify_token_expires_at = datetime.utcnow() + timedelta(seconds=token_info.get("expires_in", 3600))

        db.commit()
        logger.info(f"[TOKEN] Token actualizado correctamente para {user.email}")
        return user.spotify_access_token

    except Exception as e:
        logger.exception(f"[TOKEN] Excepción durante refresh: {e}")
        raise HTTPException(status_code=500, detail="Error interno al refrescar token de Spotify")


def get_valid_spotify_token(user: User, db: Session) -> str:
    """Obtiene un token de acceso válido, refrescándolo si es necesario."""
    logger.info(f"[TOKEN] Verificando token válido para {user.email}")

    if not user.spotify_access_token:
        logger.warning(f"[TOKEN] Usuario {user.email} sin token de acceso.")
        raise HTTPException(status_code=401, detail="El usuario no está vinculado con Spotify")

    if not user.spotify_token_expires_at or user.spotify_token_expires_at <= datetime.utcnow():
        logger.info(f"[TOKEN] Token expirado para {user.email}, refrescando...")
        return refresh_spotify_token(user, db)

    logger.info(f"[TOKEN] Token aún válido para {user.email}")
    return user.spotify_access_token

# === Playlist Retrieval ===

def get_all_user_playlists(user: User, db: Session):
    """Obtiene todas las playlists del usuario autenticado."""
    try:
        access_token = get_valid_spotify_token(user, db)
        headers = {"Authorization": f"Bearer {access_token}"}

        playlists = []
        limit, offset = 50, 0

        while True:
            url = f"https://api.spotify.com/v1/me/playlists?limit={limit}&offset={offset}"
            response = requests.get(url, headers=headers)

            if response.status_code == 401:
                logger.warning(f"[PLAYLISTS] Token inválido tras refresh para {user.email}")
                raise HTTPException(status_code=401, detail="Token inválido incluso después de refrescar")

            if response.status_code != 200:
                logger.error(f"[PLAYLISTS] Error al obtener: {response.status_code}, {response.text}")
                raise HTTPException(status_code=response.status_code, detail="Error al obtener playlists")

            data = response.json()
            items = data.get("items", [])

            if not items:
                break

            for item in items:
                playlist_id = item["id"]
                playlist_name = item["name"]
                image_url = item["images"][0]["url"] if item.get("images") else None

                # Obtener tracks
                tracks_url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
                tracks_response = requests.get(tracks_url, headers=headers)

                tracks = []
                if tracks_response.status_code == 200:
                    for track_item in tracks_response.json().get("items", []):
                        track = track_item.get("track", {})
                        if not track:
                            continue
                        track_name = track.get("name")
                        artists = [a["name"] for a in track.get("artists", [])]
                        tracks.append({"name": track_name, "artists": artists})
                else:
                    logger.warning(f"[PLAYLISTS] Tracks no disponibles para {playlist_name}")

                playlists.append({
                    "name": playlist_name,
                    "id": playlist_id,
                    "image": image_url,
                    "tracks": tracks
                })

            offset += limit
            if not data.get("next"):
                break

        logger.info(f"[PLAYLISTS] Se obtuvieron {len(playlists)} playlists de {user.email}")
        return {"playlists": playlists}

    except Exception as e:
        logger.exception(f"[PLAYLISTS] Error inesperado para {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al obtener playlists")

# === Playlist Update ===

def update_playlist(playlist_id: str, title: str | None, image_base64: str | None, user: User, db: Session):
    """Actualiza el nombre o la imagen de una playlist del usuario."""
    logger.info(f"[UPDATE] Actualizando playlist {playlist_id} de {user.email}")
    access_token = get_valid_spotify_token(user, db)

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }

    # Verificar propiedad de la playlist
    playlist_response = requests.get(
        f"https://api.spotify.com/v1/playlists/{playlist_id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    if playlist_response.status_code != 200:
        logger.error(f"[UPDATE] No se pudo verificar propiedad: {playlist_response.status_code}")
        raise HTTPException(status_code=playlist_response.status_code, detail="No se pudo verificar la propiedad de la playlist")

    owner_id = playlist_response.json().get("owner", {}).get("id")
    if owner_id != user.spotify_user_id:
        logger.warning(f"[UPDATE] Usuario {user.email} no es propietario de {playlist_id}")
        raise HTTPException(status_code=403, detail="No tienes permiso para modificar esta playlist")

    # Actualizar título si se proporciona
    if title:
        logger.info(f"[UPDATE] Cambiando nombre a '{title}'")
        response = requests.put(f"https://api.spotify.com/v1/playlists/{playlist_id}", headers=headers, json={"name": title})
        if response.status_code != 200:
            logger.error(f"[UPDATE] Error al cambiar título: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Error al actualizar el título")

    # Actualizar imagen si se proporciona
    if image_base64:
        logger.info(f"[UPDATE] Actualizando imagen")
        img_headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "image/jpeg"
        }
        try:
            image_data = base64.b64decode(image_base64)
        except Exception:
            logger.exception("[UPDATE] Fallo en la decodificación de la imagen base64")
            raise HTTPException(status_code=400, detail="La imagen no está correctamente codificada en base64")

        response = requests.put(f"https://api.spotify.com/v1/playlists/{playlist_id}/images", headers=img_headers, data=image_data)
        if response.status_code != 202:
            logger.error(f"[UPDATE] Error al actualizar imagen: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Error al actualizar la imagen")

    logger.info(f"[UPDATE] Playlist {playlist_id} actualizada exitosamente")
    return {"message": "Playlist actualizada correctamente"}

# === Playlist Autogenerada por IA ===

async def generate_playlist_auto(prompt: str, user: User, db: Session):
    """Genera automáticamente una playlist basada en un tema usando IA."""
    logger.info(f"[IA] Generando playlist para: {prompt}")
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
        logger.info(f"[IA] Respuesta del modelo: {len(response_text)} caracteres")
    except Exception as e:
        logger.error(f"[IA] Error del modelo: {e}")
        raise HTTPException(status_code=500, detail="Error al generar canciones con el modelo")

    # Parsear respuesta
    title = None
    canciones = []

    for line in response_text.split("\n"):
        if line.lower().startswith("título:"):
            title = line.split(":", 1)[1].strip()
        elif "-" in line:
            try:
                titulo, artista = map(str.strip, line.split("-", 1))
                canciones.append((titulo, artista))
            except Exception:
                logger.warning(f"[IA] Línea ignorada: {line}")

    if not title or not canciones:
        logger.error("[IA] No se pudo extraer título o canciones válidas")
        raise HTTPException(status_code=500, detail="Error al procesar la respuesta del modelo")

    # Buscar canciones en Spotify
    track_uris = []
    for titulo, artista in canciones:
        query = f"track:{titulo} artist:{artista}"
        search_url = f"https://api.spotify.com/v1/search?q={requests.utils.quote(query)}&type=track&limit=1"
        search_resp = requests.get(search_url, headers=headers)

        if search_resp.status_code == 200:
            items = search_resp.json().get("tracks", {}).get("items", [])
            if items:
                track_uris.append(items[0]["uri"])
            else:
                logger.info(f"[IA] No encontrada: '{titulo}' de '{artista}'")
        else:
            logger.warning(f"[IA] Error en búsqueda de '{titulo}' - '{artista}'")

    # Crear playlist
    create_url = f"https://api.spotify.com/v1/users/{user.spotify_user_id}/playlists"
    create_resp = requests.post(create_url, headers=headers, json={
        "name": title,
        "description": f"Playlist generada con IA sobre: {prompt}"
    })

    if create_resp.status_code != 201:
        logger.error(f"[IA] Error al crear playlist: {create_resp.status_code}, {create_resp.text}")
        raise HTTPException(status_code=create_resp.status_code, detail="Error al crear playlist en Spotify")

    playlist_id = create_resp.json()["id"]
    logger.info(f"[IA] Playlist creada con ID: {playlist_id}")

    # Agregar canciones por chunks
    chunk_size = 100
    for i in range(0, len(track_uris), chunk_size):
        uris_chunk = track_uris[i:i + chunk_size]
        add_resp = requests.post(f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks", headers=headers, json={"uris": uris_chunk})

        if add_resp.status_code != 201:
            logger.error(f"[IA] Error al agregar canciones: {add_resp.status_code}, {add_resp.text}")
            raise HTTPException(status_code=add_resp.status_code, detail="Error al agregar canciones a la playlist")

    logger.info(f"[IA] Playlist generada exitosamente con {len(track_uris)} canciones")
    return {"message": "Playlist creada exitosamente", "playlist_id": playlist_id, "title": title}
