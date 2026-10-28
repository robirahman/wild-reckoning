/** Challenge Mode: apply a scenario's starting conditions and track its win condition */

import type { ScenarioDefinition, ScenarioOutcome } from '../types/scenario';
import type { SpeciesDataBundle } from '../types/speciesConfig';
import type { AnimalState } from '../types/species';
import type { ReproductionState } from '../types/reproduction';
import type { TimeState } from '../types/world';
import type { GameFlag } from '../types/flags';
import type { Rng } from './RandomUtils';
import { initializePhysiology } from '../simulation/physiology/initialize';

/** Month index (0 = January) a game starts in when no scenario overrides it */
export const DEFAULT_START_MONTH = 5;

export function scenarioStartMonth(scenario: ScenarioDefinition | null | undefined): number {
  return scenario?.startMonth ?? DEFAULT_START_MONTH;
}

/** Apply a scenario's starting weight, age, flags, injuries, parasites and region */
export function applyScenarioStart(
  scenario: ScenarioDefinition,
  bundle: SpeciesDataBundle,
  animal: AnimalState,
  rng: Rng,
): AnimalState {
  const weight = scenario.startingWeight ?? animal.weight;
  const age = scenario.startingAge ?? animal.age;
  const flags = new Set(animal.flags);
  for (const flag of scenario.startingFlags ?? []) flags.add(flag as GameFlag);

  const injuries = [
    ...animal.injuries,
    ...(scenario.startingInjuries ?? []).map(({ injuryId, severity }) => {
      const def = bundle.injuries[injuryId];
      return {
        definitionId: injuryId,
        currentSeverity: severity,
        turnsRemaining: def?.severityLevels[severity]?.baseHealingTime ?? 8,
        bodyPartDetail: def?.bodyParts.length ? rng.pick(def.bodyParts) : 'unspecified',
        isResting: false,
        acquiredOnTurn: 0,
      };
    }),
  ];

  const parasites = [
    ...animal.parasites,
    ...(scenario.startingParasites ?? []).map(({ parasiteId, stage }) => ({
      definitionId: parasiteId,
      currentStage: stage,
      turnsAtCurrentStage: 0,
      acquiredOnTurn: 0,
    })),
  ];

  const region = scenario.regionOverride ?? animal.region;

  return {
    ...animal,
    weight,
    age,
    region,
    flags,
    injuries,
    parasites,
    // Fat reserves and body condition derive from weight and age, so re-seed them
    physiologyState: animal.physiologyState && (scenario.startingWeight !== undefined || scenario.startingAge !== undefined)
      ? initializePhysiology(bundle.config, weight, animal.sex, age)
      : animal.physiologyState,
    lifetimeStats: { ...animal.lifetimeStats, regionsVisited: [region] },
  };
}

interface ScenarioProgressState {
  animal: AnimalState;
  time: TimeState;
  reproduction: ReproductionState;
}

function hasReproduced(reproduction: ReproductionState, target: number): boolean {
  return reproduction.type === 'iteroparous'
    ? reproduction.offspring.length >= target
    : reproduction.spawned;
}

/** True once the scenario's win condition has been met */
export function isScenarioWon(scenario: ScenarioDefinition, state: ScenarioProgressState): boolean {
  const { type, target } = scenario.winCondition;
  switch (type) {
    case 'survive_turns':
      return state.time.turn >= Number(target);
    case 'reach_weight':
      return state.animal.weight >= Number(target);
    case 'reproduce':
      return hasReproduced(state.reproduction, Number(target));
    case 'reach_region':
      return state.animal.region === target;
  }
}

/** Short progress line for the header, e.g. "Survive 20 turns (7/20)" */
export function describeScenarioProgress(scenario: ScenarioDefinition, state: ScenarioProgressState): string {
  const { type, target, description } = scenario.winCondition;
  if (type === 'survive_turns') {
    return `${description} (${Math.min(state.time.turn, Number(target))}/${target})`;
  }
  if (type === 'reach_weight') {
    return `${description} (${Math.round(state.animal.weight)}/${target})`;
  }
  return description;
}

/**
 * The outcome to record after a turn resolves, or null while the scenario is
 * still in progress (or was already decided).
 */
export function scenarioOutcomeAfterTurn(
  state: ScenarioProgressState & {
    scenario: ScenarioDefinition | null;
    scenarioOutcome: ScenarioOutcome | null;
    phase: string;
  },
): ScenarioOutcome | null {
  const { scenario } = state;
  if (!scenario || state.scenarioOutcome) return null;
  const ended = state.phase !== 'playing';
  // Spawning and dying in the same turn still completes a reproduction goal
  const won = isScenarioWon(scenario, state) && (!ended || scenario.winCondition.type === 'reproduce');
  if (!won && !ended) return null;
  return { status: won ? 'won' : 'lost', turn: state.time.turn };
}
