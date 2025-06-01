import pytest
from datetime import datetime, timedelta
from fastapi import HTTPException
from unittest.mock import AsyncMock, patch

from src.controllers.chat_controller import (
    get_conversation_by_id,
    start_conversation,
    save_message,
    handle_message,
    get_history,
    delete_chat,
    get_conversations,
    rename_conversation,
)
from src.models.conversation_model import Conversation
from src.models.message_model import Message


# --- Test: Crear conversación correctamente ---
@pytest.mark.asyncio
async def test_start_conversation_creates_chat(db_session):
    result = await start_conversation("user1", db_session)
    assert "chat_id" in result
    chat = db_session.query(Conversation).filter_by(id=result["chat_id"]).first()
    assert chat and chat.user_id == "user1"


# --- Test: Error al crear conversación (fallo DB) ---
@pytest.mark.asyncio
async def test_start_conversation_db_error_raises_http(db_session, monkeypatch):
    monkeypatch.setattr(db_session, "add", lambda _: (_ for _ in ()).throw(Exception("DB fail")))
    with pytest.raises(HTTPException) as exc:
        await start_conversation("fail_user", db_session)
    assert exc.value.status_code == 500


# --- Test: Obtener conversación inexistente retorna None ---
def test_get_conversation_by_id_not_found(db_session):
    assert get_conversation_by_id(9999, db_session) is None


# --- Test: Guardar mensaje correctamente ---
@pytest.mark.asyncio
async def test_save_message_success(db_session):
    conv = Conversation(user_id="1")
    db_session.add(conv)
    db_session.commit()
    msg = await save_message(chat_id=conv.id, role="user", content="Hola", db=db_session)
    assert msg.content == "Hola" and msg.role == "user"


# --- Test: Mensaje manejado correctamente ---
@pytest.mark.asyncio
async def test_handle_message_success(db_session, authenticated_user):
    conv = Conversation(user_id=authenticated_user.id)
    db_session.add(conv)
    db_session.commit()
    with patch("src.controllers.chat_controller.agent.chat", new_callable=AsyncMock) as mock_chat, \
         patch("src.controllers.chat_controller.get_user_full_top_info") as mock_info, \
         patch("src.controllers.chat_controller.save_message", new_callable=AsyncMock) as mock_save:
        mock_chat.return_value = "respuesta generada"
        mock_info.return_value = {
            "top_artists": {
                "semanal": ["A"], "seis_meses": ["A2"], "todo_el_tiempo": ["A3"]
            },
            "top_tracks": {
                "semanal": ["T"], "seis_meses": ["T2"], "todo_el_tiempo": ["T3"]
            },
            "top_genres": {
                "semanal": ["G"], "seis_meses": ["G2"], "todo_el_tiempo": ["G3"]
            }
        }
        result = await handle_message(conv.id, "Hola", authenticated_user, db_session)
        assert result["answer"] == "respuesta generada"


# --- Test: Error si conversación no existe al manejar mensaje ---
@pytest.mark.asyncio
async def test_handle_message_not_found(db_session, authenticated_user):
    with pytest.raises(HTTPException) as exc:
        await handle_message(9999, "Hola", authenticated_user, db_session)
    assert exc.value.status_code == 404


# --- Test: Error de IA al manejar mensaje ---
@pytest.mark.asyncio
async def test_handle_message_ia_error(db_session, authenticated_user):
    conv = Conversation(user_id=authenticated_user.id)
    db_session.add(conv)
    db_session.commit()
    with patch("src.controllers.chat_controller.agent.chat", new_callable=AsyncMock) as mock_chat, \
         patch("src.controllers.chat_controller.get_user_full_top_info") as mock_info:
        mock_chat.side_effect = Exception("Fallo IA")
        mock_info.return_value = {
            "top_artists": {
                "semanal": [], "seis_meses": [], "todo_el_tiempo": []
            },
            "top_tracks": {
                "semanal": [], "seis_meses": [], "todo_el_tiempo": []
            },
            "top_genres": {
                "semanal": [], "seis_meses": [], "todo_el_tiempo": []
            }
        }
        with pytest.raises(HTTPException) as exc:
            await handle_message(conv.id, "Hola", authenticated_user, db_session)
        assert exc.value.status_code == 500


# --- Test: Obtener historial ordenado por fecha ---
def test_get_history_returns_ordered_messages(db_session):
    conv = Conversation(user_id=1)
    db_session.add(conv)
    db_session.commit()
    db_session.add_all([
        Message(conversation_id=conv.id, role="user", content="1", created_at=datetime.utcnow() - timedelta(minutes=2)),
        Message(conversation_id=conv.id, role="assistant", content="2", created_at=datetime.utcnow() - timedelta(minutes=1)),
        Message(conversation_id=conv.id, role="user", content="3", created_at=datetime.utcnow())
    ])
    db_session.commit()
    history = get_history(conv.id, db_session)
    assert [m["content"] for m in history] == ["1", "2", "3"]


# --- Test: Eliminar conversación correctamente ---
def test_delete_chat_success(db_session):
    conv = Conversation(user_id=1)
    db_session.add(conv)
    db_session.commit()
    db_session.add(Message(conversation_id=conv.id, role="user", content="Hola"))
    db_session.commit()
    result = delete_chat(conv.id, db_session)
    assert result["message"] == "Conversation deleted"
    assert db_session.query(Conversation).filter_by(id=conv.id).first() is None


# --- Test: Error al eliminar conversación inexistente ---
def test_delete_chat_not_found_raises(db_session):
    with pytest.raises(HTTPException) as exc:
        delete_chat(999, db_session)
    assert exc.value.status_code == 404


# --- Test: Obtener conversaciones ordenadas por fecha ---
def test_get_conversations_returns_ordered_list(db_session):
    db_session.add_all([
        Conversation(user_id=1, created_at=datetime.utcnow() - timedelta(days=2), title="Primera"),
        Conversation(user_id=1, created_at=datetime.utcnow() - timedelta(days=1), title="Segunda"),
        Conversation(user_id=1, created_at=datetime.utcnow(), title="Tercera")
    ])
    db_session.commit()
    result = get_conversations(user_id="1", db=db_session)
    assert [c["title"] for c in result] == ["Tercera", "Segunda", "Primera"]


# --- Test: Renombrar conversación correctamente ---
def test_rename_conversation_success(db_session):
    conv = Conversation(user_id=1, title="Antiguo")
    db_session.add(conv)
    db_session.commit()
    result = rename_conversation(conv.id, "Nuevo", db_session)
    assert result["message"] == "Title updated"
    assert db_session.get(Conversation, conv.id).title == "Nuevo"


# --- Test: Error al renombrar conversación inexistente ---
def test_rename_conversation_not_found(db_session):
    with pytest.raises(HTTPException) as exc:
        rename_conversation(9999, "Nuevo", db_session)
    assert exc.value.status_code == 404
