import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView ,Image} from 'react-native';
import { router } from 'expo-router';
import { Ionicons,Feather } from '@expo/vector-icons';

export default function EditProfileScreen() {
  const [name, setName] = useState('Prakash Jangid');
  const [phone, setPhone] = useState('8302845976');

  const handleSave = () => {
    // Perform save logic (API call, state update, etc.)
    router.back(); // Navigate back to Profile after saving
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-md">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
            <Text className="text-lg font-bold ml-2">Edit Profile</Text>
          </View>
        </View>
      </View>

      <ScrollView className="p-4">
      <View className="items-center mt-6">
          <View className="relative">
            <Image
              source={{ uri: 'https://i.pravatar.cc/100' }}
              className="w-24 h-24 rounded-full border border-black border-2"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-black p-1 rounded-full">
              <Feather name="edit-2" size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-pink-500 text-lg font-semibold">Prakash jangid</Text>
          <Text className="text-gray-600">8302845976</Text>
        </View>
        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Enter full name"
          />
        </View>

        {/* Phone Number Input */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
          />
        </View>
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Email Address</Text>
          <TextInput
            value="prakashjangid429@gmail.com"
            className="border border-gray-300 p-3 rounded-lg"
            placeholder="Enter Email Address"
          />
        </View>

        {/* Save Button */}
        <TouchableOpacity onPress={handleSave} className="bg-pink-500 p-4 rounded-lg items-center">
          <Text className="text-white font-semibold">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
