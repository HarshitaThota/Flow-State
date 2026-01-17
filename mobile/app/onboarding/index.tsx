import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../components/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🌊</Text>
        <Text style={styles.title}>Flow State</Text>
        <Text style={styles.subtitle}>
          Your energy isn't the same every day.{'\n'}
          Let's work with your natural rhythms, not against them.
        </Text>

        <View style={styles.features}>
          <FeatureItem
            emoji="🔄"
            title="Cycle-Aware"
            description="Recommendations adapt to your hormonal phases"
          />
          <FeatureItem
            emoji="⚡"
            title="Energy Tracking"
            description="Learn when you're sharpest vs when to rest"
          />
          <FeatureItem
            emoji="🎯"
            title="Smart Scheduling"
            description="Match tasks to your optimal energy windows"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Get Started"
          onPress={() => router.push('/onboarding/profile')}
        />
        <Text style={styles.privacy}>
          Your data stays on your device. Always.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.featureItem}>
      <Text style={styles.featureEmoji}>{emoji}</Text>
      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  features: {
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  featureEmoji: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  privacy: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
  },
});
