import logging
import requests
from bs4 import BeautifulSoup
import urllib.parse

logger = logging.getLogger(__name__)

class LyricsFetcher:
    def search_song_url(self, artist_name, song_title):
        """Busca el enlace directo de Genius para una canción usando DuckDuckGo."""
        logger.info(f"[LyricsFetcher] Buscando la canción '{song_title}' de '{artist_name}' en Genius.")
        try:
            logger.info("01")
            url = self._search_genius_url_duckduckgo(f"{artist_name} {song_title}")
            logger.info(url)
            logger.info("02")
            if url:
                return url
            else:
                logger.warning(f"[LyricsFetcher] No se encontró la canción '{song_title}' de '{artist_name}'.")
                return "No se encontró la canción."
        except Exception as e:
            logger.exception(f"[LyricsFetcher] Error al buscar la canción '{song_title}' de '{artist_name}': {e}")
            return f"Error al buscar la canción: {e}"

    def _search_genius_url_duckduckgo(self, query):
        search_url = f"https://duckduckgo.com/html/?q=site:genius.com+{query.replace(' ', '+')}"
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
            "Accept-Language": "es-ES,es;q=0.9,en;q=0.8",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Referer": "https://duckduckgo.com/",
            "DNT": "1",
        }
        response = requests.get(search_url, headers=headers)
        logger.info(f"[LyricsFetcher] Respuesta de DuckDuckGo: {response.status_code}")
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            for a in soup.find_all("a"):
                href = a.get("href")
                if href and "genius.com" in href:
                    # Si es un enlace de redirección de DuckDuckGo, extrae el parámetro uddg
                    if "duckduckgo.com/l/?" in href and "uddg=" in href:
                        parsed = urllib.parse.urlparse(href)
                        query_params = urllib.parse.parse_qs(parsed.query)
                        uddg = query_params.get("uddg")
                        if uddg:
                            return urllib.parse.unquote(uddg[0])
                    # Si es un enlace directo, lo devuelve tal cual
                    elif href.startswith("https://genius.com"):
                        return {"url": href, "Type": "Redirect"}
        elif response.status_code == 202:
            # Detectó captcha, devuelve URL búsqueda
            return {"url": search_url, "Type": "Captcha"}

        return {"url": "Canción no encontrada", "Type": "Error"}
