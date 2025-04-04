import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { UserContext } from "@/hooks/userInfo";
import axiosInstance from "@/utils/axiosInstance";
import { imageBaseUrl } from "@/utils/helpingData";

const categories = [
  { id: "1", name: "Dasho", image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D", distance: "240.26 Km" },
  { id: "2", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
  { id: "12", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
  { id: "22", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
];

export default function HomeScreen() {
  const { userInfo, city, location } = useContext(UserContext);
  const [nearbySalon, setNearbySalon] = useState([])
  const [mostReviewed, setMostReviewed] = useState([])


  const getNearbySalons = async () => {
    try {
      const response = await axiosInstance.get('/api/salon/nearby', {
        params: { ...location }
      });
      setNearbySalon(response.data?.salons)
    } catch (error) {
      console.error('Error fetching nearby salons:', error);
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

  return (
    <View className="flex-1 bg-white pb-16">
      {/* Fixed Header */}
      <View className="absolute top-0 left-0 right-0 bg-white shadow-lg px-4 py-4 z-10">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="location" size={28} color="#E6007E" />
            <View className="flex-coloum">
              <Text className="text-md font-bold ml-1">Hi,{userInfo?.name || "User"} </Text>
              <Text style={{ fontSize: 10 }} className="text-gray-600 ml-1">{city && city}</Text>
            </View>
          </View>
          <View className="flex-row items-center">

            <TouchableOpacity onPress={() => router.push("/(app)/profile")}><Ionicons name="notifications-outline" size={28} color="black" className="mr-4" /></TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(app)/profile")}><Ionicons name="person-outline" size={28} color="black" /></TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Scrollable Content */}

      <ScrollView className="mt-14 px-3 pb-20">
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-pink-600 text-lg font-bold">Salon Near You</Text>
            <TouchableOpacity onPress={() => router.push("/salonsList")}><Text className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs">More</Text></TouchableOpacity>
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
              <TouchableOpacity key={item._id} onPress={() => router.push(`/${item._id}`)}>
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
              <TouchableOpacity key={item._id} onPress={() => router.push(`/${item._id}`)}>
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

        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-pink-600 text-lg font-bold">Last Minute Deals</Text>
            <Text className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs">More</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-pink-600 text-md">At Salon</Text>
            <Text className="bg-red-500 text-white px-2 py-1 rounded text-xs">Save up to 80%</Text>
          </View>

          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-gray-200 p-0 rounded-lg my-2 mr-2" style={{ width: 108 }}>
                <Image source={{ uri: item.image }} className="h-24 w-full rounded-lg" />
                <Text className="text-center mt-1">{item.name}</Text>
                {item.rating && <Text className="text-center text-gray-600">⭐ {item.rating}</Text>}
                <Text className="text-center text-gray-500 text-xs pb-1"><Ionicons name="navigate-outline" size={10} color="#E6007E" /> {item.distance}</Text>
              </View>
            )}
          />
        </View>
        <View className="mt-6">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-pink-600 text-lg font-bold">Last Minute Deals</Text>
            <Text className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs">More</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-pink-600 text-md">At Salon</Text>
            <Text className="bg-red-500 text-white px-2 py-1 rounded text-xs">Save up to 80%</Text>
          </View>

          <FlatList
            horizontal
            data={categories}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View className="bg-gray-200 p-0 rounded-lg my-2 mr-2" style={{ width: 108 }}>
                <Image source={{ uri: item.image }} className="h-24 w-full rounded-lg" />
                <Text className="text-center mt-1">{item.name}</Text>
                {item.rating && <Text className="text-center text-gray-600">⭐ {item.rating}</Text>}
                <Text className="text-center text-gray-500 text-xs pb-1"><Ionicons name="navigate-outline" size={10} color="#E6007E" /> {item.distance}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </View>
  );
}
