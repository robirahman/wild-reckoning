# Wild Reckoning — Add African Elephant and Chinook Salmon

## Context

The game currently works only for white-tailed deer. All species-specific values — weight thresholds, age ranges, reproduction constants, event narratives, parasites, injuries, backstories, and UI text — are hardcoded throughout the engine. We need to:

1. Extract all deer-specific constants into a species config
2. Parameterize the engine to read from that config
3. Add African Elephant (*Loxodonta africana*) as a second species
4. Add Chinook Salmon (*Oncorhynchus tshawytscha*) as a third species

Salmon is **semelparous** (spawns once, then dies), requiring a second reproduction pathway alongside the existing iteroparous (repeated breeding) system used by deer and elephant.

---

## Architecture

### SpeciesConfig type (`src/types/speciesConfig.ts` — new file)

Central config that parameterizes all engine behavior per species:

```typescript
interface SpeciesConfig {
  id: string;                        // 'white-tailed-deer'
  name: string;                      // 'White-Tailed Deer'
  scientificName: string;
  description: string;
  diet: Diet;
  defaultRegion: string;             // 'northern-minnesota'
  defaultRegionDisplayName: string;  // 'Northern Minnesota'

  startingWeight: { male: number; female: number };
  startingAge: Record<string, number>;  // Keyed by backstory type
  baseStats: Record<StatId, number>;

  weight: {
    starvationDeath: number;         // Deer: 35, Elephant: 1500, Salmon: 3
    starvationDebuff: number;        // Deer: 60, Elephant: 2500, Salmon: 5
    vulnerabilityThreshold: number;  // Deer: 80, Elephant: 3000, Salmon: 8
    minFloor: number;                // Deer: 20, Elephant: 1000, Salmon: 2
    debuffMaxPenalty: number;        // Max HEA reduction from starvation
  };

  age: {
    oldAgeOnsetMonths: number;       // Deer: 96, Elephant: 600, Salmon: 72
    oldAgeBaseChance: number;
    oldAgeEscalation: number;
    maxOldAgeChance: number;
  };

  diseaseDeathChanceAtCritical: number;

  predationVulnerability: {
    injuryProbIncrease: number;      parasiteProbIncrease: number;
    underweightFactor: number;       underweightThreshold: number;
    deathChanceMin: number;          deathChanceMax: number;
  };

  reproduction: IteroparousReproConfig | SemelparousReproConfig;

  templateVars: {
    speciesName: string;  regionName: string;
    maleNoun: string;     femaleNoun: string;
    youngNoun: string;    youngNounPlural: string;
    groupNoun: string;    habitat: string;
  };
}
```

### SpeciesDataBundle

```typescript
interface SpeciesDataBundle {
  config: SpeciesConfig;
  events: GameEvent[];
  parasites: Record<string, ParasiteDefinition>;
  injuries: Record<string, InjuryDefinition>;
  backstories: Backstory[];
}
```

### Two reproduction configs (discriminated union)

**Iteroparous** (deer, elephant): Seasonal/year-round mating, pregnancy, offspring tracking with survival rolls, male competition.

**Semelparous** (salmon): Single spawning event → egg count calculated from condition → fitness = estimated survivors → animal dies 1-2 turns post-spawn. Uses flags (`spawning-migration-begun`, `reached-spawning-grounds`, `spawning-complete`) to transition lifecycle phases through the existing event/flag system — no new state machine needed.

### File structure

```
src/data/species/
  index.ts                     — Registry: getSpeciesBundle(id), getAllSpeciesIds()
  white-tailed-deer/
    config.ts  events.ts  parasites.ts  injuries.ts  backstories.ts  index.ts
  african-elephant/
    config.ts  events.ts  parasites.ts  injuries.ts  backstories.ts  index.ts
  chinook-salmon/
    config.ts  events.ts  parasites.ts  injuries.ts  backstories.ts  index.ts
```

Existing `src/data/events/index.ts`, `src/data/parasites/index.ts`, `src/data/injuries/index.ts` become re-exports from the species directories (or are removed once the store loads from the bundle).

---

## Step 1: Create SpeciesConfig types and extract deer config

### New files
| File | Purpose |
|------|---------|
| `src/types/speciesConfig.ts` | SpeciesConfig, IteroparousReproConfig, SemelparousReproConfig, SpeciesDataBundle |
| `src/data/species/index.ts` | Species registry |
| `src/data/species/white-tailed-deer/index.ts` | Deer bundle (assembles config + data) |
| `src/data/species/white-tailed-deer/config.ts` | All deer constants extracted from hardcoded values |
| `src/data/species/white-tailed-deer/backstories.ts` | Moved from `BACKSTORY_OPTIONS` in `src/types/species.ts` |

### Move existing files
- `src/data/events/index.ts` → `src/data/species/white-tailed-deer/events.ts`
- `src/data/parasites/index.ts` → `src/data/species/white-tailed-deer/parasites.ts`
- `src/data/injuries/index.ts` → `src/data/species/white-tailed-deer/injuries.ts`

### Modify
- `src/types/species.ts` — Remove `BACKSTORY_OPTIONS`, keep `AnimalState`/`Backstory`
- `src/types/reproduction.ts` — Rename `fawnCount` → `offspringCount`; add `SemelparousReproductionState` variant
- `src/types/events.ts` — Rename `start_pregnancy.fawnCount` → `offspringCount`, `sire_offspring.fawnCount` → `offspringCount`; add `{ type: 'spawn' }` consequence

---

## Step 2: Parameterize the engine

Replace all hardcoded species values with reads from `state.speciesBundle.config`:

| File | Hardcoded values to replace |
|------|----------------------------|
| `src/store/gameStore.ts` | `createInitialAnimal()` reads from config (weight, age, stats, region, speciesId); `applyConsequence` reads gestation from config; `advanceTurn` reads weight thresholds from config; add `speciesBundle` to GameState; handle `'spawn'` consequence for salmon |
| `src/engine/EventGenerator.ts` | `resolveTemplate()` reads from `config.templateVars`; diet check reads `config.diet`; event pool comes from `speciesBundle.events` |
| `src/engine/TurnProcessor.ts` | Weight vulnerability threshold from config; male competition block reads all constants from `config.reproduction.maleCompetition`; only runs for iteroparous |
| `src/engine/ReproductionSystem.ts` | All functions accept config parameter: `determineOffspringCount()`, `createOffspring()`, `rollOffspringSurvival()`, `computeMaleCompetitionWinProb()`; `tickReproduction()` reads independence/maturation/season thresholds from config; add `calculateSpawningFitness()` for salmon |
| `src/hooks/useGameEngine.ts` | All death thresholds from config; parasite definitions from `speciesBundle.parasites` |
| `src/engine/HealthSystem.ts` | Receives parasite definitions as parameter instead of importing global |

---

## Step 3: Add African Elephant

### Species constants
- **Weight**: Female 6000 lbs / Male 10000 lbs start; starvation death at 2000; debuff at 3500
- **Lifespan**: Old age onset at 540 months (45 years), base 2%, escalation 1.3
- **Reproduction**: Year-round mating (`matingSeasons: 'any'`), 88-turn gestation (22 months), almost always 1 calf (maxOffspring: 1), 144-turn dependence (~3 years), 480-turn maturation (~10 years), base survival 0.992
- **Male competition**: Musth-based. Base win 20%, max 50%. Injury: tusk wound.
- **Region**: East African Savanna
- **Diet**: Herbivore

### Events (~18 events)

**Foraging (4)**: Acacia browsing, bark stripping, crop raiding (human conflict), digging for water in dry riverbed

**Predator (4)**: Lion ambush (primarily targets calves — deathChance), poacher encounter (deathChance, highest lethality), human-wildlife conflict (farmer with rifle — deathChance), crocodile at watering hole

**Seasonal (3)**: Dry season onset, wet season relief, musth onset (male)

**Social (2)**: Matriarch's guidance (wisdom gain), herd mourning (elephant grief behavior)

**Reproduction (3)**: Mating acceptance (female), musth competition (male), calf independence

**Health/Environmental (2)**: Thorn in foot, muddy waterhole (parasite risk)

### Parasites (3)
- **Elephant Roundworm** (*Murshidia*) — 3 stages, gut parasite
- **Elephant Tick** (*Amblyomma tholloni*) — 3 stages, immune drain
- **Trypanosomiasis** (*Trypanosoma*) — 3 stages, transmitted by tsetse fly, neurological

### Injuries (3)
- **Tusk Wound** — From male competition, 2 severity levels
- **Thorn Wound** — Foot injury, 2 severity levels
- **Gunshot Wound** — From poaching attempt, 3 severity levels (can be immediately lethal via deathChance)

### Backstories (3)
- **Orphaned by poachers** — Mother killed, raised in sanctuary (+TRA, +NOV, -WIS)
- **Wild-born matriarchal** — Born into strong herd, learned from matriarch (+WIS, +HEA)
- **Translocated** — Captured and relocated from conflict zone (+ADV, +TRA, +NOV)

---

## Step 4: Add Chinook Salmon

### Species constants
- **Weight**: Female 25 lbs / Male 30 lbs start; starvation death at 4; debuff at 8
- **Lifespan**: Old age onset at 72 months (6 years), base 5%, escalation 2.0 (salmon age fast)
- **Reproduction**: Semelparous. Spawning in autumn, age 36+ months. Base 4000 eggs, ~0.2% survival to adulthood. Spawning kills the animal.
- **Region**: Pacific Northwest (ocean phase) → Columbia River (migration) → Spawning Stream
- **Diet**: Carnivore (fish, krill, squid)

### Lifecycle phases (via flags, not a state machine)
1. **Ocean** (default) — Open water survival, feeding, growing
2. **Upstream Migration** — Triggered by event at age 36+ in autumn; sets `spawning-migration-begun`; stat modifiers: +HOM, +ADV (exhausting)
3. **Spawning** — Triggered after surviving migration; sets `spawning-complete`; calculates fitness; death within 1-2 turns

### Events (~18 events)

**Ocean/Foraging (4)**: Krill swarm feast, baitfish school, deep dive (cold water), jellyfish encounter

**Predator (5)**: Seal attack (deathChance), orca pod (deathChance), commercial fishing net (deathChance, highest ocean lethality), seabird attack (minor), bear at shallows (migration phase, deathChance)

**Migration (4)**: Upstream rapids, waterfall leap (choice: attempt jump / find side channel), dam obstruction, eagle attack from above (deathChance)

**Spawning (2)**: Finding a redd (nest site), male competition for spawning position, spawning event (triggers `spawn` consequence → game end)

**Environmental/Health (3)**: Water temperature spike, sea lice infestation, pollution plume

### Parasites (3)
- **Sea Lice** (*Lepeophtheirus salmonis*) — 3 stages, immune drain + weight loss
- **Ich / White Spot** (*Ichthyophthirius multifiliis*) — 2 stages, skin/gill parasite
- **Bacterial Kidney Disease** (*Renibacterium salmoninarum*) — 3 stages, systemic

### Injuries (2)
- **Scale Damage** — From rapids/nets, 2 severity levels
- **Bear Claw Wound** — From predation attempt, 2 severity levels

### Backstories (3)
- **Hatchery-raised** — Released from fish hatchery (+NOV, -WIS, +HEA)
- **Wild-spawned** — Born in natural stream (+WIS, +ADV)
- **Transplanted stock** — Moved to new watershed (+TRA, +NOV, -HEA)

---

## Step 5: UI Updates

### `src/components/StartScreen.tsx`
- Add species selector (3 cards with name, scientific name, description, region)
- Load backstories from selected species bundle
- Show species-appropriate sex options (salmon could allow both; elephant and deer already do)

### `src/components/stats/AnimalIdentity.tsx`
- Read species name and region from `speciesBundle.config.templateVars`
- Use `config.templateVars.youngNoun` instead of hardcoded "fawn"
- Show lifecycle phase label for salmon

### `src/components/DeathScreen.tsx`
- Read species name from config
- **Iteroparous species**: Show offspring breakdown (existing behavior)
- **Semelparous species (salmon)**: Show "Eggs Spawned: N" and "Estimated Surviving Adults: N" with a different fitness rating scale:
  - 0 = "Failed to Spawn" (died before reproducing)
  - 1-3 = "Below Average"
  - 4-8 = "Average"
  - 9-15 = "Above Average"
  - 16+ = "Exceptional"

### `src/components/header/TurnHeader.tsx`
- Show lifecycle phase for salmon (e.g., "Ocean Life" → "Upstream Migration" → "Spawning")

---

## Step 6: Update MECHANICS.md

Add sections for:
- Multi-species architecture overview
- African Elephant species profile (ecology, reproduction, threats, all numerical constants)
- Chinook Salmon species profile (semelparous lifecycle, egg-based fitness, phase transitions)
- Updated numerical reference tables for all three species

---

## Implementation Order

Execute in this order to keep the game working at each step:

1. **Types** — Create `speciesConfig.ts`, update `reproduction.ts` and `events.ts` with renames and new types
2. **Extract deer** — Create deer data bundle files, move existing events/parasites/injuries/backstories, create deer config with all current hardcoded values, create registry
3. **Parameterize engine** — Update gameStore, EventGenerator, TurnProcessor, ReproductionSystem, useGameEngine, HealthSystem to read from config. **Verify deer still works identically.**
4. **Elephant** — Create elephant data bundle (config + 18 events + 3 parasites + 3 injuries + 3 backstories)
5. **Salmon** — Create salmon data bundle, implement semelparous reproduction, phase display, spawning fitness
6. **UI** — Species selector on start screen, dynamic terminology everywhere, salmon phase display, salmon fitness display
7. **Documentation** — Update MECHANICS.md

---

## Verification

1. `npx tsc --noEmit` — Type check passes
2. `npx vite build` — Build succeeds
3. **Deer regression** — Play as deer, verify all mechanics identical to before refactor
4. **Elephant test** — Start as elephant, verify events fire, parasites work, musth competition resolves, pregnancy/calf lifecycle works, fitness scoring works
5. **Salmon test** — Start as salmon, survive ocean phase, trigger migration, survive upstream, reach spawning, verify egg-based fitness calculation, verify death after spawning
6. **Species selector** — Start screen shows all 3 species, switching species loads correct events/backstories
