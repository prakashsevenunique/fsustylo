import React from 'react';
import { Drawer } from 'expo-router/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect, usePathname } from 'expo-router';
import { useAuth } from '@/components/authContext/auth';
import CustomDrawer from '@/components/drawer/drawer';

export default function ProtectedLayout() {
  const { isAuthenticated } = useAuth() as any;
  const pathname = usePathname();
  if (isAuthenticated) {
    return <Redirect href="/welcome" />;
  }
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
