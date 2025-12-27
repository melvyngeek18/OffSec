import React from 'react';
import { InterventionProvider } from '../contexts/InterventionContext';
import { Slot } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import BottomNavigation from '../components/BottomNavigation';

export default function Layout() {
  return (
    <InterventionProvider>
      <View style={styles.container}>
        <Slot />
        <BottomNavigation />
      </View>
    </InterventionProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262135',
  },
});
