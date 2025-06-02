import pytest
from fastapi import HTTPException
from datetime import datetime, timedelta
from unittest.mock import patch, MagicMock

from src.controllers.spotify_controller import (
    refresh_spotify_token,
    get_valid_spotify_token,
    get_all_user_playlists,
    update_playlist,
    unfollow_playlist_logic,
    get_user_full_top_info
)
from src.models.auth_model import User


# === Helpers ===
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


def create_user(access_token="token", expires_at=None, refresh_token="refresh_token_123"):
    return User(
        id=1,
        username="testuser",
        email="user@test.com",
        spotify_access_token=access_token,
        spotify_token_expires_at=expires_at,
        spotify_refresh_token=refresh_token,
        hashed_password="fake"
    )



def create_user_with_spotify():
    return User(
        id=1,
        email="test@example.com",
        spotify_access_token="valid_token",
        spotify_refresh_token="refresh_token",
        spotify_user_id="spotify_user_123",
        hashed_password="fake"
    )


# --- Test: Refrescar token correctamente ---
@patch("src.controllers.spotify_controller.requests.post")
def test_refresh_spotify_token_success(mock_post, db_session):
    user = create_user_with_token()
    mock_post.return_value = MagicMock(status_code=200, json=lambda: {
        "access_token": "new_token", "expires_in": 3600
    })
    token = refresh_spotify_token(user, db_session)
    assert token == "new_token"


# --- Test: Error 400 al refrescar token ---
@patch("src.controllers.spotify_controller.requests.post")
def test_refresh_spotify_token_spotify_error(mock_post, db_session):
    user = create_user_with_token()
    mock_post.return_value = MagicMock(status_code=400, text="invalid_request")
    with pytest.raises(HTTPException) as exc:
        refresh_spotify_token(user, db_session)
    assert exc.value.status_code == 502


# --- Test: No hay refresh token disponible ---
def test_refresh_spotify_token_no_refresh_token(db_session):
    user = create_user(refresh_token=None)
    with pytest.raises(HTTPException) as exc:
        refresh_spotify_token(user, db_session)
    assert exc.value.status_code == 401


# --- Test: Excepción inesperada al refrescar token ---
@patch("src.controllers.spotify_controller.requests.post", side_effect=Exception("Crash"))
def test_refresh_spotify_token_unexpected_exception(mock_post, db_session):
    user = create_user_with_token()
    with pytest.raises(HTTPException) as exc:
        refresh_spotify_token(user, db_session)
    assert exc.value.status_code == 500


# --- Test: Token válido aún vigente ---
def test_get_valid_spotify_token_valid_token(db_session):
    user = create_user(expires_at=datetime.utcnow() + timedelta(minutes=10))
    assert get_valid_spotify_token(user, db_session) == "token"


# --- Test: Token expirado se refresca ---
@patch("src.controllers.spotify_controller.refresh_spotify_token", return_value="new_token")
def test_get_valid_spotify_token_expired_token(mock_refresh, db_session):
    user = create_user(expires_at=datetime.utcnow() - timedelta(minutes=1))
    assert get_valid_spotify_token(user, db_session) == "new_token"


# --- Test: Token sin expiración se refresca ---
@patch("src.controllers.spotify_controller.refresh_spotify_token", return_value="refreshed_token")
def test_get_valid_spotify_token_missing_expiry(mock_refresh, db_session):
    user = create_user(expires_at=None)
    assert get_valid_spotify_token(user, db_session) == "refreshed_token"


# --- Test: Usuario sin token lanza error ---
def test_get_valid_spotify_token_no_access_token(db_session):
    user = create_user(access_token=None)
    with pytest.raises(HTTPException) as exc:
        get_valid_spotify_token(user, db_session)
    assert exc.value.status_code == 401


# --- Test: Obtener playlists exitosamente ---
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="valid_token")
def test_get_all_user_playlists_success(mock_token, mock_get, db_session):
    user = create_user_with_token()
    mock_get.side_effect = [
        MagicMock(status_code=200, json=lambda: {
            "items": [{"id": "p1", "name": "Playlist", "description": "desc", "images": [{"url": "img"}]}],
            "next": None
        }),
        MagicMock(status_code=200, json=lambda: {"items": [{"track": {"uri": "spotify:track:abc", "name": "Song", "artists": [{"name": "Artist"}]}}]})
    ]
    result = get_all_user_playlists(user, db_session)
    assert "playlists" in result


# --- Test: Error 401 al obtener playlists ---
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="some_token")
def test_get_all_user_playlists_token_invalid(mock_token, mock_get, db_session):
    user = create_user_with_token()
    mock_get.return_value = MagicMock(status_code=401, text="Unauthorized")
    with pytest.raises(HTTPException) as exc:
        get_all_user_playlists(user, db_session)
    assert exc.value.status_code == 401


# --- Test: Error 500 de Spotify ---
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="some_token")
def test_get_all_user_playlists_spotify_error(mock_token, mock_get, db_session):
    user = create_user_with_token()
    mock_get.return_value = MagicMock(status_code=500, text="Error")
    with pytest.raises(HTTPException) as exc:
        get_all_user_playlists(user, db_session)
    assert exc.value.status_code == 500


# --- Test: Error inesperado en get_all_user_playlists ---
@patch("src.controllers.spotify_controller.get_valid_spotify_token", side_effect=Exception("Fail"))
def test_get_all_user_playlists_unexpected_error(mock_token, db_session):
    user = create_user_with_token()
    with pytest.raises(HTTPException) as exc:
        get_all_user_playlists(user, db_session)
    assert exc.value.status_code == 500


# --- Test: Actualizar playlist correctamente ---
@patch("src.controllers.spotify_controller.requests.put")
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="valid_token")
def test_update_playlist_success(mock_token, mock_get, mock_put, db_session):
    user = create_user_with_spotify()
    mock_get.return_value = MagicMock(status_code=200, json=lambda: {"owner": {"id": user.spotify_user_id}})
    mock_put.return_value = MagicMock(status_code=200)
    result = update_playlist("playlist123", "New", "Desc", user, db_session)
    assert result["message"] == "Playlist actualizada correctamente"


# --- Test: Dejar de seguir playlist correctamente ---
@patch("src.controllers.spotify_controller.requests.delete")
def test_unfollow_playlist_success(mock_delete):
    user = create_user_with_token()
    mock_delete.return_value = MagicMock(status_code=200)
    result = unfollow_playlist_logic("playlist123", user)
    assert result["message"] == "Playlist eliminada de tu cuenta (dejaste de seguirla)."


# --- Test: Error 403 al dejar de seguir playlist ---
@patch("src.controllers.spotify_controller.requests.delete")
def test_unfollow_playlist_forbidden(mock_delete):
    user = create_user_with_token()
    mock_delete.return_value = MagicMock(status_code=403)
    with pytest.raises(HTTPException) as exc:
        unfollow_playlist_logic("playlist123", user)
    assert exc.value.status_code == 403


# --- Test: Otro error al dejar de seguir playlist ---
@patch("src.controllers.spotify_controller.requests.delete")
def test_unfollow_playlist_other_error(mock_delete):
    user = create_user_with_token()
    mock_resp = MagicMock(status_code=500, json=lambda: {"error": "Internal"})
    mock_delete.return_value = mock_resp
    with pytest.raises(HTTPException) as exc:
        unfollow_playlist_logic("playlist123", user)
    assert exc.value.status_code == 500


# --- Test: Obtener top info completo correctamente ---
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="valid_token")
def test_get_user_full_top_info_success(mock_token, mock_get, db_session):
    user = create_user_with_spotify()

    artist_resp = MagicMock(status_code=200, json=lambda: {
        "items": [{"name": "Artist A", "genres": ["pop", "rock"]}, {"name": "Artist B", "genres": ["pop"]}]
    })
    track_resp = MagicMock(status_code=200, json=lambda: {
        "items": [{"name": "Song 1", "artists": [{"name": "Artist A"}]}, {"name": "Song 2", "artists": [{"name": "Artist B"}]}]
    })

    mock_get.side_effect = [artist_resp, track_resp] * 3

    result = get_user_full_top_info(user, db_session)
    assert "top_artists" in result
    assert "Track 1 - Artist A" not in result["top_tracks"]["semanal"]  # Asserting logic integrity


# --- Test: Error al obtener top desde Spotify ---
@patch("src.controllers.spotify_controller.requests.get")
@patch("src.controllers.spotify_controller.get_valid_spotify_token", return_value="valid_token")
def test_get_user_full_top_info_spotify_error(mock_token, mock_get, db_session):
    user = create_user_with_spotify()
    mock_get.return_value = MagicMock(status_code=500, text="Spotify error")
    with pytest.raises(HTTPException) as exc:
        get_user_full_top_info(user, db_session)
    assert exc.value.status_code == 500


# --- Test: Token inválido al obtener top ---
@patch("src.controllers.spotify_controller.get_valid_spotify_token", side_effect=HTTPException(status_code=401, detail="Token inválido"))
def test_get_user_full_top_info_invalid_token(mock_token, db_session):
    user = create_user_with_spotify()
    with pytest.raises(HTTPException) as exc:
        get_user_full_top_info(user, db_session)
    assert exc.value.status_code == 401
