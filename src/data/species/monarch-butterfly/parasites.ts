import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const MONARCH_BUTTERFLY_PARASITES: Record<string, ParasiteDefinition> = {
  'oe-protozoan': {
    id: 'oe-protozoan',
    name: 'OE Protozoan',
    scientificName: 'Ophryocystis elektroscirrha',
    description: 'A debilitating protozoan parasite specific to monarch butterflies. Spores are ingested by caterpillars from contaminated milkweed and replicate inside the body during metamorphosis. Infected adults emerge with deformed wings and reduced flight ability. Heavily infected monarchs cannot complete migration.',
    transmissionMethod: 'Ingestion of spores shed by infected adults onto milkweed leaves, consumed by caterpillars',
    affectedSpecies: ['monarch-butterfly'],
    stages: [
      {
        severity: 'minor',
        description: 'A subclinical OE infection. Spore load is low. No visible symptoms, but your immune system is quietly fighting the parasite.',
        statEffects: [
          { stat: StatId.WIS, amount: -2 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.15,
        remissionChance: 0.10,
      },
      {
        severity: 'moderate',
        description: 'The OE spore load is increasing. Your flight muscles are weakened, and your wings feel heavier than they should. You tire more quickly and cannot sustain long flights.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.ADV, amount: 8 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['reduced flight endurance', 'impaired migration ability'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.12,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Severe OE infection. Your wings emerged crumpled and partially deformed from the chrysalis. Dark patches of spores are visible on your abdomen. Flight is labored and erratic.',
        statEffects: [
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.ADV, amount: 20 },
          { stat: StatId.HOM, amount: 18 },
        ],
        secondaryEffects: ['wing deformity', 'severe flight impairment', 'spore shedding onto milkweed'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.10,
        remissionChance: 0.01,
      },
      {
        severity: 'critical',
        description: 'Your body is riddled with OE spores. Your wings are too deformed to achieve sustained flight. You cling to milkweed stems, unable to migrate, unable to feed effectively. Every movement sheds thousands of spores onto the plants below — infecting the next generation.',
        statEffects: [
          { stat: StatId.HEA, amount: -35 },
        ],
        secondaryEffects: ['unable to fly', 'mass spore contamination', 'starvation risk'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0,
      },
    ],
  },

  'tachinid-parasitoid': {
    id: 'tachinid-parasitoid',
    name: 'Tachinid Parasitoid',
    scientificName: 'Lespesia archippivora',
    description: 'A parasitoid fly that lays its eggs on or near monarch caterpillars. The fly larva burrows into the caterpillar and feeds on its internal tissues from the inside, eventually killing its host as it emerges to pupate. One of the most common causes of death in monarch caterpillars.',
    transmissionMethod: 'Direct egg deposition on caterpillar skin by adult tachinid fly',
    affectedSpecies: ['monarch-butterfly'],
    stages: [
      {
        severity: 'minor',
        description: 'A tiny white egg is attached to your skin. You cannot remove it. Something is wrong, but you feel only a faint irritation where the egg sits.',
        statEffects: [
          { stat: StatId.ADV, amount: 8 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.35,
        remissionChance: 0.05,
      },
      {
        severity: 'moderate',
        description: 'The tachinid larva has hatched and burrowed into your body. It is feeding on your non-vital tissues, growing steadily. You feel a deep wrongness — a presence inside you, consuming you slowly.',
        statEffects: [
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 18 },
          { stat: StatId.ADV, amount: 15 },
        ],
        secondaryEffects: ['internal tissue damage', 'progressive weakening'],
        turnDuration: { min: 2, max: 4 },
        progressionChance: 0.40,
        remissionChance: 0.01,
      },
      {
        severity: 'severe',
        description: 'The tachinid larvae are consuming your vital tissues. Your body is being hollowed out from the inside. There is no recovery from this — the parasitoid will emerge from your body to continue its own life cycle. You are dying.',
        statEffects: [
          { stat: StatId.HEA, amount: -30 },
          { stat: StatId.HOM, amount: 30 },
        ],
        secondaryEffects: ['fatal tissue destruction', 'parasitoid emergence imminent'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0,
      },
    ],
  },
};
