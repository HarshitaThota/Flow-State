import { create } from 'zustand';
import type {
  CycleDay,
  EnergyLog,
  Goal,
  UserProfile,
} from '../../shared/types';
import * as storage from '../services/storage';
import { supabase, updateProfile as updateSupabaseProfile, logEnergy as logSupabaseEnergy, logSymptoms as logSupabaseSymptoms } from '../services/supabase';
import { getCycleForecast, getTodayCycleInfo } from '../utils/cycle';

interface AppState {
  // User
  profile: UserProfile | null;
  userId: string | null;
  isOnboarded: boolean;

  // Cycle
  todayCycle: CycleDay | null;
  cycleForecast: CycleDay[];

  // Energy
  energyLogs: EnergyLog[];
  todayEnergy: EnergyLog | null;

  // Goals
  goals: Goal[];

  // Loading
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  setProfile: (profile: UserProfile) => Promise<void>;
  updateLastPeriod: (date: string) => Promise<void>;
  logEnergy: (
    log: Omit<EnergyLog, 'id' | 'timestamp' | 'cycleDay' | 'cyclePhase'>,
  ) => Promise<void>;
  logSymptoms: (data: {
    symptoms: Record<string, number>;
    sleepHours?: number;
    sleepQuality?: string;
    exercised: boolean;
    exerciseMinutes?: number;
    notes?: string;
  }) => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  completeTask: (goalId: string, taskId: string) => Promise<void>;
  setOnboarded: (value: boolean) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  userId: null,
  isOnboarded: false,
  todayCycle: null,
  cycleForecast: [],
  energyLogs: [],
  todayEnergy: null,
  goals: [],
  isLoading: true,

  initialize: async () => {
    set({ isLoading: true });

    // Get current user from Supabase
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      set({ isLoading: false, isOnboarded: false });
      return;
    }

    // Get profile from Supabase
    const { data: supabaseProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Convert to app format
    let profile: UserProfile | null = null;
    let isOnboarded = false;

    if (supabaseProfile) {
      profile = {
        id: supabaseProfile.id,
        name: supabaseProfile.name || '',
        cycleLength: supabaseProfile.cycle_length || 28,
        periodLength: supabaseProfile.period_length || 5,
        lastPeriodStart: supabaseProfile.last_period_start || '',
        chronotype: supabaseProfile.chronotype || 'intermediate',
        createdAt: supabaseProfile.created_at,
        updatedAt: supabaseProfile.updated_at,
      };
      // Consider onboarded if they have a name (always set during onboarding)
      isOnboarded = !!supabaseProfile.name;
    }

    // Get energy logs from Supabase
    const { data: supabaseEnergyLogs } = await supabase
      .from('energy_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(100);

    const energyLogs: EnergyLog[] = (supabaseEnergyLogs || []).map(log => ({
      id: log.id,
      timestamp: log.timestamp,
      energyLevel: log.energy_level,
      mood: log.mood,
      focus: log.focus,
      notes: log.notes,
      cycleDay: log.cycle_day,
      cyclePhase: log.cycle_phase,
    }));

    // Get goals (still local for now)
    const goals = await storage.getGoals();

    let todayCycle: CycleDay | null = null;
    let cycleForecast: CycleDay[] = [];

    if (profile && profile.lastPeriodStart) {
      todayCycle = getTodayCycleInfo(profile);
      cycleForecast = getCycleForecast(profile, 30);
    }

    // Find today's energy log if exists
    const today = new Date().toISOString().split('T')[0];
    const todayEnergy =
      energyLogs.find((log) => log.timestamp.startsWith(today)) || null;

    set({
      profile,
      userId: user.id,
      isOnboarded,
      todayCycle,
      cycleForecast,
      energyLogs,
      todayEnergy,
      goals,
      isLoading: false,
    });
  },

  setProfile: async (profile) => {
    const { userId } = get();

    // Save to Supabase
    if (userId) {
      await updateSupabaseProfile(userId, {
        name: profile.name,
        cycle_length: profile.cycleLength,
        period_length: profile.periodLength,
        last_period_start: profile.lastPeriodStart,
        chronotype: profile.chronotype,
      });
    }

    // Also save locally as backup
    await storage.saveProfile(profile);

    const todayCycle = getTodayCycleInfo(profile);
    const cycleForecast = getCycleForecast(profile, 30);
    set({ profile, todayCycle, cycleForecast, isOnboarded: true });
  },

  updateLastPeriod: async (date) => {
    const { profile, userId } = get();
    if (!profile) return;

    const updatedProfile = { ...profile, lastPeriodStart: date };

    // Save to Supabase
    if (userId) {
      await updateSupabaseProfile(userId, { last_period_start: date });
    }

    await storage.saveProfile(updatedProfile);
    const todayCycle = getTodayCycleInfo(updatedProfile);
    const cycleForecast = getCycleForecast(updatedProfile, 30);
    set({ profile: updatedProfile, todayCycle, cycleForecast });
  },

  logEnergy: async (logData) => {
    const { todayCycle, energyLogs, userId } = get();

    const log: EnergyLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...logData,
      cycleDay: todayCycle?.dayOfCycle,
      cyclePhase: todayCycle?.phase,
    };

    // Save to Supabase
    if (userId) {
      await logSupabaseEnergy(userId, {
        energy_level: log.energyLevel,
        mood: log.mood,
        focus: log.focus,
        notes: log.notes,
        cycle_day: log.cycleDay,
        cycle_phase: log.cyclePhase,
      });
    }

    await storage.saveEnergyLog(log);
    set({
      energyLogs: [log, ...energyLogs],
      todayEnergy: log,
    });
  },

  logSymptoms: async (data) => {
    const { todayCycle, userId } = get();

    if (userId) {
      await logSupabaseSymptoms(userId, {
        cycle_day: todayCycle?.dayOfCycle,
        cycle_phase: todayCycle?.phase,
        cramps: data.symptoms.cramps,
        headache: data.symptoms.headache,
        bloating: data.symptoms.bloating,
        breast_tenderness: data.symptoms.breast_tenderness,
        acne: data.symptoms.acne,
        fatigue: data.symptoms.fatigue,
        cravings: data.symptoms.cravings,
        mood_swings: data.symptoms.mood_swings,
        anxiety: data.symptoms.anxiety,
        sleep_hours: data.sleepHours,
        sleep_quality: data.sleepQuality,
        exercised: data.exercised,
        exercise_minutes: data.exerciseMinutes,
        notes: data.notes,
      });
    }
  },

  addGoal: async (goalData) => {
    const { goals } = get();

    const goal: Goal = {
      id: Date.now().toString(),
      progress: 0,
      ...goalData,
    };

    const updatedGoals = [...goals, goal];
    await storage.saveGoals(updatedGoals);
    set({ goals: updatedGoals });
  },

  updateGoal: async (goalId, updates) => {
    const { goals } = get();
    const updatedGoals = goals.map((g) =>
      g.id === goalId ? { ...g, ...updates } : g,
    );
    await storage.saveGoals(updatedGoals);
    set({ goals: updatedGoals });
  },

  completeTask: async (goalId, taskId) => {
    const { goals } = get();
    const updatedGoals = goals.map((goal) => {
      if (goal.id !== goalId) return goal;

      const updatedTasks = goal.tasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: true, completedAt: new Date().toISOString() }
          : task,
      );

      const completedCount = updatedTasks.filter((t) => t.completed).length;
      const progress = Math.round((completedCount / updatedTasks.length) * 100);

      return { ...goal, tasks: updatedTasks, progress };
    });

    await storage.saveGoals(updatedGoals);
    set({ goals: updatedGoals });
  },

  setOnboarded: async (value) => {
    await storage.setOnboarded(value);
    set({ isOnboarded: value });
  },
}));
