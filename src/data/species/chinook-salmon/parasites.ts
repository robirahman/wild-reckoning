import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const CHINOOK_SALMON_PARASITES: Record<string, ParasiteDefinition> = {
  'sea-lice': {
    id: 'sea-lice',
    name: 'Sea Lice',
    scientificName: 'Lepeophtheirus salmonis',
    description: 'Parasitic copepods that attach to the skin and feed on mucus, blood, and skin tissue. Heavy infestations erode the protective mucus layer, leading to osmotic stress, secondary infections, and progressive weight loss.',
    transmissionMethod: 'Contact with infested fish or free-swimming larval copepodids in ocean waters',
    affectedSpecies: ['chinook-salmon'],
    stages: [
      {
        severity: 'minor',
        description: 'A few sea lice have attached to your flanks. Mild irritation and minor mucus loss.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
          { stat: StatId.ADV, amount: 3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.18,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description: 'The sea lice population is growing. Your mucus layer is visibly damaged, and raw patches of skin are exposed to saltwater. You are losing weight.',
        statEffects: [
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.HEA, amount: -6 },
          { stat: StatId.HOM, amount: 8 },
        ],
        secondaryEffects: ['osmotic stress', 'secondary infection risk'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.12,
        remissionChance: 0.06,
      },
      {
        severity: 'severe',
        description: 'Massive sea lice infestation. Large areas of skin are destroyed, exposing raw tissue. You are hemorrhaging fluids and your immune system is overwhelmed.',
        statEffects: [
          { stat: StatId.IMM, amount: 22 },
          { stat: StatId.HEA, amount: -15 },
          { stat: StatId.HOM, amount: 15 },
        ],
        secondaryEffects: ['severe osmotic failure', 'anemia', 'high secondary infection risk'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },

  'ich-white-spot': {
    id: 'ich-white-spot',
    name: 'Ich / White Spot Disease',
    scientificName: 'Ichthyophthirius multifiliis',
    description: 'A protozoan parasite that burrows into the skin and gills, forming characteristic white cysts. Causes respiratory distress and skin damage, and can be fatal in heavy infections.',
    transmissionMethod: 'Contact with free-swimming theronts released from cysts on infected fish or substrate',
    affectedSpecies: ['chinook-salmon'],
    stages: [
      {
        severity: 'minor',
        description: 'Small white spots are appearing on your skin and gill covers. Mild respiratory irritation and occasional flashing against rocks.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
          { stat: StatId.HOM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 6 },
        progressionChance: 0.22,
        remissionChance: 0.15,
      },
      {
        severity: 'moderate',
        description: 'White cysts cover much of your body and gills. Breathing is labored, and your skin is inflamed and producing excess mucus. You are sluggish and vulnerable.',
        statEffects: [
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 12 },
        ],
        secondaryEffects: ['respiratory distress', 'reduced swimming speed'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0,
        remissionChance: 0.08,
      },
    ],
  },

  'bacterial-kidney-disease': {
    id: 'bacterial-kidney-disease',
    name: 'Bacterial Kidney Disease',
    scientificName: 'Renibacterium salmoninarum',
    description: 'A chronic, systemic bacterial infection that targets the kidneys and other internal organs. Slow-progressing but extremely difficult to clear, it causes progressive organ failure and is a major killer of salmonids.',
    transmissionMethod: 'Vertical transmission from infected mother, or horizontal transmission through water contact with infected fish',
    affectedSpecies: ['chinook-salmon'],
    stages: [
      {
        severity: 'minor',
        description: 'The bacteria have colonized your kidneys. No external symptoms yet, but your immune system is under increasing strain.',
        statEffects: [
          { stat: StatId.IMM, amount: 10 },
          { stat: StatId.HEA, amount: -3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 6, max: 14 },
        progressionChance: 0.12,
        remissionChance: 0.05,
      },
      {
        severity: 'moderate',
        description: 'Your kidneys are swollen and pale with granulomatous lesions. Fluid is accumulating in your abdomen. You are visibly lethargic and your appetite is declining.',
        statEffects: [
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['renal impairment', 'abdominal distension'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.10,
        remissionChance: 0.02,
      },
      {
        severity: 'severe',
        description: 'Systemic organ failure. Your kidneys are barely functioning, your spleen is enlarged, and white granulomas are spreading through your internal organs. You are emaciated and barely able to swim.',
        statEffects: [
          { stat: StatId.IMM, amount: 28 },
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 20 },
        ],
        secondaryEffects: ['multi-organ failure risk', 'severe immunosuppression'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },
};
