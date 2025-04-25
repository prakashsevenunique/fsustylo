import { Tabs } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Platform, StyleSheet, Text } from "react-native"
import { useNavigation } from "@react-navigation/native"

// Su stylo Salon color palette
const colors = {
  primary: "#E65305", // Bright red-orange as primary
  primaryLight: "#FF7A3D", // Lighter version of primary
  textLight: "#7D6E66", // Lighter text color
}

export default function TabLayout() {
  const navigation = useNavigation() as any
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarPressColor: "transparent", // Remove Android ripple effect
          tabBarPressOpacity: 1, // Remove iOS opacity change on press
          tabBarItemStyle: {
            // Remove any background changes on press
            activeBackgroundColor: "transparent",
            inactiveBackgroundColor: "transparent",
          },
        }}
      >
        {/* Home */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerStyle: {
              height: 51,
              backgroundColor: "white",
            },
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "home" : "home-outline"} color={color} size={focused ? 22 : 20} />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: focused ? "bold" : "500",
                  color: focused ? colors.primary : colors.textLight,
                }}
              >
                Home
              </Text>
            ),
          }}
        />
        {/* At Salon */}
        <Tabs.Screen
          name="atSalon"
          options={{
            title: "atSalon",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "cut-sharp" : "cut-outline"} color={color} size={focused ? 22 : 21} />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: focused ? "bold" : "500",
                  color: focused ? colors.primary : colors.textLight,
                }}
              >
                At Salon
              </Text>
            ),
          }}
        />

        {/* At Home */}
        <Tabs.Screen
          name="atHome"
          options={{
            title: "At Home",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "apps-sharp" : "apps-outline"} color={color} size={focused ? 22 : 20} />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: focused ? "bold" : "500",
                  color: focused ? colors.primary : colors.textLight,
                }}
              >
                At Home
              </Text>
            ),
          }}
        />

        {/* Bookings */}
        <Tabs.Screen
          name="bookings"
          options={{
            title: "Bookings",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? "calendar" : "calendar-outline"} color={color} size={focused ? 22 : 20} />
            ),
            tabBarLabel: ({ focused }) => (
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: focused ? "bold" : "500",
                  color: focused ? colors.primary : colors.textLight,
                }}
              >
                Bookings
              </Text>
            ),
          }}
        />
      </Tabs>
    </>
  )
}

const styles = StyleSheet.create({
  /** Tab Styles **/
  tabBar: {
    height: Platform.OS === "ios" ? 60 : 58,
    paddingBottom: Platform.OS === "ios" ? 0 : 0,
    backgroundColor: "white",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    position: "absolute",
    overflow: "hidden",
    elevation: 1,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    marginTop: -1,
    color: colors.textLight,
  },
})
