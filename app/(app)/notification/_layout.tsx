import PolicyScreen from '@/app/(auth)/policy';
import { Stack } from 'expo-router';

export default function Notification() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false
        }}
      />
    </Stack>
  );
}