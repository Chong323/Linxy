from fastapi.testclient import TestClient
from main import app
from services.auth_service import get_current_user
from unittest.mock import patch, AsyncMock
import base64

client = TestClient(app)

app.dependency_overrides[get_current_user] = lambda: "test_user_id"


def test_process_voice_endpoint():
    with (
        patch(
            "routers.voice.generate_chat_response", new_callable=AsyncMock
        ) as mock_chat,
        patch("routers.voice.generate_speech", new_callable=AsyncMock) as mock_speech,
    ):
        mock_chat.return_value = {"reply": "Hi there!"}
        mock_speech.return_value = b"dummy audio bytes"

        response = client.post("/chat/voice", json={"text": "Hello"})

        assert response.status_code == 200
        data = response.json()
        assert "text" in data
        assert "audio_base64" in data
        assert "status" in data
        assert data["text"] == "Hi there!"
        assert data["status"] == "success"
        assert data["audio_base64"] == base64.b64encode(b"dummy audio bytes").decode(
            "utf-8"
        )


def test_process_voice_empty_text():
    response = client.post("/chat/voice", json={"text": ""})
    assert response.status_code == 400
    assert response.json()["detail"] == "Text cannot be empty"


def test_process_voice_whitespace_text():
    response = client.post("/chat/voice", json={"text": "   "})
    assert response.status_code == 400
    assert response.json()["detail"] == "Text cannot be empty"
