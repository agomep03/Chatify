from pydantic import BaseModel
from typing import Literal, Optional

class ChatRequest(BaseModel):
    """
    Esquema para el envío de un mensaje a una conversación.

    Atributos:
        question (str): Pregunta o mensaje del usuario.
        mode (Optional[str]): Modo de respuesta del chatbot. Puede ser:
            - 'normal'
            - 'creatividad'
            - 'razonamiento'
    """
    question: str
    mode: Optional[Literal["normal", "creatividad", "razonamiento"]] = "normal"
