import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  CycleDay,
  EnergyLog,
  Goal,
  UserProfile,
} from '../../shared/types';

const KEYS = {
  PROFILE: 'flow_state_profile',
  ENERGY_LOGS: 'flow_state_energy_logs',
  GOALS: 'flow_state_goals',
  CYCLE_HISTORY: 'flow_state_cycle_history',
  ONBOARDED: 'flow_state_onboarded',
};

// Profile
export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function getProfile(): Promise<UserProfile | null> {
  const data = await AsyncStorage.getItem(KEYS.PROFILE);
  return data ? JSON.parse(data) : null;
}

// Energy Logs
export async function saveEnergyLog(log: EnergyLog): Promise<void> {
  const logs = await getEnergyLogs();
  logs.push(log);
  await AsyncStorage.setItem(KEYS.ENERGY_LOGS, JSON.stringify(logs));
}

export async function getEnergyLogs(): Promise<EnergyLog[]> {
  const data = await AsyncStorage.getItem(KEYS.ENERGY_LOGS);
  return data ? JSON.parse(data) : [];
}

export async function getEnergyLogsForDateRange(
  startDate: string,
  endDate: string,
): Promise<EnergyLog[]> {
  const logs = await getEnergyLogs();
  return logs.filter(
    (log) => log.timestamp >= startDate && log.timestamp <= endDate,
  );
}

// Goals
export async function saveGoals(goals: Goal[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.GOALS, JSON.stringify(goals));
}

export async function getGoals(): Promise<Goal[]> {
  const data = await AsyncStorage.getItem(KEYS.GOALS);
  return data ? JSON.parse(data) : [];
}

// Cycle History
export async function saveCycleHistory(history: CycleDay[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.CYCLE_HISTORY, JSON.stringify(history));
}

export async function getCycleHistory(): Promise<CycleDay[]> {
  const data = await AsyncStorage.getItem(KEYS.CYCLE_HISTORY);
  return data ? JSON.parse(data) : [];
}

// Onboarding
export async function setOnboarded(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.ONBOARDED, JSON.stringify(value));
}

export async function isOnboarded(): Promise<boolean> {
  const data = await AsyncStorage.getItem(KEYS.ONBOARDED);
  return data ? JSON.parse(data) : false;
}

// Clear all data (for testing/reset)
export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
