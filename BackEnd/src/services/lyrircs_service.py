import lyricsgenius
import os

class LyricsFetcher:
    def __init__(self, client_access_token=None):
        if client_access_token is None:
            client_access_token = os.getenv("GENIUS_CLIENT_ACCESS_TOKEN")
        self.genius = lyricsgenius.Genius(client_access_token)
        self.genius.remove_section_headers = True
    
    def search_song_lyrics(self, artist_name, song_title):
        try:
            song = self.genius.search_song(song_title, artist_name)
            if song:
                return song.lyrics
            else:
                return "No se encontró la canción."
        except Exception as e:
            return f"Error al buscar la canción: {e}"

    def search_artist_top_songs(self, artist_name, max_songs=5):
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
            # Podrías usar logging aquí en vez de print
            return []
