import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Props {
  currentState: AvatarState;
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

const STATE_CONFIG: Record<AvatarState, { emoji: string; label: string; style: any }> = {
  idle: { emoji: '🦊', label: 'IDLE', style: styles.idle },
  listening: { emoji: '👂', label: 'LISTENING', style: styles.listening },
  thinking: { emoji: '🤔', label: 'THINKING', style: styles.thinking },
  speaking: { emoji: '🗣️', label: 'SPEAKING', style: styles.speaking },
};

export default function LinxyAvatar({ currentState }: Props) {
  // Placeholder for Lottie integration. For MVP, we use text/color blocks to represent state.
  const config = STATE_CONFIG[currentState] || STATE_CONFIG.idle;

  return (
    <View style={[styles.container, config.style]}>
      <Text style={styles.emoji}>{config.emoji}</Text>
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}