import os
from dotenv import load_dotenv

# Cargar las variables del archivo .env
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "default_secret_key")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
