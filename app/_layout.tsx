import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import "../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { UserProvider } from '@/hooks/userInfo';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

export default function RootLayout() {
  const colorScheme = useColorScheme()
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <UserProvider>
          
          <StatusBar
            style="auto"
            backgroundColor={colorScheme == 'dark' ? "black" : "white"}
            translucent={false}
          />
          <Slot />
        </UserProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}