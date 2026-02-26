import type { SocialState } from '../types/social';
import type { Rng } from './RandomUtils';

export function tickSocial(state: SocialState, rng: Rng): SocialState {
  const newState = { ...state };
  
  // Dominance drift
  if (state.rank !== 'lone') {
    if (rng.chance(0.1)) {
      newState.dominance += rng.int(-2, 2);
    }
  }
  
  // Hive logic
  if (state.hive) {
    if (state.hive.foodStore > 0) {
      state.hive.foodStore -= 1; // Daily consumption
    }
  }
  
  return newState;
}

export function challengeAlpha(state: SocialState, rng: Rng, strength: number): { success: boolean; newState: SocialState } {
  const winChance = strength / 100 * 0.6; // Base 60% at max strength
  const success = rng.chance(winChance);
  
  const newState = { ...state };
  if (success) {
    newState.rank = 'alpha';
    newState.dominance = 80;
  } else {
    newState.rank = 'omega';
    newState.dominance = 20;
  }
  
  return { success, newState };
}
