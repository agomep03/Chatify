"""
Modelo ORM para las conversaciones de los usuarios.

Define la estructura de la tabla `conversations`, incluyendo relaciones
con los usuarios y mensajes.
"""

from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from src.config.db import Base


class Conversation(Base):
    """
    Modelo que representa una conversación iniciada por un usuario.

    Atributos:
        id (int): Identificador único de la conversación.
        user_id (int): ID del usuario propietario (clave foránea).
        created_at (datetime): Fecha de creación de la conversación.
        title (str): Título auto-generado con la fecha actual.

        messages (list): Lista de mensajes asociados.
        user (User): Relación con el modelo de usuario.
    """

    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    title = Column(String, default=lambda: "Conversación " + datetime.utcnow().strftime("%d/%m/%Y %H:%M"))

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    user = relationship("User", back_populates="conversations")

    def __repr__(self):
        """
        Representación en cadena del objeto Conversation.
        """
        return f"<Conversation id={self.id} user_id={self.user_id}>"
