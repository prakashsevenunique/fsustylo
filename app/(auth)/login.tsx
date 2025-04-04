import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, Alert } from 'react-native';
import { router } from 'expo-router';
import { Modalize } from 'react-native-modalize';
import OTPInputScreen from './../../components/otpscreen/otpScreen';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '@/utils/axiosInstance';

export default function LoginScreen() {
  const [mobile, setMobile] = useState('');
  const [loading, setLoading] = useState(false);

  const modalizeRef = useRef<any>(null);

  async function sendOtp(mobileNumber: string) {
    setLoading(true)
    try {
      const response = await axiosInstance.post('/api/user/send-otp', {
        mobileNumber: mobileNumber
      });
      modalizeRef.current?.open();
      console.log('OTP sent successfully:', response.data);
    } catch (error:any) {
      console.error('Error sending OTP:', error);
      Alert.alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const openBottomSheet = async () => {
    if(mobile.length === 10){
      await sendOtp(mobile)
    }else{
      Alert.alert("Mobile number must be 10 digit")
    }

  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-[#ab3207]">
      {
        loading ? <View className="flex-1 justify-center items-center bg-white">
          <Ionicons name="cut" size={40} color="#E6007E" />
          <Text className="mt-4 text-gray-600">Loading...</Text>
        </View> : <View className="w-full h-full">
          {/* Upper Section - 60% */}
          <View className="h-[60%] items-center justify-center px-6 bg-[#ab3207]">
            <Image source={require('@/assets/img/logo.png')} className="w-40 h-40 mb-4" resizeMode="contain" />
            <Text className="text-white text-2xl font-bold text-center">Sutylo Salon – Your Beauty, Our Duty!</Text>
          </View>

          {/* Lower Section - 40% */}
          <View className="h-[40%] bg-white rounded-t-3xl px-6 pt-8 pb-12 shadow-lg">
            <Text className="text-gray-900 text-lg font-semibold text-center mb-4">Enter Mobile Number to Get OTP</Text>

            <TextInput
              className="w-full bg-gray-100 text-gray-900 rounded-xl px-4 py-3 text-lg"
              placeholder="10 Digit Mobile Number"
              placeholderTextColor="#a1a1aa"
              keyboardType="phone-pad"
              maxLength={10}
              value={mobile}
              onChangeText={setMobile}
            />

            <TouchableOpacity className="bg-[#b74729] rounded-xl py-3 mt-6" onPress={openBottomSheet}>
              <Text className="text-white text-lg font-semibold text-center">Get OTP</Text>
            </TouchableOpacity>

            {/* Terms and Conditions */}
            <View className="flex-row flex-wrap justify-center mt-4">
              <Text className="text-gray-600 text-sm">By continuing, you agree to our </Text>
              <TouchableOpacity onPress={() => router.push('/policy?policyType=terms')}>
                <Text className="text-black font-semibold text-sm">Terms of Service</Text>
              </TouchableOpacity>
              <Text className="text-gray-600 text-sm">, </Text>
              <TouchableOpacity onPress={() => router.push('/policy?policyType=privacyPolicy')}>
                <Text className="text-black font-semibold text-sm">Privacy Policy</Text>
              </TouchableOpacity>
              <Text className="text-gray-600 text-sm"> & </Text>
              <TouchableOpacity onPress={() => router.push('/policy?policyType=content')}>
                <Text className="text-black font-semibold text-sm">Content Policy</Text>
              </TouchableOpacity>
              <Text className="text-gray-600 text-sm">.</Text>
            </View>
          </View>
        </View>
      }

      <Modalize ref={modalizeRef} adjustToContentHeight>
        <View className="p-6">
          <OTPInputScreen mobile={mobile}/>
        </View>
      </Modalize>
    </KeyboardAvoidingView>
  );
}
