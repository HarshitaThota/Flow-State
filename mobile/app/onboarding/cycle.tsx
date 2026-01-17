import DateTimePicker from '@react-native-community/datetimepicker';
import { format, subDays } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from '../../components/Button';
import { ProgressDots } from '../../components/ProgressDots';

export default function CycleScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();

  const [lastPeriodStart, setLastPeriodStart] = useState(
    subDays(new Date(), 14),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);

  const cycleLengthOptions = [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
  const periodLengthOptions = [3, 4, 5, 6, 7, 8];

  return (
    <SafeAreaView style={styles.container}>
      <ProgressDots total={4} current={1} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Let's learn your cycle</Text>
        <Text style={styles.subtitle}>
          This helps predict your energy patterns throughout the month
        </Text>

        {/* Last Period Start */}
        <View style={styles.section}>
          <Text style={styles.label}>When did your last period start?</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {format(lastPeriodStart, 'MMMM d, yyyy')}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={lastPeriodStart}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={(_event, date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (date) setLastPeriodStart(date);
              }}
            />
          )}
        </View>

        {/* Cycle Length */}
        <View style={styles.section}>
          <Text style={styles.label}>Average cycle length (days)</Text>
          <Text style={styles.hint}>
            From the start of one period to the start of the next
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.optionsRow}
          >
            {cycleLengthOptions.map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.option,
                  cycleLength === days && styles.optionSelected,
                ]}
                onPress={() => setCycleLength(days)}
              >
                <Text
                  style={[
                    styles.optionText,
                    cycleLength === days && styles.optionTextSelected,
                  ]}
                >
                  {days}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Period Length */}
        <View style={styles.section}>
          <Text style={styles.label}>Average period length (days)</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.optionsRow}
          >
            {periodLengthOptions.map((days) => (
              <TouchableOpacity
                key={days}
                style={[
                  styles.option,
                  periodLength === days && styles.optionSelected,
                ]}
                onPress={() => setPeriodLength(days)}
              >
                <Text
                  style={[
                    styles.optionText,
                    periodLength === days && styles.optionTextSelected,
                  ]}
                >
                  {days}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            Don't worry if you're not sure - these are estimates. The app will
            learn your actual patterns over time.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={() =>
            router.push({
              pathname: '/onboarding/chronotype',
              params: {
                name,
                lastPeriodStart: lastPeriodStart.toISOString(),
                cycleLength: cycleLength.toString(),
                periodLength: periodLength.toString(),
              },
            })
          }
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
  },
  section: {
    marginBottom: 28,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  hint: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
  },
  dateButton: {
    backgroundColor: '#f3e8ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  dateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#7c3aed',
    textAlign: 'center',
  },
  optionsRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  option: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  optionSelected: {
    backgroundColor: '#8b5cf6',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
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
});
