import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://bjzakvdqmnledeljbwkz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqemFrdmRxbW5sZWRlbGpid2t6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2OTQ4NzEsImV4cCI6MjA4NTI3MDg3MX0.L7urymtRDF4LC_Z8eyNHxqT--j2JLcApWG7pmdIzzE4';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Auth helpers
export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

// Profile helpers
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId: string, updates: {
  name?: string;
  cycle_length?: number;
  period_length?: number;
  last_period_start?: string;
  chronotype?: string;
}) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

// Energy log helpers
export async function logEnergy(userId: string, log: {
  energy_level: number;
  mood?: string;
  focus?: string;
  notes?: string;
  cycle_day?: number;
  cycle_phase?: string;
}) {
  const { data, error } = await supabase
    .from('energy_logs')
    .insert({ user_id: userId, ...log })
    .select()
    .single();
  return { data, error };
}

export async function getEnergyLogs(userId: string, limit = 100) {
  const { data, error } = await supabase
    .from('energy_logs')
    .select('*')
    .eq('user_id', userId)
    .order('timestamp', { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

// Symptom log helpers
export async function logSymptoms(userId: string, symptoms: {
  date?: string;
  cycle_day?: number;
  cycle_phase?: string;
  cramps?: number;
  headache?: number;
  bloating?: number;
  breast_tenderness?: number;
  acne?: number;
  fatigue?: number;
  cravings?: number;
  mood_swings?: number;
  anxiety?: number;
  sleep_hours?: number;
  sleep_quality?: string;
  exercised?: boolean;
  exercise_type?: string;
  exercise_minutes?: number;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from('symptom_logs')
    .insert({ user_id: userId, ...symptoms })
    .select()
    .single();
  return { data, error };
}

export async function getSymptomLogs(userId: string, limit = 100) {
  const { data, error } = await supabase
    .from('symptom_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

// Period log helpers
export async function logPeriodStart(userId: string, startDate: string) {
  const { data, error } = await supabase
    .from('period_logs')
    .insert({
      user_id: userId,
      start_date: startDate,
    })
    .select()
    .single();

  // Also update profile's last_period_start
  if (!error) {
    await updateProfile(userId, { last_period_start: startDate });
  }

  return { data, error };
}

export async function logPeriodEnd(periodId: string, endDate: string) {
  const { data, error } = await supabase
    .from('period_logs')
    .update({ end_date: endDate })
    .eq('id', periodId)
    .select()
    .single();
  return { data, error };
}

export async function getPeriodLogs(userId: string, limit = 12) {
  const { data, error } = await supabase
    .from('period_logs')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false })
    .limit(limit);
  return { data: data || [], error };
}

// Goals helpers
export async function getGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data: data || [], error };
}

export async function createGoal(userId: string, goal: {
  title: string;
  description?: string;
  cognitive_load?: string;
}) {
  const { data, error } = await supabase
    .from('goals')
    .insert({ user_id: userId, ...goal })
    .select()
    .single();
  return { data, error };
}

export async function updateGoal(goalId: string, updates: {
  title?: string;
  status?: string;
  progress?: number;
}) {
  const { data, error } = await supabase
    .from('goals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', goalId)
    .select()
    .single();
  return { data, error };
}
