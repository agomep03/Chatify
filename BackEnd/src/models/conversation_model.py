from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from src.config.db import Base

class Conversation(Base):
    __tablename__ = 'conversations'
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete="CASCADE"))
    created_at = Column(DateTime, default=datetime.utcnow)
    title = Column(String, default=lambda: "Conversación " + datetime.utcnow().strftime("%d/%m/%Y %H:%M"))

    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")
    user = relationship("User", back_populates="conversations")

    def __repr__(self):
        return f"<Conversation id={self.id} user_id={self.user_id}>"