import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Share, Linking } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

export default function ReferAndEarnScreen() {
  const referralCode = "PRAKASH50";
  const referralLink = `https://yourapp.com/invite?code=${referralCode}`;

  const handleShare = async () => {
    try {
      const message = `Hey! Use my referral code ${referralCode} to get ₹50 off on our app. Sign up using this link: ${referralLink}`;
      await Share.share({
        message,
        title: 'Get ₹50 off on our app!',
      });
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  const handleCopyCode = () => {
    // Implement copy to clipboard functionality
    // You might want to use expo-clipboard or similar
    alert('Referral code copied to clipboard!');
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-md">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
            <Text className="text-lg font-bold ml-2">Refer & Earn</Text>
          </View>
        </View>
      </View>

      <ScrollView className="p-4">
        {/* Hero Section */}
        <View className="bg-pink-50 rounded-xl p-6 items-center mb-6">
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png' }}
            className="w-32 h-32 mb-4"
          />
          <Text className="text-2xl font-bold text-pink-600 mb-2">Earn ₹50 for each friend!</Text>
          <Text className="text-center text-gray-600">
            Invite your friends to join and get ₹50 in your wallet for every successful referral.
          </Text>
        </View>

        {/* How it works */}
        <View className="mb-6">
          <Text className="text-lg font-bold mb-3">How it works</Text>
          
          <View className="flex-row mb-4">
            <View className="bg-pink-100 w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text className="text-pink-600 font-bold">1</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Share your referral code</Text>
              <Text className="text-gray-600">Share your code with friends via WhatsApp, SMS, etc.</Text>
            </View>
          </View>

          <View className="flex-row mb-4">
            <View className="bg-pink-100 w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text className="text-pink-600 font-bold">2</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold">Friend signs up</Text>
              <Text className="text-gray-600">Your friend signs up using your referral code</Text>
            </View>
          </View>

          <View className="flex-row">
            <View className="bg-pink-100 w-8 h-8 rounded-full items-center justify-center mr-3">
              <Text className="text-pink-600 font-bold">3</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold">You both get rewarded</Text>
              <Text className="text-gray-600">You get ₹50 when they complete their first order</Text>
            </View>
          </View>
        </View>

        {/* Your Referral Code */}
        <View className="bg-gray-50 p-4 rounded-xl mb-6">
          <Text className="text-gray-600 mb-2">Your referral code</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-2xl font-bold">{referralCode}</Text>
            <TouchableOpacity 
              onPress={handleCopyCode}
              className="flex-row items-center bg-pink-100 px-3 py-2 rounded-lg"
            >
              <Feather name="copy" size={16} color="#E6007E" />
              <Text className="text-pink-600 ml-1">Copy</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Options */}
        <View className="mb-8">
          <Text className="text-lg font-bold mb-3">Share via</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity 
              onPress={handleShare}
              className="items-center w-1/5"
            >
              <View className="bg-green-50 p-3 rounded-full">
                <Feather name="share-2" size={24} color="#E6007E" />
              </View>
              <Text className="mt-1 text-xs">Other</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Linking.openURL(`whatsapp://send?text=Use my referral code ${referralCode} to get ₹50 off! ${referralLink}`)}
              className="items-center w-1/5"
            >
              <View className="bg-green-50 p-3 rounded-full">
                <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
              </View>
              <Text className="mt-1 text-xs">WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Linking.openURL(`sms:?body=Use my referral code ${referralCode} to get ₹50 off! ${referralLink}`)}
              className="items-center w-1/5"
            >
              <View className="bg-blue-50 p-3 rounded-full">
                <MaterialIcons name="sms" size={24} color="#2196F3" />
              </View>
              <Text className="mt-1 text-xs">SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Linking.openURL(`mailto:?subject=Get ₹50 off!&body=Use my referral code ${referralCode} to get ₹50 off! ${referralLink}`)}
              className="items-center w-1/5"
            >
              <View className="bg-red-50 p-3 rounded-full">
                <MaterialIcons name="email" size={24} color="#EA4335" />
              </View>
              <Text className="mt-1 text-xs">Email</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms and Conditions */}
        <View className="bg-gray-50 p-4 rounded-xl mb-6">
          <Text className="font-bold mb-2">Terms & Conditions</Text>
          <Text className="text-gray-600 text-xs">
            - Offer valid for new users only{'\n'}
            - Both referrer and referee will receive ₹50 after the first successful order{'\n'}
            - Reward will be credited within 24 hours of order completion{'\n'}
            - Maximum 10 referrals per user{'\n'}
            - Company reserves the right to modify or terminate this program
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}