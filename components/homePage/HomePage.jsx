import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, Image, TouchableOpacity, RefreshControl, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { UserContext } from "@/hooks/userInfo";
import axiosInstance from "@/utils/axiosInstance";
import { imageBaseUrl } from "@/utils/helpingData";
import Header from "../header/header";
import SalonImageCarousel from "./Carousel";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 5,
    comment: "The best salon experience ever! The stylist understood exactly what I wanted.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 4,
    comment: "Great service and friendly staff. Will definitely come back again.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 3,
    name: "Priya Patel",
    rating: 5,
    comment: "Loved the attention to detail. My hair has never looked better!",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  }
];

const faqs = [
  {
    question: "How do I book an appointment?",
    answer: "You can book directly through our app by selecting your preferred salon, service, and time slot."
  },
  {
    question: "What safety measures are in place?",
    answer: "All our salons follow strict hygiene protocols including sanitization between clients and use of disposable tools."
  },
  {
    question: "Can I cancel my appointment?",
    answer: "Yes, you can cancel up to 2 hours before your appointment without any charges."
  }
];

export default function HomeScreen() {
  const { location } = useContext(UserContext);
  const [nearbySalon, setNearbySalon] = useState([])
  const [mostReviewed, setMostReviewed] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    if (location.latitude) {
      await getNearbySalons()
      await getMostReviewed()
    }
    setRefreshing(false);
  };

  const getNearbySalons = async () => {
    try {
      const response = await axiosInstance.get('/api/salon/nearby', {
        params: { ...location }
      });
      setNearbySalon(response.data?.salons)
    } catch (error) {
      setNearbySalon([])
      // Alert.alert('Error fetching nearby salons:', error?.response?.data?.message || "Undefined");
    } finally {
      setLoading(false)
    }
  };

  const getMostReviewed = async () => {
    try {
      const response = await axiosInstance.get('/api/salon/mostreview', {
        params: { ...location }
      });
      setMostReviewed(response.data?.salons)
    } catch (error) {
      setMostReviewed([])
      console.error('Error fetching nearby salons:', error);
    }
  };
  const renderServiceCard = ({ item }) => (
    <TouchableOpacity className="mr-3 w-32" onPress={() => router.push(`/service-detail/${item.id}`)}>
      <View className="bg-gray-100 rounded-lg shadow-md overflow-hidden items-center pb-2 shadow-sm">
        <Image
          source={{ uri: item.image }}
          className="h-24 w-full rounded-t-lg"
        />
        <Text className="text-gray-800 mt-2 text-center px-1">{item.name}</Text>
        <Text className="text-gray-500 text-xs text-center px-1">{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  useEffect(() => {
    if (location.latitude) {
      getNearbySalons()
      getMostReviewed()
    }
  }, [location.latitude, location.longitude])

  if (loading) {
    return (
      <View className="flex-1 bg-white pb-16">
        <Header />
        <View className="flex-1 justify-center items-center">
          <Ionicons name="cut" size={40} color="#E6007E" />
          <Text className="mt-4 text-gray-600">Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pb-16">
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#E6007E"]}
          />
        }
        className="pt-2 px-0 pb-20"
      >
        <SalonImageCarousel
          home={true}
          images={[
            "https://content.jdmagicbox.com/v2/comp/rajkot/u1/0281px281.x281.180410200635.j6u1/catalogue/organika-skin-clinic-nana-mava-main-road-rajkot-dermatologists-gg8crcowad.jpg",
            "https://d2ki7eiqd260sq.cloudfront.net/95f1c11b8-09a7-4b60-a64d-84d80b1e2346.jpg"
          ]}
        />

        <View className="px-3">
          {/* Salon Categories Section */}


          {/* Nearby Salons Section */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-pink-600 text-lg font-bold">Salon Near You</Text>
              <TouchableOpacity onPress={() => router.push({
                pathname: '/(app)/salon',
                params: { type: "nearby" },
              })}>
                <Text className="text-pink-500 text-sm">View All</Text>
              </TouchableOpacity>
            </View>
            {/* <View className="flex-row justify-between items-center">
              <Text className="text-pink-600 text-md">Nearby Salon</Text>
              <Text className="bg-red-500 text-white px-2 py-1 rounded text-xs">Save up to 80%</Text>
            </View> */}

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
                      <View className="bg-gray-100 shadow-md rounded-lg my-2 mr-3 overflow-hidden" style={{ width: 140 }}>
                        <Image
                          source={{
                            uri: `${imageBaseUrl}/${item?.salonPhotos[0]}` ||
                              "https://images.pexels.com/photos/18186525/pexels-photo-18186525/free-photo-of-hair-cutting-in-salon-in-close-up-view.jpeg",
                          }}
                          className="h-28 rounded-lg w-full"
                        />
                        <View className="p-2">
                          <Text className="font-medium text-gray-800" numberOfLines={1}>
                            {item?.salonName}
                          </Text>
                          <View className="flex-row justify-between">
                            <View className="flex-row items-center mt-1">
                              <Ionicons name="star" size={14} color="#FFD700" />
                              <Text className="text-gray-600 ml-1 text-xs">4.5 ({item?.reviews?.length || 0})</Text>
                            </View>
                            <View className="flex-row items-center mt-1">
                              <Ionicons name="navigate-outline" size={12} color="#E6007E" />
                              <Text className="text-gray-500 text-xs ml-1">{(item.distance * 100).toFixed(2)} km</Text>
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

          {/* Most Reviewed Salons Section */}
          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-pink-600 text-lg font-bold">Most Reviewed Salons</Text>
              <TouchableOpacity onPress={() => router.push({
                pathname: '/(app)/salon',
                params: { type: "mostreview" },
              })}>
                <Text className="text-pink-500 text-sm">View All</Text>
              </TouchableOpacity>
            </View>
            {/* <View className="flex-row justify-between items-center">
              <Text className="text-pink-600 text-md">Top Rated</Text>
              <Text className="bg-red-500 text-white px-2 py-1 rounded text-xs">Save up to 80%</Text>
            </View> */}
            {
              mostReviewed?.length === 0 || !mostReviewed ? (
                <View className="flex-1 justify-center items-center p-4">
                  <Text className="text-center text-gray-600 text-lg">Service is unavailable in your area</Text>
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
                          pathname: '/(app)/salon/details',
                          params: { salon: JSON.stringify(item) },
                        })
                      }
                    >
                      <View className="bg-gray-100 shadow-md rounded-lg my-2 mr-3 overflow-hidden" style={{ width: 140 }}>
                        <Image
                          source={{
                            uri: `${imageBaseUrl}/${item?.salonPhotos[0]}` ||
                              "https://images.pexels.com/photos/18186525/pexels-photo-18186525/free-photo-of-hair-cutting-in-salon-in-close-up-view.jpeg",
                          }}
                          className="h-28 rounded-lg w-full"
                        />
                        <View className="p-2">
                          <Text className="font-medium text-gray-800" numberOfLines={1}>
                            {item?.salonName}
                          </Text>
                          <View className="flex-row justify-between">
                            <View className="flex-row items-center mt-1">
                              <Ionicons name="star" size={14} color="#FFD700" />
                              <Text className="text-gray-600 ml-1 text-xs">4.5 ({item?.reviews?.length || 0})</Text>
                            </View>
                            <View className="flex-row items-center mt-1">
                              <Ionicons name="navigate-outline" size={12} color="#E6007E" />
                              <Text className="text-gray-500 text-xs ml-1">{(item.distance * 100).toFixed(2)} km</Text>
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
          {/* Salon Services Section */}
          <View className="mt-8">
            {/* Women's Services */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-pink-600 text-lg font-bold">Women's Services</Text>
                <TouchableOpacity onPress={() => router.push("/women-services")}>
                  <Text className="text-pink-500 text-sm">View All</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[
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
                ]}
                renderItem={renderServiceCard}
              />
            </View>

            {/* Men's Services */}
            <View className="mb-8">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-pink-600 text-lg font-bold">Men's Services</Text>
                <TouchableOpacity onPress={() => router.push("/men-services")}>
                  <Text className="text-pink-500 text-sm">View All</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={[
                  { id: "m1", name: "Haircut", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Styling & trims" },
                  { id: "m2", name: "Beard Grooming", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Trim & shape" },
                  { id: "m3", name: "Shave", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Hot towel shave" },
                  { id: "m4", name: "Facial", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Men's skincare" },
                  { id: "m5", name: "Hair Color", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956", description: "Gray coverage" },
                  { id: "m6", name: "Head Massage", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874", description: "Relaxation" },
                  { id: "m7", name: "Waxing", image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35", description: "Chest/back" },
                  { id: "m8", name: "Manicure", image: "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73", description: "Hand care" },
                  { id: "m9", name: "Pedicure", image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef", description: "Foot care" },
                  { id: "m10", name: "Hair Treatment", image: "https://images.unsplash.com/photo-1583864697784-a0efc8379f70", description: "Dandruff/fall" },
                ]}
                renderItem={renderServiceCard}
              />
            </View>

            {/* Unisex Services */}
            <View>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-pink-600 text-lg font-bold">For Everyone</Text>
                <TouchableOpacity onPress={() => router.push("/all-services")}>
                  <Text className="text-pink-500 text-sm">View All</Text>
                </TouchableOpacity>
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
          </View>



          {/* Testimonials Section */}
          <View className="mt-8">
            <Text className="text-pink-600 text-lg font-bold mb-4">What Our Customers Say</Text>
            <FlatList
              horizontal
              data={testimonials}
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="bg-pink-100 rounded-lg shadow-lg p-4 mr-4 my-2" style={{ width: 280 }}>
                  <View className="flex-row items-center mb-3">
                    <Image
                      source={{ uri: item.avatar }}
                      className="h-10 w-10 rounded-full mr-3"
                    />
                    <View>
                      <Text className="font-bold text-gray-800">{item.name}</Text>
                      <View className="flex-row">
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
                  <Text className="text-gray-600 italic">"{item.comment}"</Text>
                </View>
              )}
            />
          </View>

          {/* FAQ Section */}
          {/* FAQ Section */}
          <View className="mt-8 mb-6 px-3">
            <Text className="text-pink-600 text-xl font-bold mb-4">Frequently Asked Questions</Text>

            {faqs.map((faq, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                className="bg-white rounded-xl p-5 mb-3 shadow-md"
                style={{
                  shadowColor: "#E6007E",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                  borderLeftWidth: 4,
                  borderLeftColor: "#E6007E"
                }}
              >
                <View className="flex-row items-start">
                  <Ionicons name="help-circle-outline" size={20} color="#E6007E" className="mr-2 mt-0.5" />
                  <View className="flex-1">
                    <Text className="font-bold text-gray-800 text-base mb-1">{faq.question}</Text>
                    <Text className="text-gray-600 text-sm">{faq.answer}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              className="mt-4 flex-row items-center justify-center bg-pink-50 py-3 rounded-lg"
              activeOpacity={0.7}
              onPress={() => router.push("/(app)/profile/helpCenter")}
            >
              <Text className="text-pink-600 font-medium mr-2">View all FAQs</Text>
              <Ionicons name="chevron-forward" size={18} color="#E6007E" />
            </TouchableOpacity>

            {/* App Logo at Bottom */}
            <View className="items-center mt-10 mb-6">
              <View className="flex-row items-center">
                <Image source={require('@/assets/img/logo.png')} className="w-20 h-20 mb-4" resizeMode="contain" />
              </View>
              <Text className="text-gray-400 text-xs mt-2">© {new Date().getFullYear()} SuStylo. All rights reserved.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}