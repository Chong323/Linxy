# The Living Companion Pivot Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform Linxy from a command-based chatbot into a proactive, habit-forming PWA with a structured curriculum hook and a "Living" memory architecture.

**Architecture:** 
- **Backend:** Expand file-based memory in `memory_service.py` (`identity.md`, `current_state.md`). Add a `/chat/wakeup` endpoint for proactive conversation initiation. Modify the Reflection agent to produce dual outputs (child-private vs. parent-safe).
- **Frontend:** Update Next.js `ChildChat` to fetch the initial message on load. Add `manifest.json` for PWA installability.

**Tech Stack:** Next.js (TypeScript), FastAPI (Python), Google Gemini API, aiofiles

---

### Task 1: The "Living" Architecture Upgrade

**Files:**
- Modify: `backend/services/memory_service.py`
- Modify: `backend/services/llm_service.py`
- Modify: `backend/main.py`
- Rename: `backend/data/users/mock_user/memory/soul.md` -> `identity.md`
- Create: `backend/tests/test_memory_service.py`

**Step 1: Write the failing test**

```python
# backend/tests/test_memory_service.py
import pytest
from backend.services.memory_service import get_identity, get_current_state, write_current_state

@pytest.mark.asyncio
async def test_identity_and_current_state():
    identity = await get_identity()
    assert isinstance(identity, str)
    
    await write_current_state("Waiting for user.")
    state = await get_current_state()
    assert state == "Waiting for user."
```

**Step 2: Run test to verify it fails**

Run: `cd backend && pytest tests/test_memory_service.py -v`
Expected: FAIL with "ImportError: cannot import name 'get_identity'"

**Step 3: Write minimal implementation**

1. In bash: `mv backend/data/users/mock_user/memory/soul.md backend/data/users/mock_user/memory/identity.md`
2. Update `backend/services/memory_service.py`:
```python
import json
from pathlib import Path
import aiofiles

BASE_MEM_DIR = Path("data/users/mock_user/memory")

async def read_file(path: Path) -> str:
    if not path.exists():
        return ""
    async with aiofiles.open(path, mode="r") as f:
        return await f.read()

async def write_file(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    async with aiofiles.open(path, mode="w") as f:
        await f.write(content)

async def get_identity() -> str:
    return await read_file(BASE_MEM_DIR / "identity.md")

async def get_current_state() -> str:
    return await read_file(BASE_MEM_DIR / "current_state.md")

async def write_current_state(state: str) -> None:
    await write_file(BASE_MEM_DIR / "current_state.md", state)

async def get_core_instructions() -> str:
    return await read_file(BASE_MEM_DIR / "core_instructions.md")

async def add_core_instruction(instruction: str) -> None:
    current = await get_core_instructions()
    new_content = f"{current}\n- {instruction}".strip()
    await write_file(BASE_MEM_DIR / "core_instructions.md", new_content)

async def get_episodic_memory() -> list:
    path = BASE_MEM_DIR / "episodic_memory.json"
    if not path.exists():
        return []
    async with aiofiles.open(path, mode="r") as f:
        content = await f.read()
        return json.loads(content) if content else []

async def write_episodic_memory(memory_list: list) -> None:
    path = BASE_MEM_DIR / "episodic_memory.json"
    await write_file(path, json.dumps(memory_list, indent=2))

async def add_episodic_memory(memory_item: dict) -> None:
    current_memories = await get_episodic_memory()
    current_memories.append(memory_item)
    await write_episodic_memory(current_memories)
```
3. Fix imports in `backend/main.py` and `backend/services/llm_service.py` from `get_soul` to `get_identity`. Update prompt building in `llm_service.py` to use `get_identity()`.

**Step 4: Run test to verify it passes**

Run: `cd backend && pytest tests/test_memory_service.py -v`
Expected: PASS

**Step 5: Commit**

```bash
git add backend/
git commit -m "feat: upgrade to living architecture with identity and current_state"
```

---

### Task 2: Proactive Wake-Up (Backend)

**Files:**
- Modify: `backend/main.py`
- Modify: `backend/services/llm_service.py`
- Create: `backend/tests/test_wakeup.py`

**Step 1: Write the failing test**

```python
# backend/tests/test_wakeup.py
import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_wakeup_endpoint():
    response = client.get("/chat/wakeup")
    assert response.status_code == 200
    assert "reply" in response.json()
```

**Step 2: Run test to verify it fails**

Run: `cd backend && pytest tests/test_wakeup.py -v`
Expected: FAIL with 404 Not Found.

**Step 3: Write minimal implementation**

In `backend/services/llm_service.py`, add:
```python
from services.memory_service import get_current_state, write_current_state

async def generate_wakeup_message() -> str:
    identity = await get_identity()
    core_inst = await get_core_instructions()
    current_state = await get_current_state()
    
    # We use a very simple prompt for MVP
    prompt = f"""
    Identity: {identity}
    Instructions: {core_inst}
    Current State / Mood: {current_state}
    
    You are Linxy. The user just opened the app. Generate a short, enthusiastic, 1-2 sentence greeting to start the conversation proactively. 
    Use the current state and instructions if relevant.
    """
    response = model.generate_content(prompt)
    reply = response.text.strip()
    
    # Reset current state to active
    await write_current_state("User is currently chatting.")
    
    return reply
```

In `backend/main.py`, add the endpoint:
```python
from services.llm_service import generate_wakeup_message

@app.get("/chat/wakeup", response_model=ChatResponse)
async def wakeup_endpoint():
    try:
        reply = await generate_wakeup_message()
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

**Step 4: Run test to verify it passes**

Run: `cd backend && pytest tests/test_wakeup.py -v`
Expected: PASS

**Step 5: Commit**

```bash
git add backend/
git commit -m "feat: add proactive wakeup endpoint for AI initiation"
```

---

### Task 3: Proactive UX (Frontend)

**Files:**
- Modify: `frontend/src/components/child-chat.tsx`

**Step 1: Minimal implementation for proactive UX**

Update `ChildChat` to fetch the wakeup message on mount instead of a hardcoded array.

```tsx
// Inside frontend/src/components/child-chat.tsx
import { useState, useRef, useEffect } from "react"
// ... imports

export function ChildChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isEndingSession, setIsEndingSession] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch initial wakeup message on mount
  useEffect(() => {
    const fetchWakeup = async () => {
      setIsLoading(true)
      try {
        const response = await apiClient.get("/chat/wakeup")
        const data = await response.json()
        if (response.ok && data.reply) {
          setMessages([{ role: "model", content: data.reply }])
        } else {
          setMessages([{ role: "model", content: "Hi! I'm Linxy. How are you doing today?" }])
        }
      } catch (e) {
        setMessages([{ role: "model", content: "Hi! I'm Linxy. How are you doing today?" }])
      } finally {
        setIsLoading(false)
      }
    }
    fetchWakeup()
  }, [])

  // ... rest of the file ...
  // When resetting the chat after handleEndSession:
  // setMessages([])
  // then ideally call fetchWakeup() again, or let a reload handle it.
```

**Step 2: Commit**

```bash
git add frontend/src/components/child-chat.tsx
git commit -m "feat: child chat fetches proactive wakeup message on load"
```

---

### Task 4: Curriculum Engine System Prompts (Backend)

**Files:**
- Modify: `backend/services/llm_service.py`

**Step 1: Write the minimal implementation**

Update `generate_chat_response` prompt to strictly enforce the curriculum and grade-level behavior:

```python
async def generate_chat_response(message: str, history: list[dict]) -> str:
    identity = await get_identity()
    core_inst = await get_core_instructions()
    episodic = await get_episodic_memory()
    
    # Summarize recent memory for prompt limit protection
    recent_memory = json.dumps(episodic[-3:]) if episodic else "None"
    
    system_prompt = f"""
    {identity}
    
    CRITICAL INSTRUCTIONS / SYLLABUS:
    {core_inst}
    
    RULES:
    1. Before you engage in casual chat, you MUST weave in 1 educational question or concept from the instructions above.
    2. Act as a peer. Never lecture. Use age-appropriate language based on the instructions.
    3. Keep responses under 3 sentences.
    
    Recent memories: {recent_memory}
    """
    # ... existing generation logic
```

**Step 2: Commit**

```bash
git add backend/services/llm_service.py
git commit -m "feat: enforce curriculum constraints in LLM chat prompts"
```

---

### Task 5: The Confidentiality Protocol (Backend & Frontend)

**Files:**
- Modify: `backend/services/llm_service.py`
- Modify: `backend/services/memory_service.py`
- Modify: `backend/main.py`
- Create: `backend/tests/test_confidentiality.py`
- Modify: `frontend/src/components/parent-dashboard.tsx`

**Step 1: Write the failing test**

```python
# backend/tests/test_confidentiality.py
import pytest
from backend.services.memory_service import get_parent_reports, add_parent_report

@pytest.mark.asyncio
async def test_parent_reports():
    await add_parent_report({"summary": "Child learned math."})
    reports = await get_parent_reports()
    assert len(reports) > 0
    assert "math" in reports[0]["summary"]
```

**Step 2: Run test to verify it fails**

Run: `cd backend && pytest tests/test_confidentiality.py -v`
Expected: FAIL

**Step 3: Write minimal implementation**

Update `memory_service.py`: Add `get_parent_reports()` and `add_parent_report()` writing to `parent_reports.json`.

Update `llm_service.py` (`run_session_reflection`):
Instead of returning one summary, ask the LLM for JSON with two keys:
`{"private_memory": "Child is scared of spiders.", "parent_report": "Emotional state: anxious today. No academic progress."}`
Save `private_memory` to `episodic_memory.json` and `parent_report` to `parent_reports.json`.

Update `main.py`: Modify `/chat/reflect` to save both. Modify `/parent/reports` to fetch from `get_parent_reports()`.

Update `frontend/src/components/parent-dashboard.tsx`: Update the typing to match the new `parent_reports` format (e.g. `data.memories.parent_report`).

**Step 4: Run test to verify it passes**

Run: `cd backend && pytest tests/test_confidentiality.py -v`
Expected: PASS

**Step 5: Commit**

```bash
git add backend/ frontend/
git commit -m "feat: implement confidentiality protocol with separate parent reports"
```

---

### Task 6: PWA Implementation (Frontend)

**Files:**
- Create: `frontend/public/manifest.json`
- Modify: `frontend/src/app/layout.tsx`

**Step 1: Write the minimal implementation**

Create `frontend/public/manifest.json`:
```json
{
  "name": "Linxy",
  "short_name": "Linxy",
  "description": "The Digital Bridge",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/globe.svg",
      "sizes": "192x192",
      "type": "image/svg+xml"
    }
  ]
}
```

Update `frontend/src/app/layout.tsx`:
```tsx
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Linxy",
  description: "The Digital Bridge",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Linxy",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
```

**Step 2: Commit**

```bash
git add frontend/
git commit -m "feat: add PWA manifest and viewport settings for mobile installation"
```