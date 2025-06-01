# tests/test_controller_auth.py

from src.controllers.auth_controller import get_db
import pytest
from fastapi import HTTPException
from src.controllers.auth_controller import validate_email_address
from unittest.mock import patch

from src.controllers.auth_controller import register_user
from src.models.auth_model import User
from unittest.mock import patch
import pytest
from fastapi import HTTPException
from unittest.mock import patch
from unittest.mock import patch
import pytest
import pytest
from src.controllers.auth_controller import get_spotify_login_url
import urllib.parse
import os
import pytest
from fastapi import HTTPException
from types import SimpleNamespace
from src.controllers.auth_controller import update_user_info
from src.models.auth_model import User
from src.utils.auth import verify_password
from fastapi import HTTPException
from unittest.mock import patch
from src.controllers.auth_controller import login_user
from src.models.auth_model import User
from src.utils.auth import hash_password
import pytest
from fastapi import HTTPException
from jose import jwt
from datetime import timedelta, datetime
from src.controllers.auth_controller import get_current_user, SECRET_KEY, ALGORITHM
from src.models.auth_model import User
from src.utils.auth import create_access_token
from src.controllers.auth_controller import get_user_info
from src.models.auth_model import User


@patch("src.controllers.auth_controller.validate_email")
def test_validate_email_address_valid(mock_validate):
    mock_validate.return_value = True
    result = validate_email_address("test@example.com")
    assert result is True


def test_validate_email_address_invalid():
    invalid_email = "not-an-email"
    with pytest.raises(HTTPException) as exc_info:
        validate_email_address(invalid_email)

    assert exc_info.value.status_code == 400
    assert "Invalid email" in str(exc_info.value.detail)

def test_get_db_yield_and_closes():
    db_gen = get_db()
    db = next(db_gen)
    assert db is not None  # debe ser una sesión válida de SQLAlchemy

    # Luego cerramos correctamente el generador
    try:
        next(db_gen)
    except StopIteration:
        pass

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

    # Aseguramos que el usuario fue añadido a la BD
    user_in_db = db_session.query(User).filter_by(email="new@example.com").first()
    assert user_in_db is not None
    assert user_in_db.username == "new_user"

@patch("src.controllers.auth_controller.validate_email_address")
def test_register_user_email_exists(mock_validate, db_session):
    user = User(username="existing", email="exists@example.com", hashed_password="hashed")
    db_session.add(user)
    db_session.commit()

    result = None
    with pytest.raises(HTTPException) as exc_info:
        result = register_user("another", "exists@example.com", "password123", db_session)

    assert exc_info.value.status_code == 400
    assert "Email already registered" in str(exc_info.value.detail)

@patch("src.controllers.auth_controller.validate_email_address")
def test_register_user_username_exists(mock_validate, db_session):
    user = User(username="existing_user", email="unique@example.com", hashed_password="hashed")
    db_session.add(user)
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

@patch("src.controllers.auth_controller.get_spotify_login_url", return_value="https://spotify.com/login")
@patch("src.controllers.auth_controller.create_access_token", return_value="mocked_token")
def test_login_user_success(mock_create_token, mock_spotify_url, db_session):
    password = "securepassword"
    hashed = hash_password(password)

    user = User(username="testuser", email="user@test.com", hashed_password=hashed)
    db_session.add(user)
    db_session.commit()

    result = login_user("user@test.com", password, db_session)

    assert result["access_token"] == "mocked_token"
    assert result["token_type"] == "bearer"
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
    hashed = hash_password("correctpassword")
    user = User(username="testuser", email="user2@test.com", hashed_password=hashed)
    db_session.add(user)
    db_session.commit()

    with pytest.raises(HTTPException) as exc_info:
        login_user("user2@test.com", "wrongpassword", db_session)

    assert exc_info.value.status_code == 401
    assert "Invalid credentials" in str(exc_info.value.detail)


def generate_token(email: str, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = {"sub": email}
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def test_get_current_user_valid_token(db_session):
    user = User(username="testuser", email="testuser@test.com", hashed_password="hashed")
    db_session.add(user)
    db_session.commit()

    token = generate_token(email=user.email)
    result = get_current_user(token=token, db=db_session)

    assert result.email == user.email
    assert result.username == user.username


def test_get_current_user_invalid_token_format(db_session):
    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token="invalid.token.structure", db=db_session)

    assert exc_info.value.status_code == 401
    assert "credenciales" in exc_info.value.detail


def test_get_current_user_missing_sub(db_session):
    token = jwt.encode({"some": "data"}, SECRET_KEY, algorithm=ALGORITHM)

    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=token, db=db_session)

    assert exc_info.value.status_code == 401
    assert "credenciales" in exc_info.value.detail


def test_get_current_user_user_not_found(db_session):
    token = generate_token(email="ghost@test.com")

    with pytest.raises(HTTPException) as exc_info:
        get_current_user(token=token, db=db_session)

    assert exc_info.value.status_code == 401
    assert "credenciales" in exc_info.value.detail

def test_get_user_info_returns_expected_fields():
    user = User(username="testuser", email="testuser@example.com", hashed_password="hashed")

    result = get_user_info(user)

    assert isinstance(result, dict)
    assert result["username"] == "testuser"
    assert result["email"] == "testuser@example.com"
    assert "username" in result
    assert "email" in result

def create_test_user(db, username="user1", email="user1@test.com", password="hashed"):
    user = User(username=username, email=email, hashed_password=password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def test_update_user_username_success(db_session):
    user = create_test_user(db_session)

    data = SimpleNamespace(username="newuser", email=None, password=None)
    response = update_user_info(data, user, db_session)

    assert response["success"] is True
    assert response["user"]["username"] == "newuser"
    assert response["message"] == "Usuario actualizado correctamente"


def test_update_user_email_success(db_session):
    user = create_test_user(db_session)

    data = SimpleNamespace(username=None, email="newemail@test.com", password=None)
    response = update_user_info(data, user, db_session)

    assert response["success"] is True
    assert response["user"]["email"] == "newemail@test.com"
    assert response["message"] == "Usuario actualizado correctamente"


def test_update_user_email_in_use_raises_error(db_session):
    user1 = create_test_user(db_session, username="user1", email="user1@test.com")
    user2 = create_test_user(db_session, username="user2", email="used@test.com")

    data = SimpleNamespace(username=None, email="used@test.com", password=None)

    with pytest.raises(HTTPException) as exc_info:
        update_user_info(data, user1, db_session)

    assert exc_info.value.status_code == 400
    assert "ya está en uso" in str(exc_info.value.detail)


def test_update_user_password_success(db_session):
    user = create_test_user(db_session)

    data = SimpleNamespace(username=None, email=None, password="newpass123")
    response = update_user_info(data, user, db_session)

    assert response["success"] is True
    assert verify_password("newpass123", user.hashed_password)


def test_update_user_no_changes(db_session):
    user = create_test_user(db_session)

    data = SimpleNamespace(username=None, email=None, password=None)
    response = update_user_info(data, user, db_session)

    assert response["success"] is True
    assert response["message"] == "No se realizaron cambios"

@pytest.fixture
def set_spotify_env(monkeypatch):
    monkeypatch.setenv("SPOTIFY_CLIENT_ID", "fake_client_id")
    monkeypatch.setenv("SPOTIFY_CLIENT_SECRET", "fake_client_secret")
    monkeypatch.setenv("SPOTIFY_REDIRECT_URI", "http://localhost/callback")


def test_get_spotify_login_url_with_email(set_spotify_env):
    email = "user@example.com"
    url = get_spotify_login_url(email)

    assert "https://accounts.spotify.com/authorize" in url
    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query)

    assert query["client_id"][0] == "fake_client_id"
    assert query["redirect_uri"][0] == "http://localhost/callback"
    assert query["state"][0] == email
    assert "user-top-read" in query["scope"][0]


def test_get_spotify_login_url_without_email(set_spotify_env):
    url = get_spotify_login_url()

    parsed = urllib.parse.urlparse(url)
    query = urllib.parse.parse_qs(parsed.query)

    assert "state" not in query or query["state"][0] == ""
    assert query["client_id"][0] == "fake_client_id"
