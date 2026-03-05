import React from 'react';
import { View, StyleSheet, Text, StyleProp, ViewStyle } from 'react-native';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Props {
  currentState?: AvatarState;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_SIZE = 150;
const BORDER_WIDTH = 2;
const LABEL_MARGIN_TOP = 10;

const COLORS = {
  idle: { border: 'gray', bg: '#f0f0f0' },
  listening: { border: 'green', bg: '#e0ffe0' },
  thinking: { border: 'orange', bg: '#ffefe0' },
  speaking: { border: 'blue', bg: '#e0e0ff' },
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: BORDER_WIDTH,
  },
  idle: { borderColor: COLORS.idle.border, backgroundColor: COLORS.idle.bg },
  listening: {
    borderColor: COLORS.listening.border,
    backgroundColor: COLORS.listening.bg,
  },
  thinking: {
    borderColor: COLORS.thinking.border,
    backgroundColor: COLORS.thinking.bg,
  },
  speaking: {
    borderColor: COLORS.speaking.border,
    backgroundColor: COLORS.speaking.bg,
  },
  label: { marginTop: LABEL_MARGIN_TOP, fontWeight: 'bold' },
});

const STATE_CONFIG: Record<
  AvatarState,
  { emoji: string; label: string; style: StyleProp<ViewStyle> }
> = {
  idle: { emoji: '🦊', label: 'IDLE', style: styles.idle },
  listening: { emoji: '👂', label: 'LISTENING', style: styles.listening },
  thinking: { emoji: '🤔', label: 'THINKING', style: styles.thinking },
  speaking: { emoji: '🗣️', label: 'SPEAKING', style: styles.speaking },
};

export default function LinxyAvatar({
  currentState = 'idle',
  size = DEFAULT_SIZE,
  style,
}: Props) {
  // Placeholder for Lottie integration. For MVP, we use text/color blocks to represent state.
  const isValid = ['idle', 'listening', 'thinking', 'speaking'].includes(
    currentState as string
  );
  const config = isValid
    ? STATE_CONFIG[currentState as AvatarState]
    : STATE_CONFIG.idle;

  const dynamicStyle = {
    width: size,
    height: size,
    borderRadius: Math.round(size / 2),
  };

  const emojiStyle = {
    fontSize: Math.round(size / 3),
  };

  return (
    <View style={[styles.container, dynamicStyle, config.style, style]}>
      <Text style={emojiStyle}>{config.emoji}</Text>
      <Text style={styles.label}>{config.label}</Text>
    </View>
  );
}
