from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

import requests

from src.controllers.spotify_controller import get_all_user_playlists, update_playlist, generate_playlist_auto, remove_tracks_from_playlist, unfollow_playlist_logic, get_user_full_top_info
from src.controllers.auth_controller import get_current_user, get_db
from src.models.auth_model import User
from src.services.lyrircs_service import LyricsFetcher

router = APIRouter()

class TrackUri(BaseModel):
    uri: str

class RemoveTracksRequest(BaseModel):
    tracks: List[TrackUri]
    snapshot_id: Optional[str] = None

class UpdatePlaylistRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

@router.get("/playlists")
def playlists(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_all_user_playlists(user, db)

@router.get("/auth/spotify/connected")
def check_spotify_connected(user: User = Depends(get_current_user)):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    if user.spotify_user_id and user.spotify_access_token:
        return {"connected": True}
    return {"connected": False}

@router.put("/playlists/{playlist_id}/update")
def update_playlist_endpoint(
    playlist_id: str,
    data: UpdatePlaylistRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    return update_playlist(
        playlist_id=playlist_id,
        title=data.title,
        description=data.description,
        user=user,
        db=db
    )

@router.post("/playlists/auto-generate")
async def auto_generate_playlist(
    prompt: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    playlist_url = await generate_playlist_auto(prompt, user, db)
    return {"playlist_url": playlist_url}

@router.delete("/playlists/{playlist_id}/tracks")
def remove_tracks_playlist(
    playlist_id: str,
    data: RemoveTracksRequest,
    user: User = Depends(get_current_user)
):
    return remove_tracks_from_playlist(playlist_id, data, user)

@router.get("/lyrics")
def get_lyrics(
    artist: str = Query(..., description="Nombre del artista"),
    song: str = Query(..., description="Título de la canción")
):
    lyrics_fetcher = LyricsFetcher()
    url = lyrics_fetcher.search_song_url(artist, song)
    return url

@router.delete("/playlists/{playlist_id}/unfollow")
def unfollow_playlist(
    playlist_id: str,
    user: User = Depends(get_current_user)
):
    return unfollow_playlist_logic(playlist_id, user)

@router.get("/user/top-info")
def get_user_top_info_endpoint(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Devuelve los top 3 artistas, canciones y géneros del usuario desde Spotify
    para tres períodos de tiempo: esta semana, últimos seis meses y todo el tiempo.
    """
    top_info = get_user_full_top_info(user, db)
    return top_info