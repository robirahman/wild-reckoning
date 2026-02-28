import { createHealthTrigger } from '../factories/healthFactory';
import {
  LOCOMOTION_IMPAIRMENT_CONFIG,
  VISION_IMPAIRMENT_CONFIG,
  BREATHING_IMPAIRMENT_CONFIG,
  HERD_SEPARATION_CONFIG,
  STARVATION_INFECTION_CONFIG,
} from '../data/impairmentConfigs';

export const locomotionImpairmentTrigger = createHealthTrigger(LOCOMOTION_IMPAIRMENT_CONFIG);
export const visionImpairmentTrigger = createHealthTrigger(VISION_IMPAIRMENT_CONFIG);
export const breathingImpairmentTrigger = createHealthTrigger(BREATHING_IMPAIRMENT_CONFIG);
export const herdSeparationTrigger = createHealthTrigger(HERD_SEPARATION_CONFIG);
export const starvationInfectionTrigger = createHealthTrigger(STARVATION_INFECTION_CONFIG);
