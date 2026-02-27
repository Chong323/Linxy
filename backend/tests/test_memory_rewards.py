import pytest
import json
from services import memory_service
from datetime import datetime


@pytest.fixture
def mock_mem_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(memory_service, "BASE_MEM_DIR", tmp_path)
    return tmp_path


@pytest.mark.anyio
async def test_add_and_get_reward(mock_mem_dir):
    sticker = "Dinosaur"
    reason = "Completed the drawing"

    # This will fail initially because the current implementation expects a dict
    await memory_service.add_reward(sticker, reason)

    rewards = await memory_service.get_rewards()
    assert len(rewards) == 1
    assert rewards[0]["sticker"] == sticker
    assert rewards[0]["reason"] == reason
    assert "timestamp" in rewards[0]

    # Verify it's a valid ISO timestamp
    try:
        datetime.fromisoformat(rewards[0]["timestamp"])
    except ValueError:
        pytest.fail("Timestamp is not in ISO format")


@pytest.mark.anyio
async def test_rewards_persistence(mock_mem_dir):
    await memory_service.add_reward("Star", "Good behavior")

    # Simulate fresh start by reading directly from file
    rewards_file = mock_mem_dir / "rewards.json"
    assert rewards_file.exists()

    content = json.loads(rewards_file.read_text())
    assert len(content) == 1
    assert content[0]["sticker"] == "Star"


@pytest.mark.anyio
async def test_get_rewards_empty(mock_mem_dir):
    rewards = await memory_service.get_rewards()
    assert rewards == []
