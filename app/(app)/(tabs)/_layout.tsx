import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, StyleSheet, TouchableOpacity, View, Text, Settings } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function TabLayout() {
  const navigation = useNavigation() as any;
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            headerStyle: {
              height: 51, // Adjust the height here (default is usually ~56)
              backgroundColor: 'white', // Optional: Add background color
            },
            // headerLeft: () => (
            //   <TouchableOpacity style={{ marginHorizontal: 10, marginBottom: -5 }} onPress={() => navigation.openDrawer()}>
            //     <Ionicons name="menu" size={25} color="black" />
            //   </TouchableOpacity>
            // ),
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={focused ? 22 : 20}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: focused ? 11 : 11, // Scale label size when focused
                  fontWeight: focused ? 'bold' : '500',
                  color: focused ? '#000' : '#888',
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              >
                Home
              </Text>
            ),
          }}
        />
        {/* Tests */}
        <Tabs.Screen
          name="atSalon"
          options={{
            title: 'atSalon',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'compass' : 'compass-outline'}
                color={color}
                size={focused ? 22 : 21}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: focused ? 11 : 11, // Scale label size when focused
                  fontWeight: focused ? 'bold' : '500',
                  color: focused ? '#000' : '#888',
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              >
                At Salon
              </Text>
            )
          }}
        />

        {/* Books */}
        <Tabs.Screen
          name="atHome"
          options={{
            title: 'At Home',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'book-sharp' : 'book-outline'}
                color={color}
                size={focused ? 22 : 20}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: focused ? 11 : 11, // Scale label size when focused
                  fontWeight: focused ? 'bold' : '500',
                  color: focused ? '#000' : '#888',
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              >
                At Home
              </Text>
            )
          }}
        />

        {/* PYP */}
        <Tabs.Screen
          name="bookings"
          options={{
            title: 'Bookings',
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? 'calendar-outline' : 'calendar-outline'}
                color={color}
                size={focused ? 22 : 20}
              />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: focused ? 11 : 11, // Scale label size when focused
                  fontWeight: focused ? 'bold' : '500',
                  color: focused ? '#000' : '#888',
                  transform: [{ scale: focused ? 1.1 : 1 }],
                }}
              >
                Bookings
              </Text>
            )
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  /** Header Styles **/
  // header: {
  //   height: 30,
  //   backgroundColor: '#FFFFFF', // Header background color
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 20,
  //   paddingTop: Platform.OS === 'ios' ? 10 : 0, // Safe area for iOS
  //   elevation: 3,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  // },
  // headerTitle: {
  //   fontSize: 20,
  //   fontWeight: '600',
  //   color: '#000000',
  // },

  /** Tab Styles **/
  tabBar: {
    height: Platform.OS === 'ios' ? 60 : 58,
    paddingBottom: Platform.OS === 'ios' ? 0 : 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: 'absolute',
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: -1,
    color: '#000',
  },
});
