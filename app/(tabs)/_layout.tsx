import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          display: 'none'  // Hide the tab bar since we only have one screen
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calories Tracker'
        }}
      />
    </Tabs>
  );
}
