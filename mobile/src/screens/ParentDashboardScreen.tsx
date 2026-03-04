import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppState } from '../contexts/AppStateContext';
import { setPin, deletePin } from '../services/pinService';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ParentDashboard'>;
};

type Tab = 'settings' | 'reports' | 'commands';

export default function ParentDashboardScreen({ navigation }: Props) {
  const { switchToChildMode, isPinSet, setIsPinSet } = useAppState();
  const [activeTab, setActiveTab] = useState<Tab>('settings');
  const [newPin, setNewPin] = useState('');
  const [commandInput, setCommandInput] = useState('');

  const handleSetPin = async () => {
    if (newPin.length < 4 || newPin.length > 6) {
      Alert.alert('Error', 'PIN must be 4-6 digits');
      return;
    }
    
    try {
      await setPin(newPin);
      setIsPinSet(true);
      setNewPin('');
      Alert.alert('Success', 'PIN has been set');
    } catch (error) {
      Alert.alert('Error', 'Failed to set PIN');
    }
  };

  const handleDeletePin = async () => {
    Alert.alert(
      'Delete PIN',
      'Are you sure you want to remove the PIN?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deletePin();
            setIsPinSet(false);
          },
        },
      ]
    );
  };

  const handleSendCommand = () => {
    if (!commandInput.trim()) return;

    // TODO: Connect to backend API
    Alert.alert('Command Sent', `Command: ${commandInput}`);
    setCommandInput('');
  };

  const handleSwitchToChildMode = () => {
    Alert.alert(
      'Switch to Child Mode',
      'Are you sure you want to switch to child mode?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Switch', style: 'default', onPress: switchToChildMode },
      ]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>PIN Management</Text>
            
            {!isPinSet ? (
              <View style={styles.pinForm}>
                <TextInput
                  style={styles.input}
                  value={newPin}
                  onChangeText={setNewPin}
                  placeholder="Enter new PIN (4-6 digits)"
                  keyboardType="numeric"
                  secureTextEntry
                  maxLength={6}
                />
                <TouchableOpacity style={styles.button} onPress={handleSetPin}>
                  <Text style={styles.buttonText}>Set PIN</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pinStatus}>
                <Text style={styles.pinStatusText}>✓ PIN is set</Text>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton]}
                  onPress={handleDeletePin}
                >
                  <Text style={styles.buttonText}>Remove PIN</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        );
      
      case 'reports':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Child Activity</Text>
            <Text style={styles.placeholder}>No activity reports yet.</Text>
            <Text style={styles.hint}>Reports will appear here after your child uses the app.</Text>
          </View>
        );
      
      case 'commands':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Send Command to Linxy</Text>
            <TextInput
              style={[styles.input, styles.commandInput]}
              value={commandInput}
              onChangeText={setCommandInput}
              placeholder="e.g., Focus on math practice this week"
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={styles.button} onPress={handleSendCommand}>
              <Text style={styles.buttonText}>Send Command</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Parent Architect Dashboard</Text>
        <TouchableOpacity style={styles.backButton} onPress={handleSwitchToChildMode}>
          <Text style={styles.backButtonText}>Back to Child Mode</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
          onPress={() => setActiveTab('settings')}
        >
          <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
            Settings
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
          onPress={() => setActiveTab('reports')}
        >
          <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
            Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'commands' && styles.activeTab]}
          onPress={() => setActiveTab('commands')}
        >
          <Text style={[styles.tabText, activeTab === 'commands' && styles.activeTabText]}>
            Commands
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff0f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#4A90D9',
    fontSize: 16,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4A90D9',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4A90D9',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  pinForm: {
    gap: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commandInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#4A90D9',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    marginTop: 10,
  },
  pinStatus: {
    alignItems: 'center',
  },
  pinStatusText: {
    color: '#27ae60',
    fontSize: 16,
    marginBottom: 10,
  },
  placeholder: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  hint: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
});