import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import SalonImageCarousel from '@/components/homePage/Carousel';
import { router } from 'expo-router';

const SalonDetailScreen = () => {
  const { salon } = useLocalSearchParams();
  const parsedSalon = JSON.parse(salon);

  const socialLinks = parsedSalon.socialLinks || '{}';
  const facilities = parsedSalon.facilities || '[]';
  const openingHours = parsedSalon.openingHours || '{}';

  const formatOpeningHours = () => {
    return Object.entries(openingHours).map(([day, hours]) => (
      <View key={day} className="flex-row justify-between py-2 border-b border-gray-100">
        <Text className="font-medium capitalize">{day}</Text>
        <Text className="text-gray-600">{hours}</Text>
      </View>
    ));
  };

  return (
    <>
      <View className="flex-row items-center bg-white py-4 px-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#E6007E" />
        </TouchableOpacity>
        <Text className="ml-3 text-xl font-bold">{(parsedSalon.salonName).toUpperCase()}</Text>
      </View>
      <ScrollView className="bg-white flex-1 pt-3">
        <SalonImageCarousel images={parsedSalon.salonPhotos} />

        <View className="px-6 py-4 pt-0">
          <Text className="text-2xl font-bold text-gray-900">{parsedSalon.salonName}</Text>
          <Text className="text-gray-500 mt-1">{parsedSalon.salonTitle}</Text>

          <View className="flex-row items-center mt-3">
            <Ionicons name="star" size={16} color="#f59e0b" />
            <Text className="text-amber-500 ml-1">5.0</Text>
            <Text className="text-gray-500 ml-3">{parsedSalon?.reviews?.length} reviews</Text>
            <View className="flex-row ml-3">
              <Ionicons name="location-sharp" size={16} color="#E6007E" />
              <Text className="text-pink-600 ml-1">2.5 km</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="flex-row justify-around py-3 border-t border-b border-gray-100">
          <TouchableOpacity onPress={() => router.push(`/(app)/salon/${parsedSalon._id}`)} className="items-center">
            <Ionicons name="calendar" size={24} color="#E6007E" />
            <Text className="text-xs mt-1">Book Now</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(parsedSalon.locationMapUrl)} className="items-center">
            <Ionicons name="navigate" size={24} color="#E6007E" />
            <Text className="text-xs mt-1">Directions</Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center">
            <Ionicons name="share-social" size={24} color="#E6007E" />
            <Text className="text-xs mt-1">Share</Text>
          </TouchableOpacity>
        </View>

        <View className="px-6 py-4">
          <Text className="text-lg font-bold mb-2">About Salon</Text>
          <Text className="text-gray-600">{parsedSalon.salonDescription}</Text>
        </View>

        {/* Location Map */}
        <View className="px-6 py-4">
          <Text className="text-lg font-bold mb-3">Location</Text>
          <View className="h-48 rounded-xl overflow-hidden">
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
          </View>
          <Text className="mt-2 text-gray-600">Address : {parsedSalon.salonAddress}</Text>
          <TouchableOpacity
            className="mt-2 flex-row items-center"
            onPress={() => Linking.openURL(parsedSalon.locationMapUrl)}
          >
            <Text className="text-pink-600">View on Google Maps</Text>
            <Ionicons name="open-outline" size={16} color="#E6007E" className="ml-1" />
          </TouchableOpacity>
        </View>

        <View className="px-6 py-4 bg-gray-50">
          <Text className="text-lg font-bold mb-3">Opening Hours</Text>
          {formatOpeningHours()}
        </View>

        <View className="px-6 py-4">
          <Text className="text-lg font-bold mb-3">Facilities</Text>
          <View className="flex-row flex-wrap">
            {facilities.map((facility: any, index: Number) => (
              <View key={index} className="flex-row items-center bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2">
                <Ionicons name="checkmark" size={14} color="#10B981" />
                <Text className="text-gray-700 ml-1 text-sm">{facility}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Services */}
        <View className="px-6 py-4 bg-gray-50">
          <Text className="text-lg font-bold mb-3">Services</Text>
          {parsedSalon.services.map((service: any) => (
            <View key={service._id} className="bg-white rounded-lg p-4 mb-3 shadow-sm">
              <View className="flex-row justify-between">
                <View>
                  <Text className="font-bold text-gray-800 capitalize">{service.title}</Text>
                  <Text className="text-gray-500 text-sm mt-1">
                    <Ionicons name="time-outline" size={14} /> {service.duration}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-bold">₹{service.rate}</Text>
                  {service.discount > 0 && (
                    <View className="flex-row items-center">
                      <Text className="text-gray-500 text-xs line-through mr-1">
                        ₹{Math.round(service.rate + (service.rate * service.discount / 100))}
                      </Text>
                      <Text className="text-pink-600 text-xs">{service.discount}% OFF</Text>
                    </View>
                  )}
                </View>
              </View>
              {/* <TouchableOpacity className="mt-3 bg-pink-600 py-2 rounded-full items-center">
              <Text className="text-white font-medium">Book Now</Text>
            </TouchableOpacity> */}
            </View>
          ))}
        </View>

        {/* Social Links */}
        <View className="px-6 py-4 mb-3">
          <Text className="text-lg font-bold mb-3">Connect With Us</Text>
          <View className="flex-row">
            {socialLinks.facebook && (
              <TouchableOpacity
                className="bg-blue-600 w-10 h-10 rounded-full items-center justify-center mr-3"
                onPress={() => Linking.openURL(socialLinks.facebook)}
              >
                <FontAwesome name="facebook-f" size={16} color="white" />
              </TouchableOpacity>
            )}
            {socialLinks.instagram && (
              <TouchableOpacity
                className="bg-pink-600 w-10 h-10 rounded-full items-center justify-center mr-3"
                onPress={() => Linking.openURL(socialLinks.instagram)}
              >
                <FontAwesome name="instagram" size={16} color="white" />
              </TouchableOpacity>
            )}
            {socialLinks.twitter && (
              <TouchableOpacity
                className="bg-blue-400 w-10 h-10 rounded-full items-center justify-center mr-3"
                onPress={() => Linking.openURL(socialLinks.twitter)}
              >
                <FontAwesome name="twitter" size={16} color="white" />
              </TouchableOpacity>
            )}
            {/* {parsedSalon.mobile && (
              <TouchableOpacity
                className="bg-green-500 w-10 h-10 rounded-full items-center justify-center"
                onPress={() => Linking.openURL(`tel:${parsedSalon.mobile}`)}
              >
                <FontAwesome name="whatsapp" size={16} color="white" />
              </TouchableOpacity>
            )} */}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default SalonDetailScreen;