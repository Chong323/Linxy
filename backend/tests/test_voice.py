from fastapi.testclient import TestClient
from main import app
from services.auth_service import get_current_user
import io

client = TestClient(app)

# Override auth dependency for tests
app.dependency_overrides[get_current_user] = lambda: "test_user_id"


def test_process_voice_endpoint():
    dummy_audio = io.BytesIO(b"dummy audio content")
    files = {"audio": ("test.wav", dummy_audio, "audio/wav")}
    response = client.post("/chat/voice", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "mock_success"
    assert "transcribed_text" in data
    assert "response_text" in data


def test_process_voice_non_audio_file():
    dummy_file = io.BytesIO(b"not an audio")
    # Test with text file content type
    files = {"audio": ("test.txt", dummy_file, "text/plain")}
    response = client.post("/chat/voice", files=files)
    assert response.status_code == 400
    assert response.json()["detail"] == "File must be audio"


def test_process_voice_no_file():
    # Test missing file
    response = client.post("/chat/voice")
    assert response.status_code == 422  # Validation error from FastAPI
