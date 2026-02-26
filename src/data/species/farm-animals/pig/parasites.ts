import type { ParasiteDefinition } from '../../../../types/health';
import { StatId } from '../../../../types/stats';

export const PIG_PARASITES: Record<string, ParasiteDefinition> = {
  'pig-louse': {
    id: 'pig-louse',
    name: 'Hog Louse',
    scientificName: 'Haematopinus suis',
    description: 'The largest louse to infect domestic animals, causing significant itchiness and skin irritation.',
    transmissionMethod: 'contact',
    affectedSpecies: ['pig'],
    stages: [
      {
        severity: 'minor',
        description: 'Compulsive scratching and mild skin irritation.',
        statEffects: [{ stat: StatId.HEA, amount: -2 }, { stat: StatId.STR, amount: 3 }],
        secondaryEffects: [],
        turnDuration: { min: 4, max: 12 },
        progressionChance: 0.15,
        remissionChance: 0.25,
      },
      {
        severity: 'moderate',
        description: 'Persistent scratching has left the skin raw and bleeding in places.',
        statEffects: [{ stat: StatId.HEA, amount: -6 }, { stat: StatId.STR, amount: 8 }],
        secondaryEffects: ['skin infection'],
        turnDuration: { min: 6, max: 15 },
        progressionChance: 0,
        remissionChance: 0.1,
      }
    ],
  },
  'swine-roundworm': {
    id: 'swine-roundworm',
    name: 'Large Roundworm',
    scientificName: 'Ascaris suum',
    description: 'A large roundworm that lives in the intestine, stealing nutrients and damaging the liver during migration.',
    transmissionMethod: 'environmental',
    affectedSpecies: ['pig'],
    stages: [
      {
        severity: 'moderate',
        description: 'Poor growth and occasional coughing as larvae migrate through the lungs.',
        statEffects: [{ stat: StatId.HEA, amount: -10 }, { stat: StatId.IMM, amount: -5 }],
        secondaryEffects: ['thumps'],
        turnDuration: { min: 10, max: 30 },
        progressionChance: 0.2,
        remissionChance: 0,
      },
      {
        severity: 'severe',
        description: 'Chronic emaciation and intestinal obstruction from a massive worm burden.',
        statEffects: [{ stat: StatId.HEA, amount: -25 }, { stat: StatId.IMM, amount: -15 }],
        secondaryEffects: ['intestinal blockage'],
        turnDuration: { min: 5, max: 15 },
        progressionChance: 0,
        remissionChance: 0,
      }
    ],
  },
};
