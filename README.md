# Linxy - The Digital Bridge

**Linxy** is an AI-powered educational companion software designed to act as a "Digital Bridge" between children and parents. 

Unlike standard chatbots that focus on Q&A, Linxy features a **"Persistent Soul Architecture"** (inspired by OpenClaw). It remembers past interactions, evolves with the child, and executes educational strategies defined by parents, providing weekly growth analytics and decision support.

### Watch the Phase 1 MVP Demo
[![Watch the Phase 1 MVP Demo](https://img.youtube.com/vi/VgkUjpEvDv4/maxresdefault.jpg)](https://youtu.be/VgkUjpEvDv4)
<br>

## Core Value Proposition
* **For Children:** A "Real" Companion with empathy and memory, not a cold search engine.
* **For Parents:** An "Education Co-pilot" that transforms vague parenting anxieties into actionable interaction strategies and visualizable growth data.

## Product Architecture: The "Dual-Mode" System

### A. Explorer Mode (Child-Facing)
* **Role:** A curious, empathetic friend.
* **Key Features:**
  * **Proactive Wake-Up:** Linxy initiates conversations based on past memories (e.g., "Hey, did you finish that dinosaur drawing we talked about yesterday?").
  * **Identity & Persona:** Driven by `identity.md`, defining personality traits (patient, humorous, encouraging), including grade-level settings.
  * **Gamification:** Awards virtual stickers for positive behavior, curiosity, and learning milestones.
  * **Guided Discovery:** Seamlessly integrates parent directives (e.g., "encourage brushing teeth") into natural storytelling or games, avoiding didactic lectures.

### B. Architect Mode (Parent-Facing)
* **Role:** A family education consultant.
* **Key Features:**
  * **Intent Translation:** Parents input simple text commands (e.g., "Focus on math logic today"). Linxy summarizes and writes this into the `core_instructions.md` memory file.
  * **Smart Coaching:** An AI agent interviews the parent to uncover needs. *Parent: "He's shy." -> AI: "In which situations?" -> AI synthesizes a "Social Confidence Building" plan.*
  * **Grade-Level Control:** Parents can set curriculum appropriateness (Kindergarten, 1st-5th grade).
  * **Growth Reports:** Sanitized analysis of conversation logs showing themes, emotional trends, and actionable parent suggestions (protecting child's privacy).

## The "Memory Engine" (Technical Highlight)
The core differentiator is the file-based memory system, ensuring continuity and personality:
* **`identity.md`**: Stores the AI's personality, tone, grade-level settings, and current mood.
* **`core_instructions.md`**: Stores high-priority educational directives from parents (Write-access restricted to Parent Mode).
* **`episodic_memory.json`**: A timestamped log of recent sessions (summary, interests, milestones).
* **`long_term_summary.md`**: A rolling-window summary of older episodes to prevent LLM context window bloat.
* **`current_state.md`**: Tracks the child's immediate context for proactive wake-up messages.
* **`rewards.json`**: Stores earned virtual stickers/achievements.
* **`parent_reports.json`**: Sanitized reports for parents (themes, emotional trends, suggestions) - protects child privacy.

## Tech Stack
* **Frontend (Legacy MVP):** Next.js (TypeScript), Tailwind CSS, Shadcn UI
* **Frontend (Production Mobile):** React Native (Expo) - *In Progress*
* **Backend:** Python (FastAPI)
* **AI/LLM:** Google Gemini API (`gemini-2.5-flash`). Using Structured Outputs/Function Calling for reliable agent tool use.
* **Database/Storage:** Local File System (MVP) -> migrating to Supabase PostgreSQL & Auth
* **Monetization:** RevenueCat (B2C Subscriptions)

## Getting Started

### 1. Backend Setup
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Create a .env file and add your Gemini API Key
echo "GEMINI_API_KEY=your_key_here" > .env

# Run the server
fastapi dev main.py
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 3. Usage
Open `http://localhost:3000`. You will see a Dual-Mode dashboard.

**Explorer Mode (Child):**
1. Linxy will proactively greet the child based on past conversations.
2. Chat with Linxy - it weaves educational goals into natural conversation.
3. Earn stickers for curiosity and learning!
4. End Session to save memories.

**Architect Mode (Parent):**
1. Use the conversational AI to set educational goals (e.g., "Focus on math").
2. Set grade-level appropriateness.
3. View Growth Insights - see themes, emotional trends, and suggestions (raw transcripts are hidden for privacy).

## Documentation for AI Agents
If you are an AI coding agent working on this repository, please review:
* `AGENTS.md` - Core operational guidelines, file locations, and build commands.
* `ROADMAP.md` - Current project phase and upcoming tasks.