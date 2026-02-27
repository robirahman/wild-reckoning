import type { AnimalState } from '../types/species';
import type { ActiveParasite, ActiveInjury, ParasiteDefinition } from '../types/health';
import type { StatModifier } from '../types/stats';
import type { Rng } from './RandomUtils';
import { addModifier, removeModifiersBySource } from './StatCalculator';
import type { Difficulty } from '../types/difficulty';
import { DIFFICULTY_PRESETS } from '../types/difficulty';
import {
  INJURY_WORSEN_CHANCE,
  INJURY_WORSEN_EXTRA_TURNS,
  INJURY_RESTING_HEAL_RATE,
  INJURY_NORMAL_HEAL_RATE,
} from './constants';
import type { BodyState } from '../simulation/anatomy/bodyState';
import { recomputeCapabilities, checkCapabilityDeath } from '../simulation/anatomy/capabilities';
import { tickConditionProgression } from '../simulation/conditions/engine';
import type { PhysiologyState } from '../simulation/physiology/types';

interface HealthTickResult {
  animal: AnimalState;
  narratives: string[]; // Health-related narrative snippets for the turn
  flagsToSet: string[]; // Flags to set on the animal after ticking
}

/**
 * Process one turn of health effects: advances parasite stage progression
 * and heals or worsens injuries based on resting state and RNG.
 */
export function tickHealth(
  animal: AnimalState,
  rng: Rng,
  parasiteDefs: Record<string, ParasiteDefinition>,
  difficulty?: Difficulty,
  ffMult: number = 1,
): HealthTickResult {
  const narratives: string[] = [];
  const flagsToSet: string[] = [];
  let updatedAnimal = { ...animal };

  // ── Parasite Progression ──
  const updatedParasites: ActiveParasite[] = [];
  let stats = { ...updatedAnimal.stats };

  for (const parasite of updatedAnimal.parasites) {
    const def = parasiteDefs[parasite.definitionId];
    if (!def) {
      updatedParasites.push(parasite);
      continue;
    }

    const stage = def.stages[parasite.currentStage];
    if (!stage) {
      updatedParasites.push(parasite);
      continue;
    }

    let newStage = parasite.currentStage;
    let turnsAtStage = parasite.turnsAtCurrentStage + ffMult;

    // Check for stage progression
    if (turnsAtStage >= stage.turnDuration.min) {
      const parasiteFactor = DIFFICULTY_PRESETS[difficulty ?? 'normal'].parasiteProgressionFactor;
      // Scale progression chance by ffMult (simplified approximation)
      const progChance = Math.min(0.95, stage.progressionChance * parasiteFactor * ffMult);
      const remiChance = Math.min(0.95, stage.remissionChance * ffMult);

      if (rng.chance(progChance) && newStage < def.stages.length - 1) {
        newStage += 1;
        turnsAtStage = 0;
        narratives.push(
          `Your ${def.name} infection has worsened to ${def.stages[newStage].severity}.`
        );
      } else if (rng.chance(remiChance) && newStage > 0) {
        newStage -= 1;
        turnsAtStage = 0;
        narratives.push(
          `Your ${def.name} infection has improved to ${def.stages[newStage].severity}.`
        );
        if (newStage === 0) {
          flagsToSet.push('parasite-cleared-naturally');
        }
      }
    }

    // Remove old modifiers and apply current stage's modifiers
    stats = removeModifiersBySource(stats, parasite.definitionId);
    const currentStageData = def.stages[newStage];
    for (const effect of currentStageData.statEffects) {
      const modifier: StatModifier = {
        id: parasite.definitionId,
        source: def.name,
        sourceType: 'parasite',
        stat: effect.stat,
        amount: effect.amount,
      };
      stats = addModifier(stats, modifier);
    }

    updatedParasites.push({
      ...parasite,
      currentStage: newStage,
      turnsAtCurrentStage: turnsAtStage,
    });
  }

  // ── Injury Healing ──
  const updatedInjuries: ActiveInjury[] = [];
  for (const injury of updatedAnimal.injuries) {
    const healRate = (injury.isResting ? INJURY_RESTING_HEAL_RATE : INJURY_NORMAL_HEAL_RATE) * ffMult;
    const newTurns = injury.turnsRemaining - healRate;

    if (newTurns <= 0) {
      narratives.push(`Your ${injury.bodyPartDetail} has healed.`);
      stats = removeModifiersBySource(stats, injury.definitionId);
      continue; // Injury healed, remove it
    }

    // Check for worsening if not resting (scaled by ffMult)
    if (!injury.isResting && rng.chance(Math.min(0.9, INJURY_WORSEN_CHANCE * ffMult))) {
      narratives.push(
        `Your ${injury.bodyPartDetail} injury has worsened from lack of rest.`
      );
      updatedInjuries.push({
        ...injury,
        turnsRemaining: newTurns + INJURY_WORSEN_EXTRA_TURNS * ffMult,
        currentSeverity: Math.min(injury.currentSeverity + 1, 3),
      });
    } else {
      updatedInjuries.push({
        ...injury,
        turnsRemaining: newTurns,
      });
    }
  }

  updatedAnimal = {
    ...updatedAnimal,
    stats,
    parasites: updatedParasites,
    injuries: updatedInjuries,
  };

  return { animal: updatedAnimal, narratives, flagsToSet };
}

/**
 * Tick the anatomy-based body state: heal tissue damage, progress/clear
 * body conditions, recompute capabilities, and check for death.
 *
 * This runs alongside tickHealth and only activates if the animal has a bodyState.
 */
export function tickBodyState(
  animal: AnimalState,
  rng: Rng,
  ffMult: number = 1,
  physiologyState?: PhysiologyState,
  foragingBehavior?: number,
  nearWater?: boolean,
): { animal: AnimalState; narratives: string[]; modifiers: StatModifier[]; feverLevel: number; conditionDeathCause?: string } {
  const narratives: string[] = [];
  const modifiers: StatModifier[] = [];
  let feverLevel = 0;
  let conditionDeathCause: string | undefined;

  if (!animal.bodyState || !animal.anatomyIndex) {
    return { animal, narratives, modifiers, feverLevel };
  }

  const bodyState: BodyState = {
    parts: { ...animal.bodyState.parts },
    capabilities: { ...animal.bodyState.capabilities },
    conditions: [...animal.bodyState.conditions],
    conditionProgressions: { ...animal.bodyState.conditionProgressions },
  };

  // Deep-copy part states so we don't mutate the original
  for (const [partId, partState] of Object.entries(bodyState.parts)) {
    bodyState.parts[partId] = {
      ...partState,
      tissueDamage: { ...partState.tissueDamage },
    };
  }

  // 1. Heal tissue damage over time
  for (const part of animal.anatomyIndex.definition.bodyParts) {
    const partState = bodyState.parts[part.id];
    if (!partState || partState.destroyed) continue;

    for (const tissueId of part.tissues) {
      const tissue = animal.anatomyIndex.tissueById.get(tissueId);
      if (!tissue) continue;

      const currentDamage = partState.tissueDamage[tissueId] ?? 0;
      if (currentDamage > 0) {
        // Chronic conditions leave a damage floor (scar tissue)
        const progression = bodyState.conditions.find(c => c.bodyPartId === part.id)
          ? bodyState.conditionProgressions[bodyState.conditions.find(c => c.bodyPartId === part.id)!.id]
          : undefined;
        const damageFloor = progression?.phase === 'chronic' ? 10 : 0;

        const healAmount = tissue.healingRate * 100 * ffMult;
        const newDamage = Math.max(damageFloor, currentDamage - healAmount);
        partState.tissueDamage[tissueId] = newDamage;

        if (currentDamage > 20 && newDamage <= damageFloor) {
          narratives.push(`Your ${part.label} tissue has fully healed.`);
        }
      }
    }
  }

  // 2. Progress body conditions via cascade engine
  if (physiologyState) {
    const cascadeResult = tickConditionProgression({
      physiology: physiologyState,
      conditions: bodyState.conditions,
      progressions: bodyState.conditionProgressions,
      turn: 0, // turn isn't used for progression logic, just for new condition init
      rng,
      ffMult,
      foragingBehavior: foragingBehavior ?? 3,
      nearWater: nearWater ?? false,
    });

    feverLevel = cascadeResult.totalFeverLevel;
    narratives.push(...cascadeResult.narratives);
    if (cascadeResult.deathCause) {
      conditionDeathCause = cascadeResult.deathCause;
    }

    // Update progression states and remove resolved conditions
    const resolvedIds = new Set(
      cascadeResult.conditions.filter(e => e.resolved).map(e => e.conditionId),
    );

    const newProgressions: Record<string, import('../simulation/conditions/types').ConditionProgression> = {};
    for (const entry of cascadeResult.conditions) {
      if (!entry.resolved) {
        newProgressions[entry.conditionId] = entry.progression;
      }
    }
    bodyState.conditionProgressions = newProgressions;

    // Update infection levels on conditions from cascade state
    const remainingConditions = [];
    for (const condition of bodyState.conditions) {
      condition.turnsActive += ffMult;

      // Check if resolved by cascade or by tissue healing
      if (resolvedIds.has(condition.id)) {
        narratives.push(`Your ${condition.type} on your ${animal.anatomyIndex.partById.get(condition.bodyPartId)?.label ?? condition.bodyPartId} has healed.`);
        continue;
      }

      const partState = bodyState.parts[condition.bodyPartId];
      if (partState) {
        const maxDamage = Math.max(0, ...Object.values(partState.tissueDamage));
        if (maxDamage < 5 && condition.turnsActive > 3) {
          narratives.push(`Your ${condition.type} on your ${animal.anatomyIndex.partById.get(condition.bodyPartId)?.label ?? condition.bodyPartId} has cleared.`);
          continue;
        }
      }

      // Sync infection level from cascade phase
      const prog = newProgressions[condition.id];
      if (prog) {
        if (prog.phase === 'infected') condition.infectionLevel = Math.min(100, 40 + prog.turnsInPhase * 10);
        else if (prog.phase === 'septic') condition.infectionLevel = 80;
        else if (prog.phase === 'recovering') condition.infectionLevel = Math.max(0, condition.infectionLevel - 10 * ffMult);
        condition.healing = prog.phase === 'healing' || prog.phase === 'recovering' || prog.phase === 'resolved';
      }

      remainingConditions.push(condition);
    }
    bodyState.conditions = remainingConditions;
  } else {
    // Legacy fallback: flat infection logic for non-simulation species
    const remainingConditions = [];
    for (const condition of bodyState.conditions) {
      condition.turnsActive += ffMult;

      const partState = bodyState.parts[condition.bodyPartId];
      if (partState) {
        const maxDamage = Math.max(0, ...Object.values(partState.tissueDamage));
        if (maxDamage < 5) {
          narratives.push(`Your ${condition.type} on your ${animal.anatomyIndex.partById.get(condition.bodyPartId)?.label ?? condition.bodyPartId} has cleared.`);
          continue;
        }
      }

      if (condition.type === 'laceration' || condition.type === 'puncture') {
        if (!condition.healing && rng.chance(0.05 * ffMult)) {
          condition.infectionLevel = Math.min(100, condition.infectionLevel + 10 * ffMult);
          if (condition.infectionLevel > 30) {
            narratives.push(`The wound on your ${animal.anatomyIndex.partById.get(condition.bodyPartId)?.label ?? condition.bodyPartId} is showing signs of infection.`);
          }
        }
      }

      if (!condition.healing && condition.turnsActive > 3) {
        condition.healing = true;
      }

      remainingConditions.push(condition);
    }
    bodyState.conditions = remainingConditions;
  }

  // 3. Recompute capabilities and generate stat modifiers
  const capResult = recomputeCapabilities(bodyState, animal.anatomyIndex);
  bodyState.capabilities = capResult.capabilities;
  modifiers.push(...capResult.modifiers);

  // 4. Check for death from capability failure
  const deathCause = checkCapabilityDeath(bodyState, animal.anatomyIndex);
  if (deathCause) {
    narratives.push(deathCause);
  }

  return {
    animal: { ...animal, bodyState },
    narratives,
    modifiers,
    feverLevel,
    conditionDeathCause,
  };
}
