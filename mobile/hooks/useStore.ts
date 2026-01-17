import { create } from 'zustand';
import type {
  CycleDay,
  EnergyLog,
  Goal,
  UserProfile,
} from '../../shared/types';
import * as storage from '../services/storage';
import { getCycleForecast, getTodayCycleInfo } from '../utils/cycle';

interface AppState {
  // User
  profile: UserProfile | null;
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
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => Promise<void>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<void>;
  completeTask: (goalId: string, taskId: string) => Promise<void>;
  setOnboarded: (value: boolean) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  profile: null,
  isOnboarded: false,
  todayCycle: null,
  cycleForecast: [],
  energyLogs: [],
  todayEnergy: null,
  goals: [],
  isLoading: true,

  initialize: async () => {
    set({ isLoading: true });

    const [profile, energyLogs, goals, isOnboarded] = await Promise.all([
      storage.getProfile(),
      storage.getEnergyLogs(),
      storage.getGoals(),
      storage.isOnboarded(),
    ]);

    let todayCycle: CycleDay | null = null;
    let cycleForecast: CycleDay[] = [];

    if (profile) {
      todayCycle = getTodayCycleInfo(profile);
      cycleForecast = getCycleForecast(profile, 30);
    }

    // Find today's energy log if exists
    const today = new Date().toISOString().split('T')[0];
    const todayEnergy =
      energyLogs.find((log) => log.timestamp.startsWith(today)) || null;

    set({
      profile,
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
    await storage.saveProfile(profile);
    const todayCycle = getTodayCycleInfo(profile);
    const cycleForecast = getCycleForecast(profile, 30);
    set({ profile, todayCycle, cycleForecast });
  },

  updateLastPeriod: async (date) => {
    const { profile } = get();
    if (!profile) return;

    const updatedProfile = { ...profile, lastPeriodStart: date };
    await storage.saveProfile(updatedProfile);
    const todayCycle = getTodayCycleInfo(updatedProfile);
    const cycleForecast = getCycleForecast(updatedProfile, 30);
    set({ profile: updatedProfile, todayCycle, cycleForecast });
  },

  logEnergy: async (logData) => {
    const { todayCycle, energyLogs } = get();

    const log: EnergyLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...logData,
      cycleDay: todayCycle?.dayOfCycle,
      cyclePhase: todayCycle?.phase,
    };

    await storage.saveEnergyLog(log);
    set({
      energyLogs: [...energyLogs, log],
      todayEnergy: log,
    });
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
