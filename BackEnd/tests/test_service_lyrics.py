import pytest
from unittest.mock import patch, MagicMock
from src.services.lyrircs_service import LyricsFetcher


def test_search_song_url_success_with_redirect():
    html_content = '''
        <html><body>
            <a href="https://duckduckgo.com/l/?uddg=https%3A%2F%2Fgenius.com%2FArtist-song-lyrics">link</a>
        </body></html>
    '''
    mock_response = MagicMock(status_code=200, text=html_content)
    with patch("src.services.lyrircs_service.requests.get", return_value=mock_response):
        fetcher = LyricsFetcher()
        url = fetcher.search_song_url("Artist", "Song")
        assert url == "https://genius.com/Artist-song-lyrics"


def test_search_song_url_success_with_direct_link():
    html_content = '''
        <html><body>
            <a href="https://genius.com/Artist-song-lyrics">Direct link</a>
        </body></html>
    '''
    mock_response = MagicMock(status_code=200, text=html_content)
    with patch("src.services.lyrircs_service.requests.get", return_value=mock_response):
        fetcher = LyricsFetcher()
        data = fetcher.search_song_url("Artist", "Song")
        assert isinstance(data, dict)
        assert data["Type"] == "Redirect"
        assert data["url"] == "https://genius.com/Artist-song-lyrics"


def test_search_song_url_not_found():
    html_content = "<html><body>No relevant links</body></html>"
    mock_response = MagicMock(status_code=200, text=html_content)
    with patch("src.services.lyrircs_service.requests.get", return_value=mock_response):
        fetcher = LyricsFetcher()
        data = fetcher.search_song_url("Unknown", "Nothing")
        assert isinstance(data, dict)
        assert data["Type"] == "Error"
        assert data["url"] == "Canción no encontrada"


def test_search_song_url_captcha():
    mock_response = MagicMock(status_code=202, text="")
    with patch("src.services.lyrircs_service.requests.get", return_value=mock_response):
        fetcher = LyricsFetcher()
        data = fetcher.search_song_url("Artist", "Song")
        assert isinstance(data, dict)
        assert data["Type"] == "Captcha"
        assert "duckduckgo.com/html/?q=site:genius.com+" in data["url"]


def test_search_song_url_request_fails():
    with patch("src.services.lyrircs_service.requests.get", side_effect=Exception("Connection error")):
        fetcher = LyricsFetcher()
        url = fetcher.search_song_url("Artist", "Song")
        assert isinstance(url, str)
        assert "Error al buscar la canción" in url
        assert "Connection error" in url
