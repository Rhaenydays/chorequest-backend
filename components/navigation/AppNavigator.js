// components/navigation/AppNavigator.js
import React from 'react';
import { Stack } from 'expo-router';

export default function AppNavigator() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      <Stack.Screen name="tasks" options={{ title: 'Tasks' }} />
      <Stack.Screen name="rewards" options={{ title: 'Rewards' }} />
    </Stack>
  );
}
