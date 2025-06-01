import os
import logging
import lyricsgenius
import requests
from bs4 import BeautifulSoup
import urllib.parse

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
            song = self.search_genius_url_duckduckgo(f"{artist_name} {song_title}")
            if song:
                return song
            else:
                logger.warning(f"[LyricsFetcher] No se encontró la canción '{song_title}' de '{artist_name}'.")
                return "No se encontró la canción."
        except Exception as e:
            logger.exception(f"[LyricsFetcher] Error al buscar la canción '{song_title}' de '{artist_name}': {e}")
            return f"Error al buscar la canción: {e}"

    def search_genius_url_duckduckgo(self, query):
        search_url = f"https://duckduckgo.com/html/?q=site:genius.com+{query.replace(' ', '+')}"
        logger.info(f"[LyricsFetcher] Realizando búsqueda en DuckDuckGo: {search_url}")
        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        response = requests.get(search_url, headers=headers)

        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            for a in soup.find_all("a"):
                href = a.get("href")
                if href and "genius.com" in href:
                    logger.info(f"[LyricsFetcher] Analizando enlace: {href}")
                    # Si es un enlace de redirección de DuckDuckGo, extrae el parámetro uddg
                    if "duckduckgo.com/l/?" in href and "uddg=" in href:
                        parsed = urllib.parse.urlparse(href)
                        query_params = urllib.parse.parse_qs(parsed.query)
                        uddg = query_params.get("uddg")
                        if uddg:
                            url = urllib.parse.unquote(uddg[0])
                            logger.info(f"[LyricsFetcher] Enlace directo encontrado: {url}")
                            return url
                    # Si es un enlace directo, lo devuelve tal cual
                    elif href.startswith("https://genius.com"):
                        logger.info(f"[LyricsFetcher] Enlace directo encontrado: {href}")
                        return href
        return "No se encontró la canción en Genius."
