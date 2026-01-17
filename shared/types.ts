// Core types shared between mobile and backend

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export interface CycleDay {
  date: string; // ISO date
  phase: CyclePhase;
  dayOfCycle: number; // 1-28+
  periodStart?: boolean;
}

export interface EnergyLog {
  id: string;
  timestamp: string;
  energyLevel: number; // 1-10
  focusLevel: number; // 1-10
  mood: 'great' | 'good' | 'okay' | 'low' | 'bad';
  notes?: string;
  cycleDay?: number;
  cyclePhase?: CyclePhase;
}

export type TaskCategory = 'deep_work' | 'creative' | 'social' | 'admin';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  cognitiveLoad: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  deadline?: string;
  completed: boolean;
  completedAt?: string;
  energyWhenCompleted?: number;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'longterm';
  targetDate?: string;
  tasks: Task[];
  progress: number; // 0-100
}

export interface UserProfile {
  id: string;
  name: string;
  cycleLength: number; // average, typically 28
  periodLength: number; // average, typically 5
  lastPeriodStart: string; // ISO date
  chronotype: 'early_bird' | 'night_owl' | 'intermediate';
  peakHoursOverride?: { start: number; end: number }; // manual override
}

export interface DayRecommendation {
  date: string;
  cyclePhase: CyclePhase;
  predictedEnergyPattern: {
    hour: number;
    expectedEnergy: number;
  }[];
  suggestions: {
    taskCategory: TaskCategory;
    bestTimeSlots: { start: string; end: string }[];
    reason: string;
  }[];
}

// Cycle phase characteristics for recommendations
export const CYCLE_PHASE_INFO: Record<CyclePhase, {
  name: string;
  typicalDays: string;
  energyLevel: 'low' | 'rising' | 'peak' | 'declining';
  bestFor: TaskCategory[];
  description: string;
}> = {
  menstrual: {
    name: 'Menstrual',
    typicalDays: '1-5',
    energyLevel: 'low',
    bestFor: ['admin'],
    description: 'Rest and reflect. Good for lighter tasks, planning, and self-care.',
  },
  follicular: {
    name: 'Follicular',
    typicalDays: '6-14',
    energyLevel: 'rising',
    bestFor: ['creative', 'deep_work'],
    description: 'Energy is building. Great for starting new projects, learning, and brainstorming.',
  },
  ovulation: {
    name: 'Ovulation',
    typicalDays: '14-16',
    energyLevel: 'peak',
    bestFor: ['social', 'deep_work'],
    description: 'Peak energy and communication. Best for presentations, difficult conversations, big tasks.',
  },
  luteal: {
    name: 'Luteal',
    typicalDays: '17-28',
    energyLevel: 'declining',
    bestFor: ['admin', 'deep_work'],
    description: 'Focus turns inward. Good for detail work, finishing projects, organizing.',
  },
};

export const TASK_CATEGORY_INFO: Record<TaskCategory, {
  name: string;
  icon: string;
  examples: string[];
  cognitiveLoadTypical: 'high' | 'medium' | 'low';
}> = {
  deep_work: {
    name: 'Deep Work',
    icon: '🧠',
    examples: ['Coding', 'Writing', 'Analysis', 'Problem-solving'],
    cognitiveLoadTypical: 'high',
  },
  creative: {
    name: 'Creative',
    icon: '✨',
    examples: ['Brainstorming', 'Design', 'Strategy', 'Planning'],
    cognitiveLoadTypical: 'medium',
  },
  social: {
    name: 'Social',
    icon: '👥',
    examples: ['Meetings', 'Calls', 'Collaboration', 'Networking'],
    cognitiveLoadTypical: 'medium',
  },
  admin: {
    name: 'Admin',
    icon: '📋',
    examples: ['Emails', 'Scheduling', 'Filing', 'Quick tasks'],
    cognitiveLoadTypical: 'low',
  },
};
