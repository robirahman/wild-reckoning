import { describe, it, expect, beforeAll } from 'vitest';
import { installLocalStorage } from '../../test-utils/localStorage';
import { createGameStore } from '../../store/gameStore';
import { getSpeciesBundle } from '../../data/species';
import { SCENARIOS } from '../../data/scenarios';
import { isScenarioWon, scenarioOutcomeAfterTurn, describeScenarioProgress } from '../ScenarioSystem';
import type { ScenarioDefinition } from '../../types/scenario';

beforeAll(installLocalStorage);

const byId = (id: string) => SCENARIOS.find((s) => s.id === id)!;

function startScenario(scenario: ScenarioDefinition) {
  const store = createGameStore();
  const bundle = getSpeciesBundle(scenario.speciesId);
  const backstory = bundle.backstories.find((b) => b.type === scenario.backstoryType) ?? bundle.backstories[0];
  store.getState().startGame(scenario.speciesId, backstory, scenario.sex ?? 'female', scenario.difficulty, 7, scenario);
  return store;
}

describe('scenario start', () => {
  it('applies the scenario starting state instead of a default game', () => {
    const scenario = byId('the-last-winter');
    const s = startScenario(scenario).getState();
    expect(s.scenario?.id).toBe('the-last-winter');
    expect(s.time.month).toBe('December');
    expect(s.time.season).toBe('winter');
    expect(s.animal.weight).toBe(95);
    expect(s.animal.age).toBe(24);
    expect(s.animal.backstory.type).toBe('wild-born');
    expect(s.animal.flags.has('territory-established')).toBe(true);
    expect(s.territory.established).toBe(true);
  });

  it('adds starting injuries and parasites', () => {
    const salmon = startScenario(byId('upstream-injured')).getState();
    expect(salmon.animal.injuries.map((i) => i.definitionId)).toContain('spawning-jaw-wound');
    expect(salmon.animal.age).toBe(44);
    expect(salmon.animal.flags.has('spawning-migration-begun')).toBe(true);

    const bee = startScenario(byId('colony-collapse')).getState();
    expect(bee.animal.parasites.map((p) => p.definitionId)).toContain('varroa-mite');
  });
});

describe('scenario outcome', () => {
  const survive = byId('the-last-winter');

  it('is decided by the win condition', () => {
    const s = startScenario(survive).getState();
    expect(isScenarioWon(survive, s)).toBe(false);
    expect(isScenarioWon(survive, { ...s, time: { ...s.time, turn: 20 } })).toBe(true);
    expect(describeScenarioProgress(survive, { ...s, time: { ...s.time, turn: 7 } })).toBe('Survive 20 turns (7/20)');
  });

  it('records a win, a loss, or nothing yet', () => {
    const s = startScenario(survive).getState();
    expect(scenarioOutcomeAfterTurn({ ...s, time: { ...s.time, turn: 3 } })).toBeNull();
    expect(scenarioOutcomeAfterTurn({ ...s, time: { ...s.time, turn: 20 } })).toEqual({ status: 'won', turn: 20 });
    expect(scenarioOutcomeAfterTurn({ ...s, phase: 'dead', time: { ...s.time, turn: 9 } })).toEqual({ status: 'lost', turn: 9 });
    // Dying on the turn the survival goal arrives doesn't count as surviving it
    expect(scenarioOutcomeAfterTurn({ ...s, phase: 'dead', time: { ...s.time, turn: 20 } })?.status).toBe('lost');
    // Once decided, it stays decided
    expect(scenarioOutcomeAfterTurn({ ...s, scenarioOutcome: { status: 'won', turn: 20 }, time: { ...s.time, turn: 25 } })).toBeNull();
  });

  it('counts spawning as success even though the salmon dies doing it', () => {
    const scenario = byId('upstream-injured');
    const s = startScenario(scenario).getState();
    const spawned = { ...s, phase: 'dead' as const, reproduction: { ...s.reproduction, spawned: true } };
    expect(scenarioOutcomeAfterTurn(spawned as typeof s)?.status).toBe('won');
  });
});
