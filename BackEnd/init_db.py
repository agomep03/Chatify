from src.config.db import Base, engine
from src.models.auth_model import User
from src.models.conversation_model import Conversation
from src.models.message_model import Message

print("🧨 Eliminando todas las tablas...")
Base.metadata.drop_all(bind=engine)
print("✅ Tablas eliminadas")

print("🧱 Creando tablas nuevas...")
Base.metadata.create_all(bind=engine)
print("✅ Tablas creadas")
