import pytest
from fastapi.testclient import TestClient
from fastapi import status, HTTPException
from unittest.mock import patch, ANY


@pytest.mark.parametrize(
    "payload",
    [
        {"username": "user1", "email": "user1@test.com", "password": "pass123"},
        {"username": "user2", "email": "user2@test.com", "password": "pass456"},
    ],
)
def test_register(client, payload):
    with patch("src.routes.auth_routes.register_user") as mock_register:
        mock_register.return_value = {"msg": "User registered"}
        response = client.post("/auth/register", json=payload)
        assert response.status_code == 200
        assert response.json() == {"msg": "User registered"}
        mock_register.assert_called_once_with(
            payload["username"], payload["email"], payload["password"], ANY
        )


def test_login(client):
    with patch("src.routes.auth_routes.login_user") as mock_login:
        mock_login.return_value = {"access_token": "token", "token_type": "bearer"}
        response = client.post(
            "/auth/login",
            data={"username": "user1@test.com", "password": "pass123"}
        )
        assert response.status_code == 200
        assert response.json() == {"access_token": "token", "token_type": "bearer"}
        mock_login.assert_called_once()


def test_get_profile(client):
    with patch("src.routes.auth_routes.get_user_info") as mock_get_user_info:
        mock_get_user_info.return_value = {"username": "user1", "email": "user1@test.com"}
        response = client.get("/auth/me")
        assert response.status_code == 200
        assert response.json() == {"username": "user1", "email": "user1@test.com"}
        mock_get_user_info.assert_called_once()


def test_update_profile(client):
    data = {"username": "newuser", "email": "newemail@test.com"}
    with patch("src.routes.auth_routes.update_user_info") as mock_update_user:
        mock_update_user.return_value = {"msg": "User updated"}
        response = client.put("/auth/me", json=data)
        assert response.status_code == 200
        assert response.json() == {"msg": "User updated"}
        mock_update_user.assert_called_once()


@pytest.mark.asyncio
async def test_spotify_callback_success(monkeypatch, client):
    import src.routes.auth_routes as auth_routes

    def mock_login_spotify(request, db):
        return {"success": True}

    monkeypatch.setattr(auth_routes, "login_spotify", mock_login_spotify)
    monkeypatch.setattr(auth_routes, "FRONTEND_URL", "http://localhost:3000")

    response = client.get("/auth/callback?code=fakecode&state=user@example.com", follow_redirects=False)

    assert response.status_code == 307
    assert response.headers["location"] == "http://localhost:3000/home"


def test_spotify_callback_http_exception(monkeypatch, client):
    import src.routes.auth_routes as auth_routes
    from fastapi import HTTPException

    def mock_login_spotify(request, db):
        raise HTTPException(status_code=400, detail="Bad request")

    monkeypatch.setattr(auth_routes, "login_spotify", mock_login_spotify)
    monkeypatch.setattr(auth_routes, "FRONTEND_URL", "http://localhost:3000")

    response = client.get("/auth/callback?code=fakecode&state=user@example.com", follow_redirects=False)

    assert response.status_code == 307
    assert response.headers["location"] == "http://localhost:3000/error?reason=Bad%20request"



@pytest.mark.asyncio
async def test_spotify_callback_generic_exception(monkeypatch, client):
    import src.routes.auth_routes as auth_routes

    def mock_login_spotify(request, db):
        raise Exception("Unexpected error")

    monkeypatch.setattr(auth_routes, "login_spotify", mock_login_spotify)
    monkeypatch.setattr(auth_routes, "FRONTEND_URL", "http://localhost:3000")

    response = client.get("/auth/callback?code=fakecode&state=user@example.com", follow_redirects=False)

    assert response.status_code == 307
    assert response.headers["location"] == "http://localhost:3000/error?reason=Error%20interno"

def test_spotify_callback_login_spotify_fails(monkeypatch, client):
    import src.routes.auth_routes as auth_routes

    def mock_login_spotify(request, db):
        return {"success": False, "message": "Token inválido"}

    monkeypatch.setattr(auth_routes, "login_spotify", mock_login_spotify)
    monkeypatch.setattr(auth_routes, "FRONTEND_URL", "http://localhost:3000")

    response = client.get("/auth/callback?code=fakecode&state=user@example.com", follow_redirects=False)

    assert response.status_code == 307
    assert "location" in response.headers
    # Importante hacer URL decode para comparar bien:
    from urllib.parse import unquote
    location = unquote(response.headers["location"])
    assert location == "http://localhost:3000/error?reason=Token inválido"


