import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, AsyncMock, ANY


# --- Test: Iniciar chat ---
def test_start_chat(client):
    with patch("src.controllers.chat_controller.start_conversation") as mock_start:
        mock_start.return_value = {"chat_id": 123, "message": "Chat started"}

        response = client.post("/chat/start")

        assert response.status_code == 200
        assert response.json() == {"chat_id": 123, "message": "Chat started"}
        mock_start.assert_called_once()


# --- Test: Enviar mensaje autorizado ---
def test_send_message_authorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get, \
         patch("src.controllers.chat_controller.handle_message", new_callable=AsyncMock) as mock_handle:

        mock_get.return_value = type("Conversation", (), {"user_id": 1})()
        mock_handle.return_value = {"response": "OK"}

        response = client.post("/chat/1/message", json={"question": "Hola"})

        assert response.status_code == 200
        assert response.json() == {"response": "OK"}
        mock_get.assert_called_once_with('1', ANY)
        mock_handle.assert_awaited_once()


# --- Test: Enviar mensaje no autorizado ---
def test_send_message_unauthorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get:
        mock_get.return_value = type("Conversation", (), {"user_id": 999})()

        response = client.post("/chat/1/message", json={"question": "Hola"})

        assert response.status_code == 403
        assert response.json()["detail"] == "Unauthorized"
        mock_get.assert_called_once_with('1', ANY)


# --- Test: Eliminar chat autorizado ---
def test_delete_chat_authorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get, \
         patch("src.controllers.chat_controller.delete_chat") as mock_delete:

        mock_get.return_value = type("Conversation", (), {"user_id": 1})()
        mock_delete.return_value = {"deleted": True}

        response = client.delete("/chat/1")

        assert response.status_code == 200
        assert response.json() == {"deleted": True}
        mock_get.assert_called_once_with(1, ANY)
        mock_delete.assert_called_once_with(1, ANY)


# --- Test: Eliminar chat no autorizado ---
def test_delete_chat_unauthorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get:
        mock_get.return_value = type("Conversation", (), {"user_id": 999})()

        response = client.delete("/chat/1")

        assert response.status_code == 403
        assert response.json()["detail"] == "Unauthorized"
        mock_get.assert_called_once_with(1, ANY)


# --- Test: Obtener historial autorizado ---
def test_get_history_authorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get, \
         patch("src.controllers.chat_controller.get_history") as mock_history:

        mock_get.return_value = type("Conversation", (), {"user_id": 1})()
        mock_history.return_value = [
            {"role": "user", "content": "Hola", "timestamp": "2024-05-01T10:00:00"},
            {"role": "assistant", "content": "Hola, ¿en qué puedo ayudarte?", "timestamp": "2024-05-01T10:00:01"},
        ]

        response = client.get("/chat/1/history")

        assert response.status_code == 200
        assert response.json() == mock_history.return_value
        mock_get.assert_called_once_with(1, ANY)
        mock_history.assert_called_once_with(1, ANY)


# --- Test: Obtener historial no autorizado ---
def test_get_history_unauthorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get:
        mock_get.return_value = type("Conversation", (), {"user_id": 999})()

        response = client.get("/chat/1/history")

        assert response.status_code == 403
        assert response.json()["detail"] == "Unauthorized"
        mock_get.assert_called_once_with(1, ANY)


# --- Test: Obtener conversaciones de usuario ---
def test_get_user_conversations(client):
    with patch("src.controllers.chat_controller.get_conversations") as mock_get_convs:
        mock_get_convs.return_value = [
            {"id": 1, "created_at": "2024-05-01T10:00:00", "title": "Conversación 1"},
            {"id": 2, "created_at": "2024-05-02T12:00:00", "title": "Conversación 2"}
        ]

        response = client.get("/chat/user")

        assert response.status_code == 200
        assert response.json() == mock_get_convs.return_value
        mock_get_convs.assert_called_once_with("1", ANY)


# --- Test: Renombrar conversación autorizado ---
def test_rename_conversation_authorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get, \
         patch("src.controllers.chat_controller.rename_conversation") as mock_rename:

        mock_get.return_value = type("Conversation", (), {"user_id": 1})()
        mock_rename.return_value = {"message": "Title updated"}

        response = client.put("/chat/1/rename", json="Nuevo título")

        assert response.status_code == 200
        assert response.json() == {"message": "Title updated"}
        mock_get.assert_called_once_with(1, ANY)
        mock_rename.assert_called_once_with(1, "Nuevo título", ANY)


# --- Test: Renombrar conversación no autorizado ---
def test_rename_conversation_unauthorized(client):
    with patch("src.controllers.chat_controller.get_conversation_by_id") as mock_get:
        mock_get.return_value = type("Conversation", (), {"user_id": 999})()

        response = client.put("/chat/1/rename", json="Nuevo título")

        assert response.status_code == 403
        assert response.json()["detail"] == "Unauthorized"
        mock_get.assert_called_once_with(1, ANY)
