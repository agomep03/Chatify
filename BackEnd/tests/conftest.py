import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from BackEnd.main import app as original_app
from BackEnd.src.routes.auth_routes import get_current_user, get_db
from BackEnd.src.config import db


TEST_DATABASE_URL = "sqlite:///:memory:"
db.engine = create_engine(
    TEST_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    echo=False
)


@pytest.fixture
def app(db_session):
    new_app = FastAPI()
    new_app.include_router(original_app.router)

    # Override get_db para que use la sesión de la fixture
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    new_app.dependency_overrides[get_db] = override_get_db
    new_app.dependency_overrides[get_current_user] = lambda: FakeUser(1, "user1", "user1@test.com")
    return new_app

@pytest.fixture(scope="function")
def db_session():
    connection = db.engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection)
    db.Base.metadata.drop_all(bind=connection)
    db.Base.metadata.create_all(bind=connection)
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()
        db.Base.metadata.drop_all(bind=connection)


@pytest.fixture(autouse=True)
def reset_database():
    db.Base.metadata.drop_all(bind=db.engine)
    db.Base.metadata.create_all(bind=db.engine)


class FakeUser:
    def __init__(self, user_id, username=None, email=None):
        self.id = user_id
        self.username = username or f"testuser{user_id}"
        self.email = email or f"testuser{user_id}@example.com"

def build_test_client(user_id, username, email):
    db.Base.metadata.drop_all(bind=db.engine)
    db.Base.metadata.create_all(bind=db.engine)
    app_instance = FastAPI()
    app_instance.include_router(original_app.router)
    app_instance.dependency_overrides[get_current_user] = lambda: FakeUser(user_id, username, email)
    return TestClient(app_instance)

@pytest.fixture
def client():
    return build_test_client(1, "user1", "user1@test.com")

@pytest.fixture
def client2():
    return build_test_client(2, "user2", "user2@test.com")


@pytest.fixture
def client_no_auth(app):
    app.dependency_overrides = {}
    with TestClient(app) as c:
        yield c

