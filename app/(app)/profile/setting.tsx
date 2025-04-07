import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/hooks/userInfo';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);
  const [biometricEnabled, setBiometricEnabled] = React.useState(true);
  const { setToken } = useContext(UserContext);

  const settingsSections = [
    // {
    //   title: 'Account',
    //   items: [
    //     {
    //       icon: <MaterialIcons name="location-on" size={20} color="#E6007E" />,
    //       title: 'Addresses',
    //       action: () => router.push('/addresses')
    //     },
    //     {
    //       icon: <MaterialCommunityIcons name="ticket-outline" size={20} color="#E6007E" />,
    //       title: 'My Coupons',
    //       action: () => router.push('/coupons')
    //     }
    //   ]
    // },
    {
      title: 'App Settings',
      items: [
        {
          icon: <Ionicons name="notifications-outline" size={20} color="#E6007E" />,
          title: 'Notifications',
          rightComponent: (
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#767577', true: '#E6007E' }}
            />
          )
        },
        {
          icon: <MaterialCommunityIcons name="theme-light-dark" size={20} color="#E6007E" />,
          title: 'Dark Mode',
          rightComponent: (
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#767577', true: '#E6007E' }}
            />
          )
        },
        {
          icon: <Ionicons name="language" size={20} color="#E6007E" />,
          title: 'Language',
          rightText: 'English',
          action: () => router.back()
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: <AntDesign name="customerservice" size={20} color="#E6007E" />,
          title: 'Help Center',
          action: () => router.push("/(app)/profile/helpCenter")
        },
        {
          icon: <MaterialIcons name="contact-support" size={20} color="#E6007E" />,
          title: 'Contact Us',
          action: () => router.push('/(app)/profile/raiseTicket')
        },
      ]
    },
    {
      title: 'Actions',
      items: [
        {
          icon: <MaterialIcons name="logout" size={20} color="#E6007E" />,
          title: 'Logout',
          action: () => {
            Alert.alert(
              'Logout',
              'Are you sure you want to logout?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Logout', onPress: async () => { await AsyncStorage.removeItem('userData'); router.replace('/login'); setToken(null) } }
              ]
            );
          }
        },
        {
          icon: <MaterialIcons name="delete" size={20} color="#E6007E" />,
          title: 'Delete Account',
          action: () => {
            // Handle delete account logic
            Alert.alert(
              'Delete Account',
              'Are you sure you want to delete your account?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', onPress: async() => { await AsyncStorage.removeItem('userData'); router.replace('/login'); setToken(null) } }
              ]
            );
          }
        }
      ]
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-4 shadow-md">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
            <Text className="text-lg font-bold ml-2">Settings</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1">
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="bg-white mx-4 my-2 rounded-xl shadow-sm">
            <Text className="font-bold px-4 pt-4 pb-2 text-gray-500">{section.title}</Text>

            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                className={`flex-row items-center justify-between px-4 py-3 ${itemIndex !== section.items.length - 1 ? 'border-b border-gray-100' : ''}`}
                onPress={item.action}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="w-6 items-center">
                    {item.icon}
                  </View>
                  <Text className="ml-4 text-gray-800">{item.title}</Text>
                </View>

                {item.rightComponent ? (
                  item.rightComponent
                ) : (
                  <View className="flex-row items-center">
                    {item.rightText && (
                      <Text className="text-gray-500 mr-2">{item.rightText}</Text>
                    )}
                    <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* App Version */}
        <View className="items-center py-6">
          <Text className="text-gray-500">App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}