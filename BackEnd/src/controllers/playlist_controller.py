from fastapi import HTTPException
import os
from dotenv import load_dotenv
import requests
import base64

load_dotenv()

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID")
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET")
REDIRECT_URI = os.getenv("SPOTIFY_REDIRECT_URI")

# Aquí guardamos los tokens temporalmente (en producción usa DB o sesión)
access_tokens = {}

async def get_playlists(self, user_id: str):
    token = self.access_tokens.get(user_id)

    if not token:
        raise HTTPException(status_code=401, detail="Usuario no logueado o token expirado")

    url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 401:
        # Aquí podrías implementar refresh token para renovar el token expirado
        raise HTTPException(status_code=401, detail="Token expirado, por favor vuelve a iniciar sesión")

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error al obtener playlists")

    playlists_data = response.json()
    playlists = [{"name": p["name"], "id": p["id"], "tracks": p["tracks"]["total"]} for p in playlists_data.get("items", [])]

    return {"playlists": playlists}