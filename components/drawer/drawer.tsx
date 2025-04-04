import { useState } from "react"
import { View, Text, TouchableOpacity } from "react-native"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import Ionicons from "@expo/vector-icons/Ionicons"
import { router } from "expo-router"

export default function CustomDrawer(props: any) {
  const [isDarkTheme, setIsDarkTheme] = useState(false)

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme)
  }

  const menuItems = [
    { label: "Home", icon: "home-outline", route: "/(app)/(tabs)" },
    { label: "At Salon", icon: "book-outline", route: "/atHome" },
    { label: "Shop", icon: "clipboard-outline", route: "/(app)/(tabs)" },
    { label: "Notes", icon: "document-text-outline", route: "/pyp" },
    { label: "Privacy Policy", icon: "newspaper-outline", route: "/(app)/(tabs)" },
    { label: "Blogs", icon: "create-outline", route: "/setting" },
    { label: "Support", icon: "chatbox-outline", route: "/setting" },
    { label: "Settings", icon: "settings-outline", route: "/setting" },
    { label: "About", icon: "information-circle-outline", route: "/setting" },
  ]

  return (
    <View className={`flex-1 ${isDarkTheme ? "bg-gray-900" : "bg-gray-50"}`}>
      <View className="pt-6 pb-8 px-5">
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-br from-pink-500 via-purple-500 to-purple-700 rounded-b-[40px] overflow-hidden">
          <View className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
          <View className="absolute -left-10 bottom-0 w-32 h-32 rounded-full bg-white/5" />
        </View>

        <TouchableOpacity className="active:opacity-90" onPress={() => router.push('/profile')}>
          <View className="flex-row items-center z-10">
            <View className="p-1 bg-gray-300 rounded-full">
              <View className="w-[50px] h-[50px] bg-white rounded-full flex items-center justify-center shadow-2xl">
                <Ionicons name="person" size={40} color="#E6007E" />
              </View>
            </View>

            <View className="ml-4 flex-1">
              <Text className={isDarkTheme ? `text-xl font-bold tracking-tight text-gray-200` : `text-xl font-bold tracking-tight text-gray-700`}>Prakash Jangid</Text>
              <Text className={`text-sm mt-0.5  ${isDarkTheme ? "text-gray-200" : "text-gray-700"}`}>prakashjangid@gmail.com</Text>
              {/* Profile status badge */}
              <View className="flex-row items-center bg-white/20 self-start px-2 py-1 rounded-full">
                <View className="w-2 h-2 rounded-full bg-green-400 mr-1" />
                <Text className={`text-xs font-medium ${isDarkTheme ? "text-gray-200" : "text-gray-700"}`}>Premium Member</Text>
              </View>
            </View>

            {/* Edit profile button */}
            {/* <TouchableOpacity
              className="bg-white/20 p-2 rounded-full active:bg-white/30"
              onPress={() => console.log("Edit profile")}
            >
              <Ionicons name="pencil" size={18} color="white" />
            </TouchableOpacity> */}
          </View>
        </TouchableOpacity>
      </View>

      {/* Drawer Navigation with enhanced styling */}
      <DrawerContentScrollView {...props} className="px-4" contentContainerStyle={{ paddingTop: 10 }}>
        {/* Menu section title */}
        <Text
          className={`
  text-xs font-medium uppercase tracking-wider px-4 mb-2
  ${isDarkTheme ? "text-gray-400" : "text-gray-500"}
`}
        >
          Menu
        </Text>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            className={`flex-row items-center px-5 py-3 rounded-xl mb-2 ${index === 0 ? (isDarkTheme ? "bg-gray-800" : "bg-pink-50") : isDarkTheme ? "bg-gray-800/80" : "bg-white"} shadow-sm active:scale-[0.98]
      ${isDarkTheme && index === 0 ? "active:bg-gray-700" : "active:bg-pink-50"}
    `}
          >
            {index === 0 && <View className="absolute left-0 top-2 bottom-2 w-1 bg-pink-500 rounded-r-full" />}
            <View
              className={`
      w-10 h-10 rounded-full flex items-center justify-center
      ${index === 0 ? (isDarkTheme ? "bg-pink-900/50" : "bg-pink-100") : isDarkTheme ? "bg-gray-700" : "bg-gray-100"}
    `}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={index === 0 ? "#E6007E" : isDarkTheme ? "#D1D5DB" : "#6B7280"}
              />
            </View>
            <Text
              className={`ml-4 text-base font-medium ${index === 0 ? "text-pink-600" : isDarkTheme ? "text-gray-200" : "text-gray-700"}`}
            >
              {item.label}
            </Text>
            {index === 0 && (
              <Ionicons name="chevron-forward" size={16} color="#E6007E" style={{ marginLeft: "auto" }} />
            )}
          </TouchableOpacity>
        ))}
        <View className={`h-px ${isDarkTheme ? "bg-gray-700" : "bg-gray-200"} my-4 mx-2`} />
        <Text
          className={`text-xs font-medium uppercase tracking-wider px-4 mb-2 ${isDarkTheme ? "text-gray-400" : "text-gray-500"}`}
        >
          Preferences
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          className={`
    flex-row items-center px-5 py-3.5 rounded-xl mt-1 active:bg-gray-50
    ${isDarkTheme ? "bg-gray-800" : "bg-white"} shadow-sm
  `}
        >
          <View
            className={`
    w-10 h-10 rounded-full flex items-center justify-center
    ${isDarkTheme ? "bg-gray-700" : "bg-gray-100"}
  `}
          >
            <Ionicons
              name={isDarkTheme ? "sunny-outline" : "moon-outline"}
              size={22}
              color={isDarkTheme ? "#FFC107" : "#E6007E"}
            />
          </View>

          <Text
            className={`
    ml-4 text-base font-medium flex-1
    ${isDarkTheme ? "text-white" : "text-gray-700"}
  `}
          >
            {isDarkTheme ? "Light Mode" : "Dark Mode"}
          </Text>

          <View
            className={`
    w-14 h-7 rounded-full p-1
    ${isDarkTheme ? "bg-purple-600" : "bg-gray-300"}
  `}
          >
            <View
              className={`
      w-5 h-5 bg-white rounded-full shadow-md
      ${isDarkTheme ? "ml-7" : "ml-0"}
    `}
            />

          </View>
        </TouchableOpacity>
        <View className="p-5 border-gray-200">
          <Text
            className={`
    text-xs text-center 
    ${isDarkTheme ? "text-gray-500" : "text-gray-400"}
  `}
          >
            App Version 1.0.0
          </Text>
        </View>
      </DrawerContentScrollView>
    </View>
  )
}

