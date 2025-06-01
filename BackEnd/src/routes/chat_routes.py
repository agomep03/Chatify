from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from src.controllers.auth_controller import get_db, get_current_user
from src.models.auth_model import User
from src.schemas.chat_schemas import ChatRequest
from src.controllers.chat_controller import (
    start_conversation,
    get_conversation_by_id,
    handle_message,
    delete_chat,
    get_history,
    get_conversations,
    rename_conversation
)

router = APIRouter()

@router.post("/start")
async def start_chat(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Inicia una nueva conversación para el usuario autenticado.

    Returns:
        dict: Detalles de la conversación creada.
    """
    user_id = str(current_user.id)
    logger.info(f"[POST /chat/start] Iniciando nueva conversación para user_id={current_user.id}")
    return await start_conversation(user_id, db)

@router.post("/{chat_id}/message")
async def send_message(
    chat_id: int,
    body: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Envía un mensaje a una conversación existente.

    Args:
        chat_id (int): ID de la conversación.
        body (ChatRequest): Mensaje y modo de la consulta.
        current_user (User): Usuario autenticado.
        db (Session): Sesión de base de datos.

    Returns:
        dict: Respuesta del chatbot.
    """
    logger.info(f"[POST /chat/{chat_id}/message] Usuario ID {current_user.id} envía mensaje")
    conversation = get_conversation_by_id(chat_id, db)

    if not conversation or conversation.user_id != current_user.id:
        logger.warning(f"[POST /chat/{chat_id}/message] Acceso denegado para user_id={current_user.id}")
        raise HTTPException(status_code=403, detail="Unauthorized")

    return await handle_message(chat_id, body.question, current_user, db, mode=body.mode)

@router.delete("/{chat_id}")
def delete_chat_route(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Elimina una conversación específica y todos sus mensajes.

    Args:
        chat_id (int): ID de la conversación.

    Returns:
        dict: Resultado de la operación.
    """
    logger.info(f"[DELETE /chat/{chat_id}] Usuario ID {current_user.id} solicita eliminar chat")
    conversation = get_conversation_by_id(chat_id, db)

    if not conversation or conversation.user_id != current_user.id:
        logger.warning(f"[DELETE /chat/{chat_id}] Acceso denegado para user_id={current_user.id}")
        raise HTTPException(status_code=403, detail="Unauthorized")

    return delete_chat(chat_id, db)

@router.get("/{chat_id}/history")
def get_history_route(
    chat_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene el historial de mensajes de una conversación específica.

    Args:
        chat_id (int): ID de la conversación.

    Returns:
        list: Lista de mensajes.
    """
    logger.info(f"[GET /chat/{chat_id}/history] Obteniendo historial para user_id={current_user.id}")
    conversation = get_conversation_by_id(chat_id, db)

    if not conversation or conversation.user_id != current_user.id:
        logger.warning(f"[GET /chat/{chat_id}/history] Acceso denegado para user_id={current_user.id}")
        raise HTTPException(status_code=403, detail="Unauthorized")

    return get_history(chat_id, db)

@router.get("/user")
def get_conversations_route(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las conversaciones del usuario autenticado.

    Returns:
        list: Lista de conversaciones.
    """
    user_id = str(current_user.id)
    logger.info(f"[GET /chat/user] Obteniendo todas las conversaciones para user_id={current_user.id}")
    return get_conversations(user_id, db)

@router.put("/{chat_id}/rename")
def rename_conversation_route(
    chat_id: int,
    new_title: str = Body(..., embed=True),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Cambia el nombre (título) de una conversación existente.

    Args:
        chat_id (int): ID de la conversación.
        new_title (str): Nuevo título deseado.

    Returns:
        dict: Detalles de la conversación actualizada.
    """
    logger.info(f"[PUT /chat/{chat_id}/rename] Renombrando conversación a '{new_title}' para user_id={current_user.id}")
    conversation = get_conversation_by_id(chat_id, db)

    if not conversation or conversation.user_id != current_user.id:
        logger.warning(f"[PUT /chat/{chat_id}/rename] Acceso denegado para user_id={current_user.id}")
        raise HTTPException(status_code=403, detail="Unauthorized")

    return rename_conversation(chat_id, new_title, db)
