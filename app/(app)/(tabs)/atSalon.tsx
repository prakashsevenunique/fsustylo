import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/hooks/userInfo';
import { router } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import { imageBaseUrl } from '@/utils/helpingData';

const popularCategories = ["Haircut", "Manicure", "Pedicure", "Facial", "Waxing", "Massage", "Bridal", "Makeup"];

export default function AtSalon() {
  const { userInfo, city, location } = useContext(UserContext) as any;
  const [selectedGender, setSelectedGender] = useState('all');
  const [loading, setLoading] = useState(true);
  const [nearbySalon, setNearbySalon] = useState([]);

  // Service data organized by gender
  const servicesData = {
    women: [
      { id: "w1", name: "Haircut", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e", description: "All hair types" },
      { id: "w2", name: "Hair Color", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e", description: "Coloring & highlights" },
      { id: "w3", name: "Hair Spa", image: "https://images.unsplash.com/photo-1559599101-f09722fb4948", description: "Deep conditioning" },
      { id: "w4", name: "Bridal Makeup", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", description: "Wedding packages" },
      { id: "w5", name: "Facial", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", description: "Skin treatments" },
      { id: "w6", name: "Threading", image: "https://5.imimg.com/data5/SELLER/Default/2022/2/XM/JX/SY/47412176/new-product-500x500.jpeg", description: "Eyebrow shaping" },
      { id: "w7", name: "Waxing", image: "https://naomisheadmasters.com/wp-content/uploads/2023/06/Full-Body-Waxing-Prices-In-Chandigarh.webp", description: "Full body" },
      { id: "w8", name: "Manicure", image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30", description: "Nail care" },
      { id: "w9", name: "Pedicure", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35", description: "Foot care" },
      { id: "w10", name: "Hair Extensions", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Clip-ins & bonds" },
    ],
    men: [
      { id: "m1", name: "Haircut", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Styling & trims" },
      { id: "m2", name: "Beard Grooming", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956", description: "Trim & shape" },
      { id: "m3", name: "Shave", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Hot towel shave" },
      { id: "m4", name: "Facial", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Men's skincare" },
      { id: "m5", name: "Hair Color", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956", description: "Gray coverage" },
      { id: "m6", name: "Head Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874", description: "Relaxation" },
      { id: "m7", name: "Waxing", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35", description: "Chest/back" },
      { id: "m8", name: "Manicure", image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73", description: "Hand care" },
      { id: "m9", name: "Pedicure", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Foot care" },
      { id: "m10", name: "Hair Treatment", image: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70", description: "Dandruff/fall" },
    ],
    unisex: [
      { id: "u1", name: "Spa", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874", description: "Full body" },
      { id: "u2", name: "Hair Rebonding", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Straightening" },
      { id: "u3", name: "Keratin", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Smoothing" },
      { id: "u4", name: "Hair Wash", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Basic service" },
      { id: "u5", name: "Scalp Treatment", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Dandruff care" },
    ]
  };

  const getNearbySalons = async () => {
    try {
      const response = await axiosInstance.get('/api/salon/nearby', {
        params: { ...location }
      });
      setNearbySalon(response.data?.salons)
    } catch (error) {
      setNearbySalon([])
    } finally {
      setLoading(false)
    }
  };

  const renderServiceCard = ({ item }) => (
    <TouchableOpacity className="mr-3 w-32" onPress={() => router.push(`/salon/searchSalon?maincategory=${selectedGender === 'all' ? 'unisex' : selectedGender}&category=${item.name}`)}>
      <View className="bg-gray-100 rounded-lg shadow-md overflow-hidden items-center pb-2 shadow-sm">
        <Image
          source={{ uri: item.image }}
          className="h-24 w-full rounded-t-lg"
        />
        <Text className="text-gray-800 mt-2 text-center px-1 font-medium">{item.name}</Text>
        <Text className="text-gray-500 text-xs text-center px-1">{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategoryItem = ({ item, index }) => (
    <TouchableOpacity
      key={index}
      className="items-center mr-2"
      onPress={() => router.push(`/salon/searchSalon?maincategory=${selectedGender === 'all' ? 'unisex' : selectedGender}&category=${item}`)}
    >
      <View className="bg-gray-100 w-14 h-14 rounded-full items-center justify-center">
        <MaterialIcons name="spa" size={24} color="#E6007E" />
      </View>
      <Text className="mt-2 text-xs font-medium text-center" style={{ width: 70 }}>{item}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (location.latitude) {
      getNearbySalons()
    }
  }, [location.latitude, location.longitude])

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-sm">
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

      {/* Search Bar */}
      <TouchableOpacity
        className="mx-4 mt-3 bg-gray-100 rounded-lg px-4 py-3 flex-row items-center"
        onPress={() => router.push("/salon/searchSalon")}
      >
        <FontAwesome name="search" size={18} color="gray" />
        <Text className="ml-2 py-1 text-gray-500">Search for the Style you want</Text>
      </TouchableOpacity>

      {/* Gender Filter */}
      <View className="px-4 py-3 flex-row items-center justify-between my-2">
        <Text className="mr-3 text-gray-700 font-medium">Filter by:</Text>
        <View className="flex-row bg-gray-100 rounded-full p-1">
          {['all', 'male', 'female'].map((gender) => (
            <TouchableOpacity
              key={gender}
              className={`px-4 py-1 rounded-full ${selectedGender === gender ? 'bg-pink-600' : 'bg-transparent'}`}
              onPress={() => setSelectedGender(gender)}
            >
              <Text className={selectedGender === gender ? 'text-white font-bold' : 'text-gray-600'}>
                {gender === 'male' ? 'Men' : gender === 'female' ? 'Women' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-3">
          <Text className="text-pink-600 text-lg font-bold mb-3">Popular Categories</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item, index) => index.toString()}
            className="mb-4"
          />
        </View>
        <View className="p-3">
          {(selectedGender === 'female' || selectedGender === 'all') && (
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-pink-600 text-lg font-bold">Women's Services</Text>
                <TouchableOpacity onPress={() => router.push("/(app)/salon/searchSalon?maincategory=women")}>
                  <Text className="text-pink-500 text-sm font-medium">View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={servicesData.women}
                renderItem={renderServiceCard}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}

          {(selectedGender === 'male' || selectedGender === 'all') && (
            <View className="mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-pink-600 text-lg font-bold">Men's Services</Text>
                <TouchableOpacity onPress={() => router.push("/(app)/salon/searchSalon?maincategory=men")}>
                  <Text className="text-pink-500 text-sm font-medium">View All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={servicesData.men}
                renderItem={renderServiceCard}
                keyExtractor={(item) => item.id}
              />
            </View>
          )}

          {/* Show unisex services always */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-pink-600 text-lg font-bold">For Everyone</Text>
              <TouchableOpacity onPress={() => router.push("/(app)/salon/searchSalon?maincategory=unisex")}>
                <Text className="text-pink-500 text-sm font-medium">View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={servicesData.unisex}
              renderItem={renderServiceCard}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>


        {/* Deals & Offers Section */}
        <View className="bg-pink-50 px-4 py-5">
          <Text className="text-xl font-bold">Deals and <Text className="text-pink-500">Offers</Text></Text>
          <Text className="text-gray-500 mb-3">Grab Nearby Exciting Deals</Text>

          <View className="bg-white p-4 rounded-xl shadow-sm">
            <Text className="font-bold">Big Savings</Text>
            <Text className="text-gray-500 mt-1">Plex (Short Hair Length)</Text>
            <View className="flex-row items-center">
              <Text className="text-pink-500 text-lg font-bold mt-1">₹48</Text>
              <Text className="text-gray-400 text-sm line-through ml-2 mt-1">₹120</Text>
              <Text className="text-green-600 text-xs font-bold ml-2 mt-1 bg-green-100 px-1 py-0.5 rounded">60% OFF</Text>
            </View>
            <TouchableOpacity className="bg-pink-600 rounded-full py-2 mt-3">
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

        {/* Nearby Salons Section */}
        <View className="px-4 py-5 mb-12">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold">Nearby Salons</Text>
            <TouchableOpacity onPress={() => router.push({
              pathname: '/(app)/salon',
              params: { type: "nearby" },
            })}>
              <Text className="text-pink-500 text-sm font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          {
            nearbySalon?.length === 0 || !nearbySalon ? (
              <View className="flex-1 justify-center items-center p-4">
                <Ionicons name="alert-circle-outline" size={50} color="#E6007E" className="mb-4" />
                <Text className="text-center text-gray-600 text-lg">Service is unavailable in your area</Text>
              </View>
            ) : (
              <FlatList
                horizontal
                data={nearbySalon}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    key={item._id}
                    onPress={() =>
                      router.push({
                        pathname: '/(app)/salon/details',
                        params: { salon: JSON.stringify(item) },
                      })
                    }
                  >
                    <View className="bg-white shadow-sm rounded-lg my-2 mr-3 overflow-hidden border border-gray-100" style={{ width: 160 }}>
                      <Image
                        source={{
                          uri: `${imageBaseUrl}/${item?.salonPhotos[0]}` ||
                            "https://images.pexels.com/photos/18186525/pexels-photo-18186525/free-photo-of-hair-cutting-in-salon-in-close-up-view.jpeg",
                        }}
                        className="h-28 rounded-t-lg w-full"
                      />
                      <View className="p-3">
                        <Text className="font-semibold text-gray-800" numberOfLines={1}>
                          {item?.salonName}
                        </Text>
                        <View className="flex-row justify-between mt-2">
                          <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text className="text-gray-600 ml-1 text-xs">4.5 ({item?.reviews?.length || 0})</Text>
                          </View>
                          <View className="flex-row items-center">
                            <Ionicons name="navigate-outline" size={12} color="#E6007E" />
                            <Text className="text-gray-500 text-xs ml-1">{(item.distance).toFixed(2)} km</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )
          }
        </View>
      </ScrollView>
    </View>
  );
}