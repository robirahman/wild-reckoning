/** The one thing the animal most urgently needs, summarized for the player */

import type { InstinctNudge } from '../simulation/instinct/types';
import type { AnimalState } from '../types/species';
import type { SpeciesConfig } from '../types/speciesConfig';
import { BEHAVIOR_LABELS } from '../types/behavior';
import { StatId, computeEffectiveValue } from '../types/stats';

export interface PressingNeed {
  label: string;
  advice: string;
}

const PRIORITY: Record<InstinctNudge['priority'], number> = { high: 2, medium: 1, low: 0 };

export function mostPressingNeed(
  animal: AnimalState,
  config: SpeciesConfig,
  nudges: InstinctNudge[],
): PressingNeed | null {
  // Species with the simulation layer get instinct nudges; use the most urgent
  const top = nudges
    .filter((n) => n.priority !== 'low')
    .sort((a, b) => PRIORITY[b.priority] - PRIORITY[a.priority])[0];
  if (top) {
    return {
      label: top.label,
      advice: top.suggestedBehavior
        ? `${top.suggestedDirection === 'decrease' ? 'Lower' : 'Raise'} ${BEHAVIOR_LABELS[top.suggestedBehavior]} in your behavioral settings.`
        : top.description,
    };
  }

  // Otherwise read the basics directly
  if (animal.weight < config.weight.starvationDebuff) {
    return { label: 'Starving', advice: 'Raise Foraging in your behavioral settings.' };
  }
  if (config.hydration && animal.physiologicalStress.dehydration >= config.hydration.debuffThreshold) {
    return { label: 'Thirsty', advice: 'Find water.' };
  }
  if (computeEffectiveValue(animal.stats[StatId.HEA]) < 30) {
    return { label: 'Failing health', advice: 'Rest, and avoid risks until you recover.' };
  }
  if (animal.injuries.length > 0) {
    return { label: 'Injured', advice: 'Resting helps injuries heal.' };
  }
  if (animal.energy < 20) {
    return { label: 'Exhausted', advice: 'Rest to recover your stamina.' };
  }
  return null;
}
