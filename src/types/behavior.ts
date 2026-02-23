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
