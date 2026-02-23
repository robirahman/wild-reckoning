# Wild Reckoning — Game Mechanics Reference

This document describes the full game mechanics and their biological justification. It is a developer reference and should not be shown to players.

---

## 1. Overview

Wild Reckoning simulates the life of a white-tailed deer (*Odocoileus virginianus*) in northern Minnesota. The game is turn-based, with each turn representing one week. The player makes behavioral decisions and responds to events while the game simulates physiology, parasitology, weather, reproduction, and predation.

The game ends when the animal dies. The player's score is their **inclusive genetic fitness** — the number of offspring that survive to reproductive age (18 months). Most playthroughs end with a fitness score of 0.

**Time scale:** 1 turn = 1 week. 4 turns = 1 month. 48 turns = 1 year. Age increments by 1 month when `week === 1` in a new month.

---

## 2. Stat System

### The Nine Stats

The animal has nine internal stats on a 0–100 scale, organized into three categories:

| Category | Stat | Abbr | Polarity | Description |
|----------|------|------|----------|-------------|
| Physical Stresses | Immune Load | IMM | Negative | Immune system burden from parasites and infection |
| Physical Stresses | Climate Stress | CLI | Negative | Thermal and weather stress |
| Physical Stresses | Homeostatic Strain | HOM | Negative | Nutritional deficit, metabolic stress |
| Mental Stresses | Trauma | TRA | Negative | Accumulated psychological trauma |
| Mental Stresses | Adversity | ADV | Negative | General stress from hostile encounters |
| Mental Stresses | Novelty Stress | NOV | Negative | Stress from unfamiliar situations |
| General Fitness | Wisdom | WIS | Positive | Learned survival behavior |
| General Fitness | Health | HEA | Positive | Overall physiological condition |
| General Fitness | Stresses (aggregate) | STR | Negative | Composite stress load |

**Polarity:** "Negative" means higher values are bad for the animal. "Positive" means higher is better.

**Biological justification:** This model is based on the *allostatic load* framework (McEwen & Stellar, 1993). Animals accumulate physiological wear from chronic stress across multiple systems. The six stress stats represent different axes of allostatic load, while WIS and HEA represent adaptive capacity and physiological reserve.

### Stat Values and Display

Internal values are 0–100. Players see qualitative labels:

| Range | Label |
|-------|-------|
| 0–15 | Low |
| 16–30 | - Medium |
| 31–50 | Medium |
| 51–70 | + Medium |
| 71–85 | High |
| 86–100 | + High |

### Stat Modifiers

Stats are modified by stackable modifiers from multiple sources:

- **Source types:** `parasite`, `injury`, `event`, `seasonal`, `behavioral`, `condition`, `permanent`
- **Duration:** Optional. If set, modifier expires after N turns. If omitted, modifier is permanent.
- **Effective value:** `base + sum(modifier amounts)`, clamped to [0, 100]

Modifiers are ticked (decremented) each turn in `advanceTurn`. Expired modifiers are removed.

### Initial Stat Bases

| Stat | Base | Notes |
|------|------|-------|
| IMM | 40 | |
| CLI | 20 | |
| HOM | 35 | |
| TRA | 30 | |
| ADV | 30 | |
| NOV | 40 | |
| WIS | 25 | |
| HEA | 60 | |
| STR | 35 | |

Backstory selection adjusts these bases before game start.

---

## 3. Behavioral Settings

Six behavioral sliders (1–5 scale) influence which events are more likely to occur. They do not directly affect stats — they modify event selection weights.

| Setting | Default | Effect on Event Weights |
|---------|---------|------------------------|
| Foraging | 3 | Multiplies `foraging`/`food` tagged events by `0.5 + level × 0.3` (range: 0.8–2.0) |
| Belligerence | 2 | Multiplies `confrontation`/`territorial` events by `0.3 + level × 0.3` (range: 0.6–1.8) |
| Mating | 2 | Multiplies `mating`/`reproductive` events by `0.3 + level × 0.3` (range: 0.6–1.8) |
| Exploration | 3 | Multiplies `exploration`/`travel` events by `0.5 + level × 0.3` (range: 0.8–2.0) |
| Sociability | 3 | Multiplies `social`/`herd` events by `0.5 + level × 0.3` (range: 0.8–2.0) |
| Caution | 3 | Multiplies `predator`/`danger` events by `1.5 - level × 0.2` (range: 0.5–1.3) — higher caution *reduces* predator encounters |

**Biological justification:** Based on *animal personality* / *behavioral syndromes* research (Réale et al., 2007). Individual animals consistently differ along axes like boldness-shyness, exploration-avoidance, and aggressiveness. These are not "choices" in the human sense — they are persistent behavioral phenotypes shaped by genetics and early experience.

---

## 4. Event System

### Event Selection

Each turn generates **1–3 active events** and **0–2 passive events**.

1. Filter all events by **conditions** (season, sex, age, flags, stats, parasites, injuries, weight, region)
2. Filter by **cooldown** (each event has a minimum turns-between-fires)
3. Compute **weight** for each eligible event: `base_weight × behaviorMultiplier × contextMultiplier`
4. Select via **weighted random** sampling without replacement

### Context Multipliers

- **Psychological events:** Weight multiplied by `0.5 + (TRA / 100) × 1.5` — high trauma triggers more psychological events
- **Health events:** Weight multiplied by `1.5 - (HEA / 100)` — low health triggers more health events

### Event Structure

```
GameEvent {
  id, type (active|passive), category, narrativeText
  statEffects[]         — Applied on turn resolution
  consequences[]        — Applied on turn resolution (flags, weight changes, etc.)
  choices[]             — Player-facing decisions (active events only)
  subEvents[]           — Probabilistic chained events resolved at generation time
  conditions[]          — Must all pass for event to be eligible
  weight                — Base selection probability
  cooldown              — Minimum turns between occurrences
  tags[]                — Drive behavioral setting influence
}
```

### Condition Types

| Type | Parameters | Description |
|------|-----------|-------------|
| `season` | `seasons[]` | Current season must be in list |
| `region` | `regionIds[]` | Animal's region must match |
| `species` | `speciesIds[]` | Animal's species must match |
| `stat_above` | `stat, threshold` | Stat effective value > threshold |
| `stat_below` | `stat, threshold` | Stat effective value < threshold |
| `has_parasite` | `parasiteId` | Animal has this parasite |
| `no_parasite` | `parasiteId` | Animal does not have this parasite |
| `has_injury` | — | Animal has any injury |
| `age_range` | `min?, max?` | Age in months within range |
| `has_flag` | `flag` | Flag is set |
| `no_flag` | `flag` | Flag is not set |
| `weight_above` | `threshold` | Weight > threshold |
| `weight_below` | `threshold` | Weight < threshold |
| `sex` | `sex` | Animal's sex matches |

### Sub-Events

Sub-events fire during event generation (before the player makes choices). Each has an independent probability roll and optional conditions. If triggered, their stat effects and consequences are applied during turn resolution.

Example: The blueberry foraging event has a 15% chance of triggering a meningeal worm infection sub-event.

### Choices

Active events may present 2 choices. Each choice has:
- `statEffects[]` — Applied when turn resolves
- `consequences[]` — Flags, weight changes, pregnancies, etc.
- `deathChance?` — Probabilistic lethal outcome (see §8)
- `revocable` — Whether the player can change their mind
- `style` — Visual: `default` or `danger` (red border)

---

## 5. Parasites

Five parasites are modeled, each with multi-stage progression based on real parasitology of white-tailed deer.

### GI Roundworm (*Haemonchus contortus*)

Blood-feeding nematode of the abomasal lining. Most common internal parasite of cervids.

| Stage | Stat Effects | Progression | Remission | Duration |
|-------|-------------|-------------|-----------|----------|
| Minor | HOM +8, HEA -3 | 20% | 10% | 3–8 turns |
| Moderate | HOM +15, HEA -8 | 15% | 5% | 4–10 turns |
| Severe | HOM +25, HEA -15 | 10% | 2% | 4–12 turns |
| Critical | HOM +35, HEA -25, IMM +15 | — | 1% | 2–6 turns |

**Transmission:** Ingesting larvae from contaminated vegetation. In-game: sub-event on foraging events.

**Death risk:** 8% per turn at critical stage (see §8).

### Meningeal Worm (*Parelaphostrongylus tenuis*)

Nematode that migrates through the CNS. White-tailed deer are the definitive host and usually tolerate it, but stressed or young animals can develop neurological disease.

| Stage | Stat Effects | Progression | Remission | Duration |
|-------|-------------|-------------|-----------|----------|
| Minor | IMM +8 | 8% | 15% | 6–16 turns |
| Moderate | IMM +15, ADV +10, WIS -5 | 5% | 10% | 8–20 turns |
| Severe | IMM +20, ADV +20, WIS -15, HEA -10 | — | 3% | 4–10 turns |

**Transmission:** Accidentally ingesting infected gastropods (slugs/snails) while foraging. In-game: sub-event on blueberry/browse events.

### Lone Star Tick (*Amblyomma americanum*)

Aggressive ectoparasite. Heavy infestations cause anemia and immunosuppression.

| Stage | Stat Effects | Progression | Remission | Duration |
|-------|-------------|-------------|-----------|----------|
| Minor | IMM +5 | 15% | 30% | 2–6 turns |
| Moderate | IMM +12, HEA -5 | 10% | 20% | 3–8 turns |
| Severe | IMM +22, HEA -12, HOM +10 | — | 10% | 2–6 turns |

**Transmission:** Walking through tick-heavy brush. In-game: tick brush health event in spring/summer.

### Liver Fluke (*Fascioloides magna*)

Large trematode that encysts in the liver, causing progressive hepatic damage.

| Stage | Stat Effects | Progression | Remission | Duration |
|-------|-------------|-------------|-----------|----------|
| Minor | HEA -5, HOM +5 | 12% | 5% | 6–12 turns |
| Moderate | HEA -10, HOM +12 | 6% | 2% | 8–20 turns |
| Severe | HEA -20, HOM +20, IMM +10 | — | 1% | 4–10 turns |

**Transmission:** Ingesting metacercariae on aquatic vegetation. In-game: sub-event on stagnant water event.

### Nasal Bot Fly (*Cephenemyia stimulator*)

Larvae develop in the nasal passages, causing respiratory distress.

| Stage | Stat Effects | Progression | Remission | Duration |
|-------|-------------|-------------|-----------|----------|
| Minor | HOM +5, ADV +5 | 20% | 15% | 4–10 turns |
| Moderate | HOM +12, ADV +10, HEA -5 | 10% | 25% | 3–8 turns |

**Transmission:** Adult flies depositing larvae near nostrils. Relatively benign; often self-resolving (25% remission at moderate stage due to sneezing expulsion).

### Stage Progression Mechanics

Each turn, the health system processes all active parasites:
1. Increment `turnsAtCurrentStage`
2. If turns >= stage's `turnDuration.min`:
   - Roll `progressionChance` → advance to next stage
   - Else roll `remissionChance` → regress to previous stage
3. Remove old stat modifiers, apply current stage's modifiers

---

## 6. Injuries

### Injury Types

**Antler Wound** — From buck competition during the rut.

| Severity | Stat Effects | Healing Time | Worsening Chance |
|----------|-------------|-------------|-----------------|
| Minor | HEA -3, HOM +5 | 6 turns | 8% |
| Moderate | HEA -8, HOM +12 | 12 turns | 12% |

Body parts: right/left shoulder, right/left flank, right/left haunch.

**Leg Fracture** — From falls, collisions, or vehicle strikes.

| Severity | Stat Effects | Healing Time | Worsening Chance |
|----------|-------------|-------------|-----------------|
| Minor | HEA -3, HOM +4 | 8 turns | 10% |
| Moderate | HEA -10, HOM +10, ADV +5 | 16 turns | 15% |
| Severe | HEA -20, HOM +18, ADV +12 | 24 turns | 20% |

Body parts: front left/right ulna, hind left/right tibia.

### Healing Mechanics

- Injuries have a `turnsRemaining` counter
- Resting injuries decrement by 1 per turn; non-resting injuries do not heal
- Non-resting injuries have a 10% chance per turn of **worsening** (severity +1, +4 turns added)
- Healed injuries are removed and their stat modifiers cleared

---

## 7. Reproduction

### Biological Context

White-tailed deer are **polygynous** with a distinct breeding season (the **rut**) in October–November. Does are seasonally polyestrous. Gestation is approximately 200 days (~28 weeks). Fawns are born in late May–June. Maternal care lasts approximately 5 months, after which fawns become independent. Sexual maturity is reached at approximately 18 months.

Fawn survival rates in the wild are approximately 30–50% to age 1, varying by region, predator density, and winter severity (Verme 1977, Nelson & Mech 1986).

### Rut and Mating

**Season reset:** On the first turn of September each year, the `mated-this-season` and `rut-seen` flags are cleared, enabling new mating events for the upcoming rut.

**Female (doe) pathway:**
1. `seasonal-rut-onset` fires in autumn for females age 16+ → sets `rut-seen` flag
2. `reproduction-doe-mating` fires in autumn for females age 18+ with `rut-seen` flag and without `mated-this-season` flag
3. Accepting the buck triggers `start_pregnancy` consequence → sets `pregnant` flag, creates pregnancy with 28-turn timer
4. Declining sets `mated-this-season` to prevent re-triggering

**Male (buck) pathway:**
1. `seasonal-rut-onset-male` fires in autumn for males age 16+ → sets `rut-seen` flag
2. `reproduction-buck-competition` fires in autumn for males age 18+ without `mated-this-season`
3. Challenging sets `attempted-buck-challenge` flag → resolved dynamically in TurnProcessor
4. Retreating sets `mated-this-season`

### Buck Competition

Resolved in `TurnProcessor.resolveTurn()` when the `attempted-buck-challenge` flag is present.

**Win probability formula:**

```
prob = 0.15                               (base: 15%)
     + (HEA - 50) × 0.003                (HEA adjustment: ±0.3% per point from 50)
     + max(0, (weight - 130) × 0.001)    (weight bonus: +0.1% per lb above 130)
     + max(0, (30 - STR) × 0.002)        (low stress bonus: +0.2% per STR point below 30)
     - injuryCount × 0.05                 (injury penalty: -5% each)
     - parasiteCount × 0.03               (parasite penalty: -3% each)

Clamped to [2%, 45%]
```

**Design intent:** Males should lose most competitions. Even a peak-condition buck (HEA 80, weight 180, STR 10, no injuries or parasites) only has ~37% win probability. The 15% base ensures that even average bucks have a small chance.

**Outcomes:**
- **Win:** `sire_offspring` consequence → creates fawn records (immediately independent, `siredByPlayer: true`), sets `mated-this-season`
- **Lose:** 40% chance of antler wound injury (random body part, severity 0–1). Always removes challenge flag.

### Pregnancy

- **Duration:** 28 turns (~7 months, matching real 200-day gestation)
- **Tick:** Each turn decrements `turnsRemaining`. At 0, birth occurs.
- **Birth:** Creates 1–3 fawns, sets `fawns-dependent` flag, removes `pregnant` flag
- **Pregnancy midpoint event:** Passive event during pregnancy adds HOM +5, WIS +3, weight -2

### Fawn Count

```
conditionBonus = ((weight - 80) / 80) × 0.15 + ((HEA - 40) / 60) × 0.15
bonus = clamp(conditionBonus, -0.2, 0.3)

P(single) = 0.40 - bonus
P(twins)  = 0.50
P(triplets) = 0.10 + bonus
```

Well-nourished does (weight >120, HEA >60) shift toward twins and triplets. Malnourished does are more likely to have singles.

### Fawn Life Cycle

1. **Birth** (turn 0): Created with `alive: true`, `independent: false`, `matured: false`
2. **Dependence** (turns 0–19): Mother must survive. If mother dies, dependent fawns die ("Mother died while dependent")
3. **Independence** (turn 20, ~5 months): `independent: true`. Fawn survival is now rolled each turn.
4. **Survival rolls** (turns 20–71): Each turn, each independent fawn faces a survival check
5. **Maturation** (turn 72, ~18 months): `matured: true`. Counts toward fitness score.

### Fawn Survival Formula

```
survivalProb = 0.985                                   (base: 98.5% weekly)
             + (motherWisAtBirth - 50) / 5000          (mother's WIS adjustment)
             - 0.008 if winter                          (winter penalty)
             + 0.003 if summer                          (summer bonus)
             - 0.005 if ageTurns < 32                   (young vulnerability)

Clamped to [0.90, 0.998]
```

**Expected survival to 18 months:** At base rate (98.5%), survival over 52 independent turns (72 total - 20 dependent) is `0.985^52 ≈ 0.46`. With winter penalties and young vulnerability, effective survival is approximately **30–40%**, matching empirical fawn survival data for northern white-tailed deer.

**Fawn death causes** (randomly selected narrative flavor): killed by predators, died of exposure, succumbed to disease, lost to starvation.

---

## 8. Death Causes

### 1. Event-Triggered Death (Predation)

Choices on predator events can include a `deathChance` field:

```
probability = base
            + sum(statModifiers: stat_value × factor)   (e.g., HEA reduces probability)
            + injuryCount × 0.05
            + parasiteCount × 0.02
            + max(0, (80 - weight) × 0.003)             (underweight vulnerability)

Clamped to [1%, 80%]
```

**Current predator death probabilities:**

| Event | Choice | Base | HEA Factor | Notes |
|-------|--------|------|------------|-------|
| Wolf Pack | Run | 6% | -0.002 | Fleeing; lower risk |
| Wolf Pack | Freeze | 25% | -0.003 | High risk if scented |
| Cougar Ambush | Bolt | 7% | -0.002 | Running from ambush |
| Cougar Ambush | Stand Ground | 18% | -0.003 | Intimidation gamble |
| Hunting Season | Flee Deep | 4% | -0.001 | Lowest predation risk |
| Hunting Season | Hide | 12% | -0.002 | Moderate risk |

**HEA factor:** Negative factor means higher HEA *reduces* death probability. E.g., with HEA = 70 and factor -0.003: adjustment = 70 × (-0.003) = -0.21, reducing probability by 21 percentage points.

### 2. Starvation

Checked in `useGameEngine.checkDeathConditions()`:
- **Death threshold:** weight < 35 lbs
- **Starvation debuffs:** Applied in `advanceTurn` when weight < 60: temporary HEA modifier of `-round(severity × 15)` where `severity = (60 - weight) / 25`

### 3. Disease

For each active parasite at its **final (critical) stage**: 8% death chance per turn.

### 4. Old Age

After 96 months (8 years):

```
yearsOver8 = (age - 96) / 12
deathChance = 0.02 × 1.5^yearsOver8
Clamped to max 95%
```

| Age | Years Over 8 | Death Chance/Turn |
|-----|-------------|-------------------|
| 8 years | 0 | 2.0% |
| 9 years | 1 | 3.0% |
| 10 years | 2 | 4.5% |
| 11 years | 3 | 6.8% |
| 12 years | 4 | 10.1% |
| 14 years | 6 | 22.8% |

**Biological justification:** Wild white-tailed deer rarely exceed 10–12 years. Maximum documented lifespan is approximately 14 years, but predation, disease, and starvation claim most individuals far earlier. The escalating curve models senescence (Promislow 1991).

### Death Order of Evaluation

1. Event-triggered death (check `animal.alive` flag set by death consequences)
2. Starvation (weight < 35)
3. Disease (parasites at critical stage)
4. Old age (escalating after 96 months)

---

## 9. Fitness Scoring

### Inclusive Genetic Fitness

The game's scoring system is based on **inclusive genetic fitness** (Hamilton, 1964). The score equals the number of the player's offspring that survive to reproductive age (18 months / 72 turns).

This is the single most important measure of evolutionary success for any organism. An animal that lives to old age but produces no surviving offspring has fitness 0 — it has been eliminated from the gene pool.

### Score Ratings

| Score | Rating |
|-------|--------|
| 0 | No Surviving Offspring |
| 1 | Below Average |
| 2 | Average — Replacement Rate |
| 3–4 | Above Average |
| 5+ | Exceptional |

**Why 2 = replacement rate:** In a sexually reproducing species, two parents produce offspring. For the population to remain stable, each individual must, on average, contribute 1 surviving offspring to the next generation's breeding pool. Since each offspring has two parents, the individual replacement rate is ~2 surviving offspring per parent (accounting for the fact that not all offspring will successfully breed). This is the fundamental demographic replacement rate for a diploid organism.

### Expected Outcomes

Most playthroughs will end with fitness 0 because:
- The animal must survive to at least 18 months to be eligible for mating
- Mating only occurs in autumn (October–November)
- Female pregnancy lasts 28 turns, with birth in spring
- Fawns require 20 turns of maternal care (if mother dies, they die)
- Even after independence, each fawn has only ~34% chance of surviving to 18 months
- Males must win a buck competition (max 45% probability) to sire offspring

A female who mates in Year 2, survives through birth and fawn dependence, and lives long enough for her fawns to mature (~18 months after birth) will have played approximately 100+ turns of successful survival.

---

## 10. Numerical Reference

### Weight

| Metric | Value |
|--------|-------|
| Female starting weight | 84 lbs |
| Male starting weight | 110 lbs |
| Starvation debuff threshold | < 60 lbs |
| Starvation death threshold | < 35 lbs |
| Minimum weight floor | 20 lbs |

### Age

| Metric | Value |
|--------|-------|
| Starting age (wild-born) | 12 months |
| Starting age (rehabilitation) | 17 months |
| Mating eligibility | 18 months |
| Rut onset event eligibility | 16 months |
| Old age death begins | 96 months (8 years) |

### Reproduction Timing

| Event | Duration/Timing |
|-------|-----------------|
| Rut season | Autumn (Oct–Nov) |
| Gestation | 28 turns (~7 months) |
| Fawn dependence | 20 turns (~5 months) |
| Fawn maturation | 72 turns (18 months) from birth |
| Season reset (mating flags) | First turn of September |

### Event Generation

| Parameter | Value |
|-----------|-------|
| Active events per turn | 1–3 |
| Passive events per turn | 0–2 |
| Cooldown tick | -1 per turn |

### Health System

| Parameter | Value |
|-----------|-------|
| Injury worsening chance (not resting) | 10% per turn |
| Injury worsening penalty | +4 turns healing, +1 severity |
| Disease death chance (critical stage) | 8% per turn |
