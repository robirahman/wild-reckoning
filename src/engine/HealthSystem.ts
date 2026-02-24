import type { AnimalState } from '../types/species';
import type { ActiveParasite, ActiveInjury } from '../types/health';
import type { StatModifier } from '../types/stats';
import type { Rng } from './RandomUtils';
import { parasiteDefinitions } from '../data/parasites';
import { addModifier, removeModifiersBySource } from './StatCalculator';

interface HealthTickResult {
  animal: AnimalState;
  narratives: string[]; // Health-related narrative snippets for the turn
}

/** Process one turn of health effects: parasite progression, injury healing */
export function tickHealth(animal: AnimalState, rng: Rng, _turn: number): HealthTickResult {
  const narratives: string[] = [];
  let updatedAnimal = { ...animal };

  // ── Parasite Progression ──
  const updatedParasites: ActiveParasite[] = [];
  let stats = { ...updatedAnimal.stats };

  for (const parasite of updatedAnimal.parasites) {
    const def = parasiteDefinitions[parasite.definitionId];
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
    let turnsAtStage = parasite.turnsAtCurrentStage + 1;

    // Check for stage progression
    if (turnsAtStage >= stage.turnDuration.min) {
      if (rng.chance(stage.progressionChance) && newStage < def.stages.length - 1) {
        newStage += 1;
        turnsAtStage = 0;
        narratives.push(
          `Your ${def.name} infection has worsened to ${def.stages[newStage].severity}.`
        );
      } else if (rng.chance(stage.remissionChance) && newStage > 0) {
        newStage -= 1;
        turnsAtStage = 0;
        narratives.push(
          `Your ${def.name} infection has improved to ${def.stages[newStage].severity}.`
        );
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
    const newTurns = injury.turnsRemaining - (injury.isResting ? 1 : 0);

    if (newTurns <= 0) {
      narratives.push(`Your ${injury.bodyPartDetail} has healed.`);
      stats = removeModifiersBySource(stats, injury.definitionId);
      continue; // Injury healed, remove it
    }

    // Check for worsening if not resting
    if (!injury.isResting && rng.chance(0.1)) {
      narratives.push(
        `Your ${injury.bodyPartDetail} injury has worsened from lack of rest.`
      );
      updatedInjuries.push({
        ...injury,
        turnsRemaining: newTurns + 4, // Worsening adds healing time
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

  return { animal: updatedAnimal, narratives };
}
