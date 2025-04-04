import { View, Text, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { router } from 'expo-router';

export default function Cart() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View className="flex-1 bg-gray-900 justify-center items-center px-6 w-full h-full">
      <View className="absolute top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-10">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="location" size={25} color="#E6007E" />
            <View className="flex-coloum items-center">
              <Text className="text-md font-bold ml-2">Hi, Prakash</Text>
              <Text style={{ fontSize: 10 }} className="text-gray-600 ml-1">New York, USA</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={22} color="black" className="mr-4" />
            <Ionicons onPress={()=>router.push("/(app)/profile")} name="person-outline" size={25} color="black" />
          </View>
        </View>
      </View>
      <Animated.View
        style={{ opacity: fadeAnim, width: width * 1, height: height * 1 }}
        className="bg-white p-6 rounded-2xl shadow-2xl items-center justify-center"
      >
        <Ionicons name="alert-circle-outline" size={70} color="#E6007E" className="mb-4" />
        <Text className="text-2xl font-bold text-gray-800 text-center">Service Unavailable</Text>
        <Text className="text-gray-600 mt-3 text-center text-md">We're sorry, but this service is not available in your area at the moment.</Text>
        {/* <TouchableOpacity className="bg-pink-500 px-8 py-3 rounded-full mt-5 shadow-lg">
          <Text className="text-white font-semibold text-lg">Go Back</Text>
        </TouchableOpacity> */}
      </Animated.View>
    </View>
  );
}