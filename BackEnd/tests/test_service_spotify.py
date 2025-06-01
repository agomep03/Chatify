import pytest
from fastapi import Request, HTTPException
from unittest.mock import MagicMock, patch
from sqlalchemy.exc import IntegrityError
from src.services.spotify_service import login_spotify
from src.models.auth_model import User


def mock_request(code="valid_code", state="user@test.com"):
    mock = MagicMock()
    mock.query_params.get.side_effect = lambda k: {"code": code, "state": state}.get(k)
    return mock


@pytest.fixture
def mock_user():
    user = MagicMock(spec=User)
    user.email = "user@test.com"
    return user


def test_login_success(mock_user):
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user

    token_response = {
        "access_token": "token123",
        "refresh_token": "refresh123",
        "expires_in": 3600
    }

    user_info_response = {
        "id": "spotify_user_123"
    }

    with patch("src.services.spotify_service.requests.post") as mock_post, \
         patch("src.services.spotify_service.requests.get") as mock_get:
        
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = token_response

        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = user_info_response

        result = login_spotify(mock_request(), mock_db)
        assert result["success"] is True
        mock_db.commit.assert_called_once()


def test_login_missing_params():
    with pytest.raises(HTTPException) as exc_info:
        login_spotify(mock_request(code=None), MagicMock())
    assert exc_info.value.status_code == 400


def test_token_request_failure():
    with patch("src.services.spotify_service.requests.post") as mock_post:
        mock_post.return_value.status_code = 400
        mock_post.return_value.text = "invalid_request"

        with pytest.raises(HTTPException) as exc_info:
            login_spotify(mock_request(), MagicMock())
        assert exc_info.value.status_code == 502


def test_no_access_token():
    with patch("src.services.spotify_service.requests.post") as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {}  # no access_token

        with pytest.raises(HTTPException) as exc_info:
            login_spotify(mock_request(), MagicMock())
        assert exc_info.value.status_code == 502


def test_user_info_failure():
    token_response = {
        "access_token": "token123",
        "refresh_token": "refresh123",
        "expires_in": 3600
    }

    with patch("src.services.spotify_service.requests.post") as mock_post, \
         patch("src.services.spotify_service.requests.get") as mock_get:

        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = token_response

        mock_get.return_value.status_code = 403

        with pytest.raises(HTTPException) as exc_info:
            login_spotify(mock_request(), MagicMock())
        assert exc_info.value.status_code == 502


def test_user_not_found():
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = None

    token_response = {
        "access_token": "token123",
        "refresh_token": "refresh123",
        "expires_in": 3600
    }

    user_info_response = {"id": "spotify_user_123"}

    with patch("src.services.spotify_service.requests.post") as mock_post, \
         patch("src.services.spotify_service.requests.get") as mock_get:

        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = token_response

        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = user_info_response

        with pytest.raises(HTTPException) as exc_info:
            login_spotify(mock_request(), mock_db)
        assert exc_info.value.status_code == 404


def test_integrity_error_duplicate_key(mock_user):
    mock_db = MagicMock()
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user

    token_response = {
        "access_token": "token123",
        "refresh_token": "refresh123",
        "expires_in": 3600
    }
    user_info_response = {"id": "spotify_user_123"}

    integrity_error = IntegrityError("duplicate", None, None)
    integrity_error.orig = MagicMock()
    integrity_error.orig.args = ("duplicate key value violates unique constraint",)

    with patch("src.services.spotify_service.requests.post") as mock_post, \
         patch("src.services.spotify_service.requests.get") as mock_get:

        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = token_response

        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = user_info_response

        mock_db.commit.side_effect = integrity_error

        with pytest.raises(HTTPException) as exc_info:
            login_spotify(mock_request(), mock_db)
        assert exc_info.value.status_code == 409


def test_unexpected_exception(mock_user):
    mock_db = MagicMock()
    mock_db.query.side_effect = Exception("Something broke")

    with patch("BackEnd.src.services.spotify_service.requests.post") as mock_post:
        mock_post.return_value.status_code = 200
        mock_post.return_value.json.return_value = {
            "access_token": "token123",
            "refresh_token": "refresh123",
            "expires_in": 3600
        }

        with patch("BackEnd.src.services.spotify_service.requests.get") as mock_get:
            mock_get.return_value.status_code = 200
            mock_get.return_value.json.return_value = {"id": "spotify_user_123"}

            with pytest.raises(HTTPException) as exc_info:
                login_spotify(mock_request(), mock_db)
            assert exc_info.value.status_code == 500
