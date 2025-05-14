from fastapi import APIRouter, Query
from src.controllers.chat_controller import consult_IA

router = APIRouter()

@router.post("/ask-music-question/")
async def ask_music_question_endpoint(question: str = Query(...)):
    return await consult_IA(question=question, history=[])
