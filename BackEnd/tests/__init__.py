def test_start_chat_auth(client):
    response = client.post("/chat/start")
    assert response.status_code == 200

def test_start_chat_no_auth(client_no_auth):
    response = client_no_auth.post("/chat/start")
    assert response.status_code in (401, 403)
