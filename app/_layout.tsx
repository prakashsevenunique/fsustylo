import React from 'react';
import { Slot } from 'expo-router';
import "../global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { UserProvider } from '@/hooks/userInfo';


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <UserProvider>
          <Slot />
        </UserProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
