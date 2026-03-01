import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Singleton instance
_supabase_client: Client | None = None

def get_supabase_client() -> Client:
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    url: str = os.environ.get("SUPABASE_URL", "")
    key: str = os.environ.get("SUPABASE_KEY", "")
    if not url or not key:
        raise ValueError("Supabase credentials not found in environment.")
    
    _supabase_client = create_client(url, key)
    return _supabase_client