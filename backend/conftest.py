import os
import pytest


@pytest.fixture(scope="session", autouse=True)
def set_dummy_env():
    if "GEMINI_API_KEY" not in os.environ:
        os.environ["GEMINI_API_KEY"] = "dummy"
