import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Modal, Switch, Image } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';
import { useContext } from 'react';
import Slider from '@react-native-community/slider';
import { imageBaseUrl } from '@/utils/helpingData';

export default function SearchSalonScreen() {
  const router = useRouter();
  const { userInfo, location } = useContext(UserContext) as any;
  const params = useLocalSearchParams();

  // State for filters from URL params
  const [gender, setGender] = useState(params.gender || '');
  const [serviceTitle, setServiceTitle] = useState(params.serviceTitle || '');
  const [minRate, setMinRate] = useState(params.minRate ? parseInt(params.minRate) : 0);
  const [maxRate, setMaxRate] = useState(params.maxRate ? parseInt(params.maxRate) : 5000);
  const [searchQuery, setSearchQuery] = useState(params.search || '');

  // State for additional filters
  const [sortBy, setSortBy] = useState('distance');
  const [sortOrder, setSortOrder] = useState('asc');
  const [maxDistance, setMaxDistance] = useState(10); // Default 10km
  const [minReviewCount, setMinReviewCount] = useState(0);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [minRating, setMinRating] = useState(0);

  // Modal state
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  // Data state
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Facilities options
  const facilitiesOptions = [
    'AC', 'Wifi', 'Parking', 'Home Service', 'Card Payment',
    'Locker', 'Changing Room', 'Wheelchair Access'
  ];

  const fetchSalons = async () => {
    try {
      setLoading(true);

      const response = await axiosInstance.get('/api/salon/mostreview', {
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
          sortOrder,
          minReviewCount,
          minRating,
          facilities: selectedFacilities.join(','),
          ...params
        }
      });

      setSalons(response.data.salons);
    } catch (error) {
      console.error('Error fetching salons:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Apply filters and refresh
  const applyFilters = () => {
    setRefreshing(true);
    setIsFilterModalVisible(false);
    fetchSalons();
  };

  // Reset all filters
  const resetFilters = () => {
    setGender('');
    setServiceTitle('');
    setMinRate(0);
    setMaxRate(5000);
    setSearchQuery('');
    setSortBy('distance');
    setSortOrder('asc');
    setMaxDistance(10);
    setMinReviewCount(0);
    setMinRating(0);
    setSelectedFacilities([]);
    setRefreshing(true);
    setIsFilterModalVisible(false);
  };

  // Toggle facility selection
  const toggleFacility = (facility) => {
    setSelectedFacilities(prev =>
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
  };

  useEffect(() => {
    fetchSalons();
  }, [location]);

  useEffect(() => {
    if (refreshing) {
      fetchSalons();
    }
  }, [refreshing]);

  const renderSalonItem = ({ item }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-lg shadow-sm mb-3"
      onPress={() => router.push(`/(app)/salon/details?id=${item._id}`)}
    >
      <View className="flex-row">
        <Image
          source={{ uri: item.mainPhoto ? `${imageBaseUrl}/${item.salonPhotos[0]}` : 'https://via.placeholder.com/150' }}
          className="w-24 h-24 rounded-lg mr-3"
        />
        <View className="flex-1">
          <Text className="font-bold text-lg">{item.salonName}</Text>
          <View className="flex-row items-center mt-1">
            <Ionicons name="location-outline" size={14} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1">{item.salonAddress}</Text>
          </View>

          <View className="flex-row items-center mt-2">
            <MaterialIcons name="star" size={16} color="#FFD700" />
            <Text className="text-gray-700 ml-1 text-sm">
              {item.averageRating?.toFixed(1) || 'New'} ({item.reviews.length || 0})
            </Text>
            <Text className="text-gray-500 text-sm mx-2">•</Text>
            <Ionicons name="navigate-outline" size={14} color="#6B7280" />
            <Text className="text-gray-500 text-xs ml-1">{item.distance?.toFixed(1)} km</Text>
          </View>

          {item.minServicePrice && (
            <Text className="text-pink-600 font-bold mt-2">
              Starts from ₹{item.minServicePrice}
            </Text>
          )}

          {item.facilities?.length > 0 && (
            <View className="flex-row flex-wrap mt-2">
              {item.facilities.slice(0, 3).map((facility, index) => (
                <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-2">
                  <Text className="text-gray-700 text-xs">{facility}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2">
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 ml-2 py-1"
            placeholder="Search for salons or services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={applyFilters}
          />
          {searchQuery && (
            <TouchableOpacity onPress={() => { setSearchQuery(''); applyFilters(); }}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Bar */}
      <View className="px-4 py-3">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        // contentContainerStyle={{ height: 36, alignItems: 'center' }}
        >
          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2 ${gender === 'male' ? 'bg-pink-100' : 'bg-gray-100'}`}
            onPress={() => { setGender(gender === 'male' ? '' : 'male'); applyFilters(); }}
          >
            <Text className={gender === 'male' ? 'text-pink-600' : 'text-gray-600'}>Men</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2 ${gender === 'female' ? 'bg-pink-100' : 'bg-gray-100'}`}
            onPress={() => { setGender(gender === 'female' ? '' : 'female'); applyFilters(); }}
          >
            <Text className={gender === 'female' ? 'text-pink-600' : 'text-gray-600'}>Women</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2 ${minRate > 0 || maxRate < 5000 ? 'bg-pink-100' : 'bg-gray-100'}`}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text className={minRate > 0 || maxRate < 5000 ? 'text-pink-600' : 'text-gray-600'}>Price</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2 ${selectedFacilities.length > 0 ? 'bg-pink-100' : 'bg-gray-100'}`}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text className={selectedFacilities.length > 0 ? 'text-pink-600' : 'text-gray-600'}>Facilities</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2 ${minRating > 0 ? 'bg-pink-100' : 'bg-gray-100'}`}
            onPress={() => setIsFilterModalVisible(true)}
          >
            <Text className={minRating > 0 ? 'text-pink-600' : 'text-gray-600'}>Rating: {minRating}+</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`px-3 py-1 rounded-full mr-2 ${sortBy !== 'distance' ? 'bg-pink-100' : 'bg-gray-100'}`}
            onPress={() => {
              setSortBy(sortBy === 'distance' ? 'rating' : 'distance');
              setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              applyFilters();
            }}
          >
            <Text className={sortBy !== 'distance' ? 'text-pink-600' : 'text-gray-600'}>
              Sort: {sortBy === 'distance' ? 'Distance' : 'Rating'} {sortOrder === 'asc' ? '↑' : '↓'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>


      {/* Main Content */}
      {
        loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#E6007E" />
          </View>
        ) : salons.length === 0 ? (
          <View className="flex-1 justify-center items-center p-4">
            <Ionicons name="alert-circle-outline" size={50} color="#9CA3AF" />
            <Text className="text-gray-500 mt-3 text-center">No salons found matching your criteria</Text>
            <TouchableOpacity
              className="mt-4 bg-pink-600 px-6 py-2 rounded-full"
              onPress={resetFilters}
            >
              <Text className="text-white font-medium">Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={salons}
            renderItem={renderSalonItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ padding: 16 }}
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchSalons();
            }}
          />
        )
      }

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Filters</Text>
              <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="mb-4">
              {/* Price Range Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2">Price Range (₹{minRate} - ₹{maxRate})</Text>
                <View className="flex-row justify-between mb-1">
                  <Text>₹0</Text>
                  <Text>₹5000</Text>
                </View>
                <Slider
                  minimumValue={0}
                  maximumValue={5000}
                  step={100}
                  minimumTrackTintColor="#E6007E"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#E6007E"
                  value={maxRate}
                  onValueChange={(value) => {
                    setMinRate(Math.min(minRate, value - 500));
                    setMaxRate(value);
                  }}
                />
                <View className="flex-row justify-between mt-2">
                  <TextInput
                    className="border border-gray-300 rounded px-3 py-1 w-20"
                    value={minRate.toString()}
                    onChangeText={(text) => setMinRate(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                  <TextInput
                    className="border border-gray-300 rounded px-3 py-1 w-20"
                    value={maxRate.toString()}
                    onChangeText={(text) => setMaxRate(parseInt(text) || 5000)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              {/* Minimum Rating Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2">Minimum Rating</Text>
                <View className="flex-row justify-between">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      className={`px-3 py-1 rounded-full ${minRating === rating ? 'bg-pink-100' : 'bg-gray-100'}`}
                      onPress={() => setMinRating(rating)}
                    >
                      <Text className={minRating === rating ? 'text-pink-600' : 'text-gray-600'}>
                        {rating > 0 ? `${rating}+` : 'Any'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Facilities Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2">Facilities</Text>
                <View className="flex-row flex-wrap">
                  {facilitiesOptions.map((facility) => (
                    <TouchableOpacity
                      key={facility}
                      className={`px-3 py-2 rounded-full mr-2 mb-2 ${selectedFacilities.includes(facility) ? 'bg-pink-100' : 'bg-gray-100'}`}
                      onPress={() => toggleFacility(facility)}
                    >
                      <Text className={selectedFacilities.includes(facility) ? 'text-pink-600' : 'text-gray-600'}>
                        {facility}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Distance Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2">Maximum Distance ({maxDistance} km)</Text>
                <Slider
                  minimumValue={1}
                  maximumValue={50}
                  step={1}
                  minimumTrackTintColor="#E6007E"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#E6007E"
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                />
              </View>

              {/* Minimum Reviews Filter */}
              <View className="mb-6">
                <Text className="font-medium mb-2">Minimum Reviews</Text>
                <TextInput
                  className="border border-gray-300 rounded px-3 py-2"
                  placeholder="0"
                  value={minReviewCount.toString()}
                  onChangeText={(text) => setMinReviewCount(parseInt(text) || 0)}
                  keyboardType="numeric"
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View className="flex-row justify-between">
              <TouchableOpacity
                className="border border-pink-600 rounded-full px-6 py-3 flex-1 mr-2 items-center"
                onPress={resetFilters}
              >
                <Text className="text-pink-600 font-bold">Reset All</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-pink-600 rounded-full px-6 py-3 flex-1 items-center"
                onPress={applyFilters}
              >
                <Text className="text-white font-bold">Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View >
  );
}