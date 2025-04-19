# src/controllers/auth_controller.py
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from src.models.user_model import User
from src.utils.auth import hash_password, verify_password, create_access_token
from src.config.db import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def register_user(username: str, email: str, password: str, db: Session):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = hash_password(password)
    new_user = User(username=username, email=email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully"}

def login_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
