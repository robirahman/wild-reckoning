import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const COMMON_OCTOPUS_PARASITES: Record<string, ParasiteDefinition> = {
  'dicyemid-parasite': {
    id: 'dicyemid-parasite',
    name: 'Dicyemid Parasite',
    scientificName: 'Dicyema typus',
    description: 'A bizarre, simple organism found exclusively in cephalopod kidneys. Dicyemids are among the most anatomically simple multicellular animals — just 10-40 cells arranged in a worm-like body. They are so common in octopuses that some researchers consider them commensals rather than parasites, but heavy infections can impair kidney function and osmoregulation.',
    transmissionMethod: 'Waterborne infusoriform larvae invade the renal appendages',
    affectedSpecies: ['common-octopus'],
    stages: [
      {
        severity: 'minor',
        description: 'A small colony of dicyemids has established in your kidneys. You barely notice their presence.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
          { stat: StatId.HOM, amount: 3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.12,
        remissionChance: 0.15,
      },
      {
        severity: 'moderate',
        description: 'The dicyemid population has grown substantially. Your kidneys are struggling to maintain proper osmotic balance. You feel sluggish and your color changes are slower.',
        statEffects: [
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['impaired osmoregulation', 'sluggish chromatophore response'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.10,
        remissionChance: 0.05,
      },
      {
        severity: 'severe',
        description: 'Your kidneys are overwhelmed with dicyemid colonies. Metabolic waste is accumulating in your blood. Your arms move slowly and your hunting accuracy has plummeted.',
        statEffects: [
          { stat: StatId.IMM, amount: 20 },
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 16 },
        ],
        secondaryEffects: ['renal failure risk', 'metabolic toxicity'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },

  'aggregata-coccidian': {
    id: 'aggregata-coccidian',
    name: 'Coccidian Parasite',
    scientificName: 'Aggregata octopiana',
    description: 'A protozoan parasite transmitted through infected crabs — the octopus\'s primary prey. The parasite invades the intestinal wall, forming cysts that destroy the gut lining and severely impair nutrient absorption. In the Mediterranean, infection rates in wild octopuses can exceed 90%.',
    transmissionMethod: 'Ingestion of infected crustacean intermediate hosts',
    affectedSpecies: ['common-octopus'],
    stages: [
      {
        severity: 'minor',
        description: 'A few coccidian cysts are developing in your intestinal wall. You feel a vague discomfort after eating.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
          { stat: StatId.HOM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0.18,
        remissionChance: 0.08,
      },
      {
        severity: 'moderate',
        description: 'The coccidian cysts have spread throughout your intestinal lining. Your gut is inflamed and nutrient absorption is compromised. You are eating more but gaining less weight.',
        statEffects: [
          { stat: StatId.IMM, amount: 16 },
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 12 },
        ],
        secondaryEffects: ['malabsorption', 'chronic intestinal inflammation'],
        turnDuration: { min: 2, max: 4 },
        progressionChance: 0.12,
        remissionChance: 0.03,
      },
      {
        severity: 'severe',
        description: 'Your intestinal wall is riddled with mature coccidian cysts. The gut lining is largely destroyed. You can barely absorb nutrients from the crabs you catch. Starvation looms despite your hunting success.',
        statEffects: [
          { stat: StatId.IMM, amount: 24 },
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.HOM, amount: 18 },
        ],
        secondaryEffects: ['severe malnutrition', 'intestinal perforation risk'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'vibrio-infection': {
    id: 'vibrio-infection',
    name: 'Vibrio Infection',
    scientificName: 'Vibrio alginolyticus',
    description: 'An opportunistic marine bacterium that infects wounds and weakened tissue. In octopuses, Vibrio infections typically enter through arm injuries or skin abrasions, causing progressive tissue necrosis. Warm Mediterranean summer waters increase bacterial loads dramatically.',
    transmissionMethod: 'Wound infection from bacteria-laden seawater',
    affectedSpecies: ['common-octopus'],
    stages: [
      {
        severity: 'minor',
        description: 'A wound on one arm has become slightly infected. The skin around it is pale and the suckers nearby are less responsive.',
        statEffects: [
          { stat: StatId.IMM, amount: 6 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.15,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description: 'The infection has spread along the arm. Necrotic tissue is visible — pale patches where the skin is dying. You are holding the affected arm curled against your body.',
        statEffects: [
          { stat: StatId.IMM, amount: 14 },
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 8 },
        ],
        secondaryEffects: ['tissue necrosis', 'reduced arm function'],
        turnDuration: { min: 2, max: 4 },
        progressionChance: 0.10,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Sepsis. The bacterial infection has entered your bloodstream. Your three hearts are laboring. Your skin has lost its ability to change color in the affected areas. Your body is shutting down.',
        statEffects: [
          { stat: StatId.IMM, amount: 22 },
          { stat: StatId.HEA, amount: -25 },
          { stat: StatId.HOM, amount: 15 },
        ],
        secondaryEffects: ['septicemia', 'multi-organ stress'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },
};
