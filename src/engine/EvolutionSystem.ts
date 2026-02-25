import type { Mutation } from '../types/evolution';
import { MUTATIONS } from '../data/mutations';
import type { Rng } from './RandomUtils';

export function getAvailableMutations(rng: Rng, count: number = 3): Mutation[] {
  // Simple random selection for now, could be weighted by rarity
  const pool = [...MUTATIONS];
  const choices: Mutation[] = [];
  
  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break;
    const index = rng.int(0, pool.length - 1);
    choices.push(pool[index]);
    pool.splice(index, 1);
  }
  
  return choices;
}

export function applyMutation(stats: Record<string, number>, mutation: Mutation): Record<string, number> {
  const newStats = { ...stats };
  if (mutation.statModifiers) {
    for (const mod of mutation.statModifiers) {
      if (mod.stat in newStats) {
        newStats[mod.stat] += mod.amount;
      }
    }
  }
  return newStats;
}
