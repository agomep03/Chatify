from spotipy.oauth2 import SpotifyOAuth
import os

def get_spotify_login_url(email: str = None):
    sp_oauth = SpotifyOAuth(
        client_id=os.getenv("SPOTIFY_CLIENT_ID"),
        client_secret=os.getenv("SPOTIFY_CLIENT_SECRET"),
        redirect_uri=os.getenv("SPOTIFY_REDIRECT_URI"),
        scope="user-library-read user-read-private user-read-email",
        show_dialog=True
    )
    url = sp_oauth.get_authorize_url(state=email)
    return url
