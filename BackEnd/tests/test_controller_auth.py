# tests/test_controller_auth.py

# --- Librerías estándar ---
from datetime import datetime, timedelta
from types import SimpleNamespace
import os
import urllib.parse

# --- Librerías de terceros ---
import pytest
from fastapi import HTTPException
from jose import jwt
from unittest.mock import patch

# --- Módulos locales ---
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
from src.utils.auth import hash_password, verify_password, create_access_token


# ========== VALIDACIÓN DE EMAIL ==========

ALGORITHM = ALGORITHM or "HS256"

@patch("src.controllers.auth_controller.validate_email")
def test_validate_email_address_valid(mock_validate):
    mock_validate.return_value = True
    result = validate_email_address("test@example.com")
    assert result is True


def test_validate_email_address_invalid():
    with pytest.raises(HTTPException) as exc_info:
        validate_email_address("not-an-email")
    assert exc_info.value.status_code == 400
    assert "Invalid email" in str(exc_info.value.detail)


# ========== GESTIÓN DE SESIÓN DB ==========

def test_get_db_yield_and_closes():
    db_gen = get_db()
    db = next(db_gen)
    assert db is not None
    try:
        next(db_gen)
    except StopIteration:
        pass


# ========== REGISTRO DE USUARIO ==========

@patch("src.controllers.auth_controller.validate_email_address")
@patch("src.controllers.auth_controller.create_access_token")
@patch("src.controllers.auth_controller.get_spotify_login_url")
def test_register_user_success(mock_spotify_url, mock_token, mock_validate_email, db_session):
    mock_token.return_value = "fake_token"
    mock_spotify_url.return_value = "https://spotify.com/auth"

    result = register_user("new_user", "new@example.com", "password123", db_session)

    assert result["access_token"] == "fake_token"
    assert result["token_type"] == "bearer"
    assert result["redirect_url"] == "https://spotify.com/auth"
    user = db_session.query(User).filter_by(email="new@example.com").first()
    assert user is not None and user.username == "new_user"


@patch("src.controllers.auth_controller.validate_email_address")
def test_register_user_email_exists(mock_validate, db_session):
    db_session.add(User(username="existing", email="exists@example.com", hashed_password="hashed"))
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        register_user("another", "exists@example.com", "password123", db_session)
    assert exc_info.value.status_code == 400
    assert "Email already registered" in str(exc_info.value.detail)


@patch("src.controllers.auth_controller.validate_email_address")
def test_register_user_username_exists(mock_validate, db_session):
    db_session.add(User(username="existing_user", email="unique@example.com", hashed_password="hashed"))
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        register_user("existing_user", "new@example.com", "password123", db_session)
    assert exc_info.value.status_code == 400
    assert "Username already registered" in str(exc_info.value.detail)


@patch("src.controllers.auth_controller.validate_email_address")
def test_register_user_invalid_email(mock_validate, db_session):
    mock_validate.side_effect = HTTPException(status_code=400, detail="Invalid email")
    with pytest.raises(HTTPException) as exc_info:
        register_user("user", "invalid", "password", db_session)
    assert exc_info.value.status_code == 400
    assert "Invalid email" in str(exc_info.value.detail)


# ========== LOGIN DE USUARIO ==========

@patch("src.controllers.auth_controller.get_spotify_login_url", return_value="https://spotify.com/login")
@patch("src.controllers.auth_controller.create_access_token", return_value="mocked_token")
def test_login_user_success(mock_create_token, mock_spotify_url, db_session):
    user = User(username="testuser", email="user@test.com", hashed_password=hash_password("securepassword"))
    db_session.add(user)
    db_session.commit()

    result = login_user("user@test.com", "securepassword", db_session)
    assert result["access_token"] == "mocked_token"
    assert result["redirect_url"] == "https://spotify.com/login"


@patch("src.controllers.auth_controller.get_spotify_login_url")
@patch("src.controllers.auth_controller.create_access_token")
def test_login_user_invalid_email(mock_create_token, mock_spotify_url, db_session):
    with pytest.raises(HTTPException) as exc_info:
        login_user("nonexistent@test.com", "any", db_session)
    assert exc_info.value.status_code == 401
    assert "Invalid credentials" in str(exc_info.value.detail)


@patch("src.controllers.auth_controller.get_spotify_login_url")
@patch("src.controllers.auth_controller.create_access_token")
def test_login_user_invalid_password(mock_create_token, mock_spotify_url, db_session):
    db_session.add(User(username="testuser", email="user2@test.com", hashed_password=hash_password("correctpassword")))
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        login_user("user2@test.com", "wrongpassword", db_session)
    assert exc_info.value.status_code == 401


# ========== JWT Y AUTENTICACIÓN ==========

def generate_token(email: str, expires_delta: timedelta = timedelta(minutes=15)):
    payload = {"sub": email, "exp": datetime.utcnow() + expires_delta}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def test_get_current_user_valid_token(db_session):
    user = User(username="testuser", email="testuser@test.com", hashed_password="hashed")
    db_session.add(user)
    db_session.commit()

    token = generate_token(email=user.email)
    result = get_current_user(token=token, db=db_session)

    assert result.email == user.email


def test_get_current_user_invalid_token_format(db_session):
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token="invalid.token.structure", db=db_session)
    assert exc_info.value.status_code == 401


def test_get_current_user_missing_sub(db_session):
    token = jwt.encode({"some": "data"}, SECRET_KEY, algorithm=ALGORITHM)
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=token, db=db_session)
    assert exc_info.value.status_code == 401


def test_get_current_user_user_not_found(db_session):
    token = generate_token(email="ghost@test.com")
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=token, db=db_session)
    assert exc_info.value.status_code == 401


# ========== INFO BÁSICA DE USUARIO ==========

def test_get_user_info_returns_expected_fields():
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashed")
    result = get_user_info(user)
    assert result == {"username": "testuser", "email": "testuser@example.com"}


# ========== ACTUALIZACIÓN DE USUARIO ==========

def create_test_user(db, username="user1", email="user1@test.com", password="hashed"):
    user = User(username=username, email=email, hashed_password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_update_user_username_success(db_session):
    user = create_test_user(db_session)
    data = SimpleNamespace(username="newuser", email=None, password=None)
    result = update_user_info(data, user, db_session)
    assert result["user"]["username"] == "newuser"


def test_update_user_email_success(db_session):
    user = create_test_user(db_session)
    data = SimpleNamespace(username=None, email="newemail@test.com", password=None)
    result = update_user_info(data, user, db_session)
    assert result["user"]["email"] == "newemail@test.com"


def test_update_user_email_in_use_raises_error(db_session):
    u1 = create_test_user(db_session, "u1", "u1@test.com")
    u2 = create_test_user(db_session, "u2", "taken@test.com")
    data = SimpleNamespace(username=None, email="taken@test.com", password=None)
    with pytest.raises(HTTPException) as exc_info:
        update_user_info(data, u1, db_session)
    assert "ya está en uso" in str(exc_info.value.detail)


def test_update_user_password_success(db_session):
    user = create_test_user(db_session)
    data = SimpleNamespace(username=None, email=None, password="newpass123")
    result = update_user_info(data, user, db_session)
    assert verify_password("newpass123", user.hashed_password)


def test_update_user_no_changes(db_session):
    user = create_test_user(db_session)
    data = SimpleNamespace(username=None, email=None, password=None)
    result = update_user_info(data, user, db_session)
    assert result["message"] == "No se realizaron cambios"


# ========== SPOTIFY URL ==========

@pytest.fixture
def set_spotify_env(monkeypatch):
    monkeypatch.setenv("SPOTIFY_CLIENT_ID", "fake_client_id")
    monkeypatch.setenv("SPOTIFY_CLIENT_SECRET", "fake_client_secret")
    monkeypatch.setenv("SPOTIFY_REDIRECT_URI", "http://localhost/callback")


def test_get_spotify_login_url_with_email(set_spotify_env):
    email = "user@example.com"
    url = get_spotify_login_url(email)
    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query)
    assert query["state"][0] == email


def test_get_spotify_login_url_without_email(set_spotify_env):
    url = get_spotify_login_url()
    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query)
    assert "state" not in query or query["state"][0] == ""
