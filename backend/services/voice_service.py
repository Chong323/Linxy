import os
from elevenlabs.client import ElevenLabs

def generate_speech(text: str) -> bytes:
    api_key = os.environ.get("ELEVENLABS_API_KEY", "")
    if not api_key:
        print("Warning: ELEVENLABS_API_KEY not set. Returning empty audio.")
        return b""
        
    client = ElevenLabs(api_key=api_key)
    
    # Use the default "Rachel" voice for testing (or a specific child-friendly one if known, otherwise default)
    # Using 'eleven_monolingual_v1' for lower latency if possible, or default
    try:
        audio_generator = client.generate(
            text=text,
            voice="Rachel",
            model="eleven_monolingual_v1"
        )
        
        # The generator yields bytes
        audio_bytes = b"".join(audio_generator)
        return audio_bytes
    except Exception as e:
        print(f"Error generating speech: {e}")
        return b""
