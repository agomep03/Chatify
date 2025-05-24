#src/routes/auth_routes.py
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
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
from src.models.auth_model import User

router = APIRouter()

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class UpdateUserRequest(BaseModel):
    username: str | None = None
    email: str | None = None
    password: str | None = None

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
