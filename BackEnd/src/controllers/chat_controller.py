from fastapi import HTTPException
from src.services.chatIA_service import Agent

agent = Agent()

async def consult_IA(question: str, history: list = []):
    try:
        return {"answer": await agent.chat(question, history)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
