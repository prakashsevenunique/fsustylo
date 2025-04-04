import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { UserContext } from '@/hooks/userInfo';
import { router } from 'expo-router';

const popularCategories = ["Haircut", "Manicure", "Pedicure", "Facial", "Waxing", "Massage", "Bridal", "Makeup"];
const recentSearches = ["Hair salon", "Beauty parlour", "Nail art", "Spa center"];
const popularSearches = ["Salon near me", "Hair coloring", "Bridal makeup", "Men's haircut"];

export default function AtSalon() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchScreen, setShowSearchScreen] = useState(false);
  const { userInfo, city } = useContext(UserContext) as any;
  let [gender, setGender] = useState();

  // Sample salon data
  const nearbySalons = [
    { id: '1', name: 'Ozone Salon', distance: '6.7 Km', rating: '4.6', image: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg', gender: 'All' },
    { id: '2', name: 'My Glam Studio', distance: '6.72 Km', rating: '4.2', image: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg', gender: 'Female' },
    { id: '3', name: 'Cinderella', distance: '6.72 Km', rating: '4.0', image: 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg', gender: 'All' },
  ];

  const handleSearch = () => {
    setShowSearchScreen(true);
  };
  const toggleGender = (i) => {
    setGender(i)
  }

  if (showSearchScreen) {
    return (
      <View className="flex-1 bg-white p-4">
        {/* Search Header */}
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => setShowSearchScreen(false)}>
            <Ionicons name="arrow-back" size={24} color="#E6007E" />
          </TouchableOpacity>
          <View className="flex-1 ml-4 flex-row items-center bg-gray-100 rounded-lg px-3 py-1">
            <FontAwesome name="search" size={18} color="gray" />
            <TextInput
              className="ml-2 flex-1 text-gray-800"
              placeholder="Search for salons or services"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
          </View>
        </View>

        {/* Recent Searches */}
        {searchQuery === '' && (
          <>
            <Text className="text-lg font-bold mb-2">Recent Searches</Text>
            <View className="flex-row flex-wrap mb-4">
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
                  onPress={() => setSearchQuery(search)}
                >
                  <Text className="text-gray-800">{search}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Popular Searches */}
            <Text className="text-lg font-bold mb-2">Popular Searches</Text>
            <View className="flex-row flex-wrap mb-4">
              {popularSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
                  onPress={() => setSearchQuery(search)}
                >
                  <Text className="text-gray-800">{search}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Search Results */}
        {searchQuery !== '' && (
          <>
            <Text className="text-lg font-bold mb-4">Search Results</Text>
            <FlatList
              data={nearbySalons.filter(salon =>
                salon.name.toLowerCase().includes(searchQuery.toLowerCase())
              )}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="flex-row items-center py-3 border-b border-gray-100"
                  onPress={() => router.push({
                    pathname: '/',
                    params: { salon: JSON.stringify(item) }
                  })}
                >
                  <Image source={{ uri: item.image }} className="w-16 h-16 rounded-lg" />
                  <View className="ml-3">
                    <Text className="font-bold">{item.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <FontAwesome name="map-marker" size={12} color="gray" />
                      <Text className="text-gray-500 text-xs ml-1">{item.distance}</Text>
                      <FontAwesome name="star" size={12} color="gold" className="ml-2" />
                      <Text className="text-gray-500 text-xs ml-1">{item.rating}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          </>
        )}
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-4">
        <View className="flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.push("/(app)/profile")}>
            <View className="flex-row items-center">
              <Ionicons name="location" size={25} color="#E6007E" />
              <View className="flex-col">
                <Text className="text-md font-bold ml-1">Hi, {userInfo?.name || "User"}</Text>
                <Text style={{ fontSize: 10 }} className="text-gray-600 ml-1">{city}</Text>
              </View>
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.push("/(app)/notification")}>
              <Ionicons name="notifications-outline" size={25} color="black" className="mr-4" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(app)/profile")}>
              <Ionicons name="person-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity
        className="mx-4 mt-3 bg-gray-100 rounded-lg px-4 py-3 flex-row items-center"
        onPress={handleSearch}
      >
        <FontAwesome name="search" size={18} color="gray" />
        <Text className="ml-2 text-gray-500">Search for the Style you want</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center my-2 mt-3">
        <View className="bg-gray-100 rounded-full p-1 flex-row">
          {['All', 'Male', 'Female'].map((item) => (
            <TouchableOpacity onPress={(item) => toggleGender(item)}
              key={item}
              className={`px-6 py-2 rounded-full ${gender === item ? 'bg-pink-500 shadow-md' : ''}`}
            >
              <Text className={`font-semibold ${gender === item ? 'text-white' : 'text-gray-700'}`}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView>
        {/* Search Bar */}

        <View className="px-4">
          <Text className="text-lg font-bold mb-3">Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
            {popularCategories.map((category, index) => (
              <View key={index} className="items-center mr-1">
                <View className="bg-gray-100 w-14 h-14 rounded-full items-center justify-center">
                  <MaterialIcons name="spa" size={24} color="#E6007E" />
                </View>
                <Text className="mt-2 text-xs text-center" style={{ width: 70 }}>{category}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Deals & Offers */}
        <View className="bg-pink-50 px-4 py-5">
          <Text className="text-xl font-bold">Deals and <Text className="text-pink-500">Offers</Text></Text>
          <Text className="text-gray-500 mb-3">Grab Nearby Exciting Deals</Text>

          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="font-bold">Big Savings</Text>
            <Text className="text-gray-500 mt-1">Plex (Short Hair Length)</Text>
            <Text className="text-pink-500 text-lg font-bold mt-1">₹48</Text>
            <TouchableOpacity className="bg-black rounded-full py-2 mt-3">
              <Text className="text-white text-center font-semibold">Buy Now</Text>
            </TouchableOpacity>
            <Text className="mt-3 font-medium">My Glam Studio</Text>
            <View className="flex-row items-center mt-1">
              <FontAwesome name="map-marker" size={12} color="gray" />
              <Text className="text-gray-500 text-xs ml-1">6.72 Km</Text>
              <FontAwesome name="star" size={12} color="gold" className="ml-2" />
              <Text className="text-gray-500 text-xs ml-1">4.2</Text>
            </View>
          </View>
        </View>

        {/* Nearby Salons */}
        <View className="px-4 py-5 mb-12">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold">Nearby Salons</Text>
            <TouchableOpacity>
              <Text className="text-pink-500 font-semibold">See all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={nearbySalons}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mr-4 w-28"
                onPress={() => router.push({
                  pathname: '/salon',
                  params: { salon: JSON.stringify(item) }
                })}
              >
                <Image source={{ uri: item.image }} className="w-full h-28 rounded-lg" />
                <Text className="mt-2 font-medium">{item.name}</Text>
                <View className="flex-row items-center mt-1">
                  <FontAwesome name="map-marker" size={12} color="gray" />
                  <Text className="text-gray-500 text-xs ml-1">{item.distance}</Text>
                  <FontAwesome name="star" size={12} color="gold" className="ml-2" />
                  <Text className="text-gray-500 text-xs ml-1">{item.rating}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}