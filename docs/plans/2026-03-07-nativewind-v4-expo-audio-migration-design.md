# Design: NativeWind v4 + expo-audio Migration

**Date:** 2026-03-07
**Status:** Approved
**Author:** Claude (opencode)

---

## Overview

Migrate the Linxy mobile app from deprecated `expo-av` to `expo-audio` and fix NativeWind v4 configuration for proper Tailwind CSS styling.

## Goals

1. Replace deprecated `expo-av` with modern `expo-audio` for TTS playback
2. Fix NativeWind v4 configuration to restore Tailwind classes
3. Restore original UI design with proper styling

## Non-Goals

- Changing the UI layout or design
- Modifying speech recognition (already uses `expo-speech-recognition`)
- Backend changes

---

## Architecture

### Current State

```
ChildScreen.tsx
├── expo-av (Audio.Sound) - DEPRECATED
├── expo-speech-recognition (voice input)
└── NativeWind v4 (misconfigured, inline styles as workaround)
```

### Target State

```
ChildScreen.tsx
├── expo-audio (useAudioPlayer hook) - MODERN
├── expo-speech-recognition (voice input)
└── NativeWind v4 (properly configured, Tailwind classes)
```

---

## Component 1: expo-audio Migration

### API Mapping

| expo-av | expo-audio |
|---------|------------|
| `Audio.Sound.createAsync()` | `useAudioPlayer()` hook |
| `sound.playAsync()` | `player.play()` |
| `sound.unloadAsync()` | `player.unload()` (automatic cleanup) |
| `sound.setOnPlaybackStatusUpdate()` | `player.state` (reactive) |
| `status.didJustFinish` | `player.state === 'finished'` |

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
import { useAudioPlayer } from 'expo-audio';

const player = useAudioPlayer(audioUri);

const playAudio = async (base64: string) => {
  const dataUri = `data:audio/mp3;base64,${base64}`;
  player.replace(dataUri);
  await player.play();
};
```

---

## Component 2: NativeWind v4 Configuration

### Required Files

1. **`global.css`** - Tailwind entry point
2. **`App.tsx`** - Must import `./global.css`
3. **`nativewind-env.d.ts`** - TypeScript declarations
4. **`babel.config.js`** - Already configured correctly
5. **`metro.config.js`** - Already configured correctly
6. **`tailwind.config.js`** - Already configured correctly

### Configuration Changes

**`global.css`:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

**`App.tsx`:**
```typescript
import './global.css';  // Must be first import
```

**`nativewind-env.d.ts`:**
```typescript
/// <reference types="nativewind/preset" />
```

### Styling Classes

**ChildScreen Layout:**
```typescript
<View className="flex-1 bg-sky-50 px-6">
  {/* Parent Mode Button */}
  <TouchableOpacity className="absolute top-12 right-6 bg-white/80 px-4 py-2 rounded-full z-10">
    <Text className="text-base font-semibold text-gray-600">Parent Mode</Text>
  </TouchableOpacity>

  {/* Title */}
  <Text className="text-2xl font-bold text-center text-gray-800 pt-12">
    Linxy Explorer Mode
  </Text>

  {/* Avatar - 60% flex */}
  <View className="flex-[0.6] items-center justify-center">
    <LinxyAvatar currentState={avatarState} size={180} />
  </View>

  {/* Transcript - 20% flex */}
  <View className="flex-[0.2] items-center justify-center px-6">
    <Text className="text-base text-gray-600 text-center italic px-4">
      "{transcript}"
    </Text>
  </View>

  {/* Input - 20% flex */}
  <View className="flex-[0.2] items-center justify-center w-full pb-8">
    {/* Voice/Type toggle and Mic button */}
  </View>
</View>
```

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
| Background | `bg-sky-50` | #f0f8ff |
| Primary button | `bg-blue-500` | #3B82F6 |
| Mic button (idle) | `bg-red-400` | #f87171 |
| Mic button (listening) | `bg-green-500` | #22C55E |
| Text primary | `text-gray-800` | #1F2937 |
| Text secondary | `text-gray-600` | #4B5563 |
| Button text | `text-white` | #FFFFFF |

---

## Implementation Tasks

### Task 1: Install Dependencies
- Remove `expo-av`
- Install `expo-audio`

### Task 2: Fix NativeWind v4 Configuration
- Update `global.css`
- Add import in `App.tsx`
- Verify `nativewind-env.d.ts`

### Task 3: Migrate ChildScreen to expo-audio
- Update imports
- Replace Audio.Sound with useAudioPlayer
- Update playback logic

### Task 4: Restore Tailwind Styles
- Replace inline `style` with `className`
- Verify 60/20/20 layout

### Task 5: Rebuild and Test
- `npx expo prebuild --clean`
- `npx expo run:ios`
- Test voice input and TTS playback

---

## File Changes Summary

| File | Action | Changes |
|------|--------|---------|
| `package.json` | Modify | Remove expo-av, add expo-audio |
| `App.tsx` | Modify | Add `import './global.css'` |
| `global.css` | Verify | Ensure Tailwind directives |
| `nativewind-env.d.ts` | Verify | Ensure type reference |
| `ChildScreen.tsx` | Modify | Migrate to expo-audio, restore Tailwind classes |

---

## Testing

1. **Visual Test:** Verify UI renders with correct Tailwind styles
2. **Manual Test:** Press mic button, speak, verify TTS playback
3. **Text Mode Test:** Verify text input still works
4. **State Test:** Verify avatar state changes correctly

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| NativeWind v4 still has issues | Test early, have StyleSheet fallback |
| expo-audio base64 support differs | Verify data URI works before full migration |
| Prebuild fails again | Keep patch-package as backup for expo-av |

---

## Success Criteria

- [ ] App builds and runs on iOS simulator
- [ ] UI displays with proper Tailwind styling (not empty/blank)
- [ ] Voice input works (press mic, speak, transcript appears)
- [ ] TTS playback works (Linxy responds with audio)
- [ ] Text mode input works
- [ ] Avatar animates based on state