/**
 * Run 100 headless playthroughs of Wild Reckoning and collect statistics.
 * Usage: npx tsx scripts/simulate100.ts
 */

// Polyfill localStorage for Node (force override — Node 25 has a broken built-in)
{
  const store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
}

import { GameAPI } from '../src/api/GameAPI';
import type { EventSummary, GameSnapshot, RunSummary } from '../src/api/GameAPI';

const NUM_RUNS = 100;
const MAX_TURNS = 500;
const SEED_BASE = 2000; // Different seed range from the reviewer's 1000-1099

interface RunRecord {
  seed: number;
  sex: 'male' | 'female';
  turnsLived: number;
  ageMonths: number;
  causeOfDeath: string;
  fitness: number;
  grade: string;
  energyHistory: number[];
  templateBugSeen: boolean;
  hunterEncounters: number;
  wolfEncounters: number;
  predatorEncounters: number;
  territoryDeaths: number;
  nodesExplored: number;
  maxWeight: number;
  minWeight: number;
  matingEvents: number;
  energyAtTurn20: number;
  energyAtTurn50: number;
  movementBlocked: boolean; // energy < 10 at turn 20+
  narrativeSamples: string[]; // first 3 event narratives for quality review
}

function runOne(seed: number, sex: 'male' | 'female'): RunRecord {
  const game = new GameAPI();
  game.start({
    species: 'white-tailed-deer',
    backstory: 'wild-born',
    sex,
    difficulty: 'normal',
    seed,
  });

  const energyHistory: number[] = [];
  let templateBugSeen = false;
  let hunterEncounters = 0;
  let wolfEncounters = 0;
  let predatorEncounters = 0;
  let maxWeight = 0;
  let minWeight = 9999;
  let matingEvents = 0;
  let movementBlocked = false;
  const narrativeSamples: string[] = [];

  for (let t = 0; t < MAX_TURNS; t++) {
    if (!game.isAlive) break;

    let turnInfo;
    try {
      turnInfo = game.generateTurn();
    } catch (e: any) {
      // Some seeds may hit edge cases
      console.error(`  Seed ${seed} turn ${t}: generateTurn error: ${e.message}`);
      break;
    }

    const snap = game.getSnapshot();
    energyHistory.push(snap.energy);
    if (snap.weight > maxWeight) maxWeight = snap.weight;
    if (snap.weight < minWeight) minWeight = snap.weight;

    if (t >= 20 && snap.energy < 10) movementBlocked = true;

    // Collect narrative samples from first 3 turns
    if (narrativeSamples.length < 5) {
      for (const ev of turnInfo.events) {
        if (narrativeSamples.length < 5) {
          narrativeSamples.push(`[T${turnInfo.turn}] ${ev.narrative.slice(0, 200)}`);
        }
      }
    }

    // Check for template bugs and event types
    for (const ev of turnInfo.events) {
      if (ev.narrative.includes('{{species}}') || ev.narrative.includes('{{')) {
        templateBugSeen = true;
      }
      if (ev.tags.includes('predator')) {
        predatorEncounters++;
        if (ev.narrative.toLowerCase().includes('hunter') || ev.narrative.toLowerCase().includes('rifle') || ev.narrative.toLowerCase().includes('gunshot') || ev.tags.includes('human')) {
          hunterEncounters++;
        } else if (ev.narrative.toLowerCase().includes('wolf') || ev.narrative.toLowerCase().includes('wolves')) {
          wolfEncounters++;
        }
      }
      if (ev.tags.includes('mating') || ev.tags.includes('reproduction') || ev.category === 'reproduction') {
        matingEvents++;
      }
    }

    // Auto-choose (pick first option for every event)
    game.autoChoose();

    try {
      const result = game.endTurn();
      // Auto-resolve death rolls
      if (result.pendingDeathRolls) {
        for (const roll of result.pendingDeathRolls) {
          if (roll.escapeOptions.length > 0) {
            game.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
          }
        }
      }
    } catch (e: any) {
      console.error(`  Seed ${seed} turn ${t}: endTurn error: ${e.message}`);
      break;
    }

    // Dismiss results
    try {
      (game as any)._store.setState({ showingResults: false, turnResult: null });
    } catch {}
  }

  // Get summary
  let summary: RunSummary;
  try {
    summary = game.getRunSummary();
  } catch {
    const snap = game.getSnapshot();
    summary = {
      speciesName: 'White-tailed Deer',
      sex,
      turnsLived: snap.turn,
      ageMonths: snap.age,
      causeOfDeath: snap.causeOfDeath || 'survived',
      totalFitness: 0,
      grade: 'F',
      lifetimeStats: {},
      timeline: [],
    };
  }

  const snap = game.getSnapshot();

  return {
    seed,
    sex,
    turnsLived: summary.turnsLived,
    ageMonths: summary.ageMonths,
    causeOfDeath: summary.causeOfDeath || 'survived to max turns',
    fitness: summary.totalFitness,
    grade: summary.grade,
    energyHistory,
    templateBugSeen,
    hunterEncounters,
    wolfEncounters,
    predatorEncounters,
    territoryDeaths: 0, // will tag below
    nodesExplored: snap.flags.filter(f => f.startsWith('explored-')).length || 1,
    maxWeight,
    minWeight,
    matingEvents,
    energyAtTurn20: energyHistory[19] ?? -1,
    energyAtTurn50: energyHistory[49] ?? -1,
    movementBlocked,
    narrativeSamples,
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log(`Running ${NUM_RUNS} simulated playthroughs (seeds ${SEED_BASE}-${SEED_BASE + NUM_RUNS - 1})...\n`);

const results: RunRecord[] = [];

for (let i = 0; i < NUM_RUNS; i++) {
  const seed = SEED_BASE + i;
  const sex = i % 2 === 0 ? 'male' as const : 'female' as const;

  if (i % 10 === 0) process.stdout.write(`  Running ${i+1}-${Math.min(i+10, NUM_RUNS)}...`);

  try {
    const record = runOne(seed, sex);

    // Tag territory deaths
    if (record.causeOfDeath.toLowerCase().includes('territory') || record.causeOfDeath.toLowerCase().includes('intruder')) {
      record.territoryDeaths = 1;
    }

    results.push(record);
  } catch (e: any) {
    console.error(`  FATAL: Seed ${seed} crashed: ${e.message}`);
  }

  if ((i + 1) % 10 === 0) console.log(` done`);
}

// ── Analysis ──────────────────────────────────────────────────────────────────

console.log(`\n${'='.repeat(70)}`);
console.log('WILD RECKONING — 100-PLAYTHROUGH SIMULATION ANALYSIS');
console.log('='.repeat(70));

const n = results.length;
const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
const median = (arr: number[]) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// Lifespan
const turns = results.map(r => r.turnsLived);
const ages = results.map(r => r.ageMonths);
console.log(`\n## Lifespan`);
console.log(`  Average lifespan: ${avg(turns).toFixed(0)} turns / ${(avg(ages)/12).toFixed(1)} years`);
console.log(`  Median lifespan:  ${median(turns)} turns / ${(median(ages)/12).toFixed(1)} years`);
console.log(`  Range: ${Math.min(...turns)}-${Math.max(...turns)} turns`);

// Fitness & Grades
const fitnesses = results.map(r => r.fitness);
const maleFitness = results.filter(r => r.sex === 'male').map(r => r.fitness);
const femaleFitness = results.filter(r => r.sex === 'female').map(r => r.fitness);
const gradeCount: Record<string, number> = {};
for (const r of results) gradeCount[r.grade] = (gradeCount[r.grade] || 0) + 1;

console.log(`\n## Fitness & Grades`);
console.log(`  Average fitness: ${avg(fitnesses).toFixed(1)}`);
console.log(`  Male avg fitness: ${maleFitness.length > 0 ? avg(maleFitness).toFixed(1) : 'N/A'}`);
console.log(`  Female avg fitness: ${femaleFitness.length > 0 ? avg(femaleFitness).toFixed(1) : 'N/A'}`);
console.log(`  Grade distribution: ${Object.entries(gradeCount).sort((a,b) => b[1]-a[1]).map(([g,c]) => `${g}:${c}%`).join(', ')}`);

// Energy bug
const energyAt20 = results.filter(r => r.energyAtTurn20 >= 0).map(r => r.energyAtTurn20);
const energyAt50 = results.filter(r => r.energyAtTurn50 >= 0).map(r => r.energyAtTurn50);
const blocked = results.filter(r => r.movementBlocked).length;

console.log(`\n## Energy System (Bug #2)`);
console.log(`  Avg energy at turn 20: ${energyAt20.length > 0 ? avg(energyAt20).toFixed(1) : 'N/A'}`);
console.log(`  Avg energy at turn 50: ${energyAt50.length > 0 ? avg(energyAt50).toFixed(1) : 'N/A'}`);
console.log(`  Runs with movement blocked (energy<10 after T20): ${blocked}/${n} (${(blocked/n*100).toFixed(0)}%)`);

// Cause of death
const deathCauses: Record<string, number> = {};
for (const r of results) {
  let cause = r.causeOfDeath;
  // Normalize causes
  if (cause.toLowerCase().includes('territory') || cause.toLowerCase().includes('intruder')) cause = 'Killed defending territory';
  else if (cause.toLowerCase().includes('starvation')) cause = 'Starvation';
  else if (cause.toLowerCase().includes('wolf') || cause.toLowerCase().includes('wolves')) cause = 'Killed by wolf';
  else if (cause.toLowerCase().includes('tick')) cause = 'Tick complications';
  else if (cause.toLowerCase().includes('hunter') || cause.toLowerCase().includes('shot')) cause = 'Shot by hunter';
  else if (cause.toLowerCase().includes('old age')) cause = 'Old age';
  else if (cause.toLowerCase().includes('systemic') || cause.toLowerCase().includes('health')) cause = 'Systemic failure';
  else if (cause.toLowerCase().includes('sepsis')) cause = 'Sepsis';
  else if (cause.toLowerCase().includes('meningeal') || cause.toLowerCase().includes('worm') || cause.toLowerCase().includes('brainworm')) cause = 'Meningeal worm';
  else if (cause.toLowerCase().includes('survived')) cause = 'Survived to max turns';

  deathCauses[cause] = (deathCauses[cause] || 0) + 1;
}

console.log(`\n## Cause of Death`);
for (const [cause, count] of Object.entries(deathCauses).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cause}: ${count} (${(count/n*100).toFixed(0)}%)`);
}

// Encounters
console.log(`\n## Encounters`);
console.log(`  Avg predator encounters/run: ${avg(results.map(r => r.predatorEncounters)).toFixed(1)}`);
console.log(`  Avg wolf encounters/run: ${avg(results.map(r => r.wolfEncounters)).toFixed(1)}`);
console.log(`  Avg hunter encounters/run: ${avg(results.map(r => r.hunterEncounters)).toFixed(1)}`);
console.log(`  Runs with any hunter encounter: ${results.filter(r => r.hunterEncounters > 0).length}/${n} (${(results.filter(r => r.hunterEncounters > 0).length/n*100).toFixed(0)}%)`);
console.log(`  Avg mating events/run: ${avg(results.map(r => r.matingEvents)).toFixed(1)}`);

// Template bugs
const templateBugs = results.filter(r => r.templateBugSeen).length;
console.log(`\n## Template Bugs`);
console.log(`  Runs with {{variable}} template bugs: ${templateBugs}/${n} (${(templateBugs/n*100).toFixed(0)}%)`);

// Weight
console.log(`\n## Weight`);
console.log(`  Avg max weight: ${avg(results.map(r => r.maxWeight)).toFixed(1)} lbs`);
console.log(`  Avg min weight: ${avg(results.map(r => r.minWeight)).toFixed(1)} lbs`);

// Exploration
console.log(`\n## Exploration`);
console.log(`  Avg nodes explored: ${avg(results.map(r => r.nodesExplored)).toFixed(1)}`);

// Narrative samples
console.log(`\n## Narrative Samples (first 10 runs)`);
for (let i = 0; i < Math.min(10, results.length); i++) {
  const r = results[i];
  console.log(`\n  --- Seed ${r.seed} (${r.sex}, lived ${r.turnsLived} turns, grade ${r.grade}) ---`);
  for (const s of r.narrativeSamples.slice(0, 2)) {
    console.log(`  ${s}`);
  }
}

// Summary comparison with reviewer's data
console.log(`\n${'='.repeat(70)}`);
console.log('COMPARISON WITH PLAYTEST REVIEW DATA');
console.log('='.repeat(70));
console.log(`
  Metric                    | Review (post-fix) | Our Run
  --------------------------+-------------------+--------
  Avg lifespan              | 133 turns / 3.8yr | ${avg(turns).toFixed(0)} turns / ${(avg(ages)/12).toFixed(1)}yr
  Median lifespan           | 105 turns / 3.2yr | ${median(turns)} turns / ${(median(ages)/12).toFixed(1)}yr
  Grade F                   | 74%               | ${((gradeCount['F'] || 0)/n*100).toFixed(0)}%
  Avg fitness               | 1.2               | ${avg(fitnesses).toFixed(1)}
  Male avg fitness          | 0.3               | ${maleFitness.length > 0 ? avg(maleFitness).toFixed(1) : 'N/A'}
  Female avg fitness        | 2.1               | ${femaleFitness.length > 0 ? avg(femaleFitness).toFixed(1) : 'N/A'}
  Hunter encounters/run     | 0.2               | ${avg(results.map(r => r.hunterEncounters)).toFixed(1)}
  Runs with any hunter      | 16%               | ${(results.filter(r => r.hunterEncounters > 0).length/n*100).toFixed(0)}%
  Predator encounters/run   | 15.4              | ${avg(results.map(r => r.predatorEncounters)).toFixed(1)}
  Template bugs in runs     | 96%               | ${(templateBugs/n*100).toFixed(0)}%
`);

console.log('Done.');
