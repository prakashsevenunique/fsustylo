import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  ActivityIndicator,
  Modal,
  Alert,
  RefreshControl,
} from "react-native"
import { router } from "expo-router"
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useCallback, useContext, useEffect, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { UserContext } from "@/hooks/userInfo"
import { imageBaseUrl } from "@/utils/helpingData"
import ReviewModal from "@/components/rating"

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
  error: "#E53935", // Red for errors and cancellations
}

export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming")
  const { userInfo, fetchUserInfo } = useContext(UserContext) as any
  const [booking, setBooking] = useState() as any
  const [filterBooking, setFilterbooking] = useState([])
  const [indicatorPosition] = useState(new Animated.Value(0))
  const [loading, setLoading] = useState(true)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectId, setSelectedId] = useState("")
  const [ratingSelected, setRatingSelected] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    getUserBooking().then(() => setRefreshing(false))
  }, [])

  const handleCancelAction = () => {
    setIsModalVisible(false)
  }
  const [isVisible, setIsVisible] = useState(false)

  const handleReviewSubmit = async (reviewData, setReview, setRating) => {
    try {
      const response = await axiosInstance.post(`/api/salon/review/${ratingSelected}`, {
        ...reviewData,
        phone: userInfo.mobileNumber,
      })
      if (response) {
        setRatingSelected("")
        setReview("")
        setRating(0)
        setIsVisible(false)
      }
    } catch (error) {
      Alert.alert("Error submitting review:", error.message)
    }
  }

  const tabs = ["Upcoming", "Completed", "Cancelled"]

  const handleTabPress = (tab: any, index: number) => {
    setActiveTab(tab)
    Animated.spring(indicatorPosition, {
      toValue: index * 100,
      useNativeDriver: true,
    }).start()
  }

  const cancelBooking = async () => {
    try {
      await axiosInstance.post(`/api/booking/cancel/${selectId}`, { cancelReason })
      setSelectedId("")
      setIsModalVisible(false)
      getUserBooking()
      fetchUserInfo()
    } catch (error) {
      Alert.alert("Error", error.message)
    }
  }

  const handleCancelConfirmation = () => {
    if (!cancelReason) {
      Alert.alert("Required", "Please select a reason for cancellation")
      return
    }
    cancelBooking()
  }

  const getUserBooking = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get(`/api/booking/user/${userInfo?._id}`)
      if (response.status === 200) {
        setBooking(response.data?.bookings)
      }
    } catch (error) {
      Alert.alert("Error", error.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getUserBooking()
  }, [userInfo])

  useEffect(() => {
    if (booking) {
      const filteredBookings = booking.filter(
        (item: any) => item.status === (activeTab == "Upcoming" ? "Confirmed" : activeTab),
      )
      setFilterbooking(filteredBookings)
    }
  }, [activeTab, booking])

  const [cancelReason, setCancelReason] = useState("")
  const [showReasonDropdown, setShowReasonDropdown] = useState(false)

  const cancellationReasons = [
    "Schedule conflict",
    "Found another salon",
    "Service no longer needed",
    "Price concerns",
    "Health issues",
    "Transportation issues",
    "Weather conditions",
    "Other",
  ]

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: colors.cardBg,
          paddingHorizontal: 16,
          paddingVertical: 16,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={{ marginLeft: 16, fontSize: 20, fontWeight: "bold", color: colors.text }}>My Bookings</Text>
          </View>
        </View>
      </View>

      <View style={{ position: "relative" }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]} // Android
              tintColor={colors.primary} // iOS
              progressBackgroundColor="#ffffff"
            />
          }
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ flexDirection: "row" }}>
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={{
                  flex: 1,
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingHorizontal: 24,
                  borderBottomWidth: activeTab === tab ? 2 : 0,
                  borderBottomColor: activeTab === tab ? colors.primary : "transparent",
                }}
                onPress={() => handleTabPress(tab, index)}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    color: activeTab === tab ? colors.primary : colors.textLight,
                  }}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: colors.background,
            zIndex: 100,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={{ marginTop: 16, color: colors.textLight }}>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1, padding: 12 }}>
          <View style={{ paddingBottom: 80 }}>
            {filterBooking.length === 0 ? (
              <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
                <MaterialIcons name="event-busy" size={48} color={colors.textLighter} style={{ marginBottom: 16 }} />
                <Text style={{ fontSize: 18, color: colors.textLight, fontWeight: "500" }}>
                  No {activeTab} bookings
                </Text>
                <Text style={{ color: colors.textLighter, marginTop: 8, textAlign: "center" }}>
                  {activeTab === "upcoming"
                    ? "You don't have any upcoming appointments"
                    : `You don't have any ${activeTab} appointments`}
                </Text>
                {activeTab === "upcoming" && (
                  <TouchableOpacity
                    style={{
                      marginTop: 24,
                      backgroundColor: colors.primary,
                      paddingVertical: 12,
                      paddingHorizontal: 24,
                      borderRadius: 9999,
                    }}
                    onPress={() => router.push("/")}
                  >
                    <Text style={{ color: "white", fontWeight: "500" }}>Book Now</Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              filterBooking &&
              filterBooking.map((item: any) => (
                <View
                  key={item._id}
                  style={{
                    marginBottom: 8,
                    backgroundColor: colors.cardBg,
                    borderRadius: 12,
                    shadowColor: colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 2,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.divider,
                    }}
                  >
                    <Image
                      source={{ uri: `${imageBaseUrl}/${item?.salonId?.salonPhotos[0]}` }}
                      style={{ width: 48, height: 48, borderRadius: 9999 }}
                    />
                    <View style={{ marginLeft: 12, flex: 1 }}>
                      <Text style={{ fontWeight: "bold", fontSize: 18, color: colors.text }}>
                        {item?.salonId?.salonName}
                      </Text>
                      <Text style={{ color: colors.textLight, fontSize: 14 }}>{item.salonId?.salonAddress}</Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 4,
                        backgroundColor:
                          item?.status === "Confirmed"
                            ? "rgba(74, 222, 128, 0.2)"
                            : item?.status === "Completed"
                              ? "rgba(96, 165, 250, 0.2)"
                              : "rgba(248, 113, 113, 0.2)",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "500",
                          color:
                            item?.status === "Confirmed"
                              ? colors.confirmed
                              : item?.status === "Completed"
                                ? colors.primary
                                : colors.cancelled,
                        }}
                      >
                        {item?.status}
                      </Text>
                    </View>
                  </View>

                  {/* Booking Details */}
                  <View style={{ padding: 16, paddingVertical: 8 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text style={{ color: colors.textLight }}>Service</Text>
                      <Text style={{ fontWeight: "500", color: colors.text }}>
                        {item.services?.map((serv: any, index: number) => ` ${index === 0 ? "" : "&"} ${serv.name}`)}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text style={{ color: colors.textLight }}>Date</Text>
                      <Text style={{ fontWeight: "500", color: colors.text }}>
                        {new Date(item.date).toLocaleDateString("en-GB")}
                      </Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text style={{ color: colors.textLight }}>Time</Text>
                      <Text style={{ fontWeight: "500", color: colors.text }}>{item.timeSlot}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                      <Text style={{ color: colors.textLight }}>Duration</Text>
                      <Text style={{ fontWeight: "500", color: colors.text }}>{item.totalDuration}</Text>
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                      <Text style={{ color: colors.textLight }}>Price</Text>
                      <Text style={{ fontWeight: "500", color: colors.text }}>₹ {item.totalAmount}</Text>
                    </View>
                  </View>

                  {/* Booking Actions */}
                  {activeTab !== "Completed" && activeTab !== "Cancelled" && (
                    <View
                      style={{
                        flexDirection: "row",
                        borderTopWidth: 1,
                        borderTopColor: colors.divider,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: "/(app)/(tabs)/bookings/details",
                            params: {
                              bookings: JSON.stringify(item),
                            },
                          })
                        }
                        style={{
                          flex: 1,
                          alignItems: "center",
                          backgroundColor: colors.tertiaryLight,
                          paddingVertical: 12,
                          borderRightWidth: 1,
                          borderRightColor: colors.divider,
                        }}
                      >
                        <Text style={{ color: colors.primary, fontWeight: "500" }}>View Details</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setIsModalVisible(true)
                          setSelectedId(item._id)
                        }}
                        style={{ flex: 1, alignItems: "center", paddingVertical: 12 }}
                      >
                        <Text style={{ color: colors.error, fontWeight: "500" }}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {activeTab === "Completed" && (
                    <View
                      style={{
                        flexDirection: "row",
                        borderTopWidth: 1,
                        borderTopColor: colors.divider,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() =>
                          router.push({
                            pathname: `/(app)/salon/${item?.salonId?._id}`,
                            params: {
                              bookings: JSON.stringify(item),
                            },
                          })
                        }
                        style={{
                          flex: 1,
                          alignItems: "center",
                          paddingVertical: 12,
                          borderRightWidth: 1,
                          borderRightColor: colors.divider,
                        }}
                      >
                        <Text style={{ color: colors.primary, fontWeight: "500" }}>Book Again</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setRatingSelected(item?.salonId?._id)
                          setIsVisible(true)
                        }}
                        style={{ flex: 1, alignItems: "center", paddingVertical: 12 }}
                      >
                        <Text style={{ color: colors.primary, fontWeight: "500" }}>Rate Service</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
      <Modal animationType="slide" transparent={true} visible={isModalVisible} onRequestClose={handleCancelAction}>
        <View
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View
            style={{
              backgroundColor: colors.cardBg,
              padding: 24,
              borderRadius: 24,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 4,
              width: "90%",
              marginHorizontal: "auto",
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 9999,
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <MaterialIcons name="cancel" size={32} color={colors.error} />
              </View>
              <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, textAlign: "center" }}>
                Cancel Booking?
              </Text>
              <Text style={{ color: colors.textLight, marginTop: 8, textAlign: "center" }}>
                Please select a reason for cancellation.
              </Text>
            </View>

            {/* Dropdown Select for Cancellation Reason */}
            <View style={{ marginTop: 16, marginBottom: 20 }}>
              <Text style={{ color: colors.text, fontWeight: "500", marginBottom: 8 }}>Reason for cancellation:</Text>

              {/* Dropdown Container with Relative Positioning */}
              <View style={{ position: "relative" }}>
                {/* Dropdown Trigger */}
                <TouchableOpacity
                  onPress={() => setShowReasonDropdown(!showReasonDropdown)}
                  style={{
                    borderWidth: 1,
                    borderColor: colors.divider,
                    borderRadius: 12,
                    backgroundColor: colors.background,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: cancelReason ? colors.text : colors.textLighter }}>
                    {cancelReason || "Select a reason..."}
                  </Text>
                  <AntDesign name={showReasonDropdown ? "up" : "down"} size={16} color={colors.textLight} />
                </TouchableOpacity>

                {/* Dropdown Options - Absolutely Positioned Relative to Parent */}
                {showReasonDropdown && (
                  <View
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      marginTop: 4,
                      borderWidth: 1,
                      borderColor: colors.divider,
                      borderRadius: 12,
                      backgroundColor: colors.cardBg,
                      shadowColor: colors.primary,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 2,
                      zIndex: 10,
                      maxHeight: 192,
                    }}
                  >
                    <ScrollView keyboardShouldPersistTaps="handled" decelerationRate="normal" scrollEnabled={true} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
                      {cancellationReasons.map((reason, index) => (
                        <TouchableOpacity
                          key={index}
                          style={{
                            paddingHorizontal: 16,
                            paddingVertical: 12,
                            borderBottomWidth: index < cancellationReasons.length - 1 ? 1 : 0,
                            borderBottomColor: colors.divider,
                            backgroundColor: reason === cancelReason ? colors.tertiaryLight : "transparent",
                          }}
                          onPress={() => {
                            setCancelReason(reason)
                            setShowReasonDropdown(false)
                          }}
                        >
                          <Text
                            style={{
                              color: reason === cancelReason ? colors.primary : colors.text,
                              fontWeight: reason === cancelReason ? "500" : "normal",
                            }}
                          >
                            {reason}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  handleCancelAction()
                  setCancelReason("")
                  setShowReasonDropdown(false)
                }}
                style={{
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: colors.background,
                  paddingVertical: 14,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: colors.text, fontWeight: "600", textAlign: "center" }}>Keep Booking</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (cancelReason) {
                    handleCancelConfirmation()
                    setCancelReason("")
                    setShowReasonDropdown(false)
                  } else {
                    Alert.alert("Required", "Please select a reason for cancellation")
                  }
                }}
                style={{
                  flex: 1,
                  marginLeft: 8,
                  paddingVertical: 14,
                  borderRadius: 12,
                  backgroundColor: cancelReason ? colors.error : "rgba(239, 68, 68, 0.4)",
                }}
                disabled={!cancelReason}
              >
                <Text style={{ color: "white", fontWeight: "600", textAlign: "center" }}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <ReviewModal isVisible={isVisible} onClose={() => setIsVisible(false)} onSubmit={handleReviewSubmit} />
    </View>
  )
}
