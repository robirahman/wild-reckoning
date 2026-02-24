/** Phase 5: Ecosystem Web engine */

import type { EcosystemState, PopulationState } from '../types/ecosystem';
import { ECOSYSTEM_LINKS, ECOSYSTEM_EVENTS } from '../data/ecosystem';
import type { Rng } from './RandomUtils';

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

  return { populations, lastEventTurn: 0 };
}

export function tickEcosystem(
  eco: EcosystemState,
  regionId: string,
  turn: number,
  rng: Rng,
): { ecosystem: EcosystemState; narratives: string[] } {
  const populations = { ...eco.populations };
  const narratives: string[] = [];

  // Cascade predator-prey effects: low prey hurts predators
  for (const link of ECOSYSTEM_LINKS) {
    if (!link.regionIds.includes(regionId)) continue;

    const prey = populations[link.prey];
    const predator = populations[link.predator];
    if (!prey || !predator) continue;

    if (prey.level <= -1) {
      // Low prey population pressures predators
      const newLevel = Math.max(-2, predator.level - link.strength * 0.3);
      populations[link.predator] = {
        ...predator,
        level: Math.round(newLevel * 10) / 10,
        trend: newLevel < predator.level ? 'declining' : predator.trend,
      };
    } else if (prey.level >= 1) {
      // Abundant prey benefits predators
      const newLevel = Math.min(2, predator.level + link.strength * 0.2);
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
    if (pop.level !== 0 && rng.chance(0.15)) {
      const regression = pop.level > 0 ? -0.1 : 0.1;
      populations[name] = {
        ...pop,
        level: Math.round((pop.level + regression) * 10) / 10,
        trend: Math.abs(pop.level + regression) < 0.1 ? 'stable' : pop.trend,
      };
    }
  }

  // Check for ecosystem narrative events (max one per 5 turns)
  if (turn - eco.lastEventTurn >= 5) {
    for (const event of ECOSYSTEM_EVENTS) {
      const pop = populations[event.speciesName];
      if (!pop) continue;
      const matches =
        (event.direction === 'below' && pop.level <= event.threshold) ||
        (event.direction === 'above' && pop.level >= event.threshold);
      if (matches && rng.chance(0.4)) {
        narratives.push(event.narrativeText);
        return {
          ecosystem: { populations, lastEventTurn: turn },
          narratives,
        };
      }
    }
  }

  return { ecosystem: { ...eco, populations }, narratives };
}

export function modifyPopulation(
  eco: EcosystemState,
  speciesName: string,
  amount: number,
): EcosystemState {
  const populations = { ...eco.populations };
  const pop = populations[speciesName];
  if (!pop) return eco;

  const newLevel = Math.max(-2, Math.min(2, pop.level + amount));
  populations[speciesName] = {
    ...pop,
    level: Math.round(newLevel * 10) / 10,
    trend: newLevel > pop.level ? 'growing' : newLevel < pop.level ? 'declining' : 'stable',
  };

  return { ...eco, populations };
}
