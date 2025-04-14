import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput, ScrollView, RefreshControl, Alert } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';
import { imageBaseUrl } from '@/utils/helpingData';
import { Card, ActivityIndicator } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';

export default function SalonListScreen() {
    const [salonData, setSalonData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { location } = useContext(UserContext) as any;
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const { type } = useLocalSearchParams();

    const SkeletonLoader = () => (
        <View className='flex items-center justify-center py-32'>
            <ActivityIndicator animating={true} size="large" color="#E6007E" />
        </View>
    );

    const NoResultsFound = () => (
        <View className="flex-1 items-center justify-center py-20 px-10">
            <Ionicons name="cut" size={60} color="#E6007E" style={{ opacity: 0.5 }} />
            <Text className="text-xl font-bold text-gray-600 mt-4">No Salons Found</Text>
            <Text className="text-gray-500 text-center mt-2">
                {location.latitude ?
                    "We couldn't find any salons near your location. Try adjusting your search or check back later." :
                    "Please enable location services to find nearby salons."
                }
            </Text>
            <TouchableOpacity
                className="bg-pink-100 rounded-full px-6 py-3 mt-6"
                onPress={getNearbySalons}
            >
                <Text className="text-pink-600 font-medium">Try Again</Text>
            </TouchableOpacity>
        </View>
    );

    const getNearbySalons = async () => {
        setRefreshing(true);
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/api/salon/${type}`, {
                params: { ...location, maxDistance: 200 }
            });
            setSalonData(response.data?.salons || []);
        } catch (error) {
            setSalonData([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (location.latitude) {
            getNearbySalons();
        }
    }, [location.latitude, location.longitude]);

    const renderSalonItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white p-4 rounded-lg shadow-sm mb-3 mx-3"
            onPress={() => router.push({
                pathname: '/(app)/salon/details',
                params: { salon: JSON.stringify(item) },
            })}
        >
            <View className="flex-row">
                <Image
                    source={{ uri: item.salonPhotos[0] ? `${imageBaseUrl}/${item.salonPhotos[0]}` : 'https://via.placeholder.com/150', cache: 'force-cache' }}
                    className="w-32 min-h-32 max-h-44 rounded-l-lg"
                    defaultSource={require('@/assets/img/logo.png')}
                />
                <View className="flex-1 pl-2">
                    <Text className="font-bold text-lg">{item.salonName}</Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={14} color="#6B7280" />
                        <Text className="text-gray-500 text-xs ml-1">{item.salonAddress}</Text>
                    </View>

                    <View className="flex-row items-center mt-2">
                        <MaterialIcons name="star" size={16} color="#FFD700" />
                        <Text className="text-gray-700 ml-1 text-sm">
                            {item.averageRating?.toFixed(1) || 'New'} ({item.reviews.length || 0})
                        </Text>
                        <Text className="text-gray-500 text-sm mx-2">•</Text>
                        <Ionicons name="navigate-outline" size={14} color="#6B7280" />
                        <Text className="text-gray-500 text-xs ml-1">{item.distance?.toFixed(1) || 0} km</Text>
                    </View>

                    {item.minServicePrice && (
                        <Text className="text-pink-600 text-xs mt-2">
                            Starts from ₹{item.minServicePrice}
                        </Text>
                    )}

                    {item.facilities?.length > 0 && (
                        <View className="flex-row flex-wrap mt-1">
                            {item.facilities.slice(0, 3).map((facility, index) => (
                                <View key={index} className="bg-gray-100 px-2 py-1 rounded-full mr-2 mb-1">
                                    <Text className="text-gray-700 text-xs">{facility}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-4 flex-row items-center shadow-sm">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#E6007E" />
                </TouchableOpacity>
                <Text className="text-xl font-bold text-gray-900 ml-4">{type == "nearby" ? "Nearby" : "Most Reviewed"} Salons</Text>
            </View>

            {/* Search and Filters */}
            <View className="bg-white px-4 pt-3 pb-2 shadow-sm">
                <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-2 border border-gray-200">
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        placeholder="Search salons..."
                        placeholderTextColor="#9CA3AF"
                        className="ml-2 py-2 flex-1 text-gray-800"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => router.push('/salon/searchSalon')}
                    />
                    {searchQuery && (
                        <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Salon List */}
                {loading ? (
                    <SkeletonLoader />
                ) : salonData.length > 0 ? (
                    <FlatList
                        data={salonData}
                        renderItem={renderSalonItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={{ paddingVertical: 12 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={getNearbySalons}
                                colors={["#E6007E"]}
                                tintColor="#E6007E"
                            />
                        }
                    />
                ) : (
                    <NoResultsFound />
                )}
        </SafeAreaView>
    );
}