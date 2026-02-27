import os

# Set dummy key before importing anything that uses it
if "GEMINI_API_KEY" not in os.environ:
    os.environ["GEMINI_API_KEY"] = "dummy"

from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)


@pytest.mark.anyio
async def test_wakeup_endpoint(monkeypatch):
    async def mock_generate_wakeup():
        return "Rise and shine!"

    monkeypatch.setattr("main.generate_wakeup_message", mock_generate_wakeup)

    response = client.get("/chat/wakeup")
    assert response.status_code == 200
    assert response.json() == {"reply": "Rise and shine!"}


@pytest.mark.anyio
async def test_child_rewards_endpoint(monkeypatch):
    async def mock_get_rewards():
        return [
            {"sticker": "Dino", "reason": "Drawing", "timestamp": "2023-10-27T10:00:00"}
        ]

    monkeypatch.setattr("services.memory_service.get_rewards", mock_get_rewards)
    # main.py imports get_rewards from services.memory_service too, let's patch it there if needed
    # But wait, main.py does: from services.memory_service import ... get_episodic_memory ...
    # It does NOT import get_rewards currently. I will be adding it.
    # So I will need to patch main.get_rewards once I add it.

    # For now, let's assume I will import it in main.
    monkeypatch.setattr("main.get_rewards", mock_get_rewards)

    response = client.get("/child/rewards")
    assert response.status_code == 200
    data = response.json()
    assert "rewards" in data
    assert len(data["rewards"]) == 1
    assert data["rewards"][0]["sticker"] == "Dino"


@pytest.mark.anyio
async def test_chat_endpoint_with_sticker(monkeypatch):
    async def mock_generate_chat_response(message, history):
        return {
            "reply": "Here is a sticker for you!",
            "awarded_sticker": {"sticker": "Star", "reason": "Good job!"},
        }

    monkeypatch.setattr("main.generate_chat_response", mock_generate_chat_response)

    payload = {"message": "I finished my homework!", "history": []}
    response = client.post("/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["reply"] == "Here is a sticker for you!"
    assert "awarded_sticker" in data
    assert data["awarded_sticker"]["sticker"] == "Star"
