import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';
import { parasiteDefinitions as sharedParasites } from '../../parasites/index';

const wolfParasites: Record<string, ParasiteDefinition> = {
  'sarcoptic-mange': {
    id: 'sarcoptic-mange',
    name: 'Sarcoptic Mange',
    scientificName: 'Sarcoptes scabiei',
    description:
      'A burrowing mite that tunnels into the skin, causing intense itching, hair loss, and skin thickening. Severe infestations can lead to emaciation and hypothermia as the wolf loses its insulating fur.',
    transmissionMethod: 'Direct contact with infected canids or contaminated dens',
    affectedSpecies: ['gray-wolf'],
    stages: [
      {
        severity: 'minor',
        description:
          'Patchy hair loss around the ears and muzzle. Frequent scratching and restlessness.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
        ],
        secondaryEffects: ['localized hair loss'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.18,
        remissionChance: 0.15,
      },
      {
        severity: 'moderate',
        description:
          'Widespread hair loss across the flanks and legs. Thickened, crusty skin. Constant scratching disrupts rest and hunting.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.CLI, amount: 12 },
        ],
        secondaryEffects: ['widespread hair loss', 'skin infection risk'],
        turnDuration: { min: 4, max: 12 },
        progressionChance: 0.15,
        remissionChance: 0.10,
      },
      {
        severity: 'severe',
        description:
          'Near-total hair loss. Emaciation from inability to hunt effectively. Hypothermia risk in winter without insulating fur.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.CLI, amount: 20 },
        ],
        secondaryEffects: ['emaciation', 'hypothermia risk', 'secondary bacterial infections'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0,
        remissionChance: 0.05,
      },
    ],
  },

  'canine-distemper': {
    id: 'canine-distemper',
    name: 'Canine Distemper',
    scientificName: 'Canine distemper virus (CDV)',
    description:
      'A highly contagious viral disease that attacks the respiratory, gastrointestinal, and nervous systems. Often fatal in wild canids. Spread through aerosol droplets from infected animals.',
    transmissionMethod: 'Aerosol transmission from infected canids or contact with bodily fluids',
    affectedSpecies: ['gray-wolf'],
    stages: [
      {
        severity: 'minor',
        description:
          'Mild fever and nasal discharge. Slightly reduced appetite.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.22,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description:
          'Persistent cough, labored breathing, and purulent eye discharge. Significant weight loss from inability to hunt.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.IMM, amount: 12 },
        ],
        secondaryEffects: ['respiratory distress', 'reduced hunting ability'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.20,
        remissionChance: 0.08,
      },
      {
        severity: 'severe',
        description:
          'Neurological symptoms appear: muscle twitching, circling, jaw champing. Loss of coordination makes hunting impossible.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.WIS, amount: -12 },
          { stat: StatId.IMM, amount: 18 },
        ],
        secondaryEffects: ['neurological impairment', 'seizure risk', 'high mortality'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.25,
        remissionChance: 0.03,
      },
      {
        severity: 'critical',
        description:
          'Grand mal seizures, paralysis, and complete disorientation. The wolf can no longer stand or feed.',
        statEffects: [
          { stat: StatId.HEA, amount: -30 },
          { stat: StatId.WIS, amount: -20 },
          { stat: StatId.IMM, amount: 25 },
        ],
        secondaryEffects: ['organ failure imminent', 'complete neurological collapse'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0,
        remissionChance: 0,
      },
    ],
  },

  'rabies': {
    id: 'rabies',
    name: 'Rabies',
    scientificName: 'Lyssavirus',
    description:
      'A viral disease that infects the central nervous system, transmitted through the saliva of infected animals. Invariably fatal once symptoms appear. Causes progressive behavioral changes, aggression, and paralysis.',
    transmissionMethod: 'Bite from infected animal, typically raccoon, skunk, or bat',
    affectedSpecies: ['gray-wolf'],
    stages: [
      {
        severity: 'minor',
        description:
          'Subtle behavioral changes. Unusual restlessness, licking at the bite wound site. The virus is migrating along the peripheral nerves toward the brain.',
        statEffects: [
          { stat: StatId.WIS, amount: -5 },
        ],
        secondaryEffects: ['behavioral changes'],
        turnDuration: { min: 4, max: 12 },
        progressionChance: 0.30,
        remissionChance: 0,
      },
      {
        severity: 'moderate',
        description:
          'Furious phase: unprovoked aggression, snapping at the air, attempting to bite anything nearby. Hydrophobia — throat spasms at the sight of water.',
        statEffects: [
          { stat: StatId.WIS, amount: -12 },
          { stat: StatId.ADV, amount: 10 },
        ],
        secondaryEffects: ['aggression', 'hydrophobia', 'excessive salivation'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0.35,
        remissionChance: 0,
      },
      {
        severity: 'severe',
        description:
          'Paralytic phase: progressive paralysis beginning in the hindquarters. Jaw drops open, drooling uncontrollably. Coma and death follow within days.',
        statEffects: [
          { stat: StatId.HEA, amount: -25 },
          { stat: StatId.WIS, amount: -20 },
        ],
        secondaryEffects: ['paralysis', 'respiratory failure imminent', 'always fatal'],
        turnDuration: { min: 1, max: 4 },
        progressionChance: 0,
        remissionChance: 0,
      },
    ],
  },

  'parvovirus': {
    id: 'parvovirus',
    name: 'Canine Parvovirus',
    scientificName: 'Canine parvovirus type 2 (CPV-2)',
    description:
      'A highly contagious virus that attacks rapidly dividing cells in the intestinal lining and bone marrow. Pups are most vulnerable, but adults can also be infected. Causes severe vomiting, bloody diarrhea, and rapid dehydration. The virus persists in the environment for months.',
    transmissionMethod: 'Contact with infected feces or contaminated den sites',
    affectedSpecies: ['gray-wolf'],
    stages: [
      {
        severity: 'minor',
        description:
          'Loss of appetite and mild lethargy. Your gut feels unsettled and you avoid food.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
          { stat: StatId.HOM, amount: 6 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.28,
        remissionChance: 0.15,
      },
      {
        severity: 'moderate',
        description:
          'Severe vomiting and bloody diarrhea. You are dehydrating rapidly and cannot keep food down. The pack moves on without you.',
        statEffects: [
          { stat: StatId.HEA, amount: -14 },
          { stat: StatId.IMM, amount: 16 },
          { stat: StatId.HOM, amount: 14 },
        ],
        secondaryEffects: ['severe dehydration', 'isolation from pack'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.22,
        remissionChance: 0.12,
      },
      {
        severity: 'severe',
        description:
          'Your intestinal lining is destroyed and your bone marrow is failing. Sepsis from gut bacteria entering the bloodstream. Without the fluid replacement that only a veterinary clinic could provide, this is almost certainly fatal.',
        statEffects: [
          { stat: StatId.HEA, amount: -25 },
          { stat: StatId.IMM, amount: 24 },
          { stat: StatId.HOM, amount: 20 },
        ],
        secondaryEffects: ['septicemia', 'bone marrow suppression', 'death likely'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0.05,
      },
    ],
  },
};

export const GRAY_WOLF_PARASITES: Record<string, ParasiteDefinition> = {
  ...sharedParasites,
  ...wolfParasites,
};
