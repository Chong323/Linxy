# Dual-Mode UI Design

## Overview

Design for the Dual-Mode UI feature in Phase 6 (React Native Mobile App). Implements secure parent access via PIN-protected dashboard while keeping child mode as the default seamless experience.

## Requirements

1. **Parent PIN Management**: Store PIN securely in React Native SecureStore (local device only)
2. **Default Boot State**: App launches in Child Mode by default
3. **Child Chat MVP**: Basic chat experience with message list and text input
4. **Parent Dashboard**: Settings, reports, command input, and "Back to Child" button

## Architecture

### State Management

- Global `AppState` context tracks current mode: `'child'` | `'parent'`
- `switchToParentMode()` function triggers PIN validation modal
- `switchToChildMode()` instantly switches without validation

### PIN Validation Flow

1. User taps "Switch to Parent Mode" (hidden or subtle UI element)
2. Modal appears with numeric keypad (4-6 digits)
3. Input validated against SecureStore value
4. On success: update AppState to 'parent', dismiss modal
5. On failure: show error, allow retry (max 3 attempts)

### Navigation Structure

Single stack navigator. Root screen reads from AppState:
- If `mode === 'child'` → render `ChatScreen`
- If `mode === 'parent'` → render `ParentDashboard`

### Data Flow

```
App Launch
    ↓
Auth Check (Supabase)
    ↓
AppState = { mode: 'child', isPinSet: boolean }
    ↓
Render ChatScreen (default)
    ↓
User taps "Parent Mode"
    ↓
PIN Modal → SecureStore.validate()
    ↓
AppState.mode = 'parent'
    ↓
Render ParentDashboard
```

## Components

### 1. AppStateContext

```typescript
type AppMode = 'child' | 'parent';

interface AppStateContextValue {
  mode: AppMode;
  isPinSet: boolean;
  switchToParentMode: () => void;
  switchToChildMode: () => void;
}
```

### 2. PinModal

- Numeric keypad UI (0-9, backspace, submit)
- 4-6 digit PIN input (masked dots)
- Error state after failed attempts
- "Set PIN first" state if no PIN exists

### 3. ChatScreen (Child Mode)

- Message list (FlatList)
- Text input with send button
- Linxy avatar/message bubbles (left)
- User message bubbles (right)
- Subtle "Parent Access" button (e.g., small gear icon in corner)

### 4. ParentDashboard

- Header: "Parent Architect Dashboard" + "Back to Child" button
- Tab navigation: Settings | Reports | Commands
- Settings: PIN management, logout
- Reports: Child activity summaries
- Commands: Input for updating core_instructions

## Security Considerations

- PIN stored in SecureStore (encrypted, device-local)
- No PIN = prompt to set PIN before accessing parent mode
- Failed attempts (3) → temporary lockout (30 seconds)
- No sensitive child data exposed without PIN

## Future Considerations (Out of Scope)

- Voice integration (Phase 6, separate feature)
- Gamification (daily streaks, stickers)
- Push notifications
- RevenueCat subscription gating
