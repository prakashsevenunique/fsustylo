import { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import axiosInstance from '@/utils/axiosInstance';
import { imageBaseUrl } from '@/utils/helpingData';

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
        price: service.rate * (1 - (service.discount || 0) / 100),
        originalPrice: service.rate ,
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
        <Ionicons name="cut" size={40} color={colors.primary} />
        <Text className="mt-4" style={{ color: colors.textLight }}>Loading...</Text>
      </View>
    );
  }

  if (!salon) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.cardBg }}>
        <MaterialIcons name="error-outline" size={40} color={colors.primary} />
        <Text className="mt-4" style={{ color: colors.textLight }}>Salon not found</Text>
        <TouchableOpacity
          className="mt-6 py-2 px-4 rounded-full"
          style={{ backgroundColor: colors.primary }}
          onPress={() => router.back()}
        >
          <Text className="text-white">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {headerSticky && (
        <Animated.View
          className="absolute top-0 left-0 right-0 z-10 pt-2 px-4 pb-2 shadow-sm"
          style={{
            backgroundColor: colors.cardBg,
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
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
            <View>
              <Text className="font-bold text-lg" style={{ color: colors.text }}>{salon.salonName}</Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text className="ml-1 text-sm" style={{ color: colors.text }}>{calculateAverageRating()}</Text>
                <Text className="ml-2 text-sm" style={{ color: colors.textLight }}>{salon.reviews?.length || 0} reviews</Text>
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
              defaultSource={require('@/assets/img/logo.png')}
            />
          )}
          <TouchableOpacity
            className="absolute top-6 left-4 p-2 rounded-full"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="px-4 pt-4" style={{ backgroundColor: colors.cardBg }}>
          <View className="flex-row justify-between items-start">
            <View>
              <Text className="text-xl font-bold" style={{ color: colors.text }}>{salon.salonName}</Text>
              <Text className="mt-1" style={{ color: colors.textLight }}>
                {salon.salonAddress}
              </Text>
              <View className="flex-row items-center mt-1">
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text className="ml-1" style={{ color: colors.text }}>{calculateAverageRating()}</Text>
                <Text className="ml-2" style={{ color: colors.textLight }}>{salon.reviews?.length || 0} reviews</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="pt-2 px-4 pb-2 border-b"
          style={{
            backgroundColor: colors.cardBg,
            borderBottomColor: colors.divider
          }}>
          <View className="flex-row items-center justify-between mb-2 my-2">
            <Text className="mr-3 font-bold text-lg" style={{ color: colors.text }}>Filter by :</Text>
            <View className="flex-row p-1 rounded-full" style={{ backgroundColor: colors.tertiaryLight }}>
              {["unisex", 'male', 'female'].map((gender) => (
                <TouchableOpacity
                  key={gender}
                  className="px-3 py-2 rounded-full"
                  style={{
                    backgroundColor: selectedGender === gender ? colors.primary : colors.secondaryLight
                  }}
                  onPress={() => setSelectedGender(gender)}
                >
                  <Text
                    style={{
                      color: selectedGender === gender ? 'white' : colors.text,
                      fontWeight: selectedGender === gender ? 'bold' : 'normal'
                    }}>
                    {gender === 'male' ? 'Men' : gender === 'unisex' ? 'Unisex' : 'Women'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View className="flex-1 flex-row items-center rounded-lg px-3 py-2 my-2"
            style={{ backgroundColor: colors.tertiaryLight }}>
            <FontAwesome name="search" size={20} color={colors.textLight} />
            <TextInput
              placeholder="Search for services..."
              className="ml-2 py-2 flex-1"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ color: colors.text }}
              placeholderTextColor={colors.textLight}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} className="ml-2">
                <Ionicons name="close" size={18} color={colors.textLight} />
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
                    className="mb-1 shadow-lg rounded-lg"
                    style={{
                      backgroundColor: isSelected ? colors.tertiaryLight : colors.cardBg,
                      borderWidth: isSelected ? 1 : 0,
                      borderColor: isSelected ? colors.primary : 'transparent'
                    }}
                  >
                    <TouchableOpacity
                      className="flex-row justify-between items-center p-3"
                      onPress={() => toggleService(service)}
                    >
                      <View className="flex-1">
                        <Text className="font-bold text-md" style={{ color: colors.text }}>{service.name}</Text>
                        {service.description && (
                          <Text className="text-xs mt-1" style={{ color: colors.textLight }}>{service.description}</Text>
                        )}
                        <Text className="font-medium text-sm mt-1" style={{ color: colors.textLight }}>Duration : {service.duration}</Text>
                      </View>
                      <View className="items-end">
                        <Text className="font-bold" style={{ color: colors.text }}>₹{service.price}</Text>
                        {service.discount > 0 && (
                          <View className="flex-row items-center">
                            <Text className="text-xs line-through mr-1" style={{ color: colors.textLight }}>₹{service.originalPrice}</Text>
                            <Text className="text-xs" style={{ color: colors.primary }}>{service.discount}% off</Text>
                          </View>
                        )}
                      </View>
                      <View className="ml-4 w-6 h-6 rounded-full border justify-center items-center"
                        style={{ borderColor: colors.textLighter }}>
                        {isSelected && <View className="w-4 h-4 rounded-full" style={{ backgroundColor: colors.primary }} />}
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
        <View className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3 border-t shadow-lg"
          style={{
            backgroundColor: colors.cardBg,
            borderTopColor: colors.divider
          }}>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="font-bold" style={{ color: colors.textLight }}>
              {selectedServices.reduce((sum, s: any) => sum + (s.quantity || 1), 0)} Item{selectedServices.length > 1 ? 's' : ''}
            </Text>
            <Text className="font-bold" style={{ color: colors.text }}>
              ₹{selectedServices.reduce((sum, s: any) => sum + ((s.price ) * (s.quantity || 1)), 0)}
            </Text>
          </View>
          <Text className="text-xs mb-3" style={{ color: colors.textLight }}>Discount will be applied at checkout.</Text>
          <TouchableOpacity
            className="py-3 rounded-lg items-center"
            style={{ backgroundColor: colors.primary }}
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
