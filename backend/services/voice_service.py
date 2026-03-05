import os
from elevenlabs import ElevenLabs

client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))


async def generate_speech(text: str, voice_id: str = "JBFpnCK9A0bG66MdpR2m") -> bytes:
    """
    Generates speech audio from text using ElevenLabs TTS.

    Args:
        text: The text to convert to speech
        voice_id: The ElevenLabs voice ID to use (default: Rachel)

    Returns:
        Audio bytes
    """
    audio = client.generate(text=text, voice=voice_id, model="eleven_monolingual_v1")

    audio_bytes = b"".join(audio)
    return audio_bytes
