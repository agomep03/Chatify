from pydantic import BaseModel
from typing import Optional

class RegisterRequest(BaseModel):
    """
    Esquema para registrar un nuevo usuario.

    Atributos:
        username (str): Nombre de usuario único.
        email (str): Correo electrónico único.
        password (str): Contraseña del usuario.
    """
    username: str
    email: str
    password: str


class UpdateUserRequest(BaseModel):
    """
    Esquema para actualizar la información del usuario.

    Atributos:
        username (Optional[str]): Nuevo nombre de usuario.
        email (Optional[str]): Nuevo correo electrónico.
        password (Optional[str]): Nueva contraseña.
    """
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None