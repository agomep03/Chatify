import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from src.services.chatIA_service import Agent


# --- Test: Respuesta exitosa del agente ---
@pytest.mark.asyncio
async def test_chat_success():
    agent = Agent()

    fake_response_data = {
        "choices": [
            {"message": {"content": "¡Hola! Soy un asistente musical."}}
        ]
    }

    mock_response = MagicMock()
    mock_response.json.return_value = fake_response_data

    mock_client = AsyncMock()
    mock_client.post.return_value = mock_response

    mock_async_client = AsyncMock()
    mock_async_client.__aenter__.return_value = mock_client

    with patch("src.services.chatIA_service.httpx.AsyncClient", return_value=mock_async_client):
        result = await agent.chat("Hola", mode="normal")
        assert "asistente musical" in result


# --- Test: Respuesta con contexto adicional ---
@pytest.mark.asyncio
async def test_chat_with_extra_context():
    agent = Agent()
    extra_info = "El usuario ama el jazz."

    fake_response_data = {
        "choices": [
            {"message": {"content": "Entiendo que te encanta el jazz. Aquí tienes algo especial..."}}
        ]
    }

    mock_response = MagicMock()
    mock_response.json.return_value = fake_response_data

    mock_client = AsyncMock()
    mock_client.post.return_value = mock_response

    mock_async_client = AsyncMock()
    mock_async_client.__aenter__.return_value = mock_client

    with patch("src.services.chatIA_service.httpx.AsyncClient", return_value=mock_async_client):
        result = await agent.chat("Recomiéndame algo", mode="creatividad", extra_context=extra_info)
        assert "jazz" in result


# --- Test: Formato inválido en respuesta lanza excepción ---
@pytest.mark.asyncio
async def test_chat_invalid_response_raises():
    agent = Agent()

    fake_invalid_response = {
        "unexpected": "data"
    }

    mock_response = MagicMock()
    mock_response.json.return_value = fake_invalid_response

    mock_client = AsyncMock()
    mock_client.post.return_value = mock_response

    mock_async_client = AsyncMock()
    mock_async_client.__aenter__.return_value = mock_client

    with patch("src.services.chatIA_service.httpx.AsyncClient", return_value=mock_async_client):
        with pytest.raises(Exception, match="Openrouter no devuelve la respuesta en formato correcto."):
            await agent.chat("Hola", mode="razonamiento")
