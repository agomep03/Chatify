# src/routes/chat_routes.py
from fastapi import APIRouter
from src.controllers.chat_controller import consult_IA

router = APIRouter()

@router.post("/ask-music-question/")
async def ask_music_question_endpoint(question: str):
    return await consult_IA(question)
