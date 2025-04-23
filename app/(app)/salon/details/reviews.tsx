import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, StatusBar } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

const SalonReviewsScreen = () => {
  const { salonId, salonName, reviews: reviewsParam, averageRating } = useLocalSearchParams() as any;
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');
  
  // Parse reviews from params
  const reviews = reviewsParam ? JSON.parse(reviewsParam) : [];
  
  console.log('Reviews:', reviews);
  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color="#f59e0b" />);
      } else if (i === fullStars && halfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={16} color="#f59e0b" />);
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={16} color="#f59e0b" />);
      }
    }

    return (
      <View className="flex-row">{stars}</View>
    );
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Filter reviews based on selected filter
  const getFilteredReviews = () => {
    if (selectedFilter === 'all') {
      return reviews;
    }
    const ratingFilter = parseInt(selectedFilter);
    return reviews.filter((review: any) => 
      Math.floor(review.rating) === ratingFilter
    );
  };

  // Sort reviews based on selected sort order
  const getSortedReviews = () => {
    const filteredReviews = getFilteredReviews();
    
    if (sortOrder === 'newest') {
      return [...filteredReviews].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortOrder === 'oldest') {
      return [...filteredReviews].sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortOrder === 'highest') {
      return [...filteredReviews].sort((a, b) => b.rating - a.rating);
    } else if (sortOrder === 'lowest') {
      return [...filteredReviews].sort((a, b) => a.rating - b.rating);
    }
    
    return filteredReviews;
  };

  // Render each review item
  const renderReviewItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 mb-3 rounded-lg border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center">
            {item.user?.profileImage ? (
              <Image
                source={{ uri: item.user.profileImage }}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <Text className="font-bold text-gray-500">
                {item.user?.name ? item.user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            )}
          </View>
          <View className="ml-3">
            <Text className="font-bold text-gray-800">{item.user?.name || 'Anonymous User'}</Text>
            <Text className="text-gray-500 text-xs">{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          {renderStars(item.rating)}
          <Text className="ml-1 text-gray-700 font-medium">{item?.rating?.toFixed(1)}</Text>
        </View>
      </View>

      {item.review && (
        <Text className="text-gray-700 mt-3 leading-5">{item.review}</Text>
      )}

      {/* Salon response if any */}
      {item.response && (
        <View className="mt-3 bg-gray-50 p-3 rounded-lg">
          <View className="flex-row items-center">
            <Text className="font-bold text-gray-800">Salon Response:</Text>
          </View>
          <Text className="text-gray-700 mt-1 italic">{item.response}</Text>
        </View>
      )}
    </View>
  );

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0]; // 5, 4, 3, 2, 1 stars
    
    reviews.forEach((review: any) => {
      const rating = Math.floor(review.rating);
      if (rating >= 1 && rating <= 5) {
        distribution[5 - rating]++;
      }
    });
    
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const sortedAndFilteredReviews = getSortedReviews();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#E6007E" />
          </TouchableOpacity>
          <Text className="ml-3 text-xl font-bold">Reviews & Ratings</Text>
        </View>
      </View>

      {/* Rating Summary */}
      <View className="px-4 py-5 bg-white border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900">
              {Number(averageRating).toFixed(1) || 'New'}
            </Text>
            <View className="flex-row items-center mt-1">
              {renderStars(Number(averageRating) || 0)}
              <Text className="ml-2 text-gray-500">
                Based on {reviews.length || 0} reviews
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            className="bg-pink-600 px-4 py-2 rounded-lg"
            onPress={() => {
              // Navigate to write review form
              router.push({
                pathname: '/(app)/salon/write-review',
                params: { salonId, salonName }
              });
            }}
          >
            <Text className="text-white font-medium">Write a Review</Text>
          </TouchableOpacity>
        </View>

        {/* Rating Distribution */}
        <View className="mt-4">
          {[5, 4, 3, 2, 1].map((star, index) => (
            <TouchableOpacity 
              key={star} 
              className="flex-row items-center my-1"
              onPress={() => setSelectedFilter(star.toString())}
            >
              <Text className="w-8 text-gray-700">{star}</Text>
              <View className="flex-1 h-2 bg-gray-200 rounded-full mx-2 overflow-hidden">
                <View 
                  className="h-full bg-yellow-500 rounded-full" 
                  style={{ 
                    width: `${reviews.length > 0 ? (ratingDistribution[5-star] / reviews.length) * 100 : 0}%` 
                  }} 
                />
              </View>
              <Text className="w-8 text-right text-gray-500">{ratingDistribution[5-star]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filter and Sort Options */}
      <View className="flex-row justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <View className="flex-row">
          <TouchableOpacity 
            className={`mr-2 px-3 py-1 rounded-full ${selectedFilter === 'all' ? 'bg-pink-100 border border-pink-300' : 'bg-gray-200'}`}
            onPress={() => setSelectedFilter('all')}
          >
            <Text className={`${selectedFilter === 'all' ? 'text-pink-600' : 'text-gray-700'}`}>All</Text>
          </TouchableOpacity>
          {[5, 4, 3, 2, 1].map(star => (
            <TouchableOpacity 
              key={star}
              className={`mr-2 px-3 py-1 rounded-full ${selectedFilter === star.toString() ? 'bg-pink-100 border border-pink-300' : 'bg-gray-200'}`}
              onPress={() => setSelectedFilter(star.toString())}
            >
              <Text className={`${selectedFilter === star.toString() ? 'text-pink-600' : 'text-gray-700'}`}>{star}★</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View className="flex-row justify-end px-4 py-2 bg-white border-b border-gray-200">
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => {
            // Toggle between sort options
            if (sortOrder === 'newest') setSortOrder('highest');
            else if (sortOrder === 'highest') setSortOrder('lowest');
            else if (sortOrder === 'lowest') setSortOrder('oldest');
            else setSortOrder('newest');
          }}
        >
          <Text className="text-gray-700 mr-1">Sort by: </Text>
          <Text className="text-pink-600 font-medium">
            {sortOrder === 'newest' ? 'Newest' : 
             sortOrder === 'oldest' ? 'Oldest' : 
             sortOrder === 'highest' ? 'Highest Rating' : 'Lowest Rating'}
          </Text>
          <AntDesign name="down" size={12} color="#E6007E" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      {reviews && reviews.length > 0 ? (
        <FlatList
          data={sortedAndFilteredReviews}
          renderItem={renderReviewItem}
          keyExtractor={(item) => item._id || Math.random().toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center p-4 bg-white">
          <Ionicons name="chatbubble-ellipses-outline" size={60} color="#E6007E" style={{ opacity: 0.3 }} />
          <Text className="text-xl font-bold text-gray-700 mt-4">No Reviews Yet</Text>
          <Text className="text-gray-500 text-center mt-2">
            Be the first to review this salon and share your experience with others.
          </Text>
          <TouchableOpacity 
            className="mt-6 bg-pink-600 px-6 py-3 rounded-lg"
            onPress={() => {
              // Navigate to write review form
              router.push({
                pathname: '/(app)/salon/write-review',
                params: { salonId, salonName }
              });
            }}
          >
            <Text className="text-white font-medium">Write a Review</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SalonReviewsScreen;