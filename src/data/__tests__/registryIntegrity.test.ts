import { describe, it, expect } from 'vitest';
import { findSpeciesBundle, getAllSpeciesIds } from '../species';
import { SCENARIOS } from '../scenarios';
import { SPECIES_UNLOCKS } from '../speciesUnlocks';
import { ENCYCLOPEDIA_ENTRIES } from '../encyclopedia';
import { ACHIEVEMENTS } from '../achievements';
import { getRegionDefinition } from '../regions';

const achievementIds = new Set(ACHIEVEMENTS.map((a) => a.id));

describe('species registry integrity', () => {
  it('registers every species that challenges, unlocks, the encyclopedia and achievements refer to', () => {
    const referenced = new Set<string>([
      ...SCENARIOS.map((s) => s.speciesId),
      ...SPECIES_UNLOCKS.map((u) => u.speciesId),
      ...SPECIES_UNLOCKS.flatMap((u) => (u.requirement.type === 'species_played' ? [u.requirement.speciesId] : [])),
      ...ENCYCLOPEDIA_ENTRIES.flatMap((e) => (e.unlockCondition.type === 'species_played' ? [e.unlockCondition.speciesId] : [])),
      ...ACHIEVEMENTS.flatMap((a) => (a.species === undefined ? [] : Array.isArray(a.species) ? a.species : [a.species])),
    ]);
    const missing = [...referenced].filter((id) => !findSpeciesBundle(id));
    expect(missing).toEqual([]);
  });

  it('gives every registered species an unlock rule', () => {
    const withRules = new Set(SPECIES_UNLOCKS.map((u) => u.speciesId));
    expect(getAllSpeciesIds().filter((id) => !withRules.has(id))).toEqual([]);
  });

  it('only unlocks species through achievements that exist', () => {
    const unknown = [
      ...SPECIES_UNLOCKS.flatMap((u) => (u.requirement.type === 'achievement' ? [u.requirement.achievementId] : [])),
      ...ENCYCLOPEDIA_ENTRIES.flatMap((e) => (e.unlockCondition.type === 'achievement' ? [e.unlockCondition.achievementId] : [])),
    ].filter((id) => !achievementIds.has(id));
    expect(unknown).toEqual([]);
  });
});

describe('challenge scenario data', () => {
  for (const scenario of SCENARIOS) {
    it(`${scenario.id} only references real species content`, () => {
      const bundle = findSpeciesBundle(scenario.speciesId);
      expect(bundle).toBeDefined();
      if (!bundle) return;

      if (scenario.backstoryType) {
        expect(bundle.backstories.map((b) => b.type)).toContain(scenario.backstoryType);
      }
      for (const { injuryId, severity } of scenario.startingInjuries ?? []) {
        expect(bundle.injuries[injuryId], `injury ${injuryId}`).toBeDefined();
        expect(bundle.injuries[injuryId].severityLevels[severity], `severity ${severity}`).toBeDefined();
      }
      for (const { parasiteId, stage } of scenario.startingParasites ?? []) {
        expect(bundle.parasites[parasiteId], `parasite ${parasiteId}`).toBeDefined();
        expect(bundle.parasites[parasiteId].stages[stage], `stage ${stage}`).toBeDefined();
      }
      if (scenario.regionOverride) {
        expect(getRegionDefinition(scenario.regionOverride)).toBeDefined();
      }
      if (scenario.winCondition.type === 'reach_region') {
        expect(getRegionDefinition(String(scenario.winCondition.target))).toBeDefined();
      }
      if (scenario.startMonth !== undefined) {
        expect(scenario.startMonth).toBeGreaterThanOrEqual(0);
        expect(scenario.startMonth).toBeLessThanOrEqual(11);
      }
    });
  }
});
