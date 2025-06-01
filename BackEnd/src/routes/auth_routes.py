import os
import logging
from urllib.parse import quote
from typing import Optional

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from src.controllers.auth_controller import (
    register_user,
    login_user,
    get_db,
    get_current_user,
    get_user_info,
    update_user_info
)
from src.services.spotify_service import login_spotify
from src.models.auth_model import User
from src.schemas.auth_schemas import RegisterRequest, UpdateUserRequest

# Configuración de logging
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

FRONTEND_URL = os.getenv("FRONTEND_URL")

router = APIRouter()


@router.post("/register", summary="Registrar nuevo usuario", tags=["Auth"])
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registra un nuevo usuario en la base de datos.

    Args:
        data (RegisterRequest): Información del usuario.
        db (Session): Sesión de base de datos.

    Returns:
        dict: Resultado del registro.
    """
    logger.info(f"[POST /register] Registrando nuevo usuario: {data.username}")
    return register_user(data.username, data.email, data.password, db)


@router.post("/login", summary="Iniciar sesión", tags=["Auth"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Autentica a un usuario con email y contraseña.

    Args:
        form_data (OAuth2PasswordRequestForm): Formulario OAuth2.
        db (Session): Sesión de base de datos.

    Returns:
        dict: Token JWT y usuario.
    """
    logger.info(f"[POST /login] Intento de login para el email: {form_data.username}")
    return login_user(form_data.username, form_data.password, db)


@router.get("/me", summary="Obtener perfil de usuario", tags=["Auth"])
def get_profile(user: User = Depends(get_current_user)):
    """
    Devuelve la información del usuario autenticado.

    Args:
        user (User): Usuario actual autenticado.

    Returns:
        dict: Información del usuario.
    """
    logger.info(f"[GET /me] Obteniendo perfil del usuario ID: {user.id}")
    return get_user_info(user)


@router.put("/me", summary="Actualizar perfil de usuario", tags=["Auth"])
def update_profile(
    data: UpdateUserRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Actualiza la información del usuario autenticado.

    Args:
        data (UpdateUserRequest): Campos a modificar.
        user (User): Usuario actual.
        db (Session): Sesión de base de datos.

    Returns:
        dict: Resultado de la actualización.
    """
    logger.info(f"[PUT /me] Actualizando perfil del usuario ID: {user.id} con datos: {data}")
    return update_user_info(data, user, db)


@router.get("/callback", summary="Callback de autenticación de Spotify", tags=["Auth"])
async def spotify_callback(request: Request, db: Session = Depends(get_db)):
    """
    Maneja el callback de autenticación de Spotify.

    Args:
        request (Request): Objeto de solicitud HTTP.
        db (Session): Sesión de base de datos.

    Returns:
        RedirectResponse: Redirección al frontend según resultado.
    """
    logger.info("[GET /callback] Procesando callback de Spotify")
    try:
        result = login_spotify(request, db)
        if not result.get("success", False):
            reason = quote(result.get("message", "Error desconocido"))
            logger.warning(f"[GET /callback] Fallo en autenticación Spotify: {reason}")
            return RedirectResponse(url=f"{FRONTEND_URL}/error?reason={reason}")
        logger.info("[GET /callback] Autenticación Spotify exitosa")
        return RedirectResponse(url=f"{FRONTEND_URL}/home")
    except HTTPException as e:
        reason = quote(str(e.detail))
        logger.error(f"[GET /callback] Error HTTP en autenticación Spotify: {reason}")
        return RedirectResponse(url=f"{FRONTEND_URL}/error?reason={reason}")
    except Exception as e:
        logger.exception("[GET /callback] Error inesperado en autenticación Spotify")
        return RedirectResponse(url=f"{FRONTEND_URL}/error?reason=Error%20interno")
