import pytest
from unittest.mock import MagicMock
from services import memory_service
from datetime import datetime

@pytest.fixture
def mock_supabase_client(monkeypatch):
    mock_client = MagicMock()
    mock_table = MagicMock()
    mock_select = MagicMock()
    mock_eq = MagicMock()
    mock_execute = MagicMock()
    mock_upsert = MagicMock()

    mock_client.table.return_value = mock_table
    mock_table.select.return_value = mock_select
    mock_select.eq.return_value = mock_eq
    mock_eq.execute.return_value = mock_execute
    mock_table.upsert.return_value = mock_upsert

    # Set up default empty response
    mock_execute.data = []

    monkeypatch.setattr("services.memory_service.get_supabase_client", lambda: mock_client)
    return mock_client, mock_execute, mock_upsert

@pytest.mark.anyio
async def test_add_and_get_reward(mock_supabase_client):
    mock_client, mock_execute, mock_upsert = mock_supabase_client
    # simulate empty initially
    mock_execute.data = []

    sticker = "Dinosaur"
    reason = "Completed the drawing"

    await memory_service.add_reward("test_user_id", sticker, reason)

    # Now simulate getting the rewards we just upserted
    # Upsert receives {"user_id": ..., "rewards": [the new reward]}
    # We can inspect the mock call
    args, kwargs = mock_client.table().upsert.call_args
    upserted_data = args[0]
    
    mock_execute.data = [{"rewards": upserted_data["rewards"]}]

    rewards = await memory_service.get_rewards("test_user_id")
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
async def test_rewards_persistence(mock_supabase_client):
    mock_client, mock_execute, mock_upsert = mock_supabase_client
    mock_execute.data = []

    await memory_service.add_reward("test_user_id", "Star", "Good behavior")

    args, kwargs = mock_client.table().upsert.call_args
    upserted_data = args[0]
    mock_execute.data = [{"rewards": upserted_data["rewards"]}]

    # Simulate fresh start by reading directly from DB
    content = await memory_service.get_rewards("test_user_id")
    assert len(content) == 1
    assert content[0]["sticker"] == "Star"


@pytest.mark.anyio
async def test_get_rewards_empty(mock_supabase_client):
    mock_client, mock_execute, mock_upsert = mock_supabase_client
    mock_execute.data = []
    
    rewards = await memory_service.get_rewards("test_user_id")
    assert rewards == []
