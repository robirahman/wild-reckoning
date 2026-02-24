import type { SpeciesDataBundle } from '../../types/speciesConfig';
import { whiteTailedDeerBundle } from './white-tailed-deer';
import { africanElephantBundle } from './african-elephant';
import { chinookSalmonBundle } from './chinook-salmon';
import { polarBearBundle } from './polar-bear';
import { greenSeaTurtleBundle } from './green-sea-turtle';
import { monarchButterflyBundle } from './monarch-butterfly';
import { figWaspBundle } from './fig-wasp';

const speciesRegistry: Record<string, SpeciesDataBundle> = {
  'white-tailed-deer': whiteTailedDeerBundle,
  'african-elephant': africanElephantBundle,
  'chinook-salmon': chinookSalmonBundle,
  'polar-bear': polarBearBundle,
  'green-sea-turtle': greenSeaTurtleBundle,
  'monarch-butterfly': monarchButterflyBundle,
  'fig-wasp': figWaspBundle,
};

export function getSpeciesBundle(id: string): SpeciesDataBundle {
  const bundle = speciesRegistry[id];
  if (!bundle) {
    throw new Error(`Unknown species: ${id}`);
  }
  return bundle;
}

export function getAllSpeciesIds(): string[] {
  return Object.keys(speciesRegistry);
}

export function getAllSpeciesBundles(): SpeciesDataBundle[] {
  return Object.values(speciesRegistry);
}
