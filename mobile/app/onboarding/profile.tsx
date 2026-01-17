import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Button } from '../../components/Button';
import { ProgressDots } from '../../components/ProgressDots';

export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  const canContinue = name.trim().length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ProgressDots total={4} current={0} />

        <View style={styles.content}>
          <Text style={styles.title}>What should I call you?</Text>
          <Text style={styles.subtitle}>
            This helps personalize your experience
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            autoFocus
            autoCapitalize="words"
            returnKeyType="next"
            onSubmitEditing={() =>
              canContinue &&
              router.push({ pathname: '/onboarding/cycle', params: { name } })
            }
          />
        </View>

        <View style={styles.footer}>
          <Button
            title="Continue"
            onPress={() =>
              router.push({ pathname: '/onboarding/cycle', params: { name } })
            }
            disabled={!canContinue}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
  },
  input: {
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    color: '#1f2937',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
