import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import CustomDrawer from '@/components/drawer/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProtectedLayout() {
  const pathname = usePathname();

  useEffect(() => {
    async function tokenData() {
      const fetchToken = await AsyncStorage.getItem('userData');
      if (!fetchToken) {
        router.push("/welcome")
      }
    }
    tokenData()
  }, [])

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawer />}
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#f8f9fa' },
        headerTintColor: '#000',
        drawerActiveBackgroundColor: '#e6e6e6',
        drawerActiveTintColor: '#000',
        drawerStyle: pathname === '/profile' ? { display: 'none', width: 0 } : { backgroundColor: '#fff', width: 280 }
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
      />
      <Drawer.Screen
        name="cart"
      />
    </Drawer>
  );
}
