import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, Image } from "react-native";
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

const CELL_COUNT = 4; // OTP length

export default function OTPInputScreen() {
    const [otp, setOtp] = useState("");
    const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value: otp, setValue: setOtp });

    // Animation for active cell
    const animatedValues = [...new Array(CELL_COUNT)].map(() => new Animated.Value(1));

    const animateCell = (index, toValue) => {
        Animated.timing(animatedValues[index], {
            toValue,
            duration: 300,
            useNativeDriver: false
        }).start();
    };

    return (
        <View className="flex-1 items-center justify-center bg-white px-6">

            {/* OTP Verification Image */}
            <Image source={require("@/assets/images/react-logo.png")} className="w-40 h-40 mb-4" resizeMode="contain" />

            {/* Title */}
            <Text className="text-gray-900 text-2xl font-bold mb-2">OTP Verification</Text>
            <Text className="text-gray-600 text-center mb-6">Enter the 4-digit OTP sent to your mobile</Text>

            {/* OTP Input Fields */}
            <CodeField
                ref={ref}
                {...props}
                value={otp}
                onChangeText={setOtp}
                cellCount={CELL_COUNT}
                rootStyle={{ marginTop: 10, width: "90%" }}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => {
                    if (isFocused) animateCell(index, 1.1);
                    else animateCell(index, 1);

                    return (
                        <Animated.View
                            key={index}
                            style={{
                                borderWidth: 2,
                                borderColor: isFocused ? "#FF1493" : "#ddd",
                                width: 50,
                                height: 50,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                transform: [{ scale: animatedValues[index] }],
                            }}
                            onLayout={getCellOnLayoutHandler(index)}
                        >
                            <Text className="text-black text-2xl">{symbol || " "}</Text>
                        </Animated.View>
                    );
                }}
            />

            {/* Resend OTP */}
            <View className="flex-row justify-center mt-4">
                <Text className="text-gray-600 text-sm">Didn't receive OTP?</Text>
                <TouchableOpacity onPress={() => console.log("Resend OTP")}>
                    <Text className="text-pink-500 font-semibold text-sm ml-2">Resend</Text>
                </TouchableOpacity>
            </View>

            {/* Verify OTP Button */}
            <TouchableOpacity className="bg-pink-500 rounded-xl py-3 mt-6 w-40" onPress={() => router.push("/")}>
                <Text className="text-white text-lg font-semibold text-center">Verify OTP</Text>
            </TouchableOpacity>
        </View>
    );
}
