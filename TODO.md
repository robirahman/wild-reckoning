## Recently Completed (Phases 11-15)

- [x] **Evolution System** — Implemented genetic mutations and selection UI.
- [x] **Map & Navigation** — Regional maps with nodes, resources, and hazard tracking.
- [x] **Multi-generational Lineage** — Inheritance system for traits and stat biases.
- [x] **Ecosystem Web** — Dynamic population tracking and trophic cascades.
- [x] **Social Dynamics** — Hierarchy challenges and eusocial hive mechanics.
- [x] **Advanced Biological Mechanics** — Interspecific competition, acute diseases, dispersal chains, and thermal stress.
- [x] **Expanded Biodiversity** — Added 7 new species (Turtle, Bear, Monarch, Bee, Wasp, Octopus, Tern) with unique logic.

## Gameplay Depth

- [x] **More events per species** — Double the event count for each species (~18→36+). Add event chaining where surviving one event can trigger follow-up events in subsequent turns (e.g., surviving a wolf attack triggers PTSD flashbacks, fleeing hunters leads to discovering new foraging grounds).
- [x] **Seasonal weight/food economy** — Implement a reliable seasonal food cycle where winter drains weight consistently and summer restores it. Foraging events should be the primary weight-gain mechanism, with seasonal modifiers making food scarce in winter and abundant in summer/autumn. Add a per-turn passive weight change based on season and foraging behavioral setting.
- [x] **Migration system for deer** — Make the migration choice event functional: moving to a winter yard changes the region, unlocks winter-specific events (sheltered foraging, reduced predation, increased competition/disease), and returning in spring opens spring-specific events. Region changes should affect which events are eligible.
- [x] **Aging progression** — Add age-gated event pools and stat modifiers. Young animals (< 18 months) get vulnerability penalties and learning events. Prime adults (2-6 years for deer) get peak stats. Elderly animals (> 8 years) get declining HEA, slower healing, and wisdom-based events. Age phases should be visible in the UI.

## Narrative & Atmosphere

- [x] **Persistent NPCs** — Track named herd members, a recurring rival buck, a specific wolf pack. Store NPC state in the game store. Reference NPCs by name in events via template variables. NPC names auto-introduced after turn 3.
- [x] **Multi-turn storylines** — Event chains that span multiple turns: drought arcs, poacher camp arcs, herd leadership arcs, upstream migration challenges. Flag-based progression with configurable delays between steps.
- [x] **Illustrations** — Infrastructure for event illustrations by category and tags. Image picker integrated into event resolution. Drop images into `public/images/events/{category}/` and register in `src/data/illustrations.ts`.

## UI/UX

- [x] **Choice outcome clarity** — Turn results screen between turns showing per-event outcomes, narrative results, stat effect badges, consequence summaries, death roll survival info, and health narratives.
- [x] **Stat trend indicators** — Trend arrows next to each stat showing whether it's rising, falling, or stable over the last 4 turns. Respects stat polarity (stress stats show reversed colors).
- [x] **Event history log** — Slide-out panel (toggled via "History" button in header) showing past turns in reverse chronological order. Each entry expandable to show events and choices made.
- [x] **Tooltips on stats** — Hover tooltip showing full name, description, polarity, and all active modifiers with sources and amounts.
- [x] **Tutorial / first-turn guidance** — 4-step tutorial overlay on first game explaining core mechanics. Skippable, with "Don't show again" persistence via localStorage.
- [x] **Mobile layout** — Responsive at 768px and 480px breakpoints. Vertical stack, larger touch targets, compact stats and headers.

## Systems

- [x] **Save/load** — Auto-save to localStorage after each turn (with events populated). Resume button on start screen. Save deleted on death. Handles Set<string> serialization and Rng state preservation.
- [x] **Difficulty modes** — Easy/Normal/Hard with multipliers for death chance, weight loss/gain, parasite progression, and predator encounter rate. Selector on start screen.
- [x] **Achievement/unlock system** — 15 achievements tracked persistently across sessions. Toast popup on unlock. Achievement list on start and death screens. Includes survival milestones, fitness goals, species diversity, and difficulty challenges.
- [x] **Sound design** — AudioManager singleton using Web Audio API. Ambient loops per season, SFX stings per event category/tag. Volume controls and mute persistence. Drop audio files into `public/audio/` and register in `src/audio/AudioAssets.ts`.
