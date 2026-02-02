import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="log-energy"
          options={{
            headerShown: true,
            title: 'Log Energy',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#ffffff' },
            headerTintColor: '#1f2937',
          }}
        />
        <Stack.Screen
          name="log-symptoms"
          options={{
            headerShown: true,
            title: 'Log Symptoms',
            presentation: 'modal',
            headerStyle: { backgroundColor: '#ffffff' },
            headerTintColor: '#1f2937',
          }}
        />
        <Stack.Screen
          name="log-period"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </>
  );
}
