/** Phase 5: Ecosystem Web engine */

import type { EcosystemState, PopulationState } from '../types/ecosystem';
import { ECOSYSTEM_LINKS, ECOSYSTEM_EVENTS } from '../data/ecosystem';
import type { Rng } from './RandomUtils';
import {
  ECOSYSTEM_REGRESSION_CHANCE,
  ECOSYSTEM_REGRESSION_AMOUNT,
  ECOSYSTEM_EVENT_COOLDOWN_TURNS,
  ECOSYSTEM_MAX_POPULATION_LEVEL,
  ECOSYSTEM_MIN_POPULATION_LEVEL,
} from './constants';

export function initializeEcosystem(): EcosystemState {
  const populations: Record<string, PopulationState> = {};
  const allSpecies = new Set<string>();

  for (const link of ECOSYSTEM_LINKS) {
    allSpecies.add(link.predator);
    allSpecies.add(link.prey);
  }

  for (const name of allSpecies) {
    populations[name] = { speciesName: name, level: 0, trend: 'stable' };
  }

  return { populations, lastEventTurn: 0, resourcePressure: 0, regionNPCs: {} };
}

export function tickEcosystem(
  eco: EcosystemState,
  regionId: string,
  turn: number,
  rng: Rng,
): { ecosystem: EcosystemState; narratives: string[] } {
  const populations = { ...eco.populations };
  const narratives: string[] = [];
  let resourcePressure = eco.resourcePressure;

  // Trophic Cascade: High pressure causes prey populations to crash
  if (resourcePressure > 70) {
    for (const name of Object.keys(populations)) {
      if (rng.chance(0.2)) {
        populations[name].level = Math.max(ECOSYSTEM_MIN_POPULATION_LEVEL, populations[name].level - 0.2);
        populations[name].trend = 'declining';
      }
    }
    if (rng.chance(0.1)) narratives.push("Extreme resource pressure is causing a local ecosystem collapse.");
  }

  // Pressure naturally dissipates if populations are stable
  resourcePressure = Math.max(0, resourcePressure - 1);

  // Cascade predator-prey effects: low prey hurts predators
  for (const link of ECOSYSTEM_LINKS) {
    if (!link.regionIds.includes(regionId)) continue;

    const prey = populations[link.prey];
    const predator = populations[link.predator];
    if (!prey || !predator) continue;

    if (prey.level <= -1) {
      // Low prey population pressures predators
      const newLevel = Math.max(ECOSYSTEM_MIN_POPULATION_LEVEL, predator.level - link.strength * 0.3);
      populations[link.predator] = {
        ...predator,
        level: Math.round(newLevel * 10) / 10,
        trend: newLevel < predator.level ? 'declining' : predator.trend,
      };
    } else if (prey.level >= 1) {
      // Abundant prey benefits predators
      const newLevel = Math.min(ECOSYSTEM_MAX_POPULATION_LEVEL, predator.level + link.strength * 0.2);
      populations[link.predator] = {
        ...predator,
        level: Math.round(newLevel * 10) / 10,
        trend: newLevel > predator.level ? 'growing' : predator.trend,
      };
    }
  }

  // Natural regression toward baseline
  for (const name of Object.keys(populations)) {
    const pop = populations[name];
    if (pop.level !== 0 && rng.chance(ECOSYSTEM_REGRESSION_CHANCE)) {
      const regression = pop.level > 0 ? -ECOSYSTEM_REGRESSION_AMOUNT : ECOSYSTEM_REGRESSION_AMOUNT;
      populations[name] = {
        ...pop,
        level: Math.round((pop.level + regression) * 10) / 10,
        trend: Math.abs(pop.level + regression) < 0.1 ? 'stable' : pop.trend,
      };
    }
  }

  // Check for ecosystem narrative events (max one per cooldown period)
  if (turn - eco.lastEventTurn >= ECOSYSTEM_EVENT_COOLDOWN_TURNS) {
    for (const event of ECOSYSTEM_EVENTS) {
      const pop = populations[event.speciesName];
      if (!pop) continue;
      const matches =
        (event.direction === 'below' && pop.level <= event.threshold) ||
        (event.direction === 'above' && pop.level >= event.threshold);
      if (matches && rng.chance(0.4)) {
        narratives.push(event.narrativeText);
        return {
          ecosystem: { populations, lastEventTurn: turn, resourcePressure, regionNPCs: eco.regionNPCs },
          narratives,
        };
      }
    }
  }

  return { ecosystem: { ...eco, populations, resourcePressure, regionNPCs: eco.regionNPCs }, narratives };
}

export function modifyPopulation(
  eco: EcosystemState,
  speciesName: string,
  amount: number,
): EcosystemState {
  const populations = { ...eco.populations };
  const pop = populations[speciesName];
  if (!pop) return eco;

  const newLevel = Math.max(ECOSYSTEM_MIN_POPULATION_LEVEL, Math.min(ECOSYSTEM_MAX_POPULATION_LEVEL, pop.level + amount));
  populations[speciesName] = {
    ...pop,
    level: Math.round(newLevel * 10) / 10,
    trend: newLevel > pop.level ? 'growing' : newLevel < pop.level ? 'declining' : 'stable',
  };

  return { ...eco, populations };
}
