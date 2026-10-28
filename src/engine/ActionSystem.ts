/** Player-initiated voluntary actions — one per turn */

import type { StatEffect, Consequence } from '../types/events';
import { StatId } from '../types/stats';
import { TERRITORIAL_SPECIES } from './TerritorySystem';
import { isCaptive } from './captivity';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { AnimalState } from '../types/species';

// Minimal context to avoid circular import with gameStore
export interface ActionContext {
  speciesId: string;
  config: SpeciesConfig;
  territory: { established: boolean };
  reproductionType: 'iteroparous' | 'semelparous';
  season: string;
  matingSeasons: string[] | 'any';
  rng: { chance: (p: number) => boolean };
  nutrients: { minerals: number; vitamins: number };
  ageMonths: number;
  sex: 'male' | 'female';
  /** Confined animals can't roam, forage freely, or seek mates */
  captive: boolean;
}

/** Build an action context from the slice of game state actions depend on */
export function buildActionContext(state: {
  animal: Pick<AnimalState, 'speciesId' | 'age' | 'sex' | 'nutrients'>;
  speciesBundle: { config: SpeciesConfig };
  territory: { established: boolean };
  time: { season: string };
  rng: { chance: (p: number) => boolean };
}): ActionContext {
  const config = state.speciesBundle.config;
  const reproduction = config.reproduction;
  return {
    speciesId: state.animal.speciesId,
    config,
    territory: state.territory,
    reproductionType: reproduction.type,
    season: state.time.season,
    matingSeasons: reproduction.type === 'iteroparous' ? reproduction.matingSeasons ?? 'any' : [],
    rng: state.rng,
    nutrients: state.animal.nutrients,
    ageMonths: state.animal.age,
    sex: state.animal.sex,
    captive: isCaptive(config),
  };
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
    execute: (ctx) => {
      const override = ctx.config.actions?.overrides?.['mark-territory'];
      return {
        narrative: override?.narrative ??
          'You patrol the boundaries of your range, refreshing scent marks on trees and scrapes.',
        statEffects: [],
        consequences: [
          { type: 'modify_territory', qualityChange: 5 },
          { type: 'set_flag', flag: 'territory-marked' },
        ],
      };
    },
  },
  {
    id: 'rest',
    label: 'Rest',
    description: 'Find shelter and conserve your strength.',
    isAvailable: () => true,
    execute: (ctx) => {
      const override = ctx.config.actions?.overrides?.['rest'];
      return {
        narrative: override?.narrative ??
          'You find a sheltered spot and rest, conserving your strength.',
        statEffects: [
          { stat: StatId.HEA, amount: 3, duration: 2, label: '+HEA' },
        ],
        consequences: [
          { type: 'set_flag', flag: 'resting' },
          { type: 'restore_energy', amount: 25 },
        ],
      };
    },
  },
  {
    id: 'explore',
    label: 'Explore',
    description: 'Venture into unfamiliar ground looking for resources.',
    isAvailable: (ctx) => !ctx.captive,
    execute: (ctx) => {
      const override = ctx.config.actions?.overrides?.['explore'];
      const foundFood = ctx.rng.chance(0.4);
      const weightGain = override?.weightGain ?? 2;
      
      return {
        narrative: foundFood
          ? (override?.narrative ?? 'You push into unfamiliar terrain and discover a rich patch of forage hidden in a hollow.')
          : 'You wander through unfamiliar ground but find nothing of note.',
        statEffects: [],
        consequences: foundFood
          ? [{ type: 'modify_weight', amount: weightGain }]
          : [],
      };
    },
  },
  {
    id: 'search-mate',
    label: 'Search for Mate',
    description: 'Seek out a potential breeding partner.',
    isAvailable: (ctx) => {
      if (ctx.reproductionType !== 'iteroparous' || ctx.captive) return false;
      // Too young to breed: no point searching
      const reproduction = ctx.config.reproduction;
      if (reproduction.type === 'iteroparous' && ctx.ageMonths < reproduction.matingMinAge) return false;
      if (ctx.matingSeasons === 'any') return true;
      return ctx.matingSeasons.includes(ctx.season);
    },
    execute: (ctx) => {
      const override = ctx.config.actions?.overrides?.['search-mate'];
      const found = ctx.rng.chance(0.3);
      return {
        narrative: found
          ? (override?.narrative ?? 'After a patient search you encounter another of your kind — a promising mate.')
          : 'You search the surrounding area but find no suitable mates.',
        statEffects: [],
        consequences: found
          ? [{ type: 'introduce_npc', npcType: 'mate' }]
          : [],
      };
    },
  },
  {
    id: 'seek-minerals',
    label: 'Seek Salt/Minerals',
    description: 'Search for a mineral lick or rich clay to supplement your diet.',
    isAvailable: (ctx) => !ctx.captive && ctx.nutrients.minerals < 60,
    execute: (ctx) => {
      const found = ctx.rng.chance(0.4);
      return {
        narrative: found
          ? 'You discover a patch of mineral-rich soil and spend time pawing and licking at the earth, satisfying a deep biological craving.'
          : 'You search for a salt lick but find only ordinary dirt.',
        statEffects: [],
        consequences: found
          ? [{ type: 'modify_nutrients', nutrient: 'minerals', amount: 40 }]
          : [],
      };
    },
  },
  {
    id: 'medicinal-forage',
    label: 'Search for Medicinal Plants',
    description: 'Look for specific plants to soothe your ailments.',
    isAvailable: (ctx) => {
      // Logic would need to check actual HEA stat via ctx if we had it.
      // For now available if minerals or vitamins are low.
      return !ctx.captive && ctx.nutrients.vitamins < 50;
    },
    execute: (ctx) => {
      const found = ctx.rng.chance(0.3);
      return {
        narrative: found
          ? 'You find a patch of wild herbs that your instincts tell you will help. After eating them, you feel a slight cooling of your internal stresses.'
          : 'You search for medicinal herbs but cannot distinguish them from the common browse.',
        statEffects: [
          { stat: StatId.HEA, amount: 5, duration: 4, label: '+HEA (Med)' }
        ],
        consequences: found
          ? [{ type: 'modify_nutrients', nutrient: 'vitamins', amount: 30 }, { type: 'set_flag', flag: 'medicated' }]
          : [],
      };
    },
  },
];

/** Return only the actions whose prerequisites are met */
export function getAvailableActions(ctx: ActionContext): VoluntaryAction[] {
  return VOLUNTARY_ACTIONS.map(action => {
    const override = ctx.config.actions?.overrides?.[action.id];
    if (override) {
      return {
        ...action,
        label: override.label ?? action.label,
        description: override.description ?? action.description,
      };
    }
    return action;
  }).filter((a) => a.isAvailable(ctx));
}
