import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { imageBaseUrl } from '@/utils/helpingData';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';

export default function MyReviewsScreen() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {userInfo} = useContext(UserContext) as any;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axiosInstance.get(`/api/user/user-reviews/${userInfo._id}`
        );
        if (response.data.success) {
          setReviews(response.data.reviews);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name={star <= rating ? 'star' : 'star-outline'}
            size={20}
            color={star <= rating ? '#FFD700' : '#CCCCCC'}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }) => (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-2">
      <View className="flex-row">
        <Image
          source={{
            uri: item.salon.mainPhoto
              ? `${imageBaseUrl}/${item.salon.mainPhoto}`
              : 'https://via.placeholder.com/150'
          }}
          className="w-24 h-24 rounded-md mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold text-lg">{item?.salon?.name}</Text>
          <Text className="text-gray-500 text-sm">{item?.salon?.address}</Text>
          {item.review.comment && (
            <Text className="mt-1 text-gray-700">{item?.review?.comment}</Text>
          )}
          <View className="mt-1">
            {renderStars(item.review.rating)}
          </View>
        </View>
      </View>
      <Text className="text-gray-500 text-xs mt-1">
        Reviewed on {formatDate(item?.review?.date)}
      </Text>
    </View>
  );

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-red-500 mb-2">Error loading reviews</Text>
        <Text className="text-gray-600">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons
              onPress={() => router.back()}
              name="arrow-back"
              size={25}
              color="#E6007E"
            />
            <Text className="text-lg font-bold ml-2">My Reviews</Text>
          </View>
        </View>
      </View>
      {loading ? <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#E6007E" />
      </View> :
        <ScrollView className="p-4">
          {reviews.length > 0 ? (
            <FlatList
              data={reviews}
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.review.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center justify-center py-10">
              <Feather name="file-text" size={40} color="#CCCCCC" />
              <Text className="text-gray-500 mt-3">No reviews yet</Text>
              <TouchableOpacity
                className="mt-4 bg-pink-600 px-6 py-2 rounded-full"
                onPress={() => router.push('/')}
              >
                <Text className="text-white font-medium">Book a Service</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>}
    </View>
  );
}