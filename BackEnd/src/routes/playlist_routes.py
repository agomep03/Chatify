from fastapi import APIRouter
from src.controllers.playlist_controller import get_playlists

router = APIRouter()

@router.get("/playlists/{user_id}")
async def get_playlists(user_id: str):
    return await get_playlists(user_id)
