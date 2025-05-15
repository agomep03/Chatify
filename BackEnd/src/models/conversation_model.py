from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from src.config.db import Base

class Conversation(Base):
    __tablename__ = 'conversations'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    title = Column(String, default="Sin título")

    messages = relationship("Message", back_populates="conversation")

    def __repr__(self):
        return f"<Conversation id={self.id} user_id={self.user_id}>"
