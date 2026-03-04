import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Child'>;
  onRequestParentMode: () => void;
};

export default function ChildScreen({ onRequestParentMode }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linxy Explorer Mode</Text>
      <TouchableOpacity 
        style={styles.parentButton} 
        onPress={onRequestParentMode}
      >
        <Text style={styles.parentButtonText}>👤</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f0f8ff' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  parentButton: {
    padding: 8,
  },
  parentButtonText: {
    fontSize: 24,
  },
});
