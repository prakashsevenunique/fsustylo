import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';
import { imageBaseUrl } from '@/utils/helpingData';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('Pending');
  const { userInfo } = useContext(UserContext) as any;
  const [booking, setBooking] = useState() as any;
  const [filterBooking, setFilterbooking] = useState([])

  const getUserBooking = async () => {
    try {
      const response = await axiosInstance.get(`/api/booking/user/${userInfo?._id}`);
      setBooking(response.data?.bookings)
    } catch (error) {
      console.error('Error fetching user booking:', error);
    }
  };
  useEffect(() => {
    getUserBooking();
  }, [])
  useEffect(() => {
    if (booking) {
      const filteredBookings = booking.filter(item => item.status === activeTab);
      setFilterbooking(filteredBookings)
    }
  }, [activeTab])

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} className="text-primary" />
            </TouchableOpacity>
            <Text className="ml-4 text-xl font-bold">My Bookings</Text>
          </View>
        </View>
      </View>

      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          className={`flex-1 items-center py-3 ${activeTab === 'Pending' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('Pending')}
        >
          <Text className={`font-medium ${activeTab === 'Pending' ? 'text-primary' : 'text-gray-500'}`}>
          Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 ${activeTab === 'Confirmed' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('Confirmed')}
        >
          <Text className={`font-medium ${activeTab === 'Confirmed' ? 'text-primary' : 'text-gray-500'}`}>
            Confirmed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 ${activeTab === 'Completed' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('Completed')}
        >
          <Text className={`font-medium ${activeTab === 'Completed' ? 'text-primary' : 'text-gray-500'}`}>
            Completed
          </Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          className={`flex-1 items-center py-3 ${activeTab === 'cancelled' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text className={`font-medium ${activeTab === 'cancelled' ? 'text-primary' : 'text-gray-500'}`}>
            Cancelled
          </Text>
        </TouchableOpacity>
        
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-3">
        <View className='pb-20'>
          {filterBooking.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <MaterialIcons name="event-busy" size={48} className="text-gray-300 mb-4" />
              <Text className="text-lg text-gray-500 font-medium">No {activeTab} bookings</Text>
              <Text className="text-gray-400 mt-2 text-center">
                {activeTab === 'upcoming'
                  ? "You don't have any upcoming appointments"
                  : `You don't have any ${activeTab} appointments`}
              </Text>
              {activeTab === 'upcoming' && (
                <TouchableOpacity
                  className="mt-6 bg-primary py-3 px-6 rounded-full"
                  onPress={() => router.push('/atSalon')}
                >
                  <Text className="text-white font-medium">Book Now</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filterBooking && filterBooking.map((item:any) => (
              <View key={item._id} className="mb-2 bg-white rounded-lg shadow-sm overflow-hidden">

                <View className="flex-row items-center p-4 border-b border-gray-100">
                  <Image
                    source={{ uri: `${imageBaseUrl}/${item?.salonId?.salonPhotos[0]}` }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-lg">{item?.salonId?.salonName}</Text>
                    {/* <Text className="text-gray-500 text-sm">{item.salonId?.salonTitle}</Text> */}
                    <Text className="text-gray-500 text-sm">{item.salonId?.salonAddress}</Text>
                  </View>
                  <View className={`px-2 py-1 rounded ${item?.status === 'Confirmed' ? 'bg-green-100' : item?.status === 'Completed' ? 'bg-blue-100' : 'bg-red-100'}`}>
                    <Text className={`text-xs font-medium ${item?.status === 'Confirmed' ? 'text-green-800' : item?.status === 'Completed' ? 'text-blue-800' : 'text-red-800'}`}>
                      {item?.status}
                    </Text>
                  </View>
                </View>

                {/* Booking Details */}
                <View className="p-4 py-2">
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-500">Service</Text>
                    <Text className="font-medium">{item.services?.map((serv, index) => ` ${index === 0 ? "" : "&"} ${serv.name}`)}</Text>
                  </View>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-500">Date</Text>
                    <Text className="font-medium">{new Date(item.date).toLocaleDateString('en-GB')}</Text>
                  </View>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-500">Time</Text>
                    <Text className="font-medium">{item.timeSlot}</Text>
                  </View>
                  <View className="flex-row justify-between mb-1">
                    <Text className="text-gray-500">Duration</Text>
                    <Text className="font-medium">{item.totalDuration}</Text>
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-500">Price</Text>
                    <Text className="font-medium">₹ {item.totalAmount}</Text>
                  </View>
                </View>

                {/* Booking Actions */}
                {activeTab === 'Pending' && (
                  <View className="flex-row border-t border-gray-100">
                    <TouchableOpacity onPress={() => router.push(`/bookings/${booking.id}`)} className="flex-1 items-center bg-pink-200 py-3 border-r border-gray-100">
                      <Text className="text-primary font-medium">Reschedule</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center py-3">
                      <Text className="text-red-500 font-medium">Cancel</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {activeTab === 'Completed' && (
                  <View className="flex-row border-t border-gray-100">
                    <TouchableOpacity className="flex-1 items-center py-3 border-r border-gray-100">
                      <Text className="text-primary font-medium">Book Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 items-center py-3">
                      <Text className="text-primary font-medium">Rate Service</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}