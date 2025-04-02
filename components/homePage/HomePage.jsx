import React from "react";
import { View, Text, FlatList, ScrollView, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const categories = [
  { id: "1", name: "Dasho", image: "https://plus.unsplash.com/premium_photo-1664474619075-644dd191935f?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW1hZ2V8ZW58MHx8MHx8fDA%3D", distance: "240.26 Km" },
  { id: "2", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
  { id: "12", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
  { id: "22", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", distance: "240.26 Km" },
];
const deals = [
  { id: "3", name: "Dasho", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", rating: 4.9, distance: "240.26 Km" },
  { id: "4", name: "Ozone Test Salon", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", rating: 4.6, distance: "6.7 Km" },
  { id: "43", name: "Ozone Test Salon", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", rating: 4.6, distance: "6.7 Km" },
  { id: "46", name: "Ozone Test Salon", image: "https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg", rating: 4.6, distance: "6.7 Km" }
]

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-white pb-16">
      {/* Fixed Header */}
      <View className="absolute top-0 left-0 right-0 bg-white shadow-md px-4 py-3 z-10">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="location" size={25} color="#E6007E" />
            <View className="flex-coloum items-center">
              <Text className="text-md font-bold ml-2">Hi, Prakash</Text>
              <Text style={{ fontSize: 10 }} className="text-gray-600 ml-1">New York, USA</Text>
            </View>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="notifications-outline" size={23} color="black" className="mr-4" />
            <TouchableOpacity onPress={() => router.push("/(app)/profile")}><Ionicons name="person-outline" size={25} color="black" /></TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Scrollable Content */}
      <ScrollView className="mt-14 px-3 pb-20">
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
              <TouchableOpacity key={item.id} onPress={()=>router.push(`/${item.id}`)}>
                <View className="bg-gray-200 p-0 rounded-lg my-2 mr-2" style={{ width: 108 }}>
                  <Image source={{ uri: item.image }} className="h-24 w-full rounded-lg" />
                  <Text className="text-center mt-1">{item.name}</Text>
                  {item.rating && <Text className="text-center text-gray-600">⭐ {item.rating}</Text>}
                  <Text className="text-center text-gray-500 text-xs pb-1"><Ionicons name="navigate-outline" size={10} color="#E6007E" /> {item.distance}</Text>
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
