import React from 'react';
import { View } from 'react-native';

export const createNativeStackNavigator = () => ({
  Navigator: ({ children }: { children: React.ReactNode }) => (
    <View testID="stack-navigator">{children}</View>
  ),
  Screen: ({ component: Component }: { component: React.ComponentType<any> }) => (
    <View testID="screen">
      <Component />
    </View>
  ),
});
