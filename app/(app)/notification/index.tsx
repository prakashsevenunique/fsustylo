import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const NotificationScreen = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'offer',
      title: 'Special Discount!',
      message: 'Get 30% off on all hair services this weekend',
      time: '2 hours ago',
      read: false,
      icon: 'tag',
    },
    {
      id: '2',
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your haircut appointment is tomorrow at 3:00 PM',
      time: '5 hours ago',
      read: false,
      icon: 'calendar-today',
    },
    {
      id: '3',
      type: 'system',
      title: 'New Feature Added',
      message: 'Check out our new booking calendar with real-time availability',
      time: '1 day ago',
      read: true,
      icon: 'info',
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Received',
      message: 'Your payment of ₹1200 for facial treatment has been confirmed',
      time: '2 days ago',
      read: true,
      icon: 'payment',
    },
    {
      id: '5',
      type: 'review',
      title: 'Leave a Review',
      message: 'How was your recent visit to Gentle Room salon?',
      time: '3 days ago',
      read: true,
      icon: 'rate-review',
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'offer':
        return '#E6007E'; // Pink
      case 'appointment':
        return '#3B82F6'; // Blue
      case 'payment':
        return '#10B981'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#E6007E" />
            </TouchableOpacity>
            <Text className="text-xl font-bold ml-4">Notifications</Text>
          </View>
          <TouchableOpacity onPress={clearAllNotifications}>
            <Text className="text-pink-600 font-medium">Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Notification List */}
      <ScrollView className="flex-1 px-4 py-2">
        {notifications.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <MaterialIcons name="notifications-off" size={48} color="#D1D5DB" />
            <Text className="text-gray-500 text-lg mt-4 font-medium">No notifications yet</Text>
            <Text className="text-gray-400 mt-1 text-center">
              We'll notify you when there's something new
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className={`bg-white rounded-lg p-4 mb-3 shadow-sm ${!notification.read ? 'border-l-4 border-pink-500' : ''}`}
              onPress={() => markAsRead(notification.id)}
            >
              <View className="flex-row items-start">
                <View className="mr-3">
                  <MaterialIcons 
                    name={notification.icon} 
                    size={24} 
                    color={getIconColor(notification.type)} 
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className={`font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                      {notification.title}
                    </Text>
                    <Text className="text-xs text-gray-400">{notification.time}</Text>
                  </View>
                  <Text className={`mt-1 ${!notification.read ? 'text-gray-700' : 'text-gray-500'}`}>
                    {notification.message}
                  </Text>
                  {!notification.read && (
                    <View className="mt-2">
                      <View className="w-2 h-2 rounded-full bg-pink-500" />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Bottom Tab Indicator */}
      <View className="bg-white border-t border-gray-200 px-4 py-2">
        <Text className="text-center text-gray-500 text-sm">
          {notifications.filter(n => !n.read).length} unread notifications
        </Text>
      </View>
    </View>
  );
};

export default NotificationScreen;