import pytest
import importlib
from datetime import timedelta, datetime
from jose import jwt, JWTError

# Setup de test
TEST_SECRET_KEY = "testsecret"
TEST_ALGORITHM = "HS256"

def override_env(monkeypatch):
    monkeypatch.setenv("SECRET_KEY", TEST_SECRET_KEY)
    monkeypatch.setenv("ALGORITHM", TEST_ALGORITHM)
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15")

def load_auth_with_env(monkeypatch):
    override_env(monkeypatch)
    import src.utils.auth as auth_module
    importlib.reload(auth_module)
    return auth_module

def test_hash_and_verify_password(monkeypatch):
    auth = load_auth_with_env(monkeypatch)
    plain = "securepassword123"
    hashed = auth.hash_password(plain)

    assert hashed != plain
    assert auth.verify_password(plain, hashed)
    assert not auth.verify_password("wrongpassword", hashed)

def test_create_access_token(monkeypatch):
    auth = load_auth_with_env(monkeypatch)
    data = {"sub": "testuser"}
    token = auth.create_access_token(data)

    decoded = jwt.decode(token, TEST_SECRET_KEY, algorithms=[TEST_ALGORITHM])
    assert decoded["sub"] == "testuser"
    assert "exp" in decoded

def test_create_access_token_with_custom_expiration(monkeypatch):
    auth = load_auth_with_env(monkeypatch)
    data = {"sub": "userX"}
    expires = timedelta(minutes=5)
    token = auth.create_access_token(data, expires_delta=expires)

    decoded = jwt.decode(token, TEST_SECRET_KEY, algorithms=[TEST_ALGORITHM])
    assert decoded["sub"] == "userX"

def test_invalid_token_raises_error(monkeypatch):
    load_auth_with_env(monkeypatch)  # Ensure consistent environment
    fake_token = jwt.encode({"sub": "X"}, "wrongkey", algorithm=TEST_ALGORITHM)

    with pytest.raises(JWTError):
        jwt.decode(fake_token, TEST_SECRET_KEY, algorithms=[TEST_ALGORITHM])
