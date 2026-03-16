# Narrative Rewrite Guide — Wild Reckoning

This document specifies what text needs to be rewritten and the criteria for the rewrite.
The rewrite should be handled by a separate pipeline (e.g., DeepSeek V3 via OpenRouter
with the designer's custom system prompt), NOT by Claude Code.

## What Needs Rewriting

Every player-facing narrative string in the codebase. The complete inventory:

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
`src/data/ambientText.ts` — seasonal/weather-specific atmospheric prose shown at turn start.

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
- `narrativeText` in instinct nudge descriptions (`src/simulation/instinct/engine.ts`)
- Death cause strings in event consequences
- Choice labels and descriptions

**Total: ~1,000-1,200 distinct narrative text blocks.**

---

## Criteria for Good Narrative Text

The design document (`simulation_refactor.md`) specifies **Lynchian literalism**: describe
events as the animal would conceptualize them. The following rules apply:

### DO
- Describe only what the animal can **sense**: smell, touch, sound, taste, sight, temperature, pain, hunger, proprioception.
- Use **present tense**, second person ("you").
- Be **terse**. One to three sentences. No wasted words.
- Let the **body speak**: "Your right foreleg buckles under weight" instead of "You have a broken leg."
- Allow **ambiguity**: the animal doesn't know what a trail camera is. It smells metal and hears a click.
- Use **specific sensory detail**: not "the forest is beautiful" but "wet bark, cold air, the sound of dripping."

### DO NOT
- **Romanticize or sentimentalize**: No "meditative slowness," "hymn of fear," "ancient, wordless alarm," "something close to safety." No poetic flourishes.
- **Anthropomorphize**: No "you wonder," "you reflect," "you sense something profound." Animals don't wonder. They smell, hear, feel.
- **Break animal POV**: No "a research database you will never know exists," "a biological adhesive," "demographic." The animal doesn't have these concepts.
- **Moralize or Disney-ify**: Compassion doesn't grant wisdom. Helping a stranger doesn't mean "kindness repaid." There are no life lessons.
- **Over-explain**: Don't explain what the animal is experiencing in human terms. Don't add footnotes or parenthetical clarifications.
- **Use hollow literary cliches**: "Older than language," "older than you are," "the weight of the moment," "a stone settling behind you," "electric tension."

### Wisdom-Gated Disclosure
Clinical/medical terms can be used ONLY when:
1. The term describes a **somatic sensation** the animal would feel (e.g., "the ulna" is where it hurts).
2. The information is **non-actionable** — knowing the term doesn't help the player metagame.

Example of what NOT to do: "You have contracted chronic wasting disease, a prion-based
neurological condition..." The animal doesn't know any of this.

Example of what TO do: "Something is wrong behind your eyes. The world tilts. Your legs
do what they want."

### Tone Reference
The designer has a custom system prompt for generating text in the correct style:
https://pastebin.com/wY6xEiwW

And a DeepSeek V3 example output demonstrating the correct tone:
https://pastebin.com/uPBweAcn

---

## Extraction Format

Each narrative block can be extracted as a JSON record for batch rewriting:

```json
{
  "file": "src/data/species/white-tailed-deer/events.ts",
  "eventId": "deer-shelter-hollow",
  "field": "narrativeText",
  "species": "white-tailed-deer",
  "category": "environmental",
  "currentText": "The forest creaks and groans around you...",
  "context": "The deer has found a sheltered hollow to rest in during bad weather."
}
```

The rewrite pipeline should:
1. Extract all narrative blocks to JSON
2. Send each to the LLM with the system prompt + species context
3. Collect rewritten text
4. Patch back into the source files

A script to extract and re-inject could be built using the headless API infrastructure
in `src/api/` as a starting point.
