from dotenv import load_dotenv

# Load environment variables FIRST before any other local imports
load_dotenv()

from fastapi import FastAPI, HTTPException, Depends  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from pydantic import BaseModel  # noqa: E402
from services.auth_service import get_current_user  # noqa: E402
from services.llm_service import (  # noqa: E402
    generate_chat_response,
    run_session_reflection,
    generate_parent_chat_response,
    generate_wakeup_message,
)
from services.memory_service import (  # noqa: E402
    add_core_instruction,
    add_episodic_memory,
    get_rewards,
    get_parent_reports,
)

app = FastAPI(title="Linxy API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []


class ChatResponse(BaseModel):
    reply: str
    awarded_sticker: dict | None = None


class ParentCommandRequest(BaseModel):
    command: str


@app.get("/")
async def root():
    return {"message": "Welcome to Linxy API - The Digital Bridge"}


@app.get("/chat/wakeup")
async def wakeup_endpoint(user_id: str = Depends(get_current_user)):
    try:
        reply = await generate_wakeup_message(user_id)
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/child/rewards")
async def rewards_endpoint(user_id: str = Depends(get_current_user)):
    try:
        rewards = await get_rewards(user_id)
        return {"rewards": rewards}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest, user_id: str = Depends(get_current_user)):
    try:
        # Convert Pydantic model history to list of dicts for LLM service
        history_dicts = [
            {"role": msg.role, "content": msg.content} for msg in req.history
        ]
        result = await generate_chat_response(user_id, req.message, history_dicts)

        # Handle dict response
        if isinstance(result, dict):
            return ChatResponse(
                reply=result.get("reply", ""),
                awarded_sticker=result.get("awarded_sticker"),
            )
        else:
            # Fallback if service returns str (should not happen with updated service)
            return ChatResponse(reply=str(result))

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


class ReflectionRequest(BaseModel):
    history: list[ChatMessage]


@app.post("/chat/reflect")
async def reflect_endpoint(req: ReflectionRequest, user_id: str = Depends(get_current_user)):
    try:
        history_dicts = [
            {"role": msg.role, "content": msg.content} for msg in req.history
        ]
        reflection_result = await run_session_reflection(user_id, history_dicts)
        await add_episodic_memory(user_id, reflection_result)
        return {"status": "success", "reflection": reflection_result}
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/parent/reports")
async def parent_reports_endpoint(user_id: str = Depends(get_current_user)):
    try:
        reports = await get_parent_reports(user_id)
        return {"status": "success", "reports": reports}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/parent/chat", response_model=ChatResponse)
async def parent_chat_endpoint(req: ChatRequest, user_id: str = Depends(get_current_user)):
    try:
        history_dicts = [
            {"role": msg.role, "content": msg.content} for msg in req.history
        ]
        result = await generate_parent_chat_response(user_id, req.message, history_dicts)

        reply = result.get("reply", "")
        saved_instruction = result.get("saved_instruction")

        if saved_instruction:
            await add_core_instruction(user_id, saved_instruction.strip())

        return ChatResponse(reply=reply)
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/parent/command")
async def parent_command_endpoint(req: ParentCommandRequest, user_id: str = Depends(get_current_user)):
    try:
        await add_core_instruction(user_id, req.command)
        return {"status": "success", "message": "Directive added to memory."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
