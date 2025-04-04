import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator } from "react-native";
import { Modalize } from "react-native-modalize";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function AddressPicker() {
    const modalizeRef = useRef<Modalize>(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedAddress, setSelectedAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCurrentLocation();
    }, []);

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access location was denied.");
            setLoading(false);
            return;
        }
        let userLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = userLocation.coords;
        const locationData = { latitude, longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 };
        // setCurrentLocation(locationData);
        setSelectedLocation(locationData);
        fetchAddress(latitude, longitude);
        setLoading(false);
    };

    const fetchAddress = async (latitude:string, longitude:string) => {
        try {
            let result = await Location.reverseGeocodeAsync({ latitude, longitude });
            if (result.length > 0) {
                const address = `${result[0].name}, ${result[0].street}, ${result[0].city}, ${result[0].region}, ${result[0].country}`;
                setSelectedAddress(address);
            }
        } catch (error) {
            console.error("Error fetching address:", error);
            setSelectedAddress("Address not found");
        }
    };

    return (
        <View>
            <View className="bg-white px-4 py-4 z-10 shadow-md">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
                        <View className="flex-coloum items-center">
                            <Text className="text-lg font-bold ml-2">My Address</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="p-4">
                <View className="flex-row items-center border border-gray-300 px-3 rounded-lg mt-3">
                    <Ionicons name="search-outline" size={20} color="gray" />
                    <TextInput
                        className="ml-2 flex-1"
                        placeholder="Search city, place..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={() => null}
                    />
                </View>
                <TouchableOpacity
                    className="flex-row items-center p-3 mt-3 border-b border-gray-300"
                >
                    <Ionicons name="location" size={24} color="red" />
                    <View className="ml-3">
                        <Text className="font-semibold text-red-500">Current Location</Text>
                        <Text className="text-gray-500">
                            {selectedAddress || "Fetching address..."}
                        </Text>
                    </View>
                </TouchableOpacity>

                {selectedLocation && (
                    <TouchableOpacity
                    className="flex-row items-center p-3 mt-3 border-b border-gray-300"
                >
                    <Ionicons name="location" size={24} color="red" />
                    <View className="ml-3">
                        <Text className="font-semibold text-red-500">Selected Address</Text>
                        <Text className="text-gray-500">
                            {selectedAddress || "Fetching address..."}
                        </Text>
                    </View>
                </TouchableOpacity>
                )}
            </View>
        </View>
    );
}
