from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
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
import os
from typing import Optional
from urllib.parse import quote

FRONTEND_URL = os.getenv("FRONTEND_URL")

router = APIRouter()

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class UpdateUserRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(data.username, data.email, data.password, db)

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm tiene username y password, usamos username para email
    return login_user(form_data.username, form_data.password, db)

@router.get("/me")
def get_profile(user: User = Depends(get_current_user)):
    return get_user_info(user)

@router.put("/me")
def update_profile(
    data: UpdateUserRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return update_user_info(data, user, db)

@router.get("/callback")
async def spotify_callback(request: Request, db: Session = Depends(get_db)):
    try:
        result = login_spotify(request, db)
        if not result.get("success", False):
            reason = quote(result.get("message", "Error desconocido"))
            return RedirectResponse(url=f"{FRONTEND_URL}/error?reason={reason}")
        return RedirectResponse(url=f"{FRONTEND_URL}/home")
    except HTTPException as e:
        reason = quote(str(e.detail))
        return RedirectResponse(url=f"{FRONTEND_URL}/error?reason={reason}")
    except Exception:
        return RedirectResponse(url=f"{FRONTEND_URL}/error?reason=Error%20interno")
