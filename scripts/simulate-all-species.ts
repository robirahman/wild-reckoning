/**
 * Run 100 headless playthroughs per wild species and compare results
 * against real-world mortality data and life expectancies.
 *
 * Usage: npx tsx scripts/simulate-all-species.ts
 */

// Polyfill localStorage (Node 25 built-in is broken without --localstorage-file)
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
import { getSpeciesBundle, getAllSpeciesIds } from '../src/data/species';

// ── Real-world reference data ────────────────────────────────────────────────

interface SpeciesRef {
  name: string;
  backstory: string; // first valid backstory to use
  wildLifespanYears: [number, number]; // [typical, max] in wild
  turnUnit: string;
  maxTurns: number;
  topCausesOfDeath: Record<string, string>; // cause → expected % range
  skip?: boolean; // skip species that can't run headless
  sexOptions: ('male' | 'female')[];
}

const SPECIES_REF: Record<string, SpeciesRef> = {
  'white-tailed-deer': {
    name: 'White-Tailed Deer',
    backstory: 'wild-born',
    wildLifespanYears: [4.5, 14],
    turnUnit: 'week',
    maxTurns: 500,
    topCausesOfDeath: {
      'Hunting': '30-45%',
      'Predation (wolf/coyote)': '15-25%',
      'Vehicle strikes': '5-10%',
      'Starvation/winter kill': '10-15%',
      'Disease/parasites': '10-15%',
      'Territory fights': '<1%',
    },
    sexOptions: ['male', 'female'],
  },
  'african-elephant': {
    name: 'African Elephant',
    backstory: 'wild-born',
    wildLifespanYears: [50, 70],
    turnUnit: 'month',
    maxTurns: 1000,
    topCausesOfDeath: {
      'Poaching': '20-40%',
      'Drought/starvation': '15-25%',
      'Disease': '10-15%',
      'Human-wildlife conflict': '5-10%',
      'Old age': '10-20%',
    },
    sexOptions: ['male', 'female'],
  },
  'polar-bear': {
    name: 'Polar Bear',
    backstory: 'wild-born',
    wildLifespanYears: [15, 30],
    turnUnit: 'month',
    maxTurns: 500,
    topCausesOfDeath: {
      'Starvation (ice loss)': '30-40%',
      'Intraspecific killing': '10-20%',
      'Hunting (subsistence)': '5-15%',
      'Disease': '5-10%',
      'Old age': '5-10%',
    },
    sexOptions: ['male', 'female'],
  },
  'gray-wolf': {
    name: 'Gray Wolf',
    backstory: 'pack-raised',
    wildLifespanYears: [6, 13],
    turnUnit: 'week',
    maxTurns: 500,
    topCausesOfDeath: {
      'Human killing (hunting/trapping)': '30-50%',
      'Intraspecific killing': '15-25%',
      'Starvation': '10-20%',
      'Disease (mange/distemper)': '5-15%',
      'Vehicle strikes': '2-5%',
    },
    sexOptions: ['male', 'female'],
  },
  'chinook-salmon': {
    name: 'Chinook Salmon',
    backstory: 'wild-spawned',
    wildLifespanYears: [3, 7],
    turnUnit: 'week',
    maxTurns: 400,
    topCausesOfDeath: {
      'Predation (birds/bears/fish)': '40-60%',
      'Post-spawning death': '~100% (semelparous)',
      'Commercial fishing': '10-30%',
      'Dam mortality': '5-15%',
    },
    sexOptions: ['male', 'female'],
  },
  'green-sea-turtle': {
    name: 'Green Sea Turtle',
    backstory: 'open-ocean-survivor',
    wildLifespanYears: [60, 80],
    turnUnit: 'month',
    maxTurns: 1000,
    topCausesOfDeath: {
      'Bycatch': '20-30%',
      'Predation (shark)': '10-20%',
      'Fibropapillomatosis': '10-15%',
      'Plastic ingestion': '5-10%',
      'Poaching': '5-15%',
    },
    sexOptions: ['female'], // mostly females studied
  },
  'monarch-butterfly': {
    name: 'Monarch Butterfly',
    backstory: 'wild-hatched',
    wildLifespanYears: [0.07, 0.75], // 2-9 months depending on generation
    turnUnit: 'week',
    maxTurns: 200,
    topCausesOfDeath: {
      'Predation': '40-60%',
      'Weather/cold snap': '15-25%',
      'Habitat loss': '10-20%',
      'Pesticides': '5-10%',
    },
    sexOptions: ['female'],
  },
  'common-octopus': {
    name: 'Common Octopus',
    backstory: 'reef-hatched',
    wildLifespanYears: [1, 2],
    turnUnit: 'week',
    maxTurns: 200,
    topCausesOfDeath: {
      'Predation': '40-60%',
      'Post-spawning senescence': '~100% (semelparous)',
      'Fishing': '10-20%',
    },
    sexOptions: ['male', 'female'],
  },
  'arctic-tern': {
    name: 'Arctic Tern',
    backstory: 'colony-fledged',
    wildLifespanYears: [20, 34],
    turnUnit: 'month',
    maxTurns: 500,
    topCausesOfDeath: {
      'Predation': '30-50%',
      'Storms/weather': '10-20%',
      'Starvation': '10-20%',
      'Old age': '5-15%',
    },
    sexOptions: ['male', 'female'],
  },
  'poison-dart-frog': {
    name: 'Strawberry Poison Dart Frog',
    backstory: 'bromeliad-raised',
    wildLifespanYears: [3, 8],
    turnUnit: 'week',
    maxTurns: 500,
    topCausesOfDeath: {
      'Predation': '40-60%',
      'Desiccation': '10-20%',
      'Disease (chytrid)': '10-20%',
      'Habitat loss': '5-10%',
    },
    sexOptions: ['male', 'female'],
  },
  'honeybee-worker': {
    name: 'Honeybee Worker',
    backstory: 'summer-brood',
    wildLifespanYears: [0.08, 0.5], // 6 weeks summer, ~6 months winter
    turnUnit: 'day',
    maxTurns: 300,
    topCausesOfDeath: {
      'Foraging attrition': '30-40%',
      'Predation': '10-20%',
      'Pesticides': '10-20%',
      'Disease/mites': '10-20%',
      'Winter cluster death': '5-15%',
    },
    sexOptions: ['female'], // workers are all female
  },
  'fig-wasp': {
    name: 'Fig Pollinator Wasp',
    backstory: 'healthy-fig',
    wildLifespanYears: [0.005, 0.005], // ~48 hours
    turnUnit: 'day',
    maxTurns: 100,
    topCausesOfDeath: {
      'Desiccation': '30-50%',
      'Failed to find fig': '20-30%',
      'Predation': '10-20%',
      'Senescence': '10-20%',
    },
    sexOptions: ['female'],
  },
  // Farm animals - skip for "wild" comparison
  'chicken': { name: 'Chicken', backstory: 'broiler', wildLifespanYears: [0.1, 0.1], turnUnit: 'day', maxTurns: 200, topCausesOfDeath: { 'Slaughter': '>95%' }, skip: true, sexOptions: ['female'] },
  'pig': { name: 'Pig', backstory: 'grower-pig', wildLifespanYears: [0.5, 0.5], turnUnit: 'day', maxTurns: 300, topCausesOfDeath: { 'Slaughter': '>95%' }, skip: true, sexOptions: ['female'] },
};

// ── Simulation runner ────────────────────────────────────────────────────────

const NUM_RUNS = 100;
const SEED_BASE = 3000;

interface RunRecord {
  seed: number;
  sex: string;
  turnsLived: number;
  ageMonths: number;
  causeOfDeath: string;
  fitness: number;
  grade: string;
  templateBugSeen: boolean;
  energyAtTurn20: number;
  maxWeight: number;
  finalWeight: number;
  totalOffspring: number;
  offspringSurvived: number;
  dehydrationDeaths: boolean;
  sampleNarratives: string[];
}

function runOne(
  speciesId: string,
  ref: SpeciesRef,
  seed: number,
  sex: 'male' | 'female',
): RunRecord {
  const game = new GameAPI();
  game.start({
    species: speciesId,
    backstory: ref.backstory,
    sex,
    difficulty: 'normal',
    seed,
  });

  let templateBugSeen = false;
  let maxWeight = 0;
  let energyAtTurn20 = -1;
  const sampleNarratives: string[] = [];

  for (let t = 0; t < ref.maxTurns; t++) {
    if (!game.isAlive) break;

    game.autoMove();

    let turnInfo;
    try {
      turnInfo = game.generateTurn();
    } catch (e: any) {
      break;
    }

    const snap = game.getSnapshot();
    if (snap.weight > maxWeight) maxWeight = snap.weight;
    if (t === 19) energyAtTurn20 = snap.energy;

    for (const ev of turnInfo.events) {
      if (ev.narrative.includes('{{')) templateBugSeen = true;
      // Sample up to 5 narratives from first run (seed 3000) for realism review
      if (seed === SEED_BASE && sampleNarratives.length < 5 && ev.narrative.length > 30) {
        sampleNarratives.push(`[t${t}] ${ev.narrative.slice(0, 200)}`);
      }
    }

    // Use cautious strategy (weighted random: 25% danger, 75% safe)
    game.autoChoose('cautious');

    try {
      const result = game.endTurn();
      if (result.pendingDeathRolls) {
        for (const roll of result.pendingDeathRolls) {
          if (roll.escapeOptions.length > 0) {
            game.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
          }
        }
      }
    } catch {
      break;
    }

    try { (game as any)._store.setState({ showingResults: false, turnResult: null }); } catch {}
  }

  // Extract reproduction data
  const state = game.rawState as any;
  const repro = state.reproduction;
  let totalOffspring = 0;
  let offspringSurvived = 0;
  if (repro) {
    if (repro.type === 'iteroparous' && repro.offspring) {
      totalOffspring = repro.offspring.length;
      offspringSurvived = repro.offspring.filter((o: any) => o.alive || o.matured).length;
    } else if (repro.type === 'semelparous') {
      totalOffspring = repro.eggCount || 0;
      offspringSurvived = repro.estimatedSurvivors || 0;
    }
  }

  const finalSnap = game.getSnapshot();

  let summary;
  try {
    summary = game.getRunSummary();
  } catch {
    summary = {
      turnsLived: finalSnap.turn,
      ageMonths: finalSnap.age,
      causeOfDeath: finalSnap.causeOfDeath || 'survived to max turns',
      totalFitness: 0,
      grade: 'F',
    };
  }

  return {
    seed,
    sex,
    turnsLived: summary.turnsLived,
    ageMonths: summary.ageMonths,
    causeOfDeath: summary.causeOfDeath || 'survived to max turns',
    fitness: summary.totalFitness,
    grade: summary.grade,
    templateBugSeen,
    energyAtTurn20,
    maxWeight,
    finalWeight: finalSnap.weight,
    totalOffspring,
    offspringSurvived,
    dehydrationDeaths: (summary.causeOfDeath || '').toLowerCase().includes('dehydrat'),
    sampleNarratives,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const avg = (arr: number[]) => arr.length === 0 ? 0 : arr.reduce((a, b) => a + b, 0) / arr.length;
const median = (arr: number[]) => {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

function turnsToDuration(turns: number, turnUnit: string): string {
  switch (turnUnit) {
    case 'day': return `${(turns / 365).toFixed(2)}yr (${turns}d)`;
    case 'week': return `${(turns / 52).toFixed(1)}yr (${turns}w)`;
    case 'month': return `${(turns / 12).toFixed(1)}yr (${turns}mo)`;
    default: return `${turns} turns`;
  }
}

function normalizeCause(cause: string): string {
  const c = cause.toLowerCase();
  if (c.includes('starvation') || c.includes('starv')) return 'Starvation';
  if (c.includes('old age')) return 'Old age';
  if (c.includes('systemic') || c.includes('health')) return 'Systemic failure (HEA=0)';
  if (c.includes('sepsis')) return 'Sepsis';
  if (c.includes('territory') || c.includes('intruder') || c.includes('boundary dispute')) return 'Territory fight';
  if (c.includes('wolf') || c.includes('wolves')) return 'Killed by wolf';
  if (c.includes('hunter') || c.includes('shot') || c.includes('rifle') || c.includes('gunshot')) return 'Shot by hunter';
  if (c.includes('vehicle') || c.includes('road') || c.includes('oncoming')) return 'Vehicle strike';
  if (c.includes('poach')) return 'Poaching';
  if (c.includes('tick')) return 'Tick complications';
  if (c.includes('meningeal') || c.includes('brainworm')) return 'Meningeal worm';
  if (c.includes('dehydrat')) return 'Dehydration';
  if (c.includes('drown')) return 'Drowning';
  if (c.includes('predator') || c.includes('den')) return 'Predation';
  if (c.includes('spawning') || c.includes('post-spawn')) return 'Post-spawning death';
  if (c.includes('dehydrat') || c.includes('desiccat')) return 'Desiccation';
  if (c.includes('cold') || c.includes('hypotherm') || c.includes('freeze') || c.includes('frost')) return 'Cold/hypothermia';
  if (c.includes('pesticide') || c.includes('poison') || c.includes('toxic')) return 'Poisoning/pesticide';
  if (c.includes('bycatch') || c.includes('net') || c.includes('trawl') || c.includes('hook')) return 'Bycatch/fishing';
  if (c.includes('shark')) return 'Shark predation';
  if (c.includes('bear')) return 'Bear predation';
  if (c.includes('bird') || c.includes('eagle') || c.includes('hawk')) return 'Avian predation';
  if (c.includes('crack') || c.includes('structure') || c.includes('legs fold')) return 'Shot (orchard/structure)';
  if (c.includes('survived')) return 'Survived to max turns';
  if (c.includes('disease') || c.includes('infect') || c.includes('virus') || c.includes('bacteria')) return 'Disease';
  if (c.includes('parasite') || c.includes('worm') || c.includes('mite')) return 'Parasites';
  // Return first 60 chars for uncategorized
  return cause.length > 60 ? cause.slice(0, 57) + '...' : cause;
}

// ── Main loop ────────────────────────────────────────────────────────────────

const allSpecies = getAllSpeciesIds();

console.log('='.repeat(80));
console.log('WILD RECKONING — MULTI-SPECIES SIMULATION ANALYSIS');
console.log(`${NUM_RUNS} playthroughs per species, cautious auto-choose strategy`);
console.log('='.repeat(80));

const speciesSummaries: Array<{
  id: string;
  name: string;
  avgLifeYears: number;
  expectedLifeYears: [number, number];
  lifespanFlag: string;
  topDeathCauses: [string, number][];
  gradeF: number;
  templateBugs: number;
  n: number;
  avgOffspring: number;
  avgFitness: number;
  avgMaxWeight: number;
  gradeDistribution: Record<string, number>;
}> = [];

for (const speciesId of allSpecies) {
  const ref = SPECIES_REF[speciesId];
  if (!ref) {
    console.log(`\nSkipping ${speciesId}: no reference data`);
    continue;
  }
  if (ref.skip) {
    console.log(`\nSkipping ${ref.name} (farm animal)`);
    continue;
  }

  process.stdout.write(`\nRunning ${ref.name} (${NUM_RUNS} runs)...`);

  const results: RunRecord[] = [];
  for (let i = 0; i < NUM_RUNS; i++) {
    const seed = SEED_BASE + i;
    const sex = ref.sexOptions[i % ref.sexOptions.length];
    try {
      results.push(runOne(speciesId, ref, seed, sex));
    } catch (e: any) {
      // Log but continue
      if (i < 3) process.stderr.write(` [seed ${seed} error: ${e.message.slice(0, 50)}]`);
    }
  }
  console.log(` ${results.length} completed`);

  if (results.length === 0) {
    console.log('  NO RESULTS — all runs crashed');
    continue;
  }

  const n = results.length;
  const ages = results.map(r => r.ageMonths);
  const turns = results.map(r => r.turnsLived);
  const avgLifeYears = avg(ages) / 12;
  const medLifeYears = median(ages) / 12;
  const weights = results.map(r => r.maxWeight);
  const finalWeights = results.map(r => r.finalWeight);
  const offspringCounts = results.map(r => r.totalOffspring);
  const survivedCounts = results.map(r => r.offspringSurvived);
  const fitnesses = results.map(r => r.fitness);

  // Death causes
  const deathCounts: Record<string, number> = {};
  for (const r of results) {
    const cause = normalizeCause(r.causeOfDeath);
    deathCounts[cause] = (deathCounts[cause] || 0) + 1;
  }
  const sortedDeaths = Object.entries(deathCounts).sort((a, b) => b[1] - a[1]);

  // Grades
  const gradeCount: Record<string, number> = {};
  for (const r of results) gradeCount[r.grade] = (gradeCount[r.grade] || 0) + 1;

  const templateBugs = results.filter(r => r.templateBugSeen).length;
  const energyAt20 = results.filter(r => r.energyAtTurn20 >= 0).map(r => r.energyAtTurn20);

  // Lifespan comparison
  let lifespanFlag = '';
  if (avgLifeYears < ref.wildLifespanYears[0] * 0.5) lifespanFlag = 'TOO SHORT';
  else if (avgLifeYears > ref.wildLifespanYears[1] * 1.5) lifespanFlag = 'TOO LONG';
  else if (avgLifeYears < ref.wildLifespanYears[0] * 0.75) lifespanFlag = 'SHORT';
  else if (avgLifeYears > ref.wildLifespanYears[1] * 1.2) lifespanFlag = 'LONG';
  else lifespanFlag = 'OK';

  console.log(`\n  ## ${ref.name} (${speciesId})`);
  console.log(`  Lifespan: avg ${avgLifeYears.toFixed(2)}yr, median ${medLifeYears.toFixed(2)}yr`);
  console.log(`    Real wild lifespan: ${ref.wildLifespanYears[0]}-${ref.wildLifespanYears[1]}yr`);
  console.log(`    Assessment: ${lifespanFlag === 'OK' ? 'OK' : '*** ' + lifespanFlag + ' ***'}`);
  console.log(`  Turns: avg ${avg(turns).toFixed(0)}, median ${median(turns)}, range ${Math.min(...turns)}-${Math.max(...turns)}`);
  console.log(`  Weight: max avg ${avg(weights).toFixed(2)}, final avg ${avg(finalWeights).toFixed(2)}`);
  console.log(`  Offspring: avg ${avg(offspringCounts).toFixed(1)} born, avg ${avg(survivedCounts).toFixed(1)} survived`);
  console.log(`  Fitness score: avg ${avg(fitnesses).toFixed(1)}, median ${median(fitnesses)}, range ${Math.min(...fitnesses)}-${Math.max(...fitnesses)}`);
  console.log(`  Grades: ${Object.entries(gradeCount).sort((a,b) => b[1]-a[1]).map(([g,c]) => `${g}:${c}`).join(', ')}`);
  if (energyAt20.length > 0) console.log(`  Energy at turn 20: avg ${avg(energyAt20).toFixed(1)}`);
  if (templateBugs > 0) console.log(`  Template bugs: ${templateBugs}/${n} runs`);

  console.log(`  Cause of Death:`);
  for (const [cause, count] of sortedDeaths.slice(0, 10)) {
    const pct = (count / n * 100).toFixed(0);
    // Check if over-represented vs real data
    let flag = '';
    for (const [realCause, realRange] of Object.entries(ref.topCausesOfDeath)) {
      if (cause.toLowerCase().includes(realCause.toLowerCase().split(' ')[0].replace('(', '')) ||
          realCause.toLowerCase().includes(cause.toLowerCase().split(' ')[0])) {
        flag = ` (real: ${realRange})`;
        break;
      }
    }
    console.log(`    ${pct.padStart(3)}% ${cause}${flag}`);
  }

  // Show sample narratives from first run for realism review
  const firstRunNarratives = results.find(r => r.seed === SEED_BASE)?.sampleNarratives || [];
  if (firstRunNarratives.length > 0) {
    console.log(`  Sample narratives (seed ${SEED_BASE}):`);
    for (const n of firstRunNarratives) {
      console.log(`    ${n}`);
    }
  }

  speciesSummaries.push({
    id: speciesId,
    name: ref.name,
    avgLifeYears,
    expectedLifeYears: ref.wildLifespanYears,
    lifespanFlag,
    topDeathCauses: sortedDeaths.slice(0, 5),
    gradeF: gradeCount['F'] || 0,
    templateBugs,
    n,
    avgOffspring: avg(offspringCounts),
    avgFitness: avg(fitnesses),
    avgMaxWeight: avg(weights),
    gradeDistribution: gradeCount,
  });
}

// ── Cross-species summary ────────────────────────────────────────────────────

console.log(`\n${'='.repeat(80)}`);
console.log('CROSS-SPECIES SUMMARY');
console.log('='.repeat(80));

console.log('\n  Species                      | Avg Life  | Real Range  | Flag       | Avg Offspring | Avg Fitness | Grades              | Bugs');
console.log('  ' + '-'.repeat(120));
for (const s of speciesSummaries) {
  const name = s.name.padEnd(30);
  const life = `${s.avgLifeYears.toFixed(2)}yr`.padEnd(10);
  const real = `${s.expectedLifeYears[0]}-${s.expectedLifeYears[1]}yr`.padEnd(12);
  const flag = s.lifespanFlag.padEnd(11);
  const offspring = `${s.avgOffspring.toFixed(1)}`.padEnd(14);
  const fitness = `${s.avgFitness.toFixed(1)}`.padEnd(12);
  const grades = Object.entries(s.gradeDistribution).sort((a,b) => b[1]-a[1]).map(([g,c]) => `${g}:${c}`).join(' ').padEnd(20);
  const bugs = s.templateBugs > 0 ? `${s.templateBugs}/${s.n}` : '-';
  console.log(`  ${name}| ${life}| ${real}| ${flag}| ${offspring}| ${fitness}| ${grades}| ${bugs}`);
}

// Flag over-represented causes
console.log('\n\nOVER-REPRESENTED CAUSES OF DEATH (flagged):');
console.log('-'.repeat(80));
for (const s of speciesSummaries) {
  const ref = SPECIES_REF[s.id];
  for (const [cause, count] of s.topDeathCauses) {
    const pct = count / s.n * 100;
    if (pct >= 20) {
      console.log(`  ${s.name}: "${cause}" at ${pct.toFixed(0)}%`);
    }
  }
}

console.log('\n\nLIFESPAN DISCREPANCIES:');
console.log('-'.repeat(80));
for (const s of speciesSummaries) {
  if (s.lifespanFlag !== 'OK') {
    console.log(`  ${s.name}: avg ${s.avgLifeYears.toFixed(2)}yr vs expected ${s.expectedLifeYears[0]}-${s.expectedLifeYears[1]}yr [${s.lifespanFlag}]`);
  }
}

console.log('\nDone.');
