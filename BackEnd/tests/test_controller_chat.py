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


# ------------------- START CONVERSATION -------------------

@pytest.mark.asyncio
async def test_start_conversation_creates_and_returns_id(db_session):
    assert db_session.query(Conversation).count() == 0

    result = await start_conversation("user1", db_session)
    assert isinstance(result, dict)
    assert "chat_id" in result

    chat_id = result["chat_id"]
    conv = db_session.query(Conversation).filter(Conversation.id == chat_id).first()
    assert conv is not None
    assert conv.user_id == "user1"

def test_get_conversation_by_id_returns_none_when_not_exists(db_session):
    conv = get_conversation_by_id(9999, db_session)
    assert conv is None

@pytest.mark.asyncio
async def test_start_conversation_error_raises_http_exception(db_session, monkeypatch):
    def fake_add(obj):
        raise Exception("Simulated DB failure")

    monkeypatch.setattr(db_session, "add", fake_add)

    with pytest.raises(HTTPException) as exc_info:
        await start_conversation("user_error", db_session)

    assert exc_info.value.status_code == 500
    assert "Error creationg conversation" in exc_info.value.detail


# ------------------- SAVE MESSAGE -------------------

@pytest.mark.asyncio
async def test_save_message_success(db_session):
    chat_id = 1
    conversation = Conversation(id=chat_id, user_id="1")
    db_session.add(conversation)
    db_session.commit()

    result = await save_message(chat_id=chat_id, role="user", content="Hola", db=db_session)

    assert isinstance(result, Message)
    assert result.content == "Hola"
    assert result.role == "user"
    assert result.conversation_id == chat_id

    stored = db_session.query(Message).filter_by(id=result.id).first()
    assert stored is not None


# ------------------- HANDLE MESSAGE -------------------

@pytest.mark.asyncio
async def test_handle_message_success(db_session, authenticated_user):
    conversation = Conversation(user_id=authenticated_user.id)
    db_session.add(conversation)
    db_session.commit()

    with patch("src.controllers.chat_controller.agent.chat", new_callable=AsyncMock) as mock_chat, \
         patch("src.controllers.chat_controller.get_user_full_top_info") as mock_top_info, \
         patch("src.controllers.chat_controller.save_message", new_callable=AsyncMock) as mock_save:

        mock_chat.return_value = "respuesta generada"
        mock_top_info.return_value = {
            "top_artists": {"semanal": ["A1"], "seis_meses": ["A2"], "todo_el_tiempo": ["A3"]},
            "top_tracks": {"semanal": ["T1"], "seis_meses": ["T2"], "todo_el_tiempo": ["T3"]},
            "top_genres": {"semanal": ["G1"], "seis_meses": ["G2"], "todo_el_tiempo": ["G3"]}
        }

        result = await handle_message(conversation.id, "¿Cuál es tu canción favorita?", authenticated_user, db_session)

        assert result["answer"] == "respuesta generada"
        assert isinstance(result["title_changed"], bool)
        mock_chat.assert_called()
        mock_save.assert_awaited()

@pytest.mark.asyncio
async def test_handle_message_not_found(db_session, authenticated_user):
    with pytest.raises(HTTPException) as exc_info:
        await handle_message(999, "Hola", authenticated_user, db_session)

    assert exc_info.value.status_code == 404
    assert "Conversation not found" in exc_info.value.detail

@pytest.mark.asyncio
async def test_handle_message_ia_error(db_session, authenticated_user):
    conversation = Conversation(user_id=authenticated_user.id)
    db_session.add(conversation)
    db_session.commit()

    with patch("src.controllers.chat_controller.agent.chat", new_callable=AsyncMock) as mock_chat, \
         patch("src.controllers.chat_controller.get_user_full_top_info") as mock_top_info:

        mock_chat.side_effect = Exception("IA no responde")
        mock_top_info.return_value = {
            "top_artists": {"semanal": [], "seis_meses": [], "todo_el_tiempo": []},
            "top_tracks": {"semanal": [], "seis_meses": [], "todo_el_tiempo": []},
            "top_genres": {"semanal": [], "seis_meses": [], "todo_el_tiempo": []},
        }

        with pytest.raises(HTTPException) as exc_info:
            await handle_message(conversation.id, "Hola", authenticated_user, db_session)

        assert exc_info.value.status_code == 500
        assert "Error creating the answer" in exc_info.value.detail


# ------------------- GET HISTORY -------------------

def test_get_history_returns_ordered_messages(db_session):
    conversation = Conversation(user_id=1)
    db_session.add(conversation)
    db_session.commit()

    m1 = Message(conversation_id=conversation.id, role="user", content="Primero", created_at=datetime.utcnow() - timedelta(minutes=2))
    m2 = Message(conversation_id=conversation.id, role="assistant", content="Segundo", created_at=datetime.utcnow() - timedelta(minutes=1))
    m3 = Message(conversation_id=conversation.id, role="user", content="Tercero", created_at=datetime.utcnow())
    db_session.add_all([m1, m2, m3])
    db_session.commit()

    history = get_history(conversation.id, db_session)

    assert len(history) == 3
    assert history[0]["content"] == "Primero"
    assert history[1]["content"] == "Segundo"
    assert history[2]["content"] == "Tercero"


# ------------------- DELETE CHAT -------------------

def test_delete_chat_success(db_session):
    conversation = Conversation(user_id=1)
    db_session.add(conversation)
    db_session.commit()

    message = Message(conversation_id=conversation.id, role="user", content="Hola")
    db_session.add(message)
    db_session.commit()

    assert db_session.query(Conversation).filter_by(id=conversation.id).first() is not None
    assert db_session.query(Message).filter_by(conversation_id=conversation.id).count() == 1

    result = delete_chat(conversation.id, db_session)

    assert result == {"message": "Conversation deleted"}
    assert db_session.query(Conversation).filter_by(id=conversation.id).first() is None
    assert db_session.query(Message).filter_by(conversation_id=conversation.id).count() == 0

def test_delete_chat_not_found_raises(db_session):
    with pytest.raises(HTTPException) as exc_info:
        delete_chat(chat_id=999, db=db_session)

    assert exc_info.value.status_code == 404
    assert "Conversation not found" in exc_info.value.detail


# ------------------- GET CONVERSATIONS -------------------

def test_get_conversations_returns_ordered_list(db_session):
    c1 = Conversation(user_id=1, created_at=datetime.utcnow() - timedelta(days=2), title="Primera")
    c2 = Conversation(user_id=1, created_at=datetime.utcnow() - timedelta(days=1), title="Segunda")
    c3 = Conversation(user_id=1, created_at=datetime.utcnow(), title="Tercera")

    db_session.add_all([c1, c2, c3])
    db_session.commit()

    result = get_conversations(user_id="1", db=db_session)

    assert len(result) == 3
    assert result[0]["title"] == "Tercera"
    assert result[1]["title"] == "Segunda"
    assert result[2]["title"] == "Primera"

    for conv in result:
        assert "id" in conv
        assert "created_at" in conv
        assert "title" in conv


# ------------------- RENAME CONVERSATION -------------------

def test_rename_conversation_success(db_session):
    conversation = Conversation(user_id=1, title="Título viejo")
    db_session.add(conversation)
    db_session.commit()

    result = rename_conversation(conversation.id, "Nuevo título", db_session)

    assert result == {"message": "Title updated"}

    updated = db_session.query(Conversation).filter_by(id=conversation.id).first()
    assert updated.title == "Nuevo título"

def test_rename_conversation_not_found(db_session):
    with pytest.raises(HTTPException) as exc_info:
        rename_conversation(9999, "Nuevo título", db_session)

    assert exc_info.value.status_code == 404
    assert "Conversation not found" in exc_info.value.detail
