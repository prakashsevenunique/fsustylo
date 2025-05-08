import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { router, useLocalSearchParams } from "expo-router"
import { imageBaseUrl } from "@/utils/helpingData"
import { Ionicons } from "@expo/vector-icons"

// Su stylo Salon color palette - lighter shades
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
  success: "#4CAF50", // Keep the success color
  pending: "#FB8807", // Use accent color for pending status
  confirmed: "#4CAF50", // Keep the confirmed color
  cancelled: "#E53935", // Keep the cancelled color
}

const BookingDetailPage = () => {
  const insets = useSafeAreaInsets()
  const { bookings } = useLocalSearchParams() as any
  const booking = JSON.parse(bookings) as any

  // Format date to be more readable
  const formattedDate = new Date(booking.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <View className="flex-1" style={{ paddingTop: insets.top, backgroundColor: colors.background }}>
      <View
        style={{
          backgroundColor: colors.cardBg,
          padding: 16,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text className="ml-4 text-xl font-bold" style={{ color: colors.text }}>
              My Bookings
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-4" showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
        <View className="mt-1 mb-3">
          <View className="mt-2 mb-2 rounded-xl overflow-hidden h-48 bg-white shadow-md" style={{ elevation: 2 }}>
            {booking.salonId?.salonPhotos?.length > 0 ? (
              <Image
                source={{ uri: `${imageBaseUrl}/${booking?.salonId?.salonPhotos[0]}` }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text style={{ color: colors.textLight }}>No image available</Text>
              </View>
            )}
          </View>
          <View className="px-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold" style={{ color: colors.text }}>
                {booking?.salonId?.salonName?.toUpperCase()}
              </Text>

              {/* Icon to view salon details */}
              <TouchableOpacity
                onPress={() => router.push(`/salon/${booking?.salonId?._id}`)}
                style={{
                  borderWidth: 1,
                  borderColor: colors.divider,
                  borderRadius: 9999,
                  shadowColor: colors.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="information" size={24} color={colors.success} />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mt-1" style={{ color: colors.textLight }}>
              {booking?.salonId?.salonTitle}
            </Text>
            <Text className="text-gray-600" style={{ color: colors.textLight }}>
              {booking?.salonId?.salonAddress}
            </Text>
          </View>
        </View>

        {/* Booking Summary */}
        <View
          className="rounded-xl p-5 mb-3"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Booking Summary
          </Text>

          <View className="space-y-3 gap-y-2">
            <View className="flex-row justify-between">
              <Text style={{ color: colors.textLight }}>Booking ID</Text>
              <Text style={{ color: colors.text, fontWeight: "500" }}>{booking?._id}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ color: colors.textLight }}>Date</Text>
              <Text style={{ color: colors.text, fontWeight: "500" }}>{formattedDate}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ color: colors.textLight }}>Time Slot</Text>
              <Text style={{ color: colors.text, fontWeight: "500" }}>{booking?.timeSlot}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ color: colors.textLight }}>Seat Number</Text>
              <Text style={{ color: colors.text, fontWeight: "500" }}>{booking?.seatNumber}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ color: colors.textLight }}>Total Duration</Text>
              <Text style={{ color: colors.text, fontWeight: "500" }}>{booking?.totalDuration}</Text>
            </View>
          </View>
        </View>

        {/* Services */}
        <View
          className="rounded-xl p-5 mb-3"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Services
          </Text>

          <View className="space-y-4">
            {booking.services.map((service: any) => (
              <View
                key={service._id}
                className="border-b pb-4 last:border-0 last:pb-0"
                style={{ borderBottomColor: colors.divider }}
              >
                <View className="flex-row justify-between">
                  <Text style={{ color: colors.text, fontWeight: "500" }}>{service?.name}</Text>
                  <Text style={{ color: colors.text, fontWeight: "500" }}>₹{service?.price}</Text>
                </View>

                <View className="flex-row justify-between mt-1">
                  <Text className="text-sm" style={{ color: colors.textLight }}>
                    {service?.duration}
                  </Text>
                  {service?.discount > 0 && (
                    <Text className="text-sm" style={{ color: colors.success }}>
                      -{service?.discount}% discount
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Summary */}
        <View
          className="rounded-xl p-5 mb-3"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Payment Summary
          </Text>

          <View className="gap-y-2">
            <View className="flex-row justify-between">
              <Text style={{ color: colors.textLight }}>Subtotal</Text>
              <Text style={{ color: colors.text }}>
                ₹{booking?.services.reduce((sum, service) => sum + service.price, 0)}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text style={{ color: colors.textLight }}>Discounts</Text>
              <Text style={{ color: colors.success }}>
                -₹{booking?.services.reduce((sum, service) => sum + (service.price * service.discount) / 100, 0)}
              </Text>
            </View>

            <View className="border-t pt-3 mt-2" style={{ borderTopColor: colors.divider }}>
              <View className="flex-row justify-between">
                <Text style={{ color: colors.text, fontWeight: "600" }}>Total Amount</Text>
                <Text style={{ color: colors.text, fontWeight: "700" }}>₹{booking?.totalAmount}</Text>
              </View>
            </View>

            <View className="flex-row justify-between mt-4">
              <Text style={{ color: colors.textLight }}>Payment Status</Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 9999,
                  backgroundColor: booking.paymentStatus === "Pending" ? colors.accentLight : colors.tertiaryLight,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "500",
                    color: booking.paymentStatus === "Pending" ? colors.accent : colors.success,
                  }}
                >
                  {booking.paymentStatus}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Booking Status */}
        <View
          className="rounded-xl p-5 mb-20"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text className="text-lg font-semibold mb-4" style={{ color: colors.text }}>
            Booking Status
          </Text>

          <View className="flex-row items-center gap-x-2">
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor:
                  booking?.status === "Pending"
                    ? colors.pending
                    : booking.status === "Confirmed"
                      ? colors.confirmed
                      : colors.cancelled,
              }}
            />
            <Text style={{ color: colors.text, fontWeight: "500", textTransform: "capitalize" }}>
              {booking?.status?.toLowerCase()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default BookingDetailPage
