import logging
from fastapi import HTTPException, Depends, Security
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.models.auth_model import User
from src.controllers.user_controller import get_spotify_login_url
from src.utils.auth import hash_password, verify_password, create_access_token
from src.config.db import SessionLocal
from email_validator import validate_email, EmailNotValidError
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  

def get_db():
    db = SessionLocal()
    try:
        yield db  
    finally:
        db.close() 

def get_current_user(token: str = Security(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Unauthorized",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    return user



def validate_email_address(email: str):
    logger.info(f"Validating email: {email}")
    try:
        validate_email(email)
        logger.info(f"Email {email} is valid.")
        return True
    except EmailNotValidError as e:
        logger.error(f"Invalid email: {email}. Error: {e}")
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": f"Invalid email: {e}"
            }
        )

def register_user(username: str, email: str, password: str, db: Session):
    validate_email_address(email)

    if db.query(User).filter(User.email == email).first():
        logger.warning(f"Email {email} already registered.")
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": "Email already registered"
            }
        )
    
    hashed = hash_password(password)
    new_user = User(username=username, email=email, hashed_password=hashed)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    redirect_url = get_spotify_login_url(email=new_user.email)

    logger.info(f"User {username} registered successfully with email {email}.")
    print(redirect_url)
    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": redirect_url
    }

def login_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        logger.warning(f"Invalid login attempt for email: {email}")
        raise HTTPException(
            status_code=401,
            detail={
                "success": False,
                "error": "Invalid credentials"
            }
        )
    
    token = create_access_token({"sub": user.email})

    logger.info(f"User {user.username} logged in successfully.")

    redirect_url = get_spotify_login_url(email=user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "redirect_url": redirect_url
    }
