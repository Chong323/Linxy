import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAppState, AppStateProvider } from '../contexts/AppStateContext';
import { isPinSet as checkPinSet } from '../services/pinService';
import ChildScreen from '../screens/ChildScreen';
import ParentDashboardScreen from '../screens/ParentDashboardScreen';
import PinModal from '../components/PinModal';

export type RootStackParamList = {
  Child: undefined;
  ParentDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigatorContent() {
  const { mode, isPinSet, setIsPinSet, switchToParentMode } = useAppState();
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [checkingPin, setCheckingPin] = useState(true);

  useEffect(() => {
    async function checkPin() {
      try {
        const pinExists = await checkPinSet();
        setIsPinSet(pinExists);
      } catch (error) {
        console.error('Failed to check PIN:', error);
      } finally {
        setCheckingPin(false);
      }
    }
    checkPin();
  }, [setIsPinSet]);

  const handleOpenParentMode = () => {
    if (isPinSet) {
      setPinModalVisible(true);
    } else {
      switchToParentMode();
    }
  };

  const handlePinSuccess = () => {
    setPinModalVisible(false);
    switchToParentMode();
  };

  if (checkingPin) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4A90D9" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {mode === 'child' ? (
            <Stack.Screen name="Child">
              {(props) => <ChildScreen {...props} onRequestParentMode={handleOpenParentMode} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
      
      <PinModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        onSuccess={handlePinSuccess}
        isPinSet={isPinSet}
      />
    </>
  );
}

export default function AppNavigator() {
  return (
    <AppStateProvider>
      <AppNavigatorContent />
    </AppStateProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
