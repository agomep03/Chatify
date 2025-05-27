import logging
from fastapi import HTTPException
from sqlalchemy.orm import Session
from src.services.chatIA_service import Agent
from src.models.conversation_model import Conversation
from src.models.message_model import Message

logger = logging.getLogger(__name__)
agent = Agent()



def get_conversation_by_id(chat_id: int, db: Session):
    return db.query(Conversation).filter(Conversation.id == chat_id).first()

async def start_conversation(user_id: str, db: Session):
    logger.info(f"Start conversation for user with id {user_id}")
    try:
        Conversation.__table__.create(bind=db.get_bind(), checkfirst=True)

        new_conversation = Conversation(user_id=user_id)
        db.add(new_conversation)
        db.commit()
        db.refresh(new_conversation)
        logger.info(f"Conversation created with id {new_conversation.id}")
        return {"chat_id": new_conversation.id}
    except Exception as e:
        logger.error(f"Error creating conversation for user with {user_id}: {e}")
        raise HTTPException(status_code=500, detail="Error creationg conversation")

async def save_message(chat_id: int, role: str, content: str, db: Session):
    logger.info(f"Save message for conversation {chat_id}")
    try:
        new_message = Message(conversation_id=chat_id, role=role, content=content)
        db.add(new_message)
        db.commit()
        db.refresh(new_message)
        logger.info(f"Message saved with id {new_message.id}")
        return new_message
    except Exception as e:
        logger.error(f"Error saving message for conversation {chat_id}: {e}")
        raise HTTPException(status_code=500, detail="Error saving the message")

async def handle_message(chat_id: int, question: str, db: Session):
    conversation = db.query(Conversation).filter(Conversation.id == chat_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    history = [{"role": msg.role, "content": msg.content} for msg in conversation.messages]
    try:
        answer = await agent.chat(question, history)
    except Exception as e:
        logger.error(f"Error creating the answer: {e}")
        raise HTTPException(status_code=500, detail="Error creating the answer")

    await save_message(chat_id, "user", question, db)
    await save_message(chat_id, "assistant", answer, db)

    return {"answer": answer}


def get_history(chat_id: int, db: Session):
    messages = db.query(Message).filter(Message.conversation_id == chat_id).order_by(Message.created_at).all()
    return [{"role": m.role, "content": m.content, "timestamp": m.created_at} for m in messages]

def delete_chat(chat_id: int, db: Session):
    conversation = db.query(Conversation).filter(Conversation.id == chat_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.query(Message).filter(Message.conversation_id == chat_id).delete()
    db.delete(conversation)
    db.commit()
    return {"message": "Conversation deleted"}

def get_conversations(user_id: str, db: Session):
    conversations = db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.created_at.desc()).all()
    return [{"id": c.id, "created_at": c.created_at, "title": getattr(c, "title", "Sin título")} for c in conversations]

def rename_conversation(chat_id: int, new_title: str, db: Session):
    conversation = db.query(Conversation).filter(Conversation.id == chat_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conversation.title = new_title
    db.commit()
    db.refresh(conversation)
    return {"message": "Title updated"}
