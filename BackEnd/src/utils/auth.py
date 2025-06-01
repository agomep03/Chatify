import os
import logging
from datetime import datetime, timedelta
from typing import Optional

from passlib.context import CryptContext
from jose import jwt
from dotenv import load_dotenv

# Configurar logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Cargar variables de entorno desde .env
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

# Contexto para hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    """
    Genera un hash seguro a partir de una contraseña en texto plano.

    Args:
        password (str): Contraseña en texto plano.

    Returns:
        str: Contraseña hasheada.
    """
    logger.debug("[AuthUtils] Generando hash para la contraseña...")
    hashed = pwd_context.hash(password)
    logger.info("[AuthUtils] Contraseña hasheada correctamente")
    return hashed


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifica si una contraseña en texto plano coincide con su versión hasheada.

    Args:
        plain_password (str): Contraseña sin hash.
        hashed_password (str): Contraseña previamente hasheada.

    Returns:
        bool: True si coinciden, False en caso contrario.
    """
    logger.debug("[AuthUtils] Verificando contraseña proporcionada...")
    is_valid = pwd_context.verify(plain_password, hashed_password)
    if is_valid:
        logger.info("[AuthUtils] Contraseña verificada correctamente")
    else:
        logger.warning("[AuthUtils] Fallo en la verificación de contraseña")
    return is_valid


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crea un token JWT firmado que contiene los datos proporcionados.

    Args:
        data (dict): Información a codificar dentro del token.
        expires_delta (Optional[timedelta]): Tiempo de expiración del token.

    Returns:
        str: Token JWT firmado.
    """
    logger.info("[AuthUtils] Creando token de acceso JWT...")
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})

    logger.debug(f"[AuthUtils] Datos codificados en el token: {to_encode}")
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    logger.info("[AuthUtils] Token JWT generado correctamente")
    return token
