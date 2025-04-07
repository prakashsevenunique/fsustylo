import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function PrivacyPolicy() {
    const sections = [
        {
            title: "1. Purpose and Scope",
            content: "This Privacy Policy is applicable to all users of the Platform, including:\n\n• Clients (individuals booking salon appointments)\n• Salon Partners (salon owners, service providers)\n• Visitors (browsing without registering)\n\nThis document is a legally binding electronic record under applicable Indian laws (including the Information Technology Act, 2000)."
        },
        {
            title: "2. Types of Information We Collect",
            content: "A. Personal Information (Clients):\n• Full name, email address, phone number\n• OTPs for login/verification\n• Booking details, transaction history\n• Payment method (UPI/card/wallets)\n• Location access (for nearby services)\n• Feedback, reviews, communication records\n• IP address, device type, browser info\n\nB. Business Information (Salon Partners):\n• Business name and registered owner\n• Contact number, email address\n• Government-issued IDs (GST, license)\n• Salon address, photographs, working hours\n• Services and pricing\n• Bank account details (for payments)\n• Staff information and ratings"
        },
        {
            title: "3. Collection Methods",
            content: "We collect information:\n• During registration or profile update\n• When a service is booked or canceled\n• Through payments and refunds\n• Via in-app communication (chat/support)\n• Automatically via cookies and analytics\n• From device permissions (with consent)"
        },
        {
            title: "4. Use of Information",
            content: "We use your data to:\n• Register and manage accounts\n• Enable and manage salon bookings\n• Process secure payments and refunds\n• Communicate appointment status\n• Provide customer and partner support\n• Offer personalized content\n• Monitor platform security\n• Conduct analytics\n• Fulfill legal obligations"
        },
        {
            title: "5. Cancellation & Refund Policy",
            content: "Time of Cancellation Before Appointment | Refund to Client\n------------------------------------ | ---------------\nMore than 12 hours | 100% refund\n6 to 12 hours | 80% refund\n1 to 6 hours | 70% refund\n30 to 60 minutes | 50% refund\n15 to 30 minutes | 25% refund\nLess than 15 minutes | No refund\n\nRefunds processed via original payment method within 5-7 working days."
        },
        {
            title: "6. Partner No-Show & Cancellation",
            content: "If a client fails to show up:\n• Partner retains up to 80% of booking value\n• Repeat cases may face suspension\n\nIf a partner cancels:\n• Client receives full refund\n• Partners may face listing penalties"
        },
        {
            title: "7. Information Sharing",
            content: "We share encrypted data with:\n• Payment gateways\n• SMS/email services\n• Cloud storage providers\n• Customer support systems\n• Analytics tools\n• Government authorities (if required)\n\nAll partners comply with data protection laws and NDAs."
        },
        {
            title: "8. Security Practices",
            content: "We implement:\n• SSL encryption\n• OTP verification\n• Firewall and anti-virus\n• Secure cloud storage\n• Role-based access control\n\nWhile we strive for security, no digital system is 100% secure."
        },
        {
            title: "9. Retention of Data",
            content: "We retain data:\n• Clients: Up to 5 years from last activity\n• Salon Partners: Up to 8 years from last payout\n• Legal requirement: May extend duration\n\nData is securely deleted post-retention."
        },
        {
            title: "10. User Rights",
            content: "You have the right to:\n• Access your data\n• Request correction\n• Withdraw consent\n• Request deletion\n• Data portability\n• Lodge a complaint\n\nContact info@sustylo.com to exercise rights."
        },
        {
            title: "11. Cookies & Tracking",
            content: "We use cookies to:\n• Save login sessions\n• Monitor service quality\n• Track app crashes\n• Improve personalization\n\nDisabling cookies may limit features."
        },
        {
            title: "12. External Links",
            content: "Platform may include third-party links. We are not responsible for their content or privacy practices."
        },
        {
            title: "13. Business Transfers",
            content: "In case of merger/acquisition, your data may be transferred under confidentiality terms. You will be informed of changes."
        },
        {
            title: "14. Grievance Officer",
            content: "Contact details:\nName: Data Privacy Officer\nEmail: info@sustylo.com\nPhone: +91 7297026119\nAddress: P.NO 97, Dakshinpuri, Shri Kishanpura\nWebsite: https://sustylo.com/\n\nWe aim to resolve queries within 30 business days."
        },
        {
            title: "15. Policy Updates",
            content: "We may modify this policy based on:\n• Platform upgrades\n• Changes in law\n• User feedback\n\nMaterial changes will be notified through the Platform."
        },
        {
            title: "16. Final Statement",
            content: "By using Su Stylo, you confirm that you:\n• Have read this Privacy Policy\n• Agree to data collection and use\n• Acknowledge compliance with Indian IT laws"
        }
    ];

    const handleEmailPress = () => {
        Linking.openURL('mailto:info@sustylo.com');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:+917297026119');
    };

    const handleWebsitePress = () => {
        Linking.openURL('https://sustylo.com/');
    };

    return (
        <>
        <View className="bg-white px-4 py-4 shadow-md">
        <View className="flex-row gap-2 items-center">
          <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
          <Text className="text-lg font-bold">Privacy Policy</Text>
        </View>
      </View>
      <ScrollView className="flex-1 bg-gray-50 p-2">
            {/* Header */}
            <View className="mb-4 p-3">
                <Text className="text-2xl font-bold text-gray-800">Privacy Policy</Text>
                <Text className="text-gray-600 mt-2">Effective Date: April 5, 2025 • Version: 1.0</Text>
            </View>

            {/* Introduction */}
            <View className="mb-2 bg-white p-4 rounded-lg shadow-sm">
                <Text className="text-gray-700">
                    Welcome to Su Stylo, a salon service aggregator connecting clients with verified salon partners.
                    Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose,
                    and safeguard your data when you access or use our mobile application, website, or services.
                </Text>
                <Text className="text-gray-700 mt-2 font-semibold">
                    By using our Platform, you agree to the terms outlined in this policy.
                </Text>
            </View>

            {/* Policy Sections */}
            {sections.map((section, index) => (
                <View key={index} className="mb-2 bg-white p-4 rounded-lg shadow-sm">
                    <Text className="text-lg font-semibold text-pink-600 mb-2">{section.title}</Text>
                    <Text className="text-gray-700 whitespace-pre-line">{section.content}</Text>
                </View>
            ))}

            {/* Contact Information */}
            <View className="mt-3 mb-8 bg-white p-6 rounded-lg shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-4">Contact Us</Text>

                <TouchableOpacity
                    onPress={handleEmailPress}
                    className="flex-row items-center mb-4"
                >
                    <MaterialIcons name="email" size={20} color="#db2777" style={{ marginRight: 12 }} />
                    <Text className="text-gray-700">info@sustylo.com</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handlePhonePress}
                    className="flex-row items-center mb-4"
                >
                    <MaterialIcons name="phone" size={20} color="#db2777" style={{ marginRight: 12 }} />
                    <Text className="text-gray-700">+91-7297026119</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleWebsitePress}
                    className="flex-row items-center"
                >
                    <MaterialIcons name="public" size={20} color="#db2777" style={{ marginRight: 12 }} />
                    <Text className="text-gray-700">https://sustylo.com/</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
        </>
       
    );
}