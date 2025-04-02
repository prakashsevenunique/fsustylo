import { View, Text, Image, ScrollView, TextInput, TouchableOpacity,Animated } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react';

export default function AtSalon() {
  const [search, setSearch] = useState('');
  const [selectedGender, setSelectedGender] = useState('All');

  const scrollY = useRef(new Animated.Value(0)).current;

  const searchBarTranslateY = scrollY.interpolate({
    inputRange: [0, 80], // Adjust value as per requirement
    outputRange: [0, -80], // Moves up when scrolling down
    extrapolate: 'clamp',
  });

  return (
    <View className="flex-1 bg-white pb-14">
      
      <ScrollView className='relative'>
        <View className="bg-white px-4 py-3 z-10">
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="location" size={25} color="#E6007E" />
              <View className="flex-coloum items-center">
                <Text className="text-md font-bold ml-2">Hi, Prakash</Text>
                <Text style={{ fontSize: 10 }} className="text-gray-600 ml-1">New York, USA</Text>
              </View>
            </View>
            <View className="flex-row items-center">
            <Ionicons name="cart-outline" size={23} color="black" className="mr-4" />
              <Ionicons name="notifications-outline" size={23} color="black" className="mr-4" />
              <Ionicons name="person-outline" size={25} color="black" />
            </View>
          </View>
        </View>
        {/* Search Bar */}
        <View className="sticky top-0 left-0 right-0 mx-4 mt-3 z-20 bg-white">
          <View className="flex-row items-center bg-gray-100 rounded-md px-3 py-1">
            <FontAwesome name="search" size={18} color="gray" />
            <TextInput
              className="ml-2 flex-1 text-gray-800"
              placeholder="Search for the Style you want"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
        
        <View className="flex-row justify-between items-center mt-3 px-4">
          <Text className='text-md font-semibold'>Explore By Categories</Text>
          <View className='flex-row'>
            {['Male', 'Female'].map((gender) => (
              <TouchableOpacity
                key={gender}
                className={`px-3 py-1 rounded-full mx-1 ${selectedGender === gender ? 'bg-pink-500' : 'bg-gray-200'}`}
                onPress={() => setSelectedGender(gender)}
              >
                <Text className={`font-semibold ${selectedGender === gender ? 'text-white' : 'text-gray-700'}`}>{gender}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <ScrollView className="mt-2">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2 mx-3">
            {["Nail Art", "hhh", "Nail Art", "Bridal Packages", "Nail Art", "Bridal Packages", "Nail Art", "Bridal Packages"].map((category, index) => (
              <View key={index} className="items-center w-20 my-1">
                <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/036/324/708/small/ai-generated-picture-of-a-tiger-walking-in-the-forest-photo.jpg' }} className="w-16 shadow-md border border-4 border-gray-300 h-16 rounded-full" />
                <Text style={{ fontSize: 10 }} className="text-sm">{category.slice(0, 13)}</Text>
              </View>
            ))}
          </ScrollView>
          {/* Deals & Offers */}
          <View className="bg-[#fde8e4] p-5 w-full">
            <Text className="text-xl font-bold text-gray-800">Deals and <Text className="text-pink-500">Offers</Text></Text>
            <Text className="text-gray-500">Grab Near By Exciting Deals</Text>
            <View className="bg-white p-4 mt-4 rounded-lg shadow-md">
              <Text className="font-bold text-gray-800">Big Savings</Text>
              <Text className="text-gray-500">Plex (Short Hair Length)</Text>
              <Text className="text-green-600 text-lg font-semibold">₹48</Text>
              <TouchableOpacity className="bg-black px-5 py-2 rounded-full mt-2">
                <Text className="text-white font-semibold text-center">Buy Now</Text>
              </TouchableOpacity>
              <Text className="text-gray-600 mt-2">My Glam Studio Test</Text>
              <View className="flex-row items-center mt-1">
                <FontAwesome name="map-marker" size={14} color="gray" />
                <Text className="text-gray-500 ml-1">6.72 Km</Text>
                <FontAwesome name="star" size={14} color="gold" className="ml-2" />
                <Text className="text-gray-500 ml-1">4.2</Text>
              </View>
            </View>
          </View>
          <View className="p-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-800">Nearby Salons</Text>
              <Text className="text-pink-500 font-semibold">See all</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
              {[
                { name: 'Ozone Test Salon', distance: '6.7 Km', rating: '4.6', image: 'https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg' },
                { name: 'My Glam Studio Test', distance: '6.72 Km', rating: '4.2', image: 'https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg' },
                { name: 'Cinderella', distance: '6.72 Km', rating: '4.0', image: 'https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg' },
              ].map((salon, index) => (
                <View key={index} className="mr-3" style={{ width: 103 }}>
                  <Image source={{ uri: salon.image }} className="w-full h-24 rounded-lg" />
                  <Text className="text-sm text-gray-800 mt-2">{salon.name}</Text>
                  <View className="flex-row items-center text-sm">
                    <FontAwesome name="map-marker" size={12} color="gray" />
                    <Text className="text-gray-500 text-sm ml-1">{salon.distance}</Text>
                    <FontAwesome name="star" size={12} color="gold" className="ml-2" />
                    <Text className="text-gray-500 text-sm ml-1">{salon.rating}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
          <View className="p-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-800">Nearby Salons</Text>
              <Text className="text-pink-500 font-semibold">See all</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
              {[
                { name: 'Ozone Test Salon', distance: '6.7 Km', rating: '4.6', image: 'https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg' },
                { name: 'My Glam Studio Test', distance: '6.72 Km', rating: '4.2', image: 'https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg' },
                { name: 'Cinderella', distance: '6.72 Km', rating: '4.0', image: 'https://www.crushpixel.com/big-static7/preview4/take-photo-164370.jpg' },
              ].map((salon, index) => (
                <View key={index} className="mr-3" style={{ width: 103 }}>
                  <Image source={{ uri: salon.image }} className="w-full h-24 rounded-lg" />
                  <Text className="text-sm text-gray-800 mt-2">{salon.name}</Text>
                  <View className="flex-row items-center text-sm">
                    <FontAwesome name="map-marker" size={12} color="gray" />
                    <Text className="text-gray-500 text-sm ml-1">{salon.distance}</Text>
                    <FontAwesome name="star" size={12} color="gold" className="ml-2" />
                    <Text className="text-gray-500 text-sm ml-1">{salon.rating}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
}