import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppState } from '../contexts/AppStateContext';
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
  const { mode, isPinSet, setIsPinSet, switchToParentMode, switchToChildMode } = useAppState();
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
            <Stack.Screen 
              name="ParentDashboard" 
              component={ParentDashboardScreen}
              options={{
                headerShown: true,
                headerTitle: 'Parent Dashboard',
                headerRight: () => (
                  <TouchableOpacity
                    testID="back-button"
                    style={styles.backButtonContainer}
                    onPress={switchToChildMode}
                  >
                    <Text style={styles.backButtonText}>Back to Child</Text>
                  </TouchableOpacity>
                ),
              }}
            />
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
  return <AppNavigatorContent />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonContainer: {
    marginRight: 16,
    backgroundColor: '#4A90D9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
