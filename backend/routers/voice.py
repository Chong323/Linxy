from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from fastapi.responses import JSONResponse
from services.auth_service import get_current_user

router = APIRouter()


@router.post("/chat/voice")
async def process_voice(
    audio: UploadFile = File(...), user_id: str = Depends(get_current_user)
):
    try:
        if not audio.content_type.startswith("audio/"):
            raise HTTPException(status_code=400, detail="File must be audio")

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
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
