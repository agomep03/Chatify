import requests

def get_user_profile(access_token: str):
    """
    Consulta a la API de Spotify para verificar si el token es válido y devuelve el perfil.

    Args:
        access_token (str): Token de acceso de Spotify.

    Returns:
        dict: Perfil del usuario de Spotify.

    Raises:
        Exception: Si el token no es válido.
    """
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get("https://api.spotify.com/v1/me", headers=headers)

    if response.status_code != 200:
        raise Exception("Token de Spotify inválido o expirado")

    return response.json()
