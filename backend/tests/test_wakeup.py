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
    async def mock_get_identity_dict(user_id):
        return {
            "ai": {"name": "Linxy", "persona": "a helpful AI companion."},
            "user": {"name": "the child", "grade_level": "Kindergarten (ages 4-6)"}
        }

    async def mock_get_current_state(user_id):
        return "The child was learning about dinosaurs."

    async def mock_get_episodic_memory(user_id):
        return [{"summary": "Talked about T-Rex", "interests": ["dinosaurs"]}]

    # Patch the imported functions in llm_service
    monkeypatch.setattr(llm_service, "get_identity_dict", mock_get_identity_dict)
    monkeypatch.setattr(llm_service, "get_current_state", mock_get_current_state)
    monkeypatch.setattr(llm_service, "get_episodic_memory", mock_get_episodic_memory)

    # Mock Gemini response
    mock_response = MagicMock()
    mock_response.text = "Hey! Ready to find more dinosaur bones?"
    mock_genai_client.models.generate_content.return_value = mock_response

    # specific model check
    expected_model = "gemini-2.5-flash"

    # Call function
    response = await llm_service.generate_wakeup_message("test_user_id")

    # Assertions
    assert response == "Hey! Ready to find more dinosaur bones?"

    # Verify Gemini was called with correct model and prompt
    args, kwargs = mock_genai_client.models.generate_content.call_args
    assert kwargs["model"] == expected_model

    # Check if prompt contains relevant info
    config = kwargs["config"]
    system_instruction = config.system_instruction
    assert "dinosaurs" in system_instruction or "T-Rex" in system_instruction
    assert "Linxy" in system_instruction


@pytest.mark.anyio
async def test_generate_wakeup_message_fallback(mock_genai_client, monkeypatch):
    # Mock empty data
    async def mock_get_identity_dict(user_id):
        return {
            "ai": {"name": "Linxy", "persona": "a friendly AI companion."},
            "user": {"name": "the child", "grade_level": "Kindergarten (ages 4-6)"}
        }

    async def mock_get_current_state(user_id):
        return ""

    async def mock_get_episodic_memory(user_id):
        return []

    monkeypatch.setattr(llm_service, "get_identity_dict", mock_get_identity_dict)
    monkeypatch.setattr(llm_service, "get_current_state", mock_get_current_state)
    monkeypatch.setattr(llm_service, "get_episodic_memory", mock_get_episodic_memory)

    # Call function
    response = await llm_service.generate_wakeup_message("test_user_id")

    # Assertions
    assert response == "Hi! I'm Linxy. What should we do today?"

    # Gemini should NOT be called
    mock_genai_client.models.generate_content.assert_not_called()


@pytest.mark.anyio
async def test_generate_wakeup_message_only_current_state(
    mock_genai_client, monkeypatch
):
    # Mock data: No memories, but has current state
    async def mock_get_identity_dict(user_id):
        return {
            "ai": {"name": "Linxy", "persona": "a friendly AI companion."},
            "user": {"name": "the child", "grade_level": "Kindergarten (ages 4-6)"}
        }

    async def mock_get_current_state(user_id):
        return "The child was building a lego castle."

    async def mock_get_episodic_memory(user_id):
        return []

    monkeypatch.setattr(llm_service, "get_identity_dict", mock_get_identity_dict)
    monkeypatch.setattr(llm_service, "get_current_state", mock_get_current_state)
    monkeypatch.setattr(llm_service, "get_episodic_memory", mock_get_episodic_memory)

    # Mock Gemini response
    mock_response = MagicMock()
    mock_response.text = "Hey! Want to finish that castle?"
    mock_genai_client.models.generate_content.return_value = mock_response

    # Call function
    response = await llm_service.generate_wakeup_message("test_user_id")

    # Assertions
    assert response == "Hey! Want to finish that castle?"

    # Gemini SHOULD be called
    mock_genai_client.models.generate_content.assert_called_once()

    # Check prompt content
    args, kwargs = mock_genai_client.models.generate_content.call_args
    config = kwargs["config"]
    assert "lego castle" in config.system_instruction


@pytest.mark.anyio
async def test_generate_wakeup_message_with_structured_identity(mock_genai_client, monkeypatch):
    async def mock_get_identity_dict(user_id):
        return {
            "ai": {"name": "Captain Sparkle", "persona": "a brave pirate"},
            "user": {"name": "Tommy", "grade_level": "1st Grade"}
        }
    monkeypatch.setattr(llm_service, "get_identity_dict", mock_get_identity_dict)
    
    async def mock_get_current_state(user_id):
        return "The child was learning about dinosaurs."

    async def mock_get_episodic_memory(user_id):
        return [{"summary": "Talked about T-Rex", "interests": ["dinosaurs"]}]

    monkeypatch.setattr(llm_service, "get_current_state", mock_get_current_state)
    monkeypatch.setattr(llm_service, "get_episodic_memory", mock_get_episodic_memory)
    
    mock_response = MagicMock()
    mock_response.text = "Ahoy there Tommy! Ready to find more dinosaur bones?"
    mock_genai_client.models.generate_content.return_value = mock_response
    
    await llm_service.generate_wakeup_message("test_user_id")
    
    args, kwargs = mock_genai_client.models.generate_content.call_args
    system_instruction = kwargs["config"].system_instruction
    assert "Captain Sparkle" in system_instruction
    assert "brave pirate" in system_instruction
