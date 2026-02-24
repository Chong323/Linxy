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

- [ ] **Guided Parent Chat (Frontend & Backend)**
  - [ ] Add a conversational interface for parents in Architect Mode.
  - [ ] Parent AI interviews parents to uncover needs, automatically synthesizing them into `core_instructions.md`.
- [ ] **Structured Reports**
  - [ ] PDF generation or visual charts for child development.
- [ ] **UI/UX Polish**
  - [ ] Add child-friendly avatars and interface themes.
  - [ ] Improve animations and chat transitions.

## Phase 4: Production & Scale
**Goal:** Move from local MVP to production-ready architecture.

- [ ] **Database & Auth (Supabase)**
  - [ ] Replace mock local file system with Supabase Storage for memory files (`soul.md`, etc.).
  - [ ] Add user authentication (Parent login) via Supabase Auth.
  - [ ] Setup PostgreSQL for user metadata (if needed beyond file storage).
- [ ] **Deployment**
  - [ ] Deploy frontend (Vercel).
  - [ ] Deploy backend (Render/Railway).
- [ ] **Native Transition (Future)**
  - [ ] Wrap the validated PWA into a native App (React Native/Flutter).
