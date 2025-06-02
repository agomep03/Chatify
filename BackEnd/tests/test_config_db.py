# tests/test_config_env_and_db.py

import os
import importlib
import logging
import pytest


# --- Test: error si falta DATABASE_URL ---
def test_missing_database_url_raises_runtime_error(monkeypatch):
    """
    Debe lanzar RuntimeError si DATABASE_URL no está definida.
    """
    monkeypatch.delenv("DATABASE_URL", raising=False)

    with pytest.raises(RuntimeError, match="DATABASE_URL es requerida para conectarse a la base de datos"):
        import BackEnd.src.config.db as db_module
        importlib.reload(db_module)


# --- Test: ACCESS_TOKEN_EXPIRE_MINUTES mal definido ---
def test_access_token_expire_minutes_error(caplog, monkeypatch):
    """
    Debe loguear error si ACCESS_TOKEN_EXPIRE_MINUTES no es numérico.
    """
    monkeypatch.setenv("ACCESS_TOKEN_EXPIRE_MINUTES", "no_es_numero")
    caplog.set_level(logging.ERROR)

    import src.config.dotenv_config as config_module
    importlib.reload(config_module)

    assert "ACCESS_TOKEN_EXPIRE_MINUTES debe ser un número entero" in caplog.text
