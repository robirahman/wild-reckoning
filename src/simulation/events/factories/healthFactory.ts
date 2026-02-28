import type { SimulationTrigger } from '../types';
import type { HealthTriggerConfig } from '../data/healthConfigs';

/**
 * Create a SimulationTrigger from a HealthTriggerConfig.
 *
 * Health triggers cover wound progression, fever, sepsis, parasites,
 * wound infection, and disease outbreaks. The config contains the full
 * logic as callback functions, so the factory simply maps config fields
 * to the SimulationTrigger interface.
 */
export function createHealthTrigger(config: HealthTriggerConfig): SimulationTrigger {
  return {
    id: config.id,
    category: config.category,
    tags: config.tags,
    calibrationCauseId: config.calibrationCauseId,

    isPlausible: config.isPlausible,
    computeWeight: config.computeWeight,
    resolve: config.resolve,
    getChoices: config.getChoices,
  };
}
