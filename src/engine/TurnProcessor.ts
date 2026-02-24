import type { GameState } from '../store/gameStore';
import type { ResolvedEvent, StatEffect, Consequence } from '../types/events';
import { StatId, computeEffectiveValue } from '../types/stats';
import { generateEvents } from './EventGenerator';
import { tickHealth } from './HealthSystem';
import { computeBuckWinProbability, determineFawnCount } from './ReproductionSystem';

export function generateTurnEvents(state: GameState): ResolvedEvent[] {
  return generateEvents({
    animal: state.animal,
    time: state.time,
    behavior: state.behavioralSettings,
    cooldowns: state.eventCooldowns,
    rng: state.rng,
  });
}

/**
 * Called after player has made all choices for the turn.
 * Resolves all event effects, processes death chances, buck competition, and ticks health.
 */
export function resolveTurn(state: GameState): {
  statEffects: StatEffect[];
  consequences: Consequence[];
  healthNarratives: string[];
  animal: typeof state.animal;
} {
  const allStatEffects: StatEffect[] = [];
  const allConsequences: Consequence[] = [];

  for (const event of state.currentEvents) {
    // Apply event's own stat effects and consequences
    allStatEffects.push(...event.definition.statEffects);
    if (event.definition.consequences) {
      allConsequences.push(...event.definition.consequences);
    }

    // Apply sub-event effects
    for (const sub of event.triggeredSubEvents) {
      allStatEffects.push(...sub.statEffects);
      allConsequences.push(...sub.consequences);
    }

    // Apply chosen choice effects
    if (event.choiceMade && event.definition.choices) {
      const choice = event.definition.choices.find((c) => c.id === event.choiceMade);
      if (choice) {
        allStatEffects.push(...choice.statEffects);
        allConsequences.push(...choice.consequences);

        // ── Death chance from predator choices ──
        if (choice.deathChance) {
          const dc = choice.deathChance;
          let prob = dc.probability;

          // Adjust by stat modifiers
          if (dc.statModifiers) {
            for (const mod of dc.statModifiers) {
              const statVal = computeEffectiveValue(state.animal.stats[mod.stat]);
              prob += statVal * mod.factor;
            }
          }

          // Adjust by injuries and parasites
          prob += state.animal.injuries.length * 0.05;
          prob += state.animal.parasites.length * 0.02;

          // Underweight = more vulnerable
          if (state.animal.weight < 80) {
            prob += (80 - state.animal.weight) * 0.003;
          }

          prob = Math.max(0.01, Math.min(0.80, prob));

          if (state.rng.chance(prob)) {
            allConsequences.push({ type: 'death', cause: dc.cause });
          }
        }
      }
    }
  }

  // ── Buck competition resolution ──
  if (state.animal.flags.has('attempted-buck-challenge')) {
    const hea = computeEffectiveValue(state.animal.stats[StatId.HEA]);
    const str = computeEffectiveValue(state.animal.stats[StatId.STR]);
    const winProb = computeBuckWinProbability(
      hea,
      state.animal.weight,
      str,
      state.animal.injuries.length,
      state.animal.parasites.length,
    );

    if (state.rng.chance(winProb)) {
      // Won the competition — sire offspring
      const fawnCount = determineFawnCount(state.animal.weight, hea, state.rng);
      allConsequences.push({ type: 'sire_offspring', fawnCount });
      allConsequences.push({ type: 'set_flag', flag: 'mated-this-season' });
    } else {
      // Lost — may be injured
      if (state.rng.chance(0.4)) {
        const bodyParts = ['right shoulder', 'left shoulder', 'left flank', 'right flank', 'right haunch'];
        const bodyPart = state.rng.pick(bodyParts);
        allConsequences.push({
          type: 'add_injury',
          injuryId: 'antler-wound',
          severity: state.rng.int(0, 1),
          bodyPart,
        });
      }
    }

    // Always remove the challenge flag
    allConsequences.push({ type: 'remove_flag', flag: 'attempted-buck-challenge' });
  }

  // Tick health system
  const healthResult = tickHealth(state.animal, state.rng, state.time.turn);

  return {
    statEffects: allStatEffects,
    consequences: allConsequences,
    healthNarratives: healthResult.narratives,
    animal: healthResult.animal,
  };
}
