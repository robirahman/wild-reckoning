import type { SpeciesDataBundle } from '../../../types/speciesConfig';
import { GRAY_WOLF_CONFIG } from './config';
import { GRAY_WOLF_EVENTS } from './events';
import { GRAY_WOLF_PARASITES } from './parasites';
import { GRAY_WOLF_INJURIES } from './injuries';
import { GRAY_WOLF_BACKSTORIES } from './backstories';

export const grayWolfBundle: SpeciesDataBundle = {
  config: GRAY_WOLF_CONFIG,
  events: GRAY_WOLF_EVENTS,
  parasites: GRAY_WOLF_PARASITES,
  injuries: GRAY_WOLF_INJURIES,
  backstories: GRAY_WOLF_BACKSTORIES,
};
