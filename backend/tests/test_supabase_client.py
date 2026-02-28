from services.supabase_client import get_supabase_client

def test_supabase_client_initialization(monkeypatch):
    monkeypatch.setenv("SUPABASE_URL", "http://localhost:8000")
    monkeypatch.setenv("SUPABASE_KEY", "dummy_key")
    client = get_supabase_client()
    assert client is not None