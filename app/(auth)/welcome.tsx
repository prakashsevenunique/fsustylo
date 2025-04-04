import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const slides = [
  {
    image: require('@/assets/img/banner1.jpg'),
    title: 'AT SALON',
    subtitle: 'Schedule your salon service appointment.',
  },
  {
    image: require('@/assets/img/banner2.jpeg'),
    title: 'STYLING EXPERTS',
    subtitle: 'Get the best professional hair styling.',
  },
  {
    image: require('@/assets/img/banner3.jpeg'),
    title: 'FRESH LOOK',
    subtitle: 'Enjoy a brand-new look with expert care.',
  }
];

export default function WelcomeScreen() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />
      
      {/* Full-screen dark overlay */}
      <View className="absolute w-full h-full bg-black/50 z-0" />
      
      {/* Animated Image */}
      <View className="absolute w-full h-full">
        <Animated.View
          entering={FadeIn.duration(1500)}
          exiting={FadeOut.duration(1500)}
          key={slides[index].image}
          className="absolute w-full h-full"
        >
          <Image
            source={slides[index].image}
            className="w-full h-full object-cover"
            resizeMode="cover"
          />
        </Animated.View>
      </View>

      {/* Centered Logo */}
      <View className="absolute top-0 bottom-0 left-0 right-0 justify-center items-center z-10">
        <View className="bg-white/10 rounded-full p-4" style={styles.logoContainer}>
          <Image 
            source={require('@/assets/img/logo.png')}
            className="w-32 h-32"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Overlay Content */}
      <View className="absolute bottom-20 w-full px-6 items-center z-10">
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut} 
          key={slides[index].title}
          className="mb-2"
        >
          <Text style={styles.textShadow} className="text-pink-400 text-2xl font-extrabold tracking-wider text-center">
            {slides[index].title}
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut} 
          key={slides[index].subtitle}
          className="mb-6"
        >
          <Text style={styles.textShadow} className="text-white text-xl font-medium text-center">
            {slides[index].subtitle}
          </Text>
        </Animated.View>

        {/* Get Started Button with custom shadow */}
        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="w-full mt-4"
          activeOpacity={0.8}
        >
          <View style={styles.buttonShadow}>
            <LinearGradient
              colors={['#ec4899', '#db2777']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-full py-4 px-6 items-center"
              style={styles.buttonGradient}
            >
              <Text className="text-white font-bold text-lg tracking-wider">
                GET STARTED
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  buttonShadow: {
    shadowColor: '#831843',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  buttonGradient: {
    shadowColor: '#831843',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  logoContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  }
});