import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../hooks/useStore';

export default function RootLayout() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { initialize, isLoading: storeLoading, isOnboarded } = useStore();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isAuthenticated) {
      initialize();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (authLoading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inOnboarding = segments[0] === 'onboarding';

    if (!isAuthenticated && !inAuthGroup) {
      // Not signed in, redirect to auth
      router.replace('/auth/sign-in');
    } else if (isAuthenticated && inAuthGroup) {
      // Signed in but on auth screen, check onboarding
      if (isOnboarded) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    } else if (isAuthenticated && !storeLoading) {
      // Signed in and store loaded
      if (!isOnboarded && !inOnboarding) {
        router.replace('/onboarding');
      } else if (isOnboarded && inOnboarding) {
        router.replace('/(tabs)');
      }
    }
  }, [authLoading, isAuthenticated, storeLoading, isOnboarded, segments]);

  if (authLoading || (isAuthenticated && storeLoading)) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#ffffff' },
        }}
      >
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
