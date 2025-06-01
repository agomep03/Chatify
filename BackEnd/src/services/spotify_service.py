from fastapi import Request, HTTPException
from sqlalchemy.orm import Session
from src.models.auth_model import User
import os
import requests
import base64
import logging
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy.exc import IntegrityError

load_dotenv()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def login_spotify(request: Request, db: Session):
    code = request.query_params.get("code")
    email = request.query_params.get("state")

    if not code or not email:
        logger.warning("Faltan parámetros 'code' o 'email' en la petición")
        raise HTTPException(status_code=400, detail="Faltan parámetros de autorización (code o email)")

    try:
        token_url = "https://accounts.spotify.com/api/token"
        headers = {
            "Authorization": f"Basic {base64.b64encode(f'{CLIENT_ID}:{CLIENT_SECRET}'.encode()).decode()}",
            "Content-Type": "application/x-www-form-urlencoded"
        }
        data = {
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI
        }

        response = requests.post(token_url, headers=headers, data=data)

        if response.status_code != 200:
            logger.error(f"Error al obtener el token de Spotify: {response.status_code}, {response.text}")
            raise HTTPException(status_code=502, detail="Error al obtener el token de acceso de Spotify")

        token_info = response.json()
        access_token = token_info.get("access_token")
        refresh_token = token_info.get("refresh_token")
        expires_in = token_info.get("expires_in")

        if not access_token:
            logger.error("Spotify no devolvió un token de acceso")
            raise HTTPException(status_code=502, detail="Spotify no devolvió un token válido")

        user_info_response = requests.get(
            "https://api.spotify.com/v1/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )

        if user_info_response.status_code != 200:
            logger.error(f"No se pudo obtener la información del usuario de Spotify: {user_info_response.status_code}")
            raise HTTPException(status_code=502, detail="No se pudo obtener la información del usuario de Spotify")

        user_info = user_info_response.json()
        spotify_user_id = user_info.get("id")

        if not spotify_user_id:
            logger.error("Spotify no devolvió un ID de usuario")
            raise HTTPException(status_code=502, detail="Spotify no devolvió un ID de usuario válido")

        spotify_email = user_info.get("email")
        if spotify_email and spotify_email.lower() != email.lower():
            logger.warning(f"El email de Spotify '{spotify_email}' no coincide con el de la app '{email}'")
            raise HTTPException(
                status_code=403,
                detail="El email de la cuenta de Spotify no coincide con el usuario autenticado."
            )

        user = db.query(User).filter(User.email == email).first()
        if not user:
            logger.warning(f"No se encontró usuario con email: {email}")
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        # Validar que el ID de Spotify no esté ya asociado a otro usuario
        existing_user = db.query(User).filter(User.spotify_user_id == spotify_user_id).first()
        if existing_user and existing_user.email != user.email:
            logger.warning(f"El ID de Spotify '{spotify_user_id}' ya está vinculado a otra cuenta: {existing_user.email}")
            raise HTTPException(
                status_code=409,
                detail="Este usuario de Spotify ya está vinculado a otra cuenta en el sistema."
            )

        user.spotify_user_id = spotify_user_id
        user.spotify_access_token = access_token
        user.spotify_refresh_token = refresh_token
        user.spotify_token_expires_at = datetime.utcnow() + timedelta(seconds=int(expires_in))

        db.commit()
        logger.info(f"Usuario {user.email} conectado correctamente con Spotify")

        return {
            "success": True,
            "message": "Conexión con Spotify realizada correctamente"
        }

    except IntegrityError as e:
        db.rollback()
        if e.orig and hasattr(e.orig, "args") and "duplicate key value violates unique constraint" in e.orig.args[0]:
            logger.warning(f"El ID de Spotify '{spotify_user_id}' ya está vinculado a otra cuenta.")
            raise HTTPException(
                status_code=409,
                detail="El ID de Spotify ya está vinculado a otra cuenta."
            )
        else:
            logger.error(f"Error de integridad: {str(e)}")
            raise HTTPException(status_code=400, detail="Error al guardar la información de Spotify")

    except HTTPException as e:
        raise e

    except Exception as e:
        db.rollback()
        logger.exception(f"Error inesperado en login_spotify: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor al conectar con Spotify")
