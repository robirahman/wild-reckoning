# Species Reference — Wild Reckoning

Biological targets for each playable species. Used to calibrate survival duration,
body weight, reproductive output, and death cause distribution.

The core calibration constraint: **mean lifetime fitness = 2** (demographic replacement
rate for a stable population). For K-selected species this means most playthroughs
produce 1-4 surviving offspring; for r-selected species it means high variance with
many zeros and occasional very high values.

## Wild Animals

### White-tailed Deer (*Odocoileus virginianus*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 4.5 years (median wild) | Most die by age 5; max ~15y |
| Adult weight | 100-300 lbs | Does 90-160, bucks 130-300 |
| r/K type | K-selected | 1-3 fawns/year, high parental investment |
| Fawn survival | 30-40% to 18 months | Predation, starvation, exposure |
| Turn unit | week | |
| Metabolism | Physiology engine | Winter metabolic depression 25% |

### African Elephant (*Loxodonta africana*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 65 years (median wild) | Max ~70y |
| Adult weight | 5,000-14,000 lbs | Cows 6,000, bulls 10,000+ |
| r/K type | K-selected | 1 calf every 4-5 years |
| Calf survival | ~58% to maturity | High parental investment |
| Turn unit | month | |

### Chinook Salmon (*Oncorhynchus tshawytscha*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 3-5 years | Die after spawning |
| Adult weight | 10-50 lbs | Ocean phase; kings can reach 60+ |
| r/K type | r-selected (semelparous) | 4,000-12,000 eggs, ~0.02% survival |
| Turn unit | week | |

### Polar Bear (*Ursus maritimus*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 15-20 years (median wild) | Max ~30y |
| Adult weight | 330-1,500 lbs | Females 330-650, males 770-1,500 |
| r/K type | K-selected | 1-3 cubs every 3-4 years |
| Cub survival | ~46% to maturity | High parental investment, 2.5y dependency |
| Turn unit | month | |

### Green Sea Turtle (*Chelonia mydas*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 60-100 years (median ~80y) | Among longest-lived vertebrates |
| Adult weight | 150-420 lbs | Can reach 500+ |
| r/K type | r/K intermediate | Large clutches (80-120 eggs), low survival |
| Hatchling survival | ~6% to maturity | Predation, light pollution, boats |
| Turn unit | month | Maturity at ~20 years |

### Monarch Butterfly (*Danaus plexippus*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 2-8 months | Migratory generation ~8mo, summer ~2-6wk |
| Adult weight | 0.27-0.75g | |
| r/K type | r-selected (semelparous) | ~400 eggs, ~2% survival |
| Turn unit | week | Lineage mode (multi-generational) |

### Fig Pollinator Wasp (*Pegoscapus mexicanus*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 1-3 days (adult) | ~48 hours from emergence to death |
| Adult weight | ~18 μg | Ultra-micro |
| r/K type | r-selected (semelparous) | ~300 eggs, ~0.3% survival |
| Turn unit | day (6hr) | Lineage mode |

### Common Octopus (*Octopus vulgaris*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 12-18 months | Die after brooding eggs |
| Adult weight | 6-22 lbs | |
| r/K type | r-selected (semelparous) | 100K-500K eggs, ~0.0001% survival |
| Turn unit | week | |

### Honeybee Worker (*Apis mellifera*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 5-7 weeks (summer) | Winter workers 4-6 months |
| Adult weight | ~100 mg | |
| r/K type | N/A (sterile worker) | Fitness = 0 by design |
| Turn unit | day (6hr) | |

### Arctic Tern (*Sterna paradisaea*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 25-35 years (median ~30y) | Longest migration of any bird |
| Adult weight | 86-127g (3-4 oz) | |
| r/K type | K-selected | 1-3 chicks/year, ~35% survival to maturity |
| Turn unit | month | |

### Poison Dart Frog (*Oophaga pumilio*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 5-10 years (median ~8y) | |
| Adult weight | ~2g | |
| r/K type | K/intermediate | 3-5 tadpoles, devoted parental care |
| Tadpole survival | ~58% to maturity | Mother feeds each tadpole individually |
| Turn unit | week | |

## Farm Animals

Farm animals are calibrated to industrial farming timelines, not natural lifespans.
Death is typically from slaughter at market weight, not from natural causes.

### Chicken — Broiler (*Gallus gallus domesticus*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | 42 days (6 weeks) | Slaughter at market weight |
| Market weight | 5-9 lbs | ~6 lbs at 42 days |
| r/K type | N/A (slaughtered) | Fitness = 0 by design |
| Growth rate | ~0.14 lbs/day | Fastest of any livestock |
| Turn unit | day (6hr) | |
| Primary death | Slaughter (67%) | Remainder: disease from parasites |

### Pig — Market Hog (*Sus scrofa domesticus*)
| Parameter | Target | Notes |
|-----------|--------|-------|
| Lifespan | ~180 days (6 months) | Slaughter at market weight |
| Market weight | 250-280 lbs | Starting from ~15 lb weaned piglet |
| r/K type | N/A (slaughtered) | Fitness = 0 by design |
| Growth rate | ~1.5 lbs/day | On high-energy CAFO feed |
| Turn unit | day (6hr) | |
| Primary death | Slaughter (48%) | Remainder: parasites, respiratory disease |

## Calibration Methodology

Survival benchmarks are run via the headless `GameAPI` with 100 automated playthroughs
per species using the safe-choice strategy (prefer non-danger options). Key metrics:

- **Lifespan ratio**: game median / real median. Target: 0.5x-1.5x.
- **Mean fitness**: average offspring surviving to reproductive maturity. Target: 2.0.
- **Peak weight**: should fall within the species' real adult weight range.
- **Death cause diversity**: no single cause should dominate >80% unless biologically justified
  (e.g., slaughter for farm animals, post-spawning death for semelparous species).

Run benchmarks: `npx tsx playtests/comprehensive-benchmark.ts`
