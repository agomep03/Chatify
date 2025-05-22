import lyricsgenius

class LyricsFetcher:
    def __init__(self, client_access_token):
        # Inicializamos el cliente de Genius con tu token
        self.genius = lyricsgenius.Genius(client_access_token)
        # Opcional: eliminar encabezados tipo [Verse], [Chorus] para limpiar letras
        self.genius.remove_section_headers = True
    
    def search_song_lyrics(self, artist_name, song_title):
        """
        Busca una canción y devuelve la letra.
        """
        try:
            song = self.genius.search_song(song_title, artist_name)
            if song:
                return song.lyrics
            else:
                return "No se encontró la canción."
        except Exception as e:
            return f"Error al buscar la canción: {e}"

    def search_artist_top_songs(self, artist_name, max_songs=5):
        """
        Busca las canciones principales de un artista y devuelve una lista con títulos y letras.
        """
        try:
            artist = self.genius.search_artist(artist_name, max_songs=max_songs, sort="popularity")
            songs_lyrics = []
            if artist:
                for song in artist.songs:
                    songs_lyrics.append((song.title, song.lyrics))
                return songs_lyrics
            else:
                return []
        except Exception as e:
            print(f"Error al buscar el artista: {e}")
            return []

# Ejemplo de uso:

if __name__ == "__main__":
    # Pega aquí tu token de Genius
    CLIENT_ACCESS_TOKEN = "P_SeJnRFghP0KzWMBWJS20aEsHgrSfqL5i-aX6syeIaJp4_xKNyVZt-qc-l6q86O"

    fetcher = LyricsFetcher(CLIENT_ACCESS_TOKEN)

    # Buscar una canción específica
    letra = fetcher.search_song_lyrics("Missy Elliott", "Work It")
    print("Letra de Work It:\n", letra)

    # Buscar top canciones y letras de un artista
    top_songs = fetcher.search_artist_top_songs("Missy Elliott", max_songs=3)
    for title, lyrics in top_songs:
        print(f"\n{title}:\n{lyrics}\n{'-'*40}")
