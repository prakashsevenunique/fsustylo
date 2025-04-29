import { useContext, useEffect, useState } from "react"
import { View, Text, FlatList, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native"
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons"
import { router } from "expo-router"
import { UserContext } from "@/hooks/userInfo"
import axiosInstance from "@/utils/axiosInstance"
import { imageBaseUrl } from "@/utils/helpingData"
import { LinearGradient } from "expo-linear-gradient"
import Header from "../header/header"
import SalonImageCarousel from "./Carousel"

// Su stylo Salon color palette - lighter shades
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

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "The best salon experience ever! The stylist understood exactly what I wanted.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 4,
    comment: "Great service and friendly staff. Will definitely come back again.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 3,
    name: "Priya Patel",
    rating: 5,
    comment: "Loved the attention to detail. My hair has never looked better!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
]

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "You can book directly through our app by selecting your preferred salon, service, and time slot.",
  },
  {
    question: "What safety measures are in place?",
    answer:
      "All our salons follow strict hygiene protocols including sanitization between clients and use of disposable tools.",
  },
  {
    question: "Can I cancel my appointment?",
    answer: "Yes, you can cancel up to 2 hours before your appointment without any charges.",
  },
]

export default function HomeScreen() {
  const { location, fetchUserInfo } = useContext(UserContext)
  const [nearbySalon, setNearbySalon] = useState([])
  const [mostReviewed, setMostReviewed] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    if (location.latitude) {
      await getNearbySalons()
      await getMostReviewed()
      fetchUserInfo()
    }
    setRefreshing(false)
  }

  const getNearbySalons = async () => {
    try {
      const response = await axiosInstance.get("/api/salon/nearby", {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          maxDistance: 200,
          minRate: 0,
          maxRate: 100000,
          sortBy: "distance",
          sortOrder: "asc",
          minReviewCount: 0,
          minRating: 0,
        },
      })
      setNearbySalon(response.data?.salons)
    } catch (error) {
      setNearbySalon([])
    } finally {
      setLoading(false)
    }
  }

  const getMostReviewed = async () => {
    try {
      const response = await axiosInstance.get("/api/salon/mostreview", {
        params: { ...location },
      })
      setMostReviewed(response.data?.salons)
    } catch (error) {
      setMostReviewed([])
    }
  }

  const renderServiceCard = ({ item }) => (
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

  useEffect(() => {
    if (location.latitude) {
      getNearbySalons()
      getMostReviewed()
    }
  }, [location.latitude, location.longitude])

  if (loading) {
    return (
      <View className="flex-1" style={{ backgroundColor: colors.background }}>
        <Header />
        <View className="flex-1 justify-center items-center">
          <MaterialCommunityIcons name="hair-dryer" size={40} color={colors.primary} />
          <Text className="mt-4" style={{ color: colors.primary }}>
            Loading...
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1 pb-16" style={{ backgroundColor: colors.background }}>
      <Header />
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        className="pt-2 px-0 pb-20"
      >
        <SalonImageCarousel
          home={true}
          images={[
            require("@/assets/img/Home.jpg"),
            require("@/assets/img/Home2.jpg"),
            require("@/assets/img/Home3.jpg"),
          ]}
        />

        {/* Featured Offer Banner */}
        <View className="mx-3 my-5">
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
                <TouchableOpacity onPress={()=>router.push("/salon/searchSalon")}
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

        <View className="px-4">
          {/* Nearby Salons Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold" style={{ color: colors.text }}>
                Salon Near You
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(app)/salon",
                    params: { type: "nearby" },
                  })
                }
                style={{ 
                  backgroundColor: colors.primaryLighter, 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 20 
                }}
              >
                  <Text className="text-black text-sm" style={{ fontWeight: "600" }}>View All</Text>
              </TouchableOpacity>
            </View>

            {nearbySalon?.length === 0 || !nearbySalon ? (
              <View className="flex-1 justify-center items-center p-4 bg-white rounded-2xl">
                <Ionicons name="alert-circle-outline" size={50} color={colors.primaryLight} className="mb-4" />
                <Text className="text-center text-lg" style={{ color: colors.textLight }}>
                  Service is unavailable in your area
                </Text>
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
            )}
          </View>

          {/* Most Reviewed Salons Section */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold" style={{ color: colors.text }}>
                Most Reviewed Salons
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/(app)/salon",
                    params: { type: "mostreview" },
                  })
                }
                style={{ 
                  backgroundColor: colors.secondaryLight, 
                  paddingHorizontal: 12, 
                  paddingVertical: 6, 
                  borderRadius: 20 
                }}
              >
                <Text className="text-black text-sm" style={{ fontWeight: "600" }}>View All</Text>
              </TouchableOpacity>
            </View>

            {mostReviewed?.length === 0 || !mostReviewed ? (
              <View className="flex-1 justify-center items-center p-4 bg-white rounded-2xl">
                <Text className="text-center text-lg" style={{ color: colors.textLight }}>
                  Service is unavailable in your area
                </Text>
              </View>
            ) : (
              <FlatList
                horizontal
                data={mostReviewed}
                keyExtractor={(item) => item._id}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
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
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>

          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold" style={{ color: colors.text }}>
                Quick Services
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[
                { id: "u1", name: "Spa", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874", description: "Full body" },
                { id: "u2", name: "Hair Rebonding", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Straightening" },
                { id: "u3", name: "Keratin", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Smoothing" },
                { id: "u4", name: "Hair Wash", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Basic service" },
                { id: "u5", name: "Scalp Treatment", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Dandruff care" },
              ]}
              renderItem={renderServiceCard}
            />
          </View>

          {/* Women's Services Section */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold" style={{ color: colors.text }}>
                Women's Services
              </Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[
                { id: "w1", gender: 'female', name: "Haircut", image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e", description: "All hair types" },
                { id: "w2", gender: 'female', name: "Hair Color", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e", description: "Coloring & highlights" },
                { id: "w3", gender: 'female', name: "Hair Spa", image: "https://images.unsplash.com/photo-1559599101-f09722fb4948", description: "Deep conditioning" },
                { id: "w4", gender: 'female', name: "Bridal Makeup", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb", description: "Wedding packages" },
                { id: "w5", gender: 'female', name: "Facial", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9", description: "Skin treatments" },
                { id: "w6", gender: 'female', name: "Threading", image: "https://5.imimg.com/data5/SELLER/Default/2022/2/XM/JX/SY/47412176/new-product-500x500.jpeg", description: "Eyebrow shaping" },
                { id: "w7", gender: 'female', name: "Waxing", image: "https://naomisheadmasters.com/wp-content/uploads/2023/06/Full-Body-Waxing-Prices-In-Chandigarh.webp", description: "Full body" },
                { id: "w8", gender: 'female', name: "Manicure", image: "https://images.unsplash.com/photo-1596464716127-f2a82984de30", description: "Nail care" },
                { id: "w9", gender: 'female', name: "Pedicure", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35", description: "Foot care" },
                { id: "w10", gender: 'female', name: "Hair Extensions", image: "https://images.unsplash.com/photo-1605497788044-5a32c7078486", description: "Clip-ins & bonds" },
              ]}
              renderItem={renderServiceCard}
            />
          </View>

          {/* Men's Services Section */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold" style={{ color: colors.text }}>
                Men's Services
              </Text>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={[
                { id: "m1", gender: "male", name: "Haircut", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Styling & trims" },
                { id: "m2", gender: "male", name: "Beard Grooming", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Trim & shape" },
                { id: "m3", gender: "male", name: "Shave", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Hot towel shave" },
                { id: "m4", gender: "male", name: "Facial", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Men's skincare" },
                { id: "m5", gender: "male", name: "Hair Color", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956", description: "Gray coverage" },
                { id: "m6", gender: "male", name: "Head Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874", description: "Relaxation" },
                { id: "m7", gender: "male", name: "Waxing", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35", description: "Chest/back" },
                { id: "m8", gender: "male", name: "Manicure", image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73", description: "Hand care" },
                { id: "m9", gender: "male", name: "Pedicure", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Foot care" },
                { id: "m10", gender: "male", name: "Hair Treatment", image: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70", description: "Dandruff/fall" },
              ]}
              renderItem={renderServiceCard}
            />
          </View>

          {/* Testimonials Section */}
          <View className="mt-4 mb-6">
            <Text className="text-lg font-bold mb-4" style={{ color: colors.text }}>
              What Our Customers Say
            </Text>
            <FlatList
              horizontal
              data={testimonials}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View
                  className="rounded-2xl p-4 mr-4 my-2"
                  style={{
                    width: 280,
                    backgroundColor: colors.cardBg,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 2,
                    borderLeftWidth: 0,
                  }}
                >
                  <View className="flex-row items-center mb-3">
                    <Image 
                      source={{ uri: item.avatar }} 
                      className="h-14 w-14 rounded-full mr-3"
                      style={{
                        borderWidth: 2,
                        borderColor: colors.primaryLighter
                      }}
                    />
                    <View>
                      <Text className="font-bold" style={{ color: colors.text }}>
                        {item.name}
                      </Text>
                      <View className="flex-row mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Ionicons
                            key={i}
                            name={i < item.rating ? "star" : "star-outline"}
                            size={16}
                            color="#FFD700"
                          />
                        ))}
                      </View>
                    </View>
                  </View>
                  <Text className="italic" style={{ color: colors.textLight, lineHeight: 20 }}>
                    "{item.comment}"
                  </Text>
                </View>
              )}
            />
          </View>

          {/* FAQ Section */}
          <View className="mt-4 mb-6">
            <Text className="text-xl font-bold mb-4" style={{ color: colors.text }}>
              Frequently Asked Questions
            </Text>

            {faqs.map((faq, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                className="rounded-2xl p-5 mb-3"
                style={{
                  backgroundColor: colors.cardBg,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-start">
                  <View 
                    className="mr-3 rounded-full items-center justify-center"
                    style={{ 
                      backgroundColor: [colors.primaryLighter, colors.secondaryLight, colors.tertiaryLight][index % 3],
                      width: 32,
                      height: 32
                    }}
                  >
                    <Feather name="help-circle" size={18} color={colors.primary} />
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base mb-1" style={{ color: colors.text }}>
                      {faq.question}
                    </Text>
                    <Text className="text-sm" style={{ color: colors.textLight, lineHeight: 20 }}>
                      {faq.answer}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="mt-4 flex-row items-center justify-center py-4 rounded-2xl"
              style={{ backgroundColor: colors.primaryLighter }}
              activeOpacity={0.7}
              onPress={() => router.push("/(app)/profile/helpCenter")}
            >
              <Text className="font-medium mr-2 text-black" >
                View all FAQs
              </Text>
              <Feather name="chevron-right" size={18} color="black" />
            </TouchableOpacity>

            {/* App Logo at Bottom */}
            <View className="items-center mt-10 mb-6">
              <View className="flex-row items-center">
                <Image source={require("@/assets/img/logo.png")} className="w-20 h-20 mb-4" resizeMode="contain" />
              </View>
              <Text className="text-xs mt-2" style={{ color: colors.textLighter }}>
                © {new Date().getFullYear()} SuStylo. All rights reserved.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
