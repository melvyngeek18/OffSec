import { Stack } from 'expo-router';
import React from 'react';
import { InterventionProvider } from '../contexts/InterventionContext';

export default function Layout() {
  return (
    <InterventionProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#262135',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#262135',
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'OffSec - Accueil',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="weather"
          options={{
            title: 'Météo',
          }}
        />
        <Stack.Screen
          name="ri"
          options={{
            title: 'RI - Organisation',
          }}
        />
        <Stack.Screen
          name="actions"
          options={{
            title: 'Actions à Mener',
          }}
        />
        <Stack.Screen
          name="operations"
          options={{
            title: 'Mesures Opérationnelles',
          }}
        />
        <Stack.Screen
          name="risks"
          options={{
            title: 'Zones à Risques',
          }}
        />
        <Stack.Screen
          name="sso"
          options={{
            title: 'SSO - Scoring',
          }}
        />
        <Stack.Screen
          name="summary"
          options={{
            title: 'Synthèse Finale',
          }}
        />
      </Stack>
    </InterventionProvider>
  );
}
