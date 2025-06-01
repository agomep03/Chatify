from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from src.routes import auth_routes, chat_routes, spotify_routes
from src.config.db import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Función de ciclo de vida para inicializar y cerrar la aplicación FastAPI.

    - Al iniciar, crea las tablas definidas por los modelos si no existen.
    - Al cerrar, puede incluir lógica de limpieza futura.
    """
    print("🔄 Iniciando app... creando tablas si no existen")
    Base.metadata.create_all(bind=engine)
    print("✅ Tablas listas")
    yield
    print("👋 Cerrando app...")


# Inicialización de la aplicación FastAPI con ciclo de vida personalizado
app = FastAPI(
    title="Chatbot Musical API",
    description="API para autenticación, conversaciones IA, y conexión con Spotify.",
    version="1.0.0",
    lifespan=lifespan
)

# Configuración del middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # En producción: especificar dominios permitidos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de rutas agrupadas por funcionalidad
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(chat_routes.router, prefix="/chat", tags=["chat"])
app.include_router(spotify_routes.router, prefix="/spotify", tags=["spotify"])
