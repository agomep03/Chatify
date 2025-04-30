# main.py
from fastapi import FastAPI
from src.routes import auth_routes, user_routes
from src.config.db import Base, engine

app = FastAPI()

# Crear las tablas al arrancar
@app.on_event("startup")
def on_startup():
    print("Creando tablas si no existen...")
    Base.metadata.create_all(bind=engine)
    print("Tablas listas")

# Incluir tus rutas
app.include_router(auth_routes.router, prefix="/auth", tags=["auth"])
app.include_router(user_routes.router, prefix="/user", tags=["user"])