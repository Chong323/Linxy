from google import genai
from google.genai import types
from .memory_service import get_soul, get_core_instructions

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
