# Species Balance Audit — Wild Reckoning

Generated from automated headless playtesting (100 games for flagged species, 10 for others).
Date: 2026-03-17

## Normal Mode Results

| Species | N | Avg Life | Real Life | Game Wt | Real Wt | Born | Matured | Real Offspring |
|---------|---|----------|-----------|---------|---------|------|---------|----------------|
| White-tailed deer | 100 | 2.02yr | 3-5yr avg | 79 lbs | 100-200 lbs | 1.5 | 0.5 | 6-12 fawns, ~50% survive yr1 |
| African elephant | 100 | 32.66yr | 50-70yr | 8056 lbs | 5000-14000 lbs | 1.6 | 1.0 | 4-8 calves lifetime |
| Chinook salmon | 100 | 0.95yr | 3-7yr | 72 lbs | 10-50 lbs | 0.0 | 2.3 | 3000-5000 eggs, <1% survive |
| Polar bear | 100 | 13.67yr | 15-25yr | 899 lbs | 330-1500 lbs | 2.9 | 1.3 | 5-8 cubs lifetime |
| Green sea turtle | 100 | 22.33yr | 60-80+yr | 632 lbs | 150-400 lbs | 24.0 | 2.2 | 100+ eggs/nest, <1% survive |
| Monarch butterfly | 10 | 0.26yr | 0.15-0.65yr | 0.0 | ~0.01 oz | 0.0 | 3.1 | 300-500 eggs |
| Fig wasp | 10 | 0.02yr | 1-2 days | 0.0 | <1 mg | 0.0 | 1.0 | ~100-200 eggs |
| Common octopus | 100 | 0.57yr | 1-2yr | 16.3 lbs | 6-22 lbs | 0.0 | 2.4 | 100k-500k eggs |
| Honeybee worker | 10 | 0.34yr | 6wk-6mo | 0.0 | ~0.003 oz | 0.0 | 0.0 | 0 (sterile) |
| Arctic tern | 10 | 18.58yr | 15-30yr | 0.4 | 3-4 oz | 3.9 | 1.7 | 1-3 chicks/yr, 20-50 lifetime |
| Poison dart frog | 10 | 5.98yr | 3-8yr | 0.0 | 0.07-0.25 oz | 9.9 | 5.6 | 50-200 eggs lifetime |

## Fast-Forward Mode (1x events, 12x consequences)

FF ratios (FF calendar lifespan / normal lifespan) are universally too high. The physiology loop
correctly runs 12 iterations per FF turn, but events only fire once with 12x consequence scaling.
Since events are the main source of death, per-calendar-week death rate in FF is lower than normal.

| Species | FF Avg Life | FF Ratio (target ~1x) |
|---------|-------------|----------------------|
| White-tailed deer | 14.4yr | 7.1x |
| African elephant | 300.0yr | 9.2x |
| Chinook salmon | 13.9yr | 14.5x |
| Polar bear | 151.2yr | 11.1x |
| Green sea turtle | 237.6yr | 10.6x |
| Monarch butterfly | 8.3yr | 32.2x |
| Fig wasp | 1.4yr | 83.6x |
| Common octopus | 15.0yr | 26.0x |
| Honeybee worker | 4.8yr | 14.1x |
| Arctic tern | 204.0yr | 11.0x |
| Poison dart frog | 57.6yr | 9.6x |

## Death Cause Breakdown (Flagged Species)

### White-tailed deer (100 games, avg 2.02yr)

| % | Cause |
|---|-------|
| 34% | Starvation |
| 19% | Deer Tick complications |
| 18% | Killed defending territory |
| 18% | Killed by wolf |
| 6% | Winter Tick complications |
| 2% | Systemic Failure |
| 1% | Sepsis |
| 2% | Old age (8-9yr) |

### African elephant (100 games, avg 32.66yr)

| % | Cause |
|---|-------|
| 36% | Systemic Failure |
| 29% | Elephant Roundworm complications |
| 15% | Old age (45yr) |
| 9% | Elephant Tick complications |
| 7% | Old age (46yr) |
| 4% | Old age (47-48yr) |

### Chinook salmon (100 games, avg 0.95yr)

| % | Cause |
|---|-------|
| 56% | Post-spawning death |
| 22% | Caught in fishing net |
| 8% | Sea Lice complications |
| 6% | Caught by harbor seal |
| 5% | Caught in kelp |
| 3% | Systemic Failure |

### Polar bear (100 games, avg 13.67yr)

| % | Cause |
|---|-------|
| 75% | Trichinella complications |
| 7% | Old age (22yr) |
| 5% | Old age (24yr) |
| 4% | Old age (23yr) |
| 4% | Old age (21yr) |
| 5% | Old age (20-26yr) |

### Green sea turtle (100 games, avg 22.33yr)

| % | Cause |
|---|-------|
| 23% | Marine Turtle Leech complications |
| 22% | Intestinal Fluke complications |
| 19% | Systemic Failure |
| 18% | Fibropapillomatosis complications |
| 15% | Spirorchid Blood Fluke complications |
| 1% | Propeller strike |
| 1% | Tiger shark |
| 1% | Old age (64yr) |

### Common octopus (100 games, avg 0.57yr)

| % | Cause |
|---|-------|
| 83% | Post-spawning death |
| 8% | Nocturnal predator |
| 5% | Dolphin predation |
| 2% | Vibrio Infection complications |
| 2% | Rival attack |

## Discrepancy Flags

### Critical

- **Polar bear: Trichinella kills 75%** of all bears. Single parasite dominates unrealistically.
  Real polar bears do carry Trichinella but rarely die from it.
- **Green sea turtle: 4 parasites account for 78% of deaths.** Disease death rate far too high;
  real turtle mortality is dominated by bycatch, boat strikes, and habitat loss.
- **Chinook salmon: spawns at ~1yr instead of 3-7yr.** Maturation triggers too early.
  Starting weight 72 lbs is also too heavy (real adult chinook: 10-50 lbs).

### Major

- **Green sea turtle: 632 lbs vs real 150-400 lbs.** Weight too high.
- **Green sea turtle: 22yr vs real 60-80yr.** Lifespan far too short (disease kills too fast).
- **White-tailed deer: 79 lbs final weight vs real 100-200.** Dying underweight from starvation.
- **African elephant: 32.7yr vs real 50-70yr.** Systemic failure (36%) and roundworm (29%)
  kill before reaching realistic old age.
- **Common octopus: 0.57yr vs real 1-2yr.** Spawning/dying too early.
- **Honeybee worker: 100% survive max turns.** Workers are immortal in the simulation.
  Real workers die from exhaustion, predation, or age within 6 weeks (summer) to 6 months (winter).
- **Fig wasp: 50% survive max turns.** Adult fig wasps live 1-2 days; simulation doesn't kill
  them at end of life.

### Moderate

- **White-tailed deer offspring: 1.5 born vs real 6-12.** Reproduction rate too low.
- **Semelparous offspring tracking broken.** Salmon, octopus, butterfly, and fig wasp show
  0 in `offspring.length` but nonzero `totalFitness`. The `spawn` consequence doesn't populate
  the offspring array.
- **FF ratio universally too high (7-84x).** Systemic issue: events fire once per FF turn
  instead of inside the 12-iteration physiology loop. Fixing requires either running the full
  event pipeline inside the loop, or reimplementing FF as UI-only auto-advance of normal turns.

### Acceptable

- **Arctic tern: 18.6yr** (real 15-30yr) — good.
- **Poison dart frog: 6.0yr** (real 3-8yr) — good.
- **Monarch butterfly: 0.26yr** (real 0.15-0.65yr) — good.
- **Polar bear weight: 899 lbs** (real 330-1500 lbs) — good.
- **Elephant weight: 8056 lbs** (real 5000-14000 lbs) — good.
- **Octopus weight: 16.3 lbs** (real 6-22 lbs) — good.
