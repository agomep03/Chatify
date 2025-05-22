import logging
from fastapi import HTTPException, Depends, Security
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.models.auth_model import User
from src.controllers.user_controller import get_spotify_login_url
from src.utils.auth import hash_password, verify_password, create_access_token
from src.config.db import SessionLocal
from email_validator import validate_email, EmailNotValidError
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")  # tokenUrl ajustado para swagger

def get_db():
    db = SessionLocal()
    try:
        yield db  
    finally:
        db.close() 

def get_current_user(token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
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
            logger.warning("Token JWT inválido: no contiene 'sub'.")
            raise credentials_exception

        logger.info(f"🔎 Decodificado correctamente. Email extraído del token: {email}")

    except JWTError as e:
        logger.error(f"Fallo al decodificar token JWT: {str(e)}")
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()

    if user is None:
        logger.warning(f"No se encontró usuario con email: {email}")
        raise credentials_exception

    logger.info(f"Usuario autenticado: {user.username} ({user.email})")
    return user

def validate_email_address(email: str):
    logger.info(f"Validating email: {email}")
    try:
        validate_email(email)
        logger.info(f"Email {email} is valid.")
        return True
    except EmailNotValidError as e:
        logger.error(f"Invalid email: {email}. Error: {e}")
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": f"Invalid email: {e}"
            }
        )

def register_user(username: str, email: str, password: str, db: Session):
    validate_email_address(email)

    if db.query(User).filter(User.email == email).first():
        logger.warning(f"Email {email} already registered.")
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Email already registered"
            }
        )
    
    hashed = hash_password(password)
    new_user = User(username=username, email=email, hashed_password=hashed)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    redirect_url = get_spotify_login_url(email=new_user.email)

    logger.info(f"User {username} registered successfully with email {email}.")
    print(redirect_url)
    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": redirect_url
    }

def login_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        logger.warning(f"Invalid login attempt for email: {email}")
        raise HTTPException(
            status_code=401,
            detail={
                "success": False,
                "error": "Invalid credentials"
            }
        )
    
    token = create_access_token({"sub": user.email})

    logger.info(f"User {user.username} logged in successfully.")

    redirect_url = get_spotify_login_url(email=user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": redirect_url
    }

def get_user_info(user: User):
    return {
        "username": user.username,
        "email": user.email
    }

def update_user_info(data, user: User, db: Session):
    try:
        updated = False

        if data.username:
            logger.info(f"Cambiando username: {user.username} → {data.username}")
            user.username = data.username
            updated = True

        if data.email:
            logger.info(f"Verificando nuevo email: {data.email}")
            validate_email_address(data.email)

            existing_user = db.query(User).filter(User.email == data.email).first()

            if existing_user and existing_user.id != user.id:
                logger.warning(f"El email '{data.email}' ya está en uso por el usuario ID {existing_user.id}")
                raise HTTPException(status_code=400, detail="Este email ya está en uso por otro usuario")

            if existing_user and existing_user.id == user.id:
                logger.info("El email nuevo es igual al actual. No se realiza ningún cambio.")
            else:
                logger.info(f"Email actualizado a: {data.email}")
                user.email = data.email
                updated = True

        if data.password:
            logger.info(f"Actualizando contraseña del usuario ID {user.id}")
            user.hashed_password = hash_password(data.password)
            updated = True

        if updated:
            db.commit()
            db.refresh(user)
            logger.info(f"Usuario {user.id} actualizado correctamente")
        else:
            logger.info(f"No se realizaron cambios para el usuario ID {user.id}")

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
        logger.error(f"Error HTTP al actualizar usuario {user.id}: {e.detail}")
        raise e

    except Exception as e:
        logger.exception(f"Error inesperado al actualizar usuario {user.id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Error interno del servidor al actualizar el usuario")
