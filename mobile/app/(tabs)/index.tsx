import { format } from 'date-fns';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { EnergyLog } from '../../../shared/types';
import { useAuth } from '../../hooks/useAuth';
import { useStore } from '../../hooks/useStore';
import { getPhaseRecommendations } from '../../utils/cycle';

function calculateStreak(energyLogs: EnergyLog[]): number {
  if (energyLogs.length === 0) return 0;

  const logDates = new Set(
    energyLogs.map((log) => log.timestamp.split('T')[0]),
  );

  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    if (logDates.has(dateStr)) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

const chronotypeLabels: Record<string, { label: string; emoji: string }> = {
  early_bird: { label: 'Early Bird', emoji: '🌅' },
  night_owl: { label: 'Night Owl', emoji: '🦉' },
  third_bird: { label: 'Third Bird', emoji: '🐦' },
};

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
  const { signOut } = useAuth();
  const { profile, todayCycle, todayEnergy, energyLogs } = useStore();

  const streak = useMemo(() => calculateStreak(energyLogs), [energyLogs]);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/auth/sign-in');
        },
      },
    ]);
  };

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const tracksCycle = profile.tracksCycle !== false && todayCycle;
  const phase = todayCycle?.phase;
  const colors = phase ? phaseColors[phase] : null;
  const recommendations = phase ? getPhaseRecommendations(phase) : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>
                {new Date().getHours() < 12
                  ? 'Good morning'
                  : new Date().getHours() < 17
                    ? 'Good afternoon'
                    : 'Good evening'}
                , {profile.name}
              </Text>
              <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>
            </View>
            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Streak & Chronotype */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>{streak > 0 ? '🔥' : '💤'}</Text>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>
              {streak === 1 ? 'day' : 'days'} streak
            </Text>
          </View>
          {profile.chronotype && chronotypeLabels[profile.chronotype] && (
            <View style={styles.statCard}>
              <Text style={styles.statEmoji}>
                {chronotypeLabels[profile.chronotype].emoji}
              </Text>
              <Text style={styles.statValue}>
                {chronotypeLabels[profile.chronotype].label}
              </Text>
              <Text style={styles.statLabel}>your rhythm</Text>
            </View>
          )}
        </View>

        {/* Energy Check-in */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How's your energy?</Text>
          {todayEnergy ? (
            <View style={styles.energyLogged}>
              <View style={styles.energyHeader}>
                <Text style={styles.energyEmoji}>⚡</Text>
                <View>
                  <Text style={styles.energyValue}>
                    {todayEnergy.energyLevel}/10
                  </Text>
                  <Text style={styles.energyTime}>
                    Logged at {format(new Date(todayEnergy.timestamp), 'h:mm a')}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.logAgainButton}
                onPress={() => router.push('/log-energy')}
              >
                <Text style={styles.logAgainText}>Update</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.logButton}
              onPress={() => router.push('/log-energy')}
            >
              <Text style={styles.logButtonEmoji}>⚡</Text>
              <Text style={styles.logButtonText}>Log your energy</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Cycle Phase Card - Only if tracking */}
        {tracksCycle && phase && colors && recommendations && (
          <>
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
          </>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick actions</Text>

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
            {tracksCycle && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push('/log-period')}
              >
                <Text style={styles.actionEmoji}>🩸</Text>
                <Text style={styles.actionLabel}>Period</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/(tabs)/insights')}
            >
              <Text style={styles.actionEmoji}>📊</Text>
              <Text style={styles.actionLabel}>Insights</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Enable Cycle Tracking CTA - Only if not tracking */}
        {!tracksCycle && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.enableCycleCard}
              onPress={() => router.push('/log-period')}
            >
              <Text style={styles.enableCycleEmoji}>🔄</Text>
              <View style={styles.enableCycleText}>
                <Text style={styles.enableCycleTitle}>
                  Want to track your cycle?
                </Text>
                <Text style={styles.enableCycleSubtitle}>
                  Optional - can reveal more energy patterns
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
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
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  energyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  energyEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  energyValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#166534',
  },
  energyTime: {
    fontSize: 13,
    color: '#16a34a',
  },
  logAgainButton: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logAgainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  logButton: {
    backgroundColor: '#8b5cf6',
    padding: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logButtonEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  logButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
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
  enableCycleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9d5ff',
    borderStyle: 'dashed',
  },
  enableCycleEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  enableCycleText: {
    flex: 1,
  },
  enableCycleTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#7c3aed',
  },
  enableCycleSubtitle: {
    fontSize: 13,
    color: '#a78bfa',
  },
});
