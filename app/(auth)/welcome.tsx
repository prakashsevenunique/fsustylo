import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { router } from 'expo-router';

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
      <StatusBar style="auto" />
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

      {/* Overlay Content */}
      <View className="absolute bottom-16 w-full px-6 items-center">
        <Animated.View entering={FadeIn} exiting={FadeOut} key={slides[index].title}>
          <Text className="text-pink-500 text-lg font-bold">{slides[index].title}</Text>
        </Animated.View>

        <Animated.View entering={FadeIn} exiting={FadeOut} key={slides[index].subtitle}>
          <Text className="text-white text-2xl font-bold text-center mt-2">
            {slides[index].subtitle}
          </Text>
        </Animated.View>

        {/* Get Started Button */}
        <TouchableOpacity
          onPress={() => router.push('/login')}
          className="bg-pink-500 rounded-full py-3 px-6 mt-6 w-full items-center"
        >
          <Text className="text-white font-semibold text-lg">Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
