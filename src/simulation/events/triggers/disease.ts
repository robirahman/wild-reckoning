import { createHealthTrigger } from '../factories/healthFactory';
import {
  PARASITE_EXPOSURE_CONFIG,
  WOUND_INFECTION_CONFIG,
  DISEASE_OUTBREAK_CONFIG,
} from '../data/healthConfigs';

export const parasiteExposureTrigger = createHealthTrigger(PARASITE_EXPOSURE_CONFIG);
export const woundInfectionTrigger = createHealthTrigger(WOUND_INFECTION_CONFIG);
export const diseaseOutbreakTrigger = createHealthTrigger(DISEASE_OUTBREAK_CONFIG);
