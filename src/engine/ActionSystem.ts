/** Player-initiated voluntary actions — one per turn */

import type { StatEffect, Consequence } from '../types/events';
import { StatId } from '../types/stats';
import { TERRITORIAL_SPECIES } from './TerritorySystem';

// Minimal context to avoid circular import with gameStore
export interface ActionContext {
  speciesId: string;
  territory: { established: boolean };
  reproductionType: 'iteroparous' | 'semelparous';
  season: string;
  matingSeasons: string[] | 'any';
  rng: { chance: (p: number) => boolean };
}

export interface ActionResult {
  narrative: string;
  statEffects: StatEffect[];
  consequences: Consequence[];
}

export interface VoluntaryAction {
  id: string;
  label: string;
  description: string;
  isAvailable: (ctx: ActionContext) => boolean;
  execute: (ctx: ActionContext) => ActionResult;
}

export const VOLUNTARY_ACTIONS: VoluntaryAction[] = [
  {
    id: 'mark-territory',
    label: 'Mark Territory',
    description: 'Patrol and refresh scent marks along your territorial boundaries.',
    isAvailable: (ctx) =>
      TERRITORIAL_SPECIES.has(ctx.speciesId) && ctx.territory.established,
    execute: () => ({
      narrative:
        'You patrol the boundaries of your range, refreshing scent marks on trees and scrapes.',
      statEffects: [],
      consequences: [
        { type: 'modify_territory', qualityChange: 5 },
        { type: 'set_flag', flag: 'territory-marked' },
      ],
    }),
  },
  {
    id: 'rest',
    label: 'Rest',
    description: 'Find shelter and conserve your strength.',
    isAvailable: () => true,
    execute: () => ({
      narrative:
        'You find a sheltered spot and rest, conserving your strength.',
      statEffects: [
        { stat: StatId.HEA, amount: 3, duration: 2, label: '+HEA' },
      ],
      consequences: [
        { type: 'set_flag', flag: 'resting' },
      ],
    }),
  },
  {
    id: 'explore',
    label: 'Explore',
    description: 'Venture into unfamiliar ground looking for resources.',
    isAvailable: () => true,
    execute: (ctx) => {
      const foundFood = ctx.rng.chance(0.4);
      return {
        narrative: foundFood
          ? 'You push into unfamiliar terrain and discover a rich patch of forage hidden in a hollow.'
          : 'You wander through unfamiliar ground but find nothing of note.',
        statEffects: [
          { stat: StatId.NOV, amount: 5, duration: 2, label: '+NOV' },
        ],
        consequences: foundFood
          ? [{ type: 'modify_weight', amount: 2 }]
          : [],
      };
    },
  },
  {
    id: 'search-mate',
    label: 'Search for Mate',
    description: 'Seek out a potential breeding partner.',
    isAvailable: (ctx) => {
      if (ctx.reproductionType !== 'iteroparous') return false;
      if (ctx.matingSeasons === 'any') return true;
      return ctx.matingSeasons.includes(ctx.season);
    },
    execute: (ctx) => {
      const found = ctx.rng.chance(0.3);
      return {
        narrative: found
          ? 'After a patient search you encounter another of your kind — a promising mate.'
          : 'You search the surrounding area but find no suitable mates.',
        statEffects: [],
        consequences: found
          ? [{ type: 'introduce_npc', npcType: 'mate' }]
          : [],
      };
    },
  },
];

/** Return only the actions whose prerequisites are met */
export function getAvailableActions(ctx: ActionContext): VoluntaryAction[] {
  return VOLUNTARY_ACTIONS.filter((a) => a.isAvailable(ctx));
}
