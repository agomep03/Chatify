import httpx
import base64
from fastapi import FastAPI, Request, APIRouter
from fastapi.responses import RedirectResponse
import os
import requests
from urllib.parse import urlencode
from dotenv import load_dotenv
from typing import Optional
from spotipy import Spotify
from spotipy.oauth2 import SpotifyOAuth

load_dotenv()
app = FastAPI()

router = APIRouter()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")
tokens_storage = {}
sp_oauth = SpotifyOAuth(client_id=CLIENT_ID, client_secret=CLIENT_SECRET, redirect_uri=REDIRECT_URI, scope="user-library-read user-read-private", cache_path=None,show_dialog=True)

@app.get("/login")
def login():
    url = sp_oauth.get_authorize_url()
    return RedirectResponse(url)

@app.get("/callback")
async def callback(request: Request):
    code = request.query_params.get("code")

    if not code:
        return {"error": "No authorization code provided"}

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
        return {"error": "Failed to get access token", "details": response.json()}

    token_info = response.json()
    access_token = token_info["access_token"]

    user_data_response = requests.get("https://api.spotify.com/v1/me", headers={
        "Authorization": f"Bearer {access_token}"
    })

    user_data = user_data_response.json()

    return user_data

