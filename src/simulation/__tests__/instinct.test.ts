import { describe, it, expect } from 'vitest';
import { computeInstincts } from '../instinct/engine';
import type { SimulationContext } from '../events/types';
import { createRng } from '../../engine/RandomUtils';
import { StatId } from '../../types/stats';

// ── Test Helpers ──

function makeCtx(overrides: Partial<{
  locomotion: number;
  digestion: number;
  bodyConditionScore: number;
  negativeEnergyBalance: boolean;
  coreTemperatureDeviation: number;
  immunocompromised: boolean;
  season: string;
  nodeType: string;
  weatherType: string;
  cover: number;
  sex: 'male' | 'female';
  age: number;
  hasAlly: boolean;
  hasMate: boolean;
  hasFawns: boolean;
}>): SimulationContext {
  const opts = {
    locomotion: 100,
    digestion: 100,
    bodyConditionScore: 3,
    negativeEnergyBalance: false,
    coreTemperatureDeviation: 0,
    immunocompromised: false,
    season: 'summer',
    nodeType: 'forest',
    weatherType: 'clear',
    cover: 60,
    sex: 'male' as const,
    age: 36,
    hasAlly: false,
    hasMate: false,
    hasFawns: false,
    ...overrides,
  };

  const npcs: any[] = [];
  if (opts.hasAlly) npcs.push({ type: 'ally', alive: true });
  if (opts.hasMate) npcs.push({ type: 'mate', alive: true });

  const flags = new Set<string>();
  if (opts.hasFawns) flags.add('has-fawns');

  return {
    animal: {
      bodyState: {
        capabilities: {
          locomotion: opts.locomotion,
          digestion: opts.digestion,
          breathing: 100,
          vision: 100,
        },
        parts: {},
        conditions: [],
      },
      physiologyState: {
        bodyConditionScore: opts.bodyConditionScore,
        negativeEnergyBalance: opts.negativeEnergyBalance,
        coreTemperatureDeviation: opts.coreTemperatureDeviation,
        immunocompromised: opts.immunocompromised,
        avgCaloricBalance: 0,
      },
      stats: {
        [StatId.HEA]: { base: 60, modifiers: [] },
        [StatId.STR]: { base: 35, modifiers: [] },
        [StatId.TRA]: { base: 30, modifiers: [] },
        [StatId.ADV]: { base: 30, modifiers: [] },
        [StatId.IMM]: { base: 40, modifiers: [] },
        [StatId.CLI]: { base: 20, modifiers: [] },
        [StatId.HOM]: { base: 35, modifiers: [] },
        [StatId.NOV]: { base: 40, modifiers: [] },
        [StatId.WIS]: { base: 25, modifiers: [] },
      },
      weight: 150,
      injuries: [],
      parasites: [],
      age: opts.age,
      sex: opts.sex,
      flags,
    },
    time: {
      season: opts.season,
      timeOfDay: 'day',
      turn: 10,
      monthIndex: 6,
    },
    behavior: { foraging: 3, caution: 3, belligerence: 3, exploration: 3, sociability: 3, mating: 3 },
    config: {} as any,
    rng: createRng(42),
    currentWeather: opts.weatherType !== 'clear' ? { type: opts.weatherType, intensity: 0.7 } as any : undefined,
    currentNodeType: opts.nodeType,
    currentNodeResources: { food: 50, water: 50, cover: opts.cover },
    npcs,
  } as any;
}

// ══════════════════════════════════════════════════
//  INSTINCT ENGINE TESTS
// ══════════════════════════════════════════════════

describe('computeInstincts', () => {
  it('returns empty array for healthy animal in safe conditions', () => {
    const ctx = makeCtx({});
    const nudges = computeInstincts(ctx);
    expect(nudges.length).toBe(0);
  });

  it('returns at most 3 nudges', () => {
    // Create worst-case scenario with many triggers
    const ctx = makeCtx({
      locomotion: 30,
      bodyConditionScore: 1,
      negativeEnergyBalance: true,
      coreTemperatureDeviation: -6,
      immunocompromised: true,
      nodeType: 'plain',
      weatherType: 'blizzard',
    });
    const nudges = computeInstincts(ctx);
    expect(nudges.length).toBeLessThanOrEqual(3);
  });

  it('high priority nudges appear before low priority', () => {
    const ctx = makeCtx({
      locomotion: 30,
      bodyConditionScore: 1,
      negativeEnergyBalance: true,
      nodeType: 'plain',
    });
    const nudges = computeInstincts(ctx);
    expect(nudges.length).toBeGreaterThan(0);
    // Verify sorted by priority
    for (let i = 1; i < nudges.length; i++) {
      const order = { high: 0, medium: 1, low: 2 };
      expect(order[nudges[i].priority]).toBeGreaterThanOrEqual(order[nudges[i - 1].priority]);
    }
  });

  // ── Terrain nudges ──

  it('triggers "Exposed" on open plain', () => {
    const ctx = makeCtx({ nodeType: 'plain' });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'exposed')).toBe(true);
  });

  it('does not trigger "Exposed" in forest', () => {
    const ctx = makeCtx({ nodeType: 'forest' });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'exposed')).toBe(false);
  });

  it('triggers "Precarious" on mountain with injured leg', () => {
    const ctx = makeCtx({ nodeType: 'mountain', locomotion: 60 });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'precarious')).toBe(true);
  });

  // ── Hunger nudges ──

  it('triggers "Starving" at BCS 1', () => {
    const ctx = makeCtx({ bodyConditionScore: 1, negativeEnergyBalance: true });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'starving')).toBe(true);
    const starving = nudges.find(n => n.id === 'starving')!;
    expect(starving.priority).toBe('high');
    expect(starving.suggestedBehavior).toBe('foraging');
  });

  it('triggers "Hunger Drive" at BCS 2 with negative balance', () => {
    const ctx = makeCtx({ bodyConditionScore: 2, negativeEnergyBalance: true });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'hunger-drive')).toBe(true);
  });

  it('does not trigger hunger at BCS 3', () => {
    const ctx = makeCtx({ bodyConditionScore: 3, negativeEnergyBalance: false });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'starving' || n.id === 'hunger-drive')).toBe(false);
  });

  // ── Cold nudges ──

  it('triggers "Freezing" at severe hypothermia', () => {
    const ctx = makeCtx({ coreTemperatureDeviation: -5 });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'freezing')).toBe(true);
    expect(nudges.find(n => n.id === 'freezing')!.priority).toBe('high');
  });

  it('triggers "Chilled" at mild hypothermia', () => {
    const ctx = makeCtx({ coreTemperatureDeviation: -3 });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'chilled')).toBe(true);
  });

  // ── Immune nudge ──

  it('triggers "Sickly" when immunocompromised', () => {
    const ctx = makeCtx({ immunocompromised: true });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'sickly')).toBe(true);
  });

  // ── Injury nudges ──

  it('triggers "Crippled" at severe locomotion impairment', () => {
    const ctx = makeCtx({ locomotion: 40 });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'crippled')).toBe(true);
    expect(nudges.find(n => n.id === 'crippled')!.priority).toBe('high');
  });

  it('triggers "Limping" at moderate locomotion impairment', () => {
    const ctx = makeCtx({ locomotion: 70 });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'limping')).toBe(true);
  });

  // ── Weather nudges ──

  it('triggers "Storm Dread" during blizzard', () => {
    const ctx = makeCtx({ weatherType: 'blizzard' });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'storm-dread')).toBe(true);
  });

  it('triggers "Heat Lethargy" during heat wave', () => {
    const ctx = makeCtx({ weatherType: 'heat_wave' });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'heat-lethargy')).toBe(true);
  });

  // ── Reproductive nudges ──

  it('triggers "Rut Fever" for adult males in autumn', () => {
    const ctx = makeCtx({ sex: 'male', season: 'autumn', age: 36 });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'rut-fever')).toBe(true);
  });

  it('does not trigger "Rut Fever" for females', () => {
    const ctx = makeCtx({ sex: 'female', season: 'autumn', age: 36 });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'rut-fever')).toBe(false);
  });

  it('does not trigger "Rut Fever" for young males', () => {
    const ctx = makeCtx({ sex: 'male', season: 'autumn', age: 12 });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'rut-fever')).toBe(false);
  });

  // ── Social nudges ──

  it('triggers "Herd Anxiety" for lone female', () => {
    const ctx = makeCtx({ sex: 'female', hasAlly: false, hasMate: false });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'herd-anxiety')).toBe(true);
  });

  it('does not trigger "Herd Anxiety" for female with ally', () => {
    const ctx = makeCtx({ sex: 'female', hasAlly: true });
    const nudges = computeInstincts(ctx);
    expect(nudges.some(n => n.id === 'herd-anxiety')).toBe(false);
  });
});
