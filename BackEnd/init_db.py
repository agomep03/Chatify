from src.config.db import Base, engine
from src.models.user_model import User

# Crear las tablas en la base de datos (si no existen)
print("Creando tablas en la base de datos...")
Base.metadata.create_all(bind=engine)
print("Listo ✅")
