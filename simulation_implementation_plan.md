# Simulation Transition — Status

## Summary

The simulation transition is complete through all planned phases: A, B, data-driven refactor (trigger extraction, narrative expansion, weather extraction), and Phase C (species unlock system).

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

**Phase C: Species Unlock System** — Done

- Added `deer-offspring-survived` achievement (checked on death) — having any offspring survive to adulthood as deer
- Changed gray wolf unlock from `{ type: 'default' }` to `{ type: 'achievement', achievementId: 'deer-offspring-survived' }`
- Added species unlock notification on death screen (green banner with unlock icon)
- Leveraged existing infrastructure: `achievementStore.ts` persistence, `AchievementChecker.ts` death checks, `StartScreen.tsx` species gating UI
- Full unlock chain: deer (default) → wolf (deer offspring survived) → polar bear, elephant, salmon (various achievements) → turtle, octopus → frog, butterfly → tern → honeybee → fig wasp

---

## Current State

- 44 triggers, 85 tests passing, TypeScript compilation clean
- All trigger categories use data-driven config + factory pattern
- Narrative templates use contextual fragment selection for variety
- Weather system uses declarative config table
- Causal chains built on death, displayed in CausalChainPanel on death screen
- Debriefing panel shows flat timeline below causal chains
- Species unlock progression: gray wolf locked behind deer offspring survival achievement
- All planned phases complete
