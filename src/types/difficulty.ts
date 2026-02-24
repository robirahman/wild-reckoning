export type Difficulty = 'easy' | 'normal' | 'hard';

export interface DifficultyMultipliers {
  deathChanceFactor: number;
  weightLossFactor: number;
  weightGainFactor: number;
  parasiteProgressionFactor: number;
  predatorEncounterFactor: number;
}

export const DIFFICULTY_PRESETS: Record<Difficulty, DifficultyMultipliers> = {
  easy: {
    deathChanceFactor: 0.5,
    weightLossFactor: 0.7,
    weightGainFactor: 1.3,
    parasiteProgressionFactor: 0.6,
    predatorEncounterFactor: 0.7,
  },
  normal: {
    deathChanceFactor: 1.0,
    weightLossFactor: 1.0,
    weightGainFactor: 1.0,
    parasiteProgressionFactor: 1.0,
    predatorEncounterFactor: 1.0,
  },
  hard: {
    deathChanceFactor: 1.5,
    weightLossFactor: 1.4,
    weightGainFactor: 0.8,
    parasiteProgressionFactor: 1.4,
    predatorEncounterFactor: 1.3,
  },
};

export const DIFFICULTY_DESCRIPTIONS: Record<Difficulty, string> = {
  easy: 'Gentler survival — lower death chances, slower weight loss, more foraging.',
  normal: 'The intended experience — balanced challenge.',
  hard: 'Brutal wilderness — more predators, harsher winters, faster disease.',
};
