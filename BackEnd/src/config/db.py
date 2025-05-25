# src/config/db.py

import logging
import os

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Carga configuración del entorno (.env)
from src.config import dotenv_config  # Asegúrate de que esto cargue dotenv correctamente

# Configuración de logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Obtener la URL de la base de datos desde variables de entorno
DB_URL = os.getenv("DATABASE_URL")

if not DB_URL:
    logger.error("DATABASE_URL no está definida en las variables de entorno.")
    raise RuntimeError("DATABASE_URL es requerida para conectarse a la base de datos")

# Crear motor de conexión a la base de datos
engine = create_engine(DB_URL)

# Crear sesión de SQLAlchemy para manejo de transacciones
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base de la cual heredan todos los modelos declarativos
Base = declarative_base()

logger.info("Conexión a la base de datos inicializada correctamente.")
