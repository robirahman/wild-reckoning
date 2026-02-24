import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { CHINOOK_SALMON_CONFIG } from './config';
import { CHINOOK_SALMON_EVENTS } from './events';
import { CHINOOK_SALMON_PARASITES } from './parasites';
import { CHINOOK_SALMON_INJURIES } from './injuries';
import { CHINOOK_SALMON_BACKSTORIES } from './backstories';

export const chinookSalmonBundle: SpeciesDataBundle = {
  config: CHINOOK_SALMON_CONFIG,
  events: CHINOOK_SALMON_EVENTS,
  parasites: CHINOOK_SALMON_PARASITES,
  injuries: CHINOOK_SALMON_INJURIES,
  backstories: CHINOOK_SALMON_BACKSTORIES,
};
