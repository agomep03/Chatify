import logging
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from src.models.user_model import User
from src.utils.auth import hash_password, verify_password, create_access_token
from src.config.db import SessionLocal
from email_validator import validate_email, EmailNotValidError

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_db():
    """
    Crea y proporciona una sesión de base de datos. Esta función se utiliza en FastAPI
    como una dependencia para obtener una sesión de base de datos en las rutas.
    """
    db = SessionLocal()
    try:
        yield db  
    finally:
        db.close() 

def validate_email_address(email: str):
    """
    Valida si el correo electrónico proporcionado es válido utilizando la librería `email-validator`.

    Args:
        email (str): Correo electrónico a validar.

    Raises:
        HTTPException: Si el correo no es válido, se genera una excepción HTTP con un error 400.
    """
    logger.info(f"Validating email: {email}")
    try:
        validate_email(email)
        logger.info(f"Email {email} is valid.")
        return True
    except EmailNotValidError as e:
        logger.error(f"Invalid email: {email}. Error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid email: {e}")

def register_user(username: str, email: str, password: str, db: Session):
    """
    Registra un nuevo usuario en la base de datos, primero validando el correo y asegurándose
    de que no haya otro usuario con el mismo correo.

    Args:
        username (str): Nombre de usuario.
        email (str): Correo electrónico del usuario.
        password (str): Contraseña del usuario.
        db (Session): Sesión de la base de datos para realizar operaciones.

    Returns:
        dict: Un mensaje indicando si el registro fue exitoso.

    Raises:
        HTTPException: Si el correo ya está registrado o si ocurre algún error.
    """
    validate_email_address(email)

    if db.query(User).filter(User.email == email).first():
        logger.warning(f"Email {email} already registered.")
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(password)

    new_user = User(username=username, email=email, hashed_password=hashed)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    logger.info(f"User {username} registered successfully with email {email}.")
    return {"message": "User registered successfully"}

# Función para iniciar sesión
def login_user(email: str, password: str, db: Session):
    """
    Verifica las credenciales del usuario para iniciar sesión. Si las credenciales son correctas,
    genera un token de acceso para el usuario.

    Args:
        email (str): Correo electrónico del usuario.
        password (str): Contraseña del usuario.
        db (Session): Sesión de la base de datos para verificar las credenciales.

    Returns:
        dict: Un diccionario con el token de acceso generado.

    Raises:
        HTTPException: Si las credenciales son inválidas.
    """
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.hashed_password):
        logger.warning(f"Invalid login attempt for email: {email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email})

    logger.info(f"User {user.username} logged in successfully.")
    return {"access_token": token, "token_type": "bearer"}
