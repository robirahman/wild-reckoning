import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { POISON_DART_FROG_CONFIG } from './config';
import { POISON_DART_FROG_EVENTS } from './events';
import { POISON_DART_FROG_PARASITES } from './parasites';
import { POISON_DART_FROG_INJURIES } from './injuries';
import { POISON_DART_FROG_BACKSTORIES } from './backstories';

export const poisonDartFrogBundle: SpeciesDataBundle = {
  config: POISON_DART_FROG_CONFIG,
  events: POISON_DART_FROG_EVENTS,
  parasites: POISON_DART_FROG_PARASITES,
  injuries: POISON_DART_FROG_INJURIES,
  backstories: POISON_DART_FROG_BACKSTORIES,
};
