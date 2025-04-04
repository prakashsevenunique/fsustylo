import { UserContext } from "@/hooks/userInfo";
import axiosInstance from "@/utils/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Animated, Image } from "react-native";
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

const CELL_COUNT = 4;

export default function OTPInputScreen({ mobile }) {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value: otp, setValue: setOtp });
    const { token, setToken } = useContext(UserContext);

    const animatedValues = [...new Array(CELL_COUNT)].map(() => new Animated.Value(1));

    const animateCell = (index, toValue) => {
        Animated.timing(animatedValues[index], {
            toValue,
            duration: 300,
            useNativeDriver: false
        }).start();
    };

    async function verifyOtp() {
        setLoading(true)
        try {
            const response = await axiosInstance.post('/api/user/verify-otp', {
                mobileNumber: mobile,
                otp: otp
            });
            await AsyncStorage.setItem('userData', JSON.stringify(response.data.token));
            console.log(response.data)
            setToken(response.data?.token);
            router.push("/")
        } catch (error) {
            console.error('Error verifying OTP:', error.response);
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        console.log(token);
    }, [token])

    return (
        <View className="flex-1 items-center justify-center bg-white px-2">
            <Image source={require("@/assets/img/otp.jpg")} className="w-40 h-40 mb-4" resizeMode="contain" />
            <Text className="text-gray-900 text-2xl font-bold mb-2">OTP Verification</Text>
            <Text className="text-gray-600 text-center mb-6">Enter the 4-digit OTP sent to your mobile</Text>
            <CodeField
                ref={ref}
                {...props}
                value={otp}
                onChangeText={setOtp}
                cellCount={CELL_COUNT}
                rootStyle={{ marginTop: 10, width: "80%" }}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => {
                    if (isFocused) animateCell(index, 1.1);
                    else animateCell(index, 1);

                    return (
                        <Animated.View
                            key={index}
                            style={{
                                borderWidth: 1,
                                borderColor: isFocused ? "#FF1493" : "#ddd",
                                width: 45,
                                height: 45,
                                borderRadius: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                margin: 1,
                                transform: [{ scale: animatedValues[index] }],
                            }}
                            onLayout={getCellOnLayoutHandler(index)}
                        >
                            <Text className="text-black text-2xl">{symbol || " "}</Text>
                        </Animated.View>
                    );
                }}
            />
            {/* <View className="flex-row justify-center mt-4">
                <Text className="text-gray-600 text-sm">Didn't receive OTP?</Text>
                <TouchableOpacity onPress={() => console.log("Resend OTP")}>
                    <Text className="text-pink-500 font-semibold text-sm ml-2">Resend</Text>
                </TouchableOpacity>
            </View> */}
            <TouchableOpacity
                className={`bg-pink-500 rounded-xl py-3 mt-6 w-40 ${loading ? "opacity-50" : ""}`}
                onPress={() => verifyOtp()}
                disabled={loading}
            >
                <Text className="text-white text-lg font-semibold text-center">
                    {loading ? "Verifying..." : "Verify OTP"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}
