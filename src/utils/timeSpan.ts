import type { SpeciesConfig } from '../types/speciesConfig';
import { pluralize } from './pluralize';

type TurnUnit = NonNullable<SpeciesConfig['turnUnit']>;

/** Real time covered by `turns` turns, e.g. "12 weeks", or "3 days" for 6-hour turns */
export function describeTurnSpan(turns: number, turnUnit: TurnUnit = 'week'): string {
  if (turnUnit === 'month') return pluralize(turns, 'month');
  if (turnUnit === 'week') return pluralize(turns, 'week');
  // Day-unit species take four 6-hour turns per day
  const hours = turns * 6;
  return hours % 24 === 0 ? pluralize(hours / 24, 'day') : pluralize(hours, 'hour');
}

/**
 * An animal's age: "2 years, 3 months", "5 months", or for an animal that
 * started life in the game, the time it actually lived ("1 day", "18 hours").
 */
export function formatAge(ageMonths: number, turnsLived: number, turnUnit: TurnUnit = 'week'): string {
  if (ageMonths >= 12) {
    const years = Math.floor(ageMonths / 12);
    const months = ageMonths % 12;
    return months > 0 ? `${pluralize(years, 'year')}, ${pluralize(months, 'month')}` : pluralize(years, 'year');
  }
  if (ageMonths >= 1) return pluralize(ageMonths, 'month');
  return describeTurnSpan(Math.max(1, turnsLived), turnUnit);
}
