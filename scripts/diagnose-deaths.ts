{
  const store: Record<string, string> = {};
  (globalThis as any).localStorage = {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { for (const k of Object.keys(store)) delete store[k]; },
    get length() { return Object.keys(store).length; },
    key: (i: number) => Object.keys(store)[i] ?? null,
  };
}

import { GameAPI } from '../src/api/GameAPI';

const species = process.argv[2] || 'white-tailed-deer';
const backstory = process.argv[3] || 'wild-born';
const deaths: string[] = [];

for (let i = 0; i < 30; i++) {
  const g = new GameAPI();
  const sex = i % 2 === 0 ? 'male' as const : 'female' as const;
  g.start({ species, backstory, sex, seed: 4000 + i });

  for (let t = 0; t < 300; t++) {
    if (!g.isAlive) break;
    (g as any).autoMove();
    g.generateTurn();
    g.autoChoose('cautious');
    try {
      const r = g.endTurn();
      if (r.pendingDeathRolls) {
        for (const roll of r.pendingDeathRolls) {
          if (roll.escapeOptions.length > 0) g.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
        }
      }
    } catch { break; }
    try { (g as any)._store.setState({ showingResults: false, turnResult: null }); } catch {}
  }
  const snap = g.getSnapshot();
  if (snap.causeOfDeath) deaths.push(snap.causeOfDeath);
}

// Count and sort
const counts: Record<string, number> = {};
for (const d of deaths) counts[d] = (counts[d] || 0) + 1;
const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

console.log(`\nRaw death causes for ${species} (${deaths.length} deaths, simulate() with autoMove):\n`);
for (const [cause, count] of sorted) {
  console.log(`  ${String(count).padStart(3)}  ${cause.slice(0, 120)}`);
}
