import { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';

const CheckoutScreen = () => {
  const { salon, services } = useLocalSearchParams();
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [dates, setDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [salonDetail, setSalon] = useState(null)
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [error, setError] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null)
  const { userInfo, fetchUserInfo } = useContext(UserContext) as any;
  const [totalAmount, setTotal] = useState(0);

  useEffect(() => {
    if (services) {
      setSelectedServices(JSON.parse(services));
      setSalon(JSON.parse(salon));
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
  }, []);

  const handleApplyPromo = () => {
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
  useEffect(() => {
    const subtotal = calculateSubtotal();
    let total = subtotal - (subtotal * discount);
    setTotal(total);
  }, [discount, selectedServices])


  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }
    if (!selectedSeat) {
      alert('Please select set');
      return;
    }
    const data = {
      salonId: salonDetail._id,
      userId: userInfo._id,
      seatNumber: selectedSeat,
      services: selectedServices,
      date: selectedDate.date.toISOString(),
      timeSlot: selectedTime,
      total: totalAmount,
      discount: discount * 100
    }
    createBooking(data)

  };

  const createBooking = async (bookingData) => {
    setLoading1(true)
    try {
      const response = await axiosInstance.post('/api/booking/create',
        bookingData
      );

      if (response.status === 201) {
        router.replace({
          pathname: '/salon/booking-confirmation',
          params: {
            salonId: salonDetail._id,
            salonName: salonDetail.salonName,
            services: JSON.stringify(selectedServices),
            date: selectedDate.date.toISOString(),
            time: selectedTime,
            total: totalAmount,
            discount: discount * 100,
            bookingId: response.data?.bookingId
          }
        });
        fetchUserInfo()
      }
    } catch (error) {
      Alert.alert("Error :", error.message)
    } finally {
      setLoading1(false)
    }
  };

  async function getSchedule(salonId, date) {
    setLoading(true);
    setError(null);
    const url = `/api/schedule/schedule-get?salonId=${salonId}&date=${date.date}`;
    try {
      const response = await axiosInstance.get(url);
      const transformedSlots = Object.entries(response.data.availableSlots).map(([time, seats]) => {
        const availableSeats = seats.filter(seat => seat);
        return {
          time,
          seats: availableSeats
        };
      });
      setTimeSlots(transformedSlots);
    } catch (err) {
      setError('No schedule found');
      if (error.response) {
        console.log(`Error: Received status code ${err.response.status}`);
      } else {
        console.log(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1">
      <View className="flex-row items-center bg-white py-4 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E6007E" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold">Checkout</Text>
      </View>
      <ScrollView className="flex-1 p-3">
        <View className="bg-white rounded-lg p-4 mb-2 shadow-sm">
          <Text className="font-bold text-lg mb-1">{salonDetail?.salonName}</Text>
          <Text className="text-sm mb-1">{salonDetail?.salonTitle}</Text>
          <View className="flex-row text-sm items-center">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="ml-1 text-gray-700">4.5 (312 reviews)</Text>
          </View>
        </View>

        {/* Selected Services */}
        <View className="bg-white rounded-lg p-4 mb-2 shadow-sm">
          <Text className="font-bold text-lg mb-3">Your Services</Text>
          {selectedServices.map((service, index) => (
            <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-100">
              <View>
                <Text className="text-gray-800 font-bold">{service.name}</Text>
                <Text className="text-gray-500 text-sm">
                  {service.duration} • Qty: {service.quantity || 1}
                </Text>
              </View>
              <View className="items-end">
                <Text className="font-bold">₹{service.price}</Text>
                {service.discount > 0 && (
                  <View className="flex-row items-center">
                    <Text className="text-gray-500 text-xs line-through mr-1">₹{service.originalPrice}</Text>
                    <Text className="text-primary text-xs">{service.discount}%</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Date Selection */}
        <View className="bg-white rounded-lg p-4 mb-2 shadow-sm">
          <Text className="font-bold text-lg mb-3">Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                className={`w-16 h-20 mr-3 items-center justify-center rounded-lg ${selectedDate?.date.getDate() === date.date.getDate()
                  ? 'bg-gray-500'
                  : date.isWeekend
                    ? 'bg-yellow-50'
                    : 'bg-gray-100'
                  }`}
                onPress={() => { getSchedule(salonDetail._id, date); setSelectedDate(date); setSelectedTime(null) }}
              >
                <Text className={`text-xs ${selectedDate?.date.getDate() === date.date.getDate()
                  ? 'text-white'
                  : 'text-gray-500'
                  }`}>
                  {date.month}
                </Text>
                <Text className={`text-xl font-bold ${selectedDate?.date.getDate() === date.date.getDate()
                  ? 'text-white'
                  : 'text-gray-800'
                  }`}>
                  {date.day}
                </Text>
                <Text className={`text-xs ${selectedDate?.date.getDate() === date.date.getDate()
                  ? 'text-white'
                  : date.isWeekend
                    ? 'text-yellow-600'
                    : 'text-gray-500'
                  }`}>
                  {date.weekday}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Time Selection */}

          {loading ? (
            <ActivityIndicator size="small" color="#E6007E" className="py-4" />
          ) : error ? (
            <Text className="text-red-500 text-sm py-2">{error}</Text>
          ) : (
            <>
              <Text className="font-bold text-lg mb-2">Select Time</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                {timeSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    className={`p-3 mr-1 items-center rounded-lg ${selectedTime === slot.time
                      ? 'bg-gray-500'
                      : 'bg-white border border-gray-200'
                      }`}
                    onPress={() => { setSelectedTime(slot.time); setSelectedSeat(null); }}
                  >
                    <Text className={`text-sm text-gray-400 ${selectedTime === slot.time ? 'text-white' : 'text-gray-800'}`}>
                      {slot.time}
                    </Text>


                  </TouchableOpacity>
                ))}
              </ScrollView>
              {selectedTime && (
                <View className="mt-4">
                  <Text className="font-bold text-lg mb-2">Select Seat</Text>
                  <View className="flex-row flex-wrap">
                    {timeSlots
                      .find(slot => slot.time === selectedTime)
                      ?.seats.map(seat => (
                        <TouchableOpacity
                          key={seat.seatNumber}
                          className={`w-12 h-12 m-1 items-center justify-center ${selectedSeat === seat.seatNumber ? 'bg-gray-500' : ''} rounded-lg ${seat.status === 'available'
                            ? selectedSeat === seat.seatNumber ? 'bg-gray-500' : 'bg-gray-300'
                            : 'bg-gray-100' // Disabled if not available
                            }`}
                          onPress={() => seat.status === 'available' && setSelectedSeat(seat.seatNumber)}
                          disabled={seat.status !== 'available'} // Disable the touch if not available
                        >
                          <Text className={`${selectedSeat === seat.seatNumber ? 'bg-gray-500 text-gray-100' : 'bg-gray-300'}`}>{seat.seatNumber}</Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>

        {/* Promo Code */}
        <View className="bg-white rounded-lg p-4 mb-2 shadow-sm">
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
            <Text className="font-bold text-lg">₹{totalAmount}</Text>
          </View>
          <View className="flex-row justify-between py-2 border-t border-gray-200 mt-2">
            <Text className="font-bold">Wallet Balance</Text>
            <Text className="font-bold text-lg"> ₹{userInfo?.wallet?.balance}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Continue Button */}
      <View className="relative mx-4 my-2 py-4">
        <TouchableOpacity
          className={`rounded-lg items-center shadow-md py-3 ${userInfo?.wallet?.balance < totalAmount ? 'bg-gray-500' : 'bg-gray-700'}`}
          onPress={() => { userInfo?.wallet?.balance > totalAmount ? handleConfirmBooking() : console.log('nnnn') }}
          disabled={userInfo?.wallet?.balance < totalAmount || loading1}
        >
          <Text className="text-white font-bold text-lg">
            {loading1 ? 'Processing...' : (userInfo?.wallet?.balance < totalAmount ? 'Insufficient Balance' : 'Confirm Booking')}
          </Text>
        </TouchableOpacity>
        {loading1 && (
          <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-gray-200 opacity-50">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </View >
  );
};

export default CheckoutScreen;