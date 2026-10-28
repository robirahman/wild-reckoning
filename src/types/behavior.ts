export type BehaviorLevel = 1 | 2 | 3 | 4 | 5;

export interface BehavioralSettings {
  foraging: BehaviorLevel;
  belligerence: BehaviorLevel;
  mating: BehaviorLevel;
  exploration: BehaviorLevel;
  sociability: BehaviorLevel;
  caution: BehaviorLevel;
}

export const BEHAVIOR_LABELS: Record<keyof BehavioralSettings, string> = {
  foraging: 'Foraging',
  belligerence: 'Belligerence',
  mating: 'Mating',
  exploration: 'Exploration',
  sociability: 'Sociability',
  caution: 'Caution',
};

export const BEHAVIOR_DESCRIPTIONS: Record<keyof BehavioralSettings, string> = {
  foraging: 'How aggressively to seek food. Higher = more food but more exposure to parasites and predators.',
  belligerence: 'Fight vs. flight tendency. Higher = more confrontation and territory defense, more injury risk.',
  mating: 'Priority given to reproductive behaviors. Most relevant during breeding season.',
  exploration: 'Willingness to travel and explore new areas. Higher = more discovery but more risk.',
  sociability: 'Tendency to stay near other animals. Higher = herd safety but disease transmission.',
  caution: 'Risk aversion. Higher = fewer predator encounters but less food and slower travel.',
};

export const DEFAULT_BEHAVIORAL_SETTINGS: BehavioralSettings = {
  foraging: 3,
  belligerence: 2,
  mating: 2,
  exploration: 3,
  sociability: 3,
  caution: 3,
};

/** Attention budget for species that don't set their own */
export const DEFAULT_ATTENTION_BUDGET = 18;

/** Lowered first when settings exceed the budget: least survival-critical first */
const REDUCTION_ORDER: (keyof BehavioralSettings)[] = [
  'exploration', 'sociability', 'mating', 'belligerence', 'caution', 'foraging',
];

export function behaviorPointsUsed(settings: BehavioralSettings): number {
  return REDUCTION_ORDER.reduce((sum, key) => sum + settings[key], 0);
}

/**
 * Lower the highest settings until the total fits the species' attention
 * budget, so a species with a small budget doesn't start over it.
 */
export function fitBehaviorToBudget(settings: BehavioralSettings, budget: number): BehavioralSettings {
  const fitted = { ...settings };
  let total = behaviorPointsUsed(fitted);
  while (total > budget) {
    const highest = REDUCTION_ORDER.reduce((a, b) => (fitted[b] > fitted[a] ? b : a));
    if (fitted[highest] <= 1) break;
    fitted[highest] = (fitted[highest] - 1) as BehaviorLevel;
    total--;
  }
  return fitted;
}
