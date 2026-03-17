/**
 * CLI Playtest script for Wild Reckoning.
 * Runs a single detailed playthrough and captures a narrative transcript.
 */

// Polyfill localStorage for Node
(global as any).localStorage = {
  getItem: (key: string) => null,
  setItem: (key: string, value: string) => {},
  removeItem: (key: string) => {},
  clear: () => {},
  length: 0,
  key: (i: number) => null,
};

import { GameAPI } from '../src/api/GameAPI';
import type { EventSummary, TurnResultSummary } from '../src/api/GameAPI';
import * as fs from 'fs';
import * as path from 'path';

async function runPlaytest() {
  const game = new GameAPI();
  const transcript: string[] = [];

  const log = (msg: string) => {
    console.log(msg);
    transcript.push(msg);
  };

  const species = 'white-tailed-deer';
  const sex = Math.random() > 0.5 ? 'male' : 'female';
  const backstory = 'wild-born';
  
  log(`=== Wild Reckoning CLI Playtest ===`);
  log(`Date: ${new Date().toISOString()}`);
  log(`Species: ${species}`);
  log(`Sex: ${sex}`);
  log(`Backstory: ${backstory}\n`);

  game.start({
    species,
    backstory,
    sex,
    difficulty: 'normal',
  });

  let turnCount = 0;
  const maxTurns = 150; // About 3 years

  while (game.isAlive && turnCount < maxTurns) {
    turnCount++;
    const snap = game.getSnapshot();
    log(`--- Turn ${snap.turn} (${snap.season} ${snap.year}, Age: ${snap.age}mo, Weight: ${snap.weight.toFixed(1)} lbs) ---`);
    log(`Stats: IMM:${snap.stats.IMM.toFixed(1)} CLI:${snap.stats.CLI.toFixed(1)} HEA:${snap.stats.HEA.toFixed(1)} STR:${snap.stats.STR.toFixed(1)}`);

    const turnInfo = game.generateTurn();
    if (turnInfo.ambientText) {
      log(`[Ambient] ${turnInfo.ambientText}`);
    }

    for (const event of turnInfo.events) {
      log(`\nEVENT: [${event.category}] ${event.narrative}`);
      if (event.type === 'active' && event.choices.length > 0) {
        // Simple AI: pick the first non-danger choice if possible
        const safeChoice = event.choices.find(c => c.style !== 'danger') || event.choices[0];
        log(`CHOICE: Selected "${safeChoice.label}"`);
        game.makeChoice(event.id, safeChoice.id);
      }
    }

    // Auto-resolve any missed choices
    game.autoChoose();

    const result = game.endTurn();
    
    if (result.eventOutcomes.length > 0) {
      log(`\nOUTCOMES:`);
      for (const outcome of result.eventOutcomes) {
        log(`- ${outcome.narrative}`);
        if (outcome.choiceNarrative) log(`  > ${outcome.choiceNarrative}`);
        if (outcome.deathRollSurvived === false) {
          log(`  !!! FAILED DEATH ROLL !!!`);
        }
      }
    }

    if (result.healthNarratives.length > 0) {
      log(`\nHEALTH:`);
      for (const hn of result.healthNarratives) {
        log(`- ${hn}`);
      }
    }

    if (result.journalEntry) {
      log(`\nJOURNAL: ${result.journalEntry}`);
    }

    // Handle pending death rolls (e.g. from predators)
    if (result.pendingDeathRolls) {
      for (const roll of result.pendingDeathRolls) {
        log(`\n!!! LETHAL THREAT: ${roll.cause} (Prob: ${(roll.baseProbability * 100).toFixed(1)}%)`);
        const escape = roll.escapeOptions[0];
        log(`ACTION: ${escape.label} - ${escape.description}`);
        const res = game.resolveDeathRoll(roll.eventId, escape.id);
        if (res.survived) {
          log(`RESULT: Survived!`);
        } else {
          log(`RESULT: Perished.`);
        }
      }
    }

    // Move randomly sometimes
    if (Math.random() > 0.7) {
      const adjacent = game.getAdjacentNodes();
      if (adjacent.length > 0) {
        const next = adjacent[Math.floor(Math.random() * adjacent.length)];
        log(`\nMOVEMENT: Moving to ${next.name || next.id} (${next.type})`);
        game.moveTo(next.id);
      }
    }

    log(`\n`);
    game.rawState.dismissResults();
  }

  const finalSnap = game.getSnapshot();
  log(`=== Playtest End ===`);
  log(`Final Turn: ${finalSnap.turn}`);
  log(`Status: ${finalSnap.alive ? 'ALIVE' : 'DEAD'}`);

  const summary = game.getRunSummary();
  log(`\n=== RUN SUMMARY ===`);
  log(`Species: ${summary.speciesName}`);
  log(`Sex: ${summary.sex}`);
  log(`Survived: ${summary.turnsLived} turns (${summary.ageMonths} months)`);
  log(`Survival Grade: ${summary.grade}`);
  log(`Total Fitness (Matured Offspring): ${summary.totalFitness}`);
  log(`Cause of Death: ${summary.causeOfDeath || 'Still Alive'}`);

  log(`\n=== LIFETIME STATS ===`);
  log(`Max Weight: ${summary.lifetimeStats.maxWeight.toFixed(1)} lbs`);
  log(`Predators Evaded: ${summary.lifetimeStats.predatorsEvaded}`);
  log(`Prey Eaten: ${summary.lifetimeStats.preyEaten}`);
  log(`Friends Made: ${summary.lifetimeStats.friendsMade}`);
  log(`Rivals Defeated: ${summary.lifetimeStats.rivalsDefeated}`);
  log(`Distance Traveled: ${summary.lifetimeStats.distanceTraveled}`);
  log(`Weather Events Survived: ${summary.lifetimeStats.weatherEventsSurvived}`);
  
  log(`\n=== LIFE TIMELINE ===`);
  for (const entry of summary.timeline) {
    log(`[Turn ${entry.turn}: ${entry.month} Yr ${entry.year}] (${entry.category.toUpperCase()}) ${entry.text}`);
  }

  // Save transcript
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `playtest-${species}-${timestamp}.txt`;
  const dir = path.join(process.cwd(), 'playtests');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, transcript.join('\n'));
  console.log(`\nTranscript saved to ${filePath}`);
}

runPlaytest().catch(err => {
  console.error(err);
  process.exit(1);
});
