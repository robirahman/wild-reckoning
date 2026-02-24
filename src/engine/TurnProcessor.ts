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
    events: state.speciesBundle.events,
    config: state.speciesBundle.config,
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
  const config = state.speciesBundle.config;
  const predVuln = config.predationVulnerability;
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
          prob += state.animal.injuries.length * predVuln.injuryProbIncrease;
          prob += state.animal.parasites.length * predVuln.parasiteProbIncrease;

          // Underweight = more vulnerable
          if (state.animal.weight < predVuln.underweightThreshold) {
            prob += (predVuln.underweightThreshold - state.animal.weight) * predVuln.underweightFactor;
          }

          prob = Math.max(predVuln.deathChanceMin, Math.min(predVuln.deathChanceMax, prob));

          if (state.rng.chance(prob)) {
            allConsequences.push({ type: 'death', cause: dc.cause });
          }
        }
      }
    }
  }

  // ── Buck competition resolution (iteroparous species with male competition) ──
  if (config.reproduction.type === 'iteroparous' && config.reproduction.maleCompetition.enabled) {
    const maleComp = config.reproduction.maleCompetition;

    if (state.animal.flags.has(maleComp.challengeFlag)) {
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
        const offspringCount = determineFawnCount(state.animal.weight, hea, state.rng);
        allConsequences.push({ type: 'sire_offspring', offspringCount });
        allConsequences.push({ type: 'set_flag', flag: maleComp.matedFlag });
      } else {
        // Lost — may be injured
        if (state.rng.chance(maleComp.lossInjuryChance)) {
          const bodyPart = state.rng.pick(maleComp.lossInjuryBodyParts);
          allConsequences.push({
            type: 'add_injury',
            injuryId: maleComp.lossInjuryId,
            severity: state.rng.int(0, 1),
            bodyPart,
          });
        }
      }

      // Always remove the challenge flag
      allConsequences.push({ type: 'remove_flag', flag: maleComp.challengeFlag });
    }
  }

  // Tick health system
  const healthResult = tickHealth(state.animal, state.rng, state.speciesBundle.parasites);

  return {
    statEffects: allStatEffects,
    consequences: allConsequences,
    healthNarratives: healthResult.narratives,
    animal: healthResult.animal,
  };
}
