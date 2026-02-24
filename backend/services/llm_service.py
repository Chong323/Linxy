from google import genai
from google.genai import types
from pydantic import BaseModel
import json
from datetime import datetime, timezone
from .memory_service import get_soul, get_core_instructions, get_episodic_memory

# Client automatically picks up GEMINI_API_KEY from environment
client = genai.Client()


async def generate_chat_response(
    message: str, history: list[dict] | None = None
) -> str:
    """
    Generates a chat response using Gemini API, incorporating the
    Soul persona and parent directives into the system instructions.
    """
    soul = await get_soul()
    instructions = await get_core_instructions()

    system_prompt = f"""
{soul}

=== CRITICAL PARENT DIRECTIVES (ACTIVE FOR THIS SESSION) ===
The following are instructions provided by the child's parent. 
You MUST naturally and seamlessly weave these goals into the current conversation.
Do NOT explicitly mention the parent, just guide the conversation toward these goals playfully.

{instructions}
"""
    # We use gemini-2.5-flash for the MVP
    model_id = "gemini-2.5-flash"

    # Get episodic memory to inject into the conversation
    memories = await get_episodic_memory()
    if memories:
        recent_memories = memories[-3:]  # Last 3 memories
        memory_context = (
            "\n\n=== PAST INTERESTS AND MILESTONES (FROM PREVIOUS SESSIONS) ===\n"
        )
        for mem in recent_memories:
            memory_context += f"- Summary: {mem.get('summary', 'N/A')}\n"
            if mem.get("interests"):
                memory_context += (
                    f"  Interests: {', '.join(mem.get('interests', []))}\n"
                )
            if mem.get("milestones"):
                memory_context += (
                    f"  Milestones: {', '.join(mem.get('milestones', []))}\n"
                )
        system_prompt += memory_context

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.7,
    )

    # Format history if present
    contents = []
    if history:
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(
                types.Content(
                    role=role, parts=[types.Part.from_text(text=msg["content"])]
                )
            )

    # Add the current message
    contents.append(
        types.Content(role="user", parts=[types.Part.from_text(text=message)])
    )

    response = client.models.generate_content(
        model=model_id, contents=contents, config=config
    )

    return response.text if response.text is not None else ""


class ReflectionOutput(BaseModel):
    summary: str
    interests: list[str]
    milestones: list[str]


async def run_session_reflection(history: list[dict]) -> dict:
    """
    Analyzes the chat session and extracts insights (summary, interests, milestones).
    """
    if not history:
        return {
            "summary": "No conversation to reflect on.",
            "interests": [],
            "milestones": [],
        }

    system_prompt = """
You are an AI assistant analyzing a conversation between a child and their AI companion, Linxy.
Your goal is to extract key insights from the conversation.
Provide a brief summary of what was discussed.
Extract a list of interests the child showed (e.g., 'dinosaurs', 'space', 'drawing').
Extract a list of any developmental or learning milestones reached (e.g., 'asked a 'why' question about nature', 'expressed empathy', 'practiced counting').
Return the output strictly in JSON format matching the requested schema.
"""

    conversation_text = ""
    for msg in history:
        conversation_text += f"{msg['role'].capitalize()}: {msg['content']}\n"

    model_id = "gemini-2.5-flash"

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.2,
        response_mime_type="application/json",
        response_schema=ReflectionOutput,
    )

    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(
                    text=f"Analyze this conversation:\n\n{conversation_text}"
                )
            ],
        )
    ]

    response = client.models.generate_content(
        model=model_id, contents=contents, config=config
    )

    try:
        if response.text:
            result = json.loads(response.text)
            result["timestamp"] = datetime.now(timezone.utc).isoformat()
            return result
    except json.JSONDecodeError:
        pass

    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "summary": "Failed to analyze conversation.",
        "interests": [],
        "milestones": [],
    }


async def generate_parent_chat_response(
    message: str, history: list[dict] | None = None
) -> str:
    """
    Generates a chat response for the Parent Architect AI.
    """
    instructions = await get_core_instructions()

    system_prompt = f"""
You are Linxy's 'Architect AI'. Your goal is to converse with parents, understand what they want their child to learn, experience, or avoid, and help them draft 'core instructions' for Linxy (the child's digital companion).

Current active instructions for the child:
{instructions}

IMPORTANT INSTRUCTIONS FOR YOU:
1. BE CONVERSATIONAL: Do not jump straight into saving an instruction. Ask clarifying questions to understand the parent's exact goals, context, and how they want Linxy to handle it.
2. DRAFT FIRST: Once you understand what the parent wants, propose a draft of the core instruction. Explicitly ask the parent if it looks good.
3. WAIT FOR CONFIRMATION: You must wait for the parent to confirm (e.g., "Yes", "Looks good", "Save it") BEFORE saving.
4. HOW TO SAVE: ONLY when the parent explicitly confirms the drafted instruction, you MUST include the following exact tag anywhere in your reply:
[SAVE_INSTRUCTION: <the exact instruction text>]

Example Flow:
Parent: "I want Linxy to help my kid with math."
You: "That's a great goal! What kind of math are they working on right now? (e.g., counting, addition, fractions?)"
Parent: "Basic addition up to 20."
You: "Got it. How about we give Linxy this instruction: 'Incorporate simple addition questions (up to 20) naturally into stories and games.' Does that sound good to you?"
Parent: "Yes, that's perfect."
You: "Great! I've saved that instruction for Linxy. Let me know if you want to add anything else! [SAVE_INSTRUCTION: Incorporate simple addition questions (up to 20) naturally into stories and games.]"
"""
    model_id = "gemini-2.5-flash"

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.7,
    )

    contents = []
    if history:
        for msg in history:
            role = "user" if msg["role"] == "user" else "model"
            contents.append(
                types.Content(
                    role=role, parts=[types.Part.from_text(text=msg["content"])]
                )
            )

    contents.append(
        types.Content(role="user", parts=[types.Part.from_text(text=message)])
    )

    response = client.models.generate_content(
        model=model_id, contents=contents, config=config
    )

    return response.text if response.text is not None else ""
