import type { ParasiteDefinition } from '../../../../types/health';
import { StatId } from '../../../../types/stats';

export const CHICKEN_PARASITES: Record<string, ParasiteDefinition> = {
  'chicken-mite': {
    id: 'chicken-mite',
    name: 'Red Mite',
    scientificName: 'Dermanyssus gallinae',
    description: 'Small, blood-sucking arachnids that hide in the coop and feed on you at night.',
    transmissionMethod: 'contact',
    affectedSpecies: ['chicken'],
    stages: [
      {
        severity: 'minor',
        description: 'Occasional itching and mild blood loss.',
        statEffects: [{ stat: StatId.HEA, amount: -1 }, { stat: StatId.STR, amount: 2 }],
        secondaryEffects: [],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.1,
        remissionChance: 0.2,
      },
      {
        severity: 'moderate',
        description: 'Constant itching and lethargy from heavy blood loss.',
        statEffects: [{ stat: StatId.HEA, amount: -4 }, { stat: StatId.STR, amount: 5 }],
        secondaryEffects: ['anemia'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.1,
        remissionChance: 0.1,
      }
    ],
  },
  'scaly-leg-mite': {
    id: 'scaly-leg-mite',
    name: 'Scaly Leg Mite',
    scientificName: 'Knemidocoptes mutans',
    description: 'Mites that burrow under the scales of your legs, causing irritation and swelling.',
    transmissionMethod: 'contact',
    affectedSpecies: ['chicken'],
    stages: [
      {
        severity: 'moderate',
        description: 'The scales on your legs are raised and crusty, making movement painful.',
        statEffects: [{ stat: StatId.HEA, amount: -3 }],
        secondaryEffects: ['lameness'],
        turnDuration: { min: 8, max: 20 },
        progressionChance: 0,
        remissionChance: 0.05,
      }
    ],
  },
};
