import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LinxyAvatar, { AvatarState } from '../components/LinxyAvatar';

// Constants
const MOCK_NETWORK_DELAY_MS = 1500;
const MOCK_SPEECH_DURATION_MS = 3000;
const MIC_BUTTON_SIZE = 200;
const MIC_BUTTON_RADIUS = MIC_BUTTON_SIZE / 2;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Child'>;
  onRequestParentMode: () => void;
};

export default function ChildScreen({ onRequestParentMode }: Props) {
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const networkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (networkTimerRef.current) clearTimeout(networkTimerRef.current);
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
  };

  useEffect(() => {
    return clearTimers;
  }, []);

  const handlePressIn = () => {
    clearTimers();
    setAvatarState('listening');
  };

  const handlePressOut = () => {
    setAvatarState('thinking');
    
    networkTimerRef.current = setTimeout(() => {
      setAvatarState('speaking');
      
      speechTimerRef.current = setTimeout(() => {
        setAvatarState('idle');
        speechTimerRef.current = null;
      }, MOCK_SPEECH_DURATION_MS);
      
      networkTimerRef.current = null;
    }, MOCK_NETWORK_DELAY_MS);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linxy Explorer Mode</Text>

      <LinxyAvatar currentState={avatarState} style={styles.avatar} />

      <TouchableOpacity
        style={styles.micButton}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <Text style={styles.micText}>
          {avatarState === 'listening' ? 'Listening...' : 'Hold to Speak'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.parentButton}
        onPress={onRequestParentMode}
      >
        <Text style={styles.parentButtonText}>👤 Parent Mode</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  avatar: {
    marginVertical: 40,
  },
  micButton: {
    backgroundColor: '#ff6b6b',
    width: MIC_BUTTON_SIZE,
    height: MIC_BUTTON_SIZE,
    borderRadius: MIC_BUTTON_RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  micText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  parentButton: {
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 30,
    marginTop: 20,
  },
  parentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
});
