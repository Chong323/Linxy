import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChildScreen from '../screens/ChildScreen';
import ParentDashboardScreen from '../screens/ParentDashboardScreen';

export type RootStackParamList = {
  Child: undefined;
  ParentDashboard: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Child" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Child" component={ChildScreen} />
        <Stack.Screen name="ParentDashboard" component={ParentDashboardScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
