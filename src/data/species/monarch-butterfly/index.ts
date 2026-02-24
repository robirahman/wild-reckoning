import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { MONARCH_BUTTERFLY_CONFIG } from './config';
import { MONARCH_BUTTERFLY_EVENTS } from './events';
import { MONARCH_BUTTERFLY_PARASITES } from './parasites';
import { MONARCH_BUTTERFLY_INJURIES } from './injuries';
import { MONARCH_BUTTERFLY_BACKSTORIES } from './backstories';

export const monarchButterflyBundle: SpeciesDataBundle = {
  config: MONARCH_BUTTERFLY_CONFIG,
  events: MONARCH_BUTTERFLY_EVENTS,
  parasites: MONARCH_BUTTERFLY_PARASITES,
  injuries: MONARCH_BUTTERFLY_INJURIES,
  backstories: MONARCH_BUTTERFLY_BACKSTORIES,
};
