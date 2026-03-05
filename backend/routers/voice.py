from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse

router = APIRouter()


@router.post("/chat/voice")
async def process_voice(audio: UploadFile = File(...)):
    # Stub for Phase 6:
    # 1. Send 'audio' to Whisper STT -> text
    # 2. Send text to Gemini -> response text
    # 3. Send response text to ElevenLabs TTS -> output audio
    # 4. Return audio file

    return JSONResponse(
        content={
            "status": "mock_success",
            "transcribed_text": "Hello Linxy",
            "response_text": "Hi there!",
        }
    )
