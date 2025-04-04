import { View, Text, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useContext, useState } from 'react';
import { UserContext } from '@/hooks/userInfo';

export default function ProfileScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const {userInfo} = useContext(UserContext) as any;

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-md border-b border-gray-200">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
            <Text className="text-lg font-bold ml-3">My Profile</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/notification")}>
            <Ionicons name="notifications-outline" size={25} color="black" className="mr-4" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#E6007E"]} />}
        className="p-4"
      >
        {/* Profile Section */}
        <View className="items-center mt-6">
          <View className="relative">
            <Image source={{ uri: 'https://static.vecteezy.com/system/resources/thumbnails/035/857/779/small/people-face-avatar-icon-cartoon-character-png.png' }} className="w-24 h-24 rounded-full" />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-pink-600 p-2 rounded-full border border-white">
              <Feather name="edit-2" size={14} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="mt-2 text-pink-600 text-lg font-semibold">{userInfo?.name || "Your Name"}</Text>
          <Text className="text-gray-600">{userInfo?.mobileNumber || "Mobile Number" }</Text>
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-around mt-6">
          {[{ name: 'Notifications', icon: 'bell', routes:"/notification" }, { name: 'Orders', icon: 'shopping-cart',routes:"/shop" }, { name: 'Settings', icon: 'settings',routes:"/profile/setting" }].map((item :any, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.push(item.routes)}
              className="items-center p-3 bg-white rounded-lg shadow-md w-28"
            >
              <Feather name={item.icon} size={24} color="black" />
              <Text className="mt-1 text-xs font-semibold text-gray-700">{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Profile Sections */}
        <View className="mt-6">
          <Text className="text-gray-700 font-semibold">My Account</Text>
          {[{ name: 'My Profile', icon: 'user', route: "/profile/edit" }, { name: 'Manage Address', icon: 'map-pin', route: "/profile/address" }, { name: 'My Reviews', icon: 'thumbs-up', route: "/profile/myReview" }].map((item, index) => (
            <TouchableOpacity key={index} onPress={() => router.push(item.route)} className="flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm mt-2">
              <View className="flex-row items-center">
                <Feather name={item.icon} size={20} color="black" />
                <Text className="ml-3 text-gray-700 font-medium">{item.name}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-6">
          <Text className="text-gray-700 font-semibold">My Offer</Text>
          {[{ name: 'Offers & Deals', icon: 'tag', route: "/profile/offers" }, { name: 'Refer & Earn', icon: 'user-plus', route: "/profile/referal" }].map((item, index) => (
            <TouchableOpacity key={index} onPress={() => router.push(item.route)} className="flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm mt-2">
              <View className="flex-row items-center">
                <Feather name={item.icon} size={20} color="black" />
                <Text className="ml-3 text-gray-700 font-medium">{item.name}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Other Section */}
        <View className="mt-6 mb-8">
          <Text className="text-gray-700 font-semibold">Help & Support</Text>
          {[{ name: 'About App', icon: 'info' }, { name: 'Privacy Policy', icon: 'lock' }, { name: 'Terms & Conditions', icon: 'file' }, { name: 'Raise a Ticket', icon: 'help-circle' }].map((item, index) => (
            <TouchableOpacity onPress={() => router.push("/profile/raiseTicket")} key={index} className="flex-row items-center justify-between p-4 bg-white rounded-lg shadow-sm mt-2">
              <View className="flex-row items-center">
                <Feather name={item.icon} size={20} color="black" />
                <Text className="ml-3 text-gray-700 font-medium">{item.name}</Text>
              </View>
              <Feather name="chevron-right" size={20} color="gray" />
            </TouchableOpacity>
          ))}
        </View>
        {/* <View className='my-8 mt-6'>
        <TouchableOpacity onPress={() => console.log('Logout')} className="bg-pink-600 p-3 rounded-lg flex-row justify-center items-center">
          <Feather name="log-out" size={20} color="white" />
          <Text className="ml-2 text-white font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
        </View> */}
      </ScrollView>
    </View>
  );
}
