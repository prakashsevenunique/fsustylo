import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import axiosInstance from '@/utils/axiosInstance';
import { imageBaseUrl } from '@/utils/helpingData';

const SalonDetail = () => {
  const { id } = useLocalSearchParams();
  const [selectedGender, setSelectedGender] = useState('unisex');
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [salon, setSalon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
  const [headerSticky, setHeaderSticky] = useState(false);
  const headerHeight = 180;

  async function getSalonDetails() {
    try {
      const response = await axiosInstance.get(`/api/salon/view/${id}`);
      const salonData = response.data?.salon || response.data;

      // Transform services to match component's expected format
      const transformedServices = salonData.services.map((service: any) => ({
        _id: service._id,
        id: service._id, // Duplicate for compatibility
        title: service.title,
        name: service.title, // Map title to name for compatibility
        description: service.description,
        rate: service.rate,
        price: service.rate, // Alias for rate
        originalPrice: service.rate, // No discount in example
        discount: service.discount || 0,
        duration: service.duration,
        gender: service.gender || 'unisex',
        category: service.category || 'Other'
      }));

      const updatedSalon = {
        ...salonData,
        services: transformedServices
      };

      setSalon(updatedSalon);
      const categories = mapApiDataToCategories(updatedSalon);
      setFilteredCategories(categories);
    } catch (error) {
      console.error('Error fetching salon details:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getSalonDetails();
  }, [id]);

  const mapApiDataToCategories = (data: any) => {
    if (!data?.services) return [];

    const servicesByCategory: Record<string, any[]> = {};
    data.services.forEach((service: any) => {
      const category = service.title || 'Other';
      if (!servicesByCategory[category]) {
        servicesByCategory[category] = [];
      }
      servicesByCategory[category].push({
        id: service._id,
        _id: service._id,
        name: service.title,
        title: service.title,
        price: service.rate,
        originalPrice: service.rate,
        discount: service.discount || 0,
        duration: service.duration,
        gender: service.gender || 'unisex',
        description: service.description
      });
    });

    return Object.keys(servicesByCategory).map((categoryName, index) => ({
      id: index.toString(),
      name: categoryName,
      services: servicesByCategory[categoryName]
    }));
  };

  const toggleService = (service: any) => {
    setSelectedServices((prev) => {
      if (prev.some(s => s.id === service.id)) {
        return prev.filter(s => s.id !== service.id);
      } else {
        return [...prev, { ...service, quantity: 1 }];
      }
    });
  };

  const updateQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setSelectedServices((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? { ...service, quantity: newQuantity }
          : service
      )
    );
  };

  const filterServices = () => {
    if (!salon) return [];

    return filteredCategories.map(category => ({
      ...category,
      services: category.services.filter(service =>
        (selectedGender === 'unisex' ||
          service.gender === 'unisex' ||
          service.gender === selectedGender) &&
        service.name?.toLowerCase().includes(searchQuery?.toLowerCase())
      )
    })).filter((category: any) => category.services.length > 0);
  };

  const filteredServices = filterServices();

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setHeaderSticky(offsetY > headerHeight);
    scrollY.setValue(offsetY);
  };

  const calculateAverageRating = () => {
    if (!salon?.reviews?.length) return 5; // Default if no reviews
    const sum = salon.reviews.reduce((acc: number, review: any) => acc + review.rating, 0);
    return (sum / salon.reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Ionicons name="cut" size={40} color="#E6007E" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!salon) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <MaterialIcons name="error-outline" size={40} color="#E6007E" />
        <Text className="mt-4 text-gray-600">Salon not found</Text>
        <TouchableOpacity
          className="mt-6 bg-pink-600 py-2 px-4 rounded-full"
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {headerSticky && (
        <Animated.View
          className="absolute top-0 left-0 right-0 z-10 bg-white pt-2 px-4 pb-2 shadow-sm"
          style={{
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [headerHeight, headerHeight + 1],
                outputRange: [0, 0],
                extrapolate: 'clamp'
              })
            }]
          }}
        >
          <View className='flex flex-row items-center gap-3'>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#E6007E" />
            </TouchableOpacity>
            <View>
              <Text className="font-bold text-lg">{salon.salonName}</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text className="ml-1 text-gray-700 text-sm">{calculateAverageRating()}</Text>
                <Text className="ml-2 text-gray-500 text-sm">{salon.reviews?.length || 0} reviews</Text>
              </View>
            </View>
          </View>
        </Animated.View>
      )}

      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={20}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[2]}
      >
        <View className="relative">
          {salon.salonPhotos?.length > 0 && (
            <Image
              source={{ uri: `${imageBaseUrl}/${salon.salonPhotos[0]}` }}
              className="w-full h-48 object-cover"
            />
          )}
          <TouchableOpacity
            className="absolute top-6 left-4 bg-black/30 p-2 rounded-full"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-4 bg-white">
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-xl font-bold">{salon.salonName}</Text>
              <Text className="text-gray-500 mt-1">
                {salon.salonAddress}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text className="ml-1 text-gray-700">{calculateAverageRating()}</Text>
                <Text className="ml-2 text-gray-500">{salon.reviews?.length || 0} reviews</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white pt-2 px-4 pb-2 border-b border-gray-200">
          <View className="flex-row items-center justify-between mb-2 my-2">
            <Text className="mr-3 text-gray-800 font-bold text-lg">Filter by :</Text>
            <View className="flex-row bg-gray-200 rounded-full p-1">
              {['male', 'female'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  className={`px-4 py-2 rounded-full ${selectedGender === gender ? 'bg-gray-800' : 'bg-gray-300'}`}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text className={selectedGender === gender ? 'text-white font-bold' : 'text-gray-600'}>
                    {gender === 'male' ? 'Men' : 'Women'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-lg px-3 py-2 my-2">
            <FontAwesome name="search" size={20} color="gray" />
            <TextInput
              placeholder="Search for services..."
              className="ml-2 py-2 flex-1"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                <Ionicons name="close" size={18} color="gray" />
              </TouchableOpacity>
            )}
          </View>
          {/* 
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-1">
            {filteredCategories.map((category: any) => (
              <TouchableOpacity key={category.id} className="items-center mr-4">
                <Image
                  source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo2WnGd1lgXf94qq-LY3Q_lE3IdhCbmVl_IQ&s' }}
                  className="w-14 h-14 rounded-full border border-gray-200"
                />
                <Text className="mt-1 text-xs">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}
        </View>

        <View className="px-4 pt-4 pb-32">
          {filteredServices?.map((category: any) => (
            <View key={category.id} className="mb-2">
              {/* <Text className="text-lg font-bold mb-3">{category.name} ({category.services.length})</Text> */}

              {category.services.map((service: any) => {
                const isSelected = selectedServices.some((s: any) => s.id === service.id);
                const selectedService = selectedServices.find((s: any) => s.id === service.id);

                return (
                  <View
                    key={service.id}
                    className={`mb-1 shadow-lg rounded-lg ${isSelected ? 'bg-pink-50 border  border-pink-600' : 'bg-white'}`}
                  >
                    <TouchableOpacity
                      className="flex-row justify-between items-center p-3"
                      onPress={() => toggleService(service)}
                    >
                      <View className="flex-1">
                        <Text className="font-bold text-md">{service.name}</Text>
                        {service.description && (
                          <Text className="text-gray-700 text-xs mt-1">{service.description}</Text>
                        )}
                        <Text className="text-gray-700 font-medium text-sm mt-1">Duration : {service.duration}</Text>

                      </View>
                      <View className="items-end">
                        <Text className="font-bold">₹{service.price}</Text>
                        {service.discount > 0 && (
                          <View className="flex-row items-center">
                            <Text className="text-gray-500 text-xs line-through mr-1">₹{service.originalPrice}</Text>
                            <Text className="text-pink-600 text-xs">{service.discount}% off</Text>
                          </View>
                        )}
                      </View>
                      <View className="ml-4 w-6 h-6 rounded-full border border-gray-300 justify-center items-center">
                        {isSelected && <View className="w-4 h-4 rounded-full bg-pink-600" />}
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {selectedServices.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3 bg-white border-t border-gray-200 shadow-lg">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600 font-bold">
              {selectedServices.reduce((sum, s: any) => sum + (s.quantity || 1), 0)} Item{selectedServices.length > 1 ? 's' : ''}
            </Text>
            <Text className="font-bold">
              ₹{selectedServices.reduce((sum, s: any) => sum + (s.price * (s.quantity || 1)), 0)}
            </Text>
          </View>
          <Text className="text-xs text-gray-500 mb-3">Discount will be applied at checkout.</Text>
          <TouchableOpacity
            className="bg-pink-600 py-3 rounded-lg items-center"
            onPress={() => router.push({
              pathname: '/salon/checkout',
              params: {
                salon: JSON.stringify(salon),
                services: JSON.stringify(selectedServices)
              }
            })}
          >
            <Text className="text-white font-bold">Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SalonDetail;