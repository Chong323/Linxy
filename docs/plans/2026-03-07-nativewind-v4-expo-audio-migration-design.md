# Design: NativeWind v4 + expo-audio Migration

**Date:** 2026-03-07
**Status:** Approved
**Author:** Claude (opencode)

---

## Overview

Migrate the Linxy mobile app from deprecated `expo-av` to `expo-audio` for TTS playback. NativeWind v4 configuration and Tailwind class usage in `ChildScreen.tsx` are already correct — only the audio migration remains.

## Goals

1. Replace deprecated `expo-av` with modern `expo-audio` for TTS playback

## Non-Goals

- Changing the UI layout or design
- Modifying speech recognition (already uses `expo-speech-recognition`)
- NativeWind v4 configuration (already correctly set up)
- Backend changes

---

## Architecture

### Current State

```
ChildScreen.tsx
├── expo-av (Audio.Sound) - DEPRECATED
├── expo-speech-recognition (voice input)
└── NativeWind v4 (correctly configured, Tailwind className in use)
```

### Target State

```
ChildScreen.tsx
├── expo-audio (useAudioPlayer hook) - MODERN
├── expo-speech-recognition (voice input)
└── NativeWind v4 (no change needed)
```

---

## Component 1: expo-audio Migration

### API Mapping

| expo-av | expo-audio |
|---------|------------|
| `Audio.Sound.createAsync()` | `useAudioPlayer()` hook |
| `sound.playAsync()` | `player.play()` (synchronous, not async) |
| `sound.unloadAsync()` | automatic cleanup on unmount |
| `sound.setOnPlaybackStatusUpdate()` | `useAudioPlayerStatus(player)` hook |
| `status.didJustFinish` | `status.didJustFinish` via `useAudioPlayerStatus` |

### Implementation

**Before (expo-av):**
```typescript
import { Audio } from 'expo-av';

const [sound, setSound] = useState<Audio.Sound | null>(null);

const playAudio = async (base64: string) => {
  const dataUri = `data:audio/mp3;base64,${base64}`;
  const { sound: newSound } = await Audio.Sound.createAsync(
    { uri: dataUri },
    { shouldPlay: true }
  );
  setSound(newSound);
  await newSound.playAsync();
};
```

**After (expo-audio):**
```typescript
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';

// Initialize with no source — source is set dynamically per response
const player = useAudioPlayer();
const status = useAudioPlayerStatus(player);

const playAudio = (base64: string) => {
  const dataUri = `data:audio/mp3;base64,${base64}`;
  // replace() takes a source object, not a bare string
  player.replace({ uri: dataUri });
  // play() is synchronous, not async
  player.play();
};

// Detect playback completion
useEffect(() => {
  if (status.didJustFinish) {
    // handle post-playback state (e.g., return avatar to idle)
  }
}, [status.didJustFinish]);
```

**Important notes:**
- `player.replace({ uri })` takes a **source object** `{ uri: string }`, not a bare string.
- `player.play()` is **not async** and does not return a Promise.
- Use `useAudioPlayerStatus(player)` to track playback state reactively.
- `expo-audio` cleans up automatically on component unmount — no manual `unloadAsync` needed.
- Data URIs (`data:audio/mp3;base64,...`) are supported on iOS via the same underlying `AVPlayer`. Verify this works before completing the migration.

---

## Component 2: NativeWind v4 Configuration

**Status: Already complete. No changes required.**

All NativeWind v4 configuration files are correctly set up:

| File | Status | Notes |
|------|--------|-------|
| `global.css` | Correct | Has `@tailwind base/components/utilities` directives |
| `App.tsx` | Correct | `import './global.css'` is already the first import |
| `nativewind-env.d.ts` | Correct | `/// <reference types="nativewind/types" />` |
| `babel.config.js` | Correct | `jsxImportSource: "nativewind"` + `nativewind/babel` preset |
| `metro.config.js` | Correct | `withNativeWind(config, { input: './global.css' })` |
| `tailwind.config.js` | Correct | `nativewind/preset`, content scanning `App.tsx` + `src/**` |

`ChildScreen.tsx` already uses `className` throughout — no inline style migration needed.

---

## Component 3: UI Layout Design

### Screen Structure

```
+-----------------------------+
| [Parent Mode] <- top-right  |
|                             |
|   Linxy Explorer Mode       | <- title
|                             |
|     +---------------+       |
|     |   AVATAR      |       | <- 60% flex
|     |  (animated)   |       |
|     +---------------+       |
|                             |
|   "Transcript text..."      | <- 20% flex (caption)
|                             |
|  [Voice] [Type] toggle      |
|                             |
|     +-----------------+     |
|     | Hold to Speak   |     | <- 20% flex (input)
|     |   (mic button)  |     |
|     +-----------------+     |
|                             |
+-----------------------------+
```

### Color Palette

| Element | Tailwind Class | Hex |
|---------|---------------|-----|
| Background | `bg-sky-50` | #f0f9ff |
| Primary button | `bg-blue-500` | #3B82F6 |
| Mic button (idle) | `bg-red-400` | #f87171 |
| Mic button (listening) | `bg-green-500` | #22C55E |
| Text primary | `text-gray-800` | #1F2937 |
| Text secondary | `text-gray-600` | #4B5563 |
| Button text | `text-white` | #FFFFFF |

---

## Implementation Tasks

### Task 1: Install expo-audio
- Use `expo install expo-audio` (not bare `npm install`) to get the SDK-compatible version
- Remove `expo-av` from `package.json` dependencies

### ~~Task 2: Fix NativeWind v4 Configuration~~
- **Already done.** All config files and `ChildScreen.tsx` className usage are correct.

### Task 2: Migrate ChildScreen to expo-audio
- Update imports: remove `expo-av`, add `useAudioPlayer` and `useAudioPlayerStatus` from `expo-audio`
- Remove `useState` for sound object
- Initialize `useAudioPlayer()` with no source
- Update `playAudio` function: use `player.replace({ uri })` + `player.play()` (synchronous)
- Replace `setOnPlaybackStatusUpdate` callback with `useAudioPlayerStatus` + `useEffect`

### ~~Task 3: Restore Tailwind Styles~~
- **Already done.** `ChildScreen.tsx` already uses `className` throughout.

### Task 3: Rebuild and Test
- `npx expo prebuild --clean`
- `npx expo run:ios`
- **First:** Verify base64 data URI playback works with `expo-audio` before full cleanup
- Test voice input and TTS playback end-to-end

---

## File Changes Summary

| File | Action | Changes |
|------|--------|---------|
| `package.json` | Modify | Remove `expo-av`, add `expo-audio` (via `expo install`) |
| `ChildScreen.tsx` | Modify | Migrate audio logic to `useAudioPlayer` / `useAudioPlayerStatus` |
| `App.tsx` | No change | Already imports `./global.css` |
| `global.css` | No change | Already correct |
| `nativewind-env.d.ts` | No change | Already correct (`nativewind/types`) |

---

## Testing

1. **Audio Test:** Verify base64 data URI (`data:audio/mp3;base64,...`) plays correctly via `expo-audio`
2. **Visual Test:** Verify UI renders with correct Tailwind styles
3. **Manual Test:** Press mic button, speak, verify TTS playback
4. **Text Mode Test:** Verify text input still works
5. **State Test:** Verify avatar state changes correctly (idle → thinking → speaking → idle)

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| `expo-audio` base64 data URI support differs from `expo-av` | Test data URI playback as the very first step before removing `expo-av` |
| Prebuild fails | Keep `expo-av` in package until migration is verified, then remove |
| `player.play()` not awaitable breaks sequential logic | Use `useAudioPlayerStatus` + `useEffect` for post-playback callbacks instead of `await` |

---

## Success Criteria

- [ ] App builds and runs on iOS simulator
- [ ] UI displays with proper Tailwind styling (not empty/blank)
- [ ] Voice input works (press mic, speak, transcript appears)
- [ ] TTS playback works (Linxy responds with audio)
- [ ] Text mode input works
- [ ] Avatar animates based on state (idle → thinking → speaking → idle)
