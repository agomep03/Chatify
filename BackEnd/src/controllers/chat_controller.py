import logging
import re
from fastapi import HTTPException
from sqlalchemy.orm import Session

from src.services.chatIA_service import Agent
from src.models.auth_model import User
from src.models.conversation_model import Conversation
from src.models.message_model import Message
from src.controllers.spotify_controller import get_user_full_top_info

logger = logging.getLogger(__name__)
agent = Agent()


def get_conversation_by_id(chat_id: int, db: Session):
    """Recupera una conversación por su ID."""
    return db.query(Conversation).filter(Conversation.id == chat_id).first()


async def start_conversation(user_id: str, db: Session):
    """Crea una nueva conversación para el usuario especificado."""
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
        raise HTTPException(status_code=500, detail="Error creating conversation")


async def save_message(chat_id: int, role: str, content: str, db: Session):
    """Guarda un mensaje en la conversación correspondiente."""
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


async def generate_conversation_title(history: list[dict]) -> str:
    """Genera un título breve para una conversación, si hay suficiente contexto."""
    agent_temp = Agent()
    prompt = (
        "Dada la siguiente conversación de música, sugiere un título muy breve en español. "
        "No me digas nada más.\n"
        "Si no hay suficiente contexto, responde SOLO con 'NO_TITULO'.\n\n"
        "Conversación:\n"
        + "".join(f"{msg['role']}: {msg['content']}\n" for msg in history)
        + "\nTítulo:"
    )
    return await agent_temp.chat(prompt, [])


async def handle_message(chat_id: int, question: str, user: User, db: Session, mode: str = "normal"):
    """Procesa un mensaje del usuario, genera una respuesta y guarda el historial."""
    conversation = db.query(Conversation).filter(Conversation.id == chat_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    history = [
        {"role": msg.role, "content": msg.content}
        for msg in db.query(Message)
            .filter(Message.conversation_id == chat_id)
            .order_by(Message.created_at.desc())
            .limit(5)
            .all()
    ][::-1]

    top_info = get_user_full_top_info(user, db)

    def format_top_info(title: str, data: dict) -> str:
        return (
            f"{title} esta semana: {', '.join(data['semanal'])}.\n"
            f"{title} en los últimos 6 meses: {', '.join(data['seis_meses'])}.\n"
            f"{title} en todo el tiempo: {', '.join(data['todo_el_tiempo'])}."
        )

    extra_context = (
        format_top_info("Top artistas", top_info["top_artists"]) + "\n\n" +
        format_top_info("Top canciones", top_info["top_tracks"]) + "\n\n" +
        format_top_info("Top géneros", top_info["top_genres"])
    )

    try:
        answer = await agent.chat(question, history, mode=mode, extra_context=extra_context)
    except Exception as e:
        logger.error(f"Error creating the answer: {e}")
        raise HTTPException(status_code=500, detail="Error creating the answer")

    await save_message(chat_id, "user", question, db)
    await save_message(chat_id, "assistant", answer, db)

    default_title_pattern = r"^Conversación \d{2}/\d{2}/\d{4} \d{2}:\d{2}$"
    title_changed = False

    if conversation.title and re.match(default_title_pattern, conversation.title):
        try:
            generated_title = await generate_conversation_title(history + [{"role": "user", "content": question}])
            if generated_title and "NO_TITULO" not in generated_title.upper():
                conversation.title = generated_title.strip()
                db.commit()
                db.refresh(conversation)
                title_changed = True
        except Exception as e:
            logger.error(f"Error generando título automático: {e}")

    return {"answer": answer, "title_changed": title_changed}


def get_history(chat_id: int, db: Session):
    """Devuelve el historial completo de mensajes de una conversación."""
    messages = db.query(Message).filter(Message.conversation_id == chat_id).order_by(Message.created_at).all()
    return [{"role": m.role, "content": m.content, "timestamp": m.created_at} for m in messages]


def delete_chat(chat_id: int, db: Session):
    """Elimina una conversación y todos sus mensajes."""
    conversation = db.query(Conversation).filter(Conversation.id == chat_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    db.query(Message).filter(Message.conversation_id == chat_id).delete()
    db.delete(conversation)
    db.commit()
    logger.info(f"Conversation {chat_id} deleted")
    return {"message": "Conversation deleted"}


def get_conversations(user_id: str, db: Session):
    """Obtiene todas las conversaciones de un usuario ordenadas por fecha."""
    conversations = db.query(Conversation).filter(Conversation.user_id == user_id).order_by(Conversation.created_at.desc()).all()
    return [{"id": c.id, "created_at": c.created_at, "title": getattr(c, "title", "Sin título")} for c in conversations]


def rename_conversation(chat_id: int, new_title: str, db: Session):
    """Actualiza el título de una conversación."""
    conversation = db.query(Conversation).filter(Conversation.id == chat_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    conversation.title = new_title
    db.commit()
    db.refresh(conversation)
    logger.info(f"Conversation {chat_id} renamed to '{new_title}'")
    return {"message": "Title updated"}
