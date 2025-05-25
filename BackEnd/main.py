# main.py
from fastapi import FastAPI
from contextlib import asynccontextmanager
from src.routes import auth_routes, chat_routes, spotify_routes
from src.config.db import Base, engine
from fastapi.middleware.cors import CORSMiddleware

# Manejo moderno del ciclo de vida de la app
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔄 Iniciando app... creando tablas si no existen")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas listas")
    yield
    print("👋 Cerrando app...")

# Crear app con ciclo de vida personalizado
app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir tus rutas
app.include_router(chat_routes.router, prefix="/chat", tags=["chat"])
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(spotify_routes.router, prefix="/spotify", tags=["spotify"])