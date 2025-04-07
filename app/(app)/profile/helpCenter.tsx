import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useState } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

export default function HelpCenter() {
    const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

    const toggleItem = (index: number) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    const faqs = [
        {
            question: "How do I book an appointment on Su Stylo?",
            answer: `Booking an appointment is easy:\n\n1. Open the Su Stylo app\n2. Browse or search for nearby salons\n3. Select a salon and choose your desired service\n4. Pick a date and time slot that works for you\n5. Confirm your booking – that's it!\n\nYou'll receive a confirmation via app notification or email.`
        },
        {
            question: "Can I cancel or reschedule a booking?",
            answer: `Yes! To cancel or change your appointment:\n\n1. Go to "My Bookings" in the app\n2. Select the appointment you wish to change\n3. Choose "Cancel" or "Reschedule" and follow the prompts\n\nPlease note: Cancellations made close to the appointment time may be subject to our cancellation policy.`
        },
        {
            question: "What payment methods are accepted?",
            answer: `We currently accept the following payment options:\n\n• UPI (Google Pay, PhonePe, Paytm, etc.)\n• Debit/Credit Cards\n• Net Banking\n• Cash (available at selected partner salons)\n\nFor online payments, all transactions are 100% secure.`
        },
        {
            question: "Am I eligible for a refund if I cancel?",
            answer: `Refunds are processed as per our Refund & Cancellation Policy:\n\n• If you cancel before the salon's cutoff time, a full refund will be initiated\n• If you cancel late or miss your appointment, partial or no refund may apply\n• Refunds for prepaid bookings will be credited back to your original payment method within 5–7 business days`
        },
        {
            question: "How do I contact customer support?",
            answer: `You can reach us via:\n\n• Email: info@sustylo.com\n• Phone: +91-7297026119\n• Operating Hours: Monday–Saturday, 10:00 AM – 6:00 PM\n\nWe aim to respond within 24 hours for all queries.`
        },
        {
            question: "Is my data safe with Su Stylo?",
            answer: `Yes, your privacy is our priority. We follow strict data protection standards and never share your personal information without your consent. For full details, visit our Privacy Policy.`
        }
    ];

    const handleEmailPress = () => {
        Linking.openURL('mailto:info@sustylo.com');
    };

    const handlePhonePress = () => {
        Linking.openURL('tel:+917297026119');
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-pink-600 p-6 pb-4">
                <Text className="text-2xl font-bold text-white">Help Center</Text>
                <Text className="text-pink-100 mt-1">
                    Find answers to common questions or contact our support team
                </Text>
            </View>

            {/* FAQ Section */}
            <ScrollView className="px-4 py-6">
                <Text className="text-lg font-semibold mb-4 text-gray-800">Frequently Asked Questions</Text>

                {faqs.map((item, index) => (
                    <View key={index} className="mb-4 bg-white rounded-lg shadow-sm overflow-hidden">
                        <TouchableOpacity
                            onPress={() => toggleItem(index)}
                            className="p-4 flex-row justify-between items-center"
                        >
                            <Text className="font-medium text-gray-800 flex-1 pr-2">{item.question}</Text>
                            {expandedItems[index] ? (
                                <Ionicons name="chevron-up" size={20} color="#6b7280" />
                            ) : (
                                <Ionicons name="chevron-down" size={20} color="#6b7280" />
                            )}
                        </TouchableOpacity>

                        {expandedItems[index] && (
                            <View className="px-4 pb-4">
                                <Text className="text-gray-600 whitespace-pre-line">{item.answer}</Text>
                            </View>
                        )}
                    </View>
                ))}
            </ScrollView>

            {/* Contact Section */}
            <View className="border-t border-gray-200 p-6 bg-white">
                <Text className="text-lg font-semibold mb-3 text-gray-800">Still need help?</Text>
                <Text className="text-gray-600 mb-4">Contact our support team directly:</Text>

                <TouchableOpacity
                    onPress={handleEmailPress}
                    className="flex-row items-center mb-3 p-3 bg-gray-50 rounded-lg"
                >
                    <MaterialIcons name="email" size={20} color="#db2777" style={{ marginRight: 12 }} />
                    <Text className="text-gray-700">info@sustylo.com</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handlePhonePress}
                    className="flex-row items-center p-3 bg-gray-50 rounded-lg"
                >
                    <MaterialIcons name="phone" size={20} color="#db2777" style={{ marginRight: 12 }} />
                    <Text className="text-gray-700">+91-7297026119</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}