import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { COMMON_OCTOPUS_CONFIG } from './config';
import { COMMON_OCTOPUS_EVENTS } from './events';
import { COMMON_OCTOPUS_PARASITES } from './parasites';
import { COMMON_OCTOPUS_INJURIES } from './injuries';
import { COMMON_OCTOPUS_BACKSTORIES } from './backstories';

export const commonOctopusBundle: SpeciesDataBundle = {
  config: COMMON_OCTOPUS_CONFIG,
  events: COMMON_OCTOPUS_EVENTS,
  parasites: COMMON_OCTOPUS_PARASITES,
  injuries: COMMON_OCTOPUS_INJURIES,
  backstories: COMMON_OCTOPUS_BACKSTORIES,
};
