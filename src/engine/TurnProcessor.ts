import type { GameState } from '../store/gameStore';
import type { ResolvedEvent, StatEffect, Consequence } from '../types/events';
import type { EventOutcome, TurnResult, PendingDeathRoll } from '../types/turnResult';
import { StatId, computeEffectiveValue } from '../types/stats';
import { DIFFICULTY_PRESETS } from '../types/difficulty';
import { generateEvents } from './EventGenerator';
import { tickHealth, tickBodyState } from './HealthSystem';
import { computeBuckWinProbability, determineOffspringCount } from './ReproductionSystem';
import { getRegionDefinition } from '../data/regions';

/**
 * Build the event generation context from game state and delegate to
 * the EventGenerator. Returns the resolved events for this turn.
 */
export function generateTurnEvents(state: GameState): ResolvedEvent[] {
  return generateEvents({
    animal: state.animal,
    time: state.time,
    behavior: state.behavioralSettings,
    cooldowns: state.eventCooldowns,
    rng: state.rng,
    events: state.speciesBundle.events,
    config: state.speciesBundle.config,
    difficulty: state.difficulty,
    npcs: state.npcs,
    regionDef: getRegionDefinition(state.animal.region),
    currentWeather: state.currentWeather ?? undefined,
    ecosystem: state.ecosystem,
    currentNodeType: state.map?.nodes.find(n => n.id === state.map!.currentLocationId)?.type,
    fastForward: state.fastForward,
  });
}

/**
 * Called after player has made all choices for the turn.
 * Resolves all event effects, processes death chances, buck competition, and ticks health.
 * Returns both the flat effect arrays (for store application) and a TurnResult (for display).
 */
export function resolveTurn(state: GameState): {
  statEffects: StatEffect[];
  consequences: Consequence[];
  healthNarratives: string[];
  animal: typeof state.animal;
  turnResult: TurnResult;
} {
  const config = state.speciesBundle.config;
  const predVuln = config.predationVulnerability;
  const allStatEffects: StatEffect[] = [];
  const allConsequences: Consequence[] = [];
  const eventOutcomes: EventOutcome[] = [];
  const pendingDeathRolls: PendingDeathRoll[] = [];
  
  const ffMult = state.fastForward ? 4 : 1;

  // Capture pre-resolution stat snapshot for delta computation
  const preStats: Record<StatId, number> = {} as Record<StatId, number>;
  for (const id of Object.values(StatId)) {
    preStats[id] = computeEffectiveValue(state.animal.stats[id]);
  }

  for (const event of state.currentEvents) {
    const eventEffects: StatEffect[] = [];
    const eventConsequences: Consequence[] = [];
    let deathRollSurvived: boolean | undefined;
    let deathRollProbability: number | undefined;
    let choiceLabel: string | undefined;
    let choiceId: string | undefined;
    let narrativeResult: string | undefined;

    // Apply event's own stat effects and consequences (SCALED if FF)
    for (const eff of event.definition.statEffects) {
      eventEffects.push({ ...eff, amount: eff.amount * ffMult });
    }
    
    if (event.definition.consequences) {
      for (const cons of event.definition.consequences) {
        if (cons.type === 'modify_weight') {
          eventConsequences.push({ ...cons, amount: cons.amount * ffMult });
        } else {
          eventConsequences.push(cons);
        }
      }
    }

    // Apply sub-event effects (SCALED)
    for (const sub of event.triggeredSubEvents) {
      for (const eff of sub.statEffects) {
        eventEffects.push({ ...eff, amount: eff.amount * ffMult });
      }
      for (const cons of sub.consequences) {
        if (cons.type === 'modify_weight') {
          eventConsequences.push({ ...cons, amount: cons.amount * ffMult });
        } else {
          eventConsequences.push(cons);
        }
      }
    }

    // Apply chosen choice effects (SCALED)
    if (event.choiceMade && event.definition.choices) {
      const choice = event.definition.choices.find((c) => c.id === event.choiceMade);
      if (choice) {
        choiceLabel = choice.label;
        choiceId = choice.id;
        narrativeResult = choice.narrativeResult;
        
        for (const eff of choice.statEffects) {
          eventEffects.push({ ...eff, amount: eff.amount * ffMult });
        }
        for (const cons of choice.consequences) {
          if (cons.type === 'modify_weight') {
            eventConsequences.push({ ...cons, amount: cons.amount * ffMult });
          } else {
            eventConsequences.push(cons);
          }
        }

        // Death chance from predator choices (SCALED)
        if (choice.deathChance) {
          const dc = choice.deathChance;
          let prob = dc.probability;

          if (dc.statModifiers) {
            for (const mod of dc.statModifiers) {
              const statVal = computeEffectiveValue(state.animal.stats[mod.stat]);
              prob += statVal * mod.factor;
            }
          }

          prob += state.animal.injuries.length * predVuln.injuryProbIncrease;
          prob += state.animal.parasites.length * predVuln.parasiteProbIncrease;

          if (state.animal.weight < predVuln.underweightThreshold) {
            prob += (predVuln.underweightThreshold - state.animal.weight) * predVuln.underweightFactor;
          }

          // High adversity slightly increases predator danger
          const adv = computeEffectiveValue(state.animal.stats[StatId.ADV]);
          prob += (adv / 100) * 0.03;

          // Apply difficulty multiplier to death chance
          prob *= DIFFICULTY_PRESETS[state.difficulty ?? 'normal'].deathChanceFactor;
          
          // Apply Fast-Forward multiplier
          prob *= ffMult;

          prob = Math.max(predVuln.deathChanceMin, Math.min(predVuln.deathChanceMax, prob));
          deathRollProbability = prob;

          // If escape options exist, defer the death roll for player choice
          if (dc.escapeOptions && dc.escapeOptions.length > 0) {
            pendingDeathRolls.push({
              eventId: event.definition.id,
              choiceId: choice.id,
              baseProbability: prob,
              cause: dc.cause,
              escapeOptions: dc.escapeOptions,
            });
          } else {
            // No escape options: resolve immediately with pure RNG
            if (state.rng.chance(prob)) {
              eventConsequences.push({ type: 'death', cause: dc.cause });
              deathRollSurvived = false;
            } else {
              deathRollSurvived = true;
            }
          }
        }
      }
    }

    allStatEffects.push(...eventEffects);
    allConsequences.push(...eventConsequences);

    eventOutcomes.push({
      eventId: event.definition.id,
      eventNarrative: event.resolvedNarrative,
      choiceLabel,
      choiceId,
      narrativeResult,
      statEffects: eventEffects,
      consequences: eventConsequences,
      deathRollSurvived,
      deathRollProbability,
    });
  }

  // Buck competition resolution
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
        config,
      );

      if (state.rng.chance(winProb)) {
        const offspringCount = determineOffspringCount(state.animal.weight, hea, state.speciesBundle.config, state.rng);
        allConsequences.push({ type: 'sire_offspring', offspringCount });
        allConsequences.push({ type: 'set_flag', flag: maleComp.matedFlag });
      } else {
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

      allConsequences.push({ type: 'remove_flag', flag: maleComp.challengeFlag });
    }
  }

  // Tick health system (SCALED in FF)
  // Injuries heal by 12 turns in 12x fast-forward mode
  const healthFfMult = state.fastForward ? 12 : 1;
  const healthResult = tickHealth(state.animal, state.rng, state.speciesBundle.parasites, state.difficulty, healthFfMult);

  // Tick anatomy-based body state (Phase 0+ simulation layer)
  const bodyResult = tickBodyState(healthResult.animal, state.rng, healthFfMult);
  healthResult.animal = bodyResult.animal;
  healthResult.narratives.push(...bodyResult.narratives);
  // Body state stat modifiers get added as stat effects
  for (const mod of bodyResult.modifiers) {
    allStatEffects.push({
      stat: mod.stat,
      amount: mod.amount,
      label: mod.amount >= 0 ? `+${mod.stat}` : `-${mod.stat}`,
    });
  }

  // Propagate health system flags as set_flag consequences
  for (const flag of healthResult.flagsToSet) {
    allConsequences.push({ type: 'set_flag', flag });
  }

  // Build TurnResult for display
  const newParasites: string[] = [];
  const newInjuries: string[] = [];
  for (const c of allConsequences) {
    if (c.type === 'add_parasite') {
      const def = state.speciesBundle.parasites[c.parasiteId];
      newParasites.push(def?.name ?? c.parasiteId);
    } else if (c.type === 'add_injury') {
      const def = state.speciesBundle.injuries[c.injuryId];
      newInjuries.push(def?.name ?? c.injuryId);
    }
  }

  // Compute weight change from consequences
  let weightChange = 0;
  for (const c of allConsequences) {
    if (c.type === 'modify_weight') {
      weightChange += c.amount;
    }
  }

  // Stat delta will be computed after effects are applied (placeholder zeros here,
  // the caller will compute the real delta after applying effects)
  const statDelta: Record<StatId, number> = {} as Record<StatId, number>;
  for (const id of Object.values(StatId)) {
    statDelta[id] = 0;
  }

  const turnResult: TurnResult = {
    eventOutcomes,
    healthNarratives: healthResult.narratives,
    weightChange,
    newParasites,
    newInjuries,
    statDelta,
    pendingDeathRolls: pendingDeathRolls.length > 0 ? pendingDeathRolls : undefined,
  };

  return {
    statEffects: allStatEffects,
    consequences: allConsequences,
    healthNarratives: healthResult.narratives,
    animal: healthResult.animal,
    turnResult,
  };
}

