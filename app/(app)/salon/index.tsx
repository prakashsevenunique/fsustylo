"use client"

import { useContext, useEffect, useState } from "react"
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import axiosInstance from "@/utils/axiosInstance"
import { UserContext } from "@/hooks/userInfo"
import { imageBaseUrl } from "@/utils/helpingData"
import { router, useLocalSearchParams } from "expo-router"

// Su stylo Salon color palette
const colors = {
    primary: "#E65305", // Bright red-orange as primary
    primaryLight: "#FF7A3D", // Lighter version of primary
    primaryLighter: "#FFA273", // Even lighter version
    secondary: "#FBA059", // Light orange as secondary
    secondaryLight: "#FFC59F", // Lighter version of secondary
    accent: "#FB8807", // Bright orange as accent
    accentLight: "#FFAA4D", // Lighter version of accent
    tertiary: "#F4A36C", // Peach/salmon as tertiary
    tertiaryLight: "#FFD0B0", // Lighter version of tertiary
    background: "#FFF9F5", // Very light orange/peach background
    cardBg: "#FFFFFF", // White for cards
    text: "#3D2C24", // Dark brown for text
    textLight: "#7D6E66", // Lighter text color
    textLighter: "#A99E98", // Even lighter text
    divider: "#FFE8D6", // Very light divider color
}

export default function SalonListScreen() {
    const [salonData, setSalonData] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const { location } = useContext(UserContext) as any
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const { type } = useLocalSearchParams()

    const SkeletonLoader = () => (
        <View className="flex items-center justify-center py-32">
            <ActivityIndicator animating={true} size="large" color={colors.primary} />
        </View>
    )

    const NoResultsFound = () => (
        <View className="flex-1 items-center justify-center py-20 px-10">
            <Ionicons name="cut" size={60} color={colors.primary} style={{ opacity: 0.5 }} />
            <Text className="text-xl font-bold mt-4" style={{ color: colors.text }}>
                No Salons Found
            </Text>
            <Text className="text-center mt-2" style={{ color: colors.textLight }}>
                {location.latitude
                    ? "We couldn't find any salons near your location. Try adjusting your search or check back later."
                    : "Please enable location services to find nearby salons."}
            </Text>
            <TouchableOpacity
                className="rounded-full px-6 py-3 mt-6"
                style={{ backgroundColor: colors.tertiaryLight }}
                onPress={getNearbySalons}
            >
                <Text className="font-medium" style={{ color: colors.primary }}>
                    Try Again
                </Text>
            </TouchableOpacity>
        </View>
    )

    const getNearbySalons = async () => {
        setRefreshing(true)
        setLoading(true)
        try {
            const response = await axiosInstance.get(`/api/salon/${type}`, {
                params: { ...location, maxDistance: 200 },
            })
            setSalonData(response.data?.salons || [])
        } catch (error) {
            setSalonData([])
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => {
        if (location.latitude) {
            getNearbySalons()
        }
    }, [location.latitude, location.longitude])

    const renderSalonItem = ({ item }: any) => (
        <TouchableOpacity
            className="p-4 rounded-lg mb-3 mx-3"
            style={{
                backgroundColor: colors.cardBg,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 1,
            }}
            onPress={() =>
                router.push({
                    pathname: "/(app)/salon/details",
                    params: { salon: JSON.stringify(item) },
                })
            }
        >
            <View className="flex-row">
                <Image
                    source={{
                        uri: item.salonPhotos[0] ? `${imageBaseUrl}/${item.salonPhotos[0]}` : "https://via.placeholder.com/150",
                        cache: "force-cache",
                    }}
                    className="w-32 min-h-32 max-h-44 rounded-l-lg"
                    defaultSource={require("@/assets/img/logo.png")}
                />
                <View className="flex-1 pl-2">
                    <Text className="font-bold text-lg" style={{ color: colors.text }}>
                        {item.salonName}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <Ionicons name="location-outline" size={14} color={colors.textLight} />
                        <Text className="text-xs ml-1" style={{ color: colors.textLight }}>
                            {item.salonAddress}
                        </Text>
                    </View>

                    <View className="flex-row items-center mt-2">
                        <MaterialIcons name="star" size={16} color="#FFD700" />
                        <Text className="ml-1 text-sm" style={{ color: colors.text }}>
                            {item.averageRating?.toFixed(1) || "New"} ({item.reviews.length || 0})
                        </Text>
                        <Text className="text-sm mx-2" style={{ color: colors.textLight }}>

                        </Text>
                        {type === "nearby" && <> <Ionicons name="navigate-outline" size={14} color={colors.textLight} />
                            <Text className="text-xs ml-1" style={{ color: colors.textLight }}>
                                {item.distance?.toFixed(1) || 0} km
                            </Text> </>}
                    </View>

                    {item.minServicePrice && (
                        <Text className="text-xs mt-2" style={{ color: colors.primary }}>
                            Starts from ₹{item.minServicePrice}
                        </Text>
                    )}

                    {item.facilities?.length > 0 && (
                        <View className="flex-row flex-wrap mt-1">
                            {item.facilities.slice(0, 3).map((facility: any, index: any) => (
                                <View
                                    key={index}
                                    className="px-2 py-1 rounded-full mr-2 mb-1"
                                    style={{ backgroundColor: colors.tertiaryLight }}
                                >
                                    <Text className="text-xs" style={{ color: colors.text }}>
                                        {facility}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    )

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
            {/* Header */}
            <View
                className="px-4 py-4 flex-row items-center"
                style={{
                    backgroundColor: colors.cardBg,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                }}
            >
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={colors.primary} />
                </TouchableOpacity>
                <Text className="text-xl font-bold ml-4" style={{ color: colors.text }}>
                    {type == "nearby" ? "Nearby" : "Most Reviewed"} Salons
                </Text>
            </View>

            {/* Search and Filters */}
            <View
                className="px-4 pt-3 pb-2"
                style={{
                    backgroundColor: colors.cardBg,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 1,
                }}
            >
                <View
                    className="flex-row items-center rounded-lg px-4 py-2"
                    style={{
                        backgroundColor: colors.background,
                        borderWidth: 1,
                        borderColor: colors.divider,
                    }}
                >
                    <Ionicons name="search" size={20} color={colors.textLight} />
                    <TextInput
                        placeholder="Search salons..."
                        placeholderTextColor={colors.textLight}
                        className="ml-2 py-2 flex-1"
                        style={{ color: colors.text }}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onFocus={() => router.push("/salon/searchSalon")}
                    />
                    {searchQuery && (
                        <TouchableOpacity onPress={() => setSearchQuery("")} className="ml-2">
                            <Ionicons name="close-circle" size={18} color={colors.textLight} />
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
                    keyExtractor={(item: any) => item._id}
                    contentContainerStyle={{ paddingVertical: 12 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={getNearbySalons}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                />
            ) : (
                <NoResultsFound />
            )}
        </SafeAreaView>
    )
}
