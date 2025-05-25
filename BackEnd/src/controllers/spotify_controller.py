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

        url = f"https://api.spotify.com/v1/users/{user.spotify_user_id}/playlists"
        response = requests.get(url, headers=headers)

        if response.status_code == 401:
            logger.warning(f"Token inválido incluso después del refresh para usuario {user.email}")
            raise HTTPException(status_code=401, detail="Token inválido incluso después de refrescar")

        if response.status_code != 200:
            logger.error(f"Error al obtener playlists: {response.status_code}, {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Error al obtener playlists")

        data = response.json()
        playlists = [
            {
                "name": item["name"],
                "id": item["id"],
                "tracks": item["tracks"]["total"]
            } for item in data.get("items", [])
        ]

        logger.info(f"Playlists obtenidas correctamente para usuario {user.email}")
        return {"playlists": playlists}

    except Exception as e:
        logger.exception(f"Error inesperado al obtener playlists para usuario {user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno al obtener playlists")
