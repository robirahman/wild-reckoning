import type { SimulationContext } from '../types';
import type { Situation, SituationType, NarrativeHook } from './types';
import { getTerrainProfile } from '../../interactions/types';
import { StatId, computeEffectiveValue } from '../../../types/stats';

// ══════════════════════════════════════════════════
//  SITUATION DETECTOR
// ══════════════════════════════════════════════════
//
// Runs once per turn. Scans the full world state and produces a
// compact Situation[] representing "what is going on right now."
// This replaces the ~50 separate isPlausible() checks.
//

/**
 * Detect all active situations from the current simulation context.
 * Returns an array of Situation objects that templates can match against.
 */
export function detectSituations(ctx: SimulationContext): Situation[] {
  const situations: Situation[] = [];

  detectEntitySituations(ctx, situations);
  detectTerrainSituations(ctx, situations);
  detectWeatherSituations(ctx, situations);
  detectBodySituations(ctx, situations);
  detectPhysiologySituations(ctx, situations);
  detectSeasonalSituations(ctx, situations);
  detectMemorySituations(ctx, situations);
  detectActivitySituations(ctx, situations);

  return situations;
}

// ── Entity Detection ──

function detectEntitySituations(ctx: SimulationContext, out: Situation[]): void {
  if (!ctx.npcs || !ctx.currentNodeId) return;

  for (const npc of ctx.npcs) {
    if (!npc.alive) continue;

    const sameNode = npc.currentNodeId === ctx.currentNodeId;
    if (!sameNode) continue;

    const behavior = ctx.npcBehaviorStates?.[npc.id];

    if (npc.type === 'predator') {
      out.push({
        type: 'predator-nearby',
        source: npc.speciesLabel.toLowerCase(),
        weight: behavior?.intent === 'hunting' ? 0.8 : 0.15,
        params: {
          npcId: npc.id,
          speciesLabel: npc.speciesLabel,
          intent: behavior?.intent ?? 'patrolling',
          hunger: behavior?.hunger ?? 50,
          health: behavior?.health ?? 100,
          relationship: npc.relationship,
          encounters: npc.encounters,
          packSize: countPackMembers(ctx, npc.speciesLabel),
        },
      });
    } else if (npc.type === 'rival' || npc.type === 'ally' || npc.type === 'mate' || npc.type === 'offspring') {
      out.push({
        type: 'conspecific-nearby',
        source: npc.type,
        weight: 0.5,
        params: {
          npcId: npc.id,
          npcType: npc.type,
          speciesLabel: npc.speciesLabel,
          relationship: npc.relationship,
          rank: npc.rank,
          sex: inferNpcSex(npc),
        },
      });
    }
  }
}

function countPackMembers(ctx: SimulationContext, speciesLabel: string): number {
  if (!ctx.npcs || !ctx.currentNodeId) return 1;
  return ctx.npcs.filter(
    n => n.alive && n.currentNodeId === ctx.currentNodeId &&
      n.speciesLabel.toLowerCase() === speciesLabel.toLowerCase()
  ).length;
}

function inferNpcSex(npc: { speciesLabel: string }): string | undefined {
  const label = npc.speciesLabel.toLowerCase();
  if (label.includes('buck') || label.includes('bull')) return 'male';
  if (label.includes('doe') || label.includes('cow') || label.includes('fawn')) return 'female';
  return undefined;
}

// ── Terrain Detection ──

function detectTerrainSituations(ctx: SimulationContext, out: Situation[]): void {
  const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);

  if (terrain.hasWater) {
    out.push({
      type: 'terrain-feature',
      source: 'water',
      weight: 0.6,
      params: { footingMultiplier: terrain.footingMultiplier, coverDensity: terrain.coverDensity },
    });
  }

  if (terrain.isSteep) {
    out.push({
      type: 'terrain-feature',
      source: 'steep',
      weight: 0.5,
      params: { footingMultiplier: terrain.footingMultiplier },
    });
  }

  if (terrain.coverDensity < 0.25) {
    out.push({
      type: 'terrain-feature',
      source: 'exposed',
      weight: 0.4,
      params: { coverDensity: terrain.coverDensity, visibilityMultiplier: terrain.visibilityMultiplier },
    });
  }

  if (terrain.coverDensity >= 0.7) {
    out.push({
      type: 'terrain-feature',
      source: 'dense-cover',
      weight: 0.3,
      params: { coverDensity: terrain.coverDensity },
    });
  }

  if (ctx.currentNodeType === 'road' || ctx.currentNodeType === 'crossing') {
    out.push({
      type: 'terrain-feature',
      source: 'road',
      weight: 0.4,
      params: {},
    });
  }
}

// ── Weather Detection ──

function detectWeatherSituations(ctx: SimulationContext, out: Situation[]): void {
  const w = ctx.currentWeather;
  if (!w) return;

  const isHarsh = w.type === 'blizzard' || w.type === 'heavy_rain' || w.type === 'heat_wave' || w.type === 'drought_conditions';
  const isSnow = w.type === 'snow' || w.type === 'blizzard';

  if (isHarsh) {
    out.push({
      type: 'weather-condition',
      source: w.type,
      weight: 0.6 + w.intensity * 0.3,
      params: {
        weatherType: w.type,
        intensity: w.intensity,
        windSpeed: w.windSpeed,
      },
    });
  } else if (w.type !== 'clear') {
    out.push({
      type: 'weather-condition',
      source: w.type,
      weight: 0.2 + w.intensity * 0.15,
      params: {
        weatherType: w.type,
        intensity: w.intensity,
      },
    });
  }

  // Snow depth as separate situation (affects locomotion, predator advantage)
  if (isSnow && ctx.time.season === 'winter') {
    out.push({
      type: 'weather-condition',
      source: 'deep-snow',
      weight: 0.4,
      params: { intensity: w.intensity },
    });
  }
}

// ── Body State Detection ──

function detectBodySituations(ctx: SimulationContext, out: Situation[]): void {
  const bs = ctx.animal.bodyState;
  if (!bs) return;

  // Capability impairments
  const capabilities = ['locomotion', 'vision', 'breathing', 'digestion'] as const;
  for (const cap of capabilities) {
    const value = bs.capabilities[cap] ?? 100;
    if (value < 80) {
      const severity = value < 30 ? 'critical' : value < 50 ? 'severe' : value < 70 ? 'moderate' : 'mild';
      out.push({
        type: 'body-impairment',
        source: cap,
        weight: (100 - value) / 100,
        params: { capability: value, severity },
      });
    }
  }

  // Open wounds (blood scent)
  const openWounds = bs.conditions.filter(
    c => (c.type === 'laceration' || c.type === 'puncture') && c.infectionLevel < 30
  );
  if (openWounds.length > 0) {
    out.push({
      type: 'body-impairment',
      source: 'open-wound',
      weight: Math.min(1, openWounds.length * 0.3),
      params: { count: openWounds.length, woundIds: openWounds.map(w => w.id) },
    });
  }

  // Infected wounds
  const infectedConditions = bs.conditions.filter(c => c.infectionLevel >= 30);
  if (infectedConditions.length > 0) {
    out.push({
      type: 'body-impairment',
      source: 'infection',
      weight: Math.min(1, infectedConditions.length * 0.35),
      params: { count: infectedConditions.length },
    });
  }

  // Active conditions by phase (wound progression)
  const progressions = bs.conditionProgressions;
  if (progressions) {
    const phases = Object.values(progressions);
    const infected = phases.filter(p => p.phase === 'infected');
    const septic = phases.filter(p => p.phase === 'septic');

    if (septic.length > 0) {
      out.push({
        type: 'body-impairment',
        source: 'sepsis',
        weight: 0.9,
        params: { count: septic.length },
      });
    } else if (infected.length > 0) {
      out.push({
        type: 'body-impairment',
        source: 'wound-infected-phase',
        weight: 0.6,
        params: { count: infected.length },
      });
    }

    // Fever from condition cascades
    const maxFever = Math.max(0, ...phases.map(p => p.feverLevel));
    if (maxFever > 1) {
      out.push({
        type: 'body-impairment',
        source: 'fever',
        weight: Math.min(1, maxFever / 5),
        params: { feverLevel: maxFever },
      });
    }
  }

  // Fractures
  const fractures = bs.conditions.filter(c => c.type === 'fracture');
  if (fractures.length > 0) {
    out.push({
      type: 'body-impairment',
      source: 'fracture',
      weight: Math.min(1, fractures.length * 0.4),
      params: { count: fractures.length, bodyPartIds: fractures.map(f => f.bodyPartId) },
    });
  }
}

// ── Physiology Detection ──

function detectPhysiologySituations(ctx: SimulationContext, out: Situation[]): void {
  const ps = ctx.animal.physiologyState;
  if (!ps) return;

  // Body condition score
  if (ps.bodyConditionScore <= 2) {
    const severity = ps.bodyConditionScore <= 1 ? 'starving' : 'hungry';
    out.push({
      type: 'physiological-state',
      source: 'hunger',
      weight: severity === 'starving' ? 0.9 : 0.5,
      params: { bcs: ps.bodyConditionScore, severity, negativeBalance: ps.negativeEnergyBalance },
    });
  }

  // Thermoregulation
  if (ps.coreTemperatureDeviation <= -2) {
    const severity = ps.coreTemperatureDeviation <= -4 ? 'severe' : 'moderate';
    out.push({
      type: 'physiological-state',
      source: 'hypothermia',
      weight: severity === 'severe' ? 0.8 : 0.4,
      params: { deviation: ps.coreTemperatureDeviation, severity },
    });
  } else if (ps.coreTemperatureDeviation >= 3) {
    out.push({
      type: 'physiological-state',
      source: 'hyperthermia',
      weight: 0.5,
      params: { deviation: ps.coreTemperatureDeviation },
    });
  }

  // Immune state
  if (ps.immunocompromised) {
    out.push({
      type: 'physiological-state',
      source: 'immunocompromised',
      weight: 0.7,
      params: { capacity: ps.immuneCapacity, load: ps.immuneLoad },
    });
  }

  // Fever (from physiology, complements the condition-cascade fever)
  if (ps.feverLevel > 2) {
    out.push({
      type: 'physiological-state',
      source: 'fever',
      weight: Math.min(1, ps.feverLevel / 6),
      params: { feverLevel: ps.feverLevel },
    });
  }
}

// ── Seasonal Phase Detection ──

function detectSeasonalSituations(ctx: SimulationContext, out: Situation[]): void {
  const { season, month, timeOfDay } = ctx.time;
  const sex = ctx.animal.sex;
  const age = ctx.animal.age;

  // Rut season (autumn, males)
  if (season === 'autumn' && sex === 'male' && age >= 18) {
    out.push({
      type: 'seasonal-phase',
      source: 'rut',
      weight: 0.7,
      params: { sex, age },
    });
  }

  // Fawning season (spring/summer, females)
  if ((season === 'spring' || season === 'summer') && sex === 'female' && age >= 12) {
    out.push({
      type: 'seasonal-phase',
      source: 'fawning',
      weight: 0.5,
      params: { sex, age },
    });
  }

  // Migration pressure (late autumn / winter)
  if ((season === 'autumn' && (month === 'November' || month === 'December')) || season === 'winter') {
    out.push({
      type: 'seasonal-phase',
      source: 'winter-migration',
      weight: season === 'winter' ? 0.6 : 0.3,
      params: { season },
    });
  }

  // Antler cycle (males)
  if (sex === 'male' && age >= 12) {
    if (season === 'spring' || (season === 'summer' && month === 'June')) {
      out.push({
        type: 'seasonal-phase',
        source: 'antler-velvet',
        weight: 0.3,
        params: {},
      });
    }
  }

  // Hunting season (autumn)
  if (season === 'autumn') {
    out.push({
      type: 'seasonal-phase',
      source: 'hunting-season',
      weight: 0.5,
      params: {},
    });
  }

  // Twilight (dawn/dusk — peak predator activity)
  if (timeOfDay === 'dawn' || timeOfDay === 'dusk') {
    out.push({
      type: 'seasonal-phase',
      source: 'twilight',
      weight: 0.3,
      params: { timeOfDay },
    });
  }

  // Insect season (summer)
  if (season === 'summer') {
    out.push({
      type: 'seasonal-phase',
      source: 'insect-season',
      weight: 0.3,
      params: {},
    });
  }
}

// ── Memory Detection ──

function detectMemorySituations(ctx: SimulationContext, out: Situation[]): void {
  const mem = ctx.worldMemory;
  if (!mem) return;

  // Node danger memory
  const nodeId = ctx.currentNodeId ?? '';
  const nodeMem = mem.nodeMemory[nodeId];
  if (nodeMem) {
    if (nodeMem.perceivedDanger > 50) {
      out.push({
        type: 'memory-trigger',
        source: 'dangerous-node',
        weight: nodeMem.perceivedDanger / 100,
        params: { perceivedDanger: nodeMem.perceivedDanger, nodeId },
      });
    }

    if (nodeMem.killCount > 0 && (ctx.time.turn - nodeMem.lastKillTurn) < 6) {
      out.push({
        type: 'memory-trigger',
        source: 'recent-kill-site',
        weight: 0.5,
        params: { killCount: nodeMem.killCount, turnsSinceKill: ctx.time.turn - nodeMem.lastKillTurn },
      });
    }

    // Unfamiliar ground
    if (nodeMem.turnsOccupied <= 1) {
      out.push({
        type: 'memory-trigger',
        source: 'unfamiliar-ground',
        weight: 0.3,
        params: {},
      });
    }
  }

  // Threat persistence (e.g., wolves have been tracking you)
  for (const [source, threat] of Object.entries(mem.threatMap)) {
    if (threat.recentEncounters >= 2 && (ctx.time.turn - threat.lastEncounterTurn) < 4) {
      out.push({
        type: 'memory-trigger',
        source: `persistent-threat:${source}`,
        weight: 0.6,
        params: {
          threatSource: source,
          recentEncounters: threat.recentEncounters,
          averageSeverity: threat.averageSeverity,
        },
      });
    }
  }

  // Rehabilitation intro (first few turns)
  if (ctx.time.turn <= 3 && ctx.animal.backstory?.id === 'rehabilitated') {
    out.push({
      type: 'memory-trigger',
      source: 'rehabilitation-intro',
      weight: 1.0,
      params: { turn: ctx.time.turn },
    });
  }
}

// ── Activity Exposure Detection ──

function detectActivitySituations(ctx: SimulationContext, out: Situation[]): void {
  // Infer current activity from behavioral settings
  const { foraging, exploration, belligerence, sociability, mating } = ctx.behavior;

  // High foraging = exposed while feeding
  if (foraging >= 3) {
    const terrain = getTerrainProfile(ctx.currentNodeType, ctx.currentWeather?.type, ctx.time.season);
    out.push({
      type: 'activity-exposure',
      source: 'foraging',
      weight: 0.3 + (foraging - 3) * 0.15,
      params: {
        intensity: foraging,
        exposure: 1 - terrain.coverDensity,
      },
    });
  }

  // High exploration = travel exposure
  if (exploration >= 3) {
    out.push({
      type: 'activity-exposure',
      source: 'traveling',
      weight: 0.2 + (exploration - 3) * 0.1,
      params: { intensity: exploration },
    });
  }

  // High belligerence = confrontation seeking
  if (belligerence >= 3) {
    out.push({
      type: 'activity-exposure',
      source: 'aggressive',
      weight: 0.2 + (belligerence - 3) * 0.15,
      params: { intensity: belligerence },
    });
  }

  // High mating = mating activity
  if (mating >= 3) {
    out.push({
      type: 'activity-exposure',
      source: 'mating',
      weight: 0.2 + (mating - 3) * 0.1,
      params: { intensity: mating },
    });
  }

  // High sociability = social seeking
  if (sociability >= 3) {
    out.push({
      type: 'activity-exposure',
      source: 'socializing',
      weight: 0.2 + (sociability - 3) * 0.1,
      params: { intensity: sociability },
    });
  }
}
