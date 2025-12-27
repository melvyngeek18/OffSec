import React from 'react';
import { InterventionProvider } from '../contexts/InterventionContext';
import { Slot } from 'expo-router';

export default function Layout() {
  return (
    <InterventionProvider>
      <Slot />
    </InterventionProvider>
  );
}
