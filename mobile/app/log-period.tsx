import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../components/Button';
import { useStore } from '../hooks/useStore';

export default function LogPeriodScreen() {
  const router = useRouter();
  const { updateLastPeriod, profile } = useStore();
  const [selectedDate, setSelectedDate] = useState<'today' | 'yesterday' | null>(
    'today'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const handleSubmit = async () => {
    if (!selectedDate) return;

    setIsSubmitting(true);

    const date = selectedDate === 'today' ? today : yesterday;
    await updateLastPeriod(date.toISOString());

    setIsSubmitting(false);

    Alert.alert(
      'Period logged! 🩸',
      `Your cycle has been updated. Day 1 starts ${selectedDate === 'today' ? 'today' : 'yesterday'}.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🩸</Text>
          <Text style={styles.title}>Log Period Start</Text>
          <Text style={styles.subtitle}>
            This updates your cycle tracking and predictions
          </Text>
        </View>

        <View style={styles.options}>
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedDate === 'today' && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedDate('today')}
          >
            <Text style={styles.optionEmoji}>📅</Text>
            <View style={styles.optionText}>
              <Text
                style={[
                  styles.optionTitle,
                  selectedDate === 'today' && styles.optionTitleSelected,
                ]}
              >
                Today
              </Text>
              <Text style={styles.optionDate}>{format(today, 'EEEE, MMMM d')}</Text>
            </View>
            {selectedDate === 'today' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedDate === 'yesterday' && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedDate('yesterday')}
          >
            <Text style={styles.optionEmoji}>⏪</Text>
            <View style={styles.optionText}>
              <Text
                style={[
                  styles.optionTitle,
                  selectedDate === 'yesterday' && styles.optionTitleSelected,
                ]}
              >
                Yesterday
              </Text>
              <Text style={styles.optionDate}>
                {format(yesterday, 'EEEE, MMMM d')}
              </Text>
            </View>
            {selectedDate === 'yesterday' && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {profile && (
          <View style={styles.infoBox}>
            <Text style={styles.infoEmoji}>💡</Text>
            <Text style={styles.infoText}>
              Your average cycle is {profile.cycleLength} days. Logging your period
              helps improve predictions over time.
            </Text>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button
          title="Log Period Start"
          onPress={handleSubmit}
          disabled={!selectedDate || isSubmitting}
        />
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
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
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  options: {
    gap: 12,
    marginBottom: 24,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    backgroundColor: '#fce4ec',
    borderColor: '#e91e63',
  },
  optionEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  optionTitleSelected: {
    color: '#c2185b',
  },
  optionDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  checkmark: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e91e63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
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
    color: '#92400e',
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 16,
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
