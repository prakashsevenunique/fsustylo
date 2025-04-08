import { View, Text, ScrollView, TextInput, TouchableOpacity, FlatList, Modal, Image, ActivityIndicator } from 'react-native';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import { imageBaseUrl } from '@/utils/helpingData';
import { StatusBar } from 'expo-status-bar';

// Mock API endpoint - replace with your actual API endpoint
const API_ENDPOINT = '/api/salon/mostreview';

const recentSearches = ["Hair salon", "Beauty parlour", "Nail art", "Spa center"];
const popularSearches = ["Salon near me", "Hair coloring", "Bridal makeup", "Men's haircut"];

const filterOptions = [
    {
        id: 'sort_by', name: 'Sort By', options: [
            { value: 'rating_desc', label: 'Rating: High to Low' },
            { value: 'rating_asc', label: 'Rating: Low to High' },
            { value: 'distance_asc', label: 'Distance: Nearest' },
            { value: 'price_desc', label: 'Price: High to Low' },
            { value: 'price_asc', label: 'Price: Low to High' }
        ]
    },
    {
        id: 'price_range', name: 'Price Range', options: [
            { value: '0-500', label: 'Under ₹500' },
            { value: '500-1000', label: '₹500 - ₹1000' },
            { value: '1000-2000', label: '₹1000 - ₹2000' },
            { value: '2000-', label: 'Above ₹2000' }
        ]
    },
    {
        id: 'gender', name: 'Gender', options: [
            { value: 'all', label: 'All' },
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' }
        ]
    },
];

export default function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        sort_by: null,
        price_range: null,
        gender: null,
    });
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Build query params from filters
    const buildQueryParams = () => {
        const params = new URLSearchParams();

        if (searchQuery) params.append('query', searchQuery);
        if (selectedFilters.sort_by) params.append('sort_by', selectedFilters.sort_by);
        if (selectedFilters.price_range) params.append('price_range', selectedFilters.price_range);
        if (selectedFilters.gender) params.append('gender', selectedFilters.gender);

        return params.toString();
    };

    // Fetch search results from API
    const fetchSearchResults = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const queryParams = buildQueryParams();
            const url = `${API_ENDPOINT}?${queryParams}`;

            const response = await axiosInstance.get(url);
            setSearchResults(response.data.salons);
        } catch (err) {
            setError(err.message);
            console.error('Search API error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery || Object.values(selectedFilters).some(f => f)) {
                fetchSearchResults();
            } else {
                setSearchResults([]);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedFilters]);

    const clearFilters = () => {
        setSelectedFilters({
            sort_by: null,
            price_range: null,
            gender: null,
        });
    };

    return (
        <View className="flex-1 bg-white">
            
            {/* Search Header */}
            <View className="flex-row items-center p-4 border-b border-gray-100">
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#E6007E" />
                </TouchableOpacity>
                <View className="flex-1 ml-4 flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
                    <FontAwesome name="search" size={18} color="gray" />
                    <TextInput
                        className="ml-2 flex-1 text-gray-800"
                        placeholder="Search for salons or services"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        autoFocus
                    />
                </View>
            </View>

            {/* Filters Bar */}
            <View className="px-4 py-2">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ height: 36, alignItems: 'center' }} // Fixed height container
                >
                    {/* Main Filters Button */}
                    <TouchableOpacity
                        className={`py-3 px-4 rounded-full mr-2 flex-row items-center justify-center ${Object.values(selectedFilters).some(f => f)
                            ? 'bg-pink-100 border border-pink-200'
                            : 'bg-gray-100'
                            }`}
                        onPress={() => setShowFilters(true)}
                    >
                        <MaterialIcons
                            name="filter-list"
                            size={16}
                            color={Object.values(selectedFilters).some(f => f) ? "#E6007E" : "#6B7280"}
                        />
                        <Text className={`ml-1 ${Object.values(selectedFilters).some(f => f)
                            ? 'text-pink-600 font-medium'
                            : 'text-gray-600'
                            }`}>
                            Filters
                            {Object.values(selectedFilters).filter(f => f).length > 0 &&
                                ` (${Object.values(selectedFilters).filter(f => f).length})`}
                        </Text>
                    </TouchableOpacity>

                    {/* Active Filter Chips */}
                    {Object.entries(selectedFilters)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => {
                            const filterLabel = filterOptions
                                .find(f => f.id === key)
                                ?.options.find(o => o.value === value)?.label || value;

                            return (
                                <View
                                    key={key}
                                    className="h-8 px-3 rounded-full bg-pink-100 border border-pink-200 mr-2 flex-row items-center"
                                >
                                    <Text className="text-pink-600 text-sm mr-1">{filterLabel}</Text>
                                    <TouchableOpacity
                                        onPress={() => setSelectedFilters(prev => ({
                                            ...prev,
                                            [key]: null
                                        }))}
                                    >
                                        <MaterialIcons name="close" size={14} color="#E6007E" />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                </ScrollView>
            </View>

            {/* Main Content */}
            {isLoading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#E6007E" />
                </View>
            ) : error ? (
                <View className="flex-1 items-center justify-center p-4">
                    <Text className="text-red-500 mb-2">Error loading results</Text>
                    <Text className="text-gray-500 text-center">{error}</Text>
                    <TouchableOpacity
                        className="mt-4 bg-pink-600 px-6 py-2 rounded-full"
                        onPress={fetchSearchResults}
                    >
                        <Text className="text-white">Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : searchQuery === '' && !Object.values(selectedFilters).some(f => f) ? (
                <ScrollView className="flex-1 p-4">
                    {/* Recent Searches */}
                    <View className="mb-6">
                        <Text className="text-lg font-bold mb-3">Recent Searches</Text>
                        <View className="flex-row flex-wrap">
                            {recentSearches.map((search, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
                                    onPress={() => setSearchQuery(search)}
                                >
                                    <Text className="text-gray-800">{search}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Popular Searches */}
                    <View>
                        <Text className="text-lg font-bold mb-3">Popular Searches</Text>
                        <View className="flex-row flex-wrap">
                            {popularSearches.map((search, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className="bg-gray-100 rounded-full px-4 py-2 mr-2 mb-2"
                                    onPress={() => setSearchQuery(search)}
                                >
                                    <Text className="text-gray-800">{search}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{ padding: 16 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            className="flex-row items-center py-4 border-b border-gray-100"
                            onPress={() => router.push({
                                pathname: '/(app)/salon/details',
                                params: { salon: JSON.stringify(item) }
                            })}
                        >
                            <Image
                                source={{ uri: `${imageBaseUrl}/${item?.salonPhotos[0]}` }}
                                className="w-28 h-28 rounded-lg"
                                defaultSource={require('@/assets/img/logo.png')}
                            />
                            <View className="ml-4 flex-1">
                                <Text className="font-bold text-lg">{item.salonName}</Text>
                                <Text className="">{item.salonTitle}</Text>
                                <Text className="">{item.salonAddress}</Text>

                                <View className="flex-row items-center mt-1">
                                    <FontAwesome name="map-marker" size={12} color="gray" />
                                    <Text className="text-gray-500 text-xs ml-1">{item.distance} km</Text>
                                    <FontAwesome name="star" size={12} color="gold" className="ml-2" />
                                    <Text className="text-gray-500 text-xs ml-1">{item.rating || 'New'}</Text>
                                </View>
                                <View className="flex-1 flex-row mt-1">
                                    {["All","Mens","Womens"].map((item)=>
                                    <TouchableOpacity
                                        className="bg-gray-100 rounded-full px-4 py-1 mr-2 mb-2"
                                        style={{ alignSelf: 'flex-start' }} // This will limit the button to fit its content
                                    >
                                        <Text className="text-gray-800">{item}</Text>
                                    </TouchableOpacity>
                                    )}
                                    
                                </View>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="gray" />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View className="items-center justify-center py-10">
                            <MaterialIcons name="search-off" size={40} color="#E6007E" />
                            <Text className="text-gray-500 mt-4">No salons found matching your search</Text>
                            <TouchableOpacity
                                className="mt-4 bg-pink-600 px-6 py-2 rounded-full"
                                onPress={clearFilters}
                            >
                                <Text className="text-white">Clear Filters</Text>
                            </TouchableOpacity>
                        </View>
                    }
                />
            )}

            {/* Filters Modal */}
            <Modal
                visible={showFilters}
                animationType="slide"
                transparent={false}
            >
                <View className="flex-1 bg-white p-4">
                    {/* Modal Header */}
                    <View className="flex-row justify-between items-center mb-6">
                        <TouchableOpacity onPress={() => setShowFilters(false)}>
                            <Ionicons name="arrow-back" size={24} color="#E6007E" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold">Filters</Text>
                        <TouchableOpacity onPress={clearFilters}>
                            <Text className="text-pink-600">Clear All</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Filter Options */}
                    <ScrollView>
                        {filterOptions.map(filter => (
                            <View key={filter.id} className="mb-6">
                                <Text className="font-bold text-lg mb-3">{filter.name}</Text>
                                <View className="flex-row flex-wrap">
                                    {filter.options.map((option, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className={`px-4 py-2 rounded-full mr-2 mb-2 ${selectedFilters[filter.id] === option.value ? 'bg-pink-100 border border-pink-500' : 'bg-gray-100'}`}
                                            onPress={() => setSelectedFilters(prev => ({
                                                ...prev,
                                                [filter.id]: prev[filter.id] === option.value ? null : option.value
                                            }))}
                                        >
                                            <Text className={selectedFilters[filter.id] === option.value ? 'text-pink-600' : 'text-gray-600'}>
                                                {option.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Apply Button */}
                    <TouchableOpacity
                        className="bg-pink-600 py-3 rounded-full items-center mt-4"
                        onPress={() => setShowFilters(false)}
                    >
                        <Text className="text-white font-bold">Apply Filters</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}