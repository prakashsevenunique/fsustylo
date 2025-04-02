import { View, Text, Pressable } from 'react-native';
import { Link, Stack } from 'expo-router';
import React from 'react';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View className="flex-1 bg-gray-900 items-center justify-center p-6">
        <Text className="text-white text-2xl font-bold mb-4">404 - Page Not Found</Text>
        <Text className="text-gray-400 text-lg text-center mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </Text>
        <Link href="/" asChild>
          <Pressable className="bg-blue-500 px-4 py-1 rounded-lg shadow-lg active:scale-95">
            <Text className="text-white text-lg font-semibold">Go Back Home</Text>
          </Pressable>
        </Link>
      </View>
    </>
  );
}
