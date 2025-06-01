import os
import sys
from dotenv import load_dotenv

from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
import pytest

# Cargar variables de entorno desde .env
dotenv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.env"))
load_dotenv(dotenv_path=dotenv_path)

# Añadir carpeta padre al path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Importar app y dependencias
from main import app as original_app
from src.routes.auth_routes import get_current_user, get_db
from src.config.db import Base, engine

from src.models.auth_model import User
from src.models.conversation_model import Conversation
from src.models.message_model import Message


class FakeUser:
    def __init__(
        self,
        user_id,
        username=None,
        email=None,
        access_token="fake_access_token",
        refresh_token="fake_refresh_token",
        spotify_user_id="fake_spotify_user_id",
        token_expiry_minutes=60
    ):
        self.id = user_id
        self.username = username or f"user{user_id}"
        self.email = email or f"user{user_id}@test.com"
        self.spotify_access_token = access_token
        self.spotify_refresh_token = refresh_token
        self.spotify_user_id = spotify_user_id
        self.spotify_token_expires_at = datetime.utcnow() + timedelta(minutes=token_expiry_minutes)


@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()

    # 🔄 Asegura que todas las tablas existen antes de ejecutar tests
    Base.metadata.drop_all(bind=connection)
    connection.commit()

    Base.metadata.create_all(bind=connection)
    connection.commit()

    transaction = connection.begin()
    session = Session(bind=connection)

    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture
def app(db_session):
    original_app.dependency_overrides[get_db] = lambda: db_session
    return original_app


@pytest.fixture
def client(app):
    app.dependency_overrides[get_current_user] = lambda: FakeUser(1, "user1", "user1@test.com")
    with TestClient(app) as c:
        yield c


@pytest.fixture
def client2(app):
    app.dependency_overrides[get_current_user] = lambda: FakeUser(2, "user2", "user2@test.com")
    with TestClient(app) as c:
        yield c


@pytest.fixture
def client_no_auth(app):
    app.dependency_overrides[get_current_user] = lambda: None
    with TestClient(app) as c:
        yield c


@pytest.fixture
def authenticated_user():
    return FakeUser(
        user_id=1,
        username="testuser",
        email="testuser@example.com",
        access_token="valid_access_token",
        refresh_token="valid_refresh_token",
        spotify_user_id="spotify_test_user",
        token_expiry_minutes=60
    )


@pytest.fixture
def client_with_user(app, authenticated_user):
    app.dependency_overrides[get_current_user] = lambda: authenticated_user
    with TestClient(app) as c:
        yield c, authenticated_user


@pytest.fixture
def user_without_spotify():
    return FakeUser(
        user_id=1,
        username="testuser",
        email="testuser@example.com",
        access_token=None,
        refresh_token="valid_refresh_token",
        spotify_user_id=None,
        token_expiry_minutes=60
    )


@pytest.fixture
def client_with_user_without_spotify(app, user_without_spotify):
    app.dependency_overrides[get_current_user] = lambda: user_without_spotify
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
