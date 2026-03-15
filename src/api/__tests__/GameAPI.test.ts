import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { GameAPI } from '../GameAPI';

// Polyfill localStorage for Node environment
beforeAll(() => {
  if (typeof globalThis.localStorage === 'undefined') {
    const store: Record<string, string> = {};
    (globalThis as Record<string, unknown>).localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { for (const k of Object.keys(store)) delete store[k]; },
      get length() { return Object.keys(store).length; },
      key: (i: number) => Object.keys(store)[i] ?? null,
    };
  }
});

describe('GameAPI', () => {
  let game: GameAPI;

  beforeEach(() => {
    game = new GameAPI();
  });

  it('lists available species', () => {
    expect(GameAPI.speciesIds).toContain('white-tailed-deer');
    expect(GameAPI.speciesIds.length).toBeGreaterThan(5);
  });

  it('lists backstory options', () => {
    expect(GameAPI.backstoryOptions.length).toBeGreaterThan(0);
    expect(GameAPI.backstoryOptions.map(b => b.type)).toContain('wild-born');
  });

  it('starts a game and returns a valid snapshot', () => {
    const snap = game.start({
      species: 'white-tailed-deer',
      backstory: 'wild-born',
      sex: 'female',
      seed: 42,
    });

    expect(snap.phase).toBe('playing');
    expect(snap.species).toBe('white-tailed-deer');
    expect(snap.sex).toBe('female');
    expect(snap.alive).toBe(true);
    expect(snap.weight).toBeGreaterThan(0);
    expect(snap.stats.HEA).toBeGreaterThan(0);
  });

  it('throws on invalid backstory', () => {
    expect(() =>
      game.start({ species: 'white-tailed-deer', backstory: 'nonexistent', sex: 'male' })
    ).toThrow(/Unknown backstory/);
  });

  it('generates a turn with events', () => {
    game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female', seed: 42 });
    const turn = game.generateTurn();

    expect(turn.turn).toBeGreaterThan(0);
    expect(turn.season).toBeDefined();
    expect(Array.isArray(turn.events)).toBe(true);
  });

  it('makes choices and ends turn', () => {
    game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female', seed: 42 });
    game.generateTurn();

    // Auto-choose any pending choices
    game.autoChoose();

    const result = game.endTurn();
    expect(result).toBeDefined();
    expect(Array.isArray(result.healthNarratives)).toBe(true);
    expect(typeof result.weightChange).toBe('number');
  });

  it('throws endTurn when choices are pending', () => {
    game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female', seed: 100 });
    const turn = game.generateTurn();

    if (turn.pendingChoices.length > 0) {
      expect(() => game.endTurn()).toThrow(/pending choices/);
    }
  });

  it('runs simulate() for multiple turns', () => {
    game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female', seed: 42 });
    const log = game.simulate(5);

    expect(log.length).toBeGreaterThan(0);
    expect(log.length).toBeLessThanOrEqual(5);

    // Each entry should have turn data
    for (const entry of log) {
      expect(entry.turn).toBeGreaterThan(0);
      expect(entry.snapshot.species).toBe('white-tailed-deer');
    }
  });

  it('game ends on death during simulate()', () => {
    // Use a high-difficulty seed that tends to kill quickly
    game.start({ species: 'white-tailed-deer', backstory: 'orphaned', sex: 'male', difficulty: 'hard', seed: 1 });
    const log = game.simulate(200);

    // Either we survived 200 turns or died earlier
    if (log.length < 200) {
      const lastSnap = log[log.length - 1].snapshot;
      expect(lastSnap.alive).toBe(false);
    }
  });

  it('getSnapshot reflects stat changes across turns', () => {
    game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female', seed: 42 });
    const before = game.getSnapshot();

    game.generateTurn();
    game.autoChoose();
    game.endTurn();

    const after = game.getSnapshot();
    // Weight should have changed (foraging / seasonal)
    expect(after.weight).not.toBe(before.weight);
  });

  it('behavioral settings can be changed', () => {
    game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female', seed: 42 });
    game.setBehavior('caution', 5);
    const snap = game.getSnapshot();
    expect(snap.behavioralSettings.caution).toBe(5);
  });

  it('reset returns to menu', () => {
    game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female', seed: 42 });
    expect(game.phase).toBe('playing');
    game.reset();
    expect(game.phase).toBe('menu');
  });

  it('works with different species', () => {
    for (const speciesId of ['african-elephant', 'chinook-salmon', 'polar-bear']) {
      const g = new GameAPI();
      const snap = g.start({ species: speciesId, backstory: 'wild-born', sex: 'female', seed: 42 });
      expect(snap.species).toBe(speciesId);
      expect(snap.alive).toBe(true);

      // Should be able to generate at least one turn
      const turn = g.generateTurn();
      expect(turn.turn).toBeGreaterThan(0);

      g.autoChoose();
      const result = g.endTurn();
      expect(result).toBeDefined();
    }
  });
});
