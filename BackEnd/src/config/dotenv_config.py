"""
Módulo de configuración de entorno con dotenv.

Este archivo se encarga de:
- Cargar automáticamente las variables de entorno definidas en un archivo `.env`.
- Exponer variables clave como `SECRET_KEY` y `ACCESS_TOKEN_EXPIRE_MINUTES` para el proyecto.
"""

import os
import logging

from dotenv import load_dotenv

# Configuración de logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Cargar las variables del entorno desde el archivo .env
load_dotenv()
logger.info("Archivo .env cargado correctamente.")

# Obtener clave secreta desde el entorno
SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")

if SECRET_KEY == "default_secret_key":
    logger.warning(
        "SECRET_KEY no definida en .env. "
        "Se está utilizando una clave por defecto, lo cual NO es seguro para producción."
    )

# Obtener la duración del token de acceso en minutos
try:
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
except ValueError:
    logger.error("ACCESS_TOKEN_EXPIRE_MINUTES debe ser un número entero. Usando valor por defecto: 30.")
    ACCESS_TOKEN_EXPIRE_MINUTES = 30
