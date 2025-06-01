"""
Módulo de configuración de base de datos para SQLAlchemy.

Este archivo se encarga de:
- Leer la URL de conexión desde variables de entorno.
- Inicializar el motor de conexión con SQLAlchemy.
- Proveer la sesión `SessionLocal` para uso en dependencias de FastAPI.
- Crear una clase base `Base` para los modelos ORM.
"""

import os
import logging

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Importación interna para cargar variables de entorno desde .env
from src.config import dotenv_config  # Asegura que dotenv se carga al importar este módulo

# Configuración básica del logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Obtener la URL de la base de datos desde las variables de entorno
DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    logger.error("DATABASE_URL no está definida en las variables de entorno.")
    raise RuntimeError("DATABASE_URL es requerida para conectarse a la base de datos")

# Crear el motor de conexión a la base de datos
engine = create_engine(DB_URL)

# Crear una clase de sesión configurada para el uso con SQLAlchemy
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative base para definir modelos ORM
Base = declarative_base()

logger.info("Conexión a la base de datos inicializada correctamente.")
