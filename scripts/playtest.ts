/**
 * Headless playtesting script for Wild Reckoning.
 *
 * Runs N games of the white-tailed-deer species, auto-choosing events,
 * and collects statistics on stat balance, death causes, lifespan, and
 * weight trajectories. Runs both normal and fast-forward modes.
 *
 * Usage:
 *   npx tsx scripts/playtest.ts
 */

// Polyfill localStorage for Node
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
import type { EventSummary, GameSnapshot, TurnResultSummary } from '../src/api/GameAPI';
import { StatId } from '../src/types/stats';

const GAMES_PER_MODE = 50;
const MAX_TURNS = 200; // ~200 weeks = ~4 years

interface GameRecord {
  seed: number;
  sex: 'male' | 'female';
  fastForward: boolean;
  turnsLived: number;
  causeOfDeath: string;
  finalWeight: number;
  finalStats: Record<string, number>;
  statHistory: Array<Record<string, number>>;
  weightHistory: number[];
  deathRollCount: number;
  deathRollDeaths: number;
  eventCategories: Record<string, number>;
}

function smartChoiceStrategy(events: EventSummary[]): Array<{ eventId: string; choiceId: string }> {
  const choices: Array<{ eventId: string; choiceId: string }> = [];
  for (const event of events) {
    if (event.type !== 'active' || event.choices.length === 0) continue;

    // Prefer 'default' style choices over 'danger' (mimics cautious player)
    const safe = event.choices.find(c => c.style === 'default');
    const pick = safe ?? event.choices[0];
    choices.push({ eventId: event.id, choiceId: pick.id });
  }
  return choices;
}

function runBatch(fastForward: boolean, count: number): GameRecord[] {
  const records: GameRecord[] = [];

  for (let i = 0; i < count; i++) {
    const seed = 1000 + i;
    const sex: 'male' | 'female' = i % 2 === 0 ? 'female' : 'male';
    const game = new GameAPI();

    game.start({
      species: 'white-tailed-deer',
      backstory: 'wild-born',
      sex,
      difficulty: 'normal',
      seed,
    });

    // Enable fast-forward if needed
    if (fastForward) {
      game.rawState.toggleFastForward();
    }

    const statHistory: Array<Record<string, number>> = [];
    const weightHistory: number[] = [];
    let deathRollCount = 0;
    let deathRollDeaths = 0;
    const eventCategoryCounts: Record<string, number> = {};

    for (let t = 0; t < MAX_TURNS; t++) {
      if (!game.isAlive) break;

      const turnInfo = game.generateTurn();

      // Count events by category and check for predator death consequences
      for (const event of turnInfo.events) {
        eventCategoryCounts[event.category] = (eventCategoryCounts[event.category] ?? 0) + 1;
      }

      // (debug output removed)

      // Make choices
      const choices = smartChoiceStrategy(turnInfo.events);
      for (const { eventId, choiceId } of choices) {
        try {
          game.makeChoice(eventId, choiceId);
        } catch {
          // Choice may already be made or invalid
        }
      }

      // Auto-choose any remaining
      game.autoChoose();

      let result: TurnResultSummary;
      try {
        result = game.endTurn();
      } catch {
        break;
      }

      // Handle death rolls
      if (result.pendingDeathRolls) {
        for (const roll of result.pendingDeathRolls) {
          deathRollCount++;
          if (roll.escapeOptions.length > 0) {
            const escaped = game.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
            if (!escaped.survived) deathRollDeaths++;
          }
        }
      }

      // Dismiss results
      try {
        game.rawState.dismissResults();
      } catch {
        // May fail if dead
      }

      // Record snapshot
      const snap = game.getSnapshot();
      const statSnap: Record<string, number> = {};
      for (const id of Object.values(StatId)) {
        statSnap[id] = snap.stats[id];
      }
      statHistory.push(statSnap);
      weightHistory.push(snap.weight);
    }

    const finalSnap = game.getSnapshot();
    records.push({
      seed,
      sex,
      fastForward,
      turnsLived: finalSnap.turn,
      causeOfDeath: finalSnap.causeOfDeath ?? 'survived',
      finalWeight: finalSnap.weight,
      finalStats: (() => {
        const s: Record<string, number> = {};
        for (const id of Object.values(StatId)) s[id] = finalSnap.stats[id];
        return s;
      })(),
      statHistory,
      weightHistory,
      deathRollCount,
      deathRollDeaths,
      eventCategories: { ...eventCategoryCounts },
    });

    game.reset();
  }

  return records;
}

function analyzeRecords(records: GameRecord[], label: string): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`  ${label} (${records.length} games)`);
  console.log('='.repeat(60));

  // Lifespan
  const lifespans = records.map(r => r.turnsLived);
  const avgLife = lifespans.reduce((a, b) => a + b, 0) / lifespans.length;
  const medianLife = lifespans.sort((a, b) => a - b)[Math.floor(lifespans.length / 2)];
  const maxLife = Math.max(...lifespans);
  const minLife = Math.min(...lifespans);
  console.log(`\nLifespan (turns/weeks):`);
  console.log(`  Mean: ${avgLife.toFixed(1)}, Median: ${medianLife}, Min: ${minLife}, Max: ${maxLife}`);
  console.log(`  Mean (years): ${(avgLife / 52).toFixed(1)}, Median (years): ${(medianLife / 52).toFixed(1)}`);

  // Death causes
  const causes: Record<string, number> = {};
  for (const r of records) {
    const cause = r.causeOfDeath;
    causes[cause] = (causes[cause] ?? 0) + 1;
  }
  console.log(`\nDeath causes:`);
  const sortedCauses = Object.entries(causes).sort((a, b) => b[1] - a[1]);
  for (const [cause, count] of sortedCauses) {
    console.log(`  ${cause}: ${count} (${((count / records.length) * 100).toFixed(0)}%)`);
  }

  // Death rolls
  const totalRolls = records.reduce((s, r) => s + r.deathRollCount, 0);
  const totalRollDeaths = records.reduce((s, r) => s + r.deathRollDeaths, 0);
  console.log(`\nDeath rolls: ${totalRolls} total, ${totalRollDeaths} deaths (${totalRolls > 0 ? ((totalRollDeaths / totalRolls) * 100).toFixed(1) : 0}%)`);

  // Event categories
  const allCategories: Record<string, number> = {};
  for (const r of records) {
    for (const [cat, count] of Object.entries(r.eventCategories)) {
      allCategories[cat] = (allCategories[cat] ?? 0) + count;
    }
  }
  console.log(`\nEvent categories (total across all games):`);
  const sortedCats = Object.entries(allCategories).sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of sortedCats) {
    const perGame = (count / records.length).toFixed(1);
    console.log(`  ${cat}: ${count} total (${perGame}/game)`);
  }

  // Final weight
  const weights = records.map(r => r.finalWeight);
  const avgWeight = weights.reduce((a, b) => a + b, 0) / weights.length;
  console.log(`\nFinal weight: Mean ${avgWeight.toFixed(1)} lbs`);

  // Stat averages at death/end
  console.log(`\nFinal stat averages:`);
  const statIds = Object.values(StatId);
  for (const id of statIds) {
    const vals = records.map(r => r.finalStats[id] ?? 0);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    console.log(`  ${id}: ${avg.toFixed(1)}`);
  }

  // Stat trajectories at turn 10, 25, 50, 100
  const checkpoints = [10, 25, 50, 100];
  console.log(`\nStat averages at checkpoints:`);
  console.log(`  ${'Turn'.padEnd(6)} ${statIds.map(id => id.padEnd(6)).join(' ')}`);
  for (const cp of checkpoints) {
    const vals: Record<string, number[]> = {};
    for (const id of statIds) vals[id] = [];
    for (const r of records) {
      if (r.statHistory.length > cp) {
        for (const id of statIds) {
          vals[id].push(r.statHistory[cp][id] ?? 0);
        }
      }
    }
    const line = statIds.map(id => {
      const arr = vals[id];
      if (arr.length === 0) return '  -   ';
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      return avg.toFixed(1).padStart(6);
    }).join(' ');
    console.log(`  ${String(cp).padEnd(6)} ${line}`);
  }

  // Weight trajectory
  console.log(`\nWeight at checkpoints:`);
  for (const cp of checkpoints) {
    const vals = records.filter(r => r.weightHistory.length > cp).map(r => r.weightHistory[cp]);
    if (vals.length > 0) {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      console.log(`  Turn ${cp}: ${avg.toFixed(1)} lbs (${vals.length} games still alive)`);
    }
  }
}

// ── Main ──
console.log('Wild Reckoning Headless Playtest');
console.log(`Running ${GAMES_PER_MODE} games per mode, max ${MAX_TURNS} turns each...\n`);

console.log('Running normal mode...');
const normalRecords = runBatch(false, GAMES_PER_MODE);
analyzeRecords(normalRecords, 'NORMAL MODE');

console.log('\nRunning fast-forward mode...');
const ffRecords = runBatch(true, GAMES_PER_MODE);
analyzeRecords(ffRecords, 'FAST-FORWARD MODE');

// Compare FF vs Normal
console.log(`\n${'='.repeat(60)}`);
console.log('  COMPARISON: Normal vs Fast-Forward');
console.log('='.repeat(60));
const normalAvgLife = normalRecords.reduce((s, r) => s + r.turnsLived, 0) / normalRecords.length;
const ffAvgLife = ffRecords.reduce((s, r) => s + r.turnsLived, 0) / ffRecords.length;
// FF turns represent 12x calendar time each
const ffCalendarWeeks = ffAvgLife * 12;
console.log(`Normal avg lifespan: ${normalAvgLife.toFixed(1)} turns (${(normalAvgLife / 52).toFixed(1)} years)`);
console.log(`FF avg lifespan: ${ffAvgLife.toFixed(1)} turns (calendar equivalent: ${(ffCalendarWeeks / 52).toFixed(1)} years)`);
console.log(`Ratio (FF calendar / Normal): ${(ffCalendarWeeks / normalAvgLife).toFixed(2)}x`);
console.log(`  (Should be ~1.0x if FF is correctly balanced)`);
