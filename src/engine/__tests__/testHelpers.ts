import type { Rng } from '../RandomUtils';

/** Creates a mock Rng that returns predetermined values */
export function createMockRng(overrides: {
  random?: number;
  chance?: boolean;
  int?: number;
} = {}): Rng {
  return {
    random: () => overrides.random ?? 0.5,
    chance: () => overrides.chance ?? false,
    int: (min) => overrides.int ?? min,
    pick: (arr) => arr[0],
    weightedSelect: () => 0,
    getState: () => 0,
    setState: () => {},
  } as Rng;
}
