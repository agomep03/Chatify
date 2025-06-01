# init_db.py

"""
Script de inicialización de la base de datos.

Este script elimina todas las tablas existentes y crea nuevas según los modelos definidos.
⚠️ ATENCIÓN: Esto borra todos los datos existentes. Úsalo solo en entornos de desarrollo.
"""

from src.config.db import Base, engine
from src.models.auth_model import User
from src.models.conversation_model import Conversation
from src.models.message_model import Message

def reset_database():
    print("🧨 Eliminando todas las tablas existentes...")
    Base.metadata.drop_all(bind=engine)
    print("✅ Tablas eliminadas correctamente.")

    print("🧱 Creando nuevas tablas a partir de los modelos...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas creadas con éxito.")

if __name__ == "__main__":
    reset_database()
