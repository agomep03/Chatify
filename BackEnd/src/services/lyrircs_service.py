import os
import logging
import requests

logger = logging.getLogger(__name__)

class LyricsFetcher:
    def __init__(self, client_access_token=None):
        if client_access_token is None:
            client_access_token = os.getenv("GENIUS_CLIENT_ACCESS_TOKEN")
        if not client_access_token:
            logger.error("[LyricsFetcher] No se proporcionó un token de acceso para Genius.")
            raise ValueError("Token de acceso para Genius no proporcionado.")
        self.client_access_token = client_access_token

    def get_song_url(self, message):
        headers = {'Authorization': f'Bearer {self.client_access_token}'}
        url = "https://api.genius.com/search"
        params = {'q': message}

        response = requests.get(url, headers=headers, params=params)

        if response.status_code == 200:
            data = response.json()
            hits = data['response']['hits']
            if hits:
                song_path = hits[0]['result']['path']
                song_url = f"https://genius.com{song_path}"
                return song_url
            else:
                return "No se encontró la canción."
        else:
            logger.error(f"Error en la solicitud: {response.status_code} - {response.text}")
            return f"Error en la solicitud: {response.status_code} - {response.text}"
