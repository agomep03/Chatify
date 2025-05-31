import os
import logging
import lyricsgenius

logger = logging.getLogger(__name__)

class LyricsFetcher:
    def __init__(self, client_access_token=None):
        if client_access_token is None:
            client_access_token = os.getenv("GENIUS_CLIENT_ACCESS_TOKEN")
        if not client_access_token:
            logger.error("[LyricsFetcher] No se proporcionó un token de acceso para Genius.")
            raise ValueError("Token de acceso para Genius no proporcionado.")
        
        self.genius = lyricsgenius.Genius(client_access_token)
        self.genius.remove_section_headers = True
        logger.info("[LyricsFetcher] Cliente Genius inicializado correctamente.")

    def search_song_url(self, artist_name, song_title):
        logger.info(f"[LyricsFetcher] Buscando URL para: '{song_title}' por {artist_name}")
        try:
            song = self.genius.search_song(song_title, artist_name)
            if song:
                logger.info(f"[LyricsFetcher] Canción encontrada: {song.title} de {song.artist}")
                return song.url
            else:
                logger.warning(f"[LyricsFetcher] No se encontró la canción '{song_title}' de '{artist_name}'.")
                return "No se encontró la canción."
        except Exception as e:
            logger.exception(f"[LyricsFetcher] Error al buscar la canción '{song_title}' de '{artist_name}': {e}")
            return f"Error al buscar la canción: {e}"
