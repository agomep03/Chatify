import logging
import requests
import urllib.parse
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

class LyricsFetcher:
    """
    Servicio para buscar URLs de letras de canciones en Genius utilizando DuckDuckGo como motor de búsqueda.
    """

    def search_song_url(self, artist_name: str, song_title: str) -> dict:
        """
        Busca la URL de la letra de una canción en Genius.

        Args:
            artist_name (str): Nombre del artista.
            song_title (str): Título de la canción.

        Returns:
            dict: Diccionario con claves:
                - 'url' (str): Enlace directo o sugerido.
                - 'Type' (str): 'Redirect', 'Captcha', 'Error' o 'NotFound'.
        """
        logger.info(f"[LyricsFetcher] Buscando la canción '{song_title}' de '{artist_name}' en Genius.")
        try:
            result = self._search_genius_url_duckduckgo(f"{artist_name} {song_title}")
            if result and result.get("url"):
                logger.info(f"[LyricsFetcher] Resultado: {result}")
                return result
            else:
                logger.warning(f"[LyricsFetcher] No se encontró la canción '{song_title}' de '{artist_name}'.")
                return {"url": "Canción no encontrada", "Type": "NotFound"}
        except Exception as e:
            logger.exception(f"[LyricsFetcher] Error al buscar la canción '{song_title}' de '{artist_name}': {e}")
            return {"url": f"Error al buscar la canción: {e}", "Type": "Error"}

    def _search_genius_url_duckduckgo(self, query: str) -> dict:
        """
        Realiza una búsqueda en DuckDuckGo para encontrar un enlace de Genius.

        Args:
            query (str): Término de búsqueda (artista + canción).

        Returns:
            dict: Diccionario con claves:
                - 'url': Enlace a la página de Genius o búsqueda.
                - 'Type': Tipo del resultado ('Redirect', 'Captcha', 'Error').
        """
        search_url = f"https://duckduckgo.com/html/?q=site:genius.com+{query.replace(' ', '+')}"
        headers = {
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/113.0.0.0 Safari/537.36"
            ),
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
                    # Enlace redireccionado
                    if "duckduckgo.com/l/?" in href and "uddg=" in href:
                        parsed = urllib.parse.urlparse(href)
                        query_params = urllib.parse.parse_qs(parsed.query)
                        uddg = query_params.get("uddg")
                        if uddg:
                            return {"url": urllib.parse.unquote(uddg[0]), "Type": "Redirect"}
                    # Enlace directo a Genius
                    elif href.startswith("https://genius.com"):
                        return {"url": href, "Type": "Redirect"}
        elif response.status_code == 202:
            # DuckDuckGo puede haber activado protección por captcha
            return {"url": search_url, "Type": "Captcha"}

        return {"url": "Canción no encontrada", "Type": "Error"}
