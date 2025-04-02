import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { TextInput, Button, Divider } from "react-native-paper";
import { router } from "expo-router";

type FormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export default function SignUpScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log("Signup Data:", data);
  };

  const inputStyle = {
    backgroundColor: "white",
  };

  const outlineStyle = (error: boolean) => ({
    borderRadius: 12,
    borderColor: error ? "#ef4444" : "#e5e7eb",
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="bg-gray-100">
        {/* Header */}
        <View className="items-center justify-center bg-blue-600 h-52 rounded-b-[40px] mb-5">
          <Text className="text-white text-3xl font-bold">Let's Get Started!</Text>
          <Text className="text-blue-200 text-sm mt-2">Create an account to access all features</Text>
        </View>

        <View className="px-3 flex-grow">
          <Text className="text-2xl font-semibold text-gray-800 mb-4">Sign Up</Text>
          <Divider className="mb-4" />

          {/* Name Input */}
          <View className="mb-2">
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Full Name"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  error={!!errors.name}
                  left={<TextInput.Icon icon="account" size={20} />}
                  style={inputStyle}
                  outlineStyle={outlineStyle(!!errors.name)}
                  theme={{ colors: { primary: "#2563eb" } }}
                />
              )}
            />
            {errors.name && <Text className="text-red-500 text-sm mt-1">{errors.name.message}</Text>}
          </View>

          {/* Email Input */}
          <View className="mb-2">
            <Controller
              control={control}
              name="email"
              rules={{ required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" } }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Email"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  error={!!errors.email}
                  left={<TextInput.Icon icon="email" size={20} />}
                  style={inputStyle}
                  outlineStyle={outlineStyle(!!errors.email)}
                  theme={{ colors: { primary: "#2563eb" } }}
                />
              )}
            />
            {errors.email && <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>}
          </View>

          {/* Phone Input */}
          <View className="mb-2">
            <Controller
              control={control}
              name="phone"
              rules={{ required: "Phone is required", minLength: { value: 10, message: "Must be 10 digits" } }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Phone"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  keyboardType="phone-pad"
                  error={!!errors.phone}
                  left={<TextInput.Icon icon="phone" size={20} />}
                  style={inputStyle}
                  outlineStyle={outlineStyle(!!errors.phone)}
                  theme={{ colors: { primary: "#2563eb" } }}
                />
              )}
            />
            {errors.phone && <Text className="text-red-500 text-sm mt-1">{errors.phone.message}</Text>}
          </View>

          {/* Password Input */}
          <View className="mb-2">
            <Controller
              control={control}
              name="password"
              rules={{
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Password"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  error={!!errors.password}
                  left={<TextInput.Icon icon="lock" size={20} />}
                  right={
                    <TextInput.Icon
                      size={20}
                      icon={showPassword ? "eye-off" : "eye"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                  style={inputStyle}
                  outlineStyle={outlineStyle(!!errors.password)}
                  theme={{ colors: { primary: "#2563eb" } }}
                />
              )}
            />
            {errors.password && <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>}
          </View>

          {/* Confirm Password Input */}
          <View className="mb-2">
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Confirm password is required",
                validate: (value) => value === control._formValues.password || "Passwords do not match",
              }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  label="Confirm Password"
                  value={value}
                  onChangeText={onChange}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  error={!!errors.confirmPassword}
                  left={<TextInput.Icon icon="lock-check" size={20} />}
                  right={
                    <TextInput.Icon
                      size={20}
                      icon={showConfirmPassword ? "eye-off" : "eye"}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                  style={inputStyle}
                  outlineStyle={outlineStyle(!!errors.confirmPassword)}
                  theme={{ colors: { primary: "#2563eb" } }}
                />
              )}
            />
            {errors.confirmPassword && <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</Text>}
          </View>

          <Button className="bg-blue-600 py-1 mt-5 mb-2" mode="contained" onPress={handleSubmit(onSubmit)}>
            Create Account
          </Button>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mb-3 pb-2">
          <Text className="text-gray-500">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-blue-600 font-bold">Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}