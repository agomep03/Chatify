from fastapi import HTTPException
from src.services.spotify_service import get_user_profile

def verify_spotify_account(token: str):
    """
    Verifica que el usuario tenga cuenta en Spotify usando su token de acceso.

    Args:
        token (str): Token de acceso OAuth de Spotify.

    Returns:
        bool: True si el token es válido y el usuario existe.

    Raises:
        HTTPException: Si el token no es válido o no tiene cuenta.
    """
    try:
        profile = get_user_profile(token)
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail="Cuenta de Spotify inválida")
