## Recently Completed (Phases 11-16)

- [x] **Technical Refactoring** — Created `PhysiologySystem` to encapsulate engine logic, added `RegionalHealth` visualization, and prepared `GameFlag` types.
- [x] **Store Modularization** — Fully migrated `gameStore.ts` to slices (`UISlice`, `GameSystemSlice`, `AnimalSlice`, `WorldSlice`, `TurnSlice`) using Zustand's slice pattern.
- [x] **Strict GameFlag Union** — Replaced `string` fallback in `src/types/flags.ts` with a comprehensive union type covering all storyline and event flags.
- [x] **Web Worker Integration** — Fully migrated `EventGenerator` logic to `EventWorker` for off-thread event generation, reducing UI stutter during turn transitions.
- [x] **Physiology System Integration** — Integrated `PhysiologySystem` into the core turn loop to handle metabolism, stress, and nutrient decay in a decoupled manner.
- [x] **Journal Synthesis** — Added cohesive journal entry generation in `TurnResultsScreen` to summarize the turn's narrative outcome.

## Gameplay Depth

- [x] **More events per species** — Double the event count for each species (~18→36+). Add event chaining where surviving one event can trigger follow-up events in subsequent turns.
- [x] **Seasonal weight/food economy** — Implement a reliable seasonal food cycle where winter drains weight consistently and summer restores it. 
- [x] **Migration system for deer** — Make the migration choice event functional: moving to a winter yard changes the region and unlocks winter-specific events.
- [x] **Aging progression** — Add age-gated event pools and stat modifiers. 

## Narrative & Atmosphere

- [x] **Persistent NPCs** — Track named herd members, a recurring rival buck, a specific wolf pack. Reference NPCs by name in events via template variables. 
- [x] **Multi-turn storylines** — Event chains that span multiple turns: drought arcs, poacher camp arcs, herd leadership arcs. 
- [x] **Illustrations** — Infrastructure for event illustrations by category and tags. Image picker integrated into event resolution. 

## UI/UX

- [x] **Choice outcome clarity** — Turn results screen between turns showing per-event outcomes, narrative results, stat effect badges, and health narratives.
- [x] **Stat trend indicators** — Trend arrows next to each stat showing whether it's rising, falling, or stable.
- [x] **Event history log** — Slide-out panel showing past turns in reverse chronological order. 
- [x] **Tooltips on stats** — Hover tooltip showing full name, description, polarity, and all active modifiers.
- [x] **Tutorial / first-turn guidance** — 4-step tutorial overlay on first game explaining core mechanics. 
- [x] **Mobile layout** — Responsive at 768px and 480px breakpoints. 
