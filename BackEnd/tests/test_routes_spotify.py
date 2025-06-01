import pytest
from fastapi import status
from unittest.mock import patch


# --- Test: Autogenerar playlist exitosamente ---
@pytest.mark.asyncio
async def test_auto_generate_playlist(client_with_user, monkeypatch):
    client, user = client_with_user

    monkeypatch.setattr("src.controllers.spotify_controller.get_valid_spotify_token", lambda u, db: "valid_token_mock")

    class MockResponseGet:
        status_code = 200
        def json(self): return {"tracks": {"items": [{"uri": "spotify:track:123"}]}}

    monkeypatch.setattr("requests.get", lambda *args, **kwargs: MockResponseGet())

    class MockResponsePost:
        def __init__(self, status_code=201):
            self.status_code = status_code
            self._json = {"id": "fake_playlist_id"}
            self.text = ""
        def json(self): return self._json

    monkeypatch.setattr("requests.post", lambda *args, **kwargs: MockResponsePost())

    async def mock_generate(prompt, user, db):
        return {"playlist_id": "fake_playlist_id"}

    monkeypatch.setattr("src.routes.spotify_routes.generate_playlist_auto", mock_generate)

    headers = {"Authorization": "Bearer valid_token_mock"}
    response = client.post("/spotify/playlists/auto-generate?prompt=some+prompt", headers=headers)

    assert response.status_code == 200
    assert response.json()["playlist_url"]["playlist_id"] == "fake_playlist_id"


# --- Test: Obtener playlists del usuario ---
def test_get_playlists(client_with_user, monkeypatch):
    client, user = client_with_user

    monkeypatch.setattr("src.controllers.spotify_controller.get_valid_spotify_token", lambda u, db: "valid_token_mock")

    class MockPlaylistResponse:
        status_code = 200
        def json(self): return {"items": [{"id": "playlist1", "name": "Mi Playlist", "description": "Descripción", "images": [{"url": "image_url"}]}], "next": None}

    class MockTracksResponse:
        status_code = 200
        def json(self): return {"items": [{"track": {"name": "Canción 1", "artists": [{"name": "Artista"}], "uri": "spotify:track:123"}}]}

    def mock_requests_get(url, headers=None):
        return MockPlaylistResponse() if "tracks" not in url else MockTracksResponse()

    monkeypatch.setattr("requests.get", mock_requests_get)

    headers = {"Authorization": "Bearer valid_token_mock"}
    response = client.get("/spotify/playlists", headers=headers)

    assert response.status_code == 200
    assert response.json()["playlists"][0]["name"] == "Mi Playlist"


# --- Test: Usuario conectado a Spotify ---
def test_check_spotify_connected_true(client_with_user):
    client, _ = client_with_user
    response = client.get("/spotify/auth/spotify/connected")
    assert response.status_code == 200
    assert response.json() == {"connected": True}


# --- Test: Usuario no autenticado ---
def test_check_spotify_connected_unauthenticated(client_no_auth):
    response = client_no_auth.get("/spotify/auth/spotify/connected")
    assert response.status_code == 401
    assert response.json() == {"detail": "Not authenticated"}


# --- Test: Usuario sin cuenta Spotify conectada ---
def test_check_spotify_connected_false(client_with_user_without_spotify):
    client = client_with_user_without_spotify
    response = client.get("/spotify/auth/spotify/connected")
    assert response.status_code == 200
    assert response.json() == {"connected": False}


# --- Test: Actualizar una playlist ---
def test_update_playlist_endpoint(client_with_user, monkeypatch):
    client, user = client_with_user

    def mock_update(playlist_id, title, description, user, db):
        assert playlist_id == "123"
        assert title == "New Title"
        assert description == "New Description"
        return {"updated": True}

    monkeypatch.setattr("src.routes.spotify_routes.update_playlist", mock_update)
    monkeypatch.setattr("src.routes.spotify_routes.get_current_user", lambda: user)

    data = {"title": "New Title", "description": "New Description"}
    response = client.put("/spotify/playlists/123/update", json=data)

    assert response.status_code == 200
    assert response.json() == {"updated": True}


# --- Test: Eliminar canciones de una playlist ---
def test_remove_tracks_playlist(client_with_user, monkeypatch):
    client, user = client_with_user

    def mock_remove(playlist_id, data, u):
        assert playlist_id == "playlist123"
        assert isinstance(data.tracks, list)
        assert u.username == user.username
        return {"removed": True}

    monkeypatch.setattr("src.routes.spotify_routes.remove_tracks_from_playlist", mock_remove)

    payload = {
        "tracks": [{"uri": "spotify:track:123"}],
        "snapshot_id": "snapshot123"
    }

    response = client.request("DELETE", "/spotify/playlists/playlist123/tracks", json=payload)
    assert response.status_code == 200
    assert response.json() == {"removed": True}

# --- Test: Obtener URL de letras de canción (mock patch) ---
def test_get_lyrics_with_patch(client_with_user):
    client, _ = client_with_user

    with patch("src.routes.spotify_routes.LyricsFetcher") as MockFetcher:
        instance = MockFetcher.return_value
        instance.search_song_url.return_value = "https://dummy.lyrics.url"

        response = client.get("/spotify/lyrics?artist=Artist&song=Song")

        assert response.status_code == 200
        assert response.json() == "https://dummy.lyrics.url"


# --- Test: Dejar de seguir una playlist ---
def test_unfollow_playlist(client_with_user, monkeypatch):
    client, user = client_with_user

    def mock_unfollow(playlist_id, u):
        assert playlist_id == "playlist123"
        assert u.username == user.username
        return {"unfollowed": True}

    monkeypatch.setattr("src.routes.spotify_routes.unfollow_playlist_logic", mock_unfollow)

    response = client.delete("/spotify/playlists/playlist123/unfollow")

    assert response.status_code == 200
    assert response.json() == {"unfollowed": True}
