# Plan: Complete the Simulation Transition

## Context

The game has gone through two major implementation efforts:

1. **Simulation Refactor** (Phases 0–8): Built anatomy ontology, harm physics, physiology engine, 5 interaction resolvers, 44 simulation triggers, calibration system, instinct nudging. 39/41 deer events are simulated.

2. **Simulation Deepening** (Phases 1–5): Added world memory, condition cascades, spatial dynamics, NPC behavior state machine, and a causal chain builder.

The underlying simulation is rich and mostly wired. But several pieces remain **dead code or partially connected**, and the player never *sees* the emergent chains that the simulation produces. The debriefing shows a flat timeline of events — not the connected story of how a wolf bite led to starvation 10 turns later.

**Current state:**
- 44 triggers, 85 tests passing
- 1 build error: `causalChain.ts` line 99 — unused `memory` parameter
- `buildCausalChains()` is never called anywhere (dead code)
- `HealthSystem.ts` passes `turn: 0` instead of actual turn (breaks causal chain matching)
- Movement cost, NPC behavior, node resources, condition cascades — all wired and working
- Debriefing panel exists but only shows flat entries, no chain visualization

The vision document asks for: (a) emergent feedback loops visible to the player, (b) a debriefing that replays events in clinical language, (c) species unlock progression. Item (a) mostly exists in the engine but isn't surfaced. Items (b) and (c) are the remaining work.

---

## Phase A: Fix Build & Wire Causal Chains

**Goal**: Make `buildCausalChains()` live code that produces connected chains on the death screen.

### A1. Fix build error in `causalChain.ts`

- `src/simulation/memory/causalChain.ts` line 99: prefix `memory` → `_memory` in `traceChainFromEvent`

### A2. Fix `turn: 0` in HealthSystem

- `src/engine/HealthSystem.ts`: `tickBodyState()` receives a new `turn: number` parameter (after `ffMult`)
- Pass it into `tickConditionProgression({ ..., turn })`
- `src/engine/TurnProcessor.ts` → `resolveTurn()`: pass `state.time.turn` to `tickBodyState()`
- This ensures `conditionProgression.acquiredTurn` matches the actual turn, enabling causal chain matching

### A3. Wire `buildCausalChains` into the death flow

- `src/store/slices/animalSlice.ts` → `killAnimal()`: when the animal dies, call `buildCausalChains()` with `worldMemory`, `bodyState.conditionProgressions`, and `causeOfDeath`. Store result on `animal.causalChains`.
- Add `causalChains?: CausalChain[]` to `AnimalState` in `src/types/species.ts`
- Import `buildCausalChains` from `src/simulation/memory/causalChain.ts`

### A4. Update trigger comment

- `src/simulation/events/SimEventGenerator.ts`: update the stale "41 simulation triggers" comment to "44"

### Files modified
- `src/simulation/memory/causalChain.ts` (fix unused param)
- `src/engine/HealthSystem.ts` (add turn param)
- `src/engine/TurnProcessor.ts` (pass turn)
- `src/types/species.ts` (add causalChains to AnimalState)
- `src/store/slices/animalSlice.ts` (call buildCausalChains on death)
- `src/simulation/events/SimEventGenerator.ts` (comment fix)

---

## Phase B: Causal Chain Debriefing UI

**Goal**: The death screen shows connected causal chains — "how you actually died" — before the flat timeline.

### B1. Create `CausalChainPanel` component

- New file: `src/components/CausalChainPanel.tsx`
- Reads `animal.causalChains` from the store
- Renders each chain as a connected visual:
  ```
  ┌ Turn 14: Wolf pack encounter ─── Laceration (right hind leg)
  │ Turn 17: Wound infected ─── Bacterial infection spreading
  │ Turn 20: Fever onset ─── Core temperature elevated
  │ Turn 22: Foraging failure ─── Too weak to browse effectively
  └ Turn 24: Starvation ─── FATAL
  ```
- Fatal chains get a highlighted border/background
- Non-fatal chains (recovered injuries) shown in muted style
- Falls back gracefully: if no chains, renders nothing (backward compatible)

### B2. Add CSS module

- New file: `src/styles/causalChain.module.css`
- Connected-line visual using CSS borders (left border with dot markers)
- Fatal chain styling vs. recovered chain styling

### B3. Integrate into DeathScreen

- `src/components/DeathScreen.tsx`: render `<CausalChainPanel />` between the cause-of-death header and `<DebriefingPanel />`
- Only renders when causal chains exist (simulation species)

### Files created
- `src/components/CausalChainPanel.tsx`
- `src/styles/causalChain.module.css`

### Files modified
- `src/components/DeathScreen.tsx` (add CausalChainPanel)

---

## Phase C: Species Unlock System

**Goal**: Beat the game as deer (have offspring that survive to adulthood) → unlock gray wolf. The vision doc says "hunting sheep as a lion should make you remember what it's like to be hunted."

### C1. Unlock state types

- New file: `src/types/unlock.ts` — `SpeciesUnlock` interface, `UnlockCondition` type, `UNLOCK_CHAIN` constant
- Unlock chain: `white-tailed-deer` (default) → `gray-wolf` → future species
- Condition: `{ type: 'offspring_survived', speciesId: 'white-tailed-deer', count: 1 }`

### C2. Unlock persistence

- `src/store/persistence.ts`: add `unlockedSpecies: string[]` to a new `META_STORAGE_KEY` (separate from save game — persists across runs)
- Helper functions: `getUnlockedSpecies()`, `unlockSpecies(id)`, `isSpeciesUnlocked(id)`

### C3. Check unlock on death

- `src/components/DeathScreen.tsx`: after rendering the grade, check if any offspring survived to adulthood. If so, call `unlockSpecies('gray-wolf')` and show an unlock notification.

### C4. Gate species selection

- `src/components/SpeciesSelect.tsx` (or equivalent menu component): show locked species as grayed-out with unlock hint text ("Survive as a deer to unlock")

### Files created
- `src/types/unlock.ts`

### Files modified
- `src/store/persistence.ts` (meta storage for unlocks)
- `src/components/DeathScreen.tsx` (unlock check + notification)
- `src/components/SpeciesSelect.tsx` or equivalent (gate locked species)

---

## Phase D: Memory & Housekeeping

### D1. Update MEMORY.md

- Mark Phases 2–5 of Simulation Deepening as complete
- Document the new causal chain system and species unlock

### D2. Update stale code comments

- SimEventGenerator trigger count
- Any other outdated comments found during implementation

---

## Implementation Order

```
Phase A (Fix & Wire)      ← fixes build, enables causal chains
  ↓
Phase B (Debriefing UI)   ← makes simulation chains visible to player
  ↓
Phase C (Species Unlock)  ← progression system from vision doc
  ↓
Phase D (Housekeeping)    ← memory + comments
```

Phases A and B are tightly coupled (A produces data, B displays it). Phase C is independent. Phase D is last.

---

## Verification

- **Phase A**: `tsc -b` clean, 85 tests pass. Die in game → `animal.causalChains` is populated.
- **Phase B**: Die from a wound cascade. Death screen shows a connected chain: "Wolf encounter → Laceration → Infection → Fever → Starvation." Flat debriefing still shows below.
- **Phase C**: Complete a deer run with surviving offspring. Gray wolf appears as unlocked in species menu. New browser session: wolf is still unlocked (meta persistence). Without offspring surviving: wolf stays locked.
- **Phase D**: MEMORY.md reflects current codebase state.
