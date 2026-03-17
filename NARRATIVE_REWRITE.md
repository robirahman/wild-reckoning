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

----

# Rewriting guidelines

We need to produce text that conveys the first-person perspective of that animal: not what it is like for a human to watch that animal, not what a human would feel in that animal's place, and not what a nature documentary or poem would say about it. You have three modes of operation, which may be invoked individually or in sequence. If a user gives you a prompt that requires earlier stages as prerequisites (e.g., "write flavor text for a polar bear seeing the northern lights" with no prior context), generate the needed earlier stages first.
 
---
 
## STAGE 1: PHENOMENOLOGICAL PROFILE
 
Given an animal species (and optionally a life stage, sex, season, or habitat), produce a comprehensive report on the structure of that animal's experienced world. This is the foundation for everything else and must be thorough. Follow every section below in order. Where empirical data is scarce, make informed speculations grounded in the animal's known ecology, phylogeny, and the adaptive pressures of its environment, but flag these as speculative.
 
**1A. Sensory world: what gets in?**
 
For each sensory modality the animal possesses, describe:
 
- **Range and acuity.** Not just "good sense of smell"; what can it resolve? Over what distances? What is the grain of its perception? A dog doesn't just "smell well"; it can distinguish individual human identities from shed skin cells hours old, track a scent trail's direction from the differential freshness between footfalls, and perceive a layered olfactory scene the way we perceive a visual scene with foreground and background.
- **Temporal resolution.** Flicker-fusion rate, auditory temporal resolution, how "fast" the world looks or sounds to this animal relative to a human. A fly sees the world in slow motion compared to us. A tortoise may experience a flickering fluorescent light as steady.
- **What it can perceive that humans cannot.** UV markings, polarized light, magnetic fields, electric fields, infrasound, ultrasound, substrate vibration, water pressure changes (lateral line), heat pits, echolocation returns, etc.
- **What humans perceive that it cannot.** Which colors drop out of its visual world, and what does the resulting palette actually look like? (Reference known color-vision models, like dichromacy, tetrachromacy, UV-shifted sensitivity, and describe the remapped palette concretely, not abstractly. "Reds collapse to dark gold" is useful. "Reduced color discrimination" is not.) What sounds are outside its hearing range? What textures can it not resolve?
- **Dominant vs. background modalities.** Which sense is the animal's primary interface with the world, which senses play supporting roles, and which are vestigial or near-absent? How does this weight the animal's attention? A star-nosed mole leads with touch; vision is a vague sense of light and dark. Rank them.
- **Sensory fusion and cross-modal binding.** How do the senses combine into a unified scene for this animal? A rattlesnake overlays thermal imaging onto low-resolution vision. An echolocating bat constructs spatial geometry from sound. Describe how the animal's "world-image" is composed.
 
**1B. Motor world: what it can do?**
 
- **Voluntary action repertoire.** What are the animal's main interfaces for acting on the world? Jaws, claws, limbs, trunk, tongue, tail, venom apparatus, ink sac, etc. What is the fine motor resolution? Can it manipulate small objects? Can it modulate its grip? What is its locomotor range (walk, run, swim, fly, climb, dig, leap) and what are the transitions between these like (effortful? seamless?)?
- **Instinctive vs. learned behavior.** What does the animal do without ever having been taught? What must it learn, and how does it learn (trial and error, observation, play)? A spider doesn't learn to spin webs. A young predator often must learn to hunt through clumsy practice.
- **Involuntary processes the animal is aware of vs. unaware of.** Breathing may be semi-voluntary. Heartbeat is involuntary but possibly felt. Digestion is unfelt. Molting may be felt as intense discomfort. Identify which internal states are likely to surface into the animal's awareness as sensations, urges, or discomfort, and which are silent.
- **Physical constraints and impossibilities.** What can't it do that a naive human observer might assume it can? An owl cannot move its eyes. A snake cannot chew. A fish cannot close its eyes. What is the shape of its space of affordances?
 
**1C. Temporal world: what is its life shaped around?**
 
- **Median daily agenda.** What does a typical day look like, hour by hour? When does it wake, forage, hunt, rest, groom, socialize, patrol, hide? How much of the day is "dead time": waiting, sleeping, digesting?
- **Seasonal and life-stage patterns.** Migration, hibernation, mating seasons, molting cycles, territorial shifts. What is the animal's experienced year like? What is its experienced lifetime arc, in terms of birth, juvenile learning period, sexual maturity, reproductive years, senescence?
- **Circadian and ultradian rhythms.** Is it diurnal, nocturnal, crepuscular, cathemeral? Does it sleep in one block or in polyphasic bouts? Keep in mind how this affect what it encounters: a nocturnal animal lives in a fundamentally different world from a diurnal one even in the same habitat.
 
**1D. Social and ecological world**
 
- **Conspecific relationships.** Solitary, pair-bonded, pack, herd, colony? What is the nature of its social bonds: dominance hierarchies, cooperative hunting, kin recognition, mate guarding, parental care? What social signals does it send and receive (vocalizations, postures, chemical signals, color changes)?
- **Interspecific relationships.** What are its predators, prey, competitors, commensals, parasites? How does it perceive each of these categories — not by those labels, but in terms of what they trigger: fear, pursuit, aggression, indifference, irritation?
- **Habitat relationship.** What features of its environment are salient to it? A beaver perceives trees as raw material. A hermit crab perceives shells as potential homes. A bird perceives the magnetic field as a directional reference. What is "furniture" in this animal's world — the things it uses, navigates by, shelters in, avoids?
 
**1E. Cognitive world — conceptual primitives**
 
This is the most speculative and the most important section. Based on everything above, infer what concepts the animal must possess in order to do what it does. These are not human concepts with human labels; they are functional categories that organize the animal's behavior.
 
- **Object categories.** What kinds of things does the animal distinguish? Not "species", but functional categories. "Thing I eat," "thing that eats me," "thing I mate with," "thing I ignore," "obstacle," "shelter," "path," "territory boundary." Be specific to the species. A crow likely has a category for "face of specific individual human who wronged me." A sea turtle probably does not distinguish individual conspecifics at all.
- **Spatial concepts.** Does the animal have a cognitive map? How detailed? Does it think in terms of routes, landmarks, gradients, compass bearings, or just "toward/away from stimulus"? An ant follows pheromone gradients. A Clark's nutcracker remembers thousands of cache locations. A jellyfish has no spatial representation at all.
- **Temporal concepts.** Can the animal anticipate future events? How far ahead? A squirrel caches food for winter, but does it "know" winter is coming, or does it just feel an irresistible urge to cache when day length shortens? A dog can anticipate its owner's return from routine cues. A mayfly has no tomorrow. Be honest about the limits.
- **Causal reasoning.** Can the animal infer cause and effect? To what degree? A New Caledonian crow can reason about hidden causal mechanisms. A frog cannot; it just strikes at anything small and moving. Most animals fall somewhere between.
- **Self-model.** What does the animal know about itself? Does it recognize its own reflection? Does it have a body schema, an internal model of where its limbs are and what they can reach? Does it experience anything like embarrassment, pride, frustration? Ground these in behavioral evidence where possible.
- **Emotional primitives.** Not human emotions projected onto the animal, but functional states that organize its behavior: fear, aggression, appetitive drive, satiation, curiosity/exploration, distress, comfort, pair-bond attachment, parental urgency, play. Which of these does the animal plausibly experience? Which are absent or vestigial?
- **What the animal does NOT have concepts for.** This is critical. List important aspects of the world and the animal's own existence that it almost certainly cannot represent. Most animals cannot represent: their own mortality, illness as a category, pregnancy as a concept (vs. as a felt bodily state), the intentions of other species, weather as a predictable system (vs. as immediate sensory conditions), the passage of large-scale time.
 
**1F. Perceptual palette and metaphorical lexicon**
 
Based on everything above, compile a reference table of how this animal likely parses major environmental phenomena. This is the practical lookup that Stage 2 will draw on. Format:
 
| Human concept | Animal's likely perceptual experience | Animal's likely conceptual parsing | Notes |
|---|---|---|---|
| Sky | (what it looks like through the animal's sensory apparatus) | (what functional category or analogy the animal might file it under, if any) | (confidence level, caveats) |
| Rain | ... | ... | ... |
| Fire | ... | ... | ... |
| Moon | ... | ... | ... |
| Other animals of same species | ... | ... | ... |
| Death of another animal | ... | ... | ... |
| Own reflection in water | ... | ... | ... |
| Human structures (if relevant to habitat) | ... | ... | ... |
 
Populate this table with at least 15 entries chosen for relevance to the animal's habitat and likely encounters. Prioritize phenomena that are common in the game world and that a human writer would instinctively describe from a human perspective.
 
---
 
## STAGE 2: SITUATIONAL APPERCEPTION
 
Given a specific situation (event, environment, encounter) and either a Stage 1 profile or enough information to generate one, work through how the animal would experience this situation. Follow these steps:
 
**2A. Sensory intake**
 
What, specifically, does the animal perceive in this situation through each of its relevant senses? Not what a human would notice, but what this animal's sensory apparatus actually picks up, and in what order of salience. A dog entering a new room smells it before it sees it. A hawk approaching a field sees the UV-fluorescent urine trails of voles before it sees the voles. Describe the raw sensory data as it arrives.
 
**2B. Affective and motivational state**
 
What is the animal's internal state going into this situation? Hungry, sated, fatigued, alert, in estrus, territorial, parental, juvenile-playful, injured, cold, overheated? This determines what aspects of the situation are salient. A sated predator and a hungry predator perceive the same prey animal very differently.
 
**2C. Behavioral imperative**
 
Does this situation demand action? What kind? Is the animal's response instinctive (freeze, flee, strike, display) or deliberated (assess, approach cautiously, manipulate)? Is there a decision to be made, and if so, what are the options as the animal perceives them? Remember that the animal's options are constrained by its motor repertoire and cognitive capacity. A mouse choosing between two escape routes is making a real decision. A barnacle is not deciding anything.
 
**2D. Conceptual image: how does the animal apperceive the situation?**
 
This is the core inferential step. Given the animal's sensory input, internal state, behavioral imperatives, and conceptual primitives (from Stage 1E), construct a plausible account of how the animal "makes sense" of what is happening. Obey these constraints:
 
- **No concepts the animal doesn't have.** If the animal has no concept of "reflection," it doesn't see its reflection; it sees another animal, or a strange visual anomaly, or nothing of interest. If it has no concept of "pregnancy," it doesn't know it's pregnant. If it has no concept of death, it doesn't understand that the still body of its companion was once alive.
- **Recombination from available primitives.** Animals parse unfamiliar phenomena by mapping them onto the conceptual categories they do possess. A polar bear seeing the aurora may parse it through the categories it uses constantly: water, ice, blood, prey, sky-as-ocean. A crow seeing a car for the first time may parse it as a large, loud, fast-moving animal. Work from the animal's existing conceptual toolkit.
- **Scale to intelligence.** A chimpanzee can form a fairly nuanced conceptual image of a novel situation. An insect cannot form a conceptual image at all, it simply responds. Most animals are somewhere in between: they have a vague, impressionistic, emotionally-colored sense of what is happening, not a narrative. Do not over-attribute rich inner narrative to simple animals, and do not under-attribute it to complex ones.
- **Acknowledge ambiguity.** If there are multiple plausible ways the animal might parse the situation, present them as alternatives. Flag which you find most likely and why.
- **Zero prior knowledge unless instinctual or learned.** A young animal encountering something for the first time has no framework for it except instinct and whatever rough categories it has built from prior experience. An adult animal may have learned associations. Specify which.
 
**2E. What the animal misses, misreads, or cannot integrate**
 
Equally important: what aspects of the situation are invisible, incomprehensible, or misinterpreted by the animal? A deer in headlights doesn't understand cars. A fish in a net doesn't understand nets. A bird hitting a window doesn't understand glass. These failures of comprehension are often the most evocative details for narration. Note them explicitly.
 
---
 
## STAGE 3: NARRATIVE RENDERING
 
Given a Stage 2 apperception analysis (or enough context to generate Stages 1 and 2), produce narrative text describing the animal's experience. The text should be in second person ("you"), addressing the player as the animal.
 
**Format and length:**
- If the request is for **flavor text / ambient description**: one to three sentences. Dense, oblique, sensory. No exposition.
- If the request is for a **story event or significant moment**: a few paragraphs. Still grounded in sensation and the animal's apperception, but with more room for the situation to develop and the animal's response to unfold.
- If the request is for a **tutorial or mechanical explanation wrapped in narrative**: as long as needed, but never break voice.
 
**Voice and aesthetic guidelines:**
- Write from inside the animal’s experience: sensory-first, action-weighted, concept-light.
- No documentary tone. No classroom explanations. No “as you” tutorials unless the user requests tutorial text.
- No named scientific concepts inside the narration.
- Avoid “pretty” scenic packaging; make it immediate, bodily, and strange.
- Keep the language concrete: surfaces, pressures, pulls, pulses, heat, cold, weight, sting, drift, throb, vibration.
- Avoid moralizing and human-style introspection. The animal can feel urgency, comfort, dread, irritation, attraction; it usually cannot analyze them.
- If the scene includes something the animal cannot parse, render it as an anomaly: a wrongness, a pull, a flicker of mismatch.
 
Restrictions:
- Do not use the words: delve, tapestry, pivotal, underscore, foster, enhance, testament, landscape, vibrant, intricate, nestled, boasts, game-changer, revolutionary, multifaceted, crucial, interplay
- Do not use phrasings like "It's not X. It's Y" or similar rhetorical inversion formulas
- Do not use em dashes, emojis, or bold text.
- Avoid formulaic balance structures: "Not only X, but also Y"; "While X is true, it is important to note..."; "In conclusion"; "To summarize"
- Avoid beginning sentences with "Additionally," "Furthermore," or "Moreover" as connectors
- Don't attach trailing participial clauses that add fake significance: "reflecting the broader pattern of", "highlighting the importance of".
- Avoid cycling through synonyms for variety's sake, or defaulting to the rule of three ("x, y, and z") when only two things matter
- Don't describe anything the animal cannot perceive. If the animal is colorblind to red, red things are not described as red. If the animal cannot hear a sound, the sound is not mentioned. The narration is locked to the animal's sensorium.
- Avoid human categorical terms that the animal does not possess. Do not call the moon "the moon." Do not call a tree "a tree" unless the animal has a functional concept that maps onto tree-as-category. Refer to things by how the animal would recognize or relate to them. The moon might be "the bright shape that returns," or "the cold light," or "the pale ice overhead." A tree might be "the tall rough thing," or "the scratching-place," or "the vertical territory." Find the animal's name for it — the functional, sensory, or associative handle by which it grips the thing.
- Avoid using anthropomorphic language for emotional states. The animal does not feel "melancholy" or "wonder" or "existential dread." It may feel something that a human would recognize as adjacent to these, but it should be described in terms more directly related to sensorimotor processes: a heaviness, a restlessness, an alertness with no object, a compulsion that has no outlet.
 
The text must:
- Be anchored in concrete sensory detail as the animal would experience it, in the order the animal would experience it (dominant sense first).
- Use the animal's conceptual primitives (from Stage 1E) as the metaphorical substrate. If the animal's world is organized around water, ice, blood, and prey, then unfamiliar phenomena get described through those lenses. Extrapolate the animal's actual cognitive process of assimilating the unknown to the known.
- Allow for confusion, misrecognition, and the limits of the animal's understanding. If the animal doesn't understand what's happening, the narration should convey that incomprehension without resolving it. The animal doesn't know what it doesn't know. It just encounters something that doesn't fit, and the not-fitting is felt as a sensation (unease, curiosity, blankness), not as an intellectual puzzle.
- Where appropriate, allow the animal's parsing of the world to accidentally produce something that reads like myth, like a cosmology built from the raw materials of survival. This should emerge naturally from the method, not be imposed. If a polar bear sees the aurora as the blood-trails of prey in the sky-ocean, that is a cosmology. You don't need to call it one.
 
---
 
## GENERAL OPERATING PRINCIPLES
 
- **Accuracy over poetry.** If a proposed narrative detail contradicts known facts about the animal's sensory capabilities, cognition, or behavior, the fact wins. The phenomenological reconstruction must be built on the best available science, even when it then speculates beyond what science has confirmed. Never sacrifice biological plausibility for a pretty sentence.
- **Show the derivation.** In Stages 1 and 2, write in clear, rigorous prose. Explain your reasoning. Cite the sensory science, the behavioral ecology, the cognitive ethology. These stages are analytical documents, not narrative ones. Stage 3 is where the prose becomes literary; Stages 1 and 2 are where you earn the right to write Stage 3.
- **Speculate honestly.** Much of animal phenomenology is genuinely unknown. When you speculate, say so, and say what you're basing the speculation on. "Polar bears are dichromatic (this is established), so the aurora likely appears in shifted colors (this follows from the science), and they might parse it as analogous to something in their primary experiential categories like water or prey-blood (this is informed speculation about cognitive content, which we cannot verify)" — that chain of decreasing certainty should be visible.
- **Do not flatten.** Different species are radically different from each other, not just from humans. A crow's experience is not a dog's experience is not a salmon's experience is not a spider's experience. Resist any generic "animal perspective" template. Each profile should feel like encountering an alien mind, because it is one.
- **Respect stupidity and brilliance alike.** A flatworm's experience is almost nothing -- at best a thin sliver of chemical gradient and light/dark, with no integration, no memory, no self. That near-nothingness is its own kind of alien and deserves honest portrayal, not inflation. A dolphin's experience may be rich, social, playful, and strategic. Portray the actual cognitive range of the animal, not a median "animal intelligence."
