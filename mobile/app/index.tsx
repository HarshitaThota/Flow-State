import { Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../hooks/useStore';
import { useEffect } from 'react';

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { initialize, isLoading: storeLoading, isOnboarded } = useStore();

  useEffect(() => {
    if (isAuthenticated) {
      initialize();
    }
  }, [isAuthenticated]);

  // Show loading while determining auth state
  if (authLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  // Not authenticated - go to sign in
  if (!isAuthenticated) {
    return <Redirect href="/auth/sign-in" />;
  }

  // Authenticated but loading store
  if (storeLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#8b5cf6" />
      </View>
    );
  }

  // Authenticated and loaded - check onboarding
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  // Fully authenticated and onboarded
  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});
