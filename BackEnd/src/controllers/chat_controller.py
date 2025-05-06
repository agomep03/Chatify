import requests
import os

LM_STUDIO_URL = os.getenv("LM_STUDIO_URL")

async def consult_IA(question: str):
    print(f"LM_STUDIO_URL: {LM_STUDIO_URL}")

    payload = {
        "model": "llama-3.2-1b-instruct",
        "messages": [{"role": "user", "content": question}],
        "max_tokens": 300
    }

    headers = {
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(LM_STUDIO_URL, headers=headers, json=payload, timeout=60)
        response.raise_for_status()

        data = response.json()
        return {"answer": data['choices'][0]['message']['content']}

    except requests.exceptions.RequestException as e:
        raise Exception(f"Error al conectar con la IA: {e}")
    
    except (KeyError, IndexError):
        raise Exception("La IA respondió pero no se pudo interpretar la respuesta.")
