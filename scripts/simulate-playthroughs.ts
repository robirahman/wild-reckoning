/**
 * Run 100 simulated playthroughs and collect statistics to validate
 * bugs and balance issues from playtest feedback.
 */

// Polyfill localStorage BEFORE any game imports (stores read it at module level)
import './node-polyfills';

import { GameAPI } from '../src/api/GameAPI';
import type { GameSnapshot, EventSummary, TurnResultSummary } from '../src/api/GameAPI';

interface PlaythroughResult {
  seed: number;
  sex: 'male' | 'female';
  turnsLived: number;
  ageMonths: number;
  causeOfDeath?: string;
  grade: string;
  fitness: number;
  peakWeight: number;
  minWeight: number;
  finalWeight: number;
  energyHitZeroTurn: number | null;
  energyStuckAtZeroPct: number; // % of turns at energy=0
  turnsUnableToMove: number; // turns where energy < 10
  templateBugs: string[]; // unresolved {{...}} in narratives
  predatorEncounters: number;
  hunterEncounters: number;
  matingEvents: number;
  offspringCount: number;
  regionsExplored: number;
  nodesExplored: number;
  startingEnergy: number;
  startingFlags: string[];
  energyByTurn: number[]; // first 50 turns
  deathRollCount: number;
  deathRollDeaths: number;
}

const NUM_RUNS = 100;
const MAX_TURNS = 500;

function runPlaythrough(seed: number, sex: 'male' | 'female'): PlaythroughResult {
  const game = new GameAPI();
  const snap = game.start({
    species: 'white-tailed-deer',
    backstory: 'wild-born',
    sex,
    difficulty: 'normal',
    seed,
  });

  const result: PlaythroughResult = {
    seed,
    sex,
    turnsLived: 0,
    ageMonths: snap.age,
    causeOfDeath: undefined,
    grade: 'F',
    fitness: 0,
    peakWeight: snap.weight,
    minWeight: snap.weight,
    finalWeight: snap.weight,
    energyHitZeroTurn: null,
    energyStuckAtZeroPct: 0,
    turnsUnableToMove: 0,
    templateBugs: [],
    predatorEncounters: 0,
    hunterEncounters: 0,
    matingEvents: 0,
    offspringCount: 0,
    regionsExplored: 0,
    nodesExplored: 0,
    startingEnergy: snap.energy,
    startingFlags: [...snap.flags],
    energyByTurn: [],
    deathRollCount: 0,
    deathRollDeaths: 0,
  };

  let zeroEnergyTurns = 0;
  let unableToMoveTurns = 0;
  const templateBugSet = new Set<string>();
  const seenNodes = new Set<string>();

  for (let i = 0; i < MAX_TURNS; i++) {
    if (!game.isAlive) break;

    let turnInfo;
    try {
      turnInfo = game.generateTurn();
    } catch (e) {
      break;
    }

    // Check for template variable bugs in narratives
    for (const event of turnInfo.events) {
      const matches = event.narrative.match(/\{\{[^}]+\}\}/g);
      if (matches) {
        for (const m of matches) {
          templateBugSet.add(`${event.category}/${event.id}: ${m}`);
        }
      }

      // Track event types
      if (event.tags.includes('predator')) result.predatorEncounters++;
      // Hunter events use 'human' tag + 'predator' tag (roads/fences also have 'human' but not 'predator')
      if (event.tags.includes('human') && event.tags.includes('predator')) result.hunterEncounters++;
      if (event.tags.includes('mating') || event.tags.includes('reproduction')) result.matingEvents++;
    }

    // Smart choice strategy: prefer safe/wise choices
    const choices: Array<{ eventId: string; choiceId: string }> = [];
    for (const event of turnInfo.events) {
      if (event.choices.length > 0) {
        // Prefer non-danger choices
        const safe = event.choices.find(c => c.style !== 'danger');
        const pick = safe ?? event.choices[0];
        choices.push({ eventId: event.id, choiceId: pick.id });
      }
    }
    for (const { eventId, choiceId } of choices) {
      try { game.makeChoice(eventId, choiceId); } catch (_) {}
    }

    // Auto-choose any remaining
    try { game.autoChoose(); } catch (_) {}

    let turnResult: TurnResultSummary;
    try {
      turnResult = game.endTurn();
    } catch (e) {
      // If pending choices remain, auto-choose and retry
      try {
        game.autoChoose();
        turnResult = game.endTurn();
      } catch (_) {
        break;
      }
    }

    // Resolve death rolls
    if (turnResult.pendingDeathRolls) {
      for (const roll of turnResult.pendingDeathRolls) {
        result.deathRollCount++;
        if (roll.escapeOptions.length > 0) {
          // Pick best survival option
          const best = roll.escapeOptions.reduce((a, b) =>
            b.survivalModifier > a.survivalModifier ? b : a
          );
          const survived = game.resolveDeathRoll(roll.eventId, best.id);
          if (!survived.survived) result.deathRollDeaths++;
        }
      }
    }

    try { game.rawState.dismissResults(); } catch (_) {}

    // Check for offspring in turn results
    for (const outcome of turnResult.eventOutcomes) {
      if (outcome.choiceNarrative?.includes('offspring') || outcome.choiceNarrative?.includes('pregnant')) {
        result.offspringCount++;
      }
    }

    // Also check narratives for template bugs
    for (const outcome of turnResult.eventOutcomes) {
      const text = (outcome.narrative ?? '') + (outcome.choiceNarrative ?? '');
      const matches = text.match(/\{\{[^}]+\}\}/g);
      if (matches) {
        for (const m of matches) {
          templateBugSet.add(`outcome/${outcome.eventId}: ${m}`);
        }
      }
    }

    // Track snapshot
    const s = game.getSnapshot();
    result.turnsLived = turnInfo.turn;
    if (s.weight > result.peakWeight) result.peakWeight = s.weight;
    if (s.weight < result.minWeight) result.minWeight = s.weight;
    result.finalWeight = s.weight;
    result.ageMonths = s.age;

    if (s.energy === 0) {
      zeroEnergyTurns++;
      if (result.energyHitZeroTurn === null) result.energyHitZeroTurn = turnInfo.turn;
    }
    if (s.energy < 10) unableToMoveTurns++;

    if (i < 50) result.energyByTurn.push(s.energy);
  }

  result.energyStuckAtZeroPct = result.turnsLived > 0
    ? Math.round(100 * zeroEnergyTurns / result.turnsLived)
    : 0;
  result.turnsUnableToMove = unableToMoveTurns;
  result.templateBugs = [...templateBugSet];

  // Get run summary
  try {
    const summary = game.getRunSummary();
    result.grade = summary.grade;
    result.fitness = summary.totalFitness;
    result.causeOfDeath = summary.causeOfDeath;
    result.offspringCount = Math.max(result.offspringCount, summary.totalFitness);

    // Count offspring from timeline
    const offspringTimeline = summary.timeline.filter(t => t.category === 'offspring');
    if (offspringTimeline.length > result.offspringCount) {
      result.offspringCount = offspringTimeline.length;
    }
  } catch (_) {}

  // Get final snapshot for explored nodes
  try {
    const raw = game.rawState;
    if (raw.map) {
      const visited = raw.map.nodes.filter((n: any) => n.visited);
      result.nodesExplored = visited.length;
    }
    result.regionsExplored = raw.animal?.lifetimeStats?.regionsVisited ?? 0;
  } catch (_) {}

  game.reset();
  return result;
}

// ─── Run simulations ───────────────────────────────────────────────────

console.log(`Running ${NUM_RUNS} simulated playthroughs...\n`);

const results: PlaythroughResult[] = [];
for (let i = 0; i < NUM_RUNS; i++) {
  const sex = i % 2 === 0 ? 'male' as const : 'female' as const;
  const seed = 1000 + i;
  try {
    const r = runPlaythrough(seed, sex);
    results.push(r);
    if ((i + 1) % 10 === 0) {
      process.stdout.write(`  ${i + 1}/${NUM_RUNS} complete\n`);
    }
  } catch (e) {
    console.error(`  Run ${i + 1} (seed=${seed}) crashed: ${e}`);
  }
}

// ─── Analyze results ───────────────────────────────────────────────────

console.log('\n' + '='.repeat(72));
console.log('SIMULATION RESULTS — 100 PLAYTHROUGHS (White-Tailed Deer, Normal)');
console.log('='.repeat(72));

// Helper stats
const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
const median = (arr: number[]) => {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};
const pct = (count: number, total: number) => `${count}/${total} (${Math.round(100 * count / total)}%)`;

// 1. ENERGY BUG
console.log('\n--- BUG #1: ENERGY STUCK AT 0% ---');
const energyZeroRuns = results.filter(r => r.energyStuckAtZeroPct > 50);
const energyNeverZero = results.filter(r => r.energyHitZeroTurn === null);
const avgZeroPct = avg(results.map(r => r.energyStuckAtZeroPct));
const firstZeroTurns = results.filter(r => r.energyHitZeroTurn !== null).map(r => r.energyHitZeroTurn!);
console.log(`  Runs where energy=0 for >50% of turns: ${pct(energyZeroRuns.length, results.length)}`);
console.log(`  Runs where energy NEVER hit 0: ${pct(energyNeverZero.length, results.length)}`);
console.log(`  Average % of turns at energy=0: ${avgZeroPct.toFixed(1)}%`);
if (firstZeroTurns.length > 0) {
  console.log(`  First turn energy hits 0: median=${median(firstZeroTurns)}, min=${Math.min(...firstZeroTurns)}, max=${Math.max(...firstZeroTurns)}`);
}
console.log(`  Starting energy: ${results[0]?.startingEnergy ?? 'N/A'}`);

// Energy trajectory for first run
if (results[0]?.energyByTurn.length > 0) {
  console.log(`  Energy trajectory (run 1, first 20 turns): ${results[0].energyByTurn.slice(0, 20).join(', ')}`);
}

// 2. MOVEMENT BLOCKING
console.log('\n--- BUG #2: MOVEMENT BLOCKED (energy < 10) ---');
const moveBlockedRuns = results.filter(r => r.turnsUnableToMove > r.turnsLived * 0.5);
const avgMoveBlocked = avg(results.map(r => r.turnsLived > 0 ? r.turnsUnableToMove / r.turnsLived * 100 : 0));
console.log(`  Runs where movement blocked >50% of turns: ${pct(moveBlockedRuns.length, results.length)}`);
console.log(`  Average % turns unable to move: ${avgMoveBlocked.toFixed(1)}%`);

// 3. TEMPLATE VARIABLE BUGS
console.log('\n--- BUG #3: UNRESOLVED TEMPLATE VARIABLES ---');
const runsWithTemplateBugs = results.filter(r => r.templateBugs.length > 0);
console.log(`  Runs with unresolved {{...}} in text: ${pct(runsWithTemplateBugs.length, results.length)}`);
const allBugs = new Set<string>();
for (const r of results) for (const b of r.templateBugs) allBugs.add(b);
if (allBugs.size > 0) {
  console.log(`  Unique template bugs found:`);
  for (const b of allBugs) console.log(`    - ${b}`);
}

// 4. LIFESPAN & MORTALITY
console.log('\n--- LIFESPAN & MORTALITY ---');
const turns = results.map(r => r.turnsLived);
const ages = results.map(r => r.ageMonths);
console.log(`  Turns lived: avg=${avg(turns).toFixed(0)}, median=${median(turns)}, min=${Math.min(...turns)}, max=${Math.max(...turns)}`);
console.log(`  Age (months): avg=${avg(ages).toFixed(0)}, median=${median(ages)}, min=${Math.min(...ages)}, max=${Math.max(...ages)}`);
console.log(`  Age (years): avg=${(avg(ages) / 12).toFixed(1)}, median=${(median(ages) / 12).toFixed(1)}`);

// Cause of death distribution
const deathCauses: Record<string, number> = {};
for (const r of results) {
  const cause = r.causeOfDeath ?? 'Unknown/Still Alive';
  const key = cause.length > 50 ? cause.slice(0, 50) + '...' : cause;
  deathCauses[key] = (deathCauses[key] || 0) + 1;
}
console.log(`  Cause of death distribution:`);
for (const [cause, count] of Object.entries(deathCauses).sort((a, b) => b[1] - a[1])) {
  console.log(`    ${cause}: ${count} (${Math.round(100 * count / results.length)}%)`);
}

// 5. WEIGHT
console.log('\n--- WEIGHT ---');
console.log(`  Peak weight: avg=${avg(results.map(r => r.peakWeight)).toFixed(1)}, max=${Math.max(...results.map(r => r.peakWeight)).toFixed(1)}`);
console.log(`  Min weight: avg=${avg(results.map(r => r.minWeight)).toFixed(1)}, min=${Math.min(...results.map(r => r.minWeight)).toFixed(1)}`);
console.log(`  Final weight: avg=${avg(results.map(r => r.finalWeight)).toFixed(1)}`);

// 6. REPRODUCTION
console.log('\n--- REPRODUCTION ---');
const grades: Record<string, number> = {};
for (const r of results) grades[r.grade] = (grades[r.grade] || 0) + 1;
console.log(`  Grade distribution: ${Object.entries(grades).sort().map(([g, c]) => `${g}=${c}`).join(', ')}`);
console.log(`  Fitness: avg=${avg(results.map(r => r.fitness)).toFixed(1)}, median=${median(results.map(r => r.fitness))}`);
console.log(`  Runs with 0 fitness (grade F): ${pct(results.filter(r => r.fitness === 0).length, results.length)}`);
console.log(`  Mating events: avg=${avg(results.map(r => r.matingEvents)).toFixed(1)}`);

// 7. ENCOUNTERS
console.log('\n--- ENCOUNTERS ---');
console.log(`  Predator encounters: avg=${avg(results.map(r => r.predatorEncounters)).toFixed(1)}, max=${Math.max(...results.map(r => r.predatorEncounters))}`);
console.log(`  Hunter encounters: avg=${avg(results.map(r => r.hunterEncounters)).toFixed(1)}, max=${Math.max(...results.map(r => r.hunterEncounters))}`);
console.log(`  Runs with 0 predator encounters: ${pct(results.filter(r => r.predatorEncounters === 0).length, results.length)}`);
console.log(`  Runs with 0 hunter encounters: ${pct(results.filter(r => r.hunterEncounters === 0).length, results.length)}`);
console.log(`  Death rolls: avg=${avg(results.map(r => r.deathRollCount)).toFixed(1)}, deaths from rolls=${results.reduce((a, r) => a + r.deathRollDeaths, 0)}`);

// 8. EXPLORATION
console.log('\n--- EXPLORATION ---');
console.log(`  Nodes explored: avg=${avg(results.map(r => r.nodesExplored)).toFixed(1)}, max=${Math.max(...results.map(r => r.nodesExplored))}`);

// 9. STARTING CONDITIONS
console.log('\n--- STARTING CONDITIONS ---');
const startFlags = results[0]?.startingFlags ?? [];
console.log(`  Starting energy: ${results[0]?.startingEnergy ?? 'N/A'}`);
console.log(`  Starting flags: ${startFlags.length > 0 ? startFlags.join(', ') : '(none)'}`);
const startingWeight = results.map(r => r.minWeight === r.peakWeight ? r.finalWeight : r.peakWeight);
console.log(`  Starting weight range: ${Math.min(...results.map(r => r.finalWeight)).toFixed(1)} - ${Math.max(...results.map(r => r.peakWeight)).toFixed(1)}`);

// 10. MALE vs FEMALE comparison
console.log('\n--- MALE vs FEMALE COMPARISON ---');
const males = results.filter(r => r.sex === 'male');
const females = results.filter(r => r.sex === 'female');
console.log(`  Males: avg turns=${avg(males.map(r => r.turnsLived)).toFixed(0)}, avg fitness=${avg(males.map(r => r.fitness)).toFixed(1)}, avg age=${(avg(males.map(r => r.ageMonths)) / 12).toFixed(1)}yr`);
console.log(`  Females: avg turns=${avg(females.map(r => r.turnsLived)).toFixed(0)}, avg fitness=${avg(females.map(r => r.fitness)).toFixed(1)}, avg age=${(avg(females.map(r => r.ageMonths)) / 12).toFixed(1)}yr`);

console.log('\n' + '='.repeat(72));
console.log('END OF SIMULATION REPORT');
console.log('='.repeat(72));
