import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import LinxyAvatar, { AvatarState } from '../components/LinxyAvatar';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { Audio } from 'expo-av';
import { API_BASE_URL } from '../config';

const MIC_BUTTON_SIZE = 200;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Child'>;
  onRequestParentMode: () => void;
};

export default function ChildScreen({ onRequestParentMode }: Props) {
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [transcript, setTranscript] = useState('');
  const [inputMode, setInputMode] = useState<'voice' | 'type'>('voice');
  const [textInput, setTextInput] = useState('');
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

  const handleSendText = async () => {
    if (!textInput.trim()) return;
    await processVoice(textInput.trim());
    setTextInput('');
  };

  useEffect(() => {
    if (!isListening && voiceTranscript) {
      processVoice(voiceTranscript);
    }
  }, [isListening, voiceTranscript, processVoice]);

  return (
    <View className="flex-1 bg-[#f0f8ff] px-6">
      <TouchableOpacity
        className="absolute top-12 right-6 bg-white/80 px-4 py-2 rounded-full z-10"
        onPress={onRequestParentMode}
      >
        <Text className="text-base font-semibold text-gray-600">👤 Parent Mode</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-center text-gray-800 pt-12">
        Linxy Explorer Mode
      </Text>

      <View className="flex-[0.6] items-center justify-center">
        <LinxyAvatar currentState={avatarState} size={180} />
      </View>

      <View className="flex-[0.2] items-center justify-center px-6">
        {transcript ? (
          <Text className="text-base text-gray-600 text-center italic px-4">
            &quot;{transcript}&quot;
          </Text>
        ) : null}

        {error ? (
          <Text className="text-sm text-red-500 text-center">Error: {error}</Text>
        ) : null}
      </View>

      <View className="flex-[0.2] items-center justify-center w-full pb-8">
        <View className="flex-row items-center mb-4">
          <Text className="text-sm font-semibold text-gray-600 mr-2">
            {inputMode === 'voice' ? 'Voice' : 'Text'} Mode
          </Text>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              inputMode === 'voice' ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={() => setInputMode('voice')}
          >
            <Text className={`text-sm font-semibold ${
              inputMode === 'voice' ? 'text-white' : 'text-gray-600'
            }`}>
              🎤
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ml-2 ${
              inputMode === 'type' ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onPress={() => setInputMode('type')}
          >
            <Text className={`text-sm font-semibold ${
              inputMode === 'type' ? 'text-white' : 'text-gray-600'
            }`}>
              ⌨️
            </Text>
          </TouchableOpacity>
        </View>

        {inputMode === 'type' ? (
          <View className="flex-row items-center w-full max-w-sm">
            <TextInput returnKeyType="send" onSubmitEditing={handleSendText}
              className="flex-1 bg-white border border-gray-300 rounded-l-full px-6 py-3 text-base"
              placeholder="Type your message..."
              value={textInput}
              onChangeText={setTextInput}
            />
            <TouchableOpacity
              className="bg-blue-500 px-6 py-3 rounded-r-full"
              onPress={handleSendText} accessibilityLabel="Send Message"
            >
              <Text className="text-white font-bold text-base">Send</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            className={`items-center justify-center rounded-full ${
              isListening ? 'bg-green-500 scale-105' : 'bg-[#ff6b6b]'
            }`}
            style={{
              width: MIC_BUTTON_SIZE,
              height: MIC_BUTTON_SIZE,
              borderRadius: MIC_BUTTON_SIZE / 2,
            }}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.7}
          >
            <Text className="text-white text-lg font-bold text-center">
              {isListening ? 'Listening...' : 'Hold to Speak'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
