import { View, Text, ScrollView, TouchableOpacity, Linking, Share } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Ionicons, FontAwesome } from "@expo/vector-icons"
// import MapView, { Marker } from 'react-native-maps';
import SalonImageCarousel from "@/components/homePage/Carousel"
import { router } from "expo-router"

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
  star: "#FFB443", // Orange-yellow for star ratings
  success: "#10B981", // Keep the success color for checkmarks
}

const SalonDetailScreen = () => {
  const { salon } = useLocalSearchParams() as any
  const parsedSalon = JSON.parse(salon)

  const socialLinks = parsedSalon.socialLinks || "{}"
  const facilities = parsedSalon.facilities || "[]"
  const openingHours = parsedSalon.openingHours || "{}"

  const formatOpeningHours = () => {
    return Object.entries(openingHours).map(([day, hours]) => (
      <View key={day} className="flex-row justify-between py-2 border-b" style={{ borderBottomColor: colors.divider }}>
        <Text className="font-medium capitalize" style={{ color: colors.text }}>
          {day}
        </Text>
        <Text style={{ color: colors.textLight }}>{hours}</Text>
      </View>
    ))
  }

  const shareSalonLocation = (latitude: number, longitude: number) => {
    const message = `Check out this salon's location: https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    Share.share({
      message,
      url: message,
    }).catch((err) => console.error("Failed to share location:", err))
  }

  // Function to render star ratings
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Ionicons key={i} name="star" size={16} color={colors.star} />)
      } else if (i === fullStars && halfStar) {
        stars.push(<Ionicons key={i} name="star-half" size={16} color={colors.star} />)
      } else {
        stars.push(<Ionicons key={i} name="star-outline" size={16} color={colors.star} />)
      }
    }

    return <View className="flex-row">{stars}</View>
  }

  // Navigate to reviews page
  const navigateToReviews = () => {
    router.push({
      pathname: "/(app)/salon/details/reviews",
      params: {
        salonId: parsedSalon._id,
        salonName: parsedSalon.salonName,
      },
    })
  }

  return (
    <>
      <View className="flex-row items-center py-4 px-4" style={{ backgroundColor: colors.cardBg }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-bold" style={{ color: colors.text }}>
          {parsedSalon.salonName.toUpperCase()}
        </Text>
      </View>
      <ScrollView className="flex-1 pt-3" style={{ backgroundColor: colors.cardBg }}>
        <SalonImageCarousel images={parsedSalon.salonPhotos} />

        <View className="px-6 py-4 pt-0">
          <Text className="text-2xl font-bold" style={{ color: colors.text }}>
            {parsedSalon.salonName}
          </Text>
          <Text className="mt-1" style={{ color: colors.textLight }}>
            {parsedSalon.salonTitle}
          </Text>

          <TouchableOpacity className="flex-row items-center mt-3" onPress={navigateToReviews}>
            <Ionicons name="star" size={16} color={colors.star} />
            <Text className="ml-1 text-sm" style={{ color: colors.text }}>
              {parsedSalon.averageRating?.toFixed(1) || "New"} ({parsedSalon.reviews?.length || 0})
            </Text>
            {parsedSalon.reviews?.length > 0 && (
              <Text className="ml-2 text-sm" style={{ color: colors.primary }}>
                See all reviews
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View
          className="flex-row justify-around py-3 border-t border-b"
          style={{ borderTopColor: colors.divider, borderBottomColor: colors.divider }}
        >
          <TouchableOpacity onPress={() => router.push(`/(app)/salon/${parsedSalon._id}`)} className="items-center">
            <Ionicons name="calendar" size={24} color={colors.primary} />
            <Text className="text-xs mt-1" style={{ color: colors.text }}>
              Book Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(parsedSalon.locationMapUrl)} className="items-center">
            <Ionicons name="navigate" size={24} color={colors.primary} />
            <Text className="text-xs mt-1" style={{ color: colors.text }}>
              Directions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="items-center"
            onPress={() => shareSalonLocation(parsedSalon.latitude, parsedSalon.longitude)}
          >
            <Ionicons name="share-social" size={24} color={colors.primary} />
            <Text className="text-xs mt-1" style={{ color: colors.text }}>
              Share
            </Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 py-4">
          <Text className="text-lg font-bold mb-2" style={{ color: colors.text }}>
            About Salon
          </Text>
          <Text style={{ color: colors.textLight }}>{parsedSalon.salonDescription}</Text>
        </View>

        {/* Location Map */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Location
          </Text>
          {/* <View className="h-48 rounded-xl overflow-hidden">
            <MapView
              style={{ flex: 1,pointerEvents: 'none' }}
              initialRegion={{
                latitude: parsedSalon.latitude,
                longitude: parsedSalon.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={false} 
              pitchEnabled={false} 
            >
              <Marker
                coordinate={{
                  latitude: parsedSalon.latitude,
                  longitude: parsedSalon.longitude,
                }}
                title={parsedSalon.salonName}
                description={parsedSalon.salonAddress}
              />
             
            </MapView>
          </View> */}
          <Text className="mt-2" style={{ color: colors.textLight }}>
            Address : {parsedSalon.salonAddress}
          </Text>
          <TouchableOpacity
            className="mt-2 flex-row items-center"
            onPress={() => Linking.openURL(parsedSalon.locationMapUrl)}
          >
            <Text style={{ color: colors.primary }}>View on Google Maps</Text>
            <Ionicons name="open-outline" size={16} color={colors.primary} className="ml-1" />
          </TouchableOpacity>
        </View>

        <View className="px-6 py-4" style={{ backgroundColor: colors.background }}>
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Opening Hours
          </Text>
          {formatOpeningHours()}
        </View>

        <View className="px-6 py-4">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Facilities
          </Text>
          <View className="flex-row flex-wrap">
            {facilities.map((facility: any, index: number) => (
              <View
                key={index}
                className="flex-row items-center rounded-full px-3 py-1 mr-2 mb-2"
                style={{ backgroundColor: colors.tertiaryLight }}
              >
                <Ionicons name="checkmark" size={14} color={colors.success} />
                <Text className="ml-1 text-sm" style={{ color: colors.text }}>
                  {facility}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Services */}
        <View className="px-6 py-4" style={{ backgroundColor: colors.background }}>
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Services
          </Text>
          {parsedSalon.services.map((service: any) => (
            <View
              key={service._id}
              className="rounded-lg p-4 mb-3"
              style={{
                backgroundColor: colors.cardBg,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 1,
              }}
            >
              <View className="flex-row justify-between">
                <View>
                  <Text className="font-bold capitalize" style={{ color: colors.text }}>
                    {service.title}
                  </Text>
                  <Text className="text-sm mt-1" style={{ color: colors.textLight }}>
                    <Ionicons name="time-outline" size={14} /> {service.duration}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-bold" style={{ color: colors.text }}>
                    ₹{service.rate}
                  </Text>
                  {service.discount > 0 && (
                    <View className="flex-row items-center">
                      <Text className="text-xs line-through mr-1" style={{ color: colors.textLight }}>
                        ₹{Math.round(service.rate + (service.rate * service.discount) / 100)}
                      </Text>
                      <Text className="text-xs" style={{ color: colors.primary }}>
                        {service.discount}% OFF
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Social Links */}
        <View className="px-6 py-4 mb-3">
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Connect With Us
          </Text>
          <View className="flex-row">
            {socialLinks.facebook && (
              <TouchableOpacity
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: "#1877F2" }} // Keep Facebook's brand color
                onPress={() => Linking.openURL(socialLinks.facebook)}
              >
                <FontAwesome name="facebook-f" size={16} color="white" />
              </TouchableOpacity>
            )}
            {socialLinks.instagram && (
              <TouchableOpacity
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: colors.primary }} // Use our primary color for Instagram
                onPress={() => Linking.openURL(socialLinks.instagram)}
              >
                <FontAwesome name="instagram" size={16} color="white" />
              </TouchableOpacity>
            )}
            {socialLinks.twitter && (
              <TouchableOpacity
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: "#1DA1F2" }} // Keep Twitter's brand color
                onPress={() => Linking.openURL(socialLinks.twitter)}
              >
                <FontAwesome name="twitter" size={16} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* <SalonReviewsScreen/> */}
      </ScrollView>
    </>
  )
}

export default SalonDetailScreen
