import type { MetabolismConfig } from '../types';
import { DEER_METABOLISM } from './deer';

const METABOLISM_CONFIGS: Record<string, MetabolismConfig> = {
  'white-tailed-deer': DEER_METABOLISM,
};

/**
 * Look up the metabolism config for a species.
 * Returns undefined for species that don't have physiology simulation.
 */
export function getMetabolismConfig(speciesId: string): MetabolismConfig | undefined {
  return METABOLISM_CONFIGS[speciesId];
}
