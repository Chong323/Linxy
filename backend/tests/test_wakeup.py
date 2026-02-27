import os
import pytest
from unittest.mock import MagicMock

# Set dummy API key before importing llm_service to avoid crash during import
os.environ["GEMINI_API_KEY"] = "dummy_key"

from services import llm_service


@pytest.fixture
def mock_genai_client(monkeypatch):
    mock_client = MagicMock()
    mock_models = MagicMock()
    mock_client.models = mock_models
    monkeypatch.setattr(llm_service, "client", mock_client)
    return mock_client


@pytest.mark.anyio
async def test_generate_wakeup_message_with_memories(mock_genai_client, monkeypatch):
    # Mock data
    async def mock_get_identity():
        return "I am Linxy, a helpful AI companion."

    async def mock_get_current_state():
        return "The child was learning about dinosaurs."

    async def mock_get_episodic_memory():
        return [{"summary": "Talked about T-Rex", "interests": ["dinosaurs"]}]

    # Patch the imported functions in llm_service
    monkeypatch.setattr(llm_service, "get_identity", mock_get_identity)
    monkeypatch.setattr(llm_service, "get_current_state", mock_get_current_state)
    monkeypatch.setattr(llm_service, "get_episodic_memory", mock_get_episodic_memory)

    # Mock Gemini response
    mock_response = MagicMock()
    mock_response.text = "Hey! Ready to find more dinosaur bones?"
    mock_genai_client.models.generate_content.return_value = mock_response

    # specific model check
    expected_model = "gemini-2.5-flash"

    # Call function
    response = await llm_service.generate_wakeup_message()

    # Assertions
    assert response == "Hey! Ready to find more dinosaur bones?"

    # Verify Gemini was called with correct model and prompt
    args, kwargs = mock_genai_client.models.generate_content.call_args
    assert kwargs["model"] == expected_model

    # Check if prompt contains relevant info
    config = kwargs["config"]
    system_instruction = config.system_instruction
    assert "dinosaurs" in system_instruction or "T-Rex" in system_instruction
    assert "I am Linxy" in system_instruction


@pytest.mark.anyio
async def test_generate_wakeup_message_fallback(mock_genai_client, monkeypatch):
    # Mock empty data
    async def mock_get_identity():
        return "I am Linxy."

    async def mock_get_current_state():
        return ""

    async def mock_get_episodic_memory():
        return []

    monkeypatch.setattr(llm_service, "get_identity", mock_get_identity)
    monkeypatch.setattr(llm_service, "get_current_state", mock_get_current_state)
    monkeypatch.setattr(llm_service, "get_episodic_memory", mock_get_episodic_memory)

    # Call function
    response = await llm_service.generate_wakeup_message()

    # Assertions
    assert response == "Hi! I'm Linxy. What should we do today?"

    # Gemini should NOT be called
    mock_genai_client.models.generate_content.assert_not_called()


@pytest.mark.anyio
async def test_generate_wakeup_message_only_current_state(
    mock_genai_client, monkeypatch
):
    # Mock data: No memories, but has current state
    async def mock_get_identity():
        return "I am Linxy."

    async def mock_get_current_state():
        return "The child was building a lego castle."

    async def mock_get_episodic_memory():
        return []

    monkeypatch.setattr(llm_service, "get_identity", mock_get_identity)
    monkeypatch.setattr(llm_service, "get_current_state", mock_get_current_state)
    monkeypatch.setattr(llm_service, "get_episodic_memory", mock_get_episodic_memory)

    # Mock Gemini response
    mock_response = MagicMock()
    mock_response.text = "Hey! Want to finish that castle?"
    mock_genai_client.models.generate_content.return_value = mock_response

    # Call function
    response = await llm_service.generate_wakeup_message()

    # Assertions
    assert response == "Hey! Want to finish that castle?"

    # Gemini SHOULD be called
    mock_genai_client.models.generate_content.assert_called_once()

    # Check prompt content
    args, kwargs = mock_genai_client.models.generate_content.call_args
    config = kwargs["config"]
    assert "lego castle" in config.system_instruction
