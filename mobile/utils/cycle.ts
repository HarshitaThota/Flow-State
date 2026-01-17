import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import type { CycleDay, CyclePhase, UserProfile } from '../../shared/types';

/**
 * Calculate the current cycle day based on last period start
 */
export function getCurrentCycleDay(lastPeriodStart: string): number {
  const start = parseISO(lastPeriodStart);
  const today = new Date();
  return differenceInDays(today, start) + 1;
}

/**
 * Determine cycle phase based on day of cycle
 * Default cycle length: 28 days
 * - Menstrual: Days 1-5
 * - Follicular: Days 6-14
 * - Ovulation: Days 14-16 (overlaps with late follicular)
 * - Luteal: Days 17-28
 */
export function getCyclePhase(
  dayOfCycle: number,
  cycleLength: number = 28,
  periodLength: number = 5,
): CyclePhase {
  // Normalize day to handle cycles longer than expected
  const normalizedDay = ((dayOfCycle - 1) % cycleLength) + 1;

  // Menstrual phase (period)
  if (normalizedDay <= periodLength) {
    return 'menstrual';
  }

  // Calculate ovulation day (typically 14 days before end of cycle)
  const ovulationDay = cycleLength - 14;

  // Follicular phase (after period, before ovulation)
  if (normalizedDay < ovulationDay - 1) {
    return 'follicular';
  }

  // Ovulation window (around ovulation day, typically 3 days)
  if (normalizedDay >= ovulationDay - 1 && normalizedDay <= ovulationDay + 1) {
    return 'ovulation';
  }

  // Luteal phase (after ovulation, before next period)
  return 'luteal';
}

/**
 * Get today's cycle info
 */
export function getTodayCycleInfo(profile: UserProfile): CycleDay {
  const dayOfCycle = getCurrentCycleDay(profile.lastPeriodStart);
  const phase = getCyclePhase(
    dayOfCycle,
    profile.cycleLength,
    profile.periodLength,
  );

  return {
    date: format(new Date(), 'yyyy-MM-dd'),
    phase,
    dayOfCycle,
    periodStart: dayOfCycle === 1,
  };
}

/**
 * Generate cycle forecast for upcoming days
 */
export function getCycleForecast(
  profile: UserProfile,
  daysAhead: number = 30,
): CycleDay[] {
  const forecast: CycleDay[] = [];
  const today = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const date = addDays(today, i);
    const dayOfCycle =
      differenceInDays(date, parseISO(profile.lastPeriodStart)) + 1;
    const phase = getCyclePhase(
      dayOfCycle,
      profile.cycleLength,
      profile.periodLength,
    );
    const normalizedDay = ((dayOfCycle - 1) % profile.cycleLength) + 1;

    forecast.push({
      date: format(date, 'yyyy-MM-dd'),
      phase,
      dayOfCycle: normalizedDay,
      periodStart: normalizedDay === 1,
    });
  }

  return forecast;
}

/**
 * Get expected next period start date
 */
export function getNextPeriodDate(profile: UserProfile): Date {
  const currentDay = getCurrentCycleDay(profile.lastPeriodStart);
  const daysUntilNext =
    profile.cycleLength - ((currentDay - 1) % profile.cycleLength);

  return addDays(new Date(), daysUntilNext);
}

/**
 * Get energy multiplier based on cycle phase
 * Used to adjust predicted energy levels
 */
export function getPhaseEnergyMultiplier(phase: CyclePhase): number {
  switch (phase) {
    case 'menstrual':
      return 0.7; // Lower energy
    case 'follicular':
      return 0.9; // Rising energy
    case 'ovulation':
      return 1.1; // Peak energy
    case 'luteal':
      return 0.8; // Declining energy
    default:
      return 1.0;
  }
}

/**
 * Get recommended task types for current phase
 */
export function getPhaseRecommendations(phase: CyclePhase): {
  bestFor: string[];
  avoid: string[];
  tips: string;
} {
  switch (phase) {
    case 'menstrual':
      return {
        bestFor: ['Rest', 'Reflection', 'Planning', 'Light admin'],
        avoid: [
          'High-stakes presentations',
          'Starting new projects',
          'Intense workouts',
        ],
        tips: 'Honor your need for rest. This is a great time for introspection and setting intentions for the coming cycle.',
      };
    case 'follicular':
      return {
        bestFor: [
          'Starting projects',
          'Brainstorming',
          'Learning new skills',
          'Creative work',
        ],
        avoid: ['Routine tasks only', 'Playing it safe'],
        tips: 'Your brain is primed for new information. Take on challenges and try new things!',
      };
    case 'ovulation':
      return {
        bestFor: [
          'Presentations',
          'Negotiations',
          'Social events',
          'Important conversations',
        ],
        avoid: ['Isolation', 'Boring tasks'],
        tips: "You're at your most articulate and charismatic. Schedule important meetings now.",
      };
    case 'luteal':
      return {
        bestFor: ['Detail work', 'Editing', 'Finishing projects', 'Organizing'],
        avoid: ['Starting new ventures', 'Making big decisions late in phase'],
        tips: 'Your attention to detail is heightened. Great time to review and refine work.',
      };
  }
}
