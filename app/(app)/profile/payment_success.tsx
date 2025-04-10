import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';

export default function PaymentSuccessScreen() {
  const { trxId, amount } = useLocalSearchParams();
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const {fetchUserInfo} = useContext(UserContext);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: amount || 0,
    transactionId: trxId || 'N/A',
    date: new Date().toLocaleString(),
    salonName: 'N/A',
    service: 'N/A',
    paymentMethod: 'N/A'
  });

  useEffect(() => {
    if (!trxId) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await axiosInstance.get(`api/payment/payIn/response?reference=${trxId}`);
        let data = response.data
        if (data.status === 'Approved' || data.status === 'Failed') {
          fetchUserInfo()
          setPaymentStatus(data.status);
          clearInterval(intervalId)
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };
    checkPaymentStatus();
    const intervalId = setInterval(checkPaymentStatus, 15000);
    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
      if (paymentStatus === 'Pending') {
        setPaymentStatus('Pending - Timeout');
      }
    }, 180000);
    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [trxId]);

  const handleBackToHome = () => {
    router.replace('/');
  };

  const handleViewBooking = () => {
    router.replace('/profile/wallet');
  };

  const renderStatusIcon = () => {
    switch (paymentStatus) {
      case 'Approved':
        return (
          <View className="bg-green-100 p-6 rounded-full">
            <MaterialCommunityIcons name="check-circle" size={70} color="#10B981" />
          </View>
        );
      case 'Failed':
        return (
          <View className="bg-red-100 p-6 rounded-full">
            <MaterialCommunityIcons name="close-circle" size={70} color="#EF4444" />
          </View>
        );
      default:
        return (
          <View className="bg-yellow-100 p-6 rounded-full">
            <MaterialCommunityIcons name="clock" size={70} color="#F59E0B" />
          </View>
        );
    }
  };

  const renderStatusText = () => {
    switch (paymentStatus) {
      case 'Approved':
        return (
          <>
            <Text className="text-2xl font-bold mt-6">Payment Successful!</Text>
            <Text className="text-gray-500 mt-2">Thank you for your Payment</Text>
          </>
        );
      case 'Failed':
        return (
          <>
            <Text className="text-2xl font-bold mt-6">Payment Failed</Text>
            <Text className="text-gray-500 mt-2">Please try again</Text>
          </>
        );
      default:
        return (
          <>
            <Text className="text-2xl font-bold mt-6">Payment Processing</Text>
            <Text className="text-gray-500 mt-2">Please wait while we confirm your payment</Text>
          </>
        );
    }
  };

  const renderStatusBadge = () => {
    switch (paymentStatus) {
      case 'Approved':
        return (
          <View className="bg-green-100 px-2 py-1 rounded-full">
            <Text className="text-green-800 text-xs font-medium">Completed</Text>
          </View>
        );
      case 'Failed':
        return (
          <View className="bg-red-100 px-2 py-1 rounded-full">
            <Text className="text-red-800 text-xs font-medium">Failed</Text>
          </View>
        );
      default:
        return (
          <View className="bg-yellow-100 px-2 py-1 rounded-full">
            <Text className="text-yellow-800 text-xs font-medium">Pending</Text>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Status Illustration */}
      <View className="items-center justify-center py-12">
        {renderStatusIcon()}
        {renderStatusText()}
      </View>

      {/* Payment Details Card */}
      <View className="mx-4 bg-gray-50 rounded-xl p-5 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="font-bold text-lg">Payment Details</Text>
          {renderStatusBadge()}
        </View>

        <View className="gap-y-2">
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Amount Paid</Text>
            <Text className="font-bold">₹{paymentDetails.amount}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Transaction ID</Text>
            <Text className="text-gray-800">{paymentDetails?.transactionId?.toUpperCase()}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500">Date & Time</Text>
            <Text className="text-gray-800">{paymentDetails.date}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="px-4 mt-8 mb-10">
        {paymentStatus === 'Approved' && (
          <TouchableOpacity
            className="bg-pink-600 rounded-full py-4 items-center justify-center mb-3"
            onPress={handleViewBooking}
          >
            <Text className="text-white font-bold">View Wallet</Text>
          </TouchableOpacity>
        )}
        {paymentStatus === 'Failed' && (
          <TouchableOpacity
            className="bg-pink-600 rounded-full py-4 items-center justify-center mb-3"
            onPress={() => router.back()}
          >
            <Text className="text-white font-bold">Try Again</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          className={`rounded-full py-4 items-center justify-center ${paymentStatus === 'Approved' ? 'border border-pink-600' : 'bg-pink-600'}`}
          onPress={handleBackToHome}
        >
          <Text className={`font-bold ${paymentStatus === 'Approved' ? 'text-pink-600' : 'text-white'}`}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>

      {/* Support Info */}
      <View className="items-center mb-6">
        <Text className="text-gray-500 text-sm">Need help? Contact our support</Text>
        <TouchableOpacity onPress={() => router.push('/profile/helpCenter')} className="flex-row items-center mt-1">
          <Ionicons name="chatbubble-ellipses-outline" size={16} color="#E6007E" />
          <Text className="text-pink-600 ml-1">Chat with us</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}