import { useEffect, useState } from "react"
import { View, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions } from "react-native"
import { StatusBar } from "expo-status-bar"
import Animated, { FadeIn, FadeOut, SlideInRight, SlideOutLeft } from "react-native-reanimated"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

const { width, height } = Dimensions.get("window")

const slides = [
  {
    image: require("@/assets/img/banner1.jpg"),
    title: "AT SALON",
    subtitle: "Schedule your salon service appointment.",
  },
  {
    image: require("@/assets/img/banner2.jpeg"),
    title: "STYLING EXPERTS",
    subtitle: "Get the best professional hair styling.",
  }
]

export default function WelcomeScreen() {
  const [index, setIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % slides.length)
        setIsAnimating(false)
      }, 500)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleSkip = () => {
    router.push("/login")
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.darkOverlay} />

      <View style={styles.imageContainer}>
        <Animated.View
          entering={FadeIn.duration(1500)}
          exiting={FadeOut.duration(1500)}
          key={`image-${index}`}
          style={styles.fullSize}
        >
          <Image source={slides[index].image} style={styles.backgroundImage} resizeMode="cover" />

          {/* Bottom gradient shadow for better text visibility */}
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.7)", "rgba(0,0,0,0.9)"]}
            style={styles.bottomGradient}
          />
        </Animated.View>
      </View>

      {/* Centered Logo */}
      <View style={styles.logoWrapper}>
        <View style={styles.logoContainer}>
          <Image source={require("@/assets/img/logo.png")} style={styles.logo} resizeMode="contain" />
        </View>
      </View>

      {/* Overlay Content */}
      <View style={styles.contentContainer}>
        <Animated.View
          entering={SlideInRight.duration(800)}
          exiting={SlideOutLeft.duration(500)}
          key={`title-${index}`}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>{slides[index].title}</Text>
        </Animated.View>

        <Animated.View
          entering={SlideInRight.duration(800).delay(200)}
          exiting={SlideOutLeft.duration(500)}
          key={`subtitle-${index}`}
          style={styles.subtitleContainer}
        >
          <Text style={styles.subtitle}>{slides[index].subtitle}</Text>
        </Animated.View>

        {/* Get Started Button with enhanced shadow */}
        <TouchableOpacity onPress={() => router.push("/login")} style={styles.buttonContainer} activeOpacity={0.8}>
          <LinearGradient
            colors={["#fa9421", "#c23d02"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>GET STARTED</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  darkOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 1,
  },
  imageContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  fullSize: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5, // Cover bottom half of screen with gradient
    zIndex: 2,
  },
  logoWrapper: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  logoContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.66)",
    borderRadius: 100,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 15,
  },
  logo: {
    width: 120,
    height: 120,
  },
  contentContainer: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "center",
    zIndex: 10,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    color: "#f59e0b",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  subtitleContainer: {
    marginBottom: 24,
  },
  subtitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  buttonContainer: {
    width: "100%",
    marginTop: 16,
    shadowColor: "#831843",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 20,
    elevation: 15,
  },
  buttonGradient: {
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    letterSpacing: 2,
  },
  dotsContainer: {
    position: "absolute",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    bottom: 160,
    zIndex: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#f59e0b",
  },
  skipButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  skipText: {
    color: "white",
    fontWeight: "600",
  },
})
