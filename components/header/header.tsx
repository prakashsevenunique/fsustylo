// Header.js

import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { UserContext } from "@/hooks/userInfo";

const Header = () => {
    const router = useRouter();
    const { userInfo, city } = useContext(UserContext) as any;

    return (
        <View className="absolute top-0 left-0 right-0 bg-white shadow-lg px-4 py-4 z-10">
            <View className="flex-row justify-between items-center">
                {/* User Info and Location */}
                <TouchableOpacity onPress={() => router.push("/(app)/profile")}>
                    <View className="flex-row items-center">
                        <Ionicons name="location" size={25} color="#E6007E" />
                        <View className="flex-col">
                            <Text className="text-md font-bold ml-1">Hi , {userInfo?.name || "User"}</Text>
                            <Text style={{ fontSize: 10 }} className="text-gray-600 ml-1">{city && city}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.push("/(app)/notification")}>
                        <Ionicons name="notifications-outline" size={25} color="black" className="mr-4" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.push("/(app)/profile")}>
                        <Ionicons name="person-outline" size={25} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Header;
