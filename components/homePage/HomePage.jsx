import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { UserContext } from "@/hooks/userInfo";
import axiosInstance from "@/utils/axiosInstance";
import { imageBaseUrl } from "@/utils/helpingData";
import Header from "../header/header";
import SalonImageCarousel from "./Carousel";

const categories = [
  { id: "1", name: "Dasho", image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D", distance: "240.26 Km" },
  { id: "2", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
  { id: "12", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
  { id: "22", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
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
      console.error('Error fetching nearby salons:', error);
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
      console.error('Error fetching nearby salons:', error);
    }
  };
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
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E6007E"]} />}
        className="pt-2 px-0 pb-20">
        <SalonImageCarousel home={true} images={["https://content.jdmagicbox.com/v2/comp/rajkot/u1/0281px281.x281.180410200635.j6u1/catalogue/organika-skin-clinic-nana-mava-main-road-rajkot-dermatologists-gg8crcowad.jpg", "https://d2ki7eiqd260sq.cloudfront.net/95f1c11b8-09a7-4b60-a64d-84d80b1e2346.jpg"]} />
        <View className="px-3">
          <View className="mt-2">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-pink-600 text-lg font-bold">Salon Near You</Text>
              <TouchableOpacity onPress={() => router.push("/salon")}><Text className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs">More</Text></TouchableOpacity>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-pink-600 text-md">Nearby Salon</Text>
              <Text className="bg-red-500 text-white px-2 py-1 rounded text-xs">Save up to 80%</Text>
            </View>

            <FlatList
              horizontal
              data={nearbySalon}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity key={item._id} onPress={() => router.push({
                  pathname: '/(app)/salon/details',
                  params: {
                    salon: JSON.stringify(item)
                  }
                })} >
                  <View className="bg-gray-200 p-0 rounded-lg my-2 mr-2" style={{ width: 108 }}>
                    <Image source={{ uri: `${imageBaseUrl}/${item?.salonPhotos[0]}` || "https://images.pexels.com/photos/18186525/pexels-photo-18186525/free-photo-of-hair-cutting-in-salon-in-close-up-view.jpeg" }} className="h-24 w-full rounded-lg" />
                    <Text className="text-center mt-1">{item?.salonName}</Text>
                    {item.rating && <Text className="text-center text-gray-600">⭐ 4.5</Text>}
                    <Text className="text-center text-gray-500 text-xs pb-1"><Ionicons name="navigate-outline" size={10} color="#E6007E" /> {(item.distance * 100).toFixed(2)} km</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>

          <View className="mt-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-pink-600 text-lg font-bold">Most Reviewed salons</Text>
              <Text className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs">More</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-pink-600 text-md">Most Popular</Text>
              <Text className="bg-red-500 text-white px-2 py-1 rounded text-xs">Save up to 80%</Text>
            </View>

            <FlatList
              horizontal
              data={mostReviewed}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity key={item._id} onPress={() => router.push({
                  pathname: '/(app)/salon/details',
                  params: {
                    salon: JSON.stringify(item)
                  }
                })}>
                  <View className="bg-gray-200 p-0 rounded-lg my-2 mr-2" style={{ width: 108 }}>
                    <Image source={{ uri: `${imageBaseUrl}/${item?.salonPhotos[0]}` || "https://images.pexels.com/photos/18186525/pexels-photo-18186525/free-photo-of-hair-cutting-in-salon-in-close-up-view.jpeg" }} className="h-24 w-full rounded-lg" />
                    <Text className="text-center mt-1">{item?.salonName}</Text>
                    {item.rating && <Text className="text-center text-gray-600">⭐ 4.5</Text>}
                    <Text className="text-center text-gray-500 text-xs pb-1"><Ionicons name="navigate-outline" size={10} color="#E6007E" /> {(item.distance || 0 * 100).toFixed(2)} km</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
