import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from "expo-location";
import axiosInstance from '@/utils/axiosInstance';
import { router } from 'expo-router';

export const UserContext = createContext({});

export const UserProvider = ({ children }: any) => {
    const [userInfo, setUserInfo] = useState<any>(null);
    const [location, setlocation] = useState<any>({})
    const [token, setToken] = useState<string>('');
    const [city , setCity] = useState<string>('')


    const getAuthToken = async () => {
        const userData = await AsyncStorage.getItem('userData') || '';
        const authToken = JSON.parse(userData);
        setToken(authToken)
    };

    const getCurrentLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            alert("Permission to access location was denied.");
            return;
        }
        let userLocation = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = userLocation.coords;
        const locationData = {
            latitude: latitude,
            longitude: longitude
        }
        setlocation(locationData)
    };

    const fetchAddress = async () => {
        if(!location.latitude && !location.longitude) return;
        try {
            let result = await Location.reverseGeocodeAsync(location) as any;
            if (result.length > 0) {
                const address = `${result[0].name}, ${result[0].street}, ${result[0].city}, ${result[0].region}, ${result[0].country}`;
                console.log(address)
                setCity(result[0].city)
            }
        } catch (error) {
            console.error("Error fetching address:", error);
        }
    };

    const updateLocation = async (mobileNumber: string, latitude: string, longitude: string) => {
        try {
            console.log(mobileNumber)
            const response = await axiosInstance.post(
                '/api/user/update-location', {
                mobileNumber,
                latitude,
                longitude
            },
            );
            console.log("location updated");
        } catch (error: any) {
            console.log("location", error.message)
        }
    };

    const fetchUserInfo = async () => {
        try {
            if (token) {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };
                const response = await axiosInstance.get('/api/user/user-info', config);
                setUserInfo(response.data?.user);
            } else {
                console.error('No token found!');
            }
        } catch (error: any) {
            console.error('Error fetching user info:', error.response);
            if (error.response) {
                if (error.response.status === 401) {
                    await AsyncStorage.removeItem('userData');
                    router.push('/welcome');
                }
            }
        }
    };


    useEffect(() => {
        getCurrentLocation()
    }, [])

    useEffect(() => {
        if(location){
            fetchAddress()
        }
    },[location.latitude])
    

    useEffect(() => {
        if (!token) {
            getAuthToken();
        }
        if (token) {
            fetchUserInfo();
        }
    }, [token]);

    useEffect(() => {
        if (userInfo && location) {
            updateLocation(userInfo?.mobileNumber, location.latitude, location.longitude)
        }
    }, [userInfo, location])

    return (
        <UserContext.Provider value={{ userInfo, token,city, setToken, location, setUserInfo }}>
            {children}
        </UserContext.Provider>
    );
};
