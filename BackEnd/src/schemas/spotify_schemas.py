from pydantic import BaseModel
from typing import List, Optional

class TrackUri(BaseModel):
    """Representa una pista con su URI de Spotify."""
    uri: str

class RemoveTracksRequest(BaseModel):
    """
    Solicitud para eliminar pistas de una playlist.
    
    Atributos:
        tracks (List[TrackUri]): Lista de pistas a eliminar.
        snapshot_id (Optional[str]): ID de versión de la playlist (para control de cambios).
    """
    tracks: List[TrackUri]
    snapshot_id: Optional[str] = None

class UpdatePlaylistRequest(BaseModel):
    """
    Solicitud para actualizar el título y descripción de una playlist.
    
    Atributos:
        title (Optional[str]): Nuevo título.
        description (Optional[str]): Nueva descripción.
    """
    title: Optional[str] = None
    description: Optional[str] = None
