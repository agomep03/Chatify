import os
from dotenv import load_dotenv
import requests

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

class Agent:
    def __init__(
        self,
        context="Eres un asistente experto en música. Responde en español.",
        model="openai/gpt-4o-mini",
        max_tokens=300,
        temperature=0.7,
        top_p=1.0,
        presence_penalty=0.0,
        frequency_penalty=0.0
    ):
        self.context = context
        self.model = model
        self.max_tokens = max_tokens
        self.temperature = temperature
        self.top_p = top_p
        self.presence_penalty = presence_penalty
        self.frequency_penalty = frequency_penalty

    async def chat(self, message_user: str, messages: list = []) -> str:
        
        messages = [{"role": "system", "content": self.context}] + messages.copy() + [{"role": "user", "content": message_user}]

        payload = {
            "model": self.model,
            "messages": messages,
            "max_tokens": self.max_tokens,
            "temperature": self.temperature,
            "top_p": self.top_p,
            "presence_penalty": self.presence_penalty,
            "frequency_penalty": self.frequency_penalty
        }

        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json=payload,
            timeout=60
        )

        data = response.json()

        try:
            content = data["choices"][0]["message"]["content"]
        except:
            raise Exception("Openrouter no devuelve la respuesta en formato correcto.")

        return content
