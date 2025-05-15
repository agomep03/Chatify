from fastapi import APIRouter, Query, Body, Depends
from sqlalchemy.orm import Session
from src.controllers import chat_controller
from src.controllers.auth_controller import get_db

router = APIRouter()

@router.post("/start")
async def start_chat(user_id: str, db: Session = Depends(get_db)):
    """
    Inicia una nueva conversación para un usuario específico.
    """
    return await chat_controller.start_conversation(user_id, db)

@router.post("/{chat_id}/message")
async def send_message(chat_id: int, question: str = Body(...), db: Session = Depends(get_db)):
    """
    Envía un mensaje a una conversación existente.
    """
    return await chat_controller.handle_message(chat_id, question, db)

@router.post("/ask-music-question/")
async def ask_music_question_endpoint(question: str = Query(...)):
    return await chat_controller.ask_music_question(question)

@router.delete("/{chat_id}")
def delete_chat(chat_id: int, db: Session = Depends(get_db)):
    """
    Elimina una conversación y sus mensajes asociados.
    """
    return chat_controller.delete_chat(chat_id, db)

@router.get("/{chat_id}/history")
def get_history(chat_id: int, db: Session = Depends(get_db)):
    """
    Obtiene el historial de mensajes de una conversación.
    """
    return chat_controller.get_history(chat_id, db)

@router.get("/user/{user_id}")
def get_conversations(user_id: str, db: Session = Depends(get_db)):
    """
    Obtiene todas las conversaciones de un usuario.
    """
    return chat_controller.get_conversations(user_id, db)

@router.put("/{chat_id}/rename")
def rename_conversation(chat_id: int, new_title: str = Body(...), db: Session = Depends(get_db)):
    """
    Cambia el título de una conversación existente.
    """
    return chat_controller.rename_conversation(chat_id, new_title, db)
