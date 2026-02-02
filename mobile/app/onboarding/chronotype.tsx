import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { Chronotype } from '../../../shared/types';
import { Button } from '../../components/Button';
import { ProgressDots } from '../../components/ProgressDots';
import { SelectOption } from '../../components/SelectOption';

const chronotypeOptions: {
  value: Chronotype;
  label: string;
  description: string;
  emoji: string;
}[] = [
  {
    value: 'early_bird',
    label: 'Early Bird',
    description: 'Most alert in the morning, energy dips in the evening',
    emoji: '🌅',
  },
  {
    value: 'night_owl',
    label: 'Night Owl',
    description: 'Slow mornings, peak energy in the afternoon/evening',
    emoji: '🦉',
  },
  {
    value: 'third_bird',
    label: 'Third Bird',
    description: 'Somewhere in between - flexible energy patterns',
    emoji: '🐦',
  },
];

export default function ChronotypeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string;
    lastPeriodStart: string;
    cycleLength: string;
    periodLength: string;
    tracksCycle: string;
  }>();

  const [chronotype, setChronotype] = useState<Chronotype | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots total={4} current={2} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>When are you sharpest?</Text>
        <Text style={styles.subtitle}>
          Your natural energy rhythm helps us suggest the best times for
          different tasks
        </Text>

        <View style={styles.options}>
          {chronotypeOptions.map((option) => (
            <SelectOption
              key={option.value}
              label={option.label}
              description={option.description}
              emoji={option.emoji}
              selected={chronotype === option.value}
              onPress={() => setChronotype(option.value)}
            />
          ))}
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoEmoji}>🧬</Text>
          <Text style={styles.infoText}>
            About 25% of people are true early birds, 25% night owls, and 50%
            somewhere in between. This is largely genetic!
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() =>
            router.push({
              pathname: '/onboarding/goals',
              params: {
                ...params,
                chronotype,
              },
            })
          }
          disabled={!chronotype}
        />
      </View>
    </SafeAreaView>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    marginTop: 24,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 32,
    lineHeight: 24,
  },
  options: {
    marginBottom: 24,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#ede9fe',
    padding: 16,
    borderRadius: 12,
  },
  infoEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#5b21b6',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
});
