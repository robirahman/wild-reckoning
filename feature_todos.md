# Six Biological Mechanics: Interspecific Competition, Disease, Dispersal, Pack Hunting, Thermal Stress, Infanticide

## Context

The game has deep mechanics for predation, parasitism, mate competition, female competition, and starvation. Six biologically significant mechanics are missing: competition with other species, acute disease, juvenile dispersal, cooperative hunting, temperature-driven metabolism, and infanticide. This plan adds all six with minimal engine changes (~47 lines across 6 files) and ~3,300 lines of new species data.

---

## Shared Engine Changes (Completed \u2705)

### `src/types/events.ts` \u2014 Add 4 new EventCondition types [x]

Added to the `EventCondition` union:
```
| { type: 'population_above'; speciesName: string; threshold: number }
| { type: 'population_below'; speciesName: string; threshold: number }
| { type: 'has_npc'; npcType: 'rival' | 'ally' | 'mate' | 'predator' | 'offspring' }
| { type: 'no_npc'; npcType: 'rival' | 'ally' | 'mate' | 'predator' | 'offspring' }
```

### `src/engine/EventGenerator.ts` & `EventWorker.ts` \u2014 Add condition cases + ecosystem context [x]

1. Added `ecosystem?: EcosystemState` to `GenerationContext`.
2. Added 4 cases to `checkCondition()` switch in both generator and worker.

### `src/engine/TurnProcessor.ts` \u2014 Pass ecosystem to context [x]

Passed `ecosystem` to the generation context.

---

## Feature 1: Interspecific Competition [x]

Other species contest the player's food, territory, or nesting sites. Connected via `population_above`/`population_below` conditions.

---

## Feature 2: Disease/Epidemic [x]

Acute diseases modeled as ParasiteDefinitions. 

---

## Feature 3: Dispersal / Territory Founding [x]

Multi-event chains using flag gating for young animals.

---

## Feature 4: Cooperative / Pack Hunting [x]

Uses `has_npc`/`no_npc` conditions.

---

## Feature 5: Thermal Stress [x]

### Engine changes (Completed \u2705)

Implemented in `PhysiologySystem.ts` and `turnSlice.ts`.

---

## Feature 6: Infanticide [x]

### Engine change (Completed \u2705)

Implemented in `ReproductionSystem.ts`.

