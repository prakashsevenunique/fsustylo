import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { router } from 'expo-router';

type FormData = {
  fullName: string;
  email: string;
  mobile: string;
  message: string;
};

export default function ContactUs() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      message: ''
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/api/contact', {
        fullName: data.fullName,
        email: data.email,
        mobile: data.mobile,
        message: data.message
      });
      if (response.status == 201) {
        Alert.alert('Success', 'Your message has been sent successfully!');
        reset();
      }
    } catch (error) {
      console.error('Contact form error:', error);
      Alert.alert('Error', 'An error occurred while sending your message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View className="bg-white px-4 py-4 shadow-md">
        <View className="flex-row gap-2 items-center">
          <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
          <Text className="text-lg font-bold">Contact Us</Text>
        </View>
      </View>
      <ScrollView className="flex-1 bg-gray-50 p-6">
        <View className="mb-8">
          <Text className="text-gray-600">
            Have questions or feedback? Fill out the form below and we'll get back to you soon.
          </Text>
        </View>

        {/* Full Name Field */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Full Name</Text>
          <Controller
            control={control}
            rules={{
              required: 'Full name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 bg-white`}
                placeholder="Enter your full name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="fullName"
          />
          {errors.fullName && (
            <Text className="text-red-500 text-xs mt-1">{errors.fullName.message}</Text>
          )}
        </View>

        {/* Email Field */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Email Address</Text>
          <Controller
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 bg-white`}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>
          )}
        </View>

        {/* Mobile Field */}
        <View className="mb-4">
          <Text className="text-gray-700 mb-1">Mobile Number</Text>
          <Controller
            control={control}
            rules={{
              required: 'Mobile number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Invalid mobile number (10 digits required)'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 bg-white`}
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="mobile"
          />
          {errors.mobile && (
            <Text className="text-red-500 text-xs mt-1">{errors.mobile.message}</Text>
          )}
        </View>

        {/* Message Field */}
        <View className="mb-6">
          <Text className="text-gray-700 mb-1">Your Message</Text>
          <Controller
            control={control}
            rules={{
              required: 'Message is required',
              minLength: {
                value: 10,
                message: 'Message must be at least 10 characters'
              }
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={`border ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 bg-white h-32`}
                placeholder="Type your message here..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="message"
          />
          {errors.message && (
            <Text className="text-red-500 text-xs mt-1">{errors.message.message}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-pink-600 p-4 rounded-lg items-center"
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        >
          <View className="flex-row items-center">
            {isSubmitting ? (
              <MaterialIcons name="hourglass-empty" size={20} color="white" className="mr-2" />
            ) : (
              <MaterialIcons name="send" size={20} color="white" className="mr-2" />
            )}
            <Text className="text-white font-semibold">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Contact Information */}
        <View className="pb-14 border-t border-gray-200 pt-6">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Other Ways to Reach Us</Text>

          <View className="flex-row items-center mb-3">
            <MaterialIcons name="email" size={20} color="#db2777" style={{ marginRight: 12 }} />
            <Text className="text-gray-700">info@sustylo.com</Text>
          </View>

          <View className="flex-row items-center">
            <MaterialIcons name="phone" size={20} color="#db2777" style={{ marginRight: 12 }} />
            <Text className="text-gray-700">+91-7297026119</Text>
          </View>
        </View>
      </ScrollView>
    </>

  );
}