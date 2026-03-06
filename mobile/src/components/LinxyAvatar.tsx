import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Props {
  currentState?: AvatarState;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

const DEFAULT_SIZE = 150;

const STATE_CONFIG: Record<
  AvatarState,
  { emoji: string; label: string; className: string }
> = {
  idle: {
    emoji: '🦊',
    label: 'IDLE',
    className: 'border-gray-400 bg-gray-100',
  },
  listening: {
    emoji: '👂',
    label: 'LISTENING',
    className: 'border-green-500 bg-green-100 animate-pulse',
  },
  thinking: {
    emoji: '🤔',
    label: 'THINKING',
    className: 'border-orange-500 bg-orange-100',
  },
  speaking: {
    emoji: '🗣️',
    label: 'SPEAKING',
    className: 'border-blue-500 bg-blue-100',
  },
};

export default function LinxyAvatar({
  currentState = 'idle',
  size = DEFAULT_SIZE,
  style,
}: Props) {
  const isValid = ['idle', 'listening', 'thinking', 'speaking'].includes(
    currentState as string
  );
  const config = isValid
    ? STATE_CONFIG[currentState as AvatarState]
    : STATE_CONFIG.idle;

  return (
    <View
      className={`flex items-center justify-center rounded-full border-2 ${config.className}`}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Text
        className="font-bold"
        style={{ fontSize: size / 3, marginTop: size / 15 }}
      >
        {config.emoji}
      </Text>
      <Text
        className="font-bold"
        style={{ marginTop: size / 15, fontSize: size / 6 }}
      >
        {config.label}
      </Text>
    </View>
  );
}
