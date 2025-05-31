from unittest.mock import patch


################################ TESTS PARA POST /chat/start

# Se inicia una conversación de chat
def test_start_chat_sucess(client):
    response = client.post("/chat/start")
    assert response.status_code == 200

# Se intenta iniciar una conversación de chat, pero sin un usuario
def test_start_chat_unauthorized(client_no_auth):
    response = client_no_auth.post("/chat/start")
    assert response.status_code == 401



################################ TEST PARA POST /chat/{chat_id}/message

# Se manda un mensaje en un chat
def test_send_message_success(client):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]

    # Mandamos mensaje a la conversacion que hemos creado
    question = "Hola"

    with patch("BackEnd.src.controllers.chat_controller.handle_message") as mock_handle_msg:
        async def async_mock(*args, **kwargs):
            return {"answer": "Mensaje recibido"}
        mock_handle_msg.side_effect = async_mock

        response = client.post(
            f"/chat/{chat_id}/message",
            json={"question": question},
        )

        assert response.status_code == 200
        response_data = response.json()
        assert "answer" in response_data
        assert isinstance(response_data["answer"], str)
        assert len(response_data["answer"]) > 0

# Entre mensajes se guarda la memoria
def test_chat_memory(client):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]
    
    # Mandamos mensaje con información
    set_genre_response = client.post(
        f"/chat/{chat_id}/message",
        json={"question": "Mi género de música favorito es el pop"},
    )
    assert set_genre_response.status_code == 200
    
    # Mandamos pregunta sobre información que dimos antes
    ask_genre_response = client.post(
        f"/chat/{chat_id}/message",
        json={"question": "¿Cuál es mi género de música favorito?"},
    )
    assert ask_genre_response.status_code == 200
    
    response_data = ask_genre_response.json()
    assert "pop" in response_data["answer"].lower(), "La respuesta no recordó el género musical"

# Se intenta mandar un mensaje en una conversacion de otro usuario
def test_cross_user_chat_access(client, client2):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]
    
    # Mandamos mensaje desde el cliente que ha creado la conversación
    response = client.post(
        f"/chat/{chat_id}/message",
        json={"question": "Hola"},
    )
    assert response.status_code == 200

    # Mandamos mensaje desde otro cliente
    response = client2.post(
        f"/chat/{chat_id}/message",
        json={"question": "Holi"},
    )
    assert response.status_code == 403
    assert "Unauthorized" in response.json().get("detail", "")


# Se intenta mandar un mensaje en una conversación no existente
def test_send_message_no_conversation(client):
    chat_id = -1

    response = client.post(
        f"/chat/{chat_id}/message",
        json={"question": "Adios"},
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Unauthorized"



################################ TEST PARA DELETE /chat/{chat_id}

# El usuario tiene una conversacion
def test_delete_conversation(client):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]

    # Buscamos la conversacion
    response = client.get("/chat/user")
    assert response.status_code == 200
    chat_ids = [chat["id"] for chat in response.json()]
    assert chat_id in chat_ids

    # Borramos la conversacion
    response = client.delete(f"/chat/{chat_id}")
    assert response.status_code == 200

    # Buscamos la conversacion
    response = client.get("/chat/user")
    assert response.status_code == 200
    chat_ids = [chat["id"] for chat in response.json()]
    assert not (chat_id in chat_ids)

# Intentamos borrar la conversación de un usuario desde otro usuario
def test_delete_conversation_unauthorized(client, client2):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]

    # Buscamos la conversacion
    response = client.get("/chat/user")
    assert response.status_code == 200
    chat_ids = [chat["id"] for chat in response.json()]
    assert chat_id in chat_ids

    # Borramos la conversacion
    response = client2.delete(f"/chat/{chat_id}")
    assert response.status_code == 403




################################ TEST PARA GET /chat/{chat_id}/history

# El usuario manda un mensaje y vemos como aparece en el historial
def test_history(client):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]

    # Vemos que el historial está vacio
    response = client.get(f"chat/{chat_id}/history")
    assert response.status_code == 200
    assert len(response.json()) == 0
    
    # Mandamos mensaje con información
    user_message = "Rock"
    response = client.post(
        f"/chat/{chat_id}/message",
        json={"question": user_message},
    )
    assert response.status_code == 200
    bot_message = response.json()["answer"]
    
    # Vemos el history del chat
    response = client.get(f"/chat/{chat_id}/history")
    assert response.status_code == 200
    messages = response.json()
    assert len(messages) == 2
    assert messages[0]["role"] == "user"
    assert messages[0]["content"] == user_message
    assert messages[1]["role"] == "assistant"
    assert messages[1]["content"] == bot_message

# Intentamos acceder a la conversacion de un usuario desde otro usuario
def test_history_unauthorized(client, client2):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]

    # Buscamos la conversacion
    response = client.get("/chat/user")
    assert response.status_code == 200
    chat_ids = [chat["id"] for chat in response.json()]
    assert chat_id in chat_ids

    # Borramos la conversacion
    response = client2.get(f"chat/{1}/history")
    assert response.status_code == 403



################################ TEST PARA GET /chat/user

# Vemos la conversacion que el usuario crea
def test_get_conversation_created(client):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]

    # Buscamos la conversacion
    response = client.get("/chat/user")
    assert response.status_code == 200
    chat_ids = [chat["id"] for chat in response.json()]
    assert chat_id in chat_ids



################################ TEST PARA PUT /chat/{chat_id}/rename

# El usuario cambio el nombre de la conversacion
def test_rename_conversation(client):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]

    # Cambiamos el nombre
    new_title = "Nuevo título de prueba"
    rename_response = client.put(
        f"/chat/{chat_id}/rename",
        data=new_title.encode('utf-8'),
        headers={"Content-Type": "text/plain"}
    )
    assert rename_response.status_code == 200

    # Buscamos la conversacion
    response = client.get("/chat/user")
    assert response.status_code == 200
    updated_chat = next(chat for chat in response.json() if chat["id"] == chat_id)
    assert updated_chat, "No se ha encontrado la conversacion"
    assert updated_chat["title"] == new_title

# Intentamos borrar la conversación de un usuario desde otro usuario
def test_rename_unauthorized(client, client2):
    # Creamos conversacion
    start_response = client.post("/chat/start")
    assert start_response.status_code == 200
    chat_id = start_response.json()["chat_id"]

    # Cambiamos el nombre
    new_title = "Nuevo título de prueba"
    rename_response = client2.put(
        f"/chat/{chat_id}/rename",
        data=new_title.encode('utf-8'),
        headers={"Content-Type": "text/plain"}
    )
    assert rename_response.status_code == 403
