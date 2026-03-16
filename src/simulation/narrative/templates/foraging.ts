import type { Rng } from '../../../engine/RandomUtils';
import type { ContextualFragment } from './shared';

// ══════════════════════════════════════════════════
//  FORAGING NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Browse Discovery Openings ──

export interface ForageOpening {
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'any';
  quality: 'good' | 'poor' | 'any';
  text: string;
}

export const BROWSE_OPENINGS: ForageOpening[] = [
  { season: 'spring', quality: 'good', text: 'The forest floor is erupting. Green shoots push through the leaf litter everywhere you look. Hepatica, trillium, fiddlehead ferns still curled tight with stored energy. After months of woody browse and bark, the abundance is almost disorienting.' },
  { season: 'spring', quality: 'good', text: 'You lower your nose to the earth and breathe in the green perfume of new growth. The tender shoots are everywhere, soft and rich with the nutrients your winter-depleted body craves.' },
  { season: 'summer', quality: 'good', text: 'The forest canopy is dense and full. Beneath it, browse is plentiful. Clover, wild lettuce, the tender tips of maple saplings, mushrooms pushing through the damp litter.' },
  { season: 'summer', quality: 'any', text: 'You drift through the understory, browsing as you go, picking the tenderest leaves from each shrub and moving on. The routine of summer feeding is steady, your jaw grinding in a slow rhythm.' },
  { season: 'autumn', quality: 'good', text: 'The oaks and beeches are dropping their cargo. Acorns and beechnuts litter the forest floor, crunching beneath your hooves, and the smell of ripe fruit drifts from abandoned orchards.' },
  { season: 'autumn', quality: 'any', text: 'You forage with an urgency that builds with each shorter day. The fat you put on now will carry you through winter. Every calorie matters.' },
  { season: 'winter', quality: 'poor', text: 'The snow covers everything. What browse remains is woody, dry, and bitter. Cedar twigs, stripped bark, frozen lichen pried from tree trunks. Each mouthful costs more energy to find than it returns.' },
  { season: 'winter', quality: 'poor', text: 'You paw through the snow crust, searching for anything beneath. Dried grass, frozen sedge, the shriveled remnants of autumn. The pickings are meager.' },
  { season: 'any', quality: 'good', text: 'Your nose leads you to a patch of browse so abundant your body floods with something like relief. You eat with steady, grinding efficiency, filling the rumen to capacity.' },
  { season: 'any', quality: 'poor', text: 'You have been walking for hours, and every promising patch turns out to be already stripped by other mouths or frozen beyond usefulness. Your stomach aches with emptiness.' },
];

// ── Risky Foraging Scenarios ──

export interface RiskyForageFragment {
  scenario: 'orchard' | 'cornfield' | 'mushroom' | 'roadside';
  text: string;
}

export const RISKY_FORAGES: RiskyForageFragment[] = [
  { scenario: 'orchard', text: 'The apples hang low on unpruned branches, their scent carrying far on the evening air. A human dwelling sits dark beyond the tree line. The lights are off, but the scent of dogs and machinery lingers.' },
  { scenario: 'orchard', text: 'Rotting fruit sweetens the air beneath the orchard trees. The fallen apples are browning but still rich with sugar, a caloric windfall if the humans don\'t notice.' },
  { scenario: 'cornfield', text: 'The corn stands taller than your head, a dense wall of green and gold. Once inside, you will be invisible but also unable to see anything coming.' },
  { scenario: 'cornfield', text: 'The cornfield is a maze of plenty. Each ear you strip from the stalk is dense with energy, but the rustling of your movement in the dry leaves announces your presence to anything listening.' },
  { scenario: 'mushroom', text: 'A cluster of mushrooms pushes through the leaf litter, pale and glistening. Some smell safe. Others look identical to the ones that would cramp your gut for days.' },
  { scenario: 'roadside', text: 'The grass along the road verge is impossibly green, fertilized by runoff, dense and nutritious. But the road hisses with traffic, and every car that passes sends a gust of wind and noise.' },
];

// ── Toxic Plant Encounters ──

export const TOXIC_DISCOVERIES: string[] = [
  'You eat without thinking. The plant looks like a dozen others you have consumed safely. But the taste is wrong, bitter and sharp, and by the time you stop chewing the damage is done.',
  'The leaves are broad, green, tender. Your mouth waters as you take the first bite. Within minutes, a cramping wrongness begins to build in your gut.',
  'It looked right. It smelled close enough. But your stomach rebels, sudden and violent.',
];

// ── Caloric State Descriptions ──

export interface CaloricFragment {
  state: 'surplus' | 'balanced' | 'deficit' | 'critical';
  text: string;
}

export const CALORIC_STATES: CaloricFragment[] = [
  { state: 'surplus', text: 'Your gut is full, the rumen working steadily. Fat is building along your ribs and haunches.' },
  { state: 'surplus', text: 'You chew your cud slowly. For now, your body has more than it needs.' },
  { state: 'balanced', text: 'You are neither hungry nor full. Your body is meeting its needs day by day.' },
  { state: 'deficit', text: 'The hunger is constant now, a low hum beneath every other thought. You eat what you find, but what you find is not enough.' },
  { state: 'deficit', text: 'Your ribs are beginning to show through the winter coat. Each foraging bout yields less than your body demands.' },
  { state: 'critical', text: 'You are starving. Your legs shake when you stand. The edges of your vision dim when you lower your head to chew.' },
  { state: 'critical', text: 'Your body has begun consuming itself. Muscle first, then the last reserves of fat. Each day you are less than you were yesterday.' },
];

// ── Contextual Browse Openings ──
// Parallel to BROWSE_OPENINGS but using ContextualFragment for richer matching.

export const CONTEXTUAL_BROWSE_OPENINGS: ContextualFragment[] = [
  // ── Spring ──
  { season: 'spring', terrain: 'forest', text: 'The forest floor is erupting. Green shoots push through the leaf litter everywhere you look. Hepatica, trillium, fiddlehead ferns still curled tight with stored energy. After months of woody browse and bark, the abundance is almost disorienting.' },
  { season: 'spring', terrain: 'forest', text: 'You lower your nose to the earth and breathe in the green perfume of new growth. The tender shoots are everywhere, soft and rich with the nutrients your winter-depleted body craves.' },
  { season: 'spring', terrain: 'mountain', text: 'The high meadows are last to thaw, but when they do the alpine flowers burst through the snowmelt in sheets of white and violet. You graze the thin soil with deliberate care, each bite yielding a concentrated sweetness the lowlands cannot match.' },
  { season: 'spring', terrain: 'mountain', text: 'Snowmelt courses down the slope, and in its wake the first shoots push through. Crocus, glacier lily, the pale unfurling of sedge grass. The altitude makes each breath cost more, but the browse is untouched by other mouths.' },
  { season: 'spring', terrain: 'water', text: 'Along the creek bank the vegetation is lush with the first true green of the year. Watercress spreads in the shallows, and the willows trail new catkins into the current. You wade ankle-deep to reach the richest growth, the cold water numbing your hooves.' },
  { season: 'spring', terrain: 'water', text: 'The marsh edge is thick with new growth. Cattail shoots, sedge, the broad leaves of skunk cabbage pushing through the muck. The air smells of wet earth and chlorophyll. You eat fast.' },
  { season: 'spring', terrain: 'plain', text: 'The meadow is greening from the edges inward, clover and young grass rising through the matted thatch of last year\'s growth. You graze in the open, exposed but unable to resist the sheer volume of tender forage.' },
  { season: 'spring', timeOfDay: 'dawn', text: 'The first light catches the dew on every new leaf, and you begin to feed before the forest is fully awake. The predators have retreated, and the morning browse is crisp with overnight moisture.' },

  // ── Summer ──
  { season: 'summer', terrain: 'forest', text: 'The canopy is dense and full. Beneath it, browse is plentiful. Clover, wild lettuce, the tender tips of maple saplings, mushrooms pushing through the damp litter.' },
  { season: 'summer', terrain: 'forest', text: 'Dappled light filters through the summer canopy, and in every pool of sun the understory flourishes. You move from shrub to shrub, sampling freely.' },
  { season: 'summer', terrain: 'water', text: 'Along the creek bank, the vegetation is lush and dense with midsummer growth. Jewel-weed, wild mint, and water parsnip crowd the muddy shore. You stand hock-deep in the shallows, tearing mouthfuls of rich green browse while the cool water soothes the insects from your legs.' },
  { season: 'summer', terrain: 'water', text: 'The pond margin is thick with emergent plants. Arrowhead, pickerelweed, the broad pads of water lily. You wade in to graze on the aquatic vegetation, each bite dripping and mineral-rich.' },
  { season: 'summer', terrain: 'mountain', text: 'The alpine meadows are in full bloom, a brief and extravagant display that will end with the first frost. You graze through carpets of wildflowers, each mouthful bright with pollen and nectar.' },
  { season: 'summer', terrain: 'plain', text: 'The open grassland shimmers with heat, but the browse is deep and varied. Goldenrod, milkweed, Queen Anne\'s lace swaying in the warm breeze. You eat with one eye always on the horizon.' },
  { season: 'summer', timeOfDay: 'dusk', text: 'The light is failing, and you emerge from the day-bed to feed in the cooling air. The browse is soft with afternoon warmth, the predators not yet fully alert.' },
  { season: 'summer', timeOfDay: 'dawn', text: 'Morning mist hangs low in the hollows, and the browse is heavy with dew. You graze in the gray half-light, the wet leaves releasing their scent at every bite, the forest still hushed around you.' },

  // ── Autumn ──
  { season: 'autumn', terrain: 'forest', text: 'The oaks and beeches are dropping their cargo. Acorns and beechnuts litter the forest floor, crunching beneath your hooves, and the smell of ripe fruit drifts from abandoned orchards at the forest edge.' },
  { season: 'autumn', terrain: 'forest', text: 'Fallen leaves carpet the forest in bronze and amber, and beneath them the mast crop waits. You nose through the litter, your hooves scattering oak leaves to reveal the acorns cached below. The tannin tang fills your mouth with each bite.' },
  { season: 'autumn', terrain: 'mountain', text: 'The mountain ash berries hang in heavy clusters, bright orange against the gray rock. The altitude has stripped most of the browse already, but these pockets of fruit are dense with sugar.' },
  { season: 'autumn', terrain: 'mountain', text: 'The treeline is lower now. You follow it downslope, feeding on the last of the alpine browse. Withered blueberry, dried sedge, the papery remnants of summer growth.' },
  { season: 'autumn', terrain: 'water', text: 'The creek bank is still producing. Late-season sedge, the seed heads of rushes, tubers that your hooves unearth from the soft mud. The water is cold now, but the riparian browse is richer than the upland forest.' },
  { season: 'autumn', terrain: 'plain', text: 'The fields are stubble and seed. You work through the remnant growth with urgency. Every calorie stored now matters.' },
  { season: 'autumn', timeOfDay: 'dusk', text: 'The days are shortening, and you begin feeding earlier each evening. Dusk comes fast in autumn, and the urgency to eat does not ease.' },

  // ── Winter ──
  { season: 'winter', terrain: 'forest', text: 'The cedars and hemlock still carry their needles, and you strip the lower branches with methodical efficiency. The browse is resinous and bitter, but it fills your rumen and keeps the worst of the hunger at bay.' },
  { season: 'winter', terrain: 'forest', text: 'You move through the bare hardwoods, pausing at each sapling to strip what bark remains. Each day the browse recedes further from reach.' },
  { season: 'winter', terrain: 'mountain', text: 'The browse is gone. Every twig within reach has been stripped, every bark surface gnawed to pale wood. You scrape at frozen lichen with your teeth, but the calories don\'t come close to what your body burns just staying warm.' },
  { season: 'winter', terrain: 'mountain', text: 'Wind scours the exposed ridge, and the snow is packed so hard your hooves barely break the crust. There is nothing here.' },
  { season: 'winter', terrain: 'water', text: 'The creek has frozen at the edges, but in the center the current still runs dark and fast. Along the banks, dried cattail stems and frozen sedge offer a thin ration. You chew the fibrous stalks for what little nutrition they hold.' },
  { season: 'winter', terrain: 'plain', text: 'The open ground is scoured by wind, the snow drifted into sculpted ridges. You paw down to the frozen sod and find dried grass stems, brittle and nearly devoid of nutrition. But you eat them because there is nothing else.' },
  { season: 'winter', weather: 'snow', text: 'You paw through the deep snow, your foreleg plunging to the knee with each stroke. Beneath the white layer the browse is frozen and crusted with ice. Each mouthful must be cracked open like a shell to reach the meager nutrition inside.' },
  { season: 'winter', weather: 'snow', text: 'The snowfall has not stopped for two days. The familiar landmarks are buried, the browse invisible beneath a white uniformity. You dig where memory tells you food should be, and sometimes memory is right.' },
  { season: 'winter', weather: 'snow', terrain: 'mountain', text: 'The drifts on the north face are chest-deep. You flounder through them, burning more calories in the search than the browse can possibly replace. Each pawing excavation reveals only more snow, then frozen earth, then nothing.' },
  { season: 'winter', timeOfDay: 'dawn', text: 'You begin feeding at first light, when the night\'s cold has crusted the snow hard enough to walk on. The dawn browse is frozen solid. You gnaw it from the branch, waiting for your body heat to soften it in the rumen.' },
  { season: 'winter', timeOfDay: 'night', text: 'You feed in the dark because hunger does not respect the clock. Your nose guides you to cedar boughs you stripped yesterday, but your teeth find only bare wood. You move on, deeper into the forest, searching by scent alone.' },

  // ── Generic (any season) ──
  { text: 'Your nose leads you to a patch of browse so abundant your body floods with something like relief. You eat with steady, grinding efficiency, filling the rumen to capacity.' },
  { text: 'The forage here is unremarkable but sufficient. You eat without urgency, filling the rumen with the day\'s allotment of cellulose and moving on.' },
  { timeOfDay: 'dawn', text: 'You feed in the blue half-light of early morning, when the world is still and the browse is damp with dew. Dawn is the safest hour for a deer with an empty stomach.' },
  { timeOfDay: 'dusk', text: 'As the light drains from the sky, you emerge to feed. The evening browse is warm from the day\'s sun, and the cooling air carries the scents of every plant within a hundred yards.' },
];

// ── Seasonal Browse Narratives (paragraph-length, for main trigger text) ──
// These replace the hardcoded entry.narrative strings in foragingConfigs.

export const SEASONAL_BROWSE_NARRATIVES: ContextualFragment[] = [
  // ── Winter — mountain ──
  { season: 'winter', terrain: 'mountain', text: 'The browse is gone. Every twig within reach has been stripped, every bark surface gnawed to pale wood. You scrape at frozen lichen with your teeth, but the calories don\'t come close to what your body burns just staying warm. Your ribs are becoming visible beneath your winter coat.' },
  { season: 'winter', terrain: 'mountain', text: 'The mountain offers nothing. You stand on a wind-blasted ridge, scanning for any scrap of vegetation. There is only rock, ice, and the distant dark line of conifers far below. Your legs tremble. Your body has begun consuming its own muscle.' },
  { season: 'winter', terrain: 'mountain', text: 'You descend the slope in search of browse, each step a careful negotiation with the frozen scree. Near the treeline you find a stunted juniper, its lower branches already stripped. You gnaw higher, stretching your neck to its limit, and manage a few bitter mouthfuls. It is not enough. It is never enough up here.' },

  // ── Winter — snow weather ──
  { season: 'winter', weather: 'snow', text: 'You paw through the snow to reach the dead grass beneath, nosing aside frozen leaves to find the withered remains of summer browse. It\'s enough to quiet the ache in your gut, but just barely. Each mouthful costs almost as many calories to dig up as it provides.' },
  { season: 'winter', weather: 'snow', text: 'The snow is relentless. You crater through it with your forehooves, systematic as a machine, swinging your head to clear each excavation. Beneath, the grass is flattened and gray, more fiber than food. Your rumen grinds it slowly, extracting what little remains.' },
  { season: 'winter', weather: 'snow', text: 'Fresh snowfall has erased your feeding craters from yesterday. You stand in the white silence, sides heaving, and begin again. Pawing, nosing, chewing. The same rhythm since the snows began.' },

  // ── Winter — forest (default winter) ──
  { season: 'winter', terrain: 'forest', text: 'The cedars and hemlock still carry their needles, and you strip the lower branches with methodical efficiency. The browse is resinous and bitter, nutritionally poor, but it fills your rumen and keeps the worst of the hunger at bay.' },
  { season: 'winter', terrain: 'forest', text: 'You work the hemlock stand with practiced economy, biting off needle clusters and stripping bark from the younger stems. The taste is sharp with tannin, but your gut has adapted to winter\'s bitter pharmacy. You chew and chew, the repetitive grinding steady and automatic.' },
  { season: 'winter', terrain: 'forest', text: 'Deep in the cedar swamp, the canopy holds back the worst of the snow. You browse here with other deer. You can see their tracks, smell their presence. All drawn to the same diminishing browse.' },

  // ── Winter — generic ──
  { season: 'winter', text: 'Ice and silence. You strip bark, paw snow, chew browse so dry it turns to dust in your mouth. One mouthful, then the next.' },

  // ── Spring ──
  { season: 'spring', text: 'The forest is waking. New buds swell on every branch, and the first green shoots push through the leaf litter. You graze on tender spring growth. Dandelion, fresh clover, young maple leaves. Each mouthful is dense with the protein and minerals your winter-depleted body craves. Weight is returning to your frame.' },
  { season: 'spring', terrain: 'forest', text: 'After months of bark and dried lichen, the taste of fresh green is almost overwhelming. You gorge on the new growth. Wild garlic, young fern fronds, the tender leaves of dogwood and sassafras. The ribs that showed through your winter coat are slowly disappearing.' },
  { season: 'spring', terrain: 'forest', text: 'Spring rain has called the forest to life. Every surface glistens, and the understory is thick with new growth pushing through the damp leaf litter. You feed fast, your rumen swelling with the first truly nutritious browse in months.' },
  { season: 'spring', terrain: 'mountain', text: 'The high meadows are last to thaw, but when they do the bounty is worth the climb. Glacier lily, spring beauty, mountain sorrel carpet the thin soil. Each mouthful is packed with the concentrated nutrients of a short growing season.' },
  { season: 'spring', terrain: 'water', text: 'The creek is running high with snowmelt, and its banks are the first place to truly green up. Watercress, marsh marigold, and the pale shoots of new cattail push through the saturated soil. You wade in and feed where the browse is richest, the cold water a shock against your legs but the food too good to resist.' },
  { season: 'spring', terrain: 'plain', text: 'The open meadow is a sea of new grass, so green it seems to glow in the spring light. You graze steadily across the open ground, exposed but too hungry to care. The fresh clover and young timothy fill your rumen with a richness the winter browse could never approach.' },
  { season: 'spring', timeOfDay: 'dawn', text: 'Dawn breaks soft and warm, and you are already feeding. The morning dew makes every leaf glisten, and the new shoots are swollen with overnight growth. You eat fast in the quiet gray light. Your winter-thin body demands every calorie.' },

  // ── Summer ──
  { season: 'summer', text: 'The forest is thick with food. Wildflowers in the clearings, succulent forbs along the creek, mushrooms pushing up through the damp leaf litter. You eat steadily, your rumen working through the rich summer diet.' },
  { season: 'summer', terrain: 'forest', text: 'The canopy has closed into dense green overhead, and beneath it the browse is lush and varied. You drift from patch to patch, raspberry cane, jewelweed, the heart-shaped leaves of wild violet, sampling and moving on. There is more wherever you look.' },
  { season: 'summer', terrain: 'forest', text: 'Summer rain has turned the forest floor into a garden. Mushrooms crowd the bases of oaks, ferns unfurl in every gap of light, and the air is thick with the scent of growth. You eat deeply and well, your body storing the surplus as the fat layer thickens along your spine.' },
  { season: 'summer', terrain: 'water', text: 'You follow the creek upstream, browsing as you go. Water parsnip, wild mint, the sweet inner bark of willow. The aquatic browse is mineral-rich. You eat until your legs are mud-caked and your belly is tight.' },
  { season: 'summer', terrain: 'mountain', text: 'The alpine meadows are bright with wildflowers in their brief summer display. You graze through fields of lupine and paintbrush, the high-altitude browse unexpectedly rich. The thin air makes you work harder for each breath, but the forage is untouched. Few deer climb this high.' },
  { season: 'summer', terrain: 'plain', text: 'The grassland is at its peak, waist-high and waving in the warm breeze. You browse the edges where forest meets field. Shade for shelter, open ground for the dense grasses and forbs that full sun produces.' },
  { season: 'summer', timeOfDay: 'dusk', text: 'You emerge from your day-bed as the heat breaks, stepping into the last warm light before dark. The evening browse is soft and warm, releasing its scent at each bite. You eat until the stars appear, filling the rumen to its comfortable limit.' },

  // ── Autumn — mast year ──
  { season: 'autumn', text: 'Acorns blanket the forest floor. The oaks have produced abundantly this year, and you crunch through them with steady, rhythmic feeding. The tannin-rich nuts are building fat reserves along your ribs and haunches.' },
  { season: 'autumn', terrain: 'forest', text: 'Beechnuts litter the ground in such profusion that your hooves cannot avoid them. You eat steadily. Each nut is a pellet of concentrated fat, and your body converts them into the reserves that will carry you through winter.' },
  { season: 'autumn', terrain: 'forest', text: 'Acorns are everywhere. In the leaf litter, in root hollows, scattered across the game trail. You eat hundreds in a single session, your molars cracking each shell, the rich meat flooding your mouth with tannin and oil.' },
  { season: 'autumn', terrain: 'mountain', text: 'The mountain ash berries are ripe, hanging in heavy clusters. You strip them from the branches with your lips, the tart juice running down your chin. At this altitude, the cold is already sharpening.' },
  { season: 'autumn', terrain: 'water', text: 'The creek-side browse has gone to seed, and you feed on the dried heads of rushes and the starchy tubers your hooves unearth from the soft bank. The riparian zone in autumn is less spectacular than in summer, but the tubers are dense with carbohydrates your body converts readily to fat.' },
  { season: 'autumn', terrain: 'plain', text: 'The fields have been cut or gone to seed, and you work through the stubble with urgency. Dried clover heads, fallen grain, the seeds of a dozen grasses.' },
  { season: 'autumn', timeOfDay: 'dusk', text: 'The autumn sun drops below the treeline early now, and you are already feeding when the last light fails. You continue in the dark, guided by scent and memory, driven by the imperative to eat and eat and eat before the world locks shut.' },

  // ── Generic fallback ──
  { text: 'You browse on whatever the forest offers, filling your rumen steadily. The forage is neither abundant nor scarce.' },
  { text: 'The day\'s foraging is unremarkable but sufficient. You move through the available browse with the automatic precision of an animal whose body knows exactly what it needs and how to find it. The rumen fills. The legs carry you forward. The cycle continues.' },
];

// ── Contextual Toxic Discoveries ──
// Replaces the plain string[] TOXIC_DISCOVERIES for richer, context-aware poisoning narratives.

export const CONTEXTUAL_TOXIC_DISCOVERIES: ContextualFragment[] = [
  // ── Spring + water = water hemlock ──
  { season: 'spring', terrain: 'water', text: 'The plant grows thick along the creek bank, its white flower clusters bobbing in the breeze. You eat the tender stem without hesitation. It looks like everything else here. But the taste turns sharp and chemical, and within minutes your muscles begin to seize.' },
  { season: 'spring', terrain: 'water', text: 'Among the watercress and marsh marigold, a cluster of stems rises with compound leaves. You browse it carelessly, your mouth already full. The reaction is immediate. Your jaw locks, your gut spasms, and a metallic wrongness floods your throat.' },

  // ── Spring + forest = false hellebore / mayapple ──
  { season: 'spring', terrain: 'forest', text: 'The broad green leaves are among the first to emerge from the forest floor, and in your hunger you eat without pausing. The taste is wrong. Soapy, bitter, with a numbing quality that spreads from your tongue down your throat. Your stomach rebels within minutes.' },
  { season: 'spring', text: 'The new growth all looks the same in spring. Green, tender. You eat without sorting, and the toxic plant hides among its harmless neighbors. The first sign is a tingling numbness in your lips, then the cramps begin.' },

  // ── Summer + forest = nightshade / pokeweed ──
  { season: 'summer', terrain: 'forest', text: 'The berries are dark and glistening, clustered on a stem that droops with their weight. Your tongue wraps around a cluster and strips them free. The juice is sweet at first, then turns bitter, and a burning sensation spreads through your mouth. Nightshade. Your stomach begins to cramp before you can take another step.' },
  { season: 'summer', text: 'The tall plant with its red-purple stem and heavy berry clusters looks substantial. You eat a mouthful of leaves and the nausea hits almost immediately. Your knees buckle. Your stomach heaves.' },

  // ── Summer + water = blue-green algae ──
  { season: 'summer', terrain: 'water', text: 'The pond surface is covered with a blue-green film, and the water you drink tastes metallic and flat. You swallow the algae with the water. The cyanotoxins work fast. Within the hour, a sickly, tilting quality settles over everything.' },

  // ── Autumn = toxic mushroom ──
  { season: 'autumn', terrain: 'forest', text: 'The mushroom looks nearly identical to the ones you ate safely last week. Same pale cap, same forest-floor habitat. But this one carries a different chemistry. The first bite tastes of earth and rain. The second begins to burn. By the time you stop eating, your gut is already cramping.' },
  { season: 'autumn', text: 'In the wet leaf litter, a cluster of mushrooms glistens with morning dew. You eat two before the third one\'s taste registers as wrong. Acrid, with a delayed bitterness that coats your throat.' },

  // ── Generic (any context) ──
  { text: 'You eat without thinking. The plant looks like a dozen others you have consumed safely. But the taste is wrong, bitter and sharp, and by the time you stop chewing the damage is done.' },
  { text: 'The leaves are broad, green, tender. Your mouth waters as you take the first bite. Within minutes, a cramping wrongness begins to build in your gut.' },
  { text: 'It looked right. It smelled close enough. But your stomach rebels, sudden and violent.' },
  { text: 'The plant is unremarkable. You have passed it a hundred times without stopping. This time you eat, and the chemistry is wrong. The nausea starts slow and builds until your whole body is shaking.' },
];

// ── Risky Foraging Narratives ──
// Contextual narrative fragments for risky foraging scenarios, keyed by terrain/season.
// The `terrain` field doubles as a scenario type indicator for risky foraging:
// 'plain' = agricultural (orchard/cornfield), 'forest' = mushroom, no terrain = generic.

export const RISKY_FORAGING_NARRATIVES: ContextualFragment[] = [
  // ── Orchard scenarios ──
  { season: 'autumn', terrain: 'plain', text: 'A sweet, fermenting smell drifts to you on the evening breeze. Through the tree line you can see rows of fruit trees heavy with produce, some already fallen and splitting open in the grass. A structure sits at the edge, its windows lit, and a territorial animal chained near the entrance.' },
  { season: 'autumn', terrain: 'plain', text: 'The orchard stands in neat rows, its fruit unpicked and rotting on the branch. The sweetness reaches you from two hundred yards. The farmhouse is dark. The dog is silent. You step forward, then stop. Step forward again.' },
  { season: 'summer', terrain: 'plain', text: 'The apple trees are heavy with early fruit, still green but already filling the air with their sharp scent. The fence around the orchard is broken in one place, a gap just wide enough. You stand at its edge, ears forward.' },

  // ── Cornfield scenarios ──
  { season: 'autumn', terrain: 'plain', timeOfDay: 'night', text: 'The field stretches out under the moonlight. The stalks are tall enough to hide you completely, and the ears are fat with ripe kernels. You can hear other deer already inside, the soft tearing of husks and the wet crunch of feeding. But the rich grain in quantity can acidify your gut until it presses against your lungs.' },
  { season: 'autumn', terrain: 'plain', timeOfDay: 'dusk', text: 'As twilight deepens, the cornfield becomes a wall of shadow and whisper. The dry leaves rasp against each other in the evening breeze, masking the sound of your approach. The ears of corn glow faintly gold in the last light. Dense starch and sugar. Your gut remembers the acid burn from the last time.' },
  { season: 'summer', terrain: 'plain', text: 'The corn is still young, the stalks only shoulder-height, but the developing ears are already sweet with milk-stage kernels. You can see the farmhouse from here, the truck in the driveway. Everything here smells of humans. The food is rich. The danger is real.' },

  // ── Mushroom scenarios ──
  { season: 'summer', terrain: 'forest', text: 'A cluster of mushrooms pushes up through the leaf litter at the base of a rotting stump. Pale caps glistening with morning dew, their earthy scent cutting through the dampness. You nose at them cautiously.' },
  { season: 'autumn', terrain: 'forest', text: 'The forest floor after rain is a mushroom garden. They push through the litter in clusters and singles, in white and brown and the occasional alarming red. Your nose twitches over them, sorting the edible from the dangerous by a chemistry you cannot name but have learned to trust. Mostly.' },
  { season: 'summer', terrain: 'forest', timeOfDay: 'dawn', text: 'In the dawn dampness, the mushrooms have emerged overnight. A ring of pale caps circles an old oak stump. The earthy smell is strong. But some of those caps carry compounds that would shut down your liver in hours.' },

  // ── Roadside scenarios ──
  { terrain: 'plain', text: 'The grass along the road verge is impossibly green, fertilized by runoff, dense and nutritious. But the road hisses with traffic, and every car that passes sends a gust of wind and noise that makes your whole body flinch. The food is right there. The death is right there too.' },
  { terrain: 'plain', timeOfDay: 'night', text: 'The highway is quiet at this hour, the traffic reduced to an occasional pair of lights that sweep across the ground and vanish. The roadside growth is thick and green, better than anything the forest offers. You step closer, ears pinned forward, one hoof on the asphalt. The surface is warm and wrong beneath your foot.' },

  // ── Generic risky foraging ──
  { text: 'The food is abundant, richer than anything the forest provides. But the smells here are wrong. Metal, chemicals, the lingering scent of humans. Your stomach pulls you forward. Your nose holds you back.' },
  { text: 'The browse here is dense, but the ground smells of humans and machines. Your body leans forward. Your legs stay planted. The smell of food and the smell of danger come from the same direction.' },
];

// ── Utility ──

export function pickBrowseOpening(
  season: string,
  quality: 'good' | 'poor',
  rng: Rng,
): ForageOpening {
  // Try exact match
  let candidates = BROWSE_OPENINGS.filter(
    (f) => (f.season === season || f.season === 'any') && (f.quality === quality || f.quality === 'any'),
  );
  if (candidates.length === 0) {
    candidates = BROWSE_OPENINGS.filter((f) => f.season === 'any');
  }
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickRiskyForage(scenario: string, rng: Rng): RiskyForageFragment | undefined {
  const candidates = RISKY_FORAGES.filter((f) => f.scenario === scenario);
  if (candidates.length === 0) return undefined;
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickCaloricState(bcs: number, rng: Rng): CaloricFragment {
  const state: CaloricFragment['state'] =
    bcs >= 4 ? 'surplus' : bcs >= 3 ? 'balanced' : bcs >= 2 ? 'deficit' : 'critical';
  const candidates = CALORIC_STATES.filter((f) => f.state === state);
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickFrom(pool: string[], rng: Rng): string {
  return pool[rng.int(0, pool.length - 1)];
}
