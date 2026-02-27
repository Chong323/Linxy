# Linxy Development Roadmap

This document serves as the living project plan and roadmap for **Linxy: The Digital Bridge**.
We update this file as we make progress.

## Phase 1: The "Soul" Prototype (MVP)
**Goal:** Validate the "Memory" and "Persona" loop.

- [x] **Project Initialization**
  - [x] Create monorepo structure (`/frontend` and `/backend`).
  - [x] Setup `AGENTS.md` guidelines for AI agents.
  - [x] Initial git commit.
- [x] **Backend: Memory Engine Foundation**
  - [x] Setup FastAPI structure.
  - [x] Create file I/O for `soul.md`, `core_instructions.md`, and `episodic_memory.json`.
  - [x] Setup local mock user directory structure.
- [x] **Backend: Chat & AI Integration**
  - [x] Integrate Google Gemini SDK.
  - [x] Create `/chat` endpoint (assembles context from `soul.md` and `core_instructions.md`).
  - [x] Create `/parent/command` endpoint to update `core_instructions.md`.
  - [x] Fix dotenv loading issues to ensure API key access.
- [x] **Frontend: Foundation & UI (Explorer & Architect Modes)**
  - [x] Setup Next.js, Tailwind, Shadcn UI.
  - [x] Build Dual-Mode Layout (Child/Parent toggle).
  - [x] Build Explorer Mode (Child Chat Interface).
  - [x] Build Architect Mode (Parent Command Input Interface).
- [x] **Phase 1 Polish & QA**
  - [x] Connect the Next.js UI to the FastAPI backend successfully.
  - [x] Test the memory context loop end-to-end (add parent command -> see it affect child chat).
  - [x] Fix any immediate bugs.

## Phase 2: The "Bridge" Connection
**Goal:** Enable feedback loops and growth insights.

- [x] **Reflection Agent (Backend)**
  - [x] Create an async background task or endpoint that runs after a session.
  - [x] Summarize chat logs and extract milestones/interests.
  - [x] Write summaries to `episodic_memory.json`.
- [x] **Parent Reports (Frontend)**
  - [x] Build a dashboard displaying "Top 3 Interests of the Week" extracted from memory.
  - [x] Fetch data from the backend to populate the dashboard.
- [x] **Prompt Engineering Polish**
  - [x] Refine system prompts to make the AI sound less robotic and more companion-like.
  - [x] Inject `episodic_memory.json` context into the chat prompt so Linxy can proactively ask about past topics.
- [x] **Session Management (Frontend to Backend)**
  - [x] Add "End Session" functionality to `ChildChat` to trigger `/chat/reflect` and generate the memory log.
  - [x] Clear chat state after successful reflection.

## Phase 3: The "Smart" Architect
**Goal:** Intelligent parent guidance and polished UX.

- [x] **Guided Parent Chat (Frontend & Backend)**
  - [x] Add a conversational interface for parents in Architect Mode.
  - [x] Parent AI interviews parents to uncover needs, automatically synthesizing them into `core_instructions.md`.
- [x] **Structured Reports**
  - [x] PDF generation or visual charts for child development.
- [x] **UI/UX Polish**
  - [x] Add child-friendly avatars and interface themes.
  - [x] Improve animations and chat transitions.

## Phase 4: Reliability, Safety, & The "Living Companion" Pivot
**Goal:** Harden the architecture, add safety guardrails, and transform into a proactive, habit-forming PWA.

- [x] **Task 1: AI Reliability & Safety Hardening (Critical)**
  - [x] **Function Calling Migration:** Replace brittle Regex parsing (`[SAVE_INSTRUCTION]`) with robust Gemini Function Calling / Structured Outputs for parent directives.
  - [x] **Guardrails Protocol:** Implement strict system prompt boundaries for crisis detection (self-harm, abuse) and jailbreak prevention.
- [x] **Task 2: The "Living" Architecture Upgrade**
  - [x] Rename `soul.md` to `identity.md` in file system and `memory_service.py`.
  - [x] Implement `current_state.md` read/write handlers.
  - [x] **Context Window Optimization:** Implement a rolling-window summarizer. Extract older `episodic_memory.json` entries into a `long_term_summary.md` to prevent LLM token bloat.
- [x] **Task 3: Proactive Wake-Up & Gamification (Backend/Frontend)**
  - [x] Create `/chat/wakeup` endpoint for personalized first messages based on `current_state.md`.
  - [x] **Gamification:** Tie wake-up interactions to small digital rewards (e.g., unlocking a virtual sticker for responding).
  - [x] Refactor `ChildChat` to automatically fetch the first message from `/chat/wakeup` on mount.
- [x] **Task 4: Curriculum Engine (Backend)**
  - [x] Update `llm_service.py` system prompts to strongly enforce grade-level appropriateness.
  - [x] Ensure `core_instructions.md` acts as the primary syllabus constraint before casual chat.
- [ ] **Task 5: The Confidentiality Protocol ("The Anti-Snitch Protocol")**
  - [ ] Refactor `run_session_reflection` to extract *themes* and *emotional trends* into `parent_reports.json`, rather than exposing raw child transcripts to parents (protecting child trust).
  - [ ] Update Parent Dashboard to read from `parent_reports.json`.
- [ ] **Task 6: PWA Implementation (Frontend)**
  - [ ] Add `manifest.json` and meta tags for iOS/Android home screen installation.

## Phase 5: Production & Scale
**Goal:** Move from local MVP to production-ready architecture.

- [ ] **Database & Auth (Supabase) - *Solves Concurrency***
  - [ ] Replace mock local file system (`aiofiles`) with Supabase Storage/PostgreSQL to prevent read/write race conditions during active chats.
  - [ ] Add user authentication (Parent login) via Supabase Auth.
- [ ] **Deployment**
  - [ ] Deploy frontend (Vercel).
  - [ ] Deploy backend (Render/Railway).
- [ ] **Native Transition (Future)**
  - [ ] Wrap the validated PWA into a native App (React Native/Flutter).