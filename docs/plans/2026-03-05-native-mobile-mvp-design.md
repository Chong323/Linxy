# Linxy: Native Mobile MVP Design
Date: 2026-03-05

## 1. Overview
The goal of this phase is to deliver the first monetizable MVP for Linxy: a sticky, engaging, native mobile application tailored specifically for the child's experience (Explorer Mode). The parent's control center (Architect Mode) will remain on the Next.js web dashboard for this initial MVP.

## 2. Tech Stack
- **Framework:** Expo (React Native) utilizing Expo Router for navigation.
- **Styling:** NativeWind (Tailwind CSS for React Native) to maintain parity with our web UI.
- **State Management:** React Context API or Zustand (lightweight).
- **Audio Handling:**
  - **Speech-to-Text (STT):** `@react-native-community/voice` (Native iOS/Android dictation). Fast, free, and accurate.
  - **Text-to-Speech (TTS):** `expo-av` to play the byte stream returned from the FastAPI ElevenLabs integration.

## 3. UI/UX Architecture
The application features a single, primary full-screen view focused on the "Digital Companion" experience.

### 3.1 Layout Structure
- **Avatar Area (Top 60%):** A large, friendly, animated avatar that visually indicates Linxy's current state:
  - *Idle:* Breathing slowly, blinking.
  - *Listening:* Ear icon active, leaning forward, pulsing slightly.
  - *Thinking:* Loading dots, pondering animation.
  - *Speaking:* Mouth moving in sync with audio output.
- **Caption/Transcript Area (Middle 20%):** A dedicated text box displaying the ongoing conversation.
  - Shows what the child just said (transcribed or typed).
  - Shows Linxy's response text as she speaks (essential for early readers or loud environments).
- **Input Area (Bottom 20%):** The control center for the child.
  - **Mode Toggle:** A button to switch between "Voice" and "Keyboard" input modes.
  - **Voice Mode:** A large, prominent "Hold to Talk" (Push-to-Talk) button. Releasing the button triggers the send.
  - **Type Mode:** A standard text input field with a "Send" button.

## 4. Data Flow & Backend Integration

### 4.1 Text Mode Flow
1. User types a message and hits "Send".
2. App sets state to `Thinking`.
3. App sends a `POST /chat` request to the backend with `{ "message": "hello" }`.
4. Backend returns the AI's JSON text response.
5. App updates the Caption Area with the response.
6. App sets state to `Idle`.

### 4.2 Voice Mode Flow (Push-to-Talk)
1. User holds the "Talk" button. App sets state to `Listening`.
2. Native dictation (`@react-native-community/voice`) captures the speech and transcribes it to text locally.
3. User releases the button. App sets state to `Thinking`.
4. App sends the transcribed string to `POST /chat/voice` via FormData or JSON.
5. Backend processes the text with Gemini, saves memories, and generates TTS via ElevenLabs.
6. Backend returns the raw audio bytes (`audio/mpeg`) along with the text transcript (via headers or a multipart response if needed, otherwise just audio and a separate text fetch).
7. App sets state to `Speaking`.
8. `expo-av` plays the audio stream. The Caption Area updates with the transcribed text.
9. When playback finishes, App sets state to `Idle`.

## 5. Future Considerations
- Adding a "Sticker Book" or "Streak" overlay to gamify daily usage.
- Handling offline states gracefully.
