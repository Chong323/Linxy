# Linxy Voice and Animation Interface Design

## 1. Overview
This document outlines the design for Linxy's core child-facing interface (Phase 6), shifting focus from complex gamification to a clean, highly responsive, character-driven experience. The goal is to make Linxy feel "alive" through synchronized state-based animations and high-quality conversational voice interactions.

## 2. Core Principles
*   **Clean & Straightforward:** Avoid cluttered UI. The focus is entirely on the interaction with the Linxy persona.
*   **Voice-First Interaction:** Typing should be secondary or completely hidden in Explorer Mode. The child speaks to interact.
*   **Emotional Presence:** The avatar must reflect the state of the conversation (listening, thinking, speaking) to maintain the illusion of a "Persistent Soul."

## 3. Architecture & Tech Stack

### 3.1 Visual Avatar (State-Based Animation)
Instead of complex 3D rigging or generative UI, the mobile client will use pre-rendered, state-based animations (e.g., Lottie or optimized GIFs/WebP loops).

**Defined Avatar States:**
*   **Idle:** Default state. Occasional blinking or subtle breathing motion.
*   **Listening:** Triggered when the microphone is active (Push-to-Talk pressed). Linxy leans in, or an ear icon is highlighted.
*   **Thinking:** Triggered while waiting for the backend API response. Linxy looks up, taps chin, or a loading indicator appears around the avatar.
*   **Speaking:** Triggered while TTS audio is playing. Avatar's mouth moves or bounces in sync with the audio playback duration.

### 3.2 Voice Input (Speech-to-Text - STT)
*   **Technology:** Native Device Dictation (e.g., via `expo-speech` or native iOS/Android speech APIs).
*   **Reasoning:** Provides the lowest latency and zero backend cost for the initial MVP. If child voice recognition proves too inaccurate, we will migrate to a cloud provider like OpenAI Whisper.
*   **UX:** A prominent "Push-to-Talk" button (or "Hold to Speak") in the UI.

### 3.3 Voice Output (Text-to-Speech - TTS)
*   **Technology:** Cloud TTS Provider (e.g., ElevenLabs or OpenAI TTS).
*   **Reasoning:** Native device voices are too robotic and break the immersion of the character. High-quality cloud TTS is mandatory for Linxy to sound empathetic and companion-like.
*   **Flow:**
    1.  Backend LLM generates text response.
    2.  Backend calls TTS API to generate audio.
    3.  Backend streams audio buffer (or returns a playable URL) to the mobile client.
    4.  Mobile client plays audio, triggering the "Speaking" visual state.

## 4. Interaction Flow
1.  **Idle:** Child opens Explorer Mode. Linxy avatar is in the `Idle` state.
2.  **Input:** Child presses and holds the microphone button. Avatar switches to `Listening`.
3.  **Processing:** Native device transcribes speech. Text is sent to the FastAPI backend (`POST /chat`). Avatar switches to `Thinking`.
4.  **Generation:** FastAPI processes the context, generates a response via LLM, and simultaneously fetches the TTS audio file for that response.
5.  **Output:** Mobile client receives the text and audio. It begins playing the audio. Avatar switches to `Speaking` for the duration of the audio playback.
6.  **Return to Idle:** Audio finishes; avatar returns to `Idle`.

## 5. Next Steps
1.  Implement the STT module on the mobile client (Expo).
2.  Source or create placeholder Lottie animations for the 4 core states.
3.  Integrate a TTS provider (e.g., ElevenLabs) into the FastAPI backend.
4.  Update the mobile UI to coordinate the avatar state machine with the audio/network events.