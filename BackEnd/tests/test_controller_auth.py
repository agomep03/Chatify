import pytest
from src.controllers import auth_controller
from fastapi import HTTPException
from src.controllers.auth_controller import register_user
import pytest
from unittest.mock import patch

from BackEnd.src.controllers.auth_controller import register_user
from BackEnd.src.models.auth_model import User

def test_get_db_session_lifecycle(monkeypatch):
    # Simulamos una sesión mock para controlar close()
    class DummySession:
        def __init__(self):
            self.closed = False
        def close(self):
            self.closed = True

    dummy_session = DummySession()
    
    # Monkeypatch para que SessionLocal devuelva nuestro dummy
    monkeypatch.setattr(auth_controller, "SessionLocal", lambda: dummy_session)

    gen = auth_controller.get_db()
    session = next(gen)  # Obtener la sesión yieldada
    
    assert session is dummy_session
    assert not session.closed

    # Terminar el generator para que cierre la sesión
    try:
        next(gen)
    except StopIteration:
        pass

    assert session.closed

def test_validate_email_address_valid(caplog, monkeypatch):
    valid_email = "test@example.com"
    caplog.set_level("INFO")

    # Mockeamos validate_email para que no lance excepción
    def mock_validate_email(email):
        return True

    monkeypatch.setattr(auth_controller, "validate_email", mock_validate_email)
    monkeypatch.setattr("src.controllers.auth_controller.validate_email", mock_validate_email)

    result = auth_controller.validate_email_address(valid_email)

    assert result is True
    assert f"Validando email: {valid_email}" in caplog.text
    assert f"Email válido: {valid_email}" in caplog.text

def test_validate_email_address_invalid(caplog):
    invalid_email = "invalid-email"
    caplog.set_level("ERROR")

    with pytest.raises(HTTPException) as excinfo:
        auth_controller.validate_email_address(invalid_email)

    assert excinfo.value.status_code == 400
    assert "Email inválido" in caplog.text or "Invalid email" in str(excinfo.value.detail)

