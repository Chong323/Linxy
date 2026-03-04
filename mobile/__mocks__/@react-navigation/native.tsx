import React from 'react';
import { View } from 'react-native';

export const NavigationContainer = ({ children }: { children: React.ReactNode }) => (
  <View testID="navigation-container">{children}</View>
);

export const useNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
});

export const useRoute = () => ({
  params: {},
});
