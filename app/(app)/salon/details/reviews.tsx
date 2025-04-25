"use client"

import { useState, useEffect } from "react"
import { View, Text, FlatList, TouchableOpacity, Image, SafeAreaView, StatusBar, ActivityIndicator } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Ionicons, AntDesign } from "@expo/vector-icons"
import { router } from "expo-router"
import axiosInstance from "@/utils/axiosInstance"

// Su stylo Salon color palette
const COLORS = {
  primary: "#FF5722", // Primary orange
  primaryDark: "#E64A19", // Darker orange for hover/active states
  primaryLight: "#FFCCBC", // Light orange for backgrounds
  secondary: "#FF9800", // Secondary orange
  secondaryLight: "#FFE0B2", // Light secondary for backgrounds
  tertiary: "#FFAB91", // Tertiary color
  tertiaryLight: "#FBE9E7", // Light tertiary for backgrounds
  textDark: "#263238", // Dark text
  textMedium: "#546E7A", // Medium text
  textLight: "#78909C", // Light text
  divider: "#ECEFF1", // Border/divider color
  success: "#4CAF50", // Success color (kept for checkmarks)
  warning: "#FFC107", // Warning/star color
  cardBackground: "#FFFFFF", // Card background
  background: "#F5F5F5", // Page background
  error: "#FF5252", // Error color
}

const SalonReviewsScreen = () => {
  const { salonId, salonName } = useLocalSearchParams() as any
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<string>("newest")
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [averageRating, setAverageRating] = useState<number>(0)

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`/api/salon/review/${salonId}`)
        setReviews(response.data.reviews || [])

        if (response.data.reviews && response.data.reviews.length > 0) {
          const totalRating = response.data.reviews.reduce((sum: number, review: any) => {
            return sum + (review.rating || 0)
          }, 0)
          setAverageRating(totalRating / response.data.reviews.length)
        }
      } catch (err) {
        console.error("Error fetching reviews:", err.message)
        setError("Failed to load reviews. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchReviews()
  }, [salonId])

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color={COLORS.warning} />)
      } else if (i === fullStars && halfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={16} color={COLORS.warning} />)
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={16} color={COLORS.warning} />)
      }
    }

    return <View className="flex-row">{stars}</View>
  }

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Filter reviews based on selected filter
  const getFilteredReviews = () => {
    if (selectedFilter === "all") {
      return reviews
    }
    const ratingFilter = Number.parseInt(selectedFilter)
    return reviews.filter((review: any) => Math.floor(review.rating) === ratingFilter)
  }

  // Sort reviews based on selected sort order
  const getSortedReviews = () => {
    const filteredReviews = getFilteredReviews()

    if (sortOrder === "newest") {
      return [...filteredReviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortOrder === "oldest") {
      return [...filteredReviews].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    } else if (sortOrder === "highest") {
      return [...filteredReviews].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortOrder === "lowest") {
      return [...filteredReviews].sort((a, b) => (a.rating || 0) - (b.rating || 0))
    }

    return filteredReviews
  }

  // Render each review item
  const renderReviewItem = ({ item }: { item: any }) => (
    <View className="bg-white p-4 mb-3 rounded-lg border border-gray-100">
      <View className="flex-row justify-between items-start">
        <View className="flex-row items-start">
          <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center mt-1">
            {item.userId?.profileImage ? (
              <Image source={{ uri: item.userId.profileImage }} className="w-12 h-12 rounded-full" />
            ) : (
              <Text className="font-bold text-gray-500">
                {item.userId?.name ? item.userId.name.charAt(0).toUpperCase() : "U"}
              </Text>
            )}
          </View>
          <View className="ml-3">
            <Text className="font-bold text-gray-800">{item.user?.name || "Anonymous User"}</Text>
            {item.comment && <Text className="text-gray-700 text-sm">{item.comment}</Text>}
            <Text className="text-gray-500 text-xs">{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          {renderStars(item.rating || 0)}
          <Text className="ml-1 text-gray-700 font-medium">{item.rating?.toFixed(1) || "N/A"}</Text>
        </View>
      </View>

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
  )

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = [0, 0, 0, 0, 0] // 5, 4, 3, 2, 1 stars

    reviews.forEach((review: any) => {
      const rating = Math.floor(review.rating || 0)
      if (rating >= 1 && rating <= 5) {
        distribution[5 - rating]++
      }
    })

    return distribution
  }

  const ratingDistribution = getRatingDistribution()
  const sortedAndFilteredReviews = getSortedReviews()

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }}>
        <StatusBar backgroundColor={COLORS.cardBackground} barStyle="dark-content" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="mt-4 text-gray-600">Loading reviews...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }}>
        <StatusBar backgroundColor={COLORS.cardBackground} barStyle="dark-content" />
        <View className="flex-1 items-center justify-center p-4">
          <Ionicons name="alert-circle-outline" size={60} color={COLORS.primary} style={{ opacity: 0.3 }} />
          <Text className="text-xl font-bold text-gray-700 mt-4">Error Loading Reviews</Text>
          <Text className="text-gray-500 text-center mt-2">{error}</Text>
          <TouchableOpacity
            className="mt-6 px-6 py-3 rounded-lg"
            style={{ backgroundColor: COLORS.primary }}
            onPress={() => router.back()}
          >
            <Text className="text-white font-medium">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.cardBackground }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text className="ml-3 text-xl font-bold">Reviews & Ratings</Text>
        </View>
      </View>

      {/* Rating Summary */}
      <View className="px-4 py-5 border-b border-gray-100">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-3xl font-bold text-gray-900">{averageRating.toFixed(1) || "New"}</Text>
            <View className="flex-row items-center mt-1">
              {renderStars(averageRating || 0)}
              <Text className="ml-2 text-gray-500">Based on {reviews.length || 0} reviews</Text>
            </View>
          </View>
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
                  className="h-full rounded-full"
                  style={{
                    width: `${reviews.length > 0 ? (ratingDistribution[5 - star] / reviews.length) * 100 : 0}%`,
                    backgroundColor: COLORS.warning,
                  }}
                />
              </View>
              <Text className="w-8 text-right text-gray-500">{ratingDistribution[5 - star]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filter and Sort Options */}
      <View
        className="flex-row justify-between px-4 py-3 border-b border-gray-200"
        style={{ backgroundColor: COLORS.tertiaryLight }}
      >
        <View className="flex-row">
          <TouchableOpacity
            style={{
              marginRight: 8,
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderRadius: 9999,
              backgroundColor: selectedFilter === "all" ? COLORS.primaryLight : "#E5E7EB",
              borderWidth: selectedFilter === "all" ? 1 : 0,
              borderColor: selectedFilter === "all" ? COLORS.primary : "transparent",
            }}
            onPress={() => setSelectedFilter("all")}
          >
            <Text style={{ color: selectedFilter === "all" ? COLORS.primary : COLORS.textMedium }}>All</Text>
          </TouchableOpacity>
          {[5, 4, 3, 2, 1].map((star) => (
            <TouchableOpacity
              key={star}
              style={{
                marginRight: 8,
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 9999,
                backgroundColor: selectedFilter === star.toString() ? COLORS.primaryLight : "#E5E7EB",
                borderWidth: selectedFilter === star.toString() ? 1 : 0,
                borderColor: selectedFilter === star.toString() ? COLORS.primary : "transparent",
              }}
              onPress={() => setSelectedFilter(star.toString())}
            >
              <Text style={{ color: selectedFilter === star.toString() ? COLORS.primary : COLORS.textMedium }}>
                {star}★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="flex-row justify-end px-4 py-2 border-b border-gray-200">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => {
            // Toggle between sort options
            if (sortOrder === "newest") setSortOrder("highest")
            else if (sortOrder === "highest") setSortOrder("lowest")
            else if (sortOrder === "lowest") setSortOrder("oldest")
            else setSortOrder("newest")
          }}
        >
          <Text className="text-gray-700 mr-1">Sort by: </Text>
          <Text style={{ color: COLORS.primary, fontWeight: "500" }}>
            {sortOrder === "newest"
              ? "Newest"
              : sortOrder === "oldest"
                ? "Oldest"
                : sortOrder === "highest"
                  ? "Highest Rating"
                  : "Lowest Rating"}
          </Text>
          <AntDesign name="down" size={12} color={COLORS.primary} style={{ marginLeft: 4 }} />
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
          <Ionicons name="chatbubble-ellipses-outline" size={60} color={COLORS.primary} style={{ opacity: 0.3 }} />
          <Text className="text-xl font-bold text-gray-700 mt-4">No Reviews Yet</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default SalonReviewsScreen
