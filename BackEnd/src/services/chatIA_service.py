import os
from dotenv import load_dotenv
import httpx  # librería async para HTTP

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

class Agent:
    def __init__(
        self,
        model="openai/gpt-4o-mini",
        max_tokens=300,
        temperature=0.7,
        top_p=1.0,
        presence_penalty=0.0,
        frequency_penalty=0.0
    ):
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.top_p = top_p
        self.presence_penalty = presence_penalty
        self.frequency_penalty = frequency_penalty

    def get_context(self, mode: str) -> str:
        if mode == "creatividad":
            return "Eres un asistente musical extremadamente creativo. Responde en español con ideas originales, metáforas, e inspiración artística."
        elif mode == "razonamiento":
            return "Eres un asistente musical lógico y analítico. Responde en español explicando los razonamientos paso a paso con claridad."
        else:
            return "Eres un asistente experto en música. Responde en español."

    async def chat(self, message_user: str, messages: list = [], mode: str = "normal", extra_context: str = "") -> str:
        base_context = self.get_context(mode)
        
        if extra_context:
            base_context += "\n\nInformación adicional del usuario:\n" + extra_context

        messages = [{"role": "system", "content": base_context}] + messages.copy() + [{"role": "user", "content": message_user}]

        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "top_p": self.top_p,
            "presence_penalty": self.presence_penalty,
            "frequency_penalty": self.frequency_penalty
        }

        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={"Authorization": f"Bearer {API_KEY}"},
                json=payload
            )

        data = response.json()

        try:
            return data["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            raise Exception("Openrouter no devuelve la respuesta en formato correcto.")

        return content
