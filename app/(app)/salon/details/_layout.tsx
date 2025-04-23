import { Stack } from 'expo-router';

export default function DetailLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                    presentation: 'modal'
                }}
            />
            <Stack.Screen
                name="reviews"
                options={{
                    headerShown: false,
                    presentation: 'modal'
                }}
            />
        </Stack>
    );
}