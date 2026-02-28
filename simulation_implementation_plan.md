# Simulation Transition — Status

## Summary

The simulation transition is complete through Phases A, B, and the data-driven refactor (trigger extraction, narrative expansion, weather extraction). The species unlock system (Phase C) remains as future work.

### Completed Work

**Phase A: Fix Build & Wire Causal Chains** — Done

- Fixed `causalChain.ts` unused parameter
- Fixed `HealthSystem.ts` passing `turn: 0` — now passes actual turn
- Wired `buildCausalChains()` into `killAnimal()` in `animalSlice.ts`
- Added `causalChains?: CausalChain[]` to `AnimalState`
- Updated trigger count comment in `SimEventGenerator.ts`

**Phase B: Causal Chain Debriefing UI** — Done

- Created `src/components/CausalChainPanel.tsx` — reads `animal.causalChains`, renders connected visual chains with color-coded timeline dots
- Created `src/styles/causalchain.module.css` — timeline styling with collapsible chain cards, fatal chain highlighting
- Integrated into `DeathScreen.tsx` between cause-of-death text and fitness box

**Data-Driven Trigger Extraction** — Done

Extracted all 8 trigger categories from hardcoded implementations into config data + factory functions:

| Category | Config file | Factory file |
|---|---|---|
| Environmental | `events/data/environmentalConfigs.ts` | `events/factories/environmentalFactory.ts` |
| Foraging | `events/data/foragingConfigs.ts` | `events/factories/foragingFactory.ts` |
| Social | `events/data/socialConfigs.ts` | `events/factories/socialFactory.ts` |
| Seasonal | `events/data/seasonalConfigs.ts` | `events/factories/seasonalFactory.ts` |
| Migration | `events/data/migrationConfigs.ts` | `events/factories/migrationFactory.ts` |
| Reproduction | `events/data/reproductionConfigs.ts` | `events/factories/reproductionFactory.ts` |
| Health | `events/data/healthConfigs.ts` | `events/factories/healthFactory.ts` |
| Pressure | `events/data/pressureConfigs.ts` | `events/factories/pressureFactory.ts` |
| Predator | `events/data/predatorConfigs.ts` | `events/factories/predatorFactory.ts` |

Trigger files reduced from ~3,500 lines of hardcoded logic to ~100 lines of factory calls.

**Narrative Template Expansion** — Done

- Created `src/simulation/narrative/templates/shared.ts` — `ContextualFragment` type with optional season/terrain/weather/timeOfDay/isRecurring filters, `pickContextual()` utility
- Expanded all 7 template files (predator, environment, foraging, social, migration, reproduction, injury) with 100+ new context-aware fragments
- Wired template pools into foraging, environmental, and social factories for playthrough-varying narrative text

**Weather Data Extraction** — Done

- Created `src/engine/data/weatherConfig.ts` — declarative `WEATHER_TYPE_CONFIGS` table with base weights, persistence/intensity ranges, penalties, event multipliers; `TEMPERATURE_RULES`, `PRECIPITATION_RULES`, `SEASON_RULES` arrays
- Rewrote `WeatherSystem.ts` to use data-driven lookups from config instead of switch/if-else chains
- All 9 WeatherSystem tests pass unchanged

---

## Remaining Work

### Phase C: Species Unlock System

**Goal**: Beat the game as deer (have offspring that survive to adulthood) to unlock gray wolf. The vision doc says "hunting sheep as a lion should make you remember what it's like to be hunted."

#### C1. Unlock state types

- New file: `src/types/unlock.ts` — `SpeciesUnlock` interface, `UnlockCondition` type, `UNLOCK_CHAIN` constant
- Unlock chain: `white-tailed-deer` (default) → `gray-wolf` → future species
- Condition: `{ type: 'offspring_survived', speciesId: 'white-tailed-deer', count: 1 }`

#### C2. Unlock persistence

- `src/store/persistence.ts`: add `unlockedSpecies: string[]` to a new `META_STORAGE_KEY` (separate from save game — persists across runs)
- Helper functions: `getUnlockedSpecies()`, `unlockSpecies(id)`, `isSpeciesUnlocked(id)`

#### C3. Check unlock on death

- `src/components/DeathScreen.tsx`: after rendering the grade, check if any offspring survived to adulthood. If so, call `unlockSpecies('gray-wolf')` and show an unlock notification.

#### C4. Gate species selection

- `src/components/SpeciesSelect.tsx` (or equivalent menu component): show locked species as grayed-out with unlock hint text ("Survive as a deer to unlock")

---

## Current State

- 44 triggers, 85 tests passing, TypeScript compilation clean
- All trigger categories use data-driven config + factory pattern
- Narrative templates use contextual fragment selection for variety
- Weather system uses declarative config table
- Causal chains built on death, displayed in CausalChainPanel on death screen
- Debriefing panel shows flat timeline below causal chains
