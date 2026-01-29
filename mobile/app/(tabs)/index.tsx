import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useStore } from '../../hooks/useStore';
import { getPhaseRecommendations } from '../../utils/cycle';

const phaseColors = {
  menstrual: { bg: '#fce4ec', text: '#c2185b', accent: '#e91e63' },
  follicular: { bg: '#e8f5e9', text: '#2e7d32', accent: '#4caf50' },
  ovulation: { bg: '#fff3e0', text: '#e65100', accent: '#ff9800' },
  luteal: { bg: '#e3f2fd', text: '#1565c0', accent: '#2196f3' },
};

const phaseEmojis = {
  menstrual: '🌙',
  follicular: '🌱',
  ovulation: '☀️',
  luteal: '🍂',
};

const phaseNames = {
  menstrual: 'Menstrual Phase',
  follicular: 'Follicular Phase',
  ovulation: 'Ovulation Phase',
  luteal: 'Luteal Phase',
};

export default function TodayScreen() {
  const router = useRouter();
  const { profile, todayCycle, todayEnergy } = useStore();

  if (!profile || !todayCycle) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const phase = todayCycle.phase;
  const colors = phaseColors[phase];
  const recommendations = getPhaseRecommendations(phase);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hey {profile.name}</Text>
          <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
        </View>

        {/* Cycle Phase Card */}
        <View style={[styles.phaseCard, { backgroundColor: colors.bg }]}>
          <View style={styles.phaseHeader}>
            <Text style={styles.phaseEmoji}>{phaseEmojis[phase]}</Text>
            <View style={styles.phaseInfo}>
              <Text style={[styles.phaseName, { color: colors.text }]}>
                {phaseNames[phase]}
              </Text>
              <Text style={[styles.cycleDay, { color: colors.accent }]}>
                Day {todayCycle.dayOfCycle} of your cycle
              </Text>
            </View>
          </View>
          <Text style={[styles.phaseTip, { color: colors.text }]}>
            {recommendations.tips}
          </Text>
        </View>

        {/* Energy Check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          {todayEnergy ? (
            <View style={styles.energyLogged}>
              <Text style={styles.energyValue}>
                Energy: {todayEnergy.energyLevel}/10
              </Text>
              <Text style={styles.energyTime}>
                Logged at {format(new Date(todayEnergy.timestamp), 'h:mm a')}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.logButton}
              onPress={() => router.push('/log-energy')}
            >
              <Text style={styles.logButtonText}>Log your energy</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Best For Today */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Great for today</Text>
          <View style={styles.tagContainer}>
            {recommendations.bestFor.map((item) => (
              <View
                key={item}
                style={[styles.tag, { backgroundColor: colors.bg }]}
              >
                <Text style={[styles.tagText, { color: colors.text }]}>
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Consider Avoiding */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consider postponing</Text>
          <View style={styles.tagContainer}>
            {recommendations.avoid.map((item) => (
              <View key={item} style={[styles.tag, styles.avoidTag]}>
                <Text style={styles.avoidTagText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>

          {/* Period Started Button - Prominent */}
          <TouchableOpacity
            style={styles.periodButton}
            onPress={() => router.push('/log-period')}
          >
            <Text style={styles.periodButtonEmoji}>🩸</Text>
            <View style={styles.periodButtonText}>
              <Text style={styles.periodButtonTitle}>Period started?</Text>
              <Text style={styles.periodButtonSubtitle}>Tap to log</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/log-energy')}
            >
              <Text style={styles.actionEmoji}>⚡</Text>
              <Text style={styles.actionLabel}>Energy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/log-symptoms')}
            >
              <Text style={styles.actionEmoji}>📝</Text>
              <Text style={styles.actionLabel}>Symptoms</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/cycle')}
            >
              <Text style={styles.actionEmoji}>📅</Text>
              <Text style={styles.actionLabel}>Calendar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/insights')}
            >
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionLabel}>Insights</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#6b7280',
  },
  phaseCard: {
    marginHorizontal: 24,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  phaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  phaseEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  phaseInfo: {
    flex: 1,
  },
  phaseName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  cycleDay: {
    fontSize: 14,
    fontWeight: '500',
  },
  phaseTip: {
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  energyLogged: {
    backgroundColor: '#f0fdf4',
    padding: 16,
    borderRadius: 12,
  },
  energyValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
  },
  energyTime: {
    fontSize: 14,
    color: '#16a34a',
    marginTop: 4,
  },
  logButton: {
    backgroundColor: '#8b5cf6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  avoidTag: {
    backgroundColor: '#fef2f2',
  },
  avoidTagText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#991b1b',
  },
  periodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fce4ec',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  periodButtonEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  periodButtonText: {
    flex: 1,
  },
  periodButtonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#c2185b',
  },
  periodButtonSubtitle: {
    fontSize: 13,
    color: '#e91e63',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    width: '47%',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4b5563',
  },
});
