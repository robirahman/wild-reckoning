/** Phase 14: Encyclopedia/Bestiary data */

import type { EncyclopediaEntry } from '../types/encyclopedia';

export const ENCYCLOPEDIA_ENTRIES: EncyclopediaEntry[] = [
  // ── Species Entries (unlocked by playing) ──
  {
    id: 'species-deer',
    category: 'species',
    title: 'White-tailed Deer',
    content: 'Odocoileus virginianus. The most widespread large mammal in North America, adapted to forest edges and early-succession habitats. Bucks grow and shed antlers annually, using them in ritualized combat for mating access. Does typically bear 1-3 fawns in late spring. Their population has exploded in the absence of wolves across much of their range, leading to overbrowsing that transforms entire forest ecosystems.',
    unlockCondition: { type: 'species_played', speciesId: 'white-tailed-deer' },
  },
  {
    id: 'species-wolf',
    category: 'species',
    title: 'Gray Wolf',
    content: 'Canis lupus. The largest wild canid, living in packs of 5-10 built around a breeding pair. Wolves are apex predators whose presence triggers trophic cascades — in Yellowstone, wolf reintroduction changed the behavior of elk, which allowed riverbank vegetation to recover, stabilizing stream banks and changing the physical course of rivers. Their cooperative hunting allows them to take prey many times their own size.',
    unlockCondition: { type: 'species_played', speciesId: 'gray-wolf' },
  },
  {
    id: 'species-elephant',
    category: 'species',
    title: 'African Elephant',
    content: 'Loxodonta africana. The largest living land animal, with matriarchal social structures and extraordinary cognitive abilities. Elephants mourn their dead, use tools, and possess the largest brain of any land animal. Their role as ecosystem engineers — toppling trees, digging water holes, creating paths through dense vegetation — makes them a keystone species whose absence transforms landscapes.',
    unlockCondition: { type: 'species_played', speciesId: 'african-elephant' },
  },
  {
    id: 'species-salmon',
    category: 'species',
    title: 'Chinook Salmon',
    content: 'Oncorhynchus tshawytscha. The largest Pacific salmon species, undertaking one of nature\'s most dramatic migrations — from open ocean to the exact freshwater stream of their birth. Their bodies undergo radical transformation for the spawning run: jaws hook, skin thickens, color shifts from silver to deep red. After spawning, they die, and their nutrient-rich carcasses fertilize the forest ecosystem for miles around the stream.',
    unlockCondition: { type: 'species_played', speciesId: 'chinook-salmon' },
  },
  {
    id: 'species-polar-bear',
    category: 'species',
    title: 'Polar Bear',
    content: 'Ursus maritimus. The world\'s largest land predator, classified as a marine mammal due to its dependence on sea ice for hunting ringed seals. Polar bears can smell a seal through three feet of ice. Climate change is shrinking their hunting platform — for every week that sea ice breaks up earlier, bears come ashore roughly 20 pounds lighter. They face an uncertain future as Arctic ice retreats.',
    unlockCondition: { type: 'species_played', speciesId: 'polar-bear' },
  },
  {
    id: 'species-turtle',
    category: 'species',
    title: 'Green Sea Turtle',
    content: 'Chelonia mydas. One of the largest sea turtles, and the only herbivorous species as an adult. They navigate thousands of miles of open ocean to return to the exact beach where they hatched, using the Earth\'s magnetic field as a compass. A single female may lay over 1,000 eggs across a nesting season, yet only about 1 in 1,000 hatchlings survives to adulthood. Their grazing maintains healthy seagrass beds that serve as nurseries for countless fish species.',
    unlockCondition: { type: 'species_played', speciesId: 'green-sea-turtle' },
  },
  {
    id: 'species-monarch',
    category: 'species',
    title: 'Monarch Butterfly',
    content: 'Danaus plexippus. Famous for their multi-generational migration spanning up to 3,000 miles between Mexico and Canada. No single butterfly makes the round trip — it takes 3-4 generations going north and one "super generation" going south. Their caterpillars feed exclusively on milkweed, sequestering cardiac glycosides that make them toxic to predators. The iconic orange-and-black pattern is a warning signal recognized across the animal kingdom.',
    unlockCondition: { type: 'species_played', speciesId: 'monarch-butterfly' },
  },
  {
    id: 'species-fig-wasp',
    category: 'species',
    title: 'Fig Wasp',
    content: 'Agaonidae family. One of nature\'s most extraordinary mutualisms — each of the ~750 fig species has its own specific pollinator wasp species. The female wasp enters a fig through a tiny opening called the ostiole, losing her wings and antennae in the process. She pollinates the fig\'s flowers, lays her eggs, and dies inside. Her offspring develop within the fig, mate, and the cycle repeats. Neither organism can reproduce without the other.',
    unlockCondition: { type: 'species_played', speciesId: 'fig-wasp' },
  },
  {
    id: 'species-octopus',
    category: 'species',
    title: 'Common Octopus',
    content: 'Octopus vulgaris. Perhaps the most intelligent invertebrate, with a distributed nervous system — two-thirds of their neurons are in their arms, which can taste, smell, and act semi-independently. They use tools (coconut shells as shelters), solve puzzles, and can change both color and texture in milliseconds. Females guard their eggs for months without eating, dying shortly after the eggs hatch. Their short lifespan (~1-2 years) means each octopus must learn everything from scratch.',
    unlockCondition: { type: 'species_played', speciesId: 'common-octopus' },
  },
  {
    id: 'species-honeybee',
    category: 'species',
    title: 'Honeybee Worker',
    content: 'Apis mellifera. A single worker bee lives only 5-6 weeks in summer, yet the colony she serves may persist for years. Workers undergo a remarkable career progression — nurse, house bee, forager, scout — regulated by hormones and colony needs. The waggle dance, which communicates the distance and direction of food sources, is one of the most sophisticated non-primate communication systems known. Colony collapse disorder, driven by pesticides and parasites, threatens global food security.',
    unlockCondition: { type: 'species_played', speciesId: 'honeybee-worker' },
  },
  {
    id: 'species-tern',
    category: 'species',
    title: 'Arctic Tern',
    content: 'Sterna paradisaea. Holder of the longest migration of any animal — pole to pole and back, roughly 44,000 miles annually. Over a 30-year lifespan, a tern may fly the equivalent of three round trips to the Moon. They experience more daylight than any other creature, chasing perpetual summer between Arctic and Antarctic. Despite weighing barely 4 ounces, they will aggressively dive-bomb predators many times their size to defend their nests.',
    unlockCondition: { type: 'species_played', speciesId: 'arctic-tern' },
  },
  {
    id: 'species-dart-frog',
    category: 'species',
    title: 'Poison Dart Frog',
    content: 'Dendrobatidae family. Their brilliant coloration is aposematic — a warning that they are among the most toxic animals on Earth. The golden poison frog (Phyllobates terribilis) carries enough batrachotoxin to kill 10 adult humans. Remarkably, their toxicity comes entirely from their diet of alkaloid-rich ants and mites; captive-bred frogs are non-toxic. Many species show extraordinary parental care, carrying tadpoles on their backs to individual bromeliad pools and feeding them unfertilized eggs.',
    unlockCondition: { type: 'species_played', speciesId: 'poison-dart-frog' },
  },

  // ── Ecology Entries ──
  {
    id: 'ecology-trophic-cascade',
    category: 'ecology',
    title: 'Trophic Cascades',
    content: 'When a top predator is added or removed from an ecosystem, the effects ripple down through every level of the food web. The reintroduction of wolves to Yellowstone in 1995 is the textbook example: wolves reduced elk numbers, which allowed willows and aspens to recover, which stabilized riverbanks, which changed the physical course of rivers. The presence or absence of a single species can reshape an entire landscape.',
    unlockCondition: { type: 'default' },
  },
  {
    id: 'ecology-keystone-species',
    category: 'ecology',
    title: 'Keystone Species',
    content: 'A keystone species has a disproportionately large effect on its environment relative to its abundance. Remove the keystone and the ecosystem transforms. Sea otters eating sea urchins protect kelp forests. Elephants toppling trees maintain savanna grasslands. Prairie dogs create habitat for burrowing owls, black-footed ferrets, and dozens of other species. The concept was first described by Robert Paine in 1969 after removing purple sea stars from a tidal pool.',
    unlockCondition: { type: 'default' },
  },
  {
    id: 'ecology-r-k-selection',
    category: 'ecology',
    title: 'r/K Selection Theory',
    content: 'Species fall on a spectrum between r-strategists (many offspring, little parental investment — salmon, sea turtles, fig wasps) and K-strategists (few offspring, high investment — elephants, wolves, humans). R-strategists bet on numbers: produce thousands of eggs and a few will survive. K-strategists bet on quality: invest heavily in each offspring to maximize its survival. Most species fall somewhere between these extremes.',
    unlockCondition: { type: 'default' },
  },
  {
    id: 'ecology-migration',
    category: 'ecology',
    title: 'Animal Migration',
    content: 'Migration is one of the most energetically expensive behaviors in the animal kingdom. Animals navigate using the sun, stars, Earth\'s magnetic field, smell, and even infrasound. The Arctic tern migrates 44,000 miles annually. Monarch butterflies navigate to a specific forest in Mexico across multiple generations. Salmon return to their birth stream using olfactory memory. Migration corridors are increasingly fragmented by human development, making each journey more perilous.',
    unlockCondition: { type: 'default' },
  },
  {
    id: 'ecology-parasitism',
    category: 'ecology',
    title: 'Parasitism',
    content: 'Parasites may be the most successful life strategy on Earth — over 40% of known species are parasitic. They drive host evolution (the Red Queen hypothesis), regulate population sizes, and can reshape entire ecosystems. Toxoplasma gondii makes infected mice attracted to cat urine. Parasitic wasps turn caterpillars into zombie bodyguards. Malaria has killed more humans than any war. Understanding parasites is understanding the hidden architecture of ecosystems.',
    unlockCondition: { type: 'default' },
  },

  // ── Behavior Entries ──
  {
    id: 'behavior-territory',
    category: 'behavior',
    title: 'Territorial Behavior',
    content: 'Territory is space defended against intruders of the same species. The economic defendability model predicts that animals only maintain territories when the benefits (food, mates, shelter) outweigh the costs (energy, injury risk, time). Wolves use howling and scent-marking. Birds sing. Frogs call. Fish display. The size of a territory often scales with body size and metabolic needs. In many species, residents almost always win against intruders — the "bourgeois strategy."',
    unlockCondition: { type: 'default' },
  },
  {
    id: 'behavior-parental-care',
    category: 'behavior',
    title: 'Parental Investment',
    content: 'The amount of energy a parent invests in each offspring varies enormously across species and often differs between sexes. In most mammals, females invest more (gestation, lactation). In many fish and frogs, males guard eggs. In birds, biparental care is common. The trade-off is always the same: invest more in this offspring or save energy for future reproduction. Trivers\' theory of parental investment explains why the sex that invests more is choosier about mates.',
    unlockCondition: { type: 'default' },
  },
  {
    id: 'behavior-senescence',
    category: 'behavior',
    title: 'Senescence and Aging',
    content: 'Why do organisms age? The disposable soma theory argues that bodies are temporary vessels for genes — maintaining them beyond reproductive age has diminishing evolutionary returns. Some species show negligible senescence (rockfish, tortoises). Others, like Pacific salmon, undergo programmed rapid senescence after spawning. Elephants and orcas are notable for post-reproductive life, where grandmothers contribute to the survival of younger generations.',
    unlockCondition: { type: 'default' },
  },

  // ── Anatomy/Adaptation Entries ──
  {
    id: 'anatomy-camouflage',
    category: 'anatomy',
    title: 'Camouflage and Mimicry',
    content: 'Cephalopods represent the pinnacle of animal camouflage — octopuses can match the color, pattern, and texture of their surroundings in under a second using chromatophores (pigment cells), iridophores (reflective cells), and papillae (texture bumps). This is achieved despite being colorblind. Mimicry takes many forms: Batesian (harmless species mimics toxic one), Mullerian (toxic species share warning patterns), and aggressive (predator mimics harmless species).',
    unlockCondition: { type: 'species_played', speciesId: 'common-octopus' },
  },
  {
    id: 'anatomy-aposematism',
    category: 'anatomy',
    title: 'Aposematic Coloration',
    content: 'Bright, conspicuous coloration that warns predators of toxicity or unpalatability. Poison dart frogs, monarch butterflies, and coral snakes all use aposematic signals. The strategy only works if predators can learn — which is why aposematic species tend to be common, conspicuous, and slow-moving. The cost is being visible; the benefit is that educated predators leave you alone. Some non-toxic species cheat by mimicking the warning colors of toxic ones.',
    unlockCondition: { type: 'species_played', speciesId: 'poison-dart-frog' },
  },
  {
    id: 'anatomy-echolocation',
    category: 'anatomy',
    title: 'Animal Navigation',
    content: 'Animals navigate using an extraordinary array of senses. Sea turtles detect the Earth\'s magnetic field. Salmon smell their birth stream across thousands of miles of ocean. Bees see ultraviolet patterns on flowers. Elephants communicate via infrasound below human hearing range. Arctic terns appear to use a sun compass corrected for time of day. The mechanisms behind many of these abilities remain only partially understood.',
    unlockCondition: { type: 'default' },
  },

  // ── Habitat Entries ──
  {
    id: 'habitat-coral-reef',
    category: 'habitat',
    title: 'Coral Reef Ecosystems',
    content: 'Coral reefs cover less than 1% of the ocean floor but support 25% of all marine species. They are built by tiny coral polyps that secrete calcium carbonate skeletons over centuries. Reefs provide nursery habitat, coastal protection, and food security for hundreds of millions of people. Rising ocean temperatures cause coral bleaching — the expulsion of symbiotic algae — which has devastated reefs worldwide. The Great Barrier Reef has lost over 50% of its coral since 1995.',
    unlockCondition: { type: 'species_played', speciesId: 'green-sea-turtle' },
  },
  {
    id: 'habitat-arctic-sea-ice',
    category: 'habitat',
    title: 'Arctic Sea Ice',
    content: 'Arctic sea ice is not just frozen water — it is an entire ecosystem. Algae grow on the underside of ice, feeding zooplankton, which feed fish, which feed seals, which feed polar bears. The ice also serves as a platform for seal pupping and bear hunting. Arctic sea ice extent has declined by roughly 13% per decade since 1979. Summer ice-free conditions, once predicted for 2100, may arrive decades sooner.',
    unlockCondition: { type: 'species_played', speciesId: 'polar-bear' },
  },
  {
    id: 'habitat-temperate-forest',
    category: 'habitat',
    title: 'Temperate Deciduous Forest',
    content: 'The seasonal rhythm of temperate forests — leaf-out in spring, full canopy in summer, leaf fall in autumn, dormancy in winter — creates a constantly shifting habitat. Mast years (bumper acorn crops) trigger population booms in mice and deer, which cascade through predator populations the following year. The understory light environment changes dramatically with the seasons, supporting different plant and animal communities at different times of year.',
    unlockCondition: { type: 'species_played', speciesId: 'white-tailed-deer' },
  },
  {
    id: 'habitat-tropical-rainforest',
    category: 'habitat',
    title: 'Tropical Rainforest',
    content: 'Tropical rainforests contain more than half of all species on Earth in just 6% of the land surface. Vertical stratification creates distinct habitats from forest floor to canopy. Bromeliads — plants that collect pools of water in their leaf rosettes — create miniature aquatic ecosystems 100 feet above the ground, where poison dart frogs raise their tadpoles. Rainforests cycle water so effectively that they generate their own rainfall.',
    unlockCondition: { type: 'species_played', speciesId: 'poison-dart-frog' },
  },
  {
    id: 'habitat-african-savanna',
    category: 'habitat',
    title: 'African Savanna',
    content: 'The savanna is shaped by three forces: rainfall, fire, and herbivory. Too much of any one and the balance shifts — grassland becomes woodland, or vice versa. Elephants are the primary architects, pushing over trees to maintain the open landscape. The great migrations of wildebeest and zebra follow rainfall patterns, moving nutrients across the landscape. Termite mounds create islands of fertility that support distinct plant communities.',
    unlockCondition: { type: 'species_played', speciesId: 'african-elephant' },
  },
  {
    id: 'habitat-pacific-river',
    category: 'habitat',
    title: 'Pacific Northwest Rivers',
    content: 'Salmon-bearing rivers are nutrient highways connecting the ocean to the forest. When salmon die after spawning, their ocean-derived nitrogen and phosphorus fertilize streamside vegetation, which is taken up by trees whose roots shade and cool the water for the next generation of salmon. Bears, eagles, and dozens of other species depend on salmon runs. Dams, logging, and climate change have reduced Pacific salmon populations to a fraction of their historical numbers.',
    unlockCondition: { type: 'species_played', speciesId: 'chinook-salmon' },
  },
];
