import { View, Text, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

export default function AboutUs() {
  const features = [
    {
      title: "Instant Bookings",
      description: "Seamless salon appointments in just a few taps",
      icon: "clock-o",
      iconType: FontAwesome
    },
    {
      title: "Top-rated Salons",
      description: "Access to premium grooming services",
      icon: "star",
      iconType: Ionicons
    },
    {
      title: "Real-time Availability",
      description: "Zero-wait convenience at your fingertips",
      icon: "calendar-times-o",
      iconType: FontAwesome
    },
    {
      title: "Exclusive Deals",
      description: "Special offers to elevate your experience",
      icon: "tag",
      iconType: FontAwesome
    }
  ];

  const contactMethods = [
    {
      type: "Address",
      value: "P.NO 97, Dakshinpuri, Shri Kishanpura",
      icon: "location-on",
      action: () => Linking.openURL('https://maps.google.com/?q=P.NO+97,+Dakshinpuri,+Shri+Kishanpura')
    },
    {
      type: "Email",
      value: "info@sustylo.com",
      icon: "email",
      action: () => Linking.openURL('mailto:info@sustylo.com')
    },
    {
      type: "Phone",
      value: "+91-7297026119",
      icon: "phone",
      action: () => Linking.openURL('tel:+917297026119')
    },
    {
      type: "Website",
      value: "www.sustylo.com",
      icon: "public",
      action: () => Linking.openURL('https://www.sustylo.com')
    }
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Hero Section */}
      <View className="bg-pink-600 p-6 pb-8">
        <Text className="text-3xl font-bold text-white mb-2">About Su Stylo</Text>
        <Text className="text-pink-100 text-lg">
          Revolutionizing salon experiences since 2025
        </Text>
      </View>

      {/* Main Content */}
      <View className="px-6 -mt-6">
        {/* Intro Card */}
        <View className="bg-white rounded-xl p-6 shadow-md mb-6">
          <Text className="text-gray-700 text-base leading-6">
            Su Stylo is your go-to destination for spontaneous salon appointments and premium grooming services. 
            Founded in 2025, we are on a mission to revolutionize the salon industry by combining style, 
            convenience, and top-notch customer care.
          </Text>
          <Text className="text-gray-700 mt-4 text-base leading-6">
            We understand that life can be hectic, and self-care often gets pushed aside. That's why we created 
            Su Stylo – a platform designed to make grooming effortless and accessible.
          </Text>
        </View>

        {/* What We Offer */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">What We Offer</Text>
          <View className="flex-row flex-wrap justify-between">
            {features.map((feature, index) => {
              const Icon = feature.iconType;
              return (
                <View key={index} className="w-[48%] bg-white rounded-lg p-4 mb-4 shadow-sm">
                  <Icon name={feature.icon} size={24} color="#db2777" />
                  <Text className="font-semibold text-gray-800 mt-2">{feature.title}</Text>
                  <Text className="text-gray-600 text-sm mt-1">{feature.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Mission & Vision */}
        <View className="mb-8">
          <View className="bg-pink-50 rounded-xl p-5 mb-4 border border-pink-100">
            <Text className="font-bold text-pink-600 mb-2">Our Mission</Text>
            <Text className="text-gray-700">
              To empower salon owners and customers alike by making grooming services seamless, 
              accessible, and hassle-free. We aim to redefine self-care as an experience, 
              not just a service.
            </Text>
          </View>
          <View className="bg-pink-50 rounded-xl p-5 border border-pink-100">
            <Text className="font-bold text-pink-600 mb-2">Our Vision</Text>
            <Text className="text-gray-700">
              We envision transforming how India experiences salon and grooming services. 
              Through cutting-edge technology and a customer-first approach, we help local 
              salons grow while making beauty and wellness effortlessly available to everyone.
            </Text>
          </View>
        </View>

        {/* Company Info */}
        <View className="bg-white rounded-xl p-5 shadow-sm mb-8">
          <Text className="font-bold text-gray-800 mb-2">Developed & Managed By</Text>
          <Text className="text-gray-700 mb-1">Su Stylo Salon Pvt. Ltd.</Text>
          <Text className="text-gray-500 text-sm">Registered in India</Text>
        </View>

        {/* Contact Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Contact Us</Text>
          <Text className="text-gray-700 mb-4">
            Have questions or feedback? We're here to help.
          </Text>
          <View className="bg-white rounded-xl p-1 overflow-hidden">
            {contactMethods.map((method, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={method.action}
                className="flex-row items-center p-4 border-b border-gray-100 last:border-b-0"
              >
                <MaterialIcons name={method.icon} size={24} color="#db2777" style={{ marginRight: 16 }} />
                <View>
                  <Text className="text-gray-500 text-xs">{method.type}</Text>
                  <Text className="text-gray-800">{method.value}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Footer CTA */}
        <View className="bg-pink-600 rounded-xl p-6 mb-8 items-center">
          <MaterialIcons name="spa" size={32} color="white" />
          <Text className="text-white text-xl font-bold mt-3 text-center">
            Style & Grooming, Just a Tap Away
          </Text>
          <Text className="text-pink-100 mt-2 text-center">
            Discover the joy of stress-free beauty care — anytime, anywhere.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}