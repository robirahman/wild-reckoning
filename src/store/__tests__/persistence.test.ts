import { describe, it, expect, beforeAll, vi } from 'vitest';
import { installLocalStorage } from '../../test-utils/localStorage';
import { GameAPI } from '../../api/GameAPI';
import { createGameStore } from '../gameStore';
import {
  serializeState,
  deserializeState,
  saveGame,
  loadGame,
  SAVE_VERSION,
  type SerializedState,
} from '../persistence';

beforeAll(installLocalStorage);

type Store = ReturnType<typeof createGameStore>;

/** Play whole turns through the headless API, clearing the results screen after each */
function playTurns(store: Store, api: GameAPI, count: number) {
  for (let i = 0; i < count; i++) {
    api.generateTurn();
    api.autoChoose();
    const result = api.endTurn();
    for (const roll of result.pendingDeathRolls ?? []) {
      api.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
    }
    store.setState({ showingResults: false, turnResult: null });
  }
}

function startDoe() {
  const store = createGameStore();
  const api = new GameAPI(store);
  api.start({ species: 'white-tailed-deer', backstory: 'rehabilitation', sex: 'female', seed: 20261028 });
  return { store, api };
}

function roundTrip(store: Store): Store {
  const json = JSON.stringify(serializeState(store.getState()));
  return createGameStore(deserializeState(JSON.parse(json)));
}

describe('save / resume round trip', () => {
  it('restores a doe mid-turn with every runtime structure intact, then keeps playing', () => {
    const { store, api } = startDoe();
    playTurns(store, api, 2);
    // Mid-turn: events generated and answered, not yet committed
    api.generateTurn();
    api.autoChoose();
    const original = store.getState();
    expect(original.phase).toBe('playing');

    const restored = roundTrip(store);
    const r = restored.getState();

    // The derived anatomy index comes back as real Maps (the resume crash)
    expect(r.animal.anatomyIndex?.tissueById).toBeInstanceOf(Map);
    expect(r.animal.anatomyIndex?.tissueById.size).toBe(original.animal.anatomyIndex?.tissueById.size);
    // World state that used to be dropped
    expect(r.map).toEqual(original.map);
    expect(r.map).not.toBeNull();
    expect(r.territory).toEqual(original.territory);
    expect(r.ecosystem).toEqual(original.ecosystem);
    expect(r.ambientText).toBe(original.ambientText);
    expect(r.instinctNudges).toEqual(original.instinctNudges);
    // The turn in progress
    expect(r.time).toEqual(original.time);
    expect(r.currentEvents).toEqual(original.currentEvents);
    expect(r.pendingChoices).toEqual(original.pendingChoices);
    expect(r.reproduction).toEqual(original.reproduction);
    expect([...r.animal.flags].sort()).toEqual([...original.animal.flags].sort());
    expect(r.rng.getState()).toBe(original.rng.getState());

    // Finish the restored turn, then play the following one
    const restoredApi = new GameAPI(restored);
    const turnBefore = r.time.turn;
    expect(() => restoredApi.endTurn()).not.toThrow();
    restored.setState({ showingResults: false, turnResult: null });
    if (restored.getState().phase === 'playing') {
      expect(restoredApi.generateTurn().turn).toBe(turnBefore + 1);
      restoredApi.autoChoose();
      expect(() => restoredApi.endTurn()).not.toThrow();
    }
  });

  it('resumes on the results screen instead of letting a resolved turn be replayed', () => {
    const { store, api } = startDoe();
    playTurns(store, api, 1);
    api.generateTurn();
    api.autoChoose();
    api.endTurn();
    const original = store.getState();
    expect(original.showingResults).toBe(true);

    const r = roundTrip(store).getState();
    expect(r.showingResults).toBe(true);
    expect(r.turnResult).toEqual(original.turnResult);
  });

  it('backfills a v1 save that lacked world state and stored a mangled anatomy index', () => {
    const { store, api } = startDoe();
    playTurns(store, api, 2);
    const state = store.getState();
    const v2 = serializeState(state);
    expect(v2.version).toBe(SAVE_VERSION);

    // Shape of a save written by the old serializer: no version, no world
    // fields, and the anatomy index's Maps flattened to {} by JSON
    const v1: SerializedState = JSON.parse(JSON.stringify({
      ...v2,
      version: undefined,
      map: undefined,
      territory: undefined,
      ecosystem: undefined,
      evolution: undefined,
      actionsPerformed: undefined,
      showingResults: undefined,
      turnResult: undefined,
      animal: { ...v2.animal, anatomyIndex: state.animal.anatomyIndex },
    }));

    const legacy = createGameStore(deserializeState(v1));
    const l = legacy.getState();
    expect(l.map?.nodes.length).toBeGreaterThan(0);
    expect(l.animal.anatomyIndex?.tissueById).toBeInstanceOf(Map);
    expect(l.territory.established).toBe(l.animal.flags.has('territory-established'));

    // And it can play on
    const legacyApi = new GameAPI(legacy);
    legacyApi.generateTurn();
    legacyApi.autoChoose();
    expect(() => legacyApi.endTurn()).not.toThrow();
  });

  it('saves to and loads from localStorage', () => {
    const { store, api } = startDoe();
    playTurns(store, api, 1);
    expect(saveGame(store.getState())).toBe(true);

    const loaded = loadGame();
    expect(loaded?.phase).toBe('playing');
    expect(loaded?.time).toEqual(store.getState().time);
  });

  it('reports an unloadable save as null rather than throwing', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { store } = startDoe();
    const data = serializeState(store.getState());
    localStorage.setItem('wild-reckoning-save', JSON.stringify({
      ...data,
      animal: { ...data.animal, speciesId: 'dodo' },
    }));
    expect(loadGame()).toBeNull();
    localStorage.setItem('wild-reckoning-save', '{not json');
    expect(loadGame()).toBeNull();
    expect(consoleError).toHaveBeenCalledTimes(2);
    consoleError.mockRestore();
  });
});
