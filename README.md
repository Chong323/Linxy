# Linxy - The Digital Bridge

**Linxy** is an AI-powered educational companion software designed to act as a "Digital Bridge" between children and parents. 

Unlike standard chatbots that focus on Q&A, Linxy features a **"Persistent Soul Architecture"** (inspired by OpenClaw). It remembers past interactions, evolves with the child, and executes educational strategies defined by parents, providing weekly growth analytics and decision support.

### Watch the Phase 1 MVP Demo
https://github.com/user-attachments/assets/f74a9c1c-4232-45f1-86d8-f42fc8536420
<br>

## Core Value Proposition
* **For Children:** A "Real" Companion with empathy and memory, not a cold search engine.
* **For Parents:** An "Education Co-pilot" that transforms vague parenting anxieties into actionable interaction strategies and visualizable growth data.

## Product Architecture: The "Dual-Mode" System

### A. Explorer Mode (Child-Facing)
* **Role:** A curious, empathetic friend.
* **Key Features:**
  * **Proactive Interaction:** Initiates conversations based on past memories (e.g., "Hey, did you finish that dinosaur drawing we talked about yesterday?").
  * **Soul & Persona:** Driven by `soul.md`, defining personality traits (patient, humorous, encouraging).
  * **Guided Discovery:** Seamlessly integrates parent directives (e.g., "encourage brushing teeth") into natural storytelling or games, avoiding didactic lectures.

### B. Architect Mode (Parent-Facing)
* **Role:** A family education consultant.
* **Key Features:**
  * **Intent Translation:** Parents input simple text commands (e.g., "Focus on math logic today"). Linxy summarizes and writes this into the `core_instructions.md` memory file.
  * **Smart Coaching (Future):** An AI agent interviews the parent to uncover needs. *Parent: "He's shy." -> AI: "In which situations?" -> AI synthesizes a "Social Confidence Building" plan.*
  * **Growth Reports:** Weekly analysis of conversation logs to identify interests (e.g., "High interest in Astronomy"), emotional states, and cognitive patterns.

## The "Memory Engine" (Technical Highlight)
The core differentiator is the file-based memory system, ensuring continuity and personality:
* **`soul.md`**: Stores the AI's personality, tone, and current mood.
* **`core_instructions.md`**: Stores high-priority directives from parents (Write-access restricted to Parent Mode).
* **`episodic_memory.json`**: A timestamped log of significant events and learning milestones, updated by a background "Reflection Agent" after each session.

## Tech Stack
* **Frontend:** Next.js (TypeScript), Tailwind CSS, Shadcn UI
* **Backend:** Python (FastAPI)
* **AI/LLM:** Google Gemini API (`gemini-2.5-flash` for MVP)
* **Database/Storage:** Local File System (MVP) -> migrating to Supabase Storage

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
1. Go to **Architect Mode (Parent)** and type a directive like: "Encourage the child to eat their vegetables."
2. Go back to **Explorer Mode (Child)** and chat with Linxy. Notice how Linxy subtly weaves the directive into the conversation!

## Documentation for AI Agents
If you are an AI coding agent working on this repository, please review:
* `AGENTS.md` - Core operational guidelines, file locations, and build commands.
* `ROADMAP.md` - Current project phase and upcoming tasks.