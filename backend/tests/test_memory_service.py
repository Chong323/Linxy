import json
import pytest
from services.memory_service import get_rewards, add_reward
import services.memory_service as memory_service


@pytest.fixture
def mock_mem_dir(tmp_path, monkeypatch):
    monkeypatch.setattr(memory_service, "BASE_MEM_DIR", tmp_path)
    return tmp_path


@pytest.mark.anyio
async def test_get_rewards_empty_when_file_not_exists(mock_mem_dir):
    rewards = await get_rewards()
    assert rewards == []


@pytest.mark.anyio
async def test_get_rewards_returns_list_when_file_exists(mock_mem_dir):
    rewards_file = mock_mem_dir / "rewards.json"
    rewards_file.write_text(json.dumps([{"id": 1, "name": "Star"}]))

    rewards = await get_rewards()
    assert len(rewards) == 1
    assert rewards[0]["name"] == "Star"


@pytest.mark.anyio
async def test_add_reward_creates_file_and_appends(mock_mem_dir):
    await add_reward("Star", "Reason 1")

    rewards = await get_rewards()
    assert len(rewards) == 1
    assert rewards[0]["sticker"] == "Star"
    assert rewards[0]["reason"] == "Reason 1"

    await add_reward("Heart", "Reason 2")

    rewards = await get_rewards()
    assert len(rewards) == 2
    assert rewards[1]["sticker"] == "Heart"
    assert rewards[1]["reason"] == "Reason 2"
