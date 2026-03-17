# Wild Reckoning — Programmatic API

Wild Reckoning is a fully client-side animal survival simulation. There is no server — all game logic runs locally in the browser. 

There are two ways to play programmatically:
1. **TypeScript API**: Import `GameAPI` class directly (best for local scripts/testing).
2. **Web REST API**: Interact via HTTP fetch at `/api/` (best for external integrations or console play).

---

## 1. Web REST API (Browser-based)

The game provides a REST-like interface at `https://www.robirahman.com/wild-reckoning/api/` using a Service Worker. 

- **Independent State**: This API maintains its own game state in IndexedDB, completely separate from your main browser tab's UI session.
- **Client-Side Only**: Requests are intercepted locally by your browser; no data is sent to a server.
- **Interactive Documentation**: Visit [/api/](https://www.robirahman.com/wild-reckoning/api/) in your browser to see the full list of endpoints and usage examples.

### Example Usage (from Console)

```javascript
// 1. Start a game
const res = await fetch('/wild-reckoning/api/start', {
  method: 'POST',
  body: JSON.stringify({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female' })
});
console.log(await res.json());

// 2. Advance the turn
const turn = await (await fetch('/wild-reckoning/api/turn', { method: 'POST' })).json();
console.log(turn.events[0].narrative);

// 3. Make a choice
await fetch('/wild-reckoning/api/choice', {
  method: 'POST',
  body: JSON.stringify({ eventId: turn.events[0].id, choiceId: turn.events[0].choices[0].id })
});

// 4. Resolve the turn
const result = await (await fetch('/wild-reckoning/api/end-turn', { method: 'POST' })).json();
console.log(result.journalEntry);
```

---

## 2. TypeScript API (Headless)

The `GameAPI` class (`src/api/GameAPI.ts`) provides a headless interface for playing the game programmatically.

### Quick Start

```typescript
import { GameAPI } from './src/api/GameAPI';
import { createGameStore } from './src/store/gameStore';

// For an independent instance:
const store = createGameStore();
const game = new GameAPI(store);

// 1. Start a game
game.start({
  species: 'white-tailed-deer',
  backstory: 'wild-born',
  sex: 'female',
  difficulty: 'normal',
  seed: 42,             // optional, for reproducible RNG
});

// 2. Game loop
while (game.isAlive) {
  const turn = game.generateTurn();

  // Inspect events and make choices
  for (const event of turn.events) {
    if (event.type === 'active' && event.choices.length > 0) {
      game.makeChoice(event.id, event.choices[0].id);
    }
  }

  const result = game.endTurn();

  // Handle death rolls if any
  if (result.pendingDeathRolls) {
    for (const roll of result.pendingDeathRolls) {
      game.resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
    }
  }
}

// 3. Check cause of death
const snapshot = game.getSnapshot();
console.log(snapshot.causeOfDeath);
```

## Available Species

Access via `GameAPI.speciesIds`:

| ID | Species |
|----|---------|
| `white-tailed-deer` | White-Tailed Deer |
| `african-elephant` | African Elephant |
| `chinook-salmon` | Chinook Salmon |
| `polar-bear` | Polar Bear |
| `green-sea-turtle` | Green Sea Turtle |
| `monarch-butterfly` | Monarch Butterfly |
| `fig-wasp` | Fig Wasp |
| `common-octopus` | Common Octopus |
| `honeybee-worker` | Honeybee Worker |
| `arctic-tern` | Arctic Tern |
| `poison-dart-frog` | Poison Dart Frog |
| `chicken` | Chicken |
| `pig` | Pig |

## Backstories

Access via `GameAPI.backstoryOptions`:

| Type | Label | Effect |
|------|-------|--------|
| `rehabilitation` | Rehabilitated & Released | +TRA, +NOV, -WIS, -ADV |
| `wild-born` | Wild Born | +WIS, +TRA, +ADV |
| `orphaned` | Orphaned Young | +TRA, +ADV, +WIS, -HEA |

## API Reference

### Lifecycle

#### `start(opts: StartOptions): GameSnapshot`

Start a new game. Returns the initial game snapshot.

```typescript
interface StartOptions {
  species: string;          // Species ID (see table above)
  backstory: string;        // 'wild-born' | 'rehabilitation' | 'orphaned'
  sex: 'male' | 'female';
  difficulty?: 'easy' | 'normal' | 'hard';  // default: 'normal'
  seed?: number;            // RNG seed for reproducibility
}
```

#### `reset(): void`

End the current game and return to menu state.

---

### Turn Flow

The core game loop is: **generateTurn() → makeChoice() → endTurn()**.

#### `generateTurn(): TurnInfo`

Advance the simulation clock by one turn and generate events. After calling this, inspect the events, make choices for all active events, then call `endTurn()`.

```typescript
interface TurnInfo {
  turn: number;
  month: number;
  year: number;
  season: string;           // 'spring' | 'summer' | 'fall' | 'winter'
  events: EventSummary[];
  pendingChoices: string[];  // Event IDs that require a choice
  ambientText: string | null;
}

interface EventSummary {
  id: string;
  type: 'active' | 'passive';  // 'active' = requires choice
  category: string;             // 'foraging', 'predator', 'social', etc.
  narrative: string;            // Descriptive text for the event
  choices: ChoiceSummary[];
  tags: string[];
  choiceMade?: string;          // Set after makeChoice()
}

interface ChoiceSummary {
  id: string;
  label: string;
  description?: string;
  style: 'default' | 'danger';
}
```

#### `makeChoice(eventId: string, choiceId: string): void`

Select a choice for an active event. Must be called for every event in `pendingChoices` before calling `endTurn()`.

#### `autoChoose(): Array<{ eventId: string; choiceId: string }>`

Auto-select the first choice for all pending events. Returns the choices made. Useful for testing or fast-forwarding.

#### `endTurn(): TurnResultSummary`

Resolve all choices and apply effects. Throws if there are unresolved pending choices.

```typescript
interface TurnResultSummary {
  eventOutcomes: {
    eventId: string;
    narrative: string;
    choiceLabel?: string;
    choiceId?: string;
    choiceNarrative?: string;
    deathRollSurvived?: boolean;
    deathRollProbability?: number;
    weightChange: number;
  }[];
  healthNarratives: string[];   // Descriptions of health changes
  weightChange: number;         // Net weight change this turn
  newParasites: string[];
  newInjuries: string[];
  statDelta: StatSnapshot;      // Change in each stat this turn
  pendingDeathRolls?: {         // Present if animal faces lethal danger
    eventId: string;
    cause: string;
    baseProbability: number;
    escapeOptions: {
      id: string;
      label: string;
      description: string;
      survivalModifier: number;
    }[];
  }[];
  journalEntry?: string;        // Narrative summary of the turn
}
```

#### `resolveDeathRoll(eventId: string, escapeOptionId: string): { survived: boolean }`

Resolve a pending death roll by selecting an escape option. Must be called if `endTurn()` returned `pendingDeathRolls`.

---

### Behavioral Settings

#### `setBehavior(key: string, value: 1 | 2 | 3 | 4 | 5): void`

Adjust a behavioral slider. These influence which events are generated and their probabilities.

| Key | Effect |
|-----|--------|
| `foraging` | Time spent seeking food |
| `belligerence` | Aggression in confrontations |
| `mating` | Reproductive drive |
| `exploration` | Tendency to discover new areas |
| `sociability` | Interaction with other animals |
| `caution` | Risk aversion and danger avoidance |

---

### Movement

#### `moveTo(nodeId: string): void`

Move the animal to an adjacent map node.

#### `getAdjacentNodes(): Array<{ id: string; type: string; name?: string }>`

Get the list of map nodes the animal can move to from its current location.

---

### State Inspection

#### `getSnapshot(): GameSnapshot`

Get a compact snapshot of the current game state.

```typescript
interface GameSnapshot {
  phase: string;            // 'menu' | 'playing' | 'dead' | 'evolving'
  turn: number;
  month: number;
  year: number;
  season: string;
  species: string;
  sex: string;
  age: number;              // In months
  weight: number;           // In lbs
  alive: boolean;
  causeOfDeath?: string;
  stats: StatSnapshot;
  parasites: string[];      // Active parasite IDs
  injuries: string[];       // Active injury IDs
  conditions: string[];     // Active condition IDs
  flags: string[];          // Persistent game flags
  behavioralSettings: BehavioralSettings;
  energy: number;
}
```

#### `getStatSnapshot(): StatSnapshot`

Get computed effective stat values.

```typescript
// StatSnapshot is Record<StatId, number> where StatId is:
type StatSnapshot = {
  IMM: number;   // Immune system strength
  CLI: number;   // Climate tolerance
  HOM: number;   // Homeostasis
  TRA: number;   // Trauma
  ADV: number;   // Adversity
  NOV: number;   // Novelty
  WIS: number;   // Wisdom
  HEA: number;   // Health (0 = death)
  STR: number;   // Aggregate stress
}
```

#### `isAlive: boolean`

Whether the game is still in progress.

#### `phase: string`

Current game phase: `'menu'` | `'playing'` | `'dead'` | `'evolving'`.

#### `rawState: GameState`

Access the full Zustand store state for advanced inspection.

---

### Batch Simulation

#### `simulate(maxTurns, choiceStrategy?): TurnLog[]`

Run the game for up to `maxTurns` turns automatically, returning a log of every turn.

```typescript
game.start({ species: 'white-tailed-deer', backstory: 'wild-born', sex: 'female', seed: 42 });

// Default: auto-picks first choice for every event
const log = game.simulate(100);

// Custom strategy: always pick the "danger" option if available
const log = game.simulate(100, (events) => {
  return events
    .filter(e => e.type === 'active' && e.choices.length > 0)
    .map(e => ({
      eventId: e.id,
      choiceId: e.choices.find(c => c.style === 'danger')?.id ?? e.choices[0].id,
    }));
});

// Each entry in the log:
interface TurnLogEntry {
  turn: number;
  result: TurnResultSummary;
  snapshot: GameSnapshot;
}
```

---

## Architecture Notes

- **No server**: The game is 100% client-side. The `GameAPI` drives the same Zustand store and engine modules as the React UI.
- **Deterministic**: Pass a `seed` to `start()` for reproducible games. The RNG is a seeded Mersenne Twister.
- **Event generation**: Uses a composable template pipeline — situation detection scans world state, templates match against situations, weighted selection picks events, then templates resolve into concrete events with narrative text and choices.
- **Persistence**: The UI persists state to `localStorage`. The `GameAPI` does not auto-persist; use `rawState` if you need to serialize.
