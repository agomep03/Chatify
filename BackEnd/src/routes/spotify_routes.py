from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from src.controllers.spotify_controller import (
    get_all_user_playlists,
    update_playlist,
    generate_playlist_auto,
    remove_tracks_from_playlist,
    unfollow_playlist_logic,
    get_user_full_top_info
)
from src.controllers.auth_controller import get_current_user, get_db
from src.models.auth_model import User
from src.schemas.spotify_schemas import TrackUri, RemoveTracksRequest, UpdatePlaylistRequest
from src.services.lyrircs_service import LyricsFetcher

router = APIRouter()

@router.get("/playlists")
def get_user_playlists(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Obtiene todas las playlists del usuario autenticado.

    Returns:
        list: Playlists del usuario.
    """
    return get_all_user_playlists(user, db)

@router.get("/auth/spotify/connected")
def check_spotify_connected(
    user: User = Depends(get_current_user)
):
    """
    Verifica si el usuario está conectado a Spotify.

    Returns:
        dict: {'connected': True/False}
    """
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    return {"connected": bool(user.spotify_user_id and user.spotify_access_token)}

@router.put("/playlists/{playlist_id}/update")
def update_playlist_route(
    playlist_id: str,
    data: UpdatePlaylistRequest,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Actualiza los metadatos (título, descripción) de una playlist.

    Args:
        playlist_id (str): ID de la playlist a actualizar.

    Returns:
        dict: Resultado de la operación.
    """
    return update_playlist(
        playlist_id=playlist_id,
        title=data.title,
        description=data.description,
        user=user,
        db=db
    )

@router.post("/playlists/auto-generate")
async def auto_generate_playlist_route(
    prompt: str,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Genera automáticamente una playlist basada en un prompt (texto libre).

    Args:
        prompt (str): Descripción temática para la playlist.

    Returns:
        dict: URL de la playlist generada.
    """
    playlist_url = await generate_playlist_auto(prompt, user, db)
    return {"playlist_url": playlist_url}

@router.delete("/playlists/{playlist_id}/tracks")
def remove_tracks_route(
    playlist_id: str,
    data: RemoveTracksRequest,
    user: User = Depends(get_current_user)
):
    """
    Elimina una o varias pistas de una playlist específica.

    Args:
        playlist_id (str): ID de la playlist.
        data (RemoveTracksRequest): URIs y snapshot ID.

    Returns:
        dict: Resultado de la operación.
    """
    return remove_tracks_from_playlist(playlist_id, data, user)

@router.delete("/playlists/{playlist_id}/unfollow")
def unfollow_playlist_route(
    playlist_id: str,
    user: User = Depends(get_current_user)
):
    """
    Deja de seguir una playlist.

    Args:
        playlist_id (str): ID de la playlist.

    Returns:
        dict: Resultado de la operación.
    """
    return unfollow_playlist_logic(playlist_id, user)

@router.get("/lyrics")
def get_lyrics_route(
    artist: str = Query(..., description="Nombre del artista"),
    song: str = Query(..., description="Título de la canción")
):
    """
    Obtiene la URL de la letra de una canción.

    Args:
        artist (str): Artista.
        song (str): Canción.

    Returns:
        str: URL de la letra.
    """
    lyrics_fetcher = LyricsFetcher()
    return lyrics_fetcher.search_song_url(artist, song)

@router.get("/user/top-info")
def get_user_top_info_route(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Devuelve los top 3 artistas, canciones y géneros del usuario desde Spotify
    en tres períodos: corto, medio y largo plazo.

    Returns:
        dict: Información agrupada por período.
    """
    return get_user_full_top_info(user, db)
