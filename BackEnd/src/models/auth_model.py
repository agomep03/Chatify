"""
Modelo ORM para los usuarios de la aplicación.

Define la estructura de la tabla `users` y su relación con otras entidades,
como las conversaciones asociadas. Incluye campos para autenticación propia y datos de Spotify.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship

from src.config.db import Base


class User(Base):
    """
    Modelo que representa a un usuario en el sistema.

    Atributos:
        id (int): Identificador único del usuario.
        username (str): Nombre de usuario (único y obligatorio).
        email (str): Correo electrónico del usuario (único y obligatorio).
        hashed_password (str): Contraseña encriptada del usuario.

        spotify_user_id (str): ID del usuario en Spotify (si está vinculado).
        spotify_access_token (str): Token de acceso de Spotify.
        spotify_refresh_token (str): Token de renovación de Spotify.
        spotify_token_expires_at (datetime): Fecha de expiración del token.

        conversations (list): Lista de conversaciones asociadas al usuario.
    """
    __tablename__ = "users"
    __table_args__ = {"extend_existing": True}

    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)

    spotify_user_id = Column(String(100), unique=True, nullable=True)
    spotify_access_token = Column(Text, nullable=True)
    spotify_refresh_token = Column(Text, nullable=True)
    spotify_token_expires_at = Column(DateTime, nullable=True)

    conversations = relationship(
        "Conversation",
        back_populates="user",
        cascade="all, delete-orphan"
    )
