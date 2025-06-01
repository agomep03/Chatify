import pytest
from unittest.mock import patch, MagicMock
from src.services.lyrircs_service import LyricsFetcher

# --- Test: URL redirigida correctamente desde DuckDuckGo ---
def test_search_song_url_success_with_redirect():
    html_content = '''
        <html><body>
            <a href="https://duckduckgo.com/l/?uddg=https%3A%2F%2Fgenius.com%2FArtist-song-lyrics">link</a>
        </body></html>
    '''
    mock_response = MagicMock(status_code=200, text=html_content)

    with patch("src.services.lyrircs_service.requests.get", return_value=mock_response):
        fetcher = LyricsFetcher()
        result = fetcher.search_song_url("Artist", "Song")

        assert isinstance(result, str)
        assert result == "https://genius.com/Artist-song-lyrics"


# --- Test: Enlace directo a Genius sin redirección ---
def test_search_song_url_success_with_direct_link():
    html_content = '''
        <html><body>
            <a href="https://genius.com/Artist-song-lyrics">Direct link</a>
        </body></html>
    '''
    mock_response = MagicMock(status_code=200, text=html_content)

    with patch("src.services.lyrircs_service.requests.get", return_value=mock_response):
        fetcher = LyricsFetcher()
        result = fetcher.search_song_url("Artist", "Song")

        assert isinstance(result, dict)
        assert result["Type"] == "Redirect"
        assert result["url"] == "https://genius.com/Artist-song-lyrics"


# --- Test: No se encuentra ningún enlace relevante ---
def test_search_song_url_not_found():
    html_content = "<html><body>No relevant links</body></html>"
    mock_response = MagicMock(status_code=200, text=html_content)

    with patch("src.services.lyrircs_service.requests.get", return_value=mock_response):
        fetcher = LyricsFetcher()
        result = fetcher.search_song_url("Unknown", "Nothing")

        assert isinstance(result, dict)
        assert result["Type"] == "Error"
        assert result["url"] == "Canción no encontrada"


# --- Test: DuckDuckGo devuelve captcha (status 202) ---
def test_search_song_url_captcha():
    mock_response = MagicMock(status_code=202, text="")

    with patch("src.services.lyrircs_service.requests.get", return_value=mock_response):
        fetcher = LyricsFetcher()
        result = fetcher.search_song_url("Artist", "Song")

        assert isinstance(result, dict)
        assert result["Type"] == "Captcha"
        assert "duckduckgo.com/html/?q=site:genius.com+" in result["url"]


# --- Test: Error de conexión HTTP al hacer la petición ---
def test_search_song_url_request_fails():
    with patch("src.services.lyrircs_service.requests.get", side_effect=Exception("Connection error")):
        fetcher = LyricsFetcher()
        result = fetcher.search_song_url("Artist", "Song")

        assert isinstance(result, dict)
        assert result["Type"] == "Error"
        assert "Connection error" in result["url"]
