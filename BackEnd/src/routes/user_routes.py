from fastapi import Request, APIRouter
from fastapi.responses import RedirectResponse
import os
from dotenv import load_dotenv
from spotipy.oauth2 import SpotifyOAuth
import requests
import base64

load_dotenv()
router = APIRouter()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

@router.get("/callback")
async def callback(request: Request):
    code = request.query_params.get("code")

    if not code:
        return {"error": "No authorization code provided"}

    token_url = "https://accounts.spotify.com/api/token"
    headers = {
        "Authorization": f"Basic {base64.b64encode(f'{CLIENT_ID}:{CLIENT_SECRET}'.encode()).decode()}",
        "Content-Type": "application/x-www-form-urlencoded"
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
