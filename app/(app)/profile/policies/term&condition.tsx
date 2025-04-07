import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function TermsAndConditions() {
    const sections = [
        {
            title: "1. About the App",
            content: "Su Stylo is an online salon booking platform that allows users to discover, compare, and book grooming and beauty services at verified partner salons.\n\nWe do not own or operate salons ourselves; all services are delivered by third-party service providers."
        },
        {
            title: "2. User Eligibility & Responsibilities",
            content: "• You must be at least 18 years old, or use the app under supervision of a legal guardian.\n• You agree to provide accurate, current, and complete information during registration and booking.\n• You are solely responsible for activity under your account.\n\nYou agree not to:\n• Violate any applicable laws\n• Misuse the platform (unauthorized access or spamming)\n• Disrupt the app's performance or services"
        },
        {
            title: "3. Service Bookings & Payments",
            content: "• All bookings are confirmed in real-time based on salon availability.\n• Payment options include UPI, debit/credit cards, net banking, or cash (if offered by salon).\n• Prices displayed include applicable taxes (unless otherwise stated).\n• Final responsibility for service quality lies with the partner salon."
        },
        {
            title: "4. Cancellations & Refunds",
            content: "• You can cancel/reschedule appointments via the app as per our Cancellation Policy.\n• Refunds processed within 5-7 working days.\n• Late cancellations, no-shows, or policy violations may lead to partial or no refund."
        },
        {
            title: "5. User-Generated Content",
            content: "Users may post reviews, ratings, or images. You agree:\n• To share only honest and respectful feedback\n• Not to upload abusive, misleading, or copyrighted content\n• That your feedback may be used by Su Stylo for promotional purposes"
        },
        {
            title: "6. Permissions & Data Use",
            content: "By using Su Stylo, you may be asked to grant certain permissions (location, camera, notifications) to:\n• Show nearby salons\n• Allow image uploads\n• Send booking confirmations\n\nData collection is governed by our Privacy Policy."
        },
        {
            title: "7. Intellectual Property",
            content: "All trademarks, logos, and content are property of Su Stylo Salon Pvt. Ltd. You may not use, reproduce, or distribute any content without written permission."
        },
        {
            title: "8. Limitation of Liability",
            content: "Su Stylo is not liable for:\n• Any issues between users and third-party salons\n• Service dissatisfaction, injury, or loss due to salon visits\n• Technical disruptions or app downtime\n\nUse of the app is at your own risk."
        },
        {
            title: "9. Account Suspension or Termination",
            content: "We may suspend or disable your account if:\n• You breach these Terms\n• You engage in fraud, abuse, or illegal activity\n• You misuse the booking system"
        },
        {
            title: "10. Changes to Terms",
            content: "We may modify these Terms at any time. Updates will be posted here, and continued use implies acceptance."
        },
        {
            title: "11. Governing Law",
            content: "These Terms are governed by Indian laws. Any disputes shall be subject to exclusive jurisdiction of courts in [Your State/City]."
        }
    ];

    const refundPolicy = [
        {
            time: "More than 12 hours",
            fee: "₹0",
            refund: "100% refund"
        },
        {
            time: "6 to 12 hours",
            fee: "20% of service amount",
            refund: "80% refund"
        },
        {
            time: "1 to 6 hours",
            fee: "30% of service amount",
            refund: "70% refund"
        },
        {
            time: "30 minutes to 1 hour",
            fee: "50% of service amount",
            refund: "50% refund"
        },
        {
            time: "Less than 15 minutes / No-show",
            fee: "75% of service amount",
            refund: "25% refund (or none)"
        }
    ];

    const contactMethods = [
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
        <ScrollView className="flex-1 bg-gray-50 p-4">
            {/* Header */}
            <View className="mb-6">
                <Text className="text-2xl font-bold text-gray-800">Terms & Conditions</Text>
                <Text className="text-gray-600">Effective Date: 05-05-2025</Text>
            </View>

            {/* Introduction */}
            <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <Text className="text-gray-700">
                    These Terms & Conditions ("Terms") govern your access to and use of the Su Stylo mobile application and website operated by Su Stylo Salon Pvt. Ltd.
                </Text>
                <Text className="text-gray-700 mt-2 font-semibold">
                    By using Su Stylo, you agree to be bound by these Terms. If you do not agree, please do not use our services.
                </Text>
            </View>

            {/* Terms Sections */}
            {sections.map((section, index) => (
                <View key={index} className="mb-4 bg-white p-4 rounded-lg shadow-sm">
                    <Text className="text-lg font-semibold text-pink-600 mb-2">{section.title}</Text>
                    <Text className="text-gray-700 whitespace-pre-line">{section.content}</Text>
                </View>
            ))}

            {/* Cancellation & Refund Policy */}
            <View className="mt-6 mb-6">
                <Text className="text-xl font-bold text-gray-800 mb-4">Cancellation & Refund Policy</Text>

                <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <Text className="text-gray-700 mb-4">
                        At Su Stylo, customer satisfaction and transparency are our top priorities. We offer a fair and flexible cancellation policy.
                    </Text>

                    <Text className="font-semibold text-gray-800 mb-2">Time-Based Cancellation Rules</Text>
                    <View className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                        <View className="flex-row bg-pink-50">
                            <Text className="flex-1 p-2 font-semibold text-gray-700">Cancellation Time</Text>
                            <Text className="flex-1 p-2 font-semibold text-gray-700">Cancellation Fee</Text>
                            <Text className="flex-1 p-2 font-semibold text-gray-700">Refund Amount</Text>
                        </View>
                        {refundPolicy.map((item, index) => (
                            <View key={index} className="flex-row border-t border-gray-200">
                                <Text className="flex-1 p-2 text-gray-700">{item.time}</Text>
                                <Text className="flex-1 p-2 text-gray-700">{item.fee}</Text>
                                <Text className="flex-1 p-2 text-gray-700">{item.refund}</Text>
                            </View>
                        ))}
                    </View>

                    <Text className="font-semibold text-gray-800 mb-2">No-Show Policy</Text>
                    <Text className="text-gray-700 mb-4">
                        If a customer fails to cancel and doesn't attend, refund will be at salon's discretion. Su Stylo doesn't guarantee refunds in such cases.
                    </Text>

                    <Text className="font-semibold text-gray-800 mb-2">Cancellation by Salon Partner</Text>
                    <Text className="text-gray-700 mb-2">
                        • Full refund will be issued regardless of timing
                        • For last-minute cancellations (within 2 hours), partner must notify customer
                    </Text>

                    <Text className="font-semibold text-gray-800 mb-2">Refund Process</Text>
                    <Text className="text-gray-700">
                        • Processed to original payment method within 72 working hours
                        • Actual time may vary based on bank/payment gateway
                        • All transactions in Indian Rupees (INR)
                    </Text>
                </View>

                <View className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                    <Text className="font-semibold text-pink-600 mb-1">Reason for Cancellation Fee</Text>
                    <Text className="text-gray-700">
                        The fee compensates salon professionals for time, effort, and booking slots reserved for you.
                    </Text>
                </View>
            </View>

            {/* Contact Information */}
            <View className="bg-white p-6 rounded-lg shadow-sm">
                <Text className="text-lg font-semibold text-gray-800 mb-4">Contact Information</Text>

                {contactMethods.map((method, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={method.action}
                        className="flex-row items-center p-3 bg-gray-50 rounded-lg mb-2"
                    >
                        <MaterialIcons name={method.icon} size={20} color="#db2777" style={{ marginRight: 12 }} />
                        <View>
                            <Text className="text-gray-500 text-xs">{method.type}</Text>
                            <Text className="text-gray-800">{method.value}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                <View className="mt-4 p-3 bg-gray-50 rounded-lg mb-4">
                    <Text className="text-gray-500 text-xs">Address</Text>
                    <Text className="text-gray-800">Su Stylo Salon Pvt. Ltd., P.NO 97, Dakshinpuri, Shri Kishanpura</Text>
                </View>
            </View>
        </ScrollView>
    );
}