import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
  Modal
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { UserContext } from '@/hooks/userInfo';
import axiosInstance from '@/utils/axiosInstance';
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import { imageBaseUrl } from '@/utils/helpingData';

type FormData = {
  name: string;
  email: string;
  gender: string;
};

export default function EditProfileScreen() {
  const { userInfo, setUserInfo,fetchUserInfo } = useContext(UserContext) as any;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [image, setImage] = useState<string | null>(userInfo?.profileImage || null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      gender: userInfo?.gender || '',
    },
  });

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your photos to upload a profile picture');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };


  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'We need access to your camera to take a profile picture');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
        exif: false,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;

        // Check file size
        const fileInfo = await getFileInfo(uri);
        if (fileInfo.size > 5 * 1024 * 1024) { // 5MB limit
          Alert.alert('File too large', 'Please select an image smaller than 5MB');
          return;
        }

        setSelectedImageUri(uri);
        setPreviewVisible(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const getFileInfo = async (fileUri: string) => {
    try {
      const fileInfo = await fetch(fileUri).then(response => {
        return {
          size: parseInt(response.headers.get('Content-Length') || '0'),
          type: response.headers.get('Content-Type')
        };
      });
      return fileInfo;
    } catch (error) {
      console.error('Error getting file info:', error);
      return { size: 0, type: 'unknown' };
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Profile Picture",
      "Choose a source",
      [
        {
          text: "Take Photo",
          onPress: takePhoto
        },
        {
          text: "Choose from Library",
          onPress: pickImage
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  const confirmImage = async () => {
    if (selectedImageUri) {
      setImage(selectedImageUri);
      setPreviewVisible(false);
      await uploadImage(selectedImageUri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!userInfo?._id) {
      Alert.alert('Error', 'User ID not found');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      const uriParts = uri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split('.').pop() || 'jpg';
      const mimeType = fileType === 'jpg' || fileType === 'jpeg' ? 'image/jpeg' : `image/${fileType}`;
      formData.append('profileImage', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        name: fileName || `profile_${Date.now()}.${fileType}`,
        type: mimeType,
      } as any);
      const response = await axiosInstance.post(`/api/user/user/${userInfo._id}/profile-photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Accept': 'application/json',
          },
        }
      );
      if (response.data) {
        fetchUserInfo();
        Alert.alert('Success', 'Profile picture updated successfully');
      }
    } catch (error) {
      console.error('Upload error:');
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!data.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!data.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (!data.gender) {
      Alert.alert('Error', 'Please select your gender');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `/api/user/update-profile/${userInfo._id}`,
        data
      );
      setUserInfo(response?.data?.user);
      Alert.alert('Success', 'Profile updated successfully');
      router.back();
    } catch (error) {
      console.error('Update profile error:', error.message);
      Alert.alert('Error', 'An error occurred while updating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow-md">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#E6007E" />
            </TouchableOpacity>
            <Text className="text-lg font-bold ml-3">Edit Profile</Text>
          </View>
        </View>
      </View>

      <ScrollView className="p-4">
        <View className="items-center mt-6">
          <View className="relative">
            <View className="w-28 h-28 rounded-full border-2 border-pink-100 overflow-hidden shadow-md">
              <Image
                source={{ uri: userInfo.profilePhoto ? `${imageBaseUrl}/${userInfo.profilePhoto}` : "https://static.vecteezy.com/system/resources/thumbnails/035/857/779/small/people-face-avatar-icon-cartoon-character-png.png" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <TouchableOpacity
              onPress={showImageOptions}
              className="absolute bottom-0 right-0 bg-pink-600 p-2.5 rounded-full border-2 border-white shadow-sm"
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Feather name="camera" size={16} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Text className="mt-3 text-pink-600 text-lg font-semibold">{userInfo?.name || "Your Name"}</Text>
          <View className='flex-row items-center gap-1 mt-1'>
            <Ionicons name="checkmark-circle" size={16} color="#38bdf8" />
            <Text className="text-gray-600">{userInfo?.mobileNumber || "Mobile Number"}</Text>
          </View>
        </View>

        {/* Form Fields */}
        <View className="mt-8">
          {/* Name Input */}
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Full Name</Text>
            <Controller
              control={control}
              rules={{
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} p-4 rounded-lg`}
                  placeholder="Enter full name"
                />
              )}
              name="name"
            />
            {errors.name && (
              <Text className="text-red-500 text-xs mt-1">{errors.name.message}</Text>
            )}
          </View>

          {/* Phone Number Input (disabled if verified) */}
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Phone Number</Text>
            <TextInput
              value={userInfo?.mobileNumber}
              className="border border-gray-300 p-4 rounded-lg bg-gray-100"
              placeholder="Enter phone number"
              keyboardType="phone-pad"
              editable={false}
            />
            {userInfo?.mobileNumber && (
              <Text className="text-green-600 text-xs mt-1">Verified <Ionicons name="checkmark-circle" size={12} color="green" /></Text>
            )}
          </View>

          {/* Email Input */}
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Email Address</Text>
            <Controller
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} p-4 rounded-lg`}
                  placeholder="Enter Email Address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              )}
              name="email"
            />
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>
            )}
          </View>

          {/* Gender Selection */}
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Gender</Text>
            <Controller
              control={control}
              rules={{ required: 'Gender is required' }}
              render={({ field: { onChange, value } }) => (
                <View className="flex-row space-x-4 gap-3">
                  <TouchableOpacity
                    onPress={() => onChange('male')}
                    className={`flex-1 p-3 rounded-lg border ${value === 'male' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`}
                  >
                    <Text className={`text-center ${value === 'male' ? 'text-pink-600 font-bold' : 'text-gray-600'}`}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => onChange('female')}
                    className={`flex-1 p-3 rounded-lg border ${value === 'female' ? 'border-pink-500 bg-pink-50' : 'border-gray-300'}`}
                  >
                    <Text className={`text-center ${value === 'female' ? 'text-pink-600 font-bold' : 'text-gray-600'}`}>Female</Text>
                  </TouchableOpacity>
                </View>
              )}
              name="gender"
            />
            {errors.gender && (
              <Text className="text-red-500 text-xs mt-1">{errors.gender.message}</Text>
            )}
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className={`mt-6 p-4 rounded-lg items-center ${isLoading ? 'bg-pink-400' : 'bg-pink-600'}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white font-semibold ml-2">Saving...</Text>
              </View>
            ) : (
              <Text className="text-white font-semibold">Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={previewVisible}
        onRequestClose={() => setPreviewVisible(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center p-4">
          <View className="bg-white rounded-xl overflow-hidden w-full max-w-md">
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-lg font-bold text-gray-800">Preview Profile Picture</Text>
              <TouchableOpacity onPress={() => setPreviewVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View className="items-center justify-center p-4">
              {selectedImageUri && (
                <Image
                  source={{ uri: selectedImageUri }}
                  className="w-64 h-64 rounded-full"
                  resizeMode="cover"
                />
              )}
            </View>

            <View className="p-4 flex-row">
              <TouchableOpacity
                onPress={() => setPreviewVisible(false)}
                className="flex-1 mr-2 bg-gray-200 p-3 rounded-lg items-center"
              >
                <Text className="font-semibold text-gray-700">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmImage}
                className="flex-1 ml-2 bg-pink-600 p-3 rounded-lg items-center"
              >
                <Text className="font-semibold text-white">Use This Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}