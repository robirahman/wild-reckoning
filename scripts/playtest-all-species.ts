/**
 * Multi-species headless playtest.
 * Runs games for all wild species in both normal and FF modes.
 * Flagged species get 100 games; others get 10.
 */

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

import { GameAPI } from '../src/api/GameAPI';
import type { EventSummary } from '../src/api/GameAPI';

const MAX_TURNS_WEEKLY = 520;
const MAX_TURNS_DAILY = 3650;

const WILD_SPECIES = [
  'white-tailed-deer', 'african-elephant', 'chinook-salmon', 'polar-bear',
  'green-sea-turtle', 'monarch-butterfly', 'fig-wasp', 'common-octopus',
  'honeybee-worker', 'arctic-tern', 'poison-dart-frog',
];

// Species flagged for 100-game runs (lifespan or weight discrepancies)
const FLAGGED_SPECIES = new Set([
  'white-tailed-deer', 'african-elephant', 'chinook-salmon',
  'green-sea-turtle', 'common-octopus', 'polar-bear',
]);

const REAL_WORLD: Record<string, { lifespanYears: string; adultWeight: string; offspringNote: string }> = {
  'white-tailed-deer':  { lifespanYears: '3-5 avg', adultWeight: '100-200 lbs', offspringNote: '6-12 fawns lifetime, ~50% survive yr1' },
  'african-elephant':   { lifespanYears: '50-70', adultWeight: '5000-14000 lbs', offspringNote: '4-8 calves lifetime' },
  'chinook-salmon':     { lifespanYears: '3-7 (semelparous)', adultWeight: '10-50 lbs', offspringNote: '3000-5000 eggs, <1% survive' },
  'polar-bear':         { lifespanYears: '15-25', adultWeight: '330-1500 lbs', offspringNote: '5-8 cubs lifetime' },
  'green-sea-turtle':   { lifespanYears: '60-80+', adultWeight: '150-400 lbs', offspringNote: '100+ eggs/nest, <1% survive' },
  'monarch-butterfly':  { lifespanYears: '0.15-0.65 (2-8mo)', adultWeight: '~0.01 oz', offspringNote: '300-500 eggs' },
  'fig-wasp':           { lifespanYears: '0.003-0.005 (1-2d)', adultWeight: '<1 mg', offspringNote: '~100-200 eggs' },
  'common-octopus':     { lifespanYears: '1-2', adultWeight: '6-22 lbs', offspringNote: '100k-500k eggs (semelparous)' },
  'honeybee-worker':    { lifespanYears: '0.08-0.5 (6wk-6mo)', adultWeight: '~0.003 oz', offspringNote: '0 (sterile)' },
  'arctic-tern':        { lifespanYears: '15-30', adultWeight: '3-4 oz', offspringNote: '1-3 chicks/yr, 20-50 lifetime' },
  'poison-dart-frog':   { lifespanYears: '3-8', adultWeight: '0.07-0.25 oz', offspringNote: '50-200 eggs lifetime' },
};

function smartChoice(events: EventSummary[]): Array<{ eventId: string; choiceId: string }> {
  const out: Array<{ eventId: string; choiceId: string }> = [];
  for (const e of events) {
    if (e.type !== 'active' || e.choices.length === 0) continue;
    const safe = e.choices.find(c => c.style === 'default');
    out.push({ eventId: e.id, choiceId: (safe ?? e.choices[0]).id });
  }
  return out;
}

interface SpeciesResult {
  species: string;
  mode: string;
  games: number;
  avgLifespanYears: number;
  medianLifespanYears: number;
  avgFinalWeight: number;
  avgOffspringBorn: number;
  avgOffspringMatured: number;
  deathCauses: Record<string, number>;
  turnUnit: string;
}

function runSpecies(species: string, ff: boolean, count: number): SpeciesResult {
  const lifespans: number[] = [];
  const weights: number[] = [];
  const offspringBorn: number[] = [];
  const offspringMatured: number[] = [];
  const causes: Record<string, number> = {};
  let turnUnit = 'week';

  for (let i = 0; i < count; i++) {
    const game = new GameAPI();
    const sex: 'male' | 'female' = i % 2 === 0 ? 'female' : 'male';

    try {
      game.start({ species, backstory: 'wild-born', sex, difficulty: 'normal', seed: 3000 + i });
    } catch {
      try { game.start({ species, backstory: 'orphaned', sex, difficulty: 'normal', seed: 3000 + i }); }
      catch { continue; }
    }

    const config = game.rawState.speciesBundle?.config;
    turnUnit = config?.turnUnit ?? 'week';
    const maxTurns = turnUnit === 'day' ? MAX_TURNS_DAILY : MAX_TURNS_WEEKLY;
    if (ff) game.rawState.toggleFastForward();

    for (let t = 0; t < maxTurns; t++) {
      // isAlive checks phase === 'playing'; 'evolving' means animal died but lineage continues
      if (!game.isAlive) break;
      try {
        const turn = game.generateTurn();
        const choices = smartChoice(turn.events);
        for (const c of choices) { try { game.makeChoice(c.eventId, c.choiceId); } catch { /* */ } }
        game.autoChoose();
        const result = game.endTurn();
        if (result.pendingDeathRolls) {
          for (const roll of result.pendingDeathRolls) {
            if (roll.escapeOptions.length > 0) game.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
          }
        }
        game.rawState.dismissResults();
      } catch { break; }
    }

    const snap = game.getSnapshot();
    const rawState = game.rawState;
    lifespans.push(snap.turn);
    weights.push(snap.weight);

    const repro = rawState.reproduction;
    if (repro?.type === 'semelparous') {
      offspringBorn.push((repro as Record<string, unknown>).eggCount as number ?? 0);
      offspringMatured.push(repro.totalFitness ?? 0);
    } else {
      offspringBorn.push((repro as Record<string, unknown>)?.offspring
        ? ((repro as Record<string, unknown>).offspring as unknown[]).length
        : 0);
      offspringMatured.push(repro?.totalFitness ?? 0);
    }

    // 'evolving' phase means animal died but lineage continues (semelparous + lineageMode)
    const phase = rawState.phase;
    const cause = snap.causeOfDeath
      ?? rawState.animal?.causeOfDeath
      ?? (phase === 'evolving' ? 'spawned-and-died (lineage)' : 'survived');
    causes[cause] = (causes[cause] ?? 0) + 1;
    game.reset();
  }

  const turnsPerYear = turnUnit === 'day' ? 365 : turnUnit === 'month' ? 12 : 52;
  const ffMult = ff ? 12 : 1;
  const avgTurns = lifespans.reduce((a, b) => a + b, 0) / Math.max(1, lifespans.length);
  const sorted = [...lifespans].sort((a, b) => a - b);
  const medianTurns = sorted[Math.floor(sorted.length / 2)] ?? 0;

  return {
    species, mode: ff ? 'FF' : 'Normal', games: lifespans.length,
    avgLifespanYears: (avgTurns * ffMult) / turnsPerYear,
    medianLifespanYears: (medianTurns * ffMult) / turnsPerYear,
    avgFinalWeight: weights.reduce((a, b) => a + b, 0) / Math.max(1, weights.length),
    avgOffspringBorn: offspringBorn.reduce((a, b) => a + b, 0) / Math.max(1, offspringBorn.length),
    avgOffspringMatured: offspringMatured.reduce((a, b) => a + b, 0) / Math.max(1, offspringMatured.length),
    deathCauses: causes, turnUnit,
  };
}

// ── Main ──
console.log('Wild Reckoning Multi-Species Playtest (FF audit + flagged 100-game runs)\n');

const allResults: SpeciesResult[] = [];

for (const species of WILD_SPECIES) {
  const isFlagged = FLAGGED_SPECIES.has(species);
  const normalCount = isFlagged ? 100 : 10;
  const ffCount = 10;

  process.stdout.write(`${species} (${normalCount} normal, ${ffCount} FF)...`);
  const normal = runSpecies(species, false, normalCount);
  const ff = runSpecies(species, true, ffCount);
  allResults.push(normal, ff);

  const ratio = ff.avgLifespanYears / Math.max(0.001, normal.avgLifespanYears);
  console.log(` Normal: ${normal.avgLifespanYears.toFixed(2)}yr (${normal.games}g), FF: ${ff.avgLifespanYears.toFixed(2)}yr, ratio: ${ratio.toFixed(1)}x, offspring: ${normal.avgOffspringBorn.toFixed(1)}born/${normal.avgOffspringMatured.toFixed(1)}matured`);
}

// ── Summary ──
console.log('\n' + '='.repeat(130));
console.log('REAL-WORLD COMPARISON (Normal mode)');
console.log('='.repeat(130));
console.log(
  'Species'.padEnd(22) + 'N'.padEnd(5) + 'Game Life'.padEnd(11) + 'Real Life'.padEnd(18) +
  'Game Wt'.padEnd(11) + 'Real Wt'.padEnd(18) +
  'Born'.padEnd(7) + 'Matured'.padEnd(9) + 'Real Offspring'.padEnd(30) + 'FF Ratio'
);
console.log('-'.repeat(130));

for (const species of WILD_SPECIES) {
  const n = allResults.find(r => r.species === species && r.mode === 'Normal')!;
  const f = allResults.find(r => r.species === species && r.mode === 'FF')!;
  const real = REAL_WORLD[species]!;
  const ratio = f.avgLifespanYears / Math.max(0.001, n.avgLifespanYears);
  console.log(
    species.padEnd(22) + String(n.games).padEnd(5) +
    `${n.avgLifespanYears.toFixed(2)}yr`.padEnd(11) + real.lifespanYears.padEnd(18) +
    `${n.avgFinalWeight.toFixed(1)}`.padEnd(11) + real.adultWeight.padEnd(18) +
    `${n.avgOffspringBorn.toFixed(1)}`.padEnd(7) + `${n.avgOffspringMatured.toFixed(1)}`.padEnd(9) +
    real.offspringNote.slice(0, 28).padEnd(30) + `${ratio.toFixed(1)}x`
  );
}

// ── Death cause breakdown for flagged species ──
console.log('\n' + '='.repeat(80));
console.log('DEATH CAUSE BREAKDOWN (flagged species, normal mode)');
console.log('='.repeat(80));

for (const species of FLAGGED_SPECIES) {
  const r = allResults.find(r2 => r2.species === species && r2.mode === 'Normal');
  if (!r) continue;
  console.log(`\n  ${species} (${r.games} games, avg ${r.avgLifespanYears.toFixed(2)}yr):`);
  const sorted = Object.entries(r.deathCauses).sort((a, b) => b[1] - a[1]);
  for (const [cause, count] of sorted) {
    console.log(`    ${((count / r.games) * 100).toFixed(0).padStart(3)}%  ${cause}`);
  }
}

// ── Discrepancy flags ──
console.log('\n' + '='.repeat(80));
console.log('DISCREPANCY FLAGS');
console.log('='.repeat(80));

for (const species of WILD_SPECIES) {
  const n = allResults.find(r => r.species === species && r.mode === 'Normal')!;
  const f = allResults.find(r => r.species === species && r.mode === 'FF')!;
  const flags: string[] = [];
  const ratio = f.avgLifespanYears / Math.max(0.001, n.avgLifespanYears);
  if (ratio > 2) flags.push(`FF ratio ${ratio.toFixed(1)}x (target ~1x)`);
  if (ratio < 0.5) flags.push(`FF ratio ${ratio.toFixed(1)}x (FF too lethal)`);

  if (species === 'white-tailed-deer' && n.avgLifespanYears < 2) flags.push('Lifespan too short (real: 3-5yr)');
  if (species === 'african-elephant' && n.avgLifespanYears < 30) flags.push('Lifespan too short (real: 50-70yr)');
  if (species === 'polar-bear' && n.avgLifespanYears < 10) flags.push('Lifespan too short (real: 15-25yr)');
  if (species === 'arctic-tern' && n.avgLifespanYears < 10) flags.push('Lifespan too short (real: 15-30yr)');
  if (species === 'green-sea-turtle' && n.avgLifespanYears < 30) flags.push('Lifespan too short (real: 60-80yr)');
  if (species === 'poison-dart-frog' && n.avgLifespanYears < 2) flags.push('Lifespan too short (real: 3-8yr)');
  if (species === 'common-octopus' && n.avgLifespanYears > 3) flags.push('Lifespan too long (real: 1-2yr)');
  if (species === 'chinook-salmon' && n.avgLifespanYears < 1.5) flags.push('Lifespan too short (real: 3-7yr)');

  // Weight flags
  if (species === 'white-tailed-deer' && n.avgFinalWeight < 80) flags.push(`Final weight ${n.avgFinalWeight.toFixed(0)} lbs too low (real: 100-200)`);
  if (species === 'chinook-salmon' && n.avgFinalWeight > 55) flags.push(`Final weight ${n.avgFinalWeight.toFixed(0)} lbs too high (real: 10-50)`);
  if (species === 'green-sea-turtle' && n.avgFinalWeight > 450) flags.push(`Final weight ${n.avgFinalWeight.toFixed(0)} lbs too high (real: 150-400)`);

  // Offspring
  if (n.avgOffspringBorn === 0 && species !== 'honeybee-worker') flags.push('Zero offspring born (reproduction not working)');

  const topCause = Object.entries(n.deathCauses).sort((a, b) => b[1] - a[1])[0];
  if (topCause && topCause[1] / n.games > 0.5) {
    flags.push(`Single cause dominates: "${topCause[0].slice(0,40)}" at ${((topCause[1]/n.games)*100).toFixed(0)}%`);
  }
  if (n.deathCauses['survived'] && n.deathCauses['survived'] / n.games > 0.3) {
    flags.push(`${((n.deathCauses['survived']/n.games)*100).toFixed(0)}% survived max turns (immortal?)`);
  }

  if (flags.length > 0) {
    console.log(`\n  ${species}:`);
    for (const f of flags) console.log(`    - ${f}`);
  }
}
