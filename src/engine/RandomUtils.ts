/**
 * Seeded pseudo-random number generator (mulberry32).
 * Produces deterministic sequences for reproducible gameplay.
 */
export function createRng(seed: number) {
  let state = seed;

  function next(): number {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  return {
    /** Returns a float in [0, 1) */
    random: next,

    /** Returns an integer in [min, max] inclusive */
    int(min: number, max: number): number {
      return Math.floor(next() * (max - min + 1)) + min;
    },

    /** Returns true with the given probability (0-1) */
    chance(probability: number): boolean {
      return next() < probability;
    },

    /** Pick a random element from an array */
    pick<T>(arr: T[]): T {
      return arr[Math.floor(next() * arr.length)];
    },

    /** Weighted random selection. Returns the index of the selected item. */
    weightedSelect(weights: number[]): number {
      const total = weights.reduce((a, b) => a + b, 0);
      if (total === 0) return 0;
      let roll = next() * total;
      for (let i = 0; i < weights.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return i;
      }
      return weights.length - 1;
    },
  };
}

export type Rng = ReturnType<typeof createRng>;
