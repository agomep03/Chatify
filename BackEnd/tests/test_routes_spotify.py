import pytest
from fastapi import status
import json
from src.controllers.auth_controller import get_current_user

import pytest
from fastapi import status

import pytest
from fastapi import status
from unittest.mock import patch

@pytest.mark.asyncio
async def test_auto_generate_playlist(client_with_user, monkeypatch):
    client, user = client_with_user

    # Mock del token válido
    monkeypatch.setattr(
        "src.controllers.spotify_controller.get_valid_spotify_token",
        lambda u, db: "valid_token_mock"
    )

    # Mock de búsqueda de canciones
    class MockResponseGet:
        def __init__(self):
            self.status_code = 200
        def json(self):
            return {
                "tracks": {
                    "items": [{"uri": "spotify:track:123"}]
                }
            }

    monkeypatch.setattr("requests.get", lambda *args, **kwargs: MockResponseGet())

    # Mock de creación de playlist y añadir canciones
    class MockResponsePost:
        def __init__(self, status_code=201):
            self.status_code = status_code
            self._json = {"id": "fake_playlist_id"}
            self.text = ""
        def json(self):
            return self._json

    def mock_post(url, headers=None, json=None):
        return MockResponsePost()

    monkeypatch.setattr("requests.post", mock_post)

    # 🔧 Fix: mock async para generate_playlist_auto
    async def mock_generate_playlist_auto(prompt, user, db):
        return {"playlist_id": "fake_playlist_id"}

    monkeypatch.setattr(
        "src.routes.spotify_routes.generate_playlist_auto",
        mock_generate_playlist_auto
    )

    headers = {"Authorization": "Bearer valid_token_mock"}
    response = client.post("/spotify/playlists/auto-generate?prompt=some+prompt", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    json_resp = response.json()
    assert "playlist_url" in json_resp
    assert json_resp["playlist_url"]["playlist_id"] == "fake_playlist_id"

def test_get_playlists(client_with_user, monkeypatch):
    client, user = client_with_user

    # MOCK: Token válido siempre
    monkeypatch.setattr(
        "src.controllers.spotify_controller.get_valid_spotify_token",
        lambda u, db: "valid_token_mock"
    )

    # MOCK: requests.get para devolver una playlist con tracks
    class MockPlaylistResponse:
        def __init__(self):
            self.status_code = 200
        def json(self):
            return {
                "items": [{
                    "id": "playlist1",
                    "name": "Mi Playlist",
                    "description": "Descripción",
                    "images": [{"url": "image_url"}]
                }],
                "next": None
            }

    class MockTracksResponse:
        def __init__(self):
            self.status_code = 200
        def json(self):
            return {
                "items": [{
                    "track": {
                        "name": "Canción 1",
                        "artists": [{"name": "Artista"}],
                        "uri": "spotify:track:123"
                    }
                }]
            }

    def mock_requests_get(url, headers=None):
        if "playlists" in url and "tracks" not in url:
            return MockPlaylistResponse()
        elif "tracks" in url:
            return MockTracksResponse()
        return MockPlaylistResponse()

    monkeypatch.setattr("requests.get", mock_requests_get)

    # Hacer la petición real al endpoint
    headers = {"Authorization": "Bearer valid_token_mock"}
    response = client.get("/spotify/playlists", headers=headers)

    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "playlists" in data
    assert len(data["playlists"]) == 1
    assert data["playlists"][0]["name"] == "Mi Playlist"

def test_check_spotify_connected_true(client_with_user):
    client, _ = client_with_user

    response = client.get("/spotify/auth/spotify/connected")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"connected": True}

def test_check_spotify_connected_unauthenticated(client_no_auth):
    response = client_no_auth.get("/spotify/auth/spotify/connected")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}

def test_check_spotify_connected_false(client_with_user_without_spotify):
    client = client_with_user_without_spotify
    response = client.get("/spotify/auth/spotify/connected")
    assert response.status_code == 200
    assert response.json() == {"connected": False}

def test_update_playlist_endpoint(client_with_user, monkeypatch):
    client, user = client_with_user

    # 🔧 Arreglo: eliminar el argumento 'image_base64' del mock si no se usa
    def mock_update_playlist(playlist_id, title, description, user, db):
        assert playlist_id == "123"
        assert title == "New Title"
        assert description == "New Description"
        return {"updated": True}

    def mock_get_current_user():
        return user

    monkeypatch.setattr("src.routes.spotify_routes.update_playlist", mock_update_playlist)
    monkeypatch.setattr("src.routes.spotify_routes.get_current_user", mock_get_current_user)

    data = {
        "title": "New Title",
        "description": "New Description"
    }

    response = client.put("/spotify/playlists/123/update", json=data)
    assert response.status_code == 200
    assert response.json() == {"updated": True}


def test_remove_tracks_playlist(client_with_user, monkeypatch):
    client, user = client_with_user

    def mock_remove_tracks_from_playlist(playlist_id, data, u):
        assert playlist_id == "playlist123"
        assert isinstance(data.tracks, list)
        assert u.username == user.username
        return {"removed": True}

    monkeypatch.setattr(
        "src.routes.spotify_routes.remove_tracks_from_playlist",
        mock_remove_tracks_from_playlist
    )

    payload = {
        "tracks": [{"uri": "spotify:track:123"}],
        "snapshot_id": "snapshot123"
    }
    response = client.request(
        "DELETE",
        "/spotify/playlists/playlist123/tracks",
        json=payload
    )
    
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"removed": True}


def test_get_lyrics(client_with_user, monkeypatch):
    client, _ = client_with_user

    # 🔧 Fix: incluir search_song_url en el mock
    class DummyLyricsFetcher:
        def search_song_url(self, artist, song):
            assert artist == "Artist"
            assert song == "Song"
            return "https://dummy.lyrics.url"

    monkeypatch.setattr(
        "src.routes.spotify_routes.LyricsFetcher",
        lambda: DummyLyricsFetcher()
    )

    response = client.get("/spotify/lyrics?artist=Artist&song=Song")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "url": "https://dummy.lyrics.url"
    }

def test_unfollow_playlist(client_with_user, monkeypatch):
    client, user = client_with_user

    def mock_unfollow_playlist_logic(playlist_id, u):
        assert playlist_id == "playlist123"
        assert u.username == user.username
        return {"unfollowed": True}

    monkeypatch.setattr(
        "src.routes.spotify_routes.unfollow_playlist_logic",
        mock_unfollow_playlist_logic
    )

    response = client.delete("/spotify/playlists/playlist123/unfollow")
    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {"unfollowed": True}

def test_get_lyrics(client_with_user):
    client, _ = client_with_user

    with patch("src.routes.spotify_routes.LyricsFetcher") as MockFetcher:
        instance = MockFetcher.return_value
        instance.search_song_url.return_value = "https://dummy.lyrics.url"

        response = client.get("/spotify/lyrics?artist=Artist&song=Song")

    assert response.status_code == status.HTTP_200_OK
    assert response.json() == {
        "url": "https://dummy.lyrics.url"
    }