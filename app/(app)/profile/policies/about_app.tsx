import { View, Text, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

export default function AboutApp() {
    const permissions = [
        {
            title: "Location",
            types: "ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION",
            purpose: "Show nearby salons and provide location-based recommendations",
            usage: "Detects your current location to display nearby salons and offers",
            icon: "location-on"
        },
        {
            title: "Camera & Photos",
            types: "CAMERA / READ_EXTERNAL_STORAGE / WRITE_EXTERNAL_STORAGE",
            purpose: "Upload profile pictures or salon service images",
            usage: "Only when you choose to upload an image or take a photo",
            icon: "camera-alt"
        },
        {
            title: "Notifications",
            types: "POST_NOTIFICATIONS",
            purpose: "Send booking updates, reminders, and offers",
            usage: "Keeps you informed about appointments and new features",
            icon: "notifications"
        },
        {
            title: "Phone/Contacts (Optional)",
            types: "READ_CONTACTS (if implemented)",
            purpose: "Quick profile setup and referrals",
            usage: "Never accessed without your explicit permission",
            icon: "contacts"
        }
    ];

    const features = [
        {
            title: "Salon Discovery",
            description: "Find and book top-rated salons near you",
            icon: "search"
        },
        {
            title: "Easy Booking",
            description: "Schedule appointments in just a few taps",
            icon: "calendar-today"
        },
        {
            title: "Secure Payments",
            description: "Multiple payment options with complete security",
            icon: "payment"
        },
        {
            title: "Real-time Updates",
            description: "Instant notifications about your appointments",
            icon: "notifications-active"
        }
    ];

    const openPrivacyPolicy = () => {
        Linking.openURL('https://sustylo.com/privacy');
    };

    const contactSupport = () => {
        Linking.openURL('mailto:support@sustylo.com');
    };

    return (
        <ScrollView className="flex-1 bg-gray-50 p-4">
            {/* App Header */}
            <View className="items-center mb-6">
                <Image
                    source={require('@/assets/img/logo.png')}
                    className="w-24 h-24 rounded-full mb-3"
                />
                <Text className="text-2xl font-bold text-pink-600">SuStylo</Text>
                <Text className="text-gray-600">Version 1.0.0</Text>
            </View>

            {/* App Description */}
            <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-2">About SuStylo</Text>
                <Text className="text-gray-700">
                    Su Stylo is your premier salon booking platform, connecting beauty enthusiasts with top-rated salons and stylists.
                    Our mission is to make salon services accessible, convenient, and delightful for everyone.
                </Text>
            </View>

            {/* Key Features */}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Key Features</Text>
                {features.map((feature, index) => (
                    <View key={index} className="flex-row items-start mb-3 bg-white p-3 rounded-lg shadow-sm">
                        <MaterialIcons name={feature.icon} size={24} color="#db2777" style={{ marginRight: 12 }} />
                        <View className="flex-1">
                            <Text className="font-medium text-gray-800">{feature.title}</Text>
                            <Text className="text-gray-600">{feature.description}</Text>
                        </View>
                    </View>
                ))}
            </View>

            {/* Permissions Section */}
            <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">App Permissions</Text>
                <Text className="text-gray-700 mb-4 bg-white p-3 rounded-lg shadow-sm">
                    To provide the best experience, we may request certain device permissions.
                    These are used solely for app functionality and your benefit.
                </Text>

                {permissions.map((perm, index) => (
                    <View key={index} className="mb-3 bg-white p-3 rounded-lg shadow-sm">
                        <View className="flex-row items-start mb-2">
                            <MaterialIcons name={perm.icon} size={24} color="#db2777" style={{ marginRight: 12 }} />
                            <View className="flex-1">
                                <Text className="font-semibold text-gray-800">{perm.title}</Text>
                                <Text className="text-gray-500 text-xs">{perm.types}</Text>
                            </View>
                        </View>

                        <View className="ml-9">
                            <View className="flex-row">
                                <Text className="font-medium text-gray-700 mr-1">Purpose:</Text>
                                <Text className="text-gray-600">{perm.purpose}</Text>
                            </View>
                            <View className="flex-row mt-1">
                                <Text className="font-medium text-gray-700 mr-1">Usage:</Text>
                                <Text className="text-gray-600">{perm.usage}</Text>
                            </View>
                        </View>
                    </View>
                ))}

                <View className="bg-white p-3 rounded-lg shadow-sm mt-3">
                    <Text className="font-medium text-gray-800 mb-1">Your Control</Text>
                    <Text className="text-gray-700">
                        You can manage these permissions anytime in your device settings.
                        We never collect sensitive data without your explicit consent.
                    </Text>
                </View>
            </View>

            {/* Footer Links */}
            {/* <View className="flex-row justify-between mb-6">
                <TouchableOpacity
                    onPress={openPrivacyPolicy}
                    className="flex-row items-center bg-pink-50 px-4 py-2 rounded-full"
                >
                    <Ionicons name="document-text" size={16} color="#db2777" style={{ marginRight: 6 }} />
                    <Text className="text-pink-600">Privacy Policy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={contactSupport}
                    className="flex-row items-center bg-pink-50 px-4 py-2 rounded-full"
                >
                    <MaterialIcons name="support-agent" size={16} color="#db2777" style={{ marginRight: 6 }} />
                    <Text className="text-pink-600">Contact Support</Text>
                </TouchableOpacity>
            </View> */}

            {/* Copyright */}
            <View className="items-center mb-12">
                <Text className="text-gray-500 text-sm">© 2025 SuStylo. All rights reserved.</Text>
            </View>
        </ScrollView>
    );
}