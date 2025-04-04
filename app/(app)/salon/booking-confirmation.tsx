import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

const BookingConfirmation = () => {
  const { 
    salonId, 
    salonName, 
    services, 
    date, 
    time, 
    total,
    discount = 0 
  } = useLocalSearchParams();

  const [isFavorite, setIsFavorite] = useState(false);
  const bookingDate = new Date(date);
  
  // Parse services if they're passed as string
  const parsedServices = typeof services === 'string' ? JSON.parse(services) : services;

  const handleAddToCalendar = () => {
    alert('Added to calendar!');
  };

  const handleShareBooking = () => {
    alert('Booking shared!');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 p-4 h-44 items-center justify-center">
        <View className="flex-row justify-center items-center">
          <MaterialIcons name="check-circle" size={32} color="white" />
          <Text className="ml-2 text-white text-xl font-bold">Booking Confirmed</Text>
        </View>
        <Text className="text-white text-center mt-2">
          Your appointment is scheduled successfully
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Salon Card */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold">{salonName}</Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text className="ml-1 text-gray-700">4.5 (312 reviews)</Text>
              </View>
            </View>
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#E6007E" : "#9CA3AF"} 
              />
            </TouchableOpacity>
          </View>

          <View className="mt-4 flex-row items-center">
            <Ionicons name="calendar" size={20} color="#E6007E" />
            <Text className="ml-2 text-gray-800">
              {bookingDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center">
            <Ionicons name="time" size={20} color="#E6007E" />
            <Text className="ml-2 text-gray-800">{time}</Text>
          </View>

          <View className="mt-4 border-t border-gray-100 pt-3">
            <Text className="font-semibold text-gray-500">Booking ID</Text>
            <Text className="text-gray-800 font-mono mt-1">BPC-{salonId.slice(0, 5).toUpperCase()}</Text>
          </View>
        </View>

        {/* Services Summary */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold mb-3">Services Booked</Text>
          {parsedServices.map((service, index) => (
            <View key={index} className="flex-row justify-between py-2 border-b border-gray-100">
              <View>
                <Text className="text-gray-800">{service.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {service.quantity ? `×${service.quantity}` : ''} • {service.duration}
                </Text>
              </View>
              <Text className="font-bold">
                ₹{service.price * (service.quantity || 1)}
              </Text>
            </View>
          ))}

          {/* Payment Summary */}
          <View className="mt-4 pt-3 border-t border-gray-200">
            {discount > 0 && (
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600">Discount ({discount}%)</Text>
                <Text className="text-green-600">-₹{(parseFloat(total) * (parseFloat(discount)/100)).toFixed(2)}</Text>
              </View>
            )}
            <View className="flex-row justify-between mt-2">
              <Text className="font-bold">Total Paid</Text>
              <Text className="font-bold text-lg">₹{total}</Text>
            </View>
          </View>
        </View>

        {/* Booking Actions */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold mb-3">Booking Actions</Text>
          
          <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={handleAddToCalendar}
          >
            <MaterialIcons name="event" size={24} color="#E6007E" />
            <Text className="ml-3 flex-1">Add to Calendar</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={handleShareBooking}
          >
            <Ionicons name="share-social" size={24} color="#E6007E" />
            <Text className="ml-3 flex-1">Share Booking</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity 
            className="flex-row items-center py-3"
            onPress={() => router.replace(`/salon/${salonId}`)}
          >
            <FontAwesome name="home" size={24} color="#E6007E" />
            <Text className="ml-3 flex-1">View Salon</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
          <Text className="text-lg font-bold mb-3">Need Help?</Text>
          <Text className="text-gray-600 mb-3">
            Your booking details have been sent to your email and phone number.
          </Text>
          
          <View className="flex-row">
            <TouchableOpacity className="flex-1 bg-gray-100 py-2 px-4 rounded-lg mr-2">
              <Text className="text-primary text-center">Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-gray-100 py-2 px-4 rounded-lg">
              <Text className="text-primary text-center">View Receipt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View className="p-4 bg-white border-t border-gray-200">
        <TouchableOpacity 
          className="bg-gray-500 py-3 rounded-lg items-center mb-3"
          onPress={() => router.push('/bookings')}
        >
          <Text className="text-white font-bold">View My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className="bg-white py-3 rounded-lg items-center border border-primary"
          onPress={() => router.replace('/')}
        >
          <Text className="text-primary font-bold">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BookingConfirmation;