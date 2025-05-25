# src/config/dotenv_config.py

import logging
import os

from dotenv import load_dotenv

# Configurar logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Cargar variables del archivo .env al entorno
load_dotenv()
logger.info(".env cargado correctamente.")

# Obtener clave secreta para JWT u otros usos críticos
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
if SECRET_KEY == "default_secret_key":
    logger.warning("SECRET_KEY no definida en .env, se está usando el valor por defecto (no seguro para producción)")

# Tiempo de expiración para el token de acceso (en minutos)
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
except ValueError:
    logger.error("ACCESS_TOKEN_EXPIRE_MINUTES debe ser un número entero")
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
