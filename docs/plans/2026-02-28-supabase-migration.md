# Supabase Database Migration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task.

**Goal:** Migrate the backend's local file storage system (`aiofiles`) to a concurrent Supabase PostgreSQL database to support production scale, resolve read/write concurrency issues, and implement real JWT-based authentication.

**Architecture:** We will replace file I/O operations in `backend/services/memory_service.py` with Supabase client calls. We will also introduce a FastAPI dependency for verifying Supabase JWTs. Finally, we provide a SQL script to initialize the tables in Supabase.

**Tech Stack:** Python 3.13, FastAPI, Supabase Python Client (`supabase`)

---

### Task 1: Create Supabase SQL Schema

**Files:**
- Create: `backend/supabase_schema.sql`

**Step 1: Write SQL schema**
```sql
-- Create a table for memories
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    identity JSONB DEFAULT '{}'::jsonb,
    current_state JSONB DEFAULT '{}'::jsonb,
    long_term_summary JSONB DEFAULT '{}'::jsonb,
    core_instructions JSONB DEFAULT '[]'::jsonb,
    episodic_memory JSONB DEFAULT '[]'::jsonb,
    rewards JSONB DEFAULT '[]'::jsonb,
    parent_reports JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Row Level Security (RLS)
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memories" 
ON memories FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories" 
ON memories FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own memories" 
ON memories FOR INSERT 
WITH CHECK (auth.uid() = user_id);
```

**Step 2: Commit**
```bash
git add backend/supabase_schema.sql
git commit -m "chore: add supabase sql migration script"
```

---

### Task 2: Add Supabase Dependencies

**Files:**
- Modify: `backend/requirements.txt`
- Modify: `backend/.env.example`

**Step 1: Write minimal implementation**
Append to `backend/requirements.txt`:
```text
supabase
PyJWT
```
Append to `backend/.env.example`:
```text
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
```

**Step 2: Run installation to verify**
Run: `pip install -r backend/requirements.txt`

**Step 3: Commit**
```bash
git add backend/requirements.txt backend/.env.example
git commit -m "chore: add supabase and pyjwt dependencies"
```

---

### Task 3: Initialize Supabase Client

**Files:**
- Create: `backend/services/supabase_client.py`

**Step 1: Write the failing test**
```python
# backend/tests/test_supabase_client.py
from services.supabase_client import get_supabase_client

def test_supabase_client_initialization():
    client = get_supabase_client()
    assert client is not None
```

**Step 2: Run test to verify it fails**
Run: `pytest backend/tests/test_supabase_client.py`

**Step 3: Write minimal implementation**
```python
# backend/services/supabase_client.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def get_supabase_client() -> Client:
    url: str = os.environ.get("SUPABASE_URL", "")
    key: str = os.environ.get("SUPABASE_KEY", "")
    if not url or not key:
        raise ValueError("Supabase credentials not found in environment.")
    return create_client(url, key)
```

**Step 4: Run test to verify it passes**
(You will need to mock the environment variables in pytest)
Run: `pytest backend/tests/test_supabase_client.py`

**Step 5: Commit**
```bash
git add backend/services/supabase_client.py backend/tests/test_supabase_client.py
git commit -m "feat: initialize supabase client connection"
```

---

### Task 4: Implement FastAPI Auth Dependency

**Files:**
- Create: `backend/services/auth_service.py`
- Modify: `backend/routers/chat.py` (example integration)

**Step 1: Write auth service**
```python
# backend/services/auth_service.py
import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    secret = os.environ.get("SUPABASE_JWT_SECRET", "")
    if not secret:
        raise ValueError("Supabase JWT secret not found.")
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"], audience="authenticated")
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth credentials")
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

**Step 2: Commit**
```bash
git add backend/services/auth_service.py
git commit -m "feat: add JWT auth verification dependency"
```

---

### Task 5: Refactor `memory_service.py` to use Supabase

**Files:**
- Modify: `backend/services/memory_service.py`
- Modify: `backend/tests/test_memory_service.py`

**Step 1: Write the failing tests**
Update tests to mock the Supabase client instead of `aiofiles`.

**Step 2: Write minimal implementation**
Modify `backend/services/memory_service.py` to accept `user_id` in all functions.
Replace `aiofiles` reads/writes with:
```python
async def read_db_field(user_id: str, field: str, default=""):
    client = get_supabase_client()
    try:
        response = client.table("memories").select(field).eq("user_id", user_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0].get(field, default)
    except Exception:
        pass
    return default

async def write_db_field(user_id: str, field: str, value: any):
    client = get_supabase_client()
    data = {"user_id": user_id, field: value}
    client.table("memories").upsert(data).execute()
```

**Step 3: Run existing system tests to verify End-to-End**
Run: `pytest backend/tests/`

**Step 4: Commit**
```bash
git add backend/services/memory_service.py backend/tests/
git commit -m "refactor: migrate memory_service to supabase"
```