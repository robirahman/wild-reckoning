import { describe, it, expect } from 'vitest';
import { resolveChase } from '../interactions/chase';
import { resolveFight } from '../interactions/fight';
import { resolveForage } from '../interactions/forage';
import { resolveExposure } from '../interactions/exposure';
import { getTerrainProfile } from '../interactions/types';
import type { SimulationContext } from '../events/types';
import type { ChaseParams, FightParams, ForageParams, ExposureParams } from '../interactions/types';
import { createRng } from '../../engine/RandomUtils';
import { StatId } from '../../types/stats';

// ── Test Helpers ──

function makeCtx(overrides: Partial<{
  locomotion: number;
  vision: number;
  digestion: number;
  weight: number;
  hea: number;
  bodyConditionScore: number;
  season: string;
  nodeType: string;
  weatherType: string;
  injuries: number;
  seed: number;
  timeOfDay: string;
}>): SimulationContext {
  const opts = {
    locomotion: 100,
    vision: 100,
    digestion: 100,
    weight: 150,
    hea: 60,
    bodyConditionScore: 3,
    season: 'summer',
    nodeType: 'forest',
    weatherType: 'clear',
    injuries: 0,
    seed: 42,
    timeOfDay: 'day',
    ...overrides,
  };

  return {
    animal: {
      bodyState: {
        capabilities: {
          locomotion: opts.locomotion,
          vision: opts.vision,
          breathing: 100,
          digestion: opts.digestion,
        },
        parts: {},
        conditions: [],
      },
      physiologyState: {
        bodyConditionScore: opts.bodyConditionScore,
      },
      stats: {
        [StatId.HEA]: { base: opts.hea, modifiers: [] },
        [StatId.STR]: { base: 35, modifiers: [] },
        [StatId.TRA]: { base: 30, modifiers: [] },
        [StatId.ADV]: { base: 30, modifiers: [] },
        [StatId.IMM]: { base: 40, modifiers: [] },
        [StatId.CLI]: { base: 20, modifiers: [] },
        [StatId.HOM]: { base: 35, modifiers: [] },
        [StatId.NOV]: { base: 40, modifiers: [] },
        [StatId.WIS]: { base: 25, modifiers: [] },
      },
      weight: opts.weight,
      injuries: Array(opts.injuries).fill({ definitionId: 'test', currentSeverity: 0 }),
      parasites: [],
      age: 36,
      sex: 'male' as const,
    },
    time: {
      season: opts.season,
      timeOfDay: opts.timeOfDay,
      turn: 10,
      monthIndex: 6,
    },
    behavior: { foraging: 3, caution: 3, belligerence: 3, exploration: 3, sociability: 3, mating: 3 },
    config: {} as any,
    rng: createRng(opts.seed),
    currentWeather: opts.weatherType !== 'clear' ? { type: opts.weatherType, intensity: 0.7 } as any : undefined,
    currentNodeType: opts.nodeType,
  } as any;
}

const wolfParams: ChaseParams = {
  predatorSpeed: 75,
  predatorEndurance: 90,
  packBonus: 25,
  strikeHarmType: 'sharp',
  strikeTargetZone: 'hind-legs',
  strikeMagnitudeRange: [35, 70],
  strikeLabel: 'wolf bite',
};

const coyoteParams: ChaseParams = {
  predatorSpeed: 60,
  predatorEndurance: 55,
  packBonus: 8,
  strikeHarmType: 'sharp',
  strikeTargetZone: 'hind-legs',
  strikeMagnitudeRange: [20, 40],
  strikeLabel: 'coyote bite',
};

const rutFightParams: FightParams = {
  opponentStrength: 50,
  opponentWeight: 140,
  opponentWeaponType: 'blunt',
  opponentTargetZone: 'head',
  opponentDamageRange: [35, 65],
  opponentStrikeLabel: 'antler strike',
  engagementType: 'charge',
  canDisengage: false,
  mutual: true,
};

// ══════════════════════════════════════════════════
//  TERRAIN PROFILE TESTS
// ══════════════════════════════════════════════════

describe('getTerrainProfile', () => {
  it('forest has high cover and reduced visibility', () => {
    const profile = getTerrainProfile('forest', undefined, 'summer');
    expect(profile.coverDensity).toBe(0.8);
    expect(profile.visibilityMultiplier).toBe(0.6);
    expect(profile.hasWater).toBe(false);
  });

  it('plain has low cover and full visibility', () => {
    const profile = getTerrainProfile('plain', undefined, 'summer');
    expect(profile.coverDensity).toBe(0.15);
    expect(profile.visibilityMultiplier).toBe(1.0);
  });

  it('snow reduces footing', () => {
    const clear = getTerrainProfile('forest', undefined, 'winter');
    const snowy = getTerrainProfile('forest', 'snow', 'winter');
    expect(snowy.footingMultiplier).toBeLessThan(clear.footingMultiplier);
  });

  it('mountain is steep', () => {
    const profile = getTerrainProfile('mountain', undefined, 'summer');
    expect(profile.isSteep).toBe(true);
  });

  it('water node has water', () => {
    const profile = getTerrainProfile('water', undefined, 'summer');
    expect(profile.hasWater).toBe(true);
  });
});

// ══════════════════════════════════════════════════
//  CHASE RESOLVER TESTS
// ══════════════════════════════════════════════════

describe('resolveChase', () => {
  it('returns a valid ChaseResult', () => {
    const ctx = makeCtx({});
    const result = resolveChase(ctx, wolfParams);
    expect(result).toHaveProperty('escaped');
    expect(result).toHaveProperty('harmEvents');
    expect(result).toHaveProperty('caloriesCost');
    expect(typeof result.escaped).toBe('boolean');
    expect(Array.isArray(result.harmEvents)).toBe(true);
    expect(result.caloriesCost).toBeGreaterThan(0);
  });

  it('healthy deer in forest escapes wolves more often than injured deer', () => {
    let healthyEscapes = 0;
    let injuredEscapes = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const healthy = makeCtx({ locomotion: 100, seed: i });
      if (resolveChase(healthy, wolfParams).escaped) healthyEscapes++;

      const injured = makeCtx({ locomotion: 50, seed: i });
      if (resolveChase(injured, wolfParams).escaped) injuredEscapes++;
    }

    expect(healthyEscapes).toBeGreaterThan(injuredEscapes);
  });

  it('forest terrain is safer than open plain', () => {
    let forestEscapes = 0;
    let plainEscapes = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const forest = makeCtx({ nodeType: 'forest', seed: i });
      if (resolveChase(forest, wolfParams).escaped) forestEscapes++;

      const plain = makeCtx({ nodeType: 'plain', seed: i });
      if (resolveChase(plain, wolfParams).escaped) plainEscapes++;
    }

    expect(forestEscapes).toBeGreaterThan(plainEscapes);
  });

  it('snowy winter makes escape harder', () => {
    let summerEscapes = 0;
    let winterEscapes = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const summer = makeCtx({ season: 'summer', nodeType: 'plain', seed: i });
      if (resolveChase(summer, wolfParams).escaped) summerEscapes++;

      const winter = makeCtx({ season: 'winter', weatherType: 'snow', nodeType: 'plain', seed: i });
      if (resolveChase(winter, wolfParams).escaped) winterEscapes++;
    }

    expect(summerEscapes).toBeGreaterThan(winterEscapes);
  });

  it('coyotes are easier to escape than wolves', () => {
    let wolfEscapes = 0;
    let coyoteEscapes = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const ctx = makeCtx({ seed: i });
      if (resolveChase(ctx, wolfParams).escaped) wolfEscapes++;
      const ctx2 = makeCtx({ seed: i });
      if (resolveChase(ctx2, coyoteParams).escaped) coyoteEscapes++;
    }

    expect(coyoteEscapes).toBeGreaterThan(wolfEscapes);
  });

  it('failed escape produces harm events', () => {
    let totalHarm = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const ctx = makeCtx({ locomotion: 30, seed: i }); // very injured
      const result = resolveChase(ctx, wolfParams);
      if (!result.escaped) {
        totalHarm += result.harmEvents.length;
      }
    }

    expect(totalHarm).toBeGreaterThan(0);
  });

  it('mountain terrain can produce fall secondary hazard', () => {
    let falls = 0;
    const runs = 500;

    for (let i = 0; i < runs; i++) {
      const ctx = makeCtx({ nodeType: 'mountain', locomotion: 60, seed: i });
      const result = resolveChase(ctx, wolfParams);
      if (result.secondaryHazard === 'fall') falls++;
    }

    expect(falls).toBeGreaterThan(0);
  });
});

// ══════════════════════════════════════════════════
//  FIGHT RESOLVER TESTS
// ══════════════════════════════════════════════════

describe('resolveFight', () => {
  it('returns a valid FightResult', () => {
    const ctx = makeCtx({});
    const result = resolveFight(ctx, rutFightParams);
    expect(result).toHaveProperty('won');
    expect(result).toHaveProperty('harmToPlayer');
    expect(result).toHaveProperty('caloriesCost');
    expect(result).toHaveProperty('dominanceChange');
    expect(typeof result.won).toBe('boolean');
    expect(result.caloriesCost).toBeGreaterThan(0);
  });

  it('heavier deer wins rut combat more often', () => {
    let heavyWins = 0;
    let lightWins = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const heavy = makeCtx({ weight: 200, hea: 70, seed: i });
      if (resolveFight(heavy, rutFightParams).won) heavyWins++;

      const light = makeCtx({ weight: 80, hea: 40, seed: i });
      if (resolveFight(light, rutFightParams).won) lightWins++;
    }

    expect(heavyWins).toBeGreaterThan(lightWins);
  });

  it('winner has positive dominance change', () => {
    const ctx = makeCtx({ weight: 200, hea: 80, seed: 42 });
    let found = false;
    for (let i = 0; i < 100; i++) {
      const testCtx = makeCtx({ weight: 200, hea: 80, seed: i });
      const result = resolveFight(testCtx, rutFightParams);
      if (result.won) {
        expect(result.dominanceChange).toBeGreaterThan(0);
        found = true;
        break;
      }
    }
    expect(found).toBe(true);
  });

  it('loser receives harm events', () => {
    let totalHarm = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const ctx = makeCtx({ weight: 80, hea: 30, seed: i }); // weak fighter
      const result = resolveFight(ctx, rutFightParams);
      if (!result.won) {
        totalHarm += result.harmToPlayer.length;
      }
    }

    expect(totalHarm).toBeGreaterThan(0);
  });

  it('mutual combat can produce harm to winner', () => {
    let winnerHarmed = 0;
    const runs = 500;

    for (let i = 0; i < runs; i++) {
      const ctx = makeCtx({ weight: 200, hea: 80, seed: i });
      const result = resolveFight(ctx, rutFightParams);
      if (result.won && result.harmToPlayer.length > 0) winnerHarmed++;
    }

    // In mutual combat (antlers), winners occasionally take damage
    expect(winnerHarmed).toBeGreaterThan(0);
  });

  it('injuries reduce fighting effectiveness', () => {
    let healthyWins = 0;
    let injuredWins = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const healthy = makeCtx({ injuries: 0, seed: i });
      if (resolveFight(healthy, rutFightParams).won) healthyWins++;

      const injured = makeCtx({ injuries: 3, seed: i });
      if (resolveFight(injured, rutFightParams).won) injuredWins++;
    }

    expect(healthyWins).toBeGreaterThan(injuredWins);
  });
});

// ══════════════════════════════════════════════════
//  FORAGE RESOLVER TESTS
// ══════════════════════════════════════════════════

const browseParams: ForageParams = {
  foodType: 'browse',
  baseCalories: 100,
  toxicityRisk: 0,
  predationExposure: 0.05,
  humanProximity: 0,
};

const toxicFungiParams: ForageParams = {
  foodType: 'fungi',
  baseCalories: 40,
  toxicityRisk: 0.5,
  predationExposure: 0.02,
  humanProximity: 0,
  toxinMagnitudeRange: [20, 50],
};

const cropRaidParams: ForageParams = {
  foodType: 'crop',
  baseCalories: 150,
  toxicityRisk: 0,
  predationExposure: 0.08,
  humanProximity: 0.3,
};

describe('resolveForage', () => {
  it('returns a valid ForageResult', () => {
    const ctx = makeCtx({});
    const result = resolveForage(ctx, browseParams);
    expect(result).toHaveProperty('caloriesGained');
    expect(result).toHaveProperty('toxicHarm');
    expect(result).toHaveProperty('detectedByPredator');
    expect(result).toHaveProperty('detectedByHuman');
    expect(typeof result.caloriesGained).toBe('number');
    expect(Array.isArray(result.toxicHarm)).toBe('true' ? true : true);
  });

  it('gut injury reduces caloric extraction', () => {
    let healthyCalories = 0;
    let impairedCalories = 0;
    const runs = 100;

    for (let i = 0; i < runs; i++) {
      const healthy = makeCtx({ digestion: 100, seed: i });
      healthyCalories += resolveForage(healthy, browseParams).caloriesGained;

      const impaired = makeCtx({ digestion: 40, seed: i });
      impairedCalories += resolveForage(impaired, browseParams).caloriesGained;
    }

    expect(healthyCalories).toBeGreaterThan(impairedCalories);
  });

  it('locomotion impairment reduces foraging reach', () => {
    let mobileCalories = 0;
    let immobileCalories = 0;
    const runs = 100;

    for (let i = 0; i < runs; i++) {
      const mobile = makeCtx({ locomotion: 100, seed: i });
      mobileCalories += resolveForage(mobile, browseParams).caloriesGained;

      const immobile = makeCtx({ locomotion: 30, seed: i });
      immobileCalories += resolveForage(immobile, browseParams).caloriesGained;
    }

    expect(mobileCalories).toBeGreaterThan(immobileCalories);
  });

  it('high toxicity risk produces toxic harm events', () => {
    let poisoned = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const ctx = makeCtx({ seed: i });
      const result = resolveForage(ctx, toxicFungiParams);
      if (result.toxicHarm.length > 0) poisoned++;
    }

    // 50% toxicity risk should poison roughly half the time
    expect(poisoned).toBeGreaterThan(60);
    expect(poisoned).toBeLessThan(140);
  });

  it('poisoning returns negative calories', () => {
    let negativeCals = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const ctx = makeCtx({ seed: i });
      const result = resolveForage(ctx, toxicFungiParams);
      if (result.toxicHarm.length > 0 && result.caloriesGained < 0) negativeCals++;
    }

    expect(negativeCals).toBeGreaterThan(0);
  });

  it('nighttime foraging near humans reduces detection', () => {
    let dayDetections = 0;
    let nightDetections = 0;
    const runs = 500;

    for (let i = 0; i < runs; i++) {
      const day = makeCtx({ timeOfDay: 'day', seed: i });
      if (resolveForage(day, cropRaidParams).detectedByHuman) dayDetections++;

      const night = makeCtx({ timeOfDay: 'night', seed: i });
      if (resolveForage(night, cropRaidParams).detectedByHuman) nightDetections++;
    }

    expect(dayDetections).toBeGreaterThan(nightDetections);
  });

  it('forest cover reduces predator detection', () => {
    let forestDetections = 0;
    let plainDetections = 0;
    const runs = 500;

    const highExposureParams: ForageParams = {
      ...browseParams,
      predationExposure: 0.3,
    };

    for (let i = 0; i < runs; i++) {
      const forest = makeCtx({ nodeType: 'forest', seed: i });
      if (resolveForage(forest, highExposureParams).detectedByPredator) forestDetections++;

      const plain = makeCtx({ nodeType: 'plain', seed: i });
      if (resolveForage(plain, highExposureParams).detectedByPredator) plainDetections++;
    }

    expect(plainDetections).toBeGreaterThan(forestDetections);
  });
});

// ══════════════════════════════════════════════════
//  EXPOSURE RESOLVER TESTS
// ══════════════════════════════════════════════════

describe('resolveExposure', () => {
  it('returns a valid ExposureResult', () => {
    const ctx = makeCtx({});
    const result = resolveExposure(ctx, {
      type: 'cold',
      intensity: 0.5,
      shelterAvailable: false,
      shelterQuality: 0,
    });
    expect(result).toHaveProperty('harmEvents');
    expect(result).toHaveProperty('coreTemperatureShift');
    expect(result).toHaveProperty('caloriesCost');
    expect(result).toHaveProperty('shelterFound');
    expect(Array.isArray(result.harmEvents)).toBe(true);
  });

  it('higher intensity produces more harm', () => {
    let mildHarm = 0;
    let severeHarm = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const mild = makeCtx({ seed: i });
      const mildResult = resolveExposure(mild, {
        type: 'cold',
        intensity: 0.3,
        shelterAvailable: false,
        shelterQuality: 0,
      });
      mildHarm += mildResult.harmEvents.reduce((acc, h) => acc + h.magnitude, 0);

      const severe = makeCtx({ seed: i });
      const severeResult = resolveExposure(severe, {
        type: 'cold',
        intensity: 0.9,
        shelterAvailable: false,
        shelterQuality: 0,
      });
      severeHarm += severeResult.harmEvents.reduce((acc, h) => acc + h.magnitude, 0);
    }

    expect(severeHarm).toBeGreaterThan(mildHarm);
  });

  it('shelter reduces harm', () => {
    let unsheltered = 0;
    let sheltered = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const noShelter = makeCtx({ seed: i });
      const noResult = resolveExposure(noShelter, {
        type: 'cold',
        intensity: 0.7,
        shelterAvailable: false,
        shelterQuality: 0,
      });
      unsheltered += noResult.caloriesCost;

      const withShelter = makeCtx({ seed: i });
      const sResult = resolveExposure(withShelter, {
        type: 'cold',
        intensity: 0.7,
        shelterAvailable: true,
        shelterQuality: 0.8,
      });
      sheltered += sResult.caloriesCost;
    }

    expect(unsheltered).toBeGreaterThan(sheltered);
  });

  it('cold exposure produces negative temperature shift', () => {
    const ctx = makeCtx({});
    const result = resolveExposure(ctx, {
      type: 'cold',
      intensity: 0.6,
      shelterAvailable: false,
      shelterQuality: 0,
    });
    expect(result.coreTemperatureShift).toBeLessThan(0);
  });

  it('heat exposure produces positive temperature shift', () => {
    const ctx = makeCtx({});
    const result = resolveExposure(ctx, {
      type: 'heat',
      intensity: 0.6,
      shelterAvailable: false,
      shelterQuality: 0,
    });
    expect(result.coreTemperatureShift).toBeGreaterThan(0);
  });

  it('poor body condition increases cold vulnerability', () => {
    let wellFedCost = 0;
    let emacCost = 0;
    const runs = 200;

    for (let i = 0; i < runs; i++) {
      const wellFed = makeCtx({ bodyConditionScore: 5, seed: i });
      wellFedCost += resolveExposure(wellFed, {
        type: 'cold',
        intensity: 0.6,
        shelterAvailable: false,
        shelterQuality: 0,
      }).caloriesCost;

      const emaciated = makeCtx({ bodyConditionScore: 1, seed: i });
      emacCost += resolveExposure(emaciated, {
        type: 'cold',
        intensity: 0.6,
        shelterAvailable: false,
        shelterQuality: 0,
      }).caloriesCost;
    }

    expect(emacCost).toBeGreaterThan(wellFedCost);
  });
});
