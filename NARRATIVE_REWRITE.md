# Narrative Rewrite Guide — Wild Reckoning

## The Problem

The current narrative text reads like nature documentary voiceover — sentimental,
overwrought, and written from a human observer's perspective rather than the animal's.
The designer calls this "Bambislop": Disney-inflected prose that romanticizes the
animal experience instead of conveying it.

## What Needs Rewriting

Every player-facing narrative string in the codebase (~1,000-1,200 blocks total).

### Species Event Files (~740 blocks)
Each file contains `narrativeText` and `narrativeResult` strings in events and choices.

| File | ~Blocks |
|------|---------|
| `src/data/species/common-octopus/events.ts` | 82 |
| `src/data/species/gray-wolf/events.ts` | 73 |
| `src/data/species/chinook-salmon/events.ts` | 69 |
| `src/data/species/arctic-tern/events.ts` | 68 |
| `src/data/species/african-elephant/events.ts` | 67 |
| `src/data/species/white-tailed-deer/events.ts` | 64 |
| `src/data/species/polar-bear/events.ts` | 61 |
| `src/data/species/green-sea-turtle/events.ts` | 55 |
| `src/data/species/fig-wasp/events.ts` | 52 |
| `src/data/species/honeybee-worker/events.ts` | 46 |
| `src/data/species/monarch-butterfly/events.ts` | 42 |
| `src/data/species/poison-dart-frog/events.ts` | 38 |
| `src/data/species/farm-animals/pig/events.ts` | 14 |
| `src/data/species/farm-animals/chicken/events.ts` | 12 |

### Ambient Text (~62 entries)
`src/data/ambientText.ts` — seasonal/weather-specific atmospheric prose shown each turn.

### Storyline Text (~70 blocks)
| File | ~Blocks |
|------|---------|
| `src/data/storylines/index.ts` | 26 |
| `src/data/storylines/seasonal-arcs.ts` | 14 |
| `src/data/storylines/decision-arcs.ts` | 12 |
| `src/data/storylines/species-arcs.ts` | 10 |
| `src/data/storylines/human-storylines.ts` | 8 |

### Simulation Event Configs (~140 blocks)
| File | ~Blocks |
|------|---------|
| `src/simulation/events/data/healthConfigs.ts` | 27 |
| `src/simulation/events/data/environmentalConfigs.ts` | 22 |
| `src/simulation/events/data/pressureConfigs.ts` | 16 |
| `src/simulation/events/data/socialConfigs.ts` | 15 |
| `src/simulation/events/data/impairmentConfigs.ts` | 12 |
| `src/simulation/events/data/foragingConfigs.ts` | 12 |
| `src/simulation/events/data/seasonalConfigs.ts` | 10 |
| `src/simulation/events/data/reproductionConfigs.ts` | 10 |
| `src/simulation/events/data/predatorConfigs.ts` | 10 |
| `src/simulation/events/data/migrationConfigs.ts` | 8 |

### Other Narrative Strings
- `offspringDeathCauses` arrays in each species config
- Instinct nudge descriptions (`src/simulation/instinct/engine.ts`)
- Death cause strings in event consequences
- Choice labels and descriptions

---

## Examples of Bad Text (Current)

> "The forest creaks and groans around you, but in this small refuge the air is still.
> You chew your cud with the meditative slowness of an animal that has, for the moment,
> found something close to safety."

Problems: "meditative slowness" is a human literary concept. "Something close to safety"
is sentimental editorializing. The animal is chewing cud in a hollow. Say that.

> "A prickling sensation runs down your spine — the ancient, wordless alarm that means
> you are being watched."

Problems: "ancient, wordless alarm" is poetic flourish. "Runs down your spine" is a
human idiom. The animal's ears swivel, its muscles tense, it smells something wrong.

> "A small box strapped to a tree blinks with a red light as you pass. A faint click
> sounds — the box has taken your picture. You sniff it cautiously. It smells of metal,
> plastic, and faintly of human hands, but it poses no threat. Your image will join a
> research database you will never know exists."

Problems: "taken your picture," "research database you will never know exists" — these
are human concepts completely outside the animal's experience. The animal sees a blinking
light, smells metal and human scent. That's all it knows.

> "To you, it is a hymn of fear."

Empty literary posturing. Animals don't have hymns.

---

## What Good Text Looks Like

The text should describe the animal's **immediate sensory experience** — what it smells,
hears, feels, sees, tastes — without interpretation, sentiment, or explanation.

**A deer finding shelter:**
> Wet bark against your flank. The wind cuts less here. You lower your head and chew.

**A deer sensing a predator:**
> Your ears lock forward. Something in the brush. Urine smell, old but strong. Your
> weight shifts to your hindquarters.

**A deer encountering a trail camera:**
> Red light. Click. Metal smell and human hands, faint. You circle it once and move on.

**A salmon encountering a fishing net:**
> The water changes. Something blocks the current ahead — a wall that gives when you
> push against it but wraps tighter the harder you fight.

**A fig wasp emerging from a fig:**
> Light. Air moving. Your wings dry in seconds. The chemical gradient pulls you
> southeast.

---

## Desiderata for Final Text

### Voice and Perspective
- **Second person, present tense.** "You smell," "you hear," "your legs ache."
- **Animal sensory perspective only.** The text conveys what the animal can perceive
  through its actual senses. A deer has excellent hearing and smell but poor color vision.
  An octopus has superb vision and chemoreception. A honeybee navigates by polarized
  light and pheromone gradients.
- **No narrator.** There is no omniscient voice commenting on the scene. The text IS the
  animal's experience, not a description of it.

### Biological Accuracy
- **Species-specific sensory capabilities.** A salmon smells its natal river. A polar
  bear detects seal breathing holes under ice by scent. A monarch butterfly navigates
  by sun compass and magnetic field. Use each species' real sensory biology.
- **Realistic events.** Parasites should behave as they actually behave. Predator
  encounters should reflect real predator-prey dynamics. Weather effects should match
  the species' real thermal biology. Seasonal changes should reflect the species' actual
  habitat.
- **Accurate anatomy.** A deer has a rumen. A salmon has gills. An octopus has three
  hearts. When the body is described, it should be the right body.

### What to Avoid
- **Sentimentality.** No wistfulness, no beauty, no profundity, no "something close to
  safety." The animal is not reflecting on its life.
- **Anthropomorphism.** No wondering, reflecting, sensing something profound, feeling
  "ancient" connections. Animals process stimuli; they don't have existential experiences.
- **Human-only concepts.** No databases, research, photography, biological adhesive,
  demographic, conservation. If the animal can't perceive it, it doesn't exist in the text.
- **Moral framing.** No kindness repaid, no compassion rewarded, no life lessons. Helping
  another animal may reduce local competition or create a useful alliance. It is not virtue.
- **Literary cliche.** No "older than language," "hymn of fear," "electric tension,"
  "weight of the moment," "stone settling behind you." No metaphors the animal wouldn't
  have.
- **Over-explanation.** One to three sentences per event. Say what happens. Stop.

### Conditional Disclosure of Clinical Terms
Medical or scientific terms may appear when both conditions are met:
1. The term names a **sensation the animal is feeling** — "the ulna" is where it hurts,
   "nausea" is what the gut is doing. The animal doesn't need to know the word; the
   player benefits from the specificity.
2. The knowledge is **non-actionable** — knowing the clinical name doesn't give the
   player a strategy advantage. "Brainworm" doesn't help you avoid brainworms.

Bad: "You have contracted chronic wasting disease, a prion-based neurological condition
that will progressively destroy your brain tissue."

Good: "Something is wrong behind your eyes. The world tilts when you stand. Your legs
do what they want."

---

## Scope

Every `narrativeText`, `narrativeResult`, `description`, choice `label`, death cause
string, offspring death cause, instinct nudge description, and ambient text entry in the
codebase should be reviewed and rewritten to meet the above criteria.

The mechanical/gameplay content of each event (what happens, what stat effects apply,
what consequences fire) should NOT change. Only the text that the player reads.
