import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any, any>;
};

export default function ChildScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Linxy Explorer Mode</Text>
      <Button title="Switch to Parent Mode" onPress={() => navigation.navigate('ParentDashboard')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f8ff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
