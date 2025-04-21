# src/routes/auth_routes.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from src.controllers.auth_controller import register_user, login_user, get_db

router = APIRouter()

class RegisterRequest(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register")
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(data.username, data.email, data.password, db)

@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(data.email, data.password, db)
