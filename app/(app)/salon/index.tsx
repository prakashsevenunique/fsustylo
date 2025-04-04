import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';
import { imageBaseUrl } from '@/utils/helpingData';
import { Card, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';


export default function SalonListScreen() {
    const [salonData, setSalonData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { location } = useContext(UserContext) as any;
    const [loading, setLoading] = useState(false);

    const SkeletonLoader = () => (
        <View className='flex items-center justify-center py-32'>
            <ActivityIndicator animating={true} size="large" />
        </View>
    );

    const getNearbySalons = async () => {
        setLoading(true)
        try {
            const response = await axiosInstance.get('/api/salon/nearby', {
                params: { ...location }
            });
            setSalonData(response.data?.salons)
        } catch (error) {
            console.error('Error fetching nearby salons:', error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (location.latitude) {
            getNearbySalons()
        }
    }, [location.latitude, location.longitude])


    const renderSalonItem = ({ item }: any) => (
        <TouchableOpacity onPress={() => router.push(`/salon/${item._id}`)}
            className="bg-white rounded-lg shadow-md mb-2 mx-4 overflow-hidden"
        >
            <View className="flex-row">
                <Image
                    source={{ uri: `${imageBaseUrl}/${item?.salonPhotos[0]}` }}
                    className="w-32 h-full rounded-l-lg"
                    resizeMode="cover"
                />
                <View className="flex-1 p-3">
                    <View className="flex-row justify-between items-start">
                        <View>
                            <Text className="text-md font-bold text-gray-800">{item?.salonName}</Text>
                            <Text style={{ fontSize: 12 }} className="text-gray-800">{item?.salonTitle}</Text>
                        </View>
                        <TouchableOpacity onPress={() => null}>
                            <Ionicons
                                name={item?.isFavorite ? "heart" : "heart-outline"}
                                size={24}
                                color={item?.isFavorite ? "red" : "gray"}
                            />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row items-center mt-1">
                        <Ionicons name="star" size={16} color="#f59e0b" />
                        <Text className="text-amber-500 ml-1">{item?.rating || 5}</Text>
                        <Text className="text-gray-500 ml-2">•</Text>
                        <Text className="text-gray-500 ml-2">{(item.distance || 0 * 100).toFixed(2)} km</Text>
                    </View>

                    <Text className="text-gray-600 mt-1 text-sm">{item?.salonAddress}</Text>

                    <View className="flex-row flex-wrap mt-2">
                        {item.services.slice(0, 3).map((service: any, index: Number) => (
                            <View key={index} className="bg-pink-100 rounded-full px-2 py-1 mr-2 mb-1">
                                <Text className="text-pink-600 text-xs">{service?.category || "non"}</Text>
                            </View>
                        ))}
                        {item.services?.length > 3 && (
                            <View className="bg-gray-100 rounded-full px-2 py-1">
                                <Text className="text-gray-600 text-xs">+{item.services?.length - 3}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <View className="bg-white px-4 py-3 flex-row items-center shadow-sm gap-2">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#E6007E" />
                </TouchableOpacity>
                <Text className="text-2xl font-bold text-gray-900">Nearby Salons</Text>
            </View>

            {/* Search Bar */}
            <View className="px-4 py-3 bg-white">
                <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-1">
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        placeholder="Search salons..."
                        className="flex-1 ml-2 text-gray-700"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Filter Options */}
            <View className="flex-row px-4 py-2 bg-white">
                <TouchableOpacity className="bg-pink-100 rounded-full px-3 py-1 mr-2">
                    <Text className="text-pink-600 text-sm">All</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 rounded-full px-3 py-1 mr-2">
                    <Text className="text-gray-600 text-sm">Hair</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 rounded-full px-3 py-1 mr-2">
                    <Text className="text-gray-600 text-sm">Nails</Text>
                </TouchableOpacity>
                <TouchableOpacity className="bg-gray-100 rounded-full px-3 py-1">
                    <Text className="text-gray-600 text-sm">Spa</Text>
                </TouchableOpacity>
            </View>
            {loading ?
                <SkeletonLoader /> :
                <FlatList
                    data={salonData}
                    renderItem={renderSalonItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={{ paddingVertical: 8 }}
                    showsVerticalScrollIndicator={false}
                />}
        </SafeAreaView>
    );
}