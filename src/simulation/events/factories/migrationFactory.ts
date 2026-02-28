import type { SimulationTrigger } from '../types';
import type { MigrationTriggerConfig } from '../data/migrationConfigs';
import { buildEnvironment, action, buildNarrativeContext } from '../../narrative/contextBuilder';

/**
 * Create a SimulationTrigger from a MigrationTriggerConfig.
 *
 * Each config supplies its own plausibility check, weight computation,
 * resolve payload builder, and choice builder. The factory wires them
 * into the standard SimulationTrigger shape and adds narrative context
 * construction.
 */
export function createMigrationTrigger(config: MigrationTriggerConfig): SimulationTrigger {
  return {
    id: config.id,
    category: config.category as any,
    tags: config.tags,

    isPlausible(ctx) {
      return config.isPlausible(ctx);
    },

    computeWeight(ctx) {
      return config.computeWeight(ctx);
    },

    resolve(ctx) {
      const payload = config.buildResolve(ctx);

      return {
        harmEvents: [],
        statEffects: payload.statEffects,
        consequences: payload.consequences,
        narrativeText: payload.narrativeText,
        narrativeContext: buildNarrativeContext({
          eventCategory: 'migration',
          eventType: payload.eventType,
          actions: [action(
            payload.actionNarrative,
            payload.clinicalDetail,
            payload.urgency,
          )],
          environment: buildEnvironment(ctx),
          emotionalTone: payload.emotionalTone,
        }),
      };
    },

    getChoices(ctx) {
      return config.buildChoices(ctx);
    },
  };
}
