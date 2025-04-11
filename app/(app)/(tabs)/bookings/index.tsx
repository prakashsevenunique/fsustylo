import { View, Text, ScrollView, TouchableOpacity, Image, Animated, ActivityIndicator, Modal, Alert, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';
import { imageBaseUrl } from '@/utils/helpingData';
import ReviewModal from '@/components/rating';

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState('Pending');
  const { userInfo,fetchUserInfo } = useContext(UserContext) as any;
  const [booking, setBooking] = useState() as any;
  const [filterBooking, setFilterbooking] = useState([])
  const [indicatorPosition] = useState(new Animated.Value(0));
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectId, setSelectedId] = useState('');
  const [ratingSelected, setRatingSelected] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getUserBooking().then(() => setRefreshing(false));
  }, []);

  const handleCancelAction = () => {
    setIsModalVisible(false);
  };
  const [isVisible, setIsVisible] = useState(false);

  const handleReviewSubmit = async (reviewData, setReview, setRating) => {
    try {
      const response = await axiosInstance.post(`/api/salon/review/${ratingSelected}`, { ...reviewData, mobileNumber: userInfo.mobileNumber });
      if (response.status) {
        setRatingSelected("")
        setReview('')
        setRating(0)
        setIsVisible(false)
      }
    } catch (error) {
      Alert.alert("Error submitting review:", error.message);
    }
  };

  const tabs = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

  const handleTabPress = (tab: any, index: number) => {
    setActiveTab(tab);
    Animated.spring(indicatorPosition, {
      toValue: index * 100,
      useNativeDriver: false,
    }).start();
  };

  const cancelBooking = async () => {
    try {
      const response = await axiosInstance.post(`/api/booking/cancel/${selectId}`);
      setSelectedId("")
      setIsModalVisible(false);
      getUserBooking()
      fetchUserInfo()
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  const handleCancelConfirmation = () => {
    cancelBooking()
  };

  const getUserBooking = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/api/booking/user/${userInfo?._id}`);
      if (response.status === 200) {
        setBooking(response.data?.bookings)
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false)
    }
  };
  useEffect(() => {
    getUserBooking();
  }, [userInfo])

  useEffect(() => {
    if (booking) {
      const filteredBookings = booking.filter((item: any) => item.status === activeTab);
      setFilterbooking(filteredBookings)
    }
  }, [activeTab, booking])


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

      <View className="relative">
        {/* Horizontal ScrollView for Tabs */}
        <ScrollView  refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#E6007E']} // Android
            tintColor="#E6007E" // iOS
            progressBackgroundColor="#ffffff"
          />
        } horizontal={true} showsHorizontalScrollIndicator={false}>
          <View className="flex-row">
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                className={`flex-1 items-center py-3 px-4 ${activeTab === tab ? 'border-b-2 border-primary' : ''}`}
                onPress={() => handleTabPress(tab, index)}
              >
                <Text className={`font-medium ${activeTab === tab ? 'text-primary' : 'text-gray-500'}`}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Animated Tab Indicator */}
        <Animated.View
          className="absolute bottom-0 left-0 h-1 bg-primary"
          style={{
            width: 100, // This should match the width of each tab
            transform: [{ translateX: indicatorPosition }],
          }}
        />
      </View>

      {/* Content */}
      {loading ? <View className="flex-1 justify-center items-center bg-gray-50 z-100">
        <ActivityIndicator size="large" color="#E6007E" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View> :
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
                    onPress={() => router.push('/')}
                  >
                    <Text className="text-white font-medium">Book Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              filterBooking && filterBooking.map((item: any) => (
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
                      <Text className="font-medium">{item.services?.map((serv: any, index: number) => ` ${index === 0 ? "" : "&"} ${serv.name}`)}</Text>
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
                  {(activeTab !== 'Completed' && activeTab !== 'Cancelled') && (
                    <View className="flex-row border-t border-gray-100">
                      <TouchableOpacity onPress={() => router.push({
                        pathname: '/(app)/(tabs)/bookings/details',
                        params: {
                          bookings: JSON.stringify(item)
                        }
                      })} className="flex-1 items-center bg-pink-200 py-3 border-r border-gray-100">
                        <Text className="text-primary font-medium">View Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setIsModalVisible(true); setSelectedId(item._id) }} className="flex-1 items-center py-3">
                        <Text className="text-red-500 font-medium">Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeTab === 'Completed' && (
                    <View className="flex-row border-t border-gray-100">
                      <TouchableOpacity onPress={() => router.push({
                        pathname: `/(app)/salon/${item?.salonId?._id}`,
                        params: {
                          bookings: JSON.stringify(item)
                        }
                      })} className="flex-1 items-center py-3 border-r border-gray-100">
                        <Text className="text-primary font-medium">Book Again</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setIsVisible(true); setRatingSelected(item?.salonId?._id) }} className="flex-1 items-center py-3">
                        <Text className="text-primary font-medium">Rate Service</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancelAction}
      >
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }} className="flex-1 justify-center items-center">
          <View className="bg-white p-10 rounded-2xl shadow-lg w-[95%]">
            <Text className="text-xl font-semibold text-gray-800 mb-6">
              Are you sure you want to cancel the booking?
            </Text>
            <View className="flex-row justify-evenly mt-4">
              <TouchableOpacity
                onPress={() => handleCancelConfirmation()}
                className="bg-red-500 py-2 px-6 rounded-lg"
              >
                <Text className="text-white font-semibold">Yes, Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancelAction}
                className="bg-gray-200 py-2 px-6 rounded-lg"
              >
                <Text className="text-gray-700 font-semibold">No, Keep it</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ReviewModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
        onSubmit={handleReviewSubmit}
      />
    </View>
  );
}