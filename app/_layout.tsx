import React, { useEffect, useState, useRef } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { UserProvider } from '@/hooks/userInfo';
import { Slot } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <StatusBar
          style={colorScheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={colorScheme === 'dark' ? 'black' : 'white'}
          translucent={false}
        />
        <Slot />
      </UserProvider>
    </GestureHandlerRootView>
  );
}
