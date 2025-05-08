import { useState, useEffect, useContext } from "react"
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import axiosInstance from "@/utils/axiosInstance"
import { UserContext } from "@/hooks/userInfo"

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
  error: "#E53935", // Red for error
}

const CheckoutScreen = () => {
  const { salon, services } = useLocalSearchParams()
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [discount, setDiscount] = useState(0)
  const [dates, setDates] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [salonDetail, setSalon] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loading1, setLoading1] = useState(false)
  const [error, setError] = useState(null)
  const [selectedSeat, setSelectedSeat] = useState(null)
  const { userInfo, fetchUserInfo } = useContext(UserContext) as any
  const [totalAmount, setTotal] = useState(0)

  useEffect(() => {
    if (services) {
      setSelectedServices(JSON.parse(services))
      setSalon(JSON.parse(salon))
    }
    const today = new Date()
    const dateArray = []

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dateArray.push({
        date,
        day: date.getDate(),
        month: date.toLocaleString("default", { month: "short" }),
        weekday: date.toLocaleString("default", { weekday: "short" }),
        isToday: i === 0,
        isWeekend: [0, 6].includes(date.getDay()),
      })
    }
    setDates(dateArray)
  }, [])

  const calculateSubtotal = () => {
    return selectedServices.reduce((sum, service) => sum + service.price * (service.quantity || 1), 0)
  }

  useEffect(() => {
    const subtotal = calculateSubtotal()
    const total = subtotal - subtotal * discount
    setTotal(total)
  }, [discount, selectedServices])

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Required", "Please select date and time")
      return
    }
    if (!selectedSeat) {
      Alert.alert("Required", "Please select seat")
      return
    }
    const formattedDate = selectedDate.date.toISOString().slice(0, 10)
    const data = {
      salonId: salonDetail?._id,
      userId: userInfo?._id,
      seatNumber: selectedSeat,
      services: selectedServices,
      date: formattedDate,
      timeSlot: selectedTime,
      total: totalAmount,
      discount: discount * 100,
    }
    createBooking(data)
  }

  const createBooking = async (bookingData) => {
    setLoading1(true)
    try {
      const response = await axiosInstance.post("/api/booking/create", bookingData)
      if (response.status === 201) {
        router.replace({
          pathname: "/salon/booking-confirmation",
          params: {
            salonId: salonDetail?._id,
            salonName: salonDetail?.salonName,
            services: JSON.stringify(selectedServices),
            date: selectedDate.date.toISOString(),
            time: selectedTime,
            total: totalAmount,
            discount: discount * 100,
            bookingId: response.data?.bookingId,
          },
        })
        fetchUserInfo()
      }
    } catch (error) {
      Alert.alert("Error:", error.message)
    } finally {
      setLoading1(false)
    }
  }

  async function getSchedule(salonId, date) {
    setLoading(true)
    setError(null)
    const formattedDate = date.date.toISOString().slice(0, 10)
    const url = `/api/schedule/schedule-get?salonId=${salonId}&date=${formattedDate}`
    try {
      const response = await axiosInstance.get(url)
      const transformedSlots = Object.entries(response.data.availableSlots).map(([time, seats]) => {
        const availableSeats = seats.filter((seat) => seat)
        return {
          time,
          seats: availableSeats,
        }
      })
      setTimeSlots(transformedSlots)
    } catch (err) {
      setError("No schedule found")
      if (err.response) {
        console.log(`Error: Received status code ${err.response.status}`)
      } else {
        console.log(`Error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <View
        className="flex-row items-center py-4 px-4"
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
        <Text className="ml-4 text-xl font-bold" style={{ color: colors.text }}>
          Checkout
        </Text>
      </View>
      <ScrollView className="flex-1 p-3">
        <View
          className="rounded-lg p-4 mb-2"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Text className="font-bold text-lg mb-1" style={{ color: colors.text }}>
            {salonDetail?.salonName}
          </Text>
          <Text className="text-sm mb-1" style={{ color: colors.textLight }}>
            {salonDetail?.salonTitle}
          </Text>
          {/* <View className="flex-row text-sm items-center">
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text className="ml-1" style={{ color: colors.text }}>
            {salonDetail.reviews?.length || 0} reviews
            </Text>
          </View> */}
        </View>

        {/* Selected Services */}
        <View
          className="rounded-lg p-4 mb-2"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Text className="font-bold text-lg mb-3" style={{ color: colors.text }}>
            Your Services
          </Text>
          {selectedServices.map((service, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center py-2 border-b"
              style={{ borderBottomColor: colors.divider }}
            >
              <View>
                <Text className="font-bold" style={{ color: colors.text }}>
                  {service.name}
                </Text>
                <Text className="text-sm" style={{ color: colors.textLight }}>
                  {service.duration} • Qty: {service.quantity || 1}
                </Text>
              </View>
              <View className="items-end">
                <Text className="font-bold" style={{ color: colors.text }}>
                  ₹{service.price}
                </Text>
                {service.discount > 0 && (
                  <View className="flex-row items-center">
                    <Text className="text-xs line-through mr-1" style={{ color: colors.textLight }}>
                      ₹{service.originalPrice}
                    </Text>
                    <Text className="text-xs" style={{ color: colors.primary }}>
                      {service.discount}%
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Date Selection */}
        <View
          className="rounded-lg p-4 mb-2"
          style={{
            backgroundColor: colors.cardBg,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Text className="font-bold text-lg mb-3" style={{ color: colors.text }}>
            Select Date
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                className="w-16 h-20 mr-3 items-center justify-center rounded-lg"
                style={{
                  backgroundColor:
                    selectedDate?.date.getDate() === date.date.getDate()
                      ? colors.primary
                      : date.isWeekend
                        ? colors.tertiaryLight
                        : colors.background,
                }}
                onPress={() => {
                  getSchedule(salonDetail._id, date)
                  setSelectedDate(date)
                  setSelectedTime(null)
                }}
              >
                <Text
                  className="text-xs"
                  style={{
                    color: selectedDate?.date.getDate() === date.date.getDate() ? colors.cardBg : colors.textLight,
                  }}
                >
                  {date.month}
                </Text>
                <Text
                  className="text-xl font-bold"
                  style={{
                    color: selectedDate?.date.getDate() === date.date.getDate() ? colors.cardBg : colors.text,
                  }}
                >
                  {date.day}
                </Text>
                <Text
                  className="text-xs"
                  style={{
                    color:
                      selectedDate?.date.getDate() === date?.date?.getDate()
                        ? colors.cardBg
                        : date.isWeekend
                          ? colors.accent
                          : colors.textLight,
                  }}
                >
                  {date.weekday}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} className="py-4" />
          ) : error ? (
            <Text className="text-sm py-2" style={{ color: colors.error }}>
              {error}
            </Text>
          ) : (
            <>
              {timeSlots.length > 0 && (
                <Text className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                  Select Time
                </Text>
              )}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
                {timeSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    className="p-3 mr-1 items-center rounded-lg"
                    style={{
                      backgroundColor: selectedTime === slot.time ? colors.primary : colors.cardBg,
                      borderWidth: 1,
                      borderColor: selectedTime === slot.time ? colors.primary : colors.divider,
                    }}
                    onPress={() => {
                      setSelectedTime(slot.time)
                      setSelectedSeat(null)
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{
                        color: selectedTime === slot.time ? colors.cardBg : colors.text,
                      }}
                    >
                      {slot.time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              {selectedTime && (
                <View className="mt-4">
                  <Text className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                    Select Seat
                  </Text>
                  <View className="flex-row flex-wrap">
                    {timeSlots
                      .find((slot) => slot.time === selectedTime)
                      ?.seats.map((seat) => (
                        <TouchableOpacity
                          key={seat.seatNumber}
                          className="w-14 h-14 m-1 items-center justify-center rounded-lg"
                          style={{
                            backgroundColor:
                              selectedSeat === seat.seatNumber
                                ? colors.primary
                                : seat.status == "available"
                                  ? colors.tertiaryLight
                                  : colors.background,
                          }}
                          onPress={() => (seat.status == "available" ? setSelectedSeat(seat.seatNumber) : null)}
                          disabled={seat.status != "available"}
                        >
                          <Text
                            className="text-lg"
                            style={{
                              color:
                                selectedSeat === seat.seatNumber
                                  ? colors.cardBg
                                  : seat.status != "available"
                                    ? colors.textLighter
                                    : colors.text,
                            }}
                          >
                            {seat.seatNumber}
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                </View>
              )}
            </>
          )}
        </View>
        {/* Promo Code */}
        {/* <View className="bg-white rounded-lg p-4 mb-2 shadow-sm">
          <Text className="font-bold text-lg mb-3">Promo Code</Text>
          <View className="flex-row">
            <TextInput
              className="flex-1 border border-gray-300 rounded-l-lg p-3"
              placeholder="Enter promo code"
              value={promoCode}
              onChangeText={setPromoCode}
            />
            <TouchableOpacity
              className="bg-gray-500 px-4 rounded-r-lg items-center justify-center"
              onPress={handleApplyPromo}
            >
              <Text className="text-white font-bold">Apply</Text>
            </TouchableOpacity>
          </View>
          {discount > 0 && (
            <Text className="text-green-600 mt-2">
              {discount * 100}% discount applied!
            </Text>
          )}
        </View> */}

        {/* Payment Summary */}
        <View
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
          <Text className="font-bold text-lg mb-3" style={{ color: colors.text }}>
            Payment Summary
          </Text>
          <View className="flex-row justify-between py-2">
            <Text style={{ color: colors.textLight }}>Subtotal</Text>
            <Text style={{ color: colors.text }}>₹{calculateSubtotal()}</Text>
          </View>
          {discount > 0 && (
            <View className="flex-row justify-between py-2">
              <Text style={{ color: colors.textLight }}>Discount</Text>
              <Text style={{ color: colors.success }}>-₹{calculateSubtotal() * discount}</Text>
            </View>
          )}

          <View className="flex-row justify-between py-2 border-t mt-2" style={{ borderTopColor: colors.divider }}>
            <Text className="font-bold" style={{ color: colors.text }}>
              Total
            </Text>
            <Text className="font-bold text-lg" style={{ color: colors.text }}>
              ₹{totalAmount}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-t mt-2" style={{ borderTopColor: colors.divider }}>
            <Text className="font-bold" style={{ color: colors.text }}>
              Wallet Balance
            </Text>
            <Text className="font-bold text-lg" style={{ color: colors.text }}>
              ₹{userInfo?.wallet?.balance}
            </Text>
          </View>
        </View>
      </ScrollView>
      <View className="relative mx-4 my-2 py-4">
        <TouchableOpacity
          className="rounded-lg items-center shadow-md py-3"
          style={{
            backgroundColor: userInfo?.wallet?.balance < totalAmount ? colors.textLight : colors.primary,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
          }}
          onPress={() => {
            userInfo?.wallet?.balance > totalAmount ? handleConfirmBooking() : console.log("nnnn")
          }}
          disabled={userInfo?.wallet?.balance < totalAmount || loading1}
        >
          <Text className="text-white font-bold text-lg">
            {loading1
              ? "Processing..."
              : userInfo?.wallet?.balance < totalAmount
                ? "Insufficient Balance"
                : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
        {loading1 && (
          <View
            className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center opacity-50"
            style={{ backgroundColor: colors.divider }}
          >
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </View>
    </View>
  )
}

export default CheckoutScreen
