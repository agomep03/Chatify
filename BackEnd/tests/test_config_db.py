import os
import importlib
import pytest

def test_missing_database_url_raises_runtime_error(monkeypatch):
    # Elimina DATABASE_URL si existe
    monkeypatch.delenv("DATABASE_URL", raising=False)

    # Forzamos recarga del módulo db
    with pytest.raises(RuntimeError, match="DATABASE_URL es requerida para conectarse a la base de datos"):
        import BackEnd.src.config.db as db_module
        importlib.reload(db_module)
