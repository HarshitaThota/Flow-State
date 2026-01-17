import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStore } from '../../hooks/useStore';
import { getNextPeriodDate } from '../../utils/cycle';

const phaseColors = {
  menstrual: '#e91e63',
  follicular: '#4caf50',
  ovulation: '#ff9800',
  luteal: '#2196f3',
};

const phaseLabels = {
  menstrual: 'Period',
  follicular: 'Follicular',
  ovulation: 'Ovulation',
  luteal: 'Luteal',
};

export default function CycleScreen() {
  const { profile, cycleForecast, todayCycle } = useStore();
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  if (!profile || !todayCycle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const nextPeriod = getNextPeriodDate(profile);
  const daysUntilPeriod = Math.ceil(
    (nextPeriod.getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );

  const selectedDayInfo = selectedDay
    ? cycleForecast.find((d) => d.date === selectedDay)
    : todayCycle;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Stats */}
        <View style={styles.header}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{todayCycle.dayOfCycle}</Text>
            <Text style={styles.statLabel}>Cycle Day</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{daysUntilPeriod}</Text>
            <Text style={styles.statLabel}>Days until period</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{profile.cycleLength}</Text>
            <Text style={styles.statLabel}>Cycle length</Text>
          </View>
        </View>

        {/* Phase Legend */}
        <View style={styles.legend}>
          {Object.entries(phaseLabels).map(([phase, label]) => (
            <View key={phase} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  {
                    backgroundColor:
                      phaseColors[phase as keyof typeof phaseColors],
                  },
                ]}
              />
              <Text style={styles.legendLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarSection}>
          <Text style={styles.sectionTitle}>Next 30 Days</Text>
          <View style={styles.calendarGrid}>
            {cycleForecast.map((day) => {
              const isToday = day.date === format(new Date(), 'yyyy-MM-dd');
              const isSelected = day.date === selectedDay;

              return (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.calendarDay,
                    { backgroundColor: `${phaseColors[day.phase]}20` },
                    isToday && styles.calendarDayToday,
                    isSelected && styles.calendarDaySelected,
                  ]}
                  onPress={() => setSelectedDay(day.date)}
                >
                  <Text
                    style={[
                      styles.calendarDayNumber,
                      { color: phaseColors[day.phase] },
                      isToday && styles.calendarDayNumberToday,
                    ]}
                  >
                    {format(parseISO(day.date), 'd')}
                  </Text>
                  {day.periodStart && (
                    <View
                      style={[
                        styles.periodDot,
                        { backgroundColor: phaseColors.menstrual },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Day Info */}
        {selectedDayInfo && (
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedDate}>
              {selectedDay
                ? format(parseISO(selectedDay), 'EEEE, MMMM d')
                : 'Today'}
            </Text>
            <View
              style={[
                styles.phaseTag,
                { backgroundColor: `${phaseColors[selectedDayInfo.phase]}20` },
              ]}
            >
              <Text
                style={[
                  styles.phaseTagText,
                  { color: phaseColors[selectedDayInfo.phase] },
                ]}
              >
                {phaseLabels[selectedDayInfo.phase]} - Day{' '}
                {selectedDayInfo.dayOfCycle}
              </Text>
            </View>
          </View>
        )}

        {/* Cycle Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Cycle Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Last period started</Text>
            <Text style={styles.settingValue}>
              {format(parseISO(profile.lastPeriodStart), 'MMM d, yyyy')}
            </Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Average cycle</Text>
            <Text style={styles.settingValue}>{profile.cycleLength} days</Text>
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Period length</Text>
            <Text style={styles.settingValue}>{profile.periodLength} days</Text>
          </View>
        </View>
      </ScrollView>
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    marginHorizontal: 24,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  calendarSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  calendarDay: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  calendarDaySelected: {
    borderWidth: 2,
    borderColor: '#1f2937',
  },
  calendarDayNumber: {
    fontSize: 14,
    fontWeight: '600',
  },
  calendarDayNumberToday: {
    fontWeight: '700',
  },
  periodDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  selectedInfo: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  selectedDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  phaseTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  phaseTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  settingsSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLabel: {
    fontSize: 16,
    color: '#4b5563',
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
});
