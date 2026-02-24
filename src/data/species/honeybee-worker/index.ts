import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { HONEYBEE_WORKER_CONFIG } from './config';
import { HONEYBEE_WORKER_EVENTS } from './events';
import { HONEYBEE_WORKER_PARASITES } from './parasites';
import { HONEYBEE_WORKER_INJURIES } from './injuries';
import { HONEYBEE_WORKER_BACKSTORIES } from './backstories';

export const honeybeeWorkerBundle: SpeciesDataBundle = {
  config: HONEYBEE_WORKER_CONFIG,
  events: HONEYBEE_WORKER_EVENTS,
  parasites: HONEYBEE_WORKER_PARASITES,
  injuries: HONEYBEE_WORKER_INJURIES,
  backstories: HONEYBEE_WORKER_BACKSTORIES,
};
