"""
Modelo ORM para los mensajes dentro de una conversación.

Define la estructura de la tabla `messages`, que almacena los mensajes
individuales generados por el usuario o el sistema durante una conversación.
"""

from datetime import datetime

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship

from src.config.db import Base


class Message(Base):
    """
    Modelo que representa un mensaje dentro de una conversación.

    Atributos:
        id (int): Identificador único del mensaje.
        conversation_id (int): ID de la conversación a la que pertenece.
        role (str): Rol del emisor (por ejemplo, "user" o "assistant").
        content (str): Contenido textual del mensaje.
        created_at (datetime): Fecha y hora de creación del mensaje.

        conversation (Conversation): Relación con la conversación padre.
    """

    __tablename__ = 'messages'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey('conversations.id', ondelete="CASCADE"))
    role = Column(String)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship("Conversation", back_populates="messages")

    def __repr__(self):
        """
        Representación en cadena del objeto Message.
        """
        return f"<Message id={self.id} role={self.role}>"
