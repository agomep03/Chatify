from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.controllers.spotify_controller import get_user_playlists
from src.controllers.auth_controller import get_current_user, get_db
from src.models.auth_model import User

router = APIRouter()

@router.get("/playlists")
def playlists(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_user_playlists(user, db)

@router.get("/auth/spotify/connected")
def check_spotify_connected(user: User = Depends(get_current_user)):
    if user.spotify_user_id and user.spotify_access_token:
        return {"connected": True}
    return {"connected": False}
