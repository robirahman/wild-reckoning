import type { SpeciesDataBundle } from '../../types/speciesConfig';
import { whiteTailedDeerBundle } from './white-tailed-deer';
import { africanElephantBundle } from './african-elephant';
import { chinookSalmonBundle } from './chinook-salmon';
import { polarBearBundle } from './polar-bear';
import { greenSeaTurtleBundle } from './green-sea-turtle';
import { monarchButterflyBundle } from './monarch-butterfly';
import { figWaspBundle } from './fig-wasp';
import { commonOctopusBundle } from './common-octopus';
import { honeybeeWorkerBundle } from './honeybee-worker';
import { arcticTernBundle } from './arctic-tern';
import { poisonDartFrogBundle } from './poison-dart-frog';
import { chickenBundle } from './farm-animals/chicken';
import { pigBundle } from './farm-animals/pig';

const speciesRegistry: Record<string, SpeciesDataBundle> = {
  'white-tailed-deer': whiteTailedDeerBundle,
  'african-elephant': africanElephantBundle,
  'chinook-salmon': chinookSalmonBundle,
  'polar-bear': polarBearBundle,
  'green-sea-turtle': greenSeaTurtleBundle,
  'monarch-butterfly': monarchButterflyBundle,
  'fig-wasp': figWaspBundle,
  'common-octopus': commonOctopusBundle,
  'honeybee-worker': honeybeeWorkerBundle,
  'arctic-tern': arcticTernBundle,
  'poison-dart-frog': poisonDartFrogBundle,
  'chicken': chickenBundle,
  'pig': pigBundle,
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
