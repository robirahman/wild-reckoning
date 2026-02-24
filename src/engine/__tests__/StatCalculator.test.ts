import { describe, it, expect } from 'vitest';
import { createStatBlock, addModifier, tickModifiers, removeModifiersBySource } from '../StatCalculator';
import { computeEffectiveValue, StatId } from '../../types/stats';
import type { StatModifier } from '../../types/stats';

describe('StatCalculator', () => {
  /** Helper: create a full bases record with a default of 50 for each stat */
  function makeBases(overrides: Partial<Record<StatId, number>> = {}): Record<StatId, number> {
    const defaults: Record<StatId, number> = {
      [StatId.IMM]: 50, [StatId.CLI]: 50, [StatId.HOM]: 50,
      [StatId.TRA]: 50, [StatId.ADV]: 50, [StatId.NOV]: 50,
      [StatId.WIS]: 50, [StatId.HEA]: 50, [StatId.STR]: 50,
    };
    return { ...defaults, ...overrides };
  }

  /** Helper: create a stat modifier with sensible defaults */
  function makeMod(overrides: Partial<StatModifier> & { stat: StatId }): StatModifier {
    return {
      id: 'test-source',
      source: 'Test',
      sourceType: 'event',
      amount: 5,
      ...overrides,
    };
  }

  describe('createStatBlock', () => {
    it('creates a stat block with base values and empty modifiers', () => {
      const bases = makeBases({
        [StatId.IMM]: 30, [StatId.CLI]: 40, [StatId.HOM]: 50,
        [StatId.TRA]: 20, [StatId.ADV]: 25, [StatId.NOV]: 35,
        [StatId.WIS]: 45, [StatId.HEA]: 60, [StatId.STR]: 30,
      });
      const block = createStatBlock(bases);

      expect(block[StatId.HEA].base).toBe(60);
      expect(block[StatId.HEA].modifiers).toEqual([]);
      expect(block[StatId.IMM].base).toBe(30);
      expect(block[StatId.STR].base).toBe(30);
    });

    it('defaults missing stats to 50', () => {
      // createStatBlock internally defaults to 50 via the ?? operator
      const block = createStatBlock({} as Record<StatId, number>);
      expect(block[StatId.HEA].base).toBe(50);
    });
  });

  describe('addModifier', () => {
    it('adds a modifier to the correct stat', () => {
      const block = createStatBlock(makeBases());
      const modifier = makeMod({ stat: StatId.HEA, amount: 10 });
      const updated = addModifier(block, modifier);

      expect(updated[StatId.HEA].modifiers).toHaveLength(1);
      expect(updated[StatId.HEA].modifiers[0].amount).toBe(10);
      // Other stats should remain unaffected
      expect(updated[StatId.IMM].modifiers).toHaveLength(0);
    });

    it('appends multiple modifiers to the same stat', () => {
      let block = createStatBlock(makeBases());
      block = addModifier(block, makeMod({ stat: StatId.CLI, amount: 5, id: 'mod-a' }));
      block = addModifier(block, makeMod({ stat: StatId.CLI, amount: -3, id: 'mod-b' }));

      expect(block[StatId.CLI].modifiers).toHaveLength(2);
    });
  });

  describe('tickModifiers', () => {
    it('decrements duration and removes expired modifiers', () => {
      let block = createStatBlock(makeBases());
      block = addModifier(block, makeMod({ stat: StatId.TRA, amount: 10, duration: 2 }));

      // Tick once: duration should go from 2 to 1
      let ticked = tickModifiers(block);
      expect(ticked[StatId.TRA].modifiers).toHaveLength(1);
      expect(ticked[StatId.TRA].modifiers[0].duration).toBe(1);

      // Tick again: duration goes to 0, modifier should be removed
      ticked = tickModifiers(ticked);
      expect(ticked[StatId.TRA].modifiers).toHaveLength(0);
    });

    it('keeps permanent modifiers (no duration)', () => {
      let block = createStatBlock(makeBases());
      block = addModifier(block, makeMod({ stat: StatId.WIS, amount: 5, duration: undefined }));

      const ticked = tickModifiers(block);
      expect(ticked[StatId.WIS].modifiers).toHaveLength(1);
      expect(ticked[StatId.WIS].modifiers[0].duration).toBeUndefined();

      // Tick many times; should always remain
      let result = ticked;
      for (let i = 0; i < 10; i++) {
        result = tickModifiers(result);
      }
      expect(result[StatId.WIS].modifiers).toHaveLength(1);
    });
  });

  describe('computeEffectiveValue', () => {
    it('sums base and modifiers', () => {
      const stat = {
        base: 50,
        modifiers: [makeMod({ stat: StatId.HEA, amount: 10 })],
      };
      expect(computeEffectiveValue(stat)).toBe(60);
    });

    it('sums multiple modifiers', () => {
      const stat = {
        base: 50,
        modifiers: [
          makeMod({ stat: StatId.HEA, amount: 10 }),
          makeMod({ stat: StatId.HEA, amount: -5 }),
        ],
      };
      expect(computeEffectiveValue(stat)).toBe(55);
    });

    it('clamps to 100 when total exceeds max', () => {
      const stat = {
        base: 90,
        modifiers: [makeMod({ stat: StatId.HEA, amount: 20 })],
      };
      expect(computeEffectiveValue(stat)).toBe(100);
    });

    it('clamps to 0 when total goes below min', () => {
      const stat = {
        base: 10,
        modifiers: [makeMod({ stat: StatId.HEA, amount: -20 })],
      };
      expect(computeEffectiveValue(stat)).toBe(0);
    });

    it('returns base when there are no modifiers', () => {
      const stat = { base: 42, modifiers: [] };
      expect(computeEffectiveValue(stat)).toBe(42);
    });
  });

  describe('removeModifiersBySource', () => {
    it('removes all modifiers matching source ID', () => {
      let block = createStatBlock(makeBases());
      block = addModifier(block, makeMod({ stat: StatId.HEA, amount: 5, id: 'parasite-a' }));
      block = addModifier(block, makeMod({ stat: StatId.IMM, amount: 8, id: 'parasite-a' }));
      block = addModifier(block, makeMod({ stat: StatId.HEA, amount: -3, id: 'injury-b' }));

      const cleaned = removeModifiersBySource(block, 'parasite-a');

      // The two parasite-a modifiers should be gone
      expect(cleaned[StatId.HEA].modifiers).toHaveLength(1);
      expect(cleaned[StatId.HEA].modifiers[0].id).toBe('injury-b');
      expect(cleaned[StatId.IMM].modifiers).toHaveLength(0);
    });

    it('leaves the block unchanged when no modifiers match', () => {
      let block = createStatBlock(makeBases());
      block = addModifier(block, makeMod({ stat: StatId.CLI, amount: 5, id: 'foo' }));

      const cleaned = removeModifiersBySource(block, 'nonexistent');
      expect(cleaned[StatId.CLI].modifiers).toHaveLength(1);
    });
  });
});
