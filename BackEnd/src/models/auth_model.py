from sqlalchemy import Column, Integer, String, Text, DateTime
from src.config.db import Base
from sqlalchemy.orm import relationship

class User(Base):
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

    conversations = relationship("Conversation", back_populates="user", cascade="all, delete-orphan")

