import base64
import requests
import os
from fastapi import HTTPException
from spotipy.oauth2 import SpotifyOAuth
from dotenv import load_dotenv

load_dotenv()

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

def get_spotify_auth_url():
    try:
        # Si esta función lanza un error, lo capturamos
        auth_url = sp_oauth.get_authorize_url()
        return auth_url
    except Exception as e:
        logger.error(f"Error obtaining Spotify auth URL: {e}")
        raise HTTPException(status_code=500, detail="Spotify authorization failed")



def verify_spotify_account(code: str):
    """
    Intercambia el código por un access token y obtiene la información del usuario de Spotify.

    Args:
        code (str): Código de autorización de Spotify.

    Returns:
        dict: Datos del usuario si todo es correcto, o error si algo falla.
    """
    token_url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{CLIENT_ID}:{CLIENT_SECRET}'.encode()).decode()}"
    }
    data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI
    }

    response = requests.post(token_url, headers=headers, data=data)

    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to get access token")
    
    token_info = response.json()
    access_token = token_info.get("access_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to retrieve access token")

    # Obtener los datos del usuario
    user_data_response = requests.get("https://api.spotify.com/v1/me", headers={
        "Authorization": f"Bearer {access_token}"
    })

    if user_data_response.status_code != 200:
        raise HTTPException(status_code=400, detail="Failed to retrieve user data from Spotify")

    return user_data_response.json()
