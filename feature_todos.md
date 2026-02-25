# Six Biological Mechanics: Interspecific Competition, Disease, Dispersal, Pack Hunting, Thermal Stress, Infanticide

## Context

The game has deep mechanics for predation, parasitism, mate competition, female competition, and starvation. Six biologically significant mechanics are missing: competition with other species, acute disease, juvenile dispersal, cooperative hunting, temperature-driven metabolism, and infanticide. This plan adds all six with minimal engine changes (~47 lines across 6 files) and ~3,300 lines of new species data.

---

## Shared Engine Changes (do first — Features 1 + 4 combined)

### `src/types/events.ts` — Add 4 new EventCondition types

Add to the `EventCondition` union:
```
| { type: 'population_above'; speciesName: string; threshold: number }
| { type: 'population_below'; speciesName: string; threshold: number }
| { type: 'has_npc'; npcType: 'rival' | 'ally' | 'mate' | 'predator' | 'offspring' }
| { type: 'no_npc'; npcType: 'rival' | 'ally' | 'mate' | 'predator' | 'offspring' }
```

### `src/engine/EventGenerator.ts` — Add condition cases + ecosystem context

1. Add `ecosystem?: EcosystemState` to `GenerationContext` interface.
2. Add 4 cases to `checkCondition()` switch:
   - `population_above`: check `ctx.ecosystem?.populations[speciesName].level > threshold`
   - `population_below`: check `ctx.ecosystem?.populations[speciesName].level < threshold`
   - `has_npc`: check `ctx.npcs?.some(n => n.type === npcType && n.alive)`
   - `no_npc`: check `!ctx.npcs?.some(n => n.type === npcType && n.alive)`

### `src/engine/TurnProcessor.ts` — Pass ecosystem to context

Add `ecosystem: state.ecosystem` to the `generateTurnEvents()` call.

---

## Feature 1: Interspecific Competition (~600 lines, events only)

Other species contest the player's food, territory, or nesting sites. Uses the new `population_above`/`population_below` conditions to connect ecosystem state to event triggering.

### Events per species (1-2 each):

| Species | Event ID | Competitor | Trigger |
|---|---|---|---|
| Gray Wolf | `wolf-cougar-kill-contest` | Cougar | `population_above` Cougar > 0 |
| Gray Wolf | `wolf-coyote-scavenging` | Coyotes | `population_above` Coyote > 0.5 |
| White-Tailed Deer | `deer-coyote-fawn-threat` | Coyotes | `population_above` Coyote > 0, spring/summer |
| Polar Bear | `pb-rival-bear-seal-contest` | Another bear | Season spring/winter |
| Polar Bear | `pb-arctic-fox-scavenge` | Arctic fox | Passive, narrative + minor WIS |
| Arctic Tern | `tern-skua-kleptoparasitism` | Great skua | Season summer, has_flag `at-colony` or region |
| Chinook Salmon | `salmon-bear-gauntlet` | Bears | has_flag `spawning-migration-begun` |
| Green Sea Turtle | `turtle-fish-seagrass-competition` | Herbivorous fish | Season summer |
| Common Octopus | `octopus-moray-den-contest` | Moray eel | has_flag `settled-on-reef` |

Each event follows this pattern:
- **Active event** with 2-3 choices: fight (risk injury, keep food/territory), share/avoid, yield
- **Sub-events** for fight injuries at 10-25% chance, reusing existing injury types
- **Consequences**: `modify_weight` for food contests, `modify_territory` for territory contests, `modify_population` for feedback loops
- **Tags**: `foraging`, `confrontation` for behavioral multiplier

---

## Feature 2: Disease/Epidemic (~1,100 lines, data only — no engine changes)

Acute diseases modeled as ParasiteDefinitions with disease-appropriate parameters (faster progression, higher lethality, social/environmental transmission narrative). Uses the existing parasite system unchanged.

### New disease definitions (added to species parasites.ts files):

| Species | Disease ID | Stages | Lethality | Transmission |
|---|---|---|---|---|
| White-Tailed Deer | `epizootic-hemorrhagic-disease` | 3 (subclinical → hemorrhagic → fatal) | High | Biting midges, summer/autumn |
| Gray Wolf | `parvovirus` | 3 | Medium-high | Social contact, pups vulnerable |
| Polar Bear | `morbillivirus` | 4 | Medium | Seal consumption |
| Green Sea Turtle | `fibropapillomatosis` | 4 (tumors → obstruction → organ → death) | Slow but high | Herpesvirus, warm water |
| Chinook Salmon | `bacterial-kidney-disease` | 4 | Slow, chronic | Environmental, always present |
| Common Octopus | `vibriosis` | 3 | Fast onset, moderate | Warm water bacterial |
| Arctic Tern | `avian-cholera` | 3 | High in colonies | Colonial density |
| American Bison | `brucellosis` | 3 | Chronic, affects reproduction | Herd contact |

### Disease exposure events (1-2 per species):

Pattern: passive health event → sub-event with infection chance (10-20%) gated by `no_parasite` condition. Conditions use season, region, and social flags to simulate realistic transmission.

Example structure:
- `deer-ehd-midge-exposure`: summer/autumn, passive, sub-event 15% chance → `add_parasite: epizootic-hemorrhagic-disease`
- `wolf-parvovirus-social-exposure`: has_flag `pack-member` or has_npc ally, sub-event 12% → `add_parasite: parvovirus`
- `turtle-fibropapilloma-exposure`: warm water regions, sub-event 10% → `add_parasite: fibropapillomatosis`

---

## Feature 3: Dispersal / Territory Founding (~685 lines, data only — no engine changes)

Multi-event chains using flag gating for young animals leaving natal range. Each species gets a 3-5 event sequence:

### Flag chain: `dispersal-pressure` → `dispersal-begun` → `dispersal-settled`

### Gray Wolf (5 events):
1. **`wolf-dispersal-pressure`**: age 18-36, autumn. Passive. Restlessness, sleeping apart. Sets `dispersal-pressure`.
2. **`wolf-dispersal-decision`**: has `dispersal-pressure`. Active. Leave pack or stay. Sets `dispersal-begun` if leaving.
3. **`wolf-dispersal-journey-danger`**: has `dispersal-begun`. Active. Road crossing, hostile territory. Death chance, injury risk. Cooldown 4.
4. **`wolf-dispersal-rival-territory`**: has `dispersal-begun`. Active. Another pack's territory. Fight/sneak/retreat choices.
5. **`wolf-dispersal-settlement`**: has `dispersal-begun`, age >= 24. Active. Claim territory. Sets `dispersal-settled`, `modify_territory` quality +20.

### White-Tailed Deer (4 events):
1. **`deer-yearling-restlessness`**: age 12-24, male. Passive. Sets `dispersal-pressure`.
2. **`deer-dispersal-push`**: has `dispersal-pressure`, male. Active. Dominant buck pushes yearling out. Sets `dispersal-begun`.
3. **`deer-dispersal-road-crossing`**: has `dispersal-begun`. Active. Highway crossing with death chance.
4. **`deer-dispersal-new-range`**: has `dispersal-begun`, age >= 16. Active. Find new home range. Sets `dispersal-settled`.

### Polar Bear (3 events):
1. **`pb-mother-separation`**: age 30-42. Passive. Mother drives sub-adult away. Sets `dispersal-begun`.
2. **`pb-dispersal-long-swim`**: has `dispersal-begun`. Active. Long swim between ice floes. Death chance modified by weight/HEA.
3. **`pb-dispersal-territory-claim`**: has `dispersal-begun`, age >= 48. Active. Sets `dispersal-settled`.

---

## Feature 4: Cooperative / Pack Hunting (~300 lines, events + engine)

Uses new `has_npc`/`no_npc` conditions (from shared engine changes above).

### Gray Wolf (3 events):
1. **`wolf-coordinated-elk-hunt`**: has_npc ally, winter. Active. Pack coordinates elk hunt. References `{{npc.ally.name}}`. Choices: drive to ambush (+8 weight, risky), pursue weakest (+5 weight, safer), call off hunt. Sub-events: successful kill (55%), elk kicks wolf (15%, injury), ally wounded (10%, narrative).
2. **`wolf-coordinated-moose-hunt`**: has_npc ally, winter, weight_below threshold. Active. Desperate moose hunt. Very high reward (+15 weight) but death chance from moose.
3. **`wolf-lone-hunt-penalty`**: no_npc ally, winter. Passive. Narrative about difficulty hunting alone. -1 weight penalty.

### Arctic Tern (1 event):
- **`tern-colony-foraging-info`**: has_npc ally, summer. Passive. Colony info-sharing about fish schools. +WIS, +weight.

### African Elephant (1 event):
- **`elephant-cooperative-lion-defense`**: has_npc ally, has_flag `calves-dependent`. Active. Herd forms defensive circle against lions. Sub-event: defense success much higher with ally present.

---

## Feature 5: Thermal Stress (~350 lines, small engine change + events)

### Engine changes:

**`src/types/speciesConfig.ts`** — Add optional field:
```typescript
thermalProfile?: {
  type: 'ectotherm' | 'endotherm';
  heatPenalty: number;
  coldPenalty: number;
  coldBenefit: number;
};
```

**`src/store/gameStore.ts`** — In `advanceTurn()`, after seasonal weight calculation (~15 lines):
- Ectotherms: heat_wave → extra weight loss (higher metabolism); frost/blizzard → slight weight preservation (torpor)
- Endotherms: blizzard/frost → extra weight loss (thermoregulation cost); heat_wave → extra weight loss (heat stress)
- Multiply penalty by `weather.intensity` for proportional effect

### Config values per species:

| Species | Type | Heat Penalty | Cold Penalty | Cold Benefit |
|---|---|---|---|---|
| Green Sea Turtle | ectotherm | 3.0 | 0 | 1.0 |
| Chinook Salmon | ectotherm | 0.5 | 0 | 0.2 |
| Common Octopus | ectotherm | 0.8 | 0 | 0.3 |
| Polar Bear | endotherm | 8.0 | 0 | 0 |
| Gray Wolf | endotherm | 0.5 | 0.3 | 0 |
| White-Tailed Deer | endotherm | 0.4 | 0.5 | 0 |
| Arctic Tern | endotherm | 0.003 | 0.002 | 0 |

### Thermal stress events (1-2 per category):
- `turtle-cold-stun`: frost/blizzard weather, death chance, immobilization narrative
- `salmon-warm-water-stress`: heat_wave, river region, +IMM, death chance
- `pb-summer-heat-stress`: summer heat_wave, +CLI, -weight
- `wolf-deep-freeze`: blizzard weather, pack huddles, +CLI, -weight
- `octopus-warm-water-bloom`: heat_wave, algal bloom, -oxygen narrative

---

## Feature 6: Infanticide (~280 lines, small engine change + events)

### Engine change:

**`src/engine/ReproductionSystem.ts`** — In `tickReproduction()`, after offspring tick loop (~10 lines):
- Check for `infanticide-occurred` flag
- If present: kill all dependent (non-independent) offspring, set `causeOfDeath`, generate narrative
- Remove the flag after processing
- Also remove the dependent flag (`fawns-dependent`, `cubs-dependent`, etc.)

### Events:

**Polar Bear** (2 events):
1. **`pb-male-infanticide-encounter`**: female, has_flag `cubs-dependent`. Active. Large male approaches female with cubs. Choices: fight to protect (danger, death chance with escape options), flee with cubs (60% escape, 40% → `set_flag infanticide-occurred`), abandon cubs (safe, `set_flag infanticide-occurred`, +TRA massive).
2. **`pb-infanticide-aftermath`**: female, no_flag `cubs-dependent`, has_flag `infanticide-occurred`. Passive. Grief narrative. Removes flag.

**Gray Wolf** (1 event):
- **`wolf-new-alpha-pup-threat`**: has_flag `pups-dependent`. Active. Rival challenges pack hierarchy, pups threatened. Choices: defend pups (fight, injury risk), submit (`set_flag infanticide-occurred`), flee with pups (leave territory).

**African Elephant** (1 event):
- **`elephant-musth-male-calf-threat`**: female, has_flag `calves-dependent`. Active. Musth bull threatens calf. Choices: herd defense (requires ally), flee with calf, stand alone (high injury risk).

---

## Implementation Order

1. **Shared engine changes** (conditions + context) — 4 new condition types, ecosystem in GenerationContext
2. **Feature 2: Disease** — zero engine changes, purely additive data, highest content/effort ratio
3. **Feature 1: Interspecific competition** — uses the new conditions, connects ecosystem to events
4. **Feature 4: Pack hunting** — uses the new NPC conditions, enriches wolf gameplay
5. **Feature 3: Dispersal** — zero engine changes, large narrative investment, lifecycle depth
6. **Feature 5: Thermal stress** — small config + gameStore change, requires tuning
7. **Feature 6: Infanticide** — small ReproductionSystem change, highest narrative intensity

## Verification (after each feature)

1. `npx tsc --noEmit` — type check
2. `npm run build` — production build
3. `npx tsx scripts/validate-data.ts` — injury/parasite ID cross-references
4. `npx vitest run` — existing tests pass
