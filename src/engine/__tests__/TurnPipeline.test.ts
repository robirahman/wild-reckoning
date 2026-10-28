import { describe, it, expect, beforeAll } from 'vitest';
import { installLocalStorage } from '../../test-utils/localStorage';
import { createGameStore } from '../../store/gameStore';
import { getSpeciesBundle } from '../../data/species';
import { StatId, computeEffectiveValue } from '../../types/stats';
import { beginTurn, commitTurn, dismissResults, resolveDeathRoll, type TurnHooks } from '../TurnPipeline';
import { FAST_FORWARD_TURNS } from '../FastForward';
import { computeBodyCondition } from '../../simulation/physiology/helpers';
import { SCENARIOS } from '../../data/scenarios';
import { createMockRng } from './testHelpers';
import type { ResolvedEvent } from '../../types/events';
import type { ScenarioOutcome } from '../../types/scenario';

beforeAll(installLocalStorage);

type Store = ReturnType<typeof createGameStore>;

function startGame(speciesId = 'white-tailed-deer', backstoryType?: string, sex: 'male' | 'female' = 'female', seed = 4242): Store {
  const store = createGameStore();
  const bundle = getSpeciesBundle(speciesId);
  const backstory = bundle.backstories.find((b) => b.type === backstoryType) ?? bundle.backstories[0];
  store.getState().startGame(speciesId, backstory, sex, 'normal', seed);
  return store;
}

/** Answer every pending event with its first choice, as a player clicking through would */
function answerAll(store: Store) {
  for (const event of store.getState().currentEvents) {
    const first = event.definition.choices?.[0];
    if (first && !event.choiceMade) store.getState().makeChoice(event.definition.id, first.id);
  }
}

/** The UI's full cycle: start the turn, answer, Next Turn, then Continue */
function playOneTurn(store: Store) {
  beginTurn(store);
  if (store.getState().phase !== 'playing') return;
  answerAll(store);
  commitTurn(store);
  for (const roll of store.getState().turnResult?.pendingDeathRolls ?? []) {
    resolveDeathRoll(store, roll.eventId, roll.escapeOptions[0].id);
  }
  dismissResults(store);
}

describe('turn advancement', () => {
  it('advances exactly one turn per Next Turn → Continue cycle', () => {
    const store = startGame();
    playOneTurn(store);
    for (let i = 0; i < 5 && store.getState().phase === 'playing'; i++) {
      const before = store.getState().time.turn;
      playOneTurn(store);
      if (store.getState().phase !== 'playing') break;
      // Continue begins the next turn: the calendar moved exactly one step
      expect(store.getState().time.turn).toBe(before + 1);
    }
  });

  it('ignores repeated steps instead of advancing or applying twice', () => {
    const store = startGame();
    expect(beginTurn(store)).toBe(true);
    const turn = store.getState().time.turn;
    expect(beginTurn(store)).toBe(false); // e.g. StrictMode's second mount effect
    expect(store.getState().time.turn).toBe(turn);

    answerAll(store);
    expect(commitTurn(store)).not.toBeNull();
    const hea = computeEffectiveValue(store.getState().animal.stats[StatId.HEA]);
    expect(commitTurn(store)).toBeNull(); // a second Next Turn click
    expect(computeEffectiveValue(store.getState().animal.stats[StatId.HEA])).toBe(hea);

    if (store.getState().turnResult?.pendingDeathRolls?.length) return;
    expect(dismissResults(store)).toBe(true);
    expect(dismissResults(store)).toBe(false); // a double-clicked Continue
  });

  it('refuses to commit while choices are pending', () => {
    const store = startGame();
    beginTurn(store);
    if (store.getState().pendingChoices.length === 0) return;
    expect(commitTurn(store)).toBeNull();
    expect(store.getState().turnPhase).toBe('choosing');
  });

  it('fast-forward covers twelve turns and summarizes them', () => {
    const store = startGame();
    playOneTurn(store);
    store.setState({ fastForward: true });
    const before = store.getState().time.turn;
    beginTurn(store);
    const card = store.getState().currentEvents.find((e) => e.definition.tags.includes('time-skip'));
    expect(card?.resolvedNarrative).toMatch(/^The days run together\./);
    const advanced = store.getState().time.turn - before;
    // Something important switches fast-forward off and ends the skip early
    if (!store.getState().fastForward) {
      expect(advanced).toBeLessThan(FAST_FORWARD_TURNS);
    } else {
      expect(advanced).toBe(FAST_FORWARD_TURNS);
    }
  });

  it('fast-forward stops early and pauses for a birth', () => {
    const store = startGame('white-tailed-deer', 'wild-born', 'female');
    playOneTurn(store);
    const repro = store.getState().reproduction;
    if (repro.type !== 'iteroparous') throw new Error('deer are iteroparous');
    store.setState({
      fastForward: true,
      reproduction: { ...repro, pregnancy: { conceivedOnTurn: 0, turnsRemaining: 3, offspringCount: 2 } },
    });
    const before = store.getState().time.turn;
    beginTurn(store);
    if (store.getState().phase !== 'playing') return;
    expect(store.getState().time.turn - before).toBe(3);
    expect(store.getState().fastForward).toBe(false);
    const card = store.getState().currentEvents.find((e) => e.definition.tags.includes('time-skip'));
    expect(card?.resolvedNarrative).toMatch(/Your fawns have come\./);
    // The animal knows nothing of the game skipping ahead
    expect(card?.resolvedNarrative).not.toMatch(/fast-forward|paused/i);
  });
});

describe('turn history', () => {
  it('records each resolved turn once, under the turn it happened on', () => {
    const store = startGame();
    const played: { turn: number; ids: string[] }[] = [];
    for (let i = 0; i < 6 && store.getState().phase === 'playing'; i++) {
      beginTurn(store);
      if (store.getState().phase !== 'playing') break;
      answerAll(store);
      played.push({ turn: store.getState().time.turn, ids: store.getState().currentEvents.map((e) => e.definition.id) });
      commitTurn(store);
      for (const roll of store.getState().turnResult?.pendingDeathRolls ?? []) {
        store.getState().resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
      }
      dismissResults(store);
    }
    const history = store.getState().turnHistory;
    expect(history.map((h) => h.turn)).toEqual(played.map((p) => p.turn));
    expect(history.map((h) => h.events.map((e) => e.definition.id))).toEqual(played.map((p) => p.ids));
  });
});

describe('voluntary actions', () => {
  function restTurn(withRest: boolean) {
    const store = startGame('white-tailed-deer', 'rehabilitation', 'female', 777);
    playOneTurn(store);
    beginTurn(store);
    store.setState({ animal: { ...store.getState().animal, energy: 14 } });
    if (withRest) store.getState().performAction('rest');
    const afterAction = store.getState().animal.energy;
    answerAll(store);
    const result = commitTurn(store);
    return { store, afterAction, result };
  }

  it('applies Rest once: when chosen, not again when the turn resolves', () => {
    const rested = restTurn(true);
    const control = restTurn(false);
    expect(rested.afterAction).toBe(39);
    const s = rested.store.getState();
    const c = control.store.getState();
    expect(s.animal.energy - c.animal.energy).toBe(25);
    expect(computeEffectiveValue(s.animal.stats[StatId.HEA]) - computeEffectiveValue(c.animal.stats[StatId.HEA])).toBe(3);
    // Still reported on the results screen
    expect(rested.result?.eventOutcomes.some((o) => o.eventId === 'action-rest')).toBe(true);
  });
});

describe('farm events', () => {
  it('shows the hatchery first, then culls a layer-strain male at sorting', () => {
    const store = startGame('chicken', 'layer', 'male');
    beginTurn(store);
    expect(store.getState().currentEvents.map((e) => e.definition.id)).toContain('chicken-hatchery');
    expect(store.getState().phase).toBe('playing');
    answerAll(store);
    commitTurn(store);
    dismissResults(store);
    playOneTurn(store);
    expect(store.getState().phase).toBe('dead');
    expect(store.getState().animal.causeOfDeath).toMatch(/Culled at the hatchery/);
  });

  it('raises broiler males for meat instead of culling them', () => {
    const store = startGame('chicken', 'broiler', 'male');
    for (let i = 0; i < 8 && store.getState().phase === 'playing'; i++) playOneTurn(store);
    expect(store.getState().animal.causeOfDeath ?? '').not.toMatch(/Culled/);
  });

  it('honors turn_above: shed life starts only after hatch day', () => {
    const store = startGame('chicken', 'broiler', 'female');
    const seen: string[] = [];
    for (let i = 0; i < 4 && store.getState().phase === 'playing'; i++) {
      beginTurn(store);
      seen.push(...store.getState().currentEvents.map((e) => e.definition.id));
      answerAll(store);
      commitTurn(store);
      dismissResults(store);
    }
    expect(seen).not.toContain('chicken-ammonia-burn');
    expect(seen).not.toContain('chicken-industrial-feeding');
  });
});

describe('storylines', () => {
  it('follows the branch the player chose last turn', () => {
    const store = startGame();
    playOneTurn(store);
    // A storyline waiting on its first decision, answered "help" last turn
    store.setState({
      activeStorylines: [{ definitionId: 'wounded-stranger', currentStepIndex: 0, turnsAtCurrentStep: 1, startedOnTurn: 1 }],
      currentEvents: [{
        definition: {
          id: 'storyline-wounded-stranger-wounded-stranger-discover',
          type: 'active', category: 'environmental', narrativeText: '', statEffects: [],
          conditions: [], weight: 0, tags: [],
        },
        resolvedNarrative: '',
        triggeredSubEvents: [],
        choiceMade: 'help',
      }],
    });
    beginTurn(store);
    const active = store.getState().activeStorylines.find((s) => s.definitionId === 'wounded-stranger');
    // The "help" branch is step 2; "ignore" would have been step 1
    if (active?.currentStepIndex !== 0) expect(active?.currentStepIndex).toBe(2);
    expect(active?.choicesMade?.[0]).toBe('help');
  });
});

describe('body condition', () => {
  const config = getSpeciesBundle('white-tailed-deer').config;

  it('rates a deer at its starting weight as average, not starving', () => {
    expect(computeBodyCondition(config.startingWeight.female, config, 'female', 17)).toBe(3);
    expect(computeBodyCondition(config.startingWeight.male, config, 'male', 12)).toBe(3);
  });

  it('judges adults against a healthy adult of their own sex', () => {
    expect(computeBodyCondition(130, config, 'female', 40)).toBe(3);
    expect(computeBodyCondition(95, config, 'female', 40)).toBe(2);
    expect(computeBodyCondition(80, config, 'female', 40)).toBe(1);
    expect(computeBodyCondition(130, config, 'male', 40)).toBe(2); // a thin buck
  });

  it('starts a new deer without the starving badge or a malnutrition penalty', () => {
    const store = startGame('white-tailed-deer', 'rehabilitation', 'female');
    beginTurn(store);
    expect(store.getState().animal.physiologyState?.bodyConditionScore).toBeGreaterThanOrEqual(3);
    expect(store.getState().instinctNudges.map((n) => n.id)).not.toContain('starving');
  });
});

describe('challenge outcomes', () => {
  /**
   * "The Last Winter" (survive 20 turns), with one deadly encounter on the
   * given turn whose escape the player still has to choose after Next Turn.
   */
  function deadlyEncounterOnTurn(turn: number) {
    const scenario = SCENARIOS.find((s) => s.id === 'the-last-winter')!;
    const bundle = getSpeciesBundle(scenario.speciesId);
    const store = createGameStore();
    store.getState().startGame(scenario.speciesId, bundle.backstories.find((b) => b.type === scenario.backstoryType)!,
      scenario.sex ?? 'female', scenario.difficulty, 4242, scenario);
    beginTurn(store);

    const ambush: ResolvedEvent = {
      definition: {
        id: 'test-ambush', type: 'active', category: 'predator', narrativeText: 'A test.',
        statEffects: [], conditions: [], weight: 1, tags: ['predator'],
        choices: [{
          id: 'freeze', label: 'Freeze', statEffects: [], consequences: [], revocable: false, style: 'danger',
          deathChance: {
            probability: 0.5,
            cause: 'Taken by the test predator.',
            escapeOptions: [{ id: 'run', label: 'Run', description: 'Run.', survivalModifier: 0 }],
          },
        }],
      },
      resolvedNarrative: 'A test.',
      triggeredSubEvents: [],
    };
    store.setState({ currentEvents: [ambush], pendingChoices: ['test-ambush'], time: { ...store.getState().time, turn } });
    store.getState().makeChoice('test-ambush', 'freeze');

    const decided: ScenarioOutcome[] = [];
    const hooks: TurnHooks = { onScenarioDecided: (_state, outcome) => decided.push(outcome) };
    commitTurn(store, hooks);
    expect(store.getState().phase).toBe('playing');
    expect(store.getState().turnResult?.pendingDeathRolls).toHaveLength(1);
    return { store, hooks, decided };
  }

  it('waits for the escape roll before deciding', () => {
    const { store, decided } = deadlyEncounterOnTurn(20);
    expect(store.getState().scenarioOutcome).toBeNull();
    expect(decided).toEqual([]);
  });

  it("isn't won when the final turn's escape fails", () => {
    const { store, hooks, decided } = deadlyEncounterOnTurn(20);
    store.setState({ rng: createMockRng({ chance: true }) }); // the roll kills
    resolveDeathRoll(store, 'test-ambush', 'run', hooks);
    expect(store.getState().phase).toBe('dead');
    expect(store.getState().scenarioOutcome?.status).toBe('lost');
    expect(decided.map((o) => o.status)).toEqual(['lost']);
  });

  it('is won once the final escape succeeds', () => {
    const { store, hooks, decided } = deadlyEncounterOnTurn(20);
    store.setState({ rng: createMockRng({ chance: false }) }); // the animal gets away
    resolveDeathRoll(store, 'test-ambush', 'run', hooks);
    expect(store.getState().phase).toBe('playing');
    expect(store.getState().scenarioOutcome?.status).toBe('won');
    expect(decided.map((o) => o.status)).toEqual(['won']);
  });

  it('records a loss when an escape fails before the target turn', () => {
    const { store, hooks, decided } = deadlyEncounterOnTurn(5);
    store.setState({ rng: createMockRng({ chance: true }) });
    resolveDeathRoll(store, 'test-ambush', 'run', hooks);
    expect(store.getState().phase).toBe('dead');
    expect(decided.map((o) => o.status)).toEqual(['lost']);
  });
});
