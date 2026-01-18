import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { EnergyLog } from '../../shared/types';
import { Button } from '../components/Button';
import { useStore } from '../hooks/useStore';

type Mood = EnergyLog['mood'];
type Focus = EnergyLog['focus'];

const moodOptions: {
  value: NonNullable<Mood>;
  emoji: string;
  label: string;
}[] = [
  { value: 'great', emoji: '😊', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'low', emoji: '😔', label: 'Low' },
  { value: 'rough', emoji: '😩', label: 'Rough' },
];

const focusOptions: {
  value: NonNullable<Focus>;
  emoji: string;
  label: string;
}[] = [
  { value: 'sharp', emoji: '🎯', label: 'Sharp' },
  { value: 'good', emoji: '👍', label: 'Good' },
  { value: 'scattered', emoji: '🌪️', label: 'Scattered' },
  { value: 'foggy', emoji: '🌫️', label: 'Foggy' },
];

export default function LogEnergyScreen() {
  const router = useRouter();
  const { logEnergy } = useStore();

  const [energyLevel, setEnergyLevel] = useState(5);
  const [mood, setMood] = useState<Mood>(undefined);
  const [focus, setFocus] = useState<Focus>(undefined);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await logEnergy({
      energyLevel,
      mood: mood || undefined,
      focus: focus || undefined,
      notes: notes || undefined,
    });
    setIsSubmitting(false);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Energy Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Energy Level</Text>
          <Text style={styles.energyValue}>{energyLevel}</Text>
          <View style={styles.sliderContainer}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.energyDot,
                  level <= energyLevel && styles.energyDotActive,
                ]}
                onPress={() => setEnergyLevel(level)}
              />
            ))}
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Exhausted</Text>
            <Text style={styles.sliderLabel}>Energized</Text>
          </View>
        </View>

        {/* Mood */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood</Text>
          <View style={styles.optionsRow}>
            {moodOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  mood === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => setMood(option.value)}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    mood === option.value && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Focus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Focus</Text>
          <View style={styles.optionsRow}>
            {focusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  focus === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => setFocus(option.value)}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    focus === option.value && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes (optional)</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Any context? Sleep, stress, caffeine..."
            placeholderTextColor="#9ca3af"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={isSubmitting ? 'Saving...' : 'Save Check-in'}
          onPress={handleSubmit}
          disabled={isSubmitting}
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
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  energyValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#8b5cf6',
    textAlign: 'center',
    marginBottom: 16,
  },
  sliderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  energyDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
  },
  energyDotActive: {
    backgroundColor: '#8b5cf6',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    minWidth: 64,
  },
  optionButtonSelected: {
    backgroundColor: '#f3e8ff',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  optionLabelSelected: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
});
