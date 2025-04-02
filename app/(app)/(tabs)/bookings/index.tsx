import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Sample booking data
  const bookings = {
    upcoming: [
      {
        id: '1',
        service: 'Haircut & Styling',
        date: '15 June 2023',
        time: '10:00 AM',
        duration: '1 hour',
        price: '$45',
        status: 'Confirmed',
        salon: 'Elite Salon',
        address: '123 Beauty St, New York',
        image: 'https://i.pravatar.cc/150?img=12',
      },
      {
        id: '2',
        service: 'Manicure & Pedicure',
        date: '20 June 2023',
        time: '2:30 PM',
        duration: '1.5 hours',
        price: '$65',
        status: 'Confirmed',
        salon: 'Glamour Nails',
        address: '456 Fashion Ave, New York',
        image: 'https://i.pravatar.cc/150?img=15',
      },
      {
        id: '3',
        service: 'Manicure & Pedicure',
        date: '20 June 2023',
        time: '2:30 PM',
        duration: '1.5 hours',
        price: '$65',
        status: 'Confirmed',
        salon: 'Glamour Nails',
        address: '456 Fashion Ave, New York',
        image: 'https://i.pravatar.cc/150?img=15',
      },
      {
        id: '4',
        service: 'Manicure & Pedicure',
        date: '20 June 2023',
        time: '2:30 PM',
        duration: '1.5 hours',
        price: '$65',
        status: 'Confirmed',
        salon: 'Glamour Nails',
        address: '456 Fashion Ave, New York',
        image: 'https://i.pravatar.cc/150?img=15',
      },
      {
        id: '5',
        service: 'Manicure & Pedicure',
        date: '20 June 2023',
        time: '2:30 PM',
        duration: '1.5 hours',
        price: '$65',
        status: 'Confirmed',
        salon: 'Glamour Nails',
        address: '456 Fashion Ave, New York',
        image: 'https://i.pravatar.cc/150?img=15',
      },
    ],
    completed: [
      {
        id: '3',
        service: 'Facial Treatment',
        date: '5 May 2023',
        time: '11:00 AM',
        duration: '1.5 hours',
        price: '$80',
        status: 'Completed',
        salon: 'Skin Care Center',
        address: '789 Wellness Blvd, New York',
        image: 'https://i.pravatar.cc/150?img=20',
      },
    ],
    cancelled: [
      {
        id: '4',
        service: 'Massage Therapy',
        date: '1 May 2023',
        time: '4:00 PM',
        duration: '1 hour',
        price: '$75',
        status: 'Cancelled',
        salon: 'Relaxation Station',
        address: '321 Serenity Ln, New York',
        image: 'https://i.pravatar.cc/150?img=25',
      },
    ],
  };

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
          <TouchableOpacity>
            <Ionicons name="search" size={24} className="text-gray-600" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 bg-white">
        <TouchableOpacity
          className={`flex-1 items-center py-3 ${activeTab === 'upcoming' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text className={`font-medium ${activeTab === 'upcoming' ? 'text-primary' : 'text-gray-500'}`}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 ${activeTab === 'completed' ? 'border-b-2 border-primary' : ''}`}
          onPress={() => setActiveTab('completed')}
        >
          <Text className={`font-medium ${activeTab === 'completed' ? 'text-primary' : 'text-gray-500'}`}>
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
      <ScrollView className="flex-1 p-4">
        <View className='pb-20'>
        {bookings[activeTab].length === 0 ? (
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
          bookings[activeTab].map((booking) => (
            <View key={booking.id} className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Booking Header */}
              <View className="flex-row items-center p-4 border-b border-gray-100">
                <Image
                  source={{ uri: booking.image }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-lg">{booking.salon}</Text>
                  <Text className="text-gray-500 text-sm">{booking.address}</Text>
                </View>
                <View className={`px-2 py-1 rounded ${booking.status === 'Confirmed' ? 'bg-green-100' : booking.status === 'Completed' ? 'bg-blue-100' : 'bg-red-100'}`}>
                  <Text className={`text-xs font-medium ${booking.status === 'Confirmed' ? 'text-green-800' : booking.status === 'Completed' ? 'text-blue-800' : 'text-red-800'}`}>
                    {booking.status}
                  </Text>
                </View>
              </View>

              {/* Booking Details */}
              <View className="p-4">
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-500">Service</Text>
                  <Text className="font-medium">{booking.service}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-500">Date & Time</Text>
                  <Text className="font-medium">{booking.date} at {booking.time}</Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-500">Duration</Text>
                  <Text className="font-medium">{booking.duration}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-500">Price</Text>
                  <Text className="font-medium">{booking.price}</Text>
                </View>
              </View>

              {/* Booking Actions */}
              {activeTab === 'upcoming' && (
                <View className="flex-row border-t border-gray-100">
                  <TouchableOpacity onPress={()=>router.push(`/bookings/${booking.id}`)} className="flex-1 items-center bg-pink-200 py-3 border-r border-gray-100">
                    <Text className="text-primary font-medium">Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-1 items-center py-3">
                    <Text className="text-red-500 font-medium">Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
              {activeTab === 'completed' && (
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