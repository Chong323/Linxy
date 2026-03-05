import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Props {
  currentState: AvatarState;
}

export default function LinxyAvatar({ currentState }: Props) {
  // Placeholder for Lottie integration. For MVP, we use text/color blocks to represent state.
  const getStateEmoji = () => {
    switch(currentState) {
      case 'listening': return '👂';
      case 'thinking': return '🤔';
      case 'speaking': return '🗣️';
      case 'idle': default: return '🦊';
    }
  };

  return (
    <View style={[styles.container, styles[currentState] || styles.idle]}>
      <Text style={styles.emoji}>{getStateEmoji()}</Text>
      <Text style={styles.label}>{currentState?.toUpperCase() || 'IDLE'}</Text>
    </View>
  );
}

const AVATAR_SIZE = 150;

const styles = StyleSheet.create({
  container: { width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE / 2, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  idle: { borderColor: 'gray', backgroundColor: '#f0f0f0' },
  listening: { borderColor: 'green', backgroundColor: '#e0ffe0' },
  thinking: { borderColor: 'orange', backgroundColor: '#ffefe0' },
  speaking: { borderColor: 'blue', backgroundColor: '#e0e0ff' },
  emoji: { fontSize: 50 },
  label: { marginTop: 10, fontWeight: 'bold' }
});