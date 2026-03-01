import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ParentDashboard'>;
};

export default function ParentDashboardScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Architect Dashboard</Text>
      <Button title="Back to Child Mode" onPress={() => navigation.navigate('Child')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff0f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
