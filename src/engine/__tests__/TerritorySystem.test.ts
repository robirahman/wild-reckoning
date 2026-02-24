import { describe, it, expect } from 'vitest';
import { tickTerritory, territoryWeightModifier } from '../TerritorySystem';
import { INITIAL_TERRITORY } from '../../types/territory';
import { createMockRng } from './testHelpers';

describe('TerritorySystem', () => {
  describe('tickTerritory', () => {
    it('returns unchanged territory for non-territorial species', () => {
      const territory = { ...INITIAL_TERRITORY, established: true, quality: 50 };
      const result = tickTerritory(territory, 'chinook-salmon', createMockRng());
      // Non-territorial species should get the territory back unchanged
      expect(result).toEqual(territory);
    });

    it('returns unchanged territory if not established', () => {
      const result = tickTerritory(INITIAL_TERRITORY, 'gray-wolf', createMockRng());
      expect(result.established).toBe(false);
    });

    it('increments markedTurns each tick', () => {
      const territory = {
        ...INITIAL_TERRITORY,
        established: true,
        size: 50,
        quality: 50,
        markedTurns: 0,
        contested: false,
        intruderPresent: false,
      };
      const result = tickTerritory(territory, 'gray-wolf', createMockRng());
      expect(result.markedTurns).toBe(1);
    });

    it('degrades quality when unmarked for too long', () => {
      const territory = {
        ...INITIAL_TERRITORY,
        established: true,
        size: 50,
        quality: 50,
        markedTurns: 5, // Above TERRITORY_UNMARKED_THRESHOLD (4)
        contested: false,
        intruderPresent: false,
      };
      // rng.chance returns false so no intruder/drift, but quality still decays
      const result = tickTerritory(territory, 'gray-wolf', createMockRng({ chance: false }));
      expect(result.quality).toBeLessThan(50);
    });

    it('can introduce intruder when unmarked threshold exceeded', () => {
      const territory = {
        ...INITIAL_TERRITORY,
        established: true,
        size: 50,
        quality: 50,
        markedTurns: 5,
        contested: false,
        intruderPresent: false,
      };
      // Need a sequence: chance(INTRUDER_CHANCE)=true, chance(DRIFT)=false, chance(LEAVE)=false
      // so the intruder appears but doesn't leave in the same tick
      let callCount = 0;
      const sequenceRng = createMockRng();
      sequenceRng.chance = () => {
        callCount++;
        // First call: intruder chance -> true (intruder appears)
        // Second call: quality drift chance -> false (skip drift)
        // Third call: intruder leave chance -> false (intruder stays)
        return callCount === 1;
      };
      const result = tickTerritory(territory, 'gray-wolf', sequenceRng);
      expect(result.intruderPresent).toBe(true);
      expect(result.contested).toBe(true);
    });

    it('reduces quality further when contested', () => {
      const territory = {
        ...INITIAL_TERRITORY,
        established: true,
        size: 50,
        quality: 50,
        markedTurns: 0,
        contested: true,
        intruderPresent: false,
      };
      const result = tickTerritory(territory, 'gray-wolf', createMockRng({ chance: false }));
      expect(result.quality).toBeLessThan(50);
    });
  });

  describe('territoryWeightModifier', () => {
    it('returns 1.0 for unestablished territory', () => {
      expect(territoryWeightModifier(INITIAL_TERRITORY)).toBe(1.0);
    });

    it('returns value between 0.7 and 1.3 for established territory', () => {
      const territory = { ...INITIAL_TERRITORY, established: true, quality: 50 };
      const mod = territoryWeightModifier(territory);
      expect(mod).toBeGreaterThanOrEqual(0.7);
      expect(mod).toBeLessThanOrEqual(1.3);
    });

    it('returns 1.3 for quality 100', () => {
      const territory = { ...INITIAL_TERRITORY, established: true, quality: 100 };
      expect(territoryWeightModifier(territory)).toBeCloseTo(1.3);
    });

    it('returns 0.7 for quality 0', () => {
      const territory = { ...INITIAL_TERRITORY, established: true, quality: 0 };
      expect(territoryWeightModifier(territory)).toBe(0.7);
    });

    it('scales linearly between 0.7 and 1.3', () => {
      const territory = { ...INITIAL_TERRITORY, established: true, quality: 50 };
      // 0.7 + (50/100) * 0.6 = 0.7 + 0.3 = 1.0
      expect(territoryWeightModifier(territory)).toBeCloseTo(1.0);
    });
  });
});
