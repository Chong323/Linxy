from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import base64
from services.auth_service import get_current_user
from services.llm_service import generate_chat_response
from services.voice_service import generate_speech

router = APIRouter()


class VoiceRequest(BaseModel):
    text: str


class VoiceResponse(BaseModel):
    text: str
    audio_base64: str | None
    status: str


@router.post("/chat/voice")
async def process_voice(
    request: VoiceRequest, user_id: str = Depends(get_current_user)
):
    try:
        if not request.text or not request.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        chat_result = await generate_chat_response(user_id, request.text)
        reply_text = chat_result.get("reply", "")

        audio_bytes = await generate_speech(reply_text)
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

        return VoiceResponse(
            text=reply_text, audio_base64=audio_base64, status="success"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
