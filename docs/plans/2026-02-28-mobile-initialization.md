# Phase 6: React Native Mobile Client Initialization

> **For OpenCode:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Scaffold a new Expo (React Native) project in the `/mobile` directory to transition Linxy from a web PWA to a native mobile application, supporting dual modes (Child/Parent).

**Architecture:** A standard Expo app with React Navigation for routing between the Child interface and the PIN-protected Parent Dashboard. State management will initially rely on React Context.

**Tech Stack:** React Native, Expo, React Navigation, TypeScript.

---

### Task 1: Initialize the Expo Project

**Files:**
- Create: `/mobile` directory (via `npx create-expo-app`)

**Step 1: Run the Expo initialization command**

```bash
cd /Users/cg/projects/Linxy && npx create-expo-app@latest mobile -t expo-template-blank-typescript
```
*Note: We are using a blank TypeScript template to ensure we have a clean slate to build the dual-mode UI.*

**Step 2: Verify the mobile directory was created**

Run: `ls -la /Users/cg/projects/Linxy/mobile`
Expected: Output showing `package.json`, `app.json`, `App.tsx`, etc.

**Step 3: Commit the initial scaffold**

```bash
git add mobile
git commit -m "chore: initialize expo react native app in mobile directory"
```

---

### Task 2: Install Base Dependencies (Navigation & UI)

**Files:**
- Modify: `mobile/package.json`

**Step 1: Install React Navigation and safe area context**

```bash
cd /Users/cg/projects/Linxy/mobile && npx expo install @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

**Step 2: Verify dependencies in package.json**

Run: `cat /Users/cg/projects/Linxy/mobile/package.json | grep navigation`
Expected: Output showing `@react-navigation/native` and `@react-navigation/native-stack`.

**Step 3: Commit dependency additions**

```bash
git add mobile/package.json mobile/package-lock.json
git commit -m "chore(mobile): install react navigation dependencies"
```

---

### Task 3: Scaffold the Dual-Mode Navigation Structure

**Files:**
- Create: `mobile/src/navigation/AppNavigator.tsx`
- Create: `mobile/src/screens/ChildScreen.tsx`
- Create: `mobile/src/screens/ParentDashboardScreen.tsx`
- Modify: `mobile/App.tsx`

**Step 1: Create the ChildScreen placeholder**

```tsx
// mobile/src/screens/ChildScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any, any>;
};

export default function ChildScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linxy Explorer Mode</Text>
      <Button title="Switch to Parent Mode" onPress={() => navigation.navigate('ParentDashboard')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f8ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
```

**Step 2: Create the ParentDashboardScreen placeholder**

```tsx
// mobile/src/screens/ParentDashboardScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any, any>;
};

export default function ParentDashboardScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Architect Dashboard</Text>
      <Button title="Back to Child Mode" onPress={() => navigation.navigate('Child')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff0f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
```

**Step 3: Create the AppNavigator**

```tsx
// mobile/src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChildScreen from '../screens/ChildScreen';
import ParentDashboardScreen from '../screens/ParentDashboardScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Child" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Child" component={ChildScreen} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Step 4: Update App.tsx to use the Navigator**

```tsx
// mobile/App.tsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
```

**Step 5: Run TypeScript verification (or generic linter if set up)**

Run: `cd /Users/cg/projects/Linxy/mobile && npx tsc --noEmit`
Expected: Silent output (no errors).

**Step 6: Commit the navigation setup**

```bash
git add mobile/src/ mobile/App.tsx
git commit -m "feat(mobile): scaffold child and parent navigation screens"
```

---

### Task 4: Connect Mobile App to Local Backend (Optional prep step for testing)

*Note: The mobile app will eventually need to talk to the FastAPI backend running on `localhost:8000` or a deployed URL.*

**Files:**
- Create: `mobile/src/config.ts`

**Step 1: Create a basic config file for API URL**

```typescript
// mobile/src/config.ts
import { Platform } from 'react-native';

// When running on Android emulator, localhost is 10.0.2.2
// When running on iOS simulator, localhost is localhost
// Adjust port based on your FastAPI setup (usually 8000)
export const API_BASE_URL = Platform.OS === 'android' 
  ? 'http://10.0.2.2:8000' 
  : 'http://localhost:8000';
```

**Step 2: Commit the config file**

```bash
git add mobile/src/config.ts
git commit -m "chore(mobile): add initial api base url config"
```
