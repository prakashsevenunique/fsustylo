import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, FlatList, Linking, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useContext, useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import axiosInstance from '@/utils/axiosInstance';
import { UserContext } from '@/hooks/userInfo';

export default function WalletScreen() {
    const [isAddMoneyModalVisible, setIsAddMoneyModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('UPI');
    const { userInfo, fetchUserInfo } = useContext(UserContext) as any;
    const [loading, setLoading] = useState(false);
    const [creditTransactions, setCreditTransactions] = useState([]);
    const [debitTransactions, setDebitTransactions] = useState([]);
    const [transactionsLoading, setTransactionsLoading] = useState(true);
    const [selectedGender, setSelectedGender] = useState('credit');
    const [refreshing, setRefreshing] = useState(false);

    const paymentMethods = [
        { id: '1', name: 'UPI', icon: 'currency-rupee', provider: 'Any UPI App' },
        { id: '2', name: 'Credit Card', icon: 'credit-card', provider: 'VISA/Mastercard' },
        { id: '3', name: 'Debit Card', icon: 'credit-card', provider: 'VISA/Mastercard' },
        { id: '4', name: 'Net Banking', icon: 'money', provider: 'All Banks' },
    ];

    useEffect(() => {
        fetchTransactions();
        fetchUserInfo();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchTransactions();
        fetchUserInfo()
    }, []);

    const fetchTransactions = async () => {
        setTransactionsLoading(true);
        try {
            // Fetch credit transactions (payIn)
            const creditResponse = await axiosInstance.get(`/api/payment/payin/report?userId=${userInfo._id}`);
            const formattedCredit = creditResponse?.data?.data.map((txn: any) => ({
                id: txn._id,
                type: 'credit',
                amount: txn.amount,
                description: txn.description || 'Wallet Top-up',
                date: new Date(txn.createdAt).toLocaleDateString(),
                time: new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                icon: 'arrow-down',
                iconColor: '#10B981',
                status: txn.status
            }));
            setCreditTransactions(formattedCredit);

            const debitResponse = await axiosInstance.get(`/api/payment/payOut/report?userId=${userInfo._id}`);
            const formattedDebit = debitResponse?.data?.data.map((txn: any) => ({
                id: txn._id,
                type: 'debit',
                amount: txn.amount,
                description: txn.description || 'Paid for the order',
                date: new Date(txn.createdAt).toLocaleDateString(),
                time: new Date(txn.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                icon: 'arrow-up',
                iconColor: '#EF4444',
                status: txn.status,
                account: `${txn.account} (${txn.ifsc})`
            }));
            setDebitTransactions(formattedDebit);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setTransactionsLoading(false);
            setRefreshing(false);
        }
    };


    const makePayment = async () => {
        if (!amount) {
            alert('Please enter a valid amount');
            return;
        }
        if (!selectedPaymentMethod) {
            alert('Please select a payment method');
            return;
        }
        setLoading(true);
        const referenceId = generateReferenceId();

        const data = {
            userId: userInfo._id,
            amount: amount,
            reference: referenceId,
            name: userInfo.name || "unknown",
            mobile: userInfo.mobileNumber,
            email: userInfo.email || "example@gmail.com",
        };
        try {
            const response = await axiosInstance.post('/api/payment/payIn', data);
            let paymentUrl = response.data?.data?.data?.payment_link;
            Linking.openURL(paymentUrl);
            setAmount('');
            setSelectedPaymentMethod('');
            setIsAddMoneyModalVisible(false);
            router.push(`/(app)/profile/payment_success?trxId=${data.reference}&amount=${data.amount}`);
        } catch (error) {
            console.error('Error making payment request:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const generateReferenceId = () => {
        const prefix = 'txn';
        const randomString = Math.random().toString(36).substring(2, 10);
        const randomNumber = Math.floor(Math.random() * 10000);
        return `${prefix}${randomNumber}${randomString}`;
    };

    const renderTransactionItem = ({ item }: any) => (
        <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
            <View className="flex-row items-center">
                <View className={`bg-${item.type === 'credit' ? 'green-100' : 'red-100'} p-2 rounded-full`}>
                    <FontAwesome name={item.icon} size={18} color={item.iconColor} />
                </View>
                <View className="ml-3">
                    <Text className="font-medium text-gray-800">{item.description}</Text>
                    <Text className="text-gray-500 text-xs mt-1">{item.date} • {item.time}</Text>
                    <View className={`mt-1 px-2 py-1 rounded-full self-start ${item.status === 'Completed' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                        <Text className={`text-xs ${item.status === 'Completed' ? 'text-green-800' : 'text-yellow-800'}`}>
                            {item.status}
                        </Text>
                    </View>
                </View>
            </View>
            <Text className={`font-bold text-${item.type === 'credit' ? 'green-600' : 'red-600'}`}>
                {item.type === 'credit' ? '+' : '-'}₹{item.amount}
            </Text>
        </View>
    );

    const renderPaymentMethod = ({ item }: any) => (
        <TouchableOpacity
            className={`flex-row items-center justify-between p-4 mb-2 rounded-lg border ${selectedPaymentMethod === item.name ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}
            onPress={() => { item.name == 'UPI' && setSelectedPaymentMethod(item.name) }}
        >
            <View className="flex-row items-center">
                <MaterialIcons name={item.icon} size={24} color="#6B7280" />
                <View className="ml-3">
                    <Text className="font-medium text-gray-800">{item.name}</Text>
                    <Text className="text-gray-500 text-xs">{item.provider}</Text>
                </View>
            </View>
            {selectedPaymentMethod === item.name && (
                <Ionicons name="checkmark-circle" size={20} color="#E6007E" />
            )}
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-4 shadow-md border-b border-gray-200">
                <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                        <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
                        <Text className="text-lg font-bold ml-3">My Wallet</Text>
                    </View>
                    <TouchableOpacity onPress={() => router.push("/notification")}>
                        <Ionicons name="notifications-outline" size={25} color="black" className="mr-4" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Wallet Balance */}
            <View className="bg-gradient bg-pink-400 p-6 rounded-b-3xl shadow-sm">
                <Text className="text-white text-lg">Wallet Balance</Text>
                <Text className="text-white text-4xl font-bold mt-2">₹{userInfo?.wallet?.balance}</Text>
                <TouchableOpacity
                    className="bg-white rounded-full px-6 py-3 flex-row items-center justify-center mt-6"
                    onPress={() => setIsAddMoneyModalVisible(true)}
                >
                    <Ionicons name="add" size={20} color="#E6007E" />
                    <Text className="text-pink-600 font-bold ml-2">Add Money</Text>
                </TouchableOpacity>
            </View>
            <View className="px-4 py-3 flex-row items-center justify-between my-2">
                <Text className="text-lg font-bold text-gray-800">Recent Transactions</Text>
                <View className="flex-row bg-gray-100 rounded-full p-1">
                    {['credit', 'debit'].map((gender) => (
                        <TouchableOpacity
                            key={gender}
                            className={`px-4 py-2 rounded-full ${selectedGender === gender ? 'bg-pink-600' : 'bg-transparent'}`}
                            onPress={() => setSelectedGender(gender)}
                        >
                            <Text className={selectedGender === gender ? 'text-white font-bold' : 'text-gray-600'}>
                                {gender === 'credit' ? 'Credit' : 'Debit'}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Transactions List */}
            <View className="flex-1 px-4 mt-4">
                {transactionsLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color="#E6007E" />
                    </View>
                ) : (
                    <>
                        {selectedGender === 'credit' ? (
                            creditTransactions.length > 0 ? (
                                <FlatList
                                    data={creditTransactions}
                                    renderItem={renderTransactionItem}
                                    keyExtractor={(item: any) => item.id}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                            colors={['#E6007E']}
                                            tintColor="#E6007E"
                                        />
                                    }
                                />
                            ) : (
                                <View className="flex-1 justify-center items-center py-10">
                                    <Ionicons name="wallet-outline" size={50} color="#9CA3AF" />
                                    <Text className="text-gray-500 mt-3">No credit transactions yet</Text>
                                </View>
                            )
                        ) : (
                            debitTransactions.length > 0 ? (
                                <FlatList
                                    data={debitTransactions}
                                    renderItem={renderTransactionItem}
                                    keyExtractor={(item: any) => item.id}
                                    showsVerticalScrollIndicator={false}
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                            colors={['#E6007E']}
                                            tintColor="#E6007E"
                                        />
                                    }
                                />
                            ) : (
                                <View className="flex-1 justify-center items-center py-10">
                                    <Ionicons name="wallet-outline" size={50} color="#9CA3AF" />
                                    <Text className="text-gray-500 mt-3">No debit transactions yet</Text>
                                </View>
                            )
                        )}
                    </>
                )}
            </View>

            {/* Add Money Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={isAddMoneyModalVisible}
                onRequestClose={() => setIsAddMoneyModalVisible(false)}
            >
                <View className="flex-1 bg-black bg-opacity-50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[90%]">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-800">Add Money</Text>
                            <TouchableOpacity onPress={() => setIsAddMoneyModalVisible(false)}>
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-gray-600 mb-1">Enter Amount</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-lg px-4 mb-6">
                            <Text className="text-gray-800 font-bold">₹</Text>
                            <TextInput
                                className="flex-1 py-3 px-3 text-gray-800 font-bold"
                                placeholder="0"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            />
                        </View>

                        <Text className="text-gray-600 mb-3">Choose Payment Method</Text>
                        <FlatList
                            data={paymentMethods}
                            renderItem={renderPaymentMethod}
                            keyExtractor={(item) => item.id}
                            scrollEnabled={false}
                            className="mb-6"
                        />

                        <TouchableOpacity
                            className="bg-pink-600 rounded-full py-4 flex-row items-center justify-center"
                            onPress={makePayment}
                            disabled={!amount || loading}
                        >
                            {loading ? (
                                <ActivityIndicator size={22} color="white" />
                            ) : (
                                <Text className="text-white font-bold">Proceed to Pay ₹{amount || '0'}</Text>
                            )}
                        </TouchableOpacity>

                        <View className="flex-row justify-center mt-4">
                            <Text className="text-gray-500 text-xs">
                                By continuing, you agree to our Terms & Conditions
                            </Text>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}