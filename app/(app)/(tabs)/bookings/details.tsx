import React from 'react';
import { View, Text, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { imageBaseUrl } from '@/utils/helpingData';
import { Ionicons } from '@expo/vector-icons';

const BookingDetailPage = () => {
    const insets = useSafeAreaInsets();
    const { bookings } = useLocalSearchParams() as any;
    const booking = JSON.parse(bookings) as any;

    // Format date to be more readable
    const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
            <View className="bg-white px-4 py-4 shadow-sm">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} className="text-primary" />
                        </TouchableOpacity>
                        <Text className="ml-4 text-xl font-bold">My Bookings</Text>
                    </View>
                </View>
            </View>

            <ScrollView className="flex-1 px-4">
                <View className="mt-1 mb-3">

                    <View className="mt-2 mb-2 rounded-xl overflow-hidden bg-gray-200 h-48">
                        {booking.salonId?.salonPhotos?.length > 0 ? (
                            <Image
                                source={{ uri: `${imageBaseUrl}/${booking?.salonId?.salonPhotos[0]}` }}
                                className="w-full h-full"
                                resizeMode="cover"
                            />
                        ) : (
                            <View className="flex-1 items-center justify-center">
                                <Text className="text-gray-500">No image available</Text>
                            </View>
                        )}
                    </View>
                    <View className="px-2">
                        <View className="flex-row items-center justify-between">
                            <Text className="text-xl font-bold text-gray-900">
                                {(booking?.salonId?.salonName)?.toUpperCase()}
                            </Text>

                            {/* Icon to view salon details */}
                            <TouchableOpacity onPress={()=>router.push(`/salon/${booking.salonId?._id}`)} className='border border-gray-400 rounded-full shadow-md' >
                                <Ionicons name="information" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-gray-600 mt-1">{booking?.salonId?.salonTitle}</Text>
                        <Text className="text-gray-600">{booking?.salonId?.salonAddress}</Text>
                    </View>

                </View>

                {/* Booking Summary */}
                <View className="bg-white rounded-xl shadow-sm p-5 mb-3">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</Text>

                    <View className="space-y-3 gap-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Booking ID</Text>
                            <Text className="text-gray-800 font-medium">{booking?._id}</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Date</Text>
                            <Text className="text-gray-800 font-medium">{formattedDate}</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Time Slot</Text>
                            <Text className="text-gray-800 font-medium">{booking?.timeSlot}</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Seat Number</Text>
                            <Text className="text-gray-800 font-medium">{booking?.seatNumber}</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Total Duration</Text>
                            <Text className="text-gray-800 font-medium">{booking?.totalDuration}</Text>
                        </View>
                    </View>
                </View>

                {/* Services */}
                <View className="bg-white rounded-xl shadow-sm p-5 mb-3">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">Services</Text>

                    <View className="space-y-4">
                        {booking.services.map((service:any) => (
                            <View key={service._id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                <View className="flex-row justify-between">
                                    <Text className="text-gray-800 font-medium">{service?.name}</Text>
                                    <Text className="text-gray-800 font-medium">₹{service?.price}</Text>
                                </View>

                                <View className="flex-row justify-between mt-1">
                                    <Text className="text-gray-500 text-sm">{service?.duration}</Text>
                                    {service?.discount > 0 && (
                                        <Text className="text-green-600 text-sm">-{service?.discount}% discount</Text>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Payment Summary */}
                <View className="bg-white rounded-xl shadow-sm p-5 mb-3">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">Payment Summary</Text>

                    <View className="gap-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Subtotal</Text>
                            <Text className="text-gray-800">₹{booking?.services.reduce((sum, service) => sum + service.price, 0)}</Text>
                        </View>

                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Discounts</Text>
                            <Text className="text-green-600">-₹{booking?.services.reduce((sum, service) => sum + (service.price * service.discount / 100), 0)}</Text>
                        </View>

                        <View className="border-t border-gray-200 pt-3 mt-2">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-800 font-semibold">Total Amount</Text>
                                <Text className="text-gray-800 font-bold">₹{booking?.totalAmount}</Text>
                            </View>
                        </View>

                        <View className="flex-row justify-between mt-4">
                            <Text className="text-gray-600">Payment Status</Text>
                            <View className={`px-2 py-1 rounded-full ${booking.paymentStatus === 'Pending' ? 'bg-amber-100' : 'bg-green-100'}`}>
                                <Text className={`text-xs font-medium ${booking.paymentStatus === 'Pending' ? 'text-amber-800' : 'text-green-800'}`}>
                                    {booking.paymentStatus}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Booking Status */}
                <View className="bg-white rounded-xl shadow-sm p-5 mb-20">
                    <Text className="text-lg font-semibold text-gray-800 mb-4">Booking Status</Text>

                    <View className="flex-row items-center gap-x-2">
                        <View className={`w-3 h-3 rounded-full ${booking?.status === 'Pending' ? 'bg-amber-500' : booking.status === 'Confirmed' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <Text className="text-gray-800 font-medium capitalize">{booking?.status?.toLowerCase()}</Text>
                    </View>

                    {booking.bookingHistory.length > 0 && (
                        <View className="mt-4">
                            <Text className="text-gray-600 text-sm mb-2">Last updated: {new Date(booking?.bookingHistory[0]?.changedAt)?.toLocaleString()}</Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default BookingDetailPage;