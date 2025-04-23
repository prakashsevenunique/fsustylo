import React, { useRef, useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator, Keyboard, Dimensions } from "react-native";
import * as Location from "expo-location";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { UserContext } from "@/hooks/userInfo";

export default function AddressPicker() {
    const [selectedAddress, setSelectedAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [inputLayout, setInputLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
    const { location, setlocation } = useContext(UserContext) as any;
    const searchTimeoutRef = useRef(null);
    const inputRef = useRef(null);
    const searchContainerRef = useRef(null);
    const screenHeight = Dimensions.get('window').height;

    useEffect(() => {
        fetchCurrentAddress();
    }, []);

    const fetchCurrentAddress = async () => {
        try {
            let result = await Location.reverseGeocodeAsync(location);
            if (result.length > 0) {
                const address = `${result[0].name}, ${result[0].street}, ${result[0].city}, ${result[0].region}, ${result[0].country}`;
                setSelectedAddress(address);
            }
        } catch (error) {
            setSelectedAddress("Address not found");
        }
    };

    const handleSearch = async (query) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);

        try {
            const apiKey = "AIzaSyCklkVV3ho7yawqRP-imgtd1OtfbrH_akU";
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
                    query
                )}&key=${apiKey}&components=country:in`
            );
            const data = await response.json();

            if (data.predictions) {
                setSearchResults(data.predictions);
            }
        } catch (error) {
            console.error("Error searching address:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleAddressSelect = async (placeId) => {
        try {
            const apiKey = "AIzaSyCklkVV3ho7yawqRP-imgtd1OtfbrH_akU";
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${apiKey}`
            );
            const data = await response.json();

            if (data.result) {
                const { lat, lng } = data.result.geometry.location;
                const address = data.result.formatted_address;
                setSearchQuery("");
                setSelectedAddress(address);
                setSearchResults([]);

                const newLocation = {
                    latitude: lat,
                    longitude: lng
                };

                setSelectedLocation(newLocation);
                setlocation(newLocation);
                Keyboard.dismiss();
            }
        } catch (error) {
            console.error("Error fetching place details:", error.response);
        }
    };

    const debouncedSearch = (query) => {
        setSearchQuery(query);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            handleSearch(query);
        }, 300);
    };

    const measureInputPosition = () => {
        if (searchContainerRef.current) {
            searchContainerRef.current.measure((x, y, width, height, pageX, pageY) => {
                setInputLayout({ x: pageX, y: pageY, width, height });
            });
        }
    };

    return (
        <View className="flex-1 bg-gray-100">
            {/* Header */}
            <View className="bg-white px-4 py-4 shadow-md">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center"
                        >
                            <Ionicons name="arrow-back" size={22} color="#E6007E" />
                        </TouchableOpacity>
                        <Text className="text-lg font-bold ml-3 text-gray-800">My Address</Text>
                    </View>
                </View>
            </View>

            <View className="p-4">
                <View
                    ref={searchContainerRef}
                    onLayout={measureInputPosition}
                    className="relative z-50"
                >
                    <View className="flex-row items-center border border-gray-300 px-3 rounded-lg bg-white shadow-sm">
                        <Ionicons name="search-outline" size={20} color="gray" />
                        <TextInput
                            ref={inputRef}
                            className="ml-2 flex-1 py-3.5 text-gray-800"
                            placeholder="Search city, place..."
                            value={searchQuery}
                            onChangeText={debouncedSearch}
                            onSubmitEditing={() => handleSearch(searchQuery)}
                            onFocus={measureInputPosition}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => {
                                setSearchQuery('');
                                setSearchResults([]);
                            }}>
                                <Ionicons name="close-circle" size={20} color="gray" />
                            </TouchableOpacity>
                        )}
                        {isSearching && <ActivityIndicator size="small" color="#E6007E" className="ml-2" />}
                    </View>
                    {searchResults.length > 0 && (
                        <View
                            className="absolute left-0 right-0 bg-white rounded-lg shadow-lg border border-gray-200 mt-1"
                            style={{
                                top: '100%',
                                maxHeight: Math.min(700, screenHeight - inputLayout.y - inputLayout.height - 150),
                                zIndex: 1000,
                            }}
                        >
                            <ScrollView
                                showsVerticalScrollIndicator={true}
                                scrollEnabled={true}
                            >
                                {searchResults.map((item) => (
                                    <TouchableOpacity
                                        key={item.place_id}
                                        className="p-4 border-b border-gray-100 flex-row items-start"
                                        onPress={() => handleAddressSelect(item.place_id)}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons name="location-outline" size={20} color="#E6007E" className="mt-1" />
                                        <View className="ml-2 flex-1">
                                            <Text className="font-medium text-gray-800">{item.structured_formatting.main_text}</Text>
                                            <Text className="text-gray-500 text-sm mt-0.5">
                                                {item.structured_formatting.secondary_text}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                </View>

                {/* Current Location Card */}
                <TouchableOpacity
                    className="flex-row items-center p-4 bg-white mt-4 rounded-lg shadow-sm"
                >
                    <View className="w-10 h-10 rounded-full bg-red-100 items-center justify-center">
                        <Ionicons name="location" size={20} color="#E6007E" />
                    </View>
                    <View className="ml-3 flex-1">
                        <Text className="font-semibold text-gray-800">Current Location</Text>
                        <Text className="text-gray-500 mt-1" numberOfLines={2}>
                            {selectedAddress || "Fetching address..."}
                        </Text>
                    </View>
                </TouchableOpacity>

                {/* Saved Addresses Section */}
                {/* <View className="mt-6">
                    <Text className="font-bold text-gray-700 mb-3 px-1">Saved Addresses</Text>
                    
                    <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-lg shadow-sm mb-3">
                        <View className="w-10 h-10 rounded-full bg-blue-100 items-center justify-center">
                            <Ionicons name="home-outline" size={20} color="#3B82F6" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="font-semibold text-gray-800">Home</Text>
                            <Text className="text-gray-500 mt-1" numberOfLines={2}>
                                Add your home address
                            </Text>
                        </View>
                        <Ionicons name="add-circle-outline" size={24} color="#E6007E" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity className="flex-row items-center p-4 bg-white rounded-lg shadow-sm">
                        <View className="w-10 h-10 rounded-full bg-purple-100 items-center justify-center">
                            <Ionicons name="briefcase-outline" size={20} color="#8B5CF6" />
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="font-semibold text-gray-800">Work</Text>
                            <Text className="text-gray-500 mt-1" numberOfLines={2}>
                                Add your work address
                            </Text>
                        </View>
                        <Ionicons name="add-circle-outline" size={24} color="#E6007E" />
                    </TouchableOpacity>
                </View> */}

                {/* Selected Location Card */}
                {selectedLocation && (
                    <View className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                        <View className="flex-row items-center mb-2">
                            <MaterialIcons name="location-pin" size={20} color="#E6007E" />
                            <Text className="font-bold text-gray-800 ml-1">Selected Location</Text>
                        </View>
                        <Text className="text-gray-700 mt-1">{selectedAddress}</Text>
                        {/* <View className="flex-row mt-3 bg-gray-50 p-2 rounded-lg">
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500">LATITUDE</Text>
                                <Text className="text-gray-700 font-medium">
                                    {selectedLocation.latitude.toFixed(6)}
                                </Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500">LONGITUDE</Text>
                                <Text className="text-gray-700 font-medium">
                                    {selectedLocation.longitude.toFixed(6)}
                                </Text>
                            </View>
                        </View> */}
                        {/* <TouchableOpacity className="mt-3 bg-pink-600 py-3 rounded-lg items-center">
                            <Text className="text-white font-semibold">Use This Location</Text>
                        </TouchableOpacity> */}
                    </View>
                )}
            </View>
        </View>
    );
}