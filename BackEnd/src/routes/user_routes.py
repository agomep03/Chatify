from fastapi import FastAPI, Request, APIRouter, Depends
from fastapi.responses import RedirectResponse
from src.controllers.user_controller import verify_spotify_account
import os
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()
router = APIRouter()


CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

sp_oauth = SpotifyOAuth(
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    redirect_uri=REDIRECT_URI,
    scope="user-library-read user-read-private user-read-email",
    cache_path=None,
    show_dialog=True
)

@router.get("/login")
def login():
    """
    Redirige a Spotify para obtener el código de autorización.
    """
    url = sp_oauth.get_authorize_url()
    return RedirectResponse(url)
