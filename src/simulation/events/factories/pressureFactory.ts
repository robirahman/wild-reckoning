import type { SimulationTrigger } from '../types';
import type { PressureConfig } from '../data/pressureConfigs';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

/**
 * Create a SimulationTrigger from a PressureConfig.
 *
 * This factory implements the pressure/feedback-loop trigger pattern:
 * - Plausibility from physiological or capability state
 * - Weight from severity-scaled base rates
 * - Narrative from context-dependent builder with clinical annotations
 * - Choices with interaction resolver callbacks (forage, exposure, fight)
 */
export function createPressureTrigger(config: PressureConfig): SimulationTrigger {
  return {
    id: config.id,
    category: config.category,
    tags: config.tags,
    calibrationCauseId: config.calibrationCauseId,

    isPlausible(ctx) {
      return config.isPlausible(ctx);
    },

    computeWeight(ctx) {
      return config.computeWeight(ctx);
    },

    resolve(ctx) {
      const env = buildEnvironment(ctx);
      const result = config.resolve(ctx);

      const entities = result.entity ? [result.entity] : [];

      return {
        harmEvents: [],
        statEffects: result.statEffects,
        consequences: result.consequences,
        narrativeText: result.narrative,
        narrativeContext: buildNarrativeContext({
          eventCategory: config.category,
          eventType: config.id.replace('sim-', ''),
          entities,
          actions: [action(
            result.actionDetail,
            result.clinicalDetail,
            result.intensity,
          )],
          environment: env,
          emotionalTone: result.emotionalTone as any,
        }),
      };
    },

    getChoices(ctx) {
      return config.getChoices(ctx);
    },
  };
}
