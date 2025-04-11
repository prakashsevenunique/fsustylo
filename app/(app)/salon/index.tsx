import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, SafeAreaView, TextInput, ScrollView, RefreshControl, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
                params: { ...location }
            });
            setSalonData(response.data?.salons || []);
        } catch (error) {
            setSalonData([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        } f
    };

    useEffect(() => {
        if (location.latitude) {
            getNearbySalons();
        }
    }, [location.latitude, location.longitude]);

    const renderSalonItem = ({ item }: any) => (
        <TouchableOpacity
            onPress={() => router.push(`/salon/${item._id}`)}
            className="bg-white rounded-lg shadow-sm mb-3 mx-4 overflow-hidden"
            style={{
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            }}
        >
            <View className="flex-row h-32">
                <Image
                    source={{
                        uri: `${imageBaseUrl}/${item?.salonPhotos[0]}`,
                        cache: 'force-cache'
                    }}
                    className="w-32 h-full rounded-l-lg"
                    resizeMode="cover"
                    defaultSource={require('@/assets/img/logo.png')}
                />
                <View className="flex-1 p-3">
                    <View className="flex-row justify-between items-start">
                        <View className="flex-1">
                            <Text className="text-md font-bold text-gray-800" numberOfLines={1}>
                                {item?.salonName?.toUpperCase()}
                            </Text>
                            <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
                                {item?.salonTitle}
                            </Text>
                        </View>
                        {/* <TouchableOpacity onPress={() => null}>
                            <Ionicons
                                name={item?.isFavorite ? "heart" : "heart-outline"}
                                size={24}
                                color={item?.isFavorite ? "#E6007E" : "#9CA3AF"}
                            />
                        </TouchableOpacity> */}
                    </View>

                    <View className="flex-row items-center mt-2">
                        {/* <Ionicons name="star" size={16} color="#f59e0b" /> */}
                        {/* <Text className="text-amber-500 text-sm ml-1">{item?.reviews.length || 'New'}</Text> */}
                        {/* <Text className="text-gray-400 mx-2">•</Text> */}
                        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                        <Text className="text-gray-500 text-sm ml-1">
                            {((item.distance || 0) * 100).toFixed(1)} km
                        </Text>
                    </View>

                    <Text className="text-gray-500 text-xs mt-2" numberOfLines={1}>
                        {item?.salonAddress}
                    </Text>

                    {/* <View className="flex-row flex-wrap mt-2">
                        {item.services?.slice(0, 3).map((service: any, index: number) => (
                            <View 
                                key={`${item._id}-${index}`} 
                                className="bg-pink-50 rounded-full px-2 py-1 mr-1 mb-1"
                            >
                                <Text className="text-pink-600 text-xs">
                                    {service?.category || "Service"}
                                </Text>
                            </View>
                        ))}
                        {item.services?.length > 3 && (
                            <View className="bg-gray-100 rounded-full px-2 py-1">
                                <Text className="text-gray-600 text-xs">
                                    +{item.services.length - 3}
                                </Text>
                            </View>
                        )}
                    </View> */}
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
                <View className="flex-row items-center bg-white rounded-lg px-4 py-1 border border-gray-200">
                    <Ionicons name="search" size={18} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search salons..."
                        placeholderTextColor="#9CA3AF"
                        className="flex-1 ml-2 text-gray-800"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => router.push('/salon/searchSalon')}
                    />
                    {searchQuery && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
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