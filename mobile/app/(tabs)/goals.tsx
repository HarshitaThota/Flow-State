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
import type { CognitiveLoad } from '../../../shared/types';
import { Button } from '../../components/Button';
import { useStore } from '../../hooks/useStore';

const cognitiveLoadOptions: {
  value: CognitiveLoad;
  label: string;
  emoji: string;
}[] = [
  { value: 'deep', label: 'Deep Focus', emoji: '🧠' },
  { value: 'medium', label: 'Medium', emoji: '💭' },
  { value: 'light', label: 'Light', emoji: '☁️' },
  { value: 'autopilot', label: 'Autopilot', emoji: '🤖' },
];

export default function GoalsScreen() {
  const { goals, addGoal, todayCycle } = useStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalLoad, setNewGoalLoad] = useState<CognitiveLoad>('medium');

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim()) return;

    await addGoal({
      title: newGoalTitle.trim(),
      cognitiveLoad: newGoalLoad,
      tasks: [],
      status: 'active',
    });

    setNewGoalTitle('');
    setNewGoalLoad('medium');
    setShowAddForm(false);
  };

  // Sort goals by how well they match current phase
  const getPhaseMatch = (load: CognitiveLoad): number => {
    if (!todayCycle) return 0;
    const phase = todayCycle.phase;

    const matches: Record<string, CognitiveLoad[]> = {
      menstrual: ['light', 'autopilot'],
      follicular: ['deep', 'medium'],
      ovulation: ['deep', 'medium'],
      luteal: ['medium', 'light'],
    };

    return matches[phase]?.includes(load) ? 1 : 0;
  };

  const sortedGoals = [...goals].sort(
    (a, b) => getPhaseMatch(b.cognitiveLoad) - getPhaseMatch(a.cognitiveLoad),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Phase-based suggestion */}
        {todayCycle && (
          <View style={styles.phaseHint}>
            <Text style={styles.phaseHintText}>
              {todayCycle.phase === 'menstrual' &&
                '🌙 Focus on light tasks and rest today'}
              {todayCycle.phase === 'follicular' &&
                '🌱 Great day for tackling challenging goals'}
              {todayCycle.phase === 'ovulation' &&
                '☀️ Peak energy - dive into deep work'}
              {todayCycle.phase === 'luteal' &&
                '🍂 Good for detailed, methodical tasks'}
            </Text>
          </View>
        )}

        {/* Goals List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Goals</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddForm(!showAddForm)}
            >
              <Text style={styles.addButtonText}>
                {showAddForm ? 'Cancel' : '+ Add'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Add Goal Form */}
          {showAddForm && (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="What do you want to accomplish?"
                placeholderTextColor="#9ca3af"
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
              />

              <Text style={styles.formLabel}>Cognitive Load</Text>
              <View style={styles.loadOptions}>
                {cognitiveLoadOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.loadOption,
                      newGoalLoad === option.value && styles.loadOptionSelected,
                    ]}
                    onPress={() => setNewGoalLoad(option.value)}
                  >
                    <Text style={styles.loadEmoji}>{option.emoji}</Text>
                    <Text
                      style={[
                        styles.loadLabel,
                        newGoalLoad === option.value &&
                          styles.loadLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button title="Add Goal" onPress={handleAddGoal} />
            </View>
          )}

          {/* Goals */}
          {sortedGoals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🎯</Text>
              <Text style={styles.emptyText}>No goals yet</Text>
              <Text style={styles.emptySubtext}>
                Add goals to get personalized timing recommendations
              </Text>
            </View>
          ) : (
            sortedGoals.map((goal) => {
              const isGoodTime = getPhaseMatch(goal.cognitiveLoad) > 0;

              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleRow}>
                      <Text style={styles.goalTitle}>{goal.title}</Text>
                      {isGoodTime && (
                        <View style={styles.goodTimeBadge}>
                          <Text style={styles.goodTimeText}>Good now</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.loadBadge}>
                      <Text style={styles.loadBadgeText}>
                        {
                          cognitiveLoadOptions.find(
                            (o) => o.value === goal.cognitiveLoad,
                          )?.emoji
                        }{' '}
                        {goal.cognitiveLoad}
                      </Text>
                    </View>
                  </View>

                  {goal.progress > 0 && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${goal.progress}%` },
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{goal.progress}%</Text>
                    </View>
                  )}
                </View>
              );
            })
          )}
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
  phaseHint: {
    backgroundColor: '#f3e8ff',
    marginHorizontal: 24,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
  },
  phaseHintText: {
    fontSize: 14,
    color: '#6d28d9',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8b5cf6',
  },
  addForm: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  loadOptions: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  loadOption: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
  },
  loadOptionSelected: {
    backgroundColor: '#f3e8ff',
    borderWidth: 2,
    borderColor: '#8b5cf6',
  },
  loadEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  loadLabel: {
    fontSize: 11,
    color: '#6b7280',
  },
  loadLabelSelected: {
    color: '#7c3aed',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  goalCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  goalTitleRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  goodTimeBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  goodTimeText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#166534',
  },
  loadBadge: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  loadBadgeText: {
    fontSize: 12,
    color: '#4b5563',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
});
