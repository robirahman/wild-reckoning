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
