"use client"

import { View, Text, ScrollView, TouchableOpacity } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons, MaterialIcons, FontAwesome } from "@expo/vector-icons"
import { useState } from "react"

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
  success: "#4CAF50", // Green for success
}

const BookingConfirmation = () => {
  const { salonId, salonName, services, date, time, total, discount = 0, bookingId } = useLocalSearchParams()

  const [isFavorite, setIsFavorite] = useState(false)
  const bookingDate = new Date(date)

  // Parse services if they're passed as string
  const parsedServices = typeof services === "string" ? JSON.parse(services) : services

  const handleAddToCalendar = () => {
    alert("Added to calendar!")
  }

  const handleShareBooking = () => {
    alert("Booking shared!")
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View
        className="p-4 h-44 items-center justify-center"
        style={{
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View className="flex-row justify-center items-center">
          <MaterialIcons name="check-circle" size={32} color="white" />
          <Text className="ml-2 text-white text-xl font-bold">Booking Confirmed</Text>
        </View>
        <Text className="text-white text-center mt-2">Your appointment is scheduled successfully</Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-6">
        {/* Salon Card */}
        <View
          className="rounded-xl p-4 mb-6"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <View className="flex-row justify-between items-start">
            <View className="flex-1">
              <Text className="text-xl font-bold" style={{ color: colors.text }}>
                {salonName}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text className="ml-1" style={{ color: colors.textLight }}>
                  4.5 (312 reviews)
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={toggleFavorite}>
              <Ionicons
                name={isFavorite ? "heart" : "heart-outline"}
                size={24}
                color={isFavorite ? colors.primary : colors.textLighter}
              />
            </TouchableOpacity>
          </View>

          <View className="mt-4 flex-row items-center">
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text className="ml-2" style={{ color: colors.text }}>
              {bookingDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          <View className="mt-2 flex-row items-center">
            <Ionicons name="time" size={20} color={colors.primary} />
            <Text className="ml-2" style={{ color: colors.text }}>
              {time}
            </Text>
          </View>

          <View className="mt-4 border-t pt-3" style={{ borderTopColor: colors.divider }}>
            <Text className="font-semibold" style={{ color: colors.textLight }}>
              Booking ID
            </Text>
            <Text className="font-mono mt-1" style={{ color: colors.text }}>
              {bookingId}
            </Text>
          </View>
        </View>

        {/* Services Summary */}
        <View
          className="rounded-xl p-4 mb-6"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Services Booked
          </Text>
          {parsedServices.map((service, index) => (
            <View
              key={index}
              className="flex-row justify-between py-2 border-b"
              style={{ borderBottomColor: colors.divider }}
            >
              <View>
                <Text style={{ color: colors.text }}>{service.name}</Text>
                <Text className="text-sm" style={{ color: colors.textLight }}>
                  {service.quantity ? `×${service.quantity}` : ""} • {service.duration}
                </Text>
              </View>
              <Text className="font-bold" style={{ color: colors.text }}>
                ₹{service.price * (service.quantity || 1)}
              </Text>
            </View>
          ))}

          {/* Payment Summary */}
          <View className="mt-4 pt-3 border-t" style={{ borderTopColor: colors.divider }}>
            {discount > 0 && (
              <View className="flex-row justify-between mb-1">
                <Text style={{ color: colors.textLight }}>Discount ({discount}%)</Text>
                <Text style={{ color: colors.success }}>
                  -₹{(Number.parseFloat(total) * (Number.parseFloat(discount) / 100)).toFixed(2)}
                </Text>
              </View>
            )}
            <View className="flex-row justify-between mt-2">
              <Text className="font-bold" style={{ color: colors.text }}>
                Total Paid
              </Text>
              <Text className="font-bold text-lg" style={{ color: colors.text }}>
                ₹{total}
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Actions */}
        <View
          className="rounded-xl p-4 mb-6"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Booking Actions
          </Text>
          {/*           
          <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={handleAddToCalendar}
          >
            <MaterialIcons name="event" size={24} color="#E6007E" />
            <Text className="ml-3 flex-1">Add to Calendar</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity> */}

          {/* <TouchableOpacity 
            className="flex-row items-center py-3 border-b border-gray-100"
            onPress={handleShareBooking}
          >
            <Ionicons name="share-social" size={24} color="#E6007E" />
            <Text className="ml-3 flex-1">Share Booking</Text>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity> */}

          <TouchableOpacity className="flex-row items-center py-3" onPress={() => router.replace(`/salon/${salonId}`)}>
            <FontAwesome name="home" size={24} color={colors.primary} />
            <Text className="ml-3 flex-1" style={{ color: colors.text }}>
              View Salon
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textLighter} />
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View
          className="rounded-xl p-4 mb-6"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Text className="text-lg font-bold mb-3" style={{ color: colors.text }}>
            Need Help?
          </Text>
          <Text className="mb-3" style={{ color: colors.textLight }}>
            Your booking details have been sent to your email and phone number.
          </Text>

          <View className="flex-row">
            <TouchableOpacity
              onPress={() => router.push("/(app)/profile/raiseTicket")}
              className="flex-1 py-2 px-4 rounded-lg mr-2"
              style={{ backgroundColor: colors.tertiaryLight }}
            >
              <Text className="text-center" style={{ color: colors.primary }}>
                Contact Support
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity className="flex-1 bg-gray-100 py-2 px-4 rounded-lg">
              <Text className="text-primary text-center">View Receipt</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>

      {/* Footer Buttons */}
      <View
        className="p-4 border-t"
        style={{
          backgroundColor: colors.cardBg,
          borderTopColor: colors.divider,
        }}
      >
        <TouchableOpacity
          className="py-3 rounded-lg items-center mb-3"
          style={{
            backgroundColor: colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
          onPress={() => router.push("/(app)/(tabs)/bookings")}
        >
          <Text className="text-white font-bold">View My Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="py-3 rounded-lg items-center border"
          style={{
            backgroundColor: colors.cardBg,
            borderColor: colors.primary,
          }}
          onPress={() => router.replace("/")}
        >
          <Text className="font-bold" style={{ color: colors.primary }}>
            Back to Home
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default BookingConfirmation
