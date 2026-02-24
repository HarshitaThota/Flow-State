import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { useStore } from '../hooks/useStore';

type Severity = 0 | 1 | 2 | 3;
type SleepQuality = 'great' | 'good' | 'okay' | 'poor' | 'terrible';

const symptoms = [
  { id: 'cramps', label: 'Cramps', emoji: '😣' },
  { id: 'headache', label: 'Headache', emoji: '🤕' },
  { id: 'bloating', label: 'Bloating', emoji: '🎈' },
  { id: 'breast_tenderness', label: 'Breast tenderness', emoji: '💔' },
  { id: 'fatigue', label: 'Fatigue', emoji: '😴' },
  { id: 'cravings', label: 'Cravings', emoji: '🍫' },
  { id: 'mood_swings', label: 'Mood swings', emoji: '🎭' },
  { id: 'anxiety', label: 'Anxiety', emoji: '😰' },
  { id: 'acne', label: 'Acne', emoji: '😖' },
];

const severityLabels = ['None', 'Mild', 'Moderate', 'Severe'];
const sleepOptions: { value: SleepQuality; emoji: string; label: string }[] = [
  { value: 'great', emoji: '😴', label: 'Great' },
  { value: 'good', emoji: '🙂', label: 'Good' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'poor', emoji: '😔', label: 'Poor' },
  { value: 'terrible', emoji: '😫', label: 'Terrible' },
];

export default function LogSymptomsScreen() {
  const router = useRouter();
  const { logSymptoms } = useStore();
  const [symptomValues, setSymptomValues] = useState<Record<string, Severity>>({});
  const [sleepHours, setSleepHours] = useState('');
  const [sleepQuality, setSleepQuality] = useState<SleepQuality | null>(null);
  const [exercised, setExercised] = useState(false);
  const [exerciseMinutes, setExerciseMinutes] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setSymptomSeverity = (symptomId: string, severity: Severity) => {
    setSymptomValues((prev) => ({ ...prev, [symptomId]: severity }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await logSymptoms({
        symptoms: symptomValues,
        sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
        sleepQuality: sleepQuality ?? undefined,
        exercised,
        exerciseMinutes: exerciseMinutes ? parseInt(exerciseMinutes, 10) : undefined,
        notes: notes || undefined,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to save symptoms. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>Cancel</Text>
      </TouchableOpacity>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>Track symptoms to find patterns</Text>
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Symptoms</Text>
          {symptoms.map((symptom) => (
            <View key={symptom.id} style={styles.symptomRow}>
              <View style={styles.symptomLabel}>
                <Text style={styles.symptomEmoji}>{symptom.emoji}</Text>
                <Text style={styles.symptomText}>{symptom.label}</Text>
              </View>
              <View style={styles.severityButtons}>
                {([0, 1, 2, 3] as Severity[]).map((severity) => (
                  <TouchableOpacity
                    key={severity}
                    style={[
                      styles.severityButton,
                      symptomValues[symptom.id] === severity &&
                        styles.severityButtonSelected,
                      severity === 3 && styles.severityButtonSevere,
                      symptomValues[symptom.id] === severity &&
                        severity === 3 &&
                        styles.severityButtonSevereSelected,
                    ]}
                    onPress={() => setSymptomSeverity(symptom.id, severity)}
                  >
                    <Text
                      style={[
                        styles.severityButtonText,
                        symptomValues[symptom.id] === severity &&
                          styles.severityButtonTextSelected,
                      ]}
                    >
                      {severity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
          <View style={styles.severityLegend}>
            {severityLabels.map((label, i) => (
              <Text key={label} style={styles.legendText}>
                {i} = {label}
              </Text>
            ))}
          </View>
        </View>

        {/* Sleep */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sleep</Text>
          <View style={styles.sleepRow}>
            <Text style={styles.inputLabel}>Hours slept</Text>
            <TextInput
              style={styles.numberInput}
              value={sleepHours}
              onChangeText={setSleepHours}
              placeholder="7.5"
              keyboardType="decimal-pad"
            />
          </View>
          <Text style={styles.inputLabel}>Sleep quality</Text>
          <View style={styles.optionsRow}>
            {sleepOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionButton,
                  sleepQuality === option.value && styles.optionButtonSelected,
                ]}
                onPress={() => setSleepQuality(option.value)}
              >
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    sleepQuality === option.value && styles.optionLabelSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Exercise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise</Text>
          <TouchableOpacity
            style={[styles.exerciseToggle, exercised && styles.exerciseToggleActive]}
            onPress={() => setExercised(!exercised)}
          >
            <Text style={styles.exerciseEmoji}>{exercised ? '✅' : '🏃‍♀️'}</Text>
            <Text
              style={[
                styles.exerciseText,
                exercised && styles.exerciseTextActive,
              ]}
            >
              {exercised ? 'Yes, I exercised today!' : 'Did you exercise?'}
            </Text>
          </TouchableOpacity>
          {exercised && (
            <View style={styles.exerciseDetails}>
              <Text style={styles.inputLabel}>Minutes</Text>
              <TextInput
                style={styles.numberInput}
                value={exerciseMinutes}
                onChangeText={setExerciseMinutes}
                placeholder="30"
                keyboardType="number-pad"
              />
            </View>
          )}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notes</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Anything else you want to remember..."
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Save" onPress={handleSubmit} disabled={isSubmitting} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  closeButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  closeText: {
    fontSize: 16,
    color: '#6b7280',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  symptomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  symptomLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symptomEmoji: {
    fontSize: 20,
    marginRight: 10,
  },
  symptomText: {
    fontSize: 15,
    color: '#374151',
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  severityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityButtonSelected: {
    backgroundColor: '#8b5cf6',
  },
  severityButtonSevere: {
    backgroundColor: '#fee2e2',
  },
  severityButtonSevereSelected: {
    backgroundColor: '#ef4444',
  },
  severityButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  severityButtonTextSelected: {
    color: '#ffffff',
  },
  severityLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  legendText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sleepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
  },
  numberInput: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
    width: 80,
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    minWidth: 60,
  },
  optionButtonSelected: {
    backgroundColor: '#f3e8ff',
  },
  optionEmoji: {
    fontSize: 20,
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
  exerciseToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
  },
  exerciseToggleActive: {
    backgroundColor: '#dcfce7',
  },
  exerciseEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  exerciseText: {
    fontSize: 16,
    color: '#6b7280',
  },
  exerciseTextActive: {
    color: '#166534',
    fontWeight: '600',
  },
  exerciseDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  notesInput: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  spacer: {
    height: 40,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
});
