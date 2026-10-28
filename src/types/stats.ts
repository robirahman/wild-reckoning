/** The nine sub-stats visible on the stats panel */
export enum StatId {
  // Physical Stresses
  IMM = 'IMM', // Immune
  CLI = 'CLI', // Climate
  HOM = 'HOM', // Homeostasis

  // Mental Stresses
  TRA = 'TRA', // Trauma
  ADV = 'ADV', // Adversity
  NOV = 'NOV', // Novelty

  // General Fitness
  WIS = 'WIS', // Wisdom
  HEA = 'HEA', // Health
  STR = 'STR', // Stresses (aggregate)
}

export enum StatCategory {
  PHYSICAL = 'Physical Stresses',
  MENTAL = 'Mental Stresses',
  FITNESS = 'General Fitness',
}

/** Maps each stat to its category */
export const STAT_CATEGORIES: Record<StatId, StatCategory> = {
  [StatId.IMM]: StatCategory.PHYSICAL,
  [StatId.CLI]: StatCategory.PHYSICAL,
  [StatId.HOM]: StatCategory.PHYSICAL,
  [StatId.TRA]: StatCategory.MENTAL,
  [StatId.ADV]: StatCategory.MENTAL,
  [StatId.NOV]: StatCategory.MENTAL,
  [StatId.WIS]: StatCategory.FITNESS,
  [StatId.HEA]: StatCategory.FITNESS,
  [StatId.STR]: StatCategory.FITNESS,
};

/** Full display names for each stat abbreviation; strains and stresses say so */
export const STAT_NAMES: Record<StatId, string> = {
  [StatId.IMM]: 'IMMune strain',
  [StatId.CLI]: 'CLImate strain',
  [StatId.HOM]: 'HOMeostatic strain',
  [StatId.TRA]: 'TRAuma',
  [StatId.ADV]: 'ADVersity',
  [StatId.NOV]: 'NOVelty stress',
  [StatId.WIS]: 'WISdom',
  [StatId.HEA]: 'HEAlth',
  [StatId.STR]: 'STRess (total)',
};

/** What each stat means for the animal, and which direction is good */
export const STAT_DESCRIPTIONS: Record<StatId, string> = {
  [StatId.IMM]: 'How hard parasites, infection, and disease are pushing on your immune system. Lower is better: under heavy strain, illness takes hold more easily.',
  [StatId.CLI]: 'How much heat, cold, and weather are wearing on you. Lower is better.',
  [StatId.HOM]: 'Strain on your body\'s balance from hunger, thirst, exertion, and exposure. Lower is better.',
  [StatId.TRA]: 'Lasting fear from predator attacks, injury, and loss. These marks fade slowly and never completely. Lower is better.',
  [StatId.ADV]: 'How hard life has been lately: competition, scarcity, crowding. Shelter and security ease it. Lower is better.',
  [StatId.NOV]: 'Stress from the unfamiliar: new places, human things, situations your instincts don\'t cover. It eases as you adapt. Lower is better.',
  [StatId.WIS]: 'What experience has taught you about finding food and avoiding danger. Higher is better.',
  [StatId.HEA]: 'Your overall physical condition. Higher is better; at zero your body gives out.',
  [StatId.STR]: 'All your strains and stresses combined. Lower is better.',
};

/** Display level derived from numeric value (0-100) */
export type StatLevel = 'Low' | '- Medium' | 'Medium' | '+ Medium' | 'High' | '+ High';

/**
 * Whether a stat's positive direction is good or bad for the animal.
 * Physical and Mental stresses going up = bad. Fitness stats going up = good (except STR).
 */
export const STAT_POLARITY: Record<StatId, 'positive' | 'negative'> = {
  [StatId.IMM]: 'negative', // More immune stress = bad
  [StatId.CLI]: 'negative',
  [StatId.HOM]: 'negative',
  [StatId.TRA]: 'negative',
  [StatId.ADV]: 'negative',
  [StatId.NOV]: 'negative',
  [StatId.WIS]: 'positive', // More wisdom = good
  [StatId.HEA]: 'positive',
  [StatId.STR]: 'negative', // More overall stress = bad
};

export type ModifierSourceType =
  | 'parasite'
  | 'injury'
  | 'event'
  | 'seasonal'
  | 'behavioral'
  | 'condition'
  | 'permanent';

export interface StatModifier {
  id: string;
  source: string; // Human-readable label: "GI Roundworm", "Blueberry foraging"
  sourceType: ModifierSourceType;
  stat: StatId;
  amount: number; // Positive = increase, Negative = decrease
  duration?: number; // Turns remaining; undefined = permanent
}

export interface StatValue {
  base: number; // Permanent base value (0-100)
  modifiers: StatModifier[];
}

export type StatBlock = Record<StatId, StatValue>;

/** Convert a numeric stat value (0-100) to a display level */
export function getStatLevel(value: number): StatLevel {
  if (value <= 15) return 'Low';
  if (value <= 30) return '- Medium';
  if (value <= 50) return 'Medium';
  if (value <= 70) return '+ Medium';
  if (value <= 85) return 'High';
  return '+ High';
}

/** Get the sign prefix for display: "+" or "-" based on the stat bar direction */
export function getStatSign(stat: StatId, value: number): '+' | '-' {
  if (stat === StatId.STR) {
    // STR under Fitness is an inverse aggregate — shows negative when stresses are present
    return value > 50 ? '-' : '+';
  }
  if (STAT_POLARITY[stat] === 'positive') {
    return '+';
  }
  return '+';
}

/**
 * Compute the effective value of a stat: base + sum of all active modifiers,
 * clamped to the [0, 100] range.
 */
export function computeEffectiveValue(stat: StatValue): number {
  const total = stat.base + stat.modifiers.reduce((sum, m) => sum + m.amount, 0);
  return Math.max(0, Math.min(100, total));
}

// ── Lifetime Stats (for Game Over screen) ──

export interface LifetimeStats {
  friendsMade: number;
  rivalsDefeated: number;
  predatorsEvaded: number;
  preyEaten: number;
  distanceTraveled: number;
  weatherEventsSurvived: number;
  maxWeight: number;
  regionsVisited: string[]; // Use array for easier serialization
  maxGeneration: number;
  foodSources: Record<string, number>; // Event ID -> Count
}

export const INITIAL_LIFETIME_STATS: LifetimeStats = {
  friendsMade: 0,
  rivalsDefeated: 0,
  predatorsEvaded: 0,
  preyEaten: 0,
  distanceTraveled: 0,
  weatherEventsSurvived: 0,
  maxWeight: 0,
  regionsVisited: [],
  maxGeneration: 1,
  foodSources: {},
};
