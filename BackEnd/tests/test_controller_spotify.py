import pytest
from fastapi import HTTPException
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock

from src.controllers.spotify_controller import (
    refresh_spotify_token,
    get_valid_spotify_token,
    get_all_user_playlists,
    update_playlist,
    generate_playlist_auto
)
from src.models.auth_model import User


# --- Helpers ---
def create_user_with_token():
    return User(
        id=1,
        username="testuser",
        email="user@test.com",
        spotify_access_token="old_token",
        spotify_refresh_token="refresh_token_123",
        spotify_token_expires_at=datetime.utcnow() + timedelta(minutes=30),
        hashed_password="fake"
    )

def create_user(access_token="token", expires_at=None):
    return User(
        id=1,
        username="testuser",
        email="user@test.com",
        spotify_access_token=access_token,
        spotify_token_expires_at=expires_at,
        spotify_refresh_token="refresh_token_123",
        hashed_password="fake"
    )

def create_user_with_spotify():
    return User(
        id=1,
        email="test@example.com",
        spotify_access_token="valid_token",
        spotify_refresh_token="refresh_token",
        spotify_user_id="test_spotify_user",
        spotify_token_expires_at=None
    )


# --- Tests: refresh_spotify_token ---
@patch("src.controllers.spotify_controller.requests.post")
def test_refresh_spotify_token_success(mock_post, db_session):
    user = create_user_with_token()
    mock_post.return_value = MagicMock(status_code=200, json=lambda: {
        "access_token": "new_token", "expires_in": 3600
    })

    token = refresh_spotify_token(user, db_session)

    assert token == "new_token"
    assert user.spotify_access_token == "new_token"


@patch("src.controllers.spotify_controller.requests.post")
def test_refresh_spotify_token_spotify_error(mock_post, db_session):
    user = create_user_with_token()
    mock_post.return_value = MagicMock(status_code=400, text="invalid_request")

    with pytest.raises(HTTPException) as exc_info:
        refresh_spotify_token(user, db_session)

    assert exc_info.value.status_code == 502


def test_refresh_spotify_token_no_refresh_token(db_session):
    user = User(id=1, username="testuser", email="user@test.com", spotify_refresh_token=None, hashed_password="fake")

    with pytest.raises(HTTPException) as exc_info:
        refresh_spotify_token(user, db_session)

    assert exc_info.value.status_code == 401


@patch("src.controllers.spotify_controller.requests.post", side_effect=Exception("Crash"))
def test_refresh_spotify_token_unexpected_exception(mock_post, db_session):
    user = create_user_with_token()

    with pytest.raises(HTTPException) as exc_info:
        refresh_spotify_token(user, db_session)

    assert exc_info.value.status_code == 500


# --- Tests: get_valid_spotify_token ---
def test_get_valid_spotify_token_valid_token(db_session):
    user = create_user(expires_at=datetime.utcnow() + timedelta(minutes=30))
    assert get_valid_spotify_token(user, db_session) == "token"


@patch("src.controllers.spotify_controller.refresh_spotify_token", return_value="new_token")
def test_get_valid_spotify_token_expired_token(mock_refresh, db_session):
    user = create_user(expires_at=datetime.utcnow() - timedelta(minutes=1))
    assert get_valid_spotify_token(user, db_session) == "new_token"


@patch("src.controllers.spotify_controller.refresh_spotify_token", return_value="refreshed_token")
def test_get_valid_spotify_token_missing_expiry(mock_refresh, db_session):
    user = create_user(expires_at=None)
    assert get_valid_spotify_token(user, db_session) == "refreshed_token"


def test_get_valid_spotify_token_no_access_token(db_session):
    user = create_user(access_token=None)
    with pytest.raises(HTTPException) as exc_info:
        get_valid_spotify_token(user, db_session)
    assert exc_info.value.status_code == 401


# --- Tests: get_all_user_playlists ---
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="valid_token")
def test_get_all_user_playlists_success(mock_token, mock_get, db_session):
    user = create_user_with_token()
    mock_get.side_effect = [
        MagicMock(status_code=200, json=lambda: {
            "items": [{
                "id": "playlist123",
                "name": "My Playlist",
                "description": "desc",
                "images": [{"url": "http://image.jpg"}]
            }],
            "next": None
        }),
        MagicMock(status_code=200, json=lambda: {
            "items": [{
                "track": {
                    "uri": "spotify:track:abc123",
                    "name": "Test Song",
                    "artists": [{"name": "Artist A"}]
                }
            }]
        })
    ]
    response = get_all_user_playlists(user, db_session)
    assert "playlists" in response


@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="some_token")
def test_get_all_user_playlists_token_invalid(mock_token, mock_get, db_session):
    user = create_user_with_token()
    mock_get.return_value = MagicMock(status_code=401, text="Unauthorized")

    with pytest.raises(HTTPException) as exc:
        get_all_user_playlists(user, db_session)

    assert exc.value.status_code == 401


@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="some_token")
def test_get_all_user_playlists_spotify_error(mock_token, mock_get, db_session):
    user = create_user_with_token()
    mock_get.return_value = MagicMock(status_code=500, text="Error")

    with pytest.raises(HTTPException) as exc:
        get_all_user_playlists(user, db_session)

    assert exc.value.status_code == 500


@patch("src.controllers.spotify_controller.get_valid_spotify_token", side_effect=Exception("Fail"))
def test_get_all_user_playlists_unexpected_error(mock_token, db_session):
    user = create_user_with_token()

    with pytest.raises(HTTPException) as exc:
        get_all_user_playlists(user, db_session)

    assert exc.value.status_code == 500


# --- Tests: update_playlist ---
@patch("src.controllers.spotify_controller.requests.put")
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="valid_token")
def test_update_playlist_success(mock_token, mock_get, mock_put, db_session):
    user = create_user_with_spotify()
    mock_get.return_value = MagicMock(status_code=200, json=lambda: {"owner": {"id": user.spotify_user_id}})
    mock_put.return_value = MagicMock(status_code=200)

    response = update_playlist("playlist123", "New", "Desc", user, db_session)
    assert response == {"message": "Playlist actualizada correctamente"}

import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from src.controllers.spotify_controller import unfollow_playlist_logic
from src.models.auth_model import User


# 🧪 Helper para crear un usuario con token
def create_user_with_token():
    return User(
        id=1,
        email="test@example.com",
        spotify_access_token="valid_token",
        hashed_password="fake"
    )


# ✅ Caso exitoso de unfollow
@patch("src.controllers.spotify_controller.requests.delete")
def test_unfollow_playlist_success(mock_delete):
    user = create_user_with_token()

    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_delete.return_value = mock_response

    result = unfollow_playlist_logic("playlist123", user)

    assert result["message"] == "Playlist eliminada de tu cuenta (dejaste de seguirla)."


# 🚫 Error 403: No tienes permiso
@patch("src.controllers.spotify_controller.requests.delete")
def test_unfollow_playlist_forbidden(mock_delete):
    user = create_user_with_token()

    mock_response = MagicMock()
    mock_response.status_code = 403
    mock_delete.return_value = mock_response

    with pytest.raises(HTTPException) as exc_info:
        unfollow_playlist_logic("playlist123", user)

    assert exc_info.value.status_code == 403
    assert "permiso" in str(exc_info.value.detail).lower()


# ❌ Otro error (por ejemplo 500)
@patch("src.controllers.spotify_controller.requests.delete")
def test_unfollow_playlist_other_error(mock_delete):
    user = create_user_with_token()

    mock_response = MagicMock()
    mock_response.status_code = 500
    mock_response.json.return_value = {"error": "Internal Server Error"}
    mock_delete.return_value = mock_response

    with pytest.raises(HTTPException) as exc_info:
        unfollow_playlist_logic("playlist123", user)

    assert exc_info.value.status_code == 500
    assert "error" in str(exc_info.value.detail).lower()

import pytest
from unittest.mock import patch, MagicMock
from fastapi import HTTPException
from src.controllers.spotify_controller import get_user_full_top_info
from src.models.auth_model import User


# 🧪 Helper para crear un usuario con token
def create_user_with_token():
    return User(
        id=1,
        email="test@example.com",
        spotify_access_token="valid_token",
        spotify_refresh_token="refresh_token",
        spotify_user_id="spotify_user_123",
        hashed_password="fake"
    )


# ✅ Caso exitoso
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="valid_token")
def test_get_user_full_top_info_success(mock_token, mock_get, db_session):
    user = create_user_with_token()

    # Respuesta para top artists
    mock_artist_response = MagicMock()
    mock_artist_response.status_code = 200
    mock_artist_response.json.return_value = {
        "items": [
            {"name": "Artist A", "genres": ["pop", "dance"]},
            {"name": "Artist B", "genres": ["pop"]},
        ]
    }

    # Respuesta para top tracks
    mock_track_response = MagicMock()
    mock_track_response.status_code = 200
    mock_track_response.json.return_value = {
        "items": [
            {"name": "Track 1", "artists": [{"name": "Artist A"}]},
            {"name": "Track 2", "artists": [{"name": "Artist B"}]},
        ]
    }

    # Simular llamadas en orden: artists x3, tracks x3
    mock_get.side_effect = [
        mock_artist_response, mock_track_response,  # semanal
        mock_artist_response, mock_track_response,  # seis_meses
        mock_artist_response, mock_track_response   # todo_el_tiempo
    ]

    result = get_user_full_top_info(user, db_session)

    assert "top_artists" in result
    assert "semanal" in result["top_artists"]
    assert "pop" in result["top_genres"]["semanal"]
    assert "Track 1 - Artist A" in result["top_tracks"]["semanal"]


# 🚫 Falla en una llamada a Spotify (por ejemplo: artistas)
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="valid_token")
def test_get_user_full_top_info_spotify_error(mock_token, mock_get, db_session):
    user = create_user_with_token()

    error_response = MagicMock()
    error_response.status_code = 500
    error_response.text = "Internal Server Error"
    mock_get.return_value = error_response

    with pytest.raises(HTTPException) as exc:
        get_user_full_top_info(user, db_session)

    assert exc.value.status_code == 500
    assert "No se pudo obtener top" in str(exc.value.detail)


# 🛑 Token inválido (get_valid_spotify_token lanza excepción)
@patch("src.controllers.spotify_controller.get_valid_spotify_token")
def test_get_user_full_top_info_invalid_token(mock_token, db_session):
    user = create_user_with_token()
    mock_token.side_effect = HTTPException(status_code=401, detail="Token inválido")

    with pytest.raises(HTTPException) as exc:
        get_user_full_top_info(user, db_session)

    assert exc.value.status_code == 401
    assert "Token inválido" in str(exc.value.detail)
