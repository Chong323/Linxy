import os
from elevenlabs.client import AsyncElevenLabs

async def generate_speech(text: str, voice_id: str = "Rachel") -> bytes:
    """
    Generates speech audio from text using ElevenLabs TTS.
    
    Args:
        text: The text to convert to speech
        voice_id: The ElevenLabs voice ID to use (default: Rachel)
        
    Returns:
        Audio bytes
    """
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not api_key:
        print("Warning: ELEVENLABS_API_KEY not set. Returning empty audio.")
        return b""
        
    client = AsyncElevenLabs(api_key=api_key)
    
    try:
        # Using 'eleven_monolingual_v1' for lower latency if possible, or default
        audio_generator = await client.generate(
            text=text,
            voice=voice_id,
            model="eleven_monolingual_v1"
        )
        
        # Collect chunks from async generator
        chunks = []
        async for chunk in audio_generator:
            chunks.append(chunk)
            
        return b"".join(chunks)
    except Exception as e:
        print(f"Error generating speech: {e}")
        return b""
