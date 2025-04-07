import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { UserContext } from '@/hooks/userInfo';
import axiosInstance from '@/utils/axiosInstance';
import { useForm, Controller } from 'react-hook-form';

type FormData = {
  name: string;
  email: string;
  gender: string;
};

export default function EditProfileScreen() {
  const { userInfo, setUserInfo } = useContext(UserContext) as any;
  const [isLoading, setIsLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      gender: userInfo?.gender || '',
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!data.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!data.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!data.gender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `/api/user/update-profile/${userInfo._id}`,
        data
      );
      console.log(response.data)
      setUserInfo(response?.data?.user)
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Update profile error:', error.message);
      Alert.alert('Error', 'An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
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
          <View className="relative border rounded-full border-gray-400 border-2 shadow-md">
            <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/035/857/779/small/people-face-avatar-icon-cartoon-character-png.png' }} className="w-24 h-24 rounded-full" />
            <TouchableOpacity onPress={() => router.push("/(app)/profile/edit")} className="absolute bottom-0 right-0 bg-pink-600 p-2 rounded-full border border-white">
              <Feather name="edit-2" size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-pink-600 text-lg font-semibold">{userInfo?.name || "Your Name"}</Text>
          <View className='flex-1 flex-row items-center gap-1'>
            <Ionicons name="checkmark-circle" size={20} color="skyblue" />
            <Text className="text-gray-600">{userInfo?.mobileNumber || "Mobile Number"}</Text>
          </View>
        </View>

        {/* Name Input */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Full Name</Text>
          <Controller
            control={control}
            rules={{
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-4 rounded-lg`}
                placeholder="Enter full name"
              />
            )}
            name="name"
          />
          {errors.name && (
            <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>
          )}
        </View>

        {/* Phone Number Input (disabled if verified) */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Phone Number</Text>
          <TextInput
            value={userInfo?.mobileNumber}
            className="border border-gray-300 p-4 rounded-lg bg-gray-100"
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            editable={false}
          />
          {userInfo?.mobileNumber && (
            <Text className="text-green-600 text-xs mt-1">Verified <Ionicons name="checkmark-circle" size={12} color="green" /></Text>
          )}
        </View>

        {/* Email Input */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Email Address</Text>
          <Controller
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-4 rounded-lg`}
                placeholder="Enter Email Address"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>
          )}
        </View>

        {/* Gender Selection */}
        <View className="mb-4">
          <Text className="text-gray-600 mb-1">Gender</Text>
          <Controller
            control={control}
            rules={{ required: 'Gender is required' }}
            render={({ field: { onChange, value } }) => (
              <View className="flex-row space-x-4 gap-3">
                <TouchableOpacity
                  onPress={() => onChange('male')}
                  className={`flex-1 p-3 rounded-lg border ${value === 'male' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`}
                >
                  <Text className={`text-center ${value === 'male' ? 'text-pink-600 font-bold' : 'text-gray-600'}`}>Male</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onChange('female')}
                  className={`flex-1 p-3 rounded-lg border ${value === 'female' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`}
                >
                  <Text className={`text-center ${value === 'female' ? 'text-pink-600 font-bold' : 'text-gray-600'}`}>Female</Text>
                </TouchableOpacity>
              </View>
            )}
            name="gender"
          />
          {errors.gender && (
            <Text className="text-red-500 text-xs mt-1">{errors.gender.message}</Text>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-pink-500 mt-4 p-4 rounded-lg items-center"
          disabled={isLoading}
        >
          <Text className="text-white font-semibold">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}