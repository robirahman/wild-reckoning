import type { Mutation } from '../types/evolution';
import { StatId } from '../types/stats';

export const MUTATIONS: Mutation[] = [
  // ── Stat Boosts ──
  {
    id: 'dense-muscle',
    name: 'Dense Muscle Fiber',
    description: 'Generations of struggle have hardened your lineage. Permanent +10 STR.',
    type: 'stat',
    statModifiers: [{ stat: StatId.STR, amount: 10 }],
    rarity: 'common',
  },
  {
    id: 'heightened-senses',
    name: 'Heightened Senses',
    description: 'Your ancestors survived by noticing what others missed. Permanent +10 ADV.',
    type: 'stat',
    statModifiers: [{ stat: StatId.ADV, amount: 10 }],
    rarity: 'common',
  },
  {
    id: 'iron-stomach',
    name: 'Iron Stomach',
    description: 'Your lineage can digest things others cannot. Permanent +10 IMM.',
    type: 'stat',
    statModifiers: [{ stat: StatId.IMM, amount: 10 }],
    rarity: 'common',
  },
  
  // ── Traits (Environmental) ──
  {
    id: 'thick-fur',
    name: 'Winter Coat',
    description: 'Adapted for the bitter cold. Greatly increased cold resistance.',
    type: 'trait',
    traitId: 'cold_resistance',
    statModifiers: [{ stat: StatId.CLI, amount: 15 }],
    rarity: 'rare',
  },
  {
    id: 'heat-dispersal',
    name: 'Heat Dispersal',
    description: 'Larger ears or efficient panting. Greatly increased heat resistance.',
    type: 'trait',
    traitId: 'heat_resistance',
    statModifiers: [{ stat: StatId.CLI, amount: 15 }],
    rarity: 'rare',
  },

  // ── Legendary ──
  {
    id: 'apex-predator',
    name: 'Apex Instinct',
    description: 'You are born to rule. Massive bonus to dominance and combat.',
    type: 'stat',
    statModifiers: [
      { stat: StatId.STR, amount: 15 },
      { stat: StatId.TRA, amount: 15 },
    ],
    rarity: 'legendary',
  },
];
