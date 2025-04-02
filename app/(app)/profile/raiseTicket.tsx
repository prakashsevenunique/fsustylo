import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { router } from 'expo-router';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { Menu, Divider } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';

export default function RaiseTicketScreen() {
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm() as any;
  const [menuVisible, setMenuVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const issueTypes = [
    'Order Related', 'Payment Issue', 'Product Defect', 'Delivery Problem', 'Account Issue', 'Other'
  ];
  
  const onSubmit = (data) => {
    Alert.alert('Ticket Submitted', 'Your support ticket has been submitted successfully.');
    router.back();
  };
  
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: ['image/*', 'application/pdf'],
      copyToCacheDirectory: false
    });
    console.log(result)
    if (!result.canceled) {
      if (result.assets[0]?.size > 2 * 1024 * 1024) {
        Alert.alert('File too large', 'Please select a file smaller than 2MB.');
      } else {
        setAttachments([...attachments, result]);
      }
    }
  };
  
  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-4 shadow-md">
        <View className="flex-row gap-2 items-center">
          <Ionicons onPress={() => router.back()} name="arrow-back" size={25} color="#E6007E" />
          <Text className="text-lg font-bold">Raise a Ticket</Text>
        </View>
      </View>
      <ScrollView className="p-4" contentContainerStyle={{ paddingBottom: 30 }}>
        <Controller
          control={control}
          name="subject"
          rules={{ required: 'Subject is required' }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">Subject</Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Briefly describe your issue"
                className={`border ${errors.subject ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg bg-white`}
              />
              {errors.subject && <Text className="text-red-500 text-xs mt-1">{errors.subject.message}</Text>}
            </View>
          )}
        />
        
        <View className="mb-4">
          <Text className="text-gray-700 mb-1 font-medium">Issue Type</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity onPress={() => setMenuVisible(true)} className="border border-gray-300 p-3 rounded-lg bg-white">
                <Text>{watch('issueType') || 'Select Issue Type'}</Text>
              </TouchableOpacity>
            }
          >
            {issueTypes.map((type, index) => (
              <Menu.Item key={index} onPress={() => { setValue('issueType', type); setMenuVisible(false); }} title={type} />
            ))}
          </Menu>
          {errors.issueType && <Text className="text-red-500 text-xs mt-1">{errors.issueType.message}</Text>}
        </View>
        
        <Controller
          control={control}
          name="description"
          rules={{ required: 'Description is required', minLength: { value: 20, message: 'At least 20 characters required' } }}
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
              <Text className="text-gray-700 mb-1 font-medium">Description</Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="Describe your issue in detail"
                multiline
                numberOfLines={5}
                style={{ textAlignVertical: 'top' }}
                className={`border ${errors.description ? 'border-red-500' : 'border-gray-300'} p-3 rounded-lg bg-white h-32`}
              />
              {errors.description && <Text className="text-red-500 text-xs mt-1">{errors.description.message}</Text>}
            </View>
          )}
        />
        
        <View className="mb-6">
          <Text className="text-gray-700 mb-1 font-medium">Attachments (Max: 2MB)</Text>
          <TouchableOpacity onPress={pickDocument} className="border border-gray-300 border-dashed p-4 rounded-lg items-center">
            <Feather name="paperclip" size={24} color="#E6007E" />
            <Text className="text-pink-600 mt-2">Add Screenshots or Files</Text>
          </TouchableOpacity>
          {attachments.length > 0 && (
            <View className="mt-2">
              {attachments.map((file:any, index) => (
                <View key={index} className="flex-row items-center bg-gray-100 p-2 rounded mb-1">
                  <MaterialIcons name="insert-drive-file" size={20} color="#666" />
                  <Text className="ml-2 text-black flex-1">{file.assets[0]?.name || "file"}</Text>
                  <TouchableOpacity onPress={() => setAttachments(attachments.filter((_, i) => i !== index))}>
                    <MaterialIcons name="close" size={20} color="#E6007E" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <TouchableOpacity onPress={handleSubmit(onSubmit)} className="bg-pink-600 p-4 rounded-lg items-center">
          <Text className="text-white font-bold">Submit Ticket</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}