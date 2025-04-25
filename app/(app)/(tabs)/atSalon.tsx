import { View, Text, Image, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Feather, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@/hooks/userInfo';
import { router } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import { imageBaseUrl } from '@/utils/helpingData';
import { LinearGradient } from 'expo-linear-gradient';

const popularCategories = ["Haircut", "Manicure", "Pedicure", "Facial", "Waxing", "Massage", "Bridal", "Makeup"];
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
  white: "#FFFFFF",
}
export default function AtSalon() {
  const { userInfo, city, location } = useContext(UserContext) as any;
  const [selectedGender, setSelectedGender] = useState('all');
  const [loading, setLoading] = useState(true);
  const [nearbySalon, setNearbySalon] = useState([]);

  // Service data organized by gender
  const servicesData = {
    women: [
      { id: "w1", gender: "female", name: "Haircut", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e", description: "All hair types" },
      { id: "w2", gender: "female", name: "Hair Color", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e", description: "Coloring & highlights" },
      { id: "w3", gender: "female", name: "Hair Spa", image: "https://images.unsplash.com/photo-1559599101-f09722fb4948", description: "Deep conditioning" },
      { id: "w4", gender: "female", name: "Bridal Makeup", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", description: "Wedding packages" },
      { id: "w5", gender: "female", name: "Facial", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", description: "Skin treatments" },
      { id: "w6", gender: "female", name: "Threading", image: "https://5.imimg.com/data5/SELLER/Default/2022/2/XM/JX/SY/47412176/new-product-500x500.jpeg", description: "Eyebrow shaping" },
      { id: "w7", gender: "female", name: "Waxing", image: "https://naomisheadmasters.com/wp-content/uploads/2023/06/Full-Body-Waxing-Prices-In-Chandigarh.webp", description: "Full body" },
      { id: "w8", gender: "female", name: "Manicure", image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30", description: "Nail care" },
      { id: "w9", gender: "female", name: "Pedicure", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35", description: "Foot care" },
      { id: "w10", gender: "female", name: "Hair Extensions", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Clip-ins & bonds" },
    ],
    men: [
      { id: "m1", gender: "male", name: "Haircut", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Styling & trims" },
      { id: "m2", gender: "male", name: "Beard Grooming", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956", description: "Trim & shape" },
      { id: "m3", gender: "male", name: "Shave", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Hot towel shave" },
      { id: "m4", gender: "male", name: "Facial", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Men's skincare" },
      { id: "m5", gender: "male", name: "Hair Color", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956", description: "Gray coverage" },
      { id: "m6", gender: "male", name: "Head Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874", description: "Relaxation" },
      { id: "m7", gender: "male", name: "Waxing", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35", description: "Chest/back" },
      { id: "m8", gender: "male", name: "Manicure", image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73", description: "Hand care" },
      { id: "m9", gender: "male", name: "Pedicure", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Foot care" },
      { id: "m10", gender: "male", name: "Hair Treatment", image: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70", description: "Dandruff/fall" },
    ],
    unisex: [
      { id: "u1", gender: "unisex", name: "Spa", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874", description: "Full body" },
      { id: "u2", gender: "unisex", name: "Hair Rebonding", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Straightening" },
      { id: "u3", gender: "unisex", name: "Keratin", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Smoothing" },
      { id: "u4", gender: "unisex", name: "Hair Wash", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Basic service" },
      { id: "u5", gender: "unisex", name: "Scalp Treatment", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Dandruff care" },
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

  const renderServiceCard = ({ item }: any) => (
    <TouchableOpacity
      className="mr-3 w-32 mb-1"
      onPress={() => router.push(`/salon/searchSalon?gender=${item.gender}&serviceTitle=${item.name}`)}
    >
      <View
        style={{
          backgroundColor: colors.cardBg,
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 2,
        }}
        className="items-center pb-3"
      >
        <Image
          source={{ uri: item.image }}
          className="h-24 w-full"
          style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
        />
        <View
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            marginTop: 0.5,
            marginBottom: 4
          }}
        />
        <Text style={{ color: colors.text, fontWeight: "700" }} className="text-center px-1">
          {item.name}
        </Text>
        <Text style={{ color: colors.textLight }} className="text-xs text-center px-1">
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  )

  const renderCategoryItem = ({ item, index }: any) => (
    <TouchableOpacity
      key={index}
      className="items-center mr-6" // Increased margin for better spacing
      onPress={() => router.push(`/salon/searchSalon?gender=${selectedGender === 'all' ? 'unisex' : selectedGender}&serviceTitle=${item}`)}
    >
      <View className="bg-[#FFE8D6] w-14 h-14 rounded-full items-center justify-center border-2 border-[#F4A36C]">
        <MaterialIcons name="spa" size={28} color="#C13D02" />
      </View>
      <Text className="mt-2 text-sm font-semibold text-center ">
        {item}
      </Text>
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="location" size={25} color={colors.primary} />
              <View style={{ flexDirection: "column" }}>
                <Text style={{ fontSize: 16, fontWeight: "bold", marginLeft: 4, color: colors.text }}>
                  Hi, {userInfo?.name || "User"}
                </Text>
                <Text style={{ fontSize: 10, color: colors.textLight, marginLeft: 4 }}>
                  {(city && city) || "fetching.."}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ flexDirection: "row", alignItems: "center", marginRight: 8 }}>
            <TouchableOpacity onPress={() => router.push("/(app)/notification")} style={{ marginRight: 16 }}>
              <Ionicons name="notifications-outline" size={25} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(app)/profile")}>
              <Ionicons name="person-outline" size={25} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="mx-4 mt-3 bg-[#FFE8D6] rounded-lg px-4 py-3 flex-row items-center"
        onPress={() => router.push("/salon/searchSalon")}
      >
        <FontAwesome name="search" size={18} color="#FB8807" />
        <Text className="ml-2 py-1 text-[#FB8807]">Search for the Style you want</Text>
      </TouchableOpacity>

      {/* Gender Filter */}
      <View className="px-4 py-3 flex-row items-center justify-between my-2">
        <Text className="mr-3 text-gray-700 font-medium">Filter by:</Text>
        <View className="flex-row bg-[#FFE8D6] rounded-full p-1">
          {['all', 'male', 'female'].map((gender) => (
            <TouchableOpacity
              key={gender}
              className={`px-4 py-1 rounded-full ${selectedGender === gender ? 'bg-[#F4A36C]' : 'bg-transparent'}`}
              onPress={() => setSelectedGender(gender)}
            >
              <Text className={selectedGender === gender ? 'text-white font-bold' : 'text-[#FB8807]'}>
                {gender === 'male' ? 'Men' : gender === 'female' ? 'Women' : 'All'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-3">
          <Text className="text-black text-lg font-bold mb-3">Popular Categories</Text>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularCategories}
            renderItem={renderCategoryItem}
            keyExtractor={(item, index) => index.toString()}
            className="mb-4"
          />
        </View>
        <View className="p-3 ">
          {(selectedGender === 'female' || selectedGender === 'all') && (
            <View className="mb-4 ">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold" style={{ color: colors.text }}>Women's Services</Text>
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
                <Text className="text-lg font-bold" style={{ color: colors.text }}>Men's Services</Text>
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
              <Text className="text-lg font-bold" style={{ color: colors.text }}>For Everyone</Text>
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
          <View className="mx-2 my-2">
            <LinearGradient
              colors={[colors.primaryLight, colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl overflow-hidden"
              style={{
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.2,
                shadowRadius: 12,
                elevation: 5,
              }}
            >
              <View className="p-5 flex-row items-center justify-between">
                <View className="flex-1 pr-4">
                  <Text className="font-bold text-xl mb-1" style={{ color: colors.white }}>
                    Summer Special
                  </Text>
                  <Text className="text-sm mb-3" style={{ color: colors.white, opacity: 0.9 }}>
                    Get 30% off on all hair treatments this week only!
                  </Text>
                  <TouchableOpacity onPress={() => router.push("/salon/searchSalon")}
                    className="px-4 py-2 rounded-full self-start"
                    style={{ backgroundColor: colors.white }}
                  >
                    <Text className="font-bold" style={{ color: colors.primary }}>
                      Book Now
                    </Text>
                  </TouchableOpacity>
                </View>
                <View className="w-20 h-20 items-center justify-center">
                  <MaterialCommunityIcons name="scissors-cutting" size={48} color={colors.white} />
                </View>
              </View>
            </LinearGradient>
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
                    className='my-2'
                    key={item._id}
                    onPress={() =>
                      router.push({
                        pathname: "/(app)/salon/details",
                        params: { salon: JSON.stringify(item) },
                      })
                    }
                  >
                    <View
                      className="rounded-2xl mb-3 mr-3 overflow-hidden"
                      style={{
                        width: 140,
                        backgroundColor: colors.cardBg,
                        shadowColor: colors.primary,
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 2,
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            `${imageBaseUrl}/${item?.salonPhotos[0]}` ||
                            "https://images.pexels.com/photos/18186525/pexels-photo-18186525/free-photo-of-hair-cutting-in-salon-in-close-up-view.jpeg",
                        }}
                        className="h-28 w-full"
                        style={{ borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                      />
                      <View className="p-3">
                        <Text className="font-bold text-base" style={{ color: colors.text }} numberOfLines={1}>
                          {item?.salonName}
                        </Text>
                        <View className="flex-row justify-between mt-2">
                          <View className="flex-row items-center">
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text className="ml-1 text-xs" style={{ color: colors.textLight }}>
                              {item?.averageRating?.toFixed(1) || 4.5} ({item?.reviews?.length || 0})
                            </Text>
                          </View>
                          <View className="flex-row items-center">
                            <Feather name="map-pin" size={12} color={colors.primary} />
                            <Text className="text-xs ml-1" style={{ color: colors.textLight }}>
                              {item.distance.toFixed(1)} km
                            </Text>
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