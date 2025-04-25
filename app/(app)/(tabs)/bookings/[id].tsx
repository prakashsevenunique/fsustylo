import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState, useEffect } from 'react';

// Mock function to fetch booking details - replace with your actual API call
const fetchBookingDetails = async (id) => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockBookings = {
        '1': {
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
        '2': {
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
      };
      resolve(mockBookings[id] || null);
    }, 500);
  });
};

export default function RescheduleScreen() {
  const { id } = useLocalSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTime, setSelectedTime] = useState<any>('');
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        const bookingData = await fetchBookingDetails(id);
        if (bookingData) {
          setBooking(bookingData);
          setSelectedTime(bookingData.time); // Set initial time from booking
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        setError('Failed to load booking details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadBooking();
    }
  }, [id]);

  const handleDateChange = (event:any, date:any) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleReschedule = () => {
    router.back();
  };

  const formatDate = (date:any) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#E6007E" />
        <Text className="mt-4 text-gray-600">Loading booking details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <MaterialCommunityIcons name="alert-circle" size={48} color="#E6007E" />
        <Text className="text-lg font-medium text-gray-800 mt-4">{error}</Text>
        <TouchableOpacity
          className="mt-6 bg-primary py-3 px-6 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!booking) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-4">
        <MaterialCommunityIcons name="calendar-remove" size={48} color="#E6007E" />
        <Text className="text-lg font-medium text-gray-800 mt-4">Booking not found</Text>
        <TouchableOpacity
          className="mt-6 bg-primary py-3 px-6 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} className="text-primary" />
            </TouchableOpacity>
            <Text className="ml-4 text-xl font-bold">Reschedule Booking</Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Booking Summary */}
        <View className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <View className="flex-row items-center p-4 border-b border-gray-100">
            <Image
              source={{ uri: booking.image }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text className="font-bold text-lg">{booking.salon}</Text>
              <Text className="text-gray-500 text-sm">{booking.address}</Text>
            </View>
            <View className={`px-2 py-1 rounded ${booking.status === 'Confirmed' ? 'bg-green-100' : 'bg-red-100'}`}>
              <Text className={`text-xs font-medium ${booking.status === 'Confirmed' ? 'text-green-800' : 'text-red-800'}`}>
                {booking.status}
              </Text>
            </View>
          </View>

          <View className="p-4">
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500">Service</Text>
              <Text className="font-medium">{booking.service}</Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-gray-500">Original Date</Text>
              <Text className="font-medium">{booking.date} at {booking.time}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Duration</Text>
              <Text className="font-medium">{booking.duration}</Text>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-4">
          <Text className="font-bold text-lg mb-4">Select New Date</Text>

          <TouchableOpacity
            className="flex-row items-center justify-between border border-gray-200 rounded-lg p-3 mb-4"
            onPress={() => setShowDatePicker(true)}
          >
            <View className="flex-row items-center">
              <MaterialCommunityIcons name="calendar" size={20} className="text-primary mr-2" />
              <Text className="text-gray-700">{formatDate(selectedDate)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} className="text-gray-400" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="calendar"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}

          <Text className="text-xs text-gray-500 mt-1">
            Note: You can only reschedule up to 24 hours before your appointment
          </Text>
        </View>

        {/* Time Selection */}
        <View className="bg-white rounded-lg shadow-sm overflow-hidden mb-6 p-4">
          <Text className="font-bold text-lg mb-4">Select New Time</Text>
          <ScrollView scrollEnabled={true} horizontal={true} showsHorizontalScrollIndicator={false}>
            <View className="flex-row">
              {timeSlots.map((time, index) => (
                <TouchableOpacity
                  key={index}
                  className={`py-2 px-3 m-1 rounded-full ${selectedTime === time ? 'bg-gray-500' : 'bg-gray-100'}`}
                  onPress={() => setSelectedTime(time)}
                >
                  <Text className={`${selectedTime === time ? 'text-white' : 'text-gray-700'}`}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Reschedule Button */}
        <TouchableOpacity
          className="bg-gray-500 py-3 rounded-lg mt-4 mb-8"
          onPress={handleReschedule}
          disabled={!selectedTime}
        >
          <Text className="text-white font-bold text-center">Confirm Reschedule</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}