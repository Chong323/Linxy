import json
import pytest
from unittest.mock import MagicMock
from services.memory_service import get_rewards, add_reward
import services.memory_service as memory_service

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
async def test_get_rewards_empty_when_no_data(mock_supabase_client):
    mock_client, mock_execute, mock_upsert = mock_supabase_client
    # Make select return empty data
    mock_execute.data = []

    rewards = await get_rewards("test_user_id")
    assert rewards == []


@pytest.mark.anyio
async def test_get_rewards_returns_list_when_data_exists(mock_supabase_client):
    mock_client, mock_execute, mock_upsert = mock_supabase_client
    # Make select return some data
    mock_execute.data = [{"rewards": [{"id": 1, "name": "Star"}]}]

    rewards = await get_rewards("test_user_id")
    assert len(rewards) == 1
    assert rewards[0]["name"] == "Star"


@pytest.mark.anyio
async def test_add_reward_updates_data(mock_supabase_client):
    mock_client, mock_execute, mock_upsert = mock_supabase_client
    
    # Initial state: empty rewards
    mock_execute.data = []

    await add_reward("test_user_id", "Star", "Reason 1")
    
    # Assert upsert was called with the right data structure
    # Wait, the add_reward first gets rewards, then upserts the new list.
    mock_table = mock_client.table.return_value
    mock_table.upsert.assert_called_once()
    
    args, kwargs = mock_table.upsert.call_args
    assert args[0]["user_id"] == "test_user_id"
    assert "rewards" in args[0]
    assert len(args[0]["rewards"]) == 1
    assert args[0]["rewards"][0]["sticker"] == "Star"
    assert args[0]["rewards"][0]["reason"] == "Reason 1"
