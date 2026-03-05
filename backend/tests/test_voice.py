from fastapi.testclient import TestClient
from main import app
import io

client = TestClient(app)


def test_process_voice_endpoint():
    dummy_audio = io.BytesIO(b"dummy audio content")
    files = {"audio": ("test.wav", dummy_audio, "audio/wav")}
    response = client.post("/chat/voice", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "mock_success"
    assert "transcribed_text" in data
    assert "response_text" in data
