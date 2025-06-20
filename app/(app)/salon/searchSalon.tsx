"use client"

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Modal,
  Image,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { UserContext } from "@/hooks/userInfo"
import { useContext } from "react"
import Slider from "@react-native-community/slider"
import { imageBaseUrl } from "@/utils/helpingData"

// Su stylo Salon color palette
const colors = {
  primary: "#E65305", // Bright red-orange as primary
  primaryLight: "#FF7A3D", // Lighter version of primary
  primaryLighter: "#FFA273", // Even lighter version
  secondary: "#FBA059", // Light orange as secondary
  secondaryLight: "#FFC59F", // Lighter version of secondary
  accent: "#FB8807", // Bright orange as accent
  accentLight: "#FFAA4D", // Lighter version of accent
  tertiary: "#F4A36C", // Peach/salmon as tertiary
  tertiaryLight: "#FFD0B0", // Lighter version of tertiary
  background: "#FFF9F5", // Very light orange/peach background
  cardBg: "#FFFFFF", // White for cards
  text: "#3D2C24", // Dark brown for text
  textLight: "#7D6E66", // Lighter text color
  textLighter: "#A99E98", // Even lighter text
  divider: "#FFE8D6", // Very light divider color
}

export default function SearchSalonScreen() {
  const router = useRouter()
  const { userInfo, location } = useContext(UserContext) as any
  const params = useLocalSearchParams()

  // State for filters from URL params
  const [gender, setGender] = useState(params.gender || "")
  const [serviceTitle, setServiceTitle] = useState(params.serviceTitle || "")
  const [minRate, setMinRate] = useState(params.minRate ? Number.parseInt(params.minRate as string) : 0)
  const [maxRate, setMaxRate] = useState(params.maxRate ? Number.parseInt(params.maxRate as string) : 10000)
  const [searchQuery, setSearchQuery] = useState(params.search || "")

  // State for additional filters
  const [sortBy, setSortBy] = useState("distance")
  const [sortOrder, setSortOrder] = useState("asc")
  const [maxDistance, setMaxDistance] = useState(200) // Default 200km
  const [minReviewCount, setMinReviewCount] = useState(0)
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [minRating, setMinRating] = useState(0)
  const [category, setCategroy] = useState("All")

  // Modal state
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false)

  // Data state
  const [salons, setSalons] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Facilities options
  const facilitiesOptions = [
    "AC",
    "Wifi",
    "Parking",
    "Home Service",
    "Card Payment",
    "Locker",
    "Changing Room",
    "Wheelchair Access",
  ]

  const fetchSalons = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/api/salon/nearby", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          search: searchQuery,
          gender,
          serviceTitle,
          minRate,
          maxRate,
          maxDistance,
          sortBy,
          category: category === "All" ? "" : category.toLowerCase(),
          sortOrder,
          minReviewCount,
          minRating,
          facilities: selectedFacilities.join(","),
          ...params,
        },
      })
      setSalons(response?.data?.salons)
    } catch (error) {
      setSalons([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Apply filters and refresh
  const applyFilters = () => {
    setRefreshing(true)
    setIsFilterModalVisible(false)
    fetchSalons()
  }

  // Reset all filters
  const resetFilters = () => {
    router.replace("/(app)/salon/searchSalon")
  }

  // Toggle facility selection
  const toggleFacility = (facility: any) => {
    setSelectedFacilities((prev: any) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility],
    )
  }

  useEffect(() => {
    fetchSalons()
  }, [location])

  useEffect(() => {
    if (refreshing) {
      fetchSalons()
    }
  }, [refreshing])

  const renderSalonItem = ({ item }) => (
    <TouchableOpacity
      className="p-4 rounded-lg mb-3"
      style={{
        backgroundColor: colors.cardBg,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
      onPress={() =>
        router.push({
          pathname: "/(app)/salon/details",
          params: { salon: JSON.stringify(item) },
        })
      }
    >
      <View className="flex-row">
        <Image
          source={{
            uri: item.salonPhotos[0] ? `${imageBaseUrl}/${item.salonPhotos[0]}` : "https://via.placeholder.com/150",
            cache: "force-cache",
          }}
          className="w-32 mr-2 h-full rounded-l-lg"
          defaultSource={require("@/assets/img/logo.png")}
        />
        <View className="flex-1">
          <Text className="font-bold text-lg" style={{ color: colors.text }}>
            {item.salonName}
          </Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={14} color={colors.textLight} />
            <Text className="text-xs ml-1" style={{ color: colors.textLight }}>
              {item.salonAddress}
            </Text>
          </View>

          <View className="flex-row items-center mt-2">
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text className="ml-1 text-sm" style={{ color: colors.text }}>
              {item.averageRating?.toFixed(1) || "New"} ({item.reviews.length || 0})
            </Text>
            <Text className="text-sm mx-2" style={{ color: colors.textLight }}>
              •
            </Text>
            <Ionicons name="navigate-outline" size={14} color={colors.textLight} />
            <Text className="text-xs ml-1" style={{ color: colors.textLight }}>
              {item.distance?.toFixed(1)} km
            </Text>
          </View>

          {item.minServicePrice && (
            <Text className="text-xs mt-2" style={{ color: colors.primary }}>
              Starts from ₹{item.minServicePrice}
            </Text>
          )}

          {item.facilities?.length > 0 && (
            <View className="flex-row flex-wrap mt-1">
              {item.facilities.slice(0, 3).map((facility, index) => (
                <View
                  key={index}
                  className="px-2 py-1 rounded-full mr-2 mb-1"
                  style={{ backgroundColor: colors.tertiaryLight }}
                >
                  <Text className="text-xs" style={{ color: colors.text }}>
                    {facility}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  )

  const handleSlidingComplete = (value) => {
    setMaxDistance(value)
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Search Bar */}
      <View
        className="px-4 py-4 flex-row items-center"
        style={{
          backgroundColor: colors.cardBg,
          borderBottomWidth: 1,
          borderBottomColor: colors.divider,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View
          className="flex-1 flex-row items-center rounded-lg px-3 py-2"
          style={{ backgroundColor: colors.background }}
        >
          <Ionicons name="search" size={20} color={colors.textLight} />
          <TextInput
            className="ml-2 py-2 flex-1"
            placeholder="Search for salons or services..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={applyFilters}
            style={{ color: colors.text }}
          />
          {searchQuery && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("")
                applyFilters()
              }}
              className="ml-2"
            >
              <Ionicons name="close-circle" size={20} color={colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Bar */}
      <View className="px-4 py-3">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2`}
            style={{
              backgroundColor: gender === "male" ? colors.primaryLighter : colors.tertiaryLight,
            }}
            onPress={() => {
              setGender(gender === "male" ? "" : "male")
              applyFilters()
            }}
          >
            <Text
              style={{
                color: gender === "male" ? colors.primary : colors.text,
              }}
            >
              Men
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2`}
            style={{
              backgroundColor: gender === "female" ? colors.primaryLighter : colors.tertiaryLight,
            }}
            onPress={() => {
              setGender(gender === "female" ? "" : "female")
              applyFilters()
            }}
          >
            <Text
              style={{
                color: gender === "female" ? colors.primary : colors.text,
              }}
            >
              Women
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2`}
            style={{
              backgroundColor: minRate > 0 || maxRate < 5000 ? colors.primaryLighter : colors.tertiaryLight,
            }}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text
              style={{
                color: minRate > 0 || maxRate < 5000 ? colors.primary : colors.text,
              }}
            >
              Price
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2`}
            style={{
              backgroundColor: selectedFacilities.length > 0 ? colors.primaryLighter : colors.tertiaryLight,
            }}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text
              style={{
                color: selectedFacilities.length > 0 ? colors.primary : colors.text,
              }}
            >
              Facilities
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2`}
            style={{
              backgroundColor: minRating > 0 ? colors.primaryLighter : colors.tertiaryLight,
            }}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text
              style={{
                color: minRating > 0 ? colors.primary : colors.text,
              }}
            >
              Rating: {minRating}+
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2`}
            style={{
              backgroundColor: sortBy !== "distance" ? colors.primaryLighter : colors.tertiaryLight,
            }}
            onPress={() => {
              setSortBy(sortBy === "distance" ? "rating" : "distance")
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              applyFilters()
            }}
          >
            <Text
              style={{
                color: sortBy !== "distance" ? colors.primary : colors.text,
              }}
            >
              Sort: {sortBy === "distance" ? "Distance" : "Rating"} {sortOrder === "asc" ? "↑" : "↓"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : salons.length === 0 ? (
        <View className="flex-1 justify-center items-center p-4">
          <Ionicons name="alert-circle-outline" size={50} color={colors.textLight} />
          <Text className="mt-3 text-center" style={{ color: colors.textLight }}>
            No salons found matching your criteria
          </Text>
          <TouchableOpacity
            className="mt-4 px-6 py-2 rounded-full"
            style={{ backgroundColor: colors.primary }}
            onPress={resetFilters}
          >
            <Text className="font-medium text-white">Reset Filters</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={salons}
          renderItem={renderSalonItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ padding: 10 }}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            fetchSalons()
          }}
        />
      )}

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View className="rounded-t-3xl p-6 max-h-full" style={{ backgroundColor: colors.cardBg }}>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold" style={{ color: colors.text }}>
                Filters
              </Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.textLight} />
              </TouchableOpacity>
            </View>

            <ScrollView className="mb-4" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
              {/* Price Range Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2" style={{ color: colors.text }}>
                  Price Range (₹{minRate} - ₹{maxRate})
                </Text>
                <View className="flex-row justify-between mb-1">
                  <Text style={{ color: colors.textLight }}>₹0</Text>
                  <Text style={{ color: colors.textLight }}>₹10000</Text>
                </View>
                <Slider
                  minimumValue={0}
                  maximumValue={10000}
                  step={100}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.divider}
                  thumbTintColor={colors.primary}
                  value={maxRate}
                  onSlidingComplete={(value) => {
                    setMaxRate(value)
                    if (minRate > value - 500) {
                      setMinRate(Math.max(0, value - 500))
                    }
                  }}
                />

                <View className="flex-row justify-between mt-2">
                  <TextInput
                    className="px-3 py-1 w-20 rounded"
                    style={{
                      borderWidth: 1,
                      borderColor: colors.divider,
                      color: colors.text,
                    }}
                    value={minRate.toString()}
                    onChangeText={(text) => setMinRate(Number.parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    className="px-3 py-1 w-20 rounded"
                    style={{
                      borderWidth: 1,
                      borderColor: colors.divider,
                      color: colors.text,
                    }}
                    value={maxRate.toString()}
                    onChangeText={(text) => setMaxRate(Number.parseInt(text) || 5000)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Minimum Rating Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2" style={{ color: colors.text }}>
                  Minimum Rating
                </Text>
                <View className="flex-row justify-between">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      className={`px-3 py-1 rounded-full`}
                      style={{
                        backgroundColor: minRating === rating ? colors.primaryLighter : colors.tertiaryLight,
                      }}
                      onPress={() => setMinRating(rating)}
                    >
                      <Text
                        style={{
                          color: minRating === rating ? colors.primary : colors.text,
                        }}
                      >
                        {rating > 0 ? `${rating}+` : "Any"}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View className="mb-6">
                <Text className="font-medium mb-2" style={{ color: colors.text }}>
                  Salon Category
                </Text>
                <View className="flex-row gap-1">
                  {["All", "Premium", "General"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      className={`px-3 py-1 rounded-full`}
                      style={{
                        backgroundColor: category === item ? colors.primaryLighter : colors.tertiaryLight,
                      }}
                      onPress={() => setCategroy(item)}
                    >
                      <Text
                        style={{
                          color: category === item ? colors.primary : colors.text,
                        }}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Facilities Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2" style={{ color: colors.text }}>
                  Facilities
                </Text>
                <View className="flex-row flex-wrap">
                  {facilitiesOptions.map((facility) => (
                    <TouchableOpacity
                      key={facility}
                      className={`px-3 py-2 rounded-full mr-2 mb-2`}
                      style={{
                        backgroundColor: selectedFacilities.includes(facility)
                          ? colors.primaryLighter
                          : colors.tertiaryLight,
                      }}
                      onPress={() => toggleFacility(facility)}
                    >
                      <Text
                        style={{
                          color: selectedFacilities.includes(facility) ? colors.primary : colors.text,
                        }}
                      >
                        {facility}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Distance Filter */}
              <View style={{ marginBottom: 24 }}>
                <Text style={{ fontWeight: "500", marginBottom: 8, color: colors.text }}>
                  Maximum Distance ({maxDistance} km)
                </Text>
                <Slider
                  minimumValue={1}
                  maximumValue={200}
                  step={1}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={colors.divider}
                  thumbTintColor={colors.primary}
                  value={maxDistance}
                  onSlidingComplete={handleSlidingComplete}
                />
              </View>

              {/* Minimum Reviews Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2" style={{ color: colors.text }}>
                  Minimum Reviews
                </Text>
                <TextInput
                  className="px-3 py-2 rounded"
                  style={{
                    borderWidth: 1,
                    borderColor: colors.divider,
                    color: colors.text,
                  }}
                  placeholder="0"
                  placeholderTextColor={colors.textLighter}
                  value={minReviewCount.toString()}
                  onChangeText={(text) => setMinReviewCount(Number.parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="rounded-full px-6 py-3 flex-1 mr-2 items-center"
                style={{
                  borderWidth: 1,
                  borderColor: colors.primary,
                }}
                onPress={resetFilters}
              >
                <Text className="font-bold" style={{ color: colors.primary }}>
                  Reset All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="rounded-full px-6 py-3 flex-1 items-center"
                style={{ backgroundColor: colors.primary }}
                onPress={applyFilters}
              >
                <Text className="font-bold text-white">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}
