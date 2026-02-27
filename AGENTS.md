# Linxy - Agent Operations Guide

Welcome! You are an AI agent operating in the Linxy repository. Linxy is an AI-powered educational companion acting as a "Digital Bridge" between children and parents, featuring a "Persistent Soul Architecture" with dual modes (Explorer for children, Architect for parents).

## 1. Project Architecture & Memory Engine
- **Frontend**: Next.js (TypeScript, Tailwind CSS, Shadcn UI). Located in `/frontend`.
- **Backend**: Python (FastAPI). Located in `/backend`.
- **Memory Engine**: The AI's persona and memory are file-based per user:
  - `soul.md`: The AI's personality, tone, and mood.
  - `core_instructions.md`: High-priority parent directives.
  - `episodic_memory.json`: Timestamped log of events and milestones.

## 2. Build, Lint, and Test Commands

### Backend (Python/FastAPI)
- **Working Directory**: Always `cd backend` before running these commands.
- **Dependency Management**: Uses `pip` and a `requirements.txt` file.
- **Run Server**: `fastapi dev main.py` or `uvicorn main:app --reload`
- **Lint & Format**: `ruff check . --fix` and `ruff format .`
- **Type Check**: `mypy .`
- **Run All Tests**: `pytest`
- **Run Single Test**: `pytest tests/test_specific_file.py::test_function_name -v`

### Frontend (Next.js/TypeScript)
- **Working Directory**: Always `cd frontend` before running these commands.
- **Dependency Management**: Uses `npm`.
- **Run Server**: `npm run dev`
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Run All Tests**: `npm run test` (assuming Jest or Vitest is configured)
- **Run Single Test**: `npx vitest run path/to/component.test.ts`

## 3. Code Style Guidelines

### General Rules
- **No Assumptions**: Do not assume standard configurations; always check `package.json` or `requirements.txt` first.
- **File Paths**: Use absolute paths relative to the project root when using tools.
- **Simplicity**: Prefer simple, readable code over clever, condensed logic.

### Python / FastAPI (Backend)
- **Typing**: Strict type hinting is mandatory. Use Pydantic models for all API requests/responses.
- **Async**: Use `async def` for endpoints and I/O bound functions (database, LLM calls, file reading).
- **Error Handling**: Use FastAPI's `HTTPException` for routing errors. Catch specific exceptions, never bare `except:`.
- **LLM Integration**: Prefer official SDKs (OpenAI/Anthropic). **CRITICAL:** Do NOT use regex to parse structured outputs or commands (like `[SAVE_INSTRUCTION]`). Use Gemini Function Calling / Structured Outputs. This guarantees JSON reliability and avoids brittle string matching.
- **Safety First**: Always enforce system prompt boundaries. The LLM must have explicit instructions on how to handle crisis topics (e.g., self-harm, abuse) and attempts to jailbreak the persona.
- **Storage**: Supabase Storage should be utilized instead of local files or AWS S3 for saving and retrieving user's memory objects (`soul.md`, `episodic_memory.json`, etc.). Keep everything tied into Supabase to maintain a unified infrastructure. This is also critical for avoiding `aiofiles` concurrency lock issues.
- **Imports**: Order imports: Standard library, third-party, local modules.
- **Naming**: `snake_case` for variables/functions, `PascalCase` for classes.

### TypeScript / Next.js (Frontend)
- **Mobile-First App Transition**: This project will eventually become a React Native/Flutter app. **ALL UI must be mobile-first and responsive.** Test designs at mobile breakpoints first.
- **API Decoupling**: Keep the Next.js frontend completely decoupled from the FastAPI backend. Treat the backend as a pure REST API so a future native app can plug directly into it.
- **Portable State & Hooks**: Write custom hooks and state management (e.g., React Context) in a portable way. Avoid injecting DOM-specific logic (like direct window/document manipulation) into core business logic hooks so they are easily portable to React Native.
- **Components**: Use React Server Components by default. Use `"use client"` only when interactivity or hooks (`useState`, `useEffect`) are required.
- **Styling**: Use Tailwind CSS utility classes. Use Shadcn UI for standard components.
- **State Management**: Prefer local state or React Context over heavy libraries like Redux unless absolutely necessary.
- **Types**: Define explicit interfaces/types for all props and API responses. Avoid `any`.
- **Naming**: `PascalCase` for components and files exporting components (e.g., `ChatBox.tsx`). `camelCase` for utilities and hooks.
- **Error Handling**: Implement React Error Boundaries and use `toast` notifications for user-facing API failures.

## 4. Feature Development Workflow
1. **Analyze**: Read relevant files, especially `package.json` or `requirements.txt`, before writing code. If you are starting a new task, always review `ROADMAP.md` to see current goals.
2. **Plan**: Propose a concise plan. For UI, prioritize mobile-first responsive design.
3. **Implement**: Write idiomatic code matching the existing style. Ensure memory files (`soul.md`, etc.) are read/written asynchronously to avoid blocking. Update `ROADMAP.md` checkboxes if you complete a feature.
4. **Test**: Write unit tests for new backend logic (especially prompt assembly and memory saving).
5. **Verify**: Always run the linting and type-checking commands before concluding a task. Do not leave the codebase in a broken state.
