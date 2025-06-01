import os
import logging
import httpx  # Cliente HTTP asincrónico
from dotenv import load_dotenv

# Configuración del logger
logger = logging.getLogger(__name__)

# Cargar claves del entorno
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

class Agent:
    """
    Servicio de agente conversacional que utiliza OpenRouter (compatible con modelos OpenAI)
    para generar respuestas a partir de un historial de mensajes y un modo de contexto.
    """

    def __init__(
        self,
        model: str = "openai/gpt-4o-mini",
        max_tokens: int = 300,
        temperature: float = 0.7,
        top_p: float = 1.0,
        presence_penalty: float = 0.0,
        frequency_penalty: float = 0.0
    ):
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.top_p = top_p
        self.presence_penalty = presence_penalty
        self.frequency_penalty = frequency_penalty
        logger.info(f"[Agent INIT] Modelo: {self.model}, max_tokens={self.max_tokens}, temperature={self.temperature}")

    def get_context(self, mode: str) -> str:
        """
        Devuelve el mensaje de sistema base según el modo de conversación.
        
        Args:
            mode (str): Modo de conversación ('creatividad', 'razonamiento', 'normal')
        
        Returns:
            str: Instrucción del sistema para el modelo.
        """
        logger.debug(f"[Agent CONTEXT] Modo recibido: {mode}")
        if mode == "creatividad":
            return (
                "Eres un asistente musical extremadamente creativo. "
                "Responde en español con ideas originales, metáforas e inspiración artística."
            )
        elif mode == "razonamiento":
            return (
                "Eres un asistente musical lógico y analítico. "
                "Responde en español explicando los razonamientos paso a paso con claridad."
            )
        else:
            return "Eres un asistente experto en música. Responde en español."

    async def chat(self, message_user: str, messages: list = [], mode: str = "normal", extra_context: str = "") -> str:
        """
        Genera una respuesta del modelo en base al mensaje del usuario y el historial de mensajes.
        
        Args:
            message_user (str): Mensaje actual del usuario.
            messages (list): Historial de mensajes en formato OpenAI (role, content).
            mode (str): Modo de conversación para ajustar el contexto ('normal', 'creatividad', 'razonamiento').
            extra_context (str): Información adicional que se añade al contexto inicial.
        
        Returns:
            str: Respuesta generada por el modelo.
        
        Raises:
            Exception: Si la respuesta no contiene el formato esperado.
        """
        logger.info(f"[Agent CHAT] Iniciando generación. Modo: {mode}, Mensaje usuario: {message_user[:50]}...")
        base_context = self.get_context(mode)

        if extra_context:
            base_context += f"\n\nInformación adicional del usuario:\n{extra_context}"
            logger.debug(f"[Agent CHAT] Contexto adicional añadido: {extra_context[:50]}...")

        conversation = [{"role": "system", "content": base_context}] + messages.copy() + [{"role": "user", "content": message_user}]

        payload = {
            "model": self.model,
            "messages": conversation,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "top_p": self.top_p,
            "presence_penalty": self.presence_penalty,
            "frequency_penalty": self.frequency_penalty
        }

        logger.debug(f"[Agent CHAT] Payload enviado a OpenRouter: {str(payload)[:100]}...")

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {API_KEY}"},
                json=payload
            )

        data = response.json()

        try:
            async with httpx.AsyncClient(timeout=60) as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {API_KEY}"},
                    json=payload
                )

            data = await response.json()
            logger.info("[Agent CHAT] Respuesta recibida de OpenRouter")

            content = data["choices"][0]["message"]["content"]
            logger.debug(f"[Agent CHAT] Contenido generado: {content[:100]}...")
            return content

        except (KeyError, IndexError) as e:
            logger.error(f"[Agent ERROR] Formato inesperado en respuesta de OpenRouter: {e}")
            raise Exception("OpenRouter no devuelve la respuesta en el formato esperado.")
        except httpx.RequestError as e:
            logger.error(f"[Agent ERROR] Error de conexión con OpenRouter: {e}")
            raise Exception("Error de red al comunicarse con OpenRouter.")
        except Exception as e:
            logger.error(f"[Agent ERROR] Error general en generación de respuesta: {e}")
            raise
