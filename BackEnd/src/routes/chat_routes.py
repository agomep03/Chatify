from fastapi import APIRouter, Query, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from src.controllers import chat_controller
from src.controllers.auth_controller import get_db, get_current_user
from src.models.auth_model import User

router = APIRouter()

@router.post("/start")
async def start_chat(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Inicia una nueva conversación para un usuario específico.
    """
    user_id = str(current_user.id)
    return await chat_controller.start_conversation(user_id, db)

@router.post("/{chat_id}/message")
async def send_message(chat_id: int, question: str = Body(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Envía un mensaje a una conversación existente.
    """
    conversation = chat_controller.get_conversation_by_id(str(chat_id), db)

    if not conversation or str(conversation.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Unauthorized")
    return await chat_controller.handle_message(chat_id, question, db)

@router.delete("/{chat_id}")
def delete_chat(chat_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Elimina una conversación y sus mensajes asociados.
    """
    conversation = chat_controller.get_conversation_by_id(chat_id, db)

    if not conversation or str(conversation.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Unauthorized")
    return chat_controller.delete_chat(chat_id, db)

@router.get("/{chat_id}/history")
def get_history(chat_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Obtiene el historial de mensajes de una conversación.
    """
    conversation = chat_controller.get_conversation_by_id(chat_id, db)

    if not conversation or str(conversation.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Unauthorized")
    return chat_controller.get_history(chat_id, db)

@router.get("/user")
def get_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Obtiene todas las conversaciones de un usuario.
    """
    user_id = str(current_user.id)
    return chat_controller.get_conversations(user_id, db)

@router.put("/{chat_id}/rename")
def rename_conversation(chat_id: int, new_title: str = Body(...), current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    Cambia el título de una conversación existente.
    """
    conversation = chat_controller.get_conversation_by_id(chat_id, db)

    if not conversation or str(conversation.user_id) != str(current_user.id):
        raise HTTPException(status_code=403, detail="Unauthorized")
    return chat_controller.rename_conversation(chat_id, new_title, db)
