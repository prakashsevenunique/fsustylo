import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const CheckoutScreen = () => {
  const { salonId, salonName, services } = useLocalSearchParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [dates, setDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);

  useEffect(() => {
    if (services) {
      setSelectedServices(JSON.parse(services));
    }
    const today = new Date();
    const dateArray = [];

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      dateArray.push({
        date,
        day: date.getDate(),
        month: date.toLocaleString('default', { month: 'short' }),
        weekday: date.toLocaleString('default', { weekday: 'short' }),
        isToday: i === 0,
        isWeekend: [0, 6].includes(date.getDay())
      });
    }

    setDates(dateArray);
    setSelectedDate(dateArray[0]); // Default to today
  }, []);

  // Generate time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = [];
      const openHour = 9; // Salon opens at 9 AM
      const closeHour = 19; // Salon closes at 7 PM

      for (let hour = openHour; hour < closeHour; hour++) {
        // Add slots on the hour
        slots.push({
          time: `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`,
          available: Math.random() > 0.3 // 70% chance available
        });

        // Add slots on the half hour (except last hour)
        if (hour < closeHour - 1) {
          slots.push({
            time: `${hour}:30 ${hour < 12 ? 'AM' : 'PM'}`,
            available: Math.random() > 0.3
          });
        }
      }

      setTimeSlots(slots);
    }
  }, [selectedDate]);

  const handleApplyPromo = () => {
    // Simple promo code validation
    if (promoCode.toUpperCase() === 'SALON20') {
      setDiscount(0.2); // 20% discount
    } else if (promoCode.toUpperCase() === 'SALON10') {
      setDiscount(0.1); // 10% discount
    } else {
      setDiscount(0);
      alert('Invalid promo code');
    }
  };

  const calculateSubtotal = () => {
    return selectedServices.reduce((sum, service) =>
      sum + (service.price * (service.quantity || 1)), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - (subtotal * discount);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    router.replace({
      pathname: '/salon/booking-confirmation',
      params: {
        salonId,
        salonName,
        services: JSON.stringify(selectedServices),
        date: selectedDate.date.toISOString(),
        time: selectedTime,
        total: calculateTotal(),
        discount: discount * 100
      }
    });
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center bg-white py-4 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E6007E" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold">Checkout</Text>
      </View>
      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="font-bold text-lg mb-1">{salonName}</Text>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="ml-1 text-gray-700">4.5 (312 reviews)</Text>
          </View>
        </View>

        {/* Selected Services */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="font-bold text-lg mb-3">Your Services</Text>
          {selectedServices.map((service, index) => (
            <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <View>
                <Text className="text-gray-800">{service.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {service.duration} • Qty: {service.quantity || 1}
                </Text>
              </View>
              <Text className="font-bold">₹{service.price * (service.quantity || 1)}</Text>
            </View>
          ))}
        </View>

        {/* Date Selection */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="font-bold text-lg mb-3">Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                className={`w-16 h-20 mr-3 items-center justify-center rounded-lg ${selectedDate?.date.getDate() === date.date.getDate() ? 'bg-gray-500' : date.isWeekend ? 'bg-yellow-50' : 'bg-gray-100'}`}
                onPress={() => setSelectedDate(date)}
              >
                <Text className={`text-xs ${selectedDate?.date.getDate() === date.date.getDate() ? 'text-white' : 'text-gray-500'}`}>
                  {date.month}
                </Text>
                <Text className={`text-xl font-bold ${selectedDate?.date.getDate() === date.date.getDate() ? 'text-white' : 'text-gray-800'}`}>
                  {date.day}
                </Text>
                <Text className={`text-xs ${selectedDate?.date.getDate() === date.date.getDate() ? 'text-white' : date.isWeekend ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {date.weekday}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Selection */}
          <Text className="font-bold text-lg mb-3">Select Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {timeSlots.map((slot, index) => (
              <TouchableOpacity
                key={index}
                className={`p-3 mr-1 items-center rounded-lg ${!slot.available ? 'bg-gray-100' : selectedTime === slot.time ? 'bg-gray-500' : 'bg-white border border-gray-200'}`}
                onPress={() => slot.available && setSelectedTime(slot.time)}
                disabled={!slot.available}
              >
                <Text className={`${!slot.available ? 'text-sm text-gray-400' : selectedTime === slot.time ? 'text-white' : 'text-gray-800'}`}>
                  {slot.time}
                </Text>
                {!slot.available && (
                  <Text className="text-[10px] text-gray-500 mt-1">Booked</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Promo Code */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <Text className="font-bold text-lg mb-3">Promo Code</Text>
          <View className="flex-row">
            <TextInput
              className="flex-1 border border-gray-300 rounded-l-lg p-3"
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity
              className="bg-gray-500 px-4 rounded-r-lg items-center justify-center"
              onPress={handleApplyPromo}
            >
              <Text className="text-white font-bold">Apply</Text>
            </TouchableOpacity>
          </View>
          {discount > 0 && (
            <Text className="text-green-600 mt-2">
              {discount * 100}% discount applied!
            </Text>
          )}
        </View>

        {/* Payment Summary */}
        <View className="bg-white rounded-lg p-4 mb-3 shadow-sm">
          <Text className="font-bold text-lg mb-3">Payment Summary</Text>
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Subtotal</Text>
            <Text>₹{calculateSubtotal()}</Text>
          </View>
          {discount > 0 && (
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-600">Discount</Text>
              <Text className="text-green-600">-₹{calculateSubtotal() * discount}</Text>
            </View>
          )}
          <View className="flex-row justify-between py-2 border-t border-gray-200 mt-2">
            <Text className="font-bold">Total</Text>
            <Text className="font-bold text-lg">₹{calculateTotal()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity
        className="mx-4 my-2 bg-gray-700 py-4 rounded-lg items-center shadow-md"
        onPress={handleConfirmBooking}
      >
        <Text className="text-white font-bold text-lg">Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutScreen;