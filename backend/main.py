import os
from dotenv import load_dotenv

# Load environment variables FIRST before any other local imports
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.llm_service import generate_chat_response
from services.memory_service import add_core_instruction

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


class ParentCommandRequest(BaseModel):
    command: str


@app.get("/")
async def root():
    return {"message": "Welcome to Linxy API - The Digital Bridge"}


@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    try:
        # Convert Pydantic model history to list of dicts for LLM service
        history_dicts = [
            {"role": msg.role, "content": msg.content} for msg in req.history
        ]
        reply = await generate_chat_response(req.message, history_dicts)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/parent/command")
async def parent_command_endpoint(req: ParentCommandRequest):
    try:
        await add_core_instruction(req.command)
        return {"status": "success", "message": "Directive added to memory."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
