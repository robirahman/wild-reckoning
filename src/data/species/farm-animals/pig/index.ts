import type { SpeciesDataBundle } from '../../../../types/speciesConfig';
import { PIG_CONFIG } from './config';
import { PIG_EVENTS } from './events';
import { PIG_PARASITES } from './parasites';
import { PIG_INJURIES } from './injuries';
import { PIG_BACKSTORIES } from './backstories';

export const pigBundle: SpeciesDataBundle = {
  config: PIG_CONFIG,
  events: PIG_EVENTS,
  parasites: PIG_PARASITES,
  injuries: PIG_INJURIES,
  backstories: PIG_BACKSTORIES,
};
