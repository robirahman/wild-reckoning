import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const ARCTIC_TERN_PARASITES: Record<string, ParasiteDefinition> = {
  'avian-malaria': {
    id: 'avian-malaria',
    name: 'Avian Malaria',
    scientificName: 'Plasmodium relictum',
    description: 'A blood parasite transmitted by mosquitoes that infects red blood cells, causing anemia, lethargy, and organ damage. Migratory birds are exposed in temperate stopover sites where mosquitoes breed. Chronic infections reduce flight endurance and can flare during the stress of long migrations.',
    transmissionMethod: 'Bite from infected mosquitoes at temperate stopover sites',
    affectedSpecies: ['arctic-tern'],
    stages: [
      {
        severity: 'minor',
        description: 'A mild fever and slight lethargy. Your flight feels heavier than usual, and you tire more quickly when diving for fish.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
          { stat: StatId.HOM, amount: 4 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0.14,
        remissionChance: 0.10,
      },
      {
        severity: 'moderate',
        description: 'Anemia is setting in as the parasites destroy your red blood cells. Your endurance has dropped noticeably. Long-distance flight is exhausting, and you struggle to keep up with the flock during migration.',
        statEffects: [
          { stat: StatId.IMM, amount: 16 },
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['anemia', 'reduced flight endurance'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.10,
        remissionChance: 0.05,
      },
      {
        severity: 'severe',
        description: 'Severe anemia and organ damage. Your spleen is enlarged, your liver struggling. You can barely maintain altitude. If this flares during migration, you will fall into the ocean with no land in sight.',
        statEffects: [
          { stat: StatId.IMM, amount: 24 },
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 16 },
        ],
        secondaryEffects: ['organ failure risk', 'critical flight impairment'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },

  'feather-lice': {
    id: 'feather-lice',
    name: 'Feather Lice',
    scientificName: 'Quadraceps punctatus',
    description: 'Tiny wingless insects that live on feathers and feed on feather barbs and skin debris. Heavy infestations degrade feather quality, reducing insulation and flight efficiency. Preening helps control them, but stressed or injured birds often cannot keep up with grooming.',
    transmissionMethod: 'Direct contact with infested birds in colony nesting sites',
    affectedSpecies: ['arctic-tern'],
    stages: [
      {
        severity: 'minor',
        description: 'A few lice along your primary flight feathers. You preen more frequently but it is manageable.',
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
        description: 'The infestation has spread across your body. Feather barbs are ragged and misaligned. Flight is less efficient, costing you more energy per mile. Insulation is compromised in cold conditions.',
        statEffects: [
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.HEA, amount: -6 },
          { stat: StatId.CLI, amount: 8 },
        ],
        secondaryEffects: ['degraded feather quality', 'increased flight cost'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.08,
        remissionChance: 0.06,
      },
      {
        severity: 'severe',
        description: 'Your plumage is severely compromised. Patches of feathers are missing or fragmented. Flight is labored and you are losing body heat rapidly. Waterproofing is failing.',
        statEffects: [
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.HEA, amount: -14 },
          { stat: StatId.CLI, amount: 15 },
        ],
        secondaryEffects: ['critical feather loss', 'waterproofing failure'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },

  'cestode-tapeworm': {
    id: 'cestode-tapeworm',
    name: 'Intestinal Tapeworm',
    scientificName: 'Tetrabothrius erostris',
    description: 'A flatworm acquired by eating infected fish or crustaceans. The tapeworm attaches to the intestinal wall and absorbs nutrients meant for the host. In birds that must maintain precise weight for efficient flight, even a moderate tapeworm burden can tip the energy balance toward starvation.',
    transmissionMethod: 'Ingestion of infected fish or crustacean intermediate hosts',
    affectedSpecies: ['arctic-tern'],
    stages: [
      {
        severity: 'minor',
        description: 'A small tapeworm has established in your gut. Your appetite has increased slightly but your weight gain from foraging seems diminished.',
        statEffects: [
          { stat: StatId.IMM, amount: 6 },
          { stat: StatId.HOM, amount: 4 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 7 },
        progressionChance: 0.12,
        remissionChance: 0.08,
      },
      {
        severity: 'moderate',
        description: 'The tapeworm is growing, stealing a significant portion of every meal. You eat constantly but remain thin. The energy deficit is affecting your flight muscles and alertness.',
        statEffects: [
          { stat: StatId.IMM, amount: 14 },
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 8 },
        ],
        secondaryEffects: ['chronic weight loss', 'nutrient malabsorption'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.10,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Multiple large tapeworms fill your intestinal tract. You are starving despite eating. Your body is consuming its own muscle to fuel basic functions. Flight is becoming impossible.',
        statEffects: [
          { stat: StatId.IMM, amount: 22 },
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 14 },
        ],
        secondaryEffects: ['intestinal obstruction risk', 'severe emaciation'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'avian-cholera': {
    id: 'avian-cholera',
    name: 'Avian Cholera',
    scientificName: 'Pasteurella multocida',
    description:
      'A fast-moving bacterial disease that devastates colonial seabird nesting sites. Transmitted through contaminated water, nasal discharge, or contact with carcasses. In dense tern colonies, a single infected bird can trigger an epidemic that kills thousands within days.',
    transmissionMethod: 'Contact with infected birds or contaminated water at colonial nesting sites',
    affectedSpecies: ['arctic-tern'],
    stages: [
      {
        severity: 'minor',
        description:
          'Mild lethargy and ruffled feathers. You sit on your nest with your head tucked, less responsive than usual.',
        statEffects: [
          { stat: StatId.IMM, amount: 10 },
          { stat: StatId.HEA, amount: -5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0.30,
        remissionChance: 0.15,
      },
      {
        severity: 'moderate',
        description:
          'Green, watery diarrhea and labored breathing. You have stopped feeding and sit motionless on the colony periphery. Other terns avoid you.',
        statEffects: [
          { stat: StatId.HEA, amount: -16 },
          { stat: StatId.IMM, amount: 20 },
          { stat: StatId.HOM, amount: 12 },
        ],
        secondaryEffects: ['rapid dehydration', 'isolation from colony'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0.25,
        remissionChance: 0.08,
      },
      {
        severity: 'severe',
        description:
          'Convulsions and collapse. Avian cholera kills fast — most birds are dead within 24 hours of severe onset. The colony ground is littered with carcasses.',
        statEffects: [
          { stat: StatId.HEA, amount: -30 },
          { stat: StatId.IMM, amount: 28 },
        ],
        secondaryEffects: ['septicemia', 'death within hours'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0.03,
      },
    ],
  },
};
