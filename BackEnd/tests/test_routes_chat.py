import pytest
from fastapi.testclient import TestClient
from fastapi import status, HTTPException
from unittest.mock import patch, ANY
from unittest.mock import AsyncMock, patch

def test_start_chat(client):
    with patch("src.controllers.chat_controller.start_conversation") as mock_start_conversation:
        mock_start_conversation.return_value = {"chat_id": 123, "message": "Chat started"}

        response = client.post("/chat/start")
        assert response.status_code == 200
        json_data = response.json()
        assert "chat_id" in json_data
        assert json_data["chat_id"] == 123

        mock_start_conversation.assert_called_once()

def test_send_message_authorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get_conversation, \
         patch("src.controllers.chat_controller.handle_message", new_callable=AsyncMock) as mock_handle_message:

        mock_get_conversation.return_value = type("Conversation", (), {"user_id": 1})()
        mock_handle_message.return_value = {"response": "OK"}

        response = client.post("/chat/1/message", json={"question": "Hola"})

        assert response.status_code == 200
        assert response.json() == {"response": "OK"}

        mock_get_conversation.assert_called_once_with('1', ANY)
        mock_handle_message.assert_awaited_once()

def test_send_message_unauthorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get_conversation:
        mock_get_conversation.return_value = type("Conversation", (), {"user_id": 999})()

        response = client.post("/chat/1/message", json={"question": "Hola"})
        assert response.status_code == 403
        assert response.json()["detail"] == "Unauthorized"

        mock_get_conversation.assert_called_once_with('1', ANY)


def test_delete_chat_authorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get_conversation, \
         patch("src.controllers.chat_controller.delete_chat") as mock_delete_chat:

        mock_get_conversation.return_value = type("Conversation", (), {"user_id": 1})()
        mock_delete_chat.return_value = {"deleted": True}

        response = client.delete("/chat/1")

        assert response.status_code == 200
        assert response.json() == {"deleted": True}

        mock_get_conversation.assert_called_once_with(1, ANY)  # Usamos 1 (entero)
        mock_delete_chat.assert_called_once_with(1, ANY)

def test_delete_chat_unauthorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get_conversation:
        mock_get_conversation.return_value = type("Conversation", (), {"user_id": 999})()

        response = client.delete("/chat/1")

        assert response.status_code == 403
        assert response.json()["detail"] == "Unauthorized"

        mock_get_conversation.assert_called_once_with(1, ANY)

def test_get_history_authorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get_conversation, \
         patch("src.controllers.chat_controller.get_history") as mock_get_history:

        mock_get_conversation.return_value = type("Conversation", (), {"user_id": 1})()
        mock_get_history.return_value = [
            {"role": "user", "content": "Hola", "timestamp": "2024-05-01T10:00:00"},
            {"role": "assistant", "content": "Hola, ¿en qué puedo ayudarte?", "timestamp": "2024-05-01T10:00:01"},
        ]

        response = client.get("/chat/1/history")

        assert response.status_code == 200
        assert response.json() == mock_get_history.return_value
        mock_get_conversation.assert_called_once_with(1, ANY)  # <- aquí el cambio
        mock_get_history.assert_called_once_with(1, ANY)


def test_get_history_unauthorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get_conversation:
        mock_get_conversation.return_value = type("Conversation", (), {"user_id": 999})()

        response = client.get("/chat/1/history")

        assert response.status_code == 403
        assert response.json()["detail"] == "Unauthorized"
        mock_get_conversation.assert_called_once_with(1, ANY)  # <- aquí también

def test_get_user_conversations(client):
    with patch("src.controllers.chat_controller.get_conversations") as mock_get_conversations:
        mock_get_conversations.return_value = [
            {"id": 1, "created_at": "2024-05-01T10:00:00", "title": "Conversación 1"},
            {"id": 2, "created_at": "2024-05-02T12:00:00", "title": "Conversación 2"}
        ]

        response = client.get("/chat/user")

        assert response.status_code == 200
        assert response.json() == mock_get_conversations.return_value
        mock_get_conversations.assert_called_once_with("1", ANY)

def test_rename_conversation_authorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get_conversation, \
         patch("src.controllers.chat_controller.rename_conversation") as mock_rename_conversation:

        mock_get_conversation.return_value = type("Conversation", (), {"user_id": 1})()
        mock_rename_conversation.return_value = {"message": "Title updated"}

        response = client.put("/chat/1/rename", json="Nuevo título")

        assert response.status_code == 200
        assert response.json() == {"message": "Title updated"}

        mock_get_conversation.assert_called_once_with(1, ANY)
        mock_rename_conversation.assert_called_once_with(1, "Nuevo título", ANY)

def test_rename_conversation_unauthorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get_conversation:
        mock_get_conversation.return_value = type("Conversation", (), {"user_id": 999})()  # Usuario distinto

        response = client.put("/chat/1/rename", json="Nuevo título")

        assert response.status_code == 403
        assert response.json()["detail"] == "Unauthorized"
        mock_get_conversation.assert_called_once_with(1, ANY)

