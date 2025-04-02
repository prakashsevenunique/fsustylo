import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, FlatList } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

export default function MyReviewsScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'published'>('pending');

  // Sample data
  const pendingReviews = [
    {
      id: '1',
      product: 'Nike Air Max',
      image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png',
      date: '2023-05-15',
      rating: 4,
    },
    {
      id: '2',
      product: 'Adidas T-Shirt',
      image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png',
      date: '2023-05-18',
      rating: 3,
    },
  ];

  const publishedReviews = [
    {
      id: '1',
      product: 'Apple Watch Series 7',
      image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png',
      date: '2023-04-10',
      rating: 5,
      review: 'Excellent product with great features. Battery life is amazing!',
      likes: 24,
    },
    {
      id: '2',
      product: 'Sony Headphones',
      image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png',
      date: '2023-03-22',
      rating: 4,
      review: 'Good sound quality but could be more comfortable for long hours',
      likes: 12,
    },
  ];

  const renderStars = (rating: number) => {
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

  const renderPendingItem = ({ item }: { item: typeof pendingReviews[0] }) => (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-3">
      <View className="flex-row">
        <Image
          source={{ uri: item.image }}
          className="w-16 h-16 rounded-md mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold">{item.product}</Text>
          <Text className="text-gray-500 text-sm mt-1">Purchased on {item.date}</Text>
          <View className="mt-2">
            {renderStars(item.rating)}
          </View>
          <TouchableOpacity className="mt-3 bg-pink-50 py-2 rounded-md items-center">
            <Text className="text-pink-600 font-medium">Write Review</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderPublishedItem = ({ item }: { item: typeof publishedReviews[0] }) => (
    <View className="bg-white p-4 rounded-lg shadow-sm mb-3">
      <View className="flex-row">
        <Image
          source={{ uri: item.image }}
          className="w-16 h-16 rounded-md mr-3"
        />
        <View className="flex-1">
          <Text className="font-semibold">{item.product}</Text>
          <Text className="text-gray-500 text-sm mt-1">Reviewed on {item.date}</Text>
          <View className="mt-2">
            {renderStars(item.rating)}
          </View>
          <Text className="mt-2 text-gray-700">{item.review}</Text>
          <View className="flex-row items-center mt-3">
            <Feather name="thumbs-up" size={16} color="#666" />
            <Text className="text-gray-600 ml-1 text-sm">{item.likes} people found this helpful</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-md">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
            <Text className="text-lg font-bold ml-2">My Reviews</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View className="flex-row border-b border-gray-200 mx-4">
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'pending' ? 'border-b-2 border-pink-600' : ''}`}
          onPress={() => setActiveTab('pending')}
        >
          <Text className={`font-medium ${activeTab === 'pending' ? 'text-pink-600' : 'text-gray-500'}`}>
            Pending ({pendingReviews.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 items-center ${activeTab === 'published' ? 'border-b-2 border-pink-600' : ''}`}
          onPress={() => setActiveTab('published')}
        >
          <Text className={`font-medium ${activeTab === 'published' ? 'text-pink-600' : 'text-gray-500'}`}>
            Published ({publishedReviews.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView className="p-4">
        {activeTab === 'pending' ? (
          pendingReviews.length > 0 ? (
            <FlatList
              data={pendingReviews}
              renderItem={renderPendingItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View className="items-center justify-center py-10">
              <Feather name="file-text" size={40} color="#CCCCCC" />
              <Text className="text-gray-500 mt-3">No pending reviews</Text>
            </View>
          )
        ) : publishedReviews.length > 0 ? (
          <FlatList
            data={publishedReviews}
            renderItem={renderPublishedItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="items-center justify-center py-10">
            <Feather name="file-text" size={40} color="#CCCCCC" />
            <Text className="text-gray-500 mt-3">No published reviews yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}