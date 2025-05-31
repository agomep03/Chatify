import os
import importlib
import logging
import pytest

def test_missing_database_url_raises_runtime_error(monkeypatch):
    # Elimina DATABASE_URL si existe
    monkeypatch.delenv("DATABASE_URL", raising=False)

    # Forzamos recarga del módulo db
    with pytest.raises(RuntimeError, match="DATABASE_URL es requerida para conectarse a la base de datos"):
        import BackEnd.src.config.db as db_module
        importlib.reload(db_module)

def test_secret_key_warning(caplog, monkeypatch):
    monkeypatch.delenv("SECRET_KEY", raising=False)  # Elimina SECRET_KEY del entorno

    caplog.set_level(logging.WARNING)

    import src.config.dotenv_config as config_module
    importlib.reload(config_module)

    assert "SECRET_KEY no definida en .env" in caplog.text

def test_access_token_expire_minutes_error(caplog, monkeypatch):
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "no_es_numero")

    caplog.set_level(logging.ERROR)

    import src.config.dotenv_config as config_module
    importlib.reload(config_module)

    assert "ACCESS_TOKEN_EXPIRE_MINUTES debe ser un número entero" in caplog.text
