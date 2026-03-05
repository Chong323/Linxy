import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LinxyAvatar, { AvatarState } from '../components/LinxyAvatar';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { Audio } from 'expo-av';
import { API_BASE_URL } from '../config';

const MIC_BUTTON_SIZE = 200;
const MIC_BUTTON_RADIUS = MIC_BUTTON_SIZE / 2;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Child'>;
  onRequestParentMode: () => void;
};

export default function ChildScreen({ onRequestParentMode }: Props) {
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [transcript, setTranscript] = useState('');
  const { isListening, transcript: voiceTranscript, error, startListening, stopListening } = useVoiceInput();

  const handlePressIn = () => {
    setTranscript('');
    startListening();
  };

  const handlePressOut = () => {
    stopListening();
  };

  const playAudio = useCallback(async (base64: string) => {
    try {
      if (sound) {
        await sound.unloadAsync();
      }

      const dataUri = `data:audio/mp3;base64,${base64}`;
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: dataUri },
        { shouldPlay: true }
      );

      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setAvatarState('idle');
          newSound.unloadAsync();
          setSound(null);
        }
      });

      setAvatarState('speaking');
      await newSound.playAsync();
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to play audio');
      setAvatarState('idle');
    }
  }, [sound]);

  const processVoice = useCallback(async (text: string) => {
    setAvatarState('thinking');
    setTranscript(text);

    try {
      const response = await fetch(`${API_BASE_URL}/chat/voice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.audio_base64) {
        await playAudio(data.audio_base64);
      }
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Failed to process voice');
      setAvatarState('idle');
    }
  }, [playAudio]);

  useEffect(() => {
    if (!isListening && voiceTranscript) {
      processVoice(voiceTranscript);
    }
  }, [isListening, voiceTranscript, processVoice]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linxy Explorer Mode</Text>

      <LinxyAvatar currentState={avatarState} style={styles.avatar} />

      {transcript ? (
        <Text style={styles.transcript}>&quot;{transcript}&quot;</Text>
      ) : null}

      {error ? (
        <Text style={styles.errorText}>Error: {error}</Text>
      ) : null}

      <TouchableOpacity
        style={[
          styles.micButton,
          isListening && styles.micButtonListening,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <Text style={styles.micText}>
          {isListening ? 'Listening...' : 'Hold to Speak'}
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
  transcript: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#ff4444',
    textAlign: 'center',
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
  micButtonListening: {
    backgroundColor: '#4CAF50',
    transform: [{ scale: 1.05 }],
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
