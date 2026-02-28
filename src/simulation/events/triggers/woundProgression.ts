import { createHealthTrigger } from '../factories/healthFactory';
import {
  WOUND_DETERIORATION_CONFIG,
  FEVER_EVENT_CONFIG,
  SEPSIS_EVENT_CONFIG,
} from '../data/healthConfigs';

export const woundDeteriorationTrigger = createHealthTrigger(WOUND_DETERIORATION_CONFIG);
export const feverEventTrigger = createHealthTrigger(FEVER_EVENT_CONFIG);
export const sepsisEventTrigger = createHealthTrigger(SEPSIS_EVENT_CONFIG);
