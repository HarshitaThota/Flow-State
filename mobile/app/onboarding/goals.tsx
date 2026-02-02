import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Chronotype } from '../../../shared/types';
import { Button } from '../../components/Button';
import { ProgressDots } from '../../components/ProgressDots';
import { useStore } from '../../hooks/useStore';

const goalOptions = [
  {
    id: 'deep_work',
    label: 'Deep work & focus',
    emoji: '🎯',
    description: 'Protect time for concentrated thinking',
  },
  {
    id: 'exercise',
    label: 'Consistent exercise',
    emoji: '💪',
    description: 'Find optimal workout windows',
  },
  {
    id: 'creativity',
    label: 'Creative projects',
    emoji: '🎨',
    description: 'Schedule creative work when inspired',
  },
  {
    id: 'learning',
    label: 'Learning & study',
    emoji: '📚',
    description: 'Absorb information more effectively',
  },
  {
    id: 'social',
    label: 'Social energy',
    emoji: '👥',
    description: 'Plan social time when energized',
  },
  {
    id: 'rest',
    label: 'Better rest',
    emoji: '😴',
    description: "Honor your body's need for recovery",
  },
];

export default function GoalsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    name: string;
    lastPeriodStart: string;
    cycleLength: string;
    periodLength: string;
    chronotype: Chronotype;
    tracksCycle: string;
  }>();

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const { setProfile, setOnboarded } = useStore();

  const toggleGoal = (id: string) => {
    setSelectedGoals((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

  const handleComplete = async () => {
    const tracksCycle = params.tracksCycle === 'true';

    // Create profile from onboarding data
    const profile = {
      id: Date.now().toString(),
      name: params.name,
      cycleLength: tracksCycle ? parseInt(params.cycleLength, 10) : undefined,
      periodLength: tracksCycle ? parseInt(params.periodLength, 10) : undefined,
      lastPeriodStart: tracksCycle ? params.lastPeriodStart : undefined,
      chronotype: params.chronotype,
      tracksCycle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await setProfile(profile);
    await setOnboarded(true);

    // Navigate to main app
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots total={4} current={3} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>What matters to you?</Text>
        <Text style={styles.subtitle}>
          Select the areas you want to optimize. Pick as many as you like.
        </Text>

        <View style={styles.options}>
          {goalOptions.map((goal) => (
            <TouchableOpacity
              key={goal.id}
              style={[
                styles.goalCard,
                selectedGoals.includes(goal.id) && styles.goalCardSelected,
              ]}
              onPress={() => toggleGoal(goal.id)}
            >
              <Text style={styles.goalEmoji}>{goal.emoji}</Text>
              <View style={styles.goalText}>
                <Text
                  style={[
                    styles.goalLabel,
                    selectedGoals.includes(goal.id) && styles.goalLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
                <Text
                  style={[
                    styles.goalDescription,
                    selectedGoals.includes(goal.id) &&
                      styles.goalDescriptionSelected,
                  ]}
                >
                  {goal.description}
                </Text>
              </View>
              {selectedGoals.includes(goal.id) && (
                <View style={styles.checkmark}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Start Using Flow State"
          onPress={handleComplete}
          disabled={selectedGoals.length === 0}
        />
        <Text style={styles.footerHint}>You can always change these later</Text>
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
    marginBottom: 24,
  },
  options: {
    gap: 12,
    paddingBottom: 24,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalCardSelected: {
    backgroundColor: '#f3e8ff',
    borderColor: '#8b5cf6',
  },
  goalEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  goalText: {
    flex: 1,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  goalLabelSelected: {
    color: '#6d28d9',
  },
  goalDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  goalDescriptionSelected: {
    color: '#7c3aed',
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  footerHint: {
    fontSize: 13,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 12,
  },
});
