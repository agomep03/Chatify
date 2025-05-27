# src/controllers/auth_controller.py

# --- Librerías estándar ---
import os
import logging

# --- Librerías de terceros ---
from dotenv import load_dotenv
from email_validator import validate_email, EmailNotValidError
from fastapi import HTTPException, Depends, Security
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from spotipy.oauth2 import SpotifyOAuth

# --- Módulos locales ---
from src.config.db import SessionLocal
from src.models.auth_model import User
from src.utils.auth import hash_password, verify_password, create_access_token

# --- Configuración global ---
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

# Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# OAuth2 para Swagger y FastAPI
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# --- Utils ---

def get_db():
    """Provee una sesión de base de datos y asegura su cierre."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def validate_email_address(email: str):
    """Valida el formato del correo electrónico."""
    logger.info(f"Validando email: {email}")
    try:
        validate_email(email)
        logger.info(f"Email válido: {email}")
        return True
    except EmailNotValidError as e:
        logger.error(f"Email inválido: {email}. Error: {e}")
        raise HTTPException(status_code=400, detail={"success": False, "error": f"Invalid email: {e}"})

# --- Registro y Login ---

def register_user(username: str, email: str, password: str, db: Session):
    """Registra un nuevo usuario."""
    validate_email_address(email)

    if db.query(User).filter(User.email == email).first():
        logger.warning(f"Email ya registrado: {email}")
        raise HTTPException(status_code=400, detail={"success": False, "error": "Email already registered"})

    hashed = hash_password(password)
    new_user = User(username=username, email=email, hashed_password=hashed)

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    redirect_url = get_spotify_login_url(email=new_user.email)

    logger.info(f"Usuario registrado exitosamente: {username} ({email})")
    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": redirect_url
    }

def login_user(email: str, password: str, db: Session):
    """Autentica un usuario y retorna token y redirección a Spotify."""
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        logger.warning(f"Intento de login fallido para: {email}")
        raise HTTPException(status_code=401, detail={"success": False, "error": "Invalid credentials"})

    token = create_access_token({"sub": user.email})
    redirect_url = get_spotify_login_url(email=user.email)

    logger.info(f"Login exitoso: {user.username} ({email})")
    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": redirect_url
    }

def get_current_user(token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    """Obtiene el usuario autenticado desde el token JWT."""
    credentials_exception = HTTPException(
        status_code=401,
        detail="No se pudo verificar las credenciales del usuario.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        logger.debug(f"Token recibido: {token}")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            logger.warning("Token JWT inválido: sin 'sub'")
            raise credentials_exception

        logger.info(f"Token decodificado correctamente. Email: {email}")
    except JWTError as e:
        logger.error(f"Error al decodificar token JWT: {str(e)}")
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        logger.warning(f"Usuario no encontrado: {email}")
        raise credentials_exception

    logger.info(f"Usuario autenticado: {user.username} ({user.email})")
    return user

# --- Perfil de Usuario ---

def get_user_info(user: User):
    """Devuelve información básica del usuario."""
    return {
        "username": user.username,
        "email": user.email
    }

def update_user_info(data, user: User, db: Session):
    """Actualiza datos del usuario (username, email, password)."""
    try:
        updated = False

        if data.username:
            logger.info(f"Actualizando username: {user.username} → {data.username}")
            user.username = data.username
            updated = True

        if data.email:
            logger.info(f"Validando nuevo email: {data.email}")
            validate_email_address(data.email)

            existing_user = db.query(User).filter(User.email == data.email).first()

            if existing_user and existing_user.id != user.id:
                logger.warning(f"Email en uso por otro usuario: {data.email}")
                raise HTTPException(status_code=400, detail="Este email ya está en uso por otro usuario")

            if not (existing_user and existing_user.id == user.id):
                logger.info(f"Actualizando email a: {data.email}")
                user.email = data.email
                updated = True

        if data.password:
            logger.info(f"Actualizando contraseña del usuario ID {user.id}")
            user.hashed_password = hash_password(data.password)
            updated = True

        if updated:
            db.commit()
            db.refresh(user)
            logger.info(f"Usuario actualizado exitosamente: {user.id}")
        else:
            logger.info(f"No se realizaron cambios para el usuario: {user.id}")

        return {
            "success": True,
            "message": "Usuario actualizado correctamente" if updated else "No se realizaron cambios",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email
            }
        }

    except HTTPException as e:
        logger.error(f"Error HTTP al actualizar usuario: {user.id} -> {e.detail}")
        raise e
    except Exception as e:
        logger.exception(f"Error inesperado al actualizar usuario {user.id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor al actualizar el usuario")

# --- Spotify Integration ---
def get_spotify_login_url(email: str = None):
    """Genera URL de autorización para Spotify con estado opcional (email)."""
    sp_oauth = SpotifyOAuth(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
        scope=(
            "user-library-read user-read-private user-read-email "
            "playlist-modify-public playlist-modify-private ugc-image-upload "
            "playlist-read-private"
        ),
        show_dialog=True
    )
    url = sp_oauth.get_authorize_url(state=email)
    logger.debug(f"URL de login de Spotify generada: {url}")
    return url

