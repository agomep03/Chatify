import os
import urllib.parse
from datetime import datetime, timedelta
from types import SimpleNamespace
from unittest.mock import patch

import pytest
from fastapi import HTTPException
from jose import jwt

from src.controllers.auth_controller import (
    get_db,
    validate_email_address,
    register_user,
    login_user,
    get_current_user,
    get_spotify_login_url,
    get_user_info,
    update_user_info,
    SECRET_KEY,
    ALGORITHM
)
from src.models.auth_model import User
from src.utils.auth import hash_password, verify_password


# --- Test: Validación de email válido ---
@patch("src.controllers.auth_controller.validate_email")
def test_validate_email_address_valid(mock_validate):
    mock_validate.return_value = True
    assert validate_email_address("test@example.com") is True


# --- Test: Validación de email inválido ---
def test_validate_email_address_invalid():
    with pytest.raises(HTTPException) as exc_info:
        validate_email_address("not-an-email")
    assert exc_info.value.status_code == 400
    assert "Invalid email" in str(exc_info.value.detail)


# --- Test: get_db devuelve sesión y la cierra ---
def test_get_db_yield_and_closes():
    db_gen = get_db()
    db = next(db_gen)
    assert db is not None
    with pytest.raises(StopIteration):
        next(db_gen)


# --- Test: Registro exitoso de usuario ---
@patch("src.controllers.auth_controller.validate_email_address")
@patch("src.controllers.auth_controller.create_access_token")
@patch("src.controllers.auth_controller.get_spotify_login_url")
def test_register_user_success(mock_spotify_url, mock_token, mock_validate_email, db_session):
    mock_token.return_value = "fake_token"
    mock_spotify_url.return_value = "https://spotify.com/auth"

    result = register_user("new_user", "new@example.com", "password123", db_session)

    assert result["access_token"] == "fake_token"
    assert result["redirect_url"] == "https://spotify.com/auth"
    assert db_session.query(User).filter_by(email="new@example.com").first()


# --- Test: Registro falla si el email ya existe ---
@patch("src.controllers.auth_controller.validate_email_address")
def test_register_user_email_exists(mock_validate, db_session):
    db_session.add(User(username="existing", email="exists@example.com", hashed_password="hashed"))
    db_session.commit()

    with pytest.raises(HTTPException):
        register_user("any", "exists@example.com", "pass", db_session)


# --- Test: Registro falla si el username ya existe ---
@patch("src.controllers.auth_controller.validate_email_address")
def test_register_user_username_exists(mock_validate, db_session):
    db_session.add(User(username="existing_user", email="unique@example.com", hashed_password="hashed"))
    db_session.commit()

    with pytest.raises(HTTPException):
        register_user("existing_user", "new@example.com", "pass", db_session)


# --- Test: Registro falla si el email no es válido ---
@patch("src.controllers.auth_controller.validate_email_address")
def test_register_user_invalid_email(mock_validate, db_session):
    mock_validate.side_effect = HTTPException(status_code=400, detail="Invalid email")
    with pytest.raises(HTTPException):
        register_user("user", "invalid", "pass", db_session)


# --- Test: Login exitoso de usuario ---
@patch("src.controllers.auth_controller.get_spotify_login_url", return_value="https://spotify.com/login")
@patch("src.controllers.auth_controller.create_access_token", return_value="mocked_token")
def test_login_user_success(mock_token, mock_url, db_session):
    user = User(username="testuser", email="user@test.com", hashed_password=hash_password("securepassword"))
    db_session.add(user)
    db_session.commit()

    result = login_user("user@test.com", "securepassword", db_session)

    assert result["access_token"] == "mocked_token"
    assert result["redirect_url"] == "https://spotify.com/login"


# --- Test: Login falla si el email no existe ---
@patch("src.controllers.auth_controller.create_access_token")
def test_login_user_invalid_email(mock_token, db_session):
    with pytest.raises(HTTPException):
        login_user("missing@test.com", "pass", db_session)


# --- Test: Login falla si la contraseña es incorrecta ---
@patch("src.controllers.auth_controller.get_spotify_login_url")
@patch("src.controllers.auth_controller.create_access_token")
def test_login_user_invalid_password(mock_token, mock_url, db_session):
    db_session.add(User(username="user", email="u@test.com", hashed_password=hash_password("correct")))
    db_session.commit()

    with pytest.raises(HTTPException):
        login_user("u@test.com", "wrong", db_session)


# --- Test: get_current_user con token válido ---
def test_get_current_user_valid_token(db_session):
    user = User(username="testuser", email="testuser@test.com", hashed_password="hashed")
    db_session.add(user)
    db_session.commit()

    token = jwt.encode({"sub": user.email, "exp": datetime.utcnow() + timedelta(minutes=15)}, SECRET_KEY, algorithm=ALGORITHM)
    result = get_current_user(token=token, db=db_session)

    assert result.email == user.email


# --- Test: get_current_user con token malformado ---
def test_get_current_user_invalid_token_format(db_session):
    with pytest.raises(HTTPException):
        get_current_user(token="invalid.token.structure", db=db_session)


# --- Test: get_current_user sin campo 'sub' ---
def test_get_current_user_missing_sub(db_session):
    token = jwt.encode({"foo": "bar"}, SECRET_KEY, algorithm=ALGORITHM)
    with pytest.raises(HTTPException):
        get_current_user(token=token, db=db_session)


# --- Test: get_current_user con usuario no encontrado ---
def test_get_current_user_user_not_found(db_session):
    token = jwt.encode({"sub": "ghost@test.com", "exp": datetime.utcnow() + timedelta(minutes=15)}, SECRET_KEY, algorithm=ALGORITHM)
    with pytest.raises(HTTPException):
        get_current_user(token=token, db=db_session)


# --- Test: get_user_info devuelve campos esperados ---
def test_get_user_info_returns_expected_fields():
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashed")
    result = get_user_info(user)
    assert result == {"username": "testuser", "email": "testuser@example.com"}


# --- Helper: Crear usuario de prueba ---
def create_test_user(db, username="user1", email="user1@test.com", password="hashed"):
    user = User(username=username, email=email, hashed_password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# --- Test: Actualizar nombre de usuario ---
def test_update_user_username_success(db_session):
    user = create_test_user(db_session)
    data = SimpleNamespace(username="newuser", email=None, password=None)
    result = update_user_info(data, user, db_session)
    assert result["user"]["username"] == "newuser"


# --- Test: Actualizar email ---
def test_update_user_email_success(db_session):
    user = create_test_user(db_session)
    data = SimpleNamespace(username=None, email="newemail@test.com", password=None)
    result = update_user_info(data, user, db_session)
    assert result["user"]["email"] == "newemail@test.com"


# --- Test: Error al actualizar email ya existente ---
def test_update_user_email_in_use_raises_error(db_session):
    u1 = create_test_user(db_session, "u1", "u1@test.com")
    create_test_user(db_session, "u2", "taken@test.com")
    data = SimpleNamespace(username=None, email="taken@test.com", password=None)

    with pytest.raises(HTTPException):
        update_user_info(data, u1, db_session)


# --- Test: Actualizar contraseña ---
def test_update_user_password_success(db_session):
    user = create_test_user(db_session)
    data = SimpleNamespace(username=None, email=None, password="newpass123")
    result = update_user_info(data, user, db_session)
    assert verify_password("newpass123", user.hashed_password)


# --- Test: Sin cambios en actualización de usuario ---
def test_update_user_no_changes(db_session):
    user = create_test_user(db_session)
    data = SimpleNamespace(username=None, email=None, password=None)
    result = update_user_info(data, user, db_session)
    assert result["message"] == "No se realizaron cambios"


# --- Fixture: Configurar entorno Spotify ---
@pytest.fixture
def set_spotify_env(monkeypatch):
    monkeypatch.setenv("SPOTIFY_CLIENT_ID", "fake_client_id")
    monkeypatch.setenv("SPOTIFY_CLIENT_SECRET", "fake_client_secret")
    monkeypatch.setenv("SPOTIFY_REDIRECT_URI", "http://localhost/callback")


# --- Test: URL de login Spotify con email ---
def test_get_spotify_login_url_with_email(set_spotify_env):
    url = get_spotify_login_url("user@example.com")
    query = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
    assert query["state"][0] == "user@example.com"


# --- Test: URL de login Spotify sin email ---
def test_get_spotify_login_url_without_email(set_spotify_env):
    url = get_spotify_login_url()
    query = urllib.parse.parse_qs(urllib.parse.urlparse(url).query)
    assert "state" not in query or query["state"][0] == ""
