import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useStore } from '../../hooks/useStore';

export default function InsightsScreen() {
  const { energyLogs, profile } = useStore();

  // Calculate average energy by phase
  const energyByPhase = energyLogs.reduce(
    (acc, log) => {
      if (log.cyclePhase) {
        if (!acc[log.cyclePhase]) {
          acc[log.cyclePhase] = { total: 0, count: 0 };
        }
        acc[log.cyclePhase].total += log.energyLevel;
        acc[log.cyclePhase].count += 1;
      }
      return acc;
    },
    {} as Record<string, { total: number; count: number }>,
  );

  const phaseAverages = Object.entries(energyByPhase).map(([phase, data]) => ({
    phase,
    average: Math.round((data.total / data.count) * 10) / 10,
  }));

  const hasEnoughData = energyLogs.length >= 5;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Your Insights</Text>
          <Text style={styles.subtitle}>
            Patterns emerge as you log more data
          </Text>
        </View>

        {!hasEnoughData ? (
          <View style={styles.notEnoughData}>
            <Text style={styles.notEnoughEmoji}>📊</Text>
            <Text style={styles.notEnoughTitle}>Building your profile</Text>
            <Text style={styles.notEnoughText}>
              Log your energy {5 - energyLogs.length} more times to start seeing
              patterns. We'll show you when you're typically at your best and
              when to take it easy.
            </Text>

            <View style={styles.progressIndicator}>
              <View style={styles.progressDots}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <View
                    key={n}
                    style={[
                      styles.progressDot,
                      n <= energyLogs.length && styles.progressDotFilled,
                    ]}
                  />
                ))}
              </View>
              <Text style={styles.progressLabel}>
                {energyLogs.length}/5 check-ins
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* Energy by Phase */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Energy by Cycle Phase</Text>
              <View style={styles.phaseCards}>
                {phaseAverages.map(({ phase, average }) => (
                  <View key={phase} style={styles.phaseCard}>
                    <Text style={styles.phaseAverage}>{average}</Text>
                    <Text style={styles.phaseName}>{phase}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Total Logs */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Data</Text>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>{energyLogs.length}</Text>
                  <Text style={styles.statLabel}>Energy logs</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>
                    {Math.round(
                      (energyLogs.reduce((sum, l) => sum + l.energyLevel, 0) /
                        energyLogs.length) *
                        10,
                    ) / 10}
                  </Text>
                  <Text style={styles.statLabel}>Avg energy</Text>
                </View>
              </View>
            </View>

            {/* Tips */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What We're Learning</Text>
              <View style={styles.tipCard}>
                <Text style={styles.tipEmoji}>💡</Text>
                <Text style={styles.tipText}>
                  Keep logging daily for the most accurate predictions. We'll
                  identify your peak performance windows within 1-2 cycles.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Coming Soon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coming Soon</Text>
          <View style={styles.comingSoonList}>
            <ComingSoonItem
              emoji="📈"
              title="Energy trends"
              description="Week-over-week patterns"
            />
            <ComingSoonItem
              emoji="🎯"
              title="Optimal scheduling"
              description="AI-powered task timing"
            />
            <ComingSoonItem
              emoji="🔔"
              title="Smart reminders"
              description="Phase-aware notifications"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ComingSoonItem({
  emoji,
  title,
  description,
}: {
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.comingSoonItem}>
      <Text style={styles.comingSoonEmoji}>{emoji}</Text>
      <View style={styles.comingSoonText}>
        <Text style={styles.comingSoonTitle}>{title}</Text>
        <Text style={styles.comingSoonDescription}>{description}</Text>
      </View>
    </View>
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
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
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
  notEnoughData: {
    marginHorizontal: 24,
    backgroundColor: '#f9fafb',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  notEnoughEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  notEnoughTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  notEnoughText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  progressIndicator: {
    alignItems: 'center',
  },
  progressDots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
  progressDotFilled: {
    backgroundColor: '#8b5cf6',
  },
  progressLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  phaseCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  phaseCard: {
    backgroundColor: '#f3e8ff',
    padding: 16,
    borderRadius: 12,
    minWidth: '45%',
    alignItems: 'center',
  },
  phaseAverage: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7c3aed',
  },
  phaseName: {
    fontSize: 12,
    color: '#6d28d9',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8b5cf6',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  comingSoonList: {
    gap: 12,
  },
  comingSoonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
  },
  comingSoonEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  comingSoonText: {
    flex: 1,
  },
  comingSoonTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  comingSoonDescription: {
    fontSize: 12,
    color: '#6b7280',
  },
});
