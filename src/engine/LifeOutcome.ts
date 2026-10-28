/**
 * How a life ended, in reproductive terms. The letter grade measures a
 * biological outcome (offspring that reached adulthood), not how well the
 * player played, so it's withheld for animals that never had a chance to breed.
 */

import type { SpeciesConfig } from '../types/speciesConfig';
import type { ReproductionState } from '../types/reproduction';
import type { AnimalState } from '../types/species';
import { isCaptive } from './captivity';

export interface LifeGrade {
  letter: string;
  color: string;
}

export interface LifeOutcome {
  /** Null when the animal never had a chance to reproduce */
  grade: LifeGrade | null;
  /** Why there's no grade */
  note?: string;
}

export function gradeForFitness(fitness: number, type: 'iteroparous' | 'semelparous'): LifeGrade {
  if (fitness === 0) return { letter: 'F', color: 'var(--color-danger)' };

  if (type === 'iteroparous') {
    if (fitness === 1) return { letter: 'D', color: '#c87533' };
    if (fitness === 2) return { letter: 'C', color: 'var(--color-text)' };
    if (fitness <= 4) return { letter: 'B', color: '#5a9e5a' };
    return { letter: 'A', color: '#3a8a3a' };
  }
  // Semelparous scale (estimated survivors)
  if (fitness <= 2) return { letter: 'D', color: '#c87533' };
  if (fitness <= 5) return { letter: 'C', color: 'var(--color-text)' };
  if (fitness <= 12) return { letter: 'B', color: '#5a9e5a' };
  return { letter: 'A', color: '#3a8a3a' };
}

/** Age in months at which the species can first breed */
export function breedingAgeMonths(config: SpeciesConfig): number {
  const r = config.reproduction;
  return r.type === 'iteroparous' ? r.matingMinAge : r.spawningMinAge;
}

function hasReproduced(reproduction: ReproductionState): boolean {
  if (reproduction.totalFitness > 0) return true;
  return reproduction.type === 'iteroparous' ? reproduction.offspring.length > 0 : reproduction.spawned;
}

export function getLifeOutcome(
  animal: Pick<AnimalState, 'age'>,
  reproduction: ReproductionState,
  config: SpeciesConfig,
): LifeOutcome {
  if (!hasReproduced(reproduction) && animal.age < breedingAgeMonths(config)) {
    return {
      grade: null,
      note: isCaptive(config)
        ? 'Your life was decided for you. You never had a chance to grow up or raise young.'
        : 'You died before you were old enough to breed, so you never had a chance to raise young.',
    };
  }
  return { grade: gradeForFitness(reproduction.totalFitness, reproduction.type) };
}
