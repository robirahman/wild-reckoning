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
  { season: 'spring', quality: 'good', text: 'The forest floor is erupting. Green shoots push through the leaf litter everywhere you look — hepatica, trillium, fiddlehead ferns still curled tight with stored energy. After months of woody browse and bark, the abundance is almost disorienting.' },
  { season: 'spring', quality: 'good', text: 'You lower your nose to the earth and breathe in the green perfume of new growth. The tender shoots are everywhere, soft and rich with the nutrients your winter-depleted body craves.' },
  { season: 'summer', quality: 'good', text: 'The forest canopy is dense and generous. Beneath it, a wealth of browse presents itself — clover, wild lettuce, the tender tips of maple saplings, mushrooms pushing through the damp litter.' },
  { season: 'summer', quality: 'any', text: 'You drift through the understory, browsing as you go, picking the tenderest leaves from each shrub and moving on. The routine of summer feeding is meditative, almost peaceful.' },
  { season: 'autumn', quality: 'good', text: 'The oaks and beeches are dropping their cargo. Acorns and beechnuts litter the forest floor, crunching beneath your hooves, and the smell of ripe fruit drifts from abandoned orchards.' },
  { season: 'autumn', quality: 'any', text: 'You forage with an urgency that builds with each shorter day. The fat you put on now will carry you through winter, and your body knows it — every calorie matters.' },
  { season: 'winter', quality: 'poor', text: 'The snow covers everything. What browse remains is woody, dry, and bitter — cedar twigs, stripped bark, frozen lichen pried from tree trunks. Each mouthful costs more energy to find than it seems to return.' },
  { season: 'winter', quality: 'poor', text: 'You paw through the snow crust, searching for anything beneath — dried grass, frozen sedge, the shriveled remnants of autumn\'s abundance. The pickings are meager.' },
  { season: 'any', quality: 'good', text: 'Your nose leads you to a patch of browse so abundant your body floods with something like relief. You eat with steady, grinding efficiency, filling the rumen to capacity.' },
  { season: 'any', quality: 'poor', text: 'You have been walking for hours, and every promising patch turns out to be already stripped by other mouths or frozen beyond usefulness. Your stomach aches with emptiness.' },
];

// ── Risky Foraging Scenarios ──

export interface RiskyForageFragment {
  scenario: 'orchard' | 'cornfield' | 'mushroom' | 'roadside';
  text: string;
}

export const RISKY_FORAGES: RiskyForageFragment[] = [
  { scenario: 'orchard', text: 'The apples hang low on unpruned branches, their scent carrying far on the evening air. A human dwelling sits dark beyond the tree line — the lights are off, but the scent of dogs and machinery lingers.' },
  { scenario: 'orchard', text: 'Rotting fruit sweetens the air beneath the orchard trees. The fallen apples are browning but still rich with sugar, a caloric windfall if the humans don\'t notice.' },
  { scenario: 'cornfield', text: 'The corn stands taller than your head, a dense wall of green and gold. Once inside, you\'ll be invisible — but also unable to see anything coming.' },
  { scenario: 'cornfield', text: 'The cornfield is a maze of plenty. Each ear you strip from the stalk is dense with energy, but the rustling of your movement in the dry leaves announces your presence to anything listening.' },
  { scenario: 'mushroom', text: 'A cluster of mushrooms pushes through the leaf litter, pale and glistening. Some are safe — your instincts tell you so — but others look identical to the ones that would cramp your gut for days.' },
  { scenario: 'roadside', text: 'The grass along the road verge is impossibly green, fertilized by runoff, dense and nutritious. But the road hisses with traffic, and every car that passes sends a gust of wind and noise.' },
];

// ── Toxic Plant Encounters ──

export const TOXIC_DISCOVERIES: string[] = [
  'You eat without thinking — the plant looks like a dozen others you\'ve consumed safely. But the taste is wrong, bitter and sharp, and by the time you stop chewing the damage is done.',
  'The leaves are appealing — broad, green, tender. Your mouth waters as you take the first bite. Within minutes, a cramping wrongness begins to build in your gut.',
  'It looked right. It smelled close enough. But your body knows before your mind does — a sudden, violent rebellion in your stomach that says this was a mistake.',
];

// ── Caloric State Descriptions ──

export interface CaloricFragment {
  state: 'surplus' | 'balanced' | 'deficit' | 'critical';
  text: string;
}

export const CALORIC_STATES: CaloricFragment[] = [
  { state: 'surplus', text: 'Your gut is full, the rumen working steadily. Fat is building along your ribs and haunches — reserves against leaner times.' },
  { state: 'surplus', text: 'You chew your cud with the slow satisfaction of a body that has, for now, more than it needs.' },
  { state: 'balanced', text: 'You are neither hungry nor full — the steady equilibrium of an animal meeting its needs day by day.' },
  { state: 'deficit', text: 'The hunger is constant now, a low hum beneath every other thought. You eat what you find, but what you find is not enough.' },
  { state: 'deficit', text: 'Your ribs are beginning to show through the winter coat. Each foraging bout yields less than your body demands.' },
  { state: 'critical', text: 'You are starving. The word doesn\'t capture it — the hollowness, the weakness in your legs, the way the world dims at the edges when you lower your head to chew.' },
  { state: 'critical', text: 'Your body has begun consuming itself. Muscle first, then the last reserves of fat. Each day you are less than you were yesterday.' },
];

// ── Contextual Browse Openings ──
// Parallel to BROWSE_OPENINGS but using ContextualFragment for richer matching.

export const CONTEXTUAL_BROWSE_OPENINGS: ContextualFragment[] = [
  // ── Spring ──
  { season: 'spring', terrain: 'forest', text: 'The forest floor is erupting. Green shoots push through the leaf litter everywhere you look — hepatica, trillium, fiddlehead ferns still curled tight with stored energy. After months of woody browse and bark, the abundance is almost disorienting.' },
  { season: 'spring', terrain: 'forest', text: 'You lower your nose to the earth and breathe in the green perfume of new growth. The tender shoots are everywhere, soft and rich with the nutrients your winter-depleted body craves.' },
  { season: 'spring', terrain: 'mountain', text: 'The high meadows are last to thaw, but when they do the alpine flowers burst through the snowmelt in sheets of white and violet. You graze the thin soil with deliberate care, each bite yielding a concentrated sweetness the lowlands cannot match.' },
  { season: 'spring', terrain: 'mountain', text: 'Snowmelt courses down the slope in silver threads, and in its wake the first shoots are already pushing through — crocus, glacier lily, the pale unfurling of sedge grass. The altitude makes each breath cost more, but the browse is untouched by other mouths.' },
  { season: 'spring', terrain: 'water', text: 'Along the creek bank the vegetation is lush with the first true green of the year. Watercress spreads in the shallows, and the willows trail new catkins into the current. You wade ankle-deep to reach the richest growth, the cold water numbing your hooves.' },
  { season: 'spring', terrain: 'water', text: 'The marsh edge is a riot of new growth — cattail shoots, sedge, the broad leaves of skunk cabbage pushing through the muck. The air smells of wet earth and chlorophyll, and your body responds to both with an urgency that borders on hunger-madness.' },
  { season: 'spring', terrain: 'plain', text: 'The meadow is greening from the edges inward, clover and young grass rising through the matted thatch of last year\'s growth. You graze in the open, exposed but unable to resist the sheer volume of tender forage.' },
  { season: 'spring', timeOfDay: 'dawn', text: 'The first light catches the dew on every new leaf, and you begin to feed before the forest is fully awake. Dawn foraging is safest — the predators have retreated, and the morning browse is crisp with overnight moisture.' },

  // ── Summer ──
  { season: 'summer', terrain: 'forest', text: 'The canopy is dense and generous. Beneath it, a wealth of browse presents itself — clover, wild lettuce, the tender tips of maple saplings, mushrooms pushing through the damp litter.' },
  { season: 'summer', terrain: 'forest', text: 'Dappled light filters through the summer canopy, and in every pool of sun the understory flourishes. You move from shrub to shrub, sampling the season\'s abundance with an ease that feels almost wasteful.' },
  { season: 'summer', terrain: 'water', text: 'Along the creek bank, the vegetation is lush and dense with midsummer growth. Jewel-weed, wild mint, and water parsnip crowd the muddy shore. You stand hock-deep in the shallows, tearing mouthfuls of rich green browse while the cool water soothes the insects from your legs.' },
  { season: 'summer', terrain: 'water', text: 'The pond margin is thick with emergent plants — arrowhead, pickerelweed, the broad pads of water lily. You wade in to graze on the aquatic vegetation, each bite dripping and mineral-rich, flavored by the silt of the bottom.' },
  { season: 'summer', terrain: 'mountain', text: 'The alpine meadows are in full bloom, a brief and extravagant display that will end with the first frost. You graze through carpets of wildflowers, each mouthful bright with pollen and nectar.' },
  { season: 'summer', terrain: 'plain', text: 'The open grassland shimmers with heat, but the browse is deep and varied — goldenrod, milkweed, Queen Anne\'s lace swaying in the warm breeze. You eat with one eye always on the horizon.' },
  { season: 'summer', timeOfDay: 'dusk', text: 'The light is failing, and you emerge from the day-bed to feed in the cooling air. Dusk is your hour — the browse is soft with afternoon warmth, the predators not yet fully alert, and the forest belongs to you.' },
  { season: 'summer', timeOfDay: 'dawn', text: 'Morning mist hangs low in the hollows, and the browse is heavy with dew. You graze in the gray half-light, the wet leaves releasing their scent at every bite, the forest still hushed around you.' },

  // ── Autumn ──
  { season: 'autumn', terrain: 'forest', text: 'The oaks and beeches are dropping their cargo. Acorns and beechnuts litter the forest floor, crunching beneath your hooves, and the smell of ripe fruit drifts from abandoned orchards at the forest edge.' },
  { season: 'autumn', terrain: 'forest', text: 'Fallen leaves carpet the forest in bronze and amber, and beneath them the mast crop waits. You nose through the litter, your hooves scattering oak leaves to reveal the acorns cached below. The tannin tang fills your mouth with each bite.' },
  { season: 'autumn', terrain: 'mountain', text: 'The mountain ash berries hang in heavy clusters, flame-orange against the gray rock. The altitude has stripped most of the browse already, but these pockets of fruit are worth the climb — dense with sugar, a last gift before the snow.' },
  { season: 'autumn', terrain: 'mountain', text: 'The treeline is retreating downslope as autumn tightens its grip on the peaks. You follow it, feeding on the last of the alpine browse — withered blueberry, dried sedge, the papery remnants of summer\'s abundance.' },
  { season: 'autumn', terrain: 'water', text: 'The creek bank is still producing — late-season sedge, the seed heads of rushes, tubers that your hooves unearth from the soft mud. The water is cold now, but the riparian browse is richer than the upland forest.' },
  { season: 'autumn', terrain: 'plain', text: 'The fields are stubble and seed. You work through the remnant growth with an urgency your body drives without consulting your mind — every calorie stored now is a day survived later.' },
  { season: 'autumn', timeOfDay: 'dusk', text: 'The days are shortening, and you begin feeding earlier each evening. Dusk comes fast in autumn, and with it a restless urgency — your body counting the diminishing hours of forage time.' },

  // ── Winter ──
  { season: 'winter', terrain: 'forest', text: 'The cedars and hemlock still carry their needles, and you strip the lower branches with methodical efficiency. The browse is resinous and bitter, but it fills your rumen and keeps the worst of the hunger at bay.' },
  { season: 'winter', terrain: 'forest', text: 'You move through the bare hardwoods like a ghost, pausing at each sapling to strip what bark remains. The forest in winter is an exercise in diminishing returns — each day the browse recedes further from reach.' },
  { season: 'winter', terrain: 'mountain', text: 'The browse is gone. Every twig within reach has been stripped, every bark surface gnawed to pale wood. You scrape at frozen lichen with your teeth, but the calories don\'t come close to what your body burns just staying warm.' },
  { season: 'winter', terrain: 'mountain', text: 'Wind scours the exposed ridge, and the snow is packed so hard your hooves barely break the crust. There is nothing here. The mountain in winter is a place of bone and stone and slow starvation.' },
  { season: 'winter', terrain: 'water', text: 'The creek has frozen at the edges, but in the center the current still runs dark and fast. Along the banks, dried cattail stems and frozen sedge offer a thin ration. You chew the fibrous stalks for what little nutrition they hold.' },
  { season: 'winter', terrain: 'plain', text: 'The open ground is scoured by wind, the snow drifted into sculpted ridges. You paw down to the frozen sod and find dried grass stems, brittle and nearly devoid of nutrition. But you eat them because there is nothing else.' },
  { season: 'winter', weather: 'snow', text: 'You paw through the deep snow, your foreleg plunging to the knee with each stroke. Beneath the white layer the browse is frozen and crusted with ice. Each mouthful must be cracked open like a shell to reach the meager nutrition inside.' },
  { season: 'winter', weather: 'snow', text: 'The snowfall has not stopped for two days. The familiar landmarks are buried, the browse invisible beneath a white uniformity. You dig where memory tells you food should be, and sometimes memory is right.' },
  { season: 'winter', weather: 'snow', terrain: 'mountain', text: 'The drifts on the north face are chest-deep. You flounder through them, burning more calories in the search than the browse can possibly replace. Each pawing excavation reveals only more snow, then frozen earth, then nothing.' },
  { season: 'winter', timeOfDay: 'dawn', text: 'You begin feeding at first light, when the night\'s cold has crusted the snow hard enough to walk on. The dawn browse is frozen solid — you gnaw it from the branch like chewing wood, waiting for your body heat to soften it in the rumen.' },
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
  { season: 'winter', terrain: 'mountain', text: 'The mountain offers nothing. You stand on a wind-blasted ridge, turning your head slowly, scanning for any scrap of vegetation the other animals might have missed. There is only rock, ice, and the distant dark line of conifers far below. Your legs tremble — not from cold, but from the slow unraveling of muscle fiber your body has begun to consume.' },
  { season: 'winter', terrain: 'mountain', text: 'You descend the slope in search of browse, each step a careful negotiation with the frozen scree. Near the treeline you find a stunted juniper, its lower branches already stripped. You gnaw higher, stretching your neck to its limit, and manage a few bitter mouthfuls. It is not enough. It is never enough up here.' },

  // ── Winter — snow weather ──
  { season: 'winter', weather: 'snow', text: 'You paw through the snow to reach the dead grass beneath, nosing aside frozen leaves to find the withered remains of summer browse. It\'s enough to quiet the ache in your gut, but just barely. Each mouthful costs almost as many calories to dig up as it provides.' },
  { season: 'winter', weather: 'snow', text: 'The snow is relentless. You crater through it with your forehooves, systematic as a machine, swinging your head to clear each excavation. Beneath, the grass is flattened and gray, more fiber than food. Your rumen grinds it slowly, extracting what little remains.' },
  { season: 'winter', weather: 'snow', text: 'Fresh snowfall has erased your feeding craters from yesterday. You stand in the white silence, sides heaving, and begin again — the same exhausting rhythm of pawing and nosing and chewing that has defined every waking hour since the snows began.' },

  // ── Winter — forest (default winter) ──
  { season: 'winter', terrain: 'forest', text: 'The cedars and hemlock still carry their needles, and you strip the lower branches with methodical efficiency. The browse is resinous and bitter, nutritionally poor, but it fills your rumen and keeps the worst of the hunger at bay.' },
  { season: 'winter', terrain: 'forest', text: 'You work the hemlock stand with practiced economy, biting off needle clusters and stripping bark from the younger stems. The taste is sharp with tannin, but your gut has adapted to winter\'s bitter pharmacy. You chew and chew, the repetitive grinding almost meditative.' },
  { season: 'winter', terrain: 'forest', text: 'Deep in the cedar swamp, the canopy holds back the worst of the snow. You browse here with other deer — you can see their tracks, smell their presence — all of you drawn to the same diminishing pantry. The competition is silent but relentless.' },

  // ── Winter — generic ──
  { season: 'winter', text: 'The world is locked in ice and silence. You move through the frozen landscape with the grim efficiency of an animal that has done this before — stripping bark, pawing snow, chewing browse so dry it turns to dust in your mouth. Survival is not dramatic. It is this: one mouthful, then the next.' },

  // ── Spring ──
  { season: 'spring', text: 'The forest is waking. New buds swell on every branch, and the first green shoots push through the leaf litter with urgent vitality. You graze on tender spring growth — dandelion, fresh clover, young maple leaves — each mouthful a concentrated burst of the protein and minerals your winter-depleted body craves. You can feel the recovery beginning, weight returning to your frame.' },
  { season: 'spring', terrain: 'forest', text: 'After months of bark and dried lichen, the taste of fresh green is almost overwhelming. You gorge on the new growth — wild garlic, young fern fronds, the tender leaves of dogwood and sassafras. Your body responds with a rush of something you had almost forgotten: vitality. The ribs that showed through your winter coat are slowly disappearing.' },
  { season: 'spring', terrain: 'forest', text: 'Spring rain has called the forest to life. Every surface glistens, and the understory is thick with new growth pushing through the damp leaf litter. You feed ravenously, your rumen swelling with the first truly nutritious browse in months. The protein hits your bloodstream like a drug.' },
  { season: 'spring', terrain: 'mountain', text: 'The high meadows are last to thaw, but when they do the bounty is worth the wait. Alpine wildflowers — glacier lily, spring beauty, mountain sorrel — carpet the thin soil in a brief, brilliant display. You graze through the color, each mouthful packed with the concentrated nutrients of a short, intense growing season.' },
  { season: 'spring', terrain: 'water', text: 'The creek is running high with snowmelt, and its banks are the first place to truly green up. Watercress, marsh marigold, and the pale shoots of new cattail push through the saturated soil. You wade in and feed where the browse is richest, the cold water a shock against your legs but the food too good to resist.' },
  { season: 'spring', terrain: 'plain', text: 'The open meadow is a sea of new grass, so green it seems to glow in the spring light. You graze steadily across the open ground, exposed but too hungry to care. The fresh clover and young timothy fill your rumen with a richness the winter browse could never approach.' },
  { season: 'spring', timeOfDay: 'dawn', text: 'Dawn breaks soft and warm, and you are already feeding. The morning dew makes every leaf glisten, and the new shoots are swollen with overnight growth. You eat in the quiet gray light with a focus that borders on desperation — your winter-thin body demanding every calorie the spring can offer.' },

  // ── Summer ──
  { season: 'summer', text: 'The forest is thick with food. Lush browse fills every layer — wildflowers in the clearings, succulent forbs along the creek, mushrooms pushing up through the damp leaf litter. You eat with the unhurried satisfaction of an animal surrounded by abundance, your rumen working steadily through the rich summer diet.' },
  { season: 'summer', terrain: 'forest', text: 'The canopy has closed into a green cathedral, and beneath it the browse is lush and varied. You drift from patch to patch — raspberry cane, jewelweed, the heart-shaped leaves of wild violet — sampling and moving on with the casual ease of an animal that knows there will be more.' },
  { season: 'summer', terrain: 'forest', text: 'Summer rain has turned the forest floor into a garden. Mushrooms crowd the bases of oaks, ferns unfurl in every gap of light, and the air is thick with the scent of growth. You eat deeply and well, your body storing the surplus as the fat layer thickens along your spine.' },
  { season: 'summer', terrain: 'water', text: 'The creek bank is a linear feast. You follow its course upstream, browsing as you go — water parsnip, wild mint, the sweet inner bark of willow. The aquatic browse is mineral-rich and your body craves it. You eat until your legs are mud-caked and your belly is tight.' },
  { season: 'summer', terrain: 'mountain', text: 'The alpine meadows blaze with wildflowers in their brief, intense summer display. You graze through fields of lupine and paintbrush, the high-altitude browse unexpectedly rich. The thin air makes you work harder for each breath, but the forage is untouched — few deer climb this high.' },
  { season: 'summer', terrain: 'plain', text: 'The grassland is at its peak, waist-high and waving in the warm breeze. You browse the edges where forest meets field, taking advantage of both worlds — shade for shelter, open ground for the dense grasses and forbs that only full sun can produce.' },
  { season: 'summer', timeOfDay: 'dusk', text: 'You emerge from your day-bed as the heat breaks, stepping into the golden hour when the forest is most generous. The evening browse is soft and warm, releasing its scent at each bite. You eat until the stars appear, filling the rumen to its comfortable limit.' },

  // ── Autumn — mast year ──
  { season: 'autumn', text: 'Acorns blanket the forest floor in a dense, copper-brown carpet. The oaks have produced abundantly this year, and you crunch through them with steady, rhythmic feeding. The tannin-rich nuts are building fat reserves along your ribs and haunches — an invisible armor against the approaching winter.' },
  { season: 'autumn', terrain: 'forest', text: 'The beech trees have outdone themselves this autumn. Beechnuts litter the ground in such profusion that your hooves cannot avoid them, and you eat with a methodical greed that your body insists upon. Each nut is a pellet of concentrated fat, and your metabolism converts them efficiently into the reserves that will sustain you through the months of scarcity ahead.' },
  { season: 'autumn', terrain: 'forest', text: 'You work the oak flat with the focused intensity of an animal on a deadline. Acorns are everywhere — in the leaf litter, nestled in root hollows, scattered across the game trail. You eat hundreds in a single session, your molars cracking each shell with practiced efficiency, the rich meat inside flooding your mouth with tannin and oil.' },
  { season: 'autumn', terrain: 'mountain', text: 'The mountain ash berries are ripe, hanging in heavy, flame-colored clusters. You strip them from the branches with your lips, the tart juice running down your chin. At this altitude, every calorie is a calculated deposit against the winter that is already whispering in the wind.' },
  { season: 'autumn', terrain: 'water', text: 'The creek-side browse has gone to seed, and you feed on the dried heads of rushes and the starchy tubers your hooves unearth from the soft bank. The riparian zone in autumn is less spectacular than in summer, but the tubers are dense with carbohydrates your body converts readily to fat.' },
  { season: 'autumn', terrain: 'plain', text: 'The fields have been cut or have gone to seed, and you work through the stubble with an urgency that builds with each shorter day. Dried clover heads, fallen grain, the seeds of a dozen grasses — every morsel is inventory against the coming cold.' },
  { season: 'autumn', timeOfDay: 'dusk', text: 'The autumn sun drops below the treeline early now, and you are already feeding when the last light fails. You continue in the dark, guided by scent and memory, driven by the imperative to eat and eat and eat before the world locks shut.' },

  // ── Generic fallback ──
  { text: 'You browse on whatever the forest offers, filling your rumen with methodical efficiency. The forage is neither abundant nor scarce — it is simply what the land provides, and you take it without complaint or celebration.' },
  { text: 'The day\'s foraging is unremarkable but sufficient. You move through the available browse with the automatic precision of an animal whose body knows exactly what it needs and how to find it. The rumen fills. The legs carry you forward. The cycle continues.' },
];

// ── Contextual Toxic Discoveries ──
// Replaces the plain string[] TOXIC_DISCOVERIES for richer, context-aware poisoning narratives.

export const CONTEXTUAL_TOXIC_DISCOVERIES: ContextualFragment[] = [
  // ── Spring + water = water hemlock ──
  { season: 'spring', terrain: 'water', text: 'The plant grows thick along the creek bank, its white flower clusters bobbing in the breeze. You eat the tender stem without hesitation — it looks like everything else here. But the taste turns sharp and chemical, and within minutes your muscles begin to seize. Water hemlock. The most toxic plant in the wetland, and you walked right into it.' },
  { season: 'spring', terrain: 'water', text: 'Among the watercress and marsh marigold, a cluster of stems rises with innocent-looking compound leaves. You browse it carelessly, your mouth already full. The reaction is immediate and violent — your jaw locks, your gut spasms, and a metallic wrongness floods your throat. The creek bank, so generous moments ago, has poisoned you.' },

  // ── Spring + forest = false hellebore / mayapple ──
  { season: 'spring', terrain: 'forest', text: 'The broad green leaves are among the first to emerge from the forest floor, and in your hunger you eat before thinking. The taste is wrong — soapy, bitter, with a numbing quality that spreads from your tongue down your throat. False hellebore. Your stomach rebels within minutes, heaving against the toxins.' },
  { season: 'spring', text: 'The new growth all looks the same in spring — green, tender, promising. You eat without discrimination, and the toxic plant hides among its harmless neighbors. The first sign is a tingling numbness in your lips, then the cramps begin, deep and twisting.' },

  // ── Summer + forest = nightshade / pokeweed ──
  { season: 'summer', terrain: 'forest', text: 'The berries are dark and glistening, clustered on a stem that droops with their weight. Your tongue wraps around a cluster and strips them free. The juice is sweet at first, then turns bitter, and a burning sensation spreads through your mouth. Nightshade. Your stomach begins to cramp before you can take another step.' },
  { season: 'summer', text: 'The tall plant with its red-purple stem and heavy berry clusters looks substantial, nutritious. You eat a mouthful of leaves and feel the alkaloids hit almost immediately — a wave of nausea so intense your knees buckle. Pokeweed. The lesson comes too late.' },

  // ── Summer + water = blue-green algae ──
  { season: 'summer', terrain: 'water', text: 'The pond surface is covered with a blue-green film, and the water you drink tastes metallic and flat. You don\'t think of the algae as food — you simply swallow it with the water. But the cyanotoxins work fast. Within the hour, your liver is under siege and the world has taken on a sickly, tilting quality.' },

  // ── Autumn = toxic mushroom ──
  { season: 'autumn', terrain: 'forest', text: 'The mushroom looks nearly identical to the ones you ate safely last week — same pale cap, same forest-floor habitat. But this one carries a different chemistry. The first bite tastes of earth and rain, unremarkable. The second begins to burn. By the time you stop eating, your gut is already cramping with a deep, invasive pain.' },
  { season: 'autumn', text: 'In the wet leaf litter, a cluster of mushrooms glistens with morning dew. You eat two before the third one\'s taste registers as wrong — acrid, with a delayed bitterness that coats your throat. The amatoxins are already in your bloodstream, beginning their slow work on your liver.' },

  // ── Generic (any context) ──
  { text: 'You eat without thinking — the plant looks like a dozen others you\'ve consumed safely. But the taste is wrong, bitter and sharp, and by the time you stop chewing the damage is done.' },
  { text: 'The leaves are appealing — broad, green, tender. Your mouth waters as you take the first bite. Within minutes, a cramping wrongness begins to build in your gut.' },
  { text: 'It looked right. It smelled close enough. But your body knows before your mind does — a sudden, violent rebellion in your stomach that says this was a mistake.' },
  { text: 'The plant is unremarkable in every way — the kind you pass a hundred times without notice. This time you stop, and this time you eat, and this time the chemistry is wrong. The nausea starts slow and builds until your whole body is shaking.' },
];

// ── Risky Foraging Narratives ──
// Contextual narrative fragments for risky foraging scenarios, keyed by terrain/season.
// The `terrain` field doubles as a scenario type indicator for risky foraging:
// 'plain' = agricultural (orchard/cornfield), 'forest' = mushroom, no terrain = generic.

export const RISKY_FORAGING_NARRATIVES: ContextualFragment[] = [
  // ── Orchard scenarios ──
  { season: 'autumn', terrain: 'plain', text: 'The smell drifts to you on the evening breeze — sweet, fermenting, irresistible. Through the tree line you can see rows of fruit trees heavy with produce, some already fallen and splitting open in the grass. A structure sits at the edge, its windows lit, and a territorial animal chained near the entrance. The food is close, almost within reach. But this is human ground.' },
  { season: 'autumn', terrain: 'plain', text: 'The orchard stands in neat rows, its fruit unpicked and rotting on the branch. The sweetness of it reaches you from two hundred yards — a caloric beacon your winter-anxious body cannot ignore. The farmhouse is dark. The dog is silent. Every instinct screams both go and don\'t.' },
  { season: 'summer', terrain: 'plain', text: 'The apple trees are heavy with early fruit, still green but already filling the air with their sharp, promising scent. The fence around the orchard is broken in one place — a gap just wide enough for a deer. You stand at its edge, ears forward, weighing the calories against the risk.' },

  // ── Cornfield scenarios ──
  { season: 'autumn', terrain: 'plain', timeOfDay: 'night', text: 'The field stretches out under the moonlight like a dark, rustling sea. The stalks are tall enough to hide you completely, and the ears are fat with ripe kernels — a concentration of calories the forest cannot match. You can hear other deer already inside, the soft tearing of husks and the wet crunch of feeding. But the rich grain in quantity can acidify your gut until it presses against your lungs.' },
  { season: 'autumn', terrain: 'plain', timeOfDay: 'dusk', text: 'As twilight deepens, the cornfield becomes a wall of shadow and whisper. The dry leaves rasp against each other in the evening breeze, masking the sound of your approach. The ears of corn glow faintly gold in the last light — each one a dense package of starch and sugar. Your gut remembers the last time, the acid burn, but your hunger has a shorter memory.' },
  { season: 'summer', terrain: 'plain', text: 'The corn is still young, the stalks only shoulder-height, but the developing ears are already sweet with milk-stage kernels. You can see the farmhouse from here, the truck in the driveway, the subtle wrongness of a landscape shaped entirely by human hands. The food is extraordinary. The danger is real.' },

  // ── Mushroom scenarios ──
  { season: 'summer', terrain: 'forest', text: 'A cluster of mushrooms pushes up through the leaf litter at the base of a rotting stump — pale caps glistening with morning dew, their earthy scent cutting through the dampness. You nose at them cautiously. Fungi are a delicacy your body craves, rich in minerals the browse cannot provide.' },
  { season: 'autumn', terrain: 'forest', text: 'The forest floor after rain is a mushroom garden. They push through the litter in clusters and singles, in white and brown and the occasional alarming red. Your nose twitches over them, sorting the edible from the dangerous by a chemistry you cannot name but have learned to trust. Mostly.' },
  { season: 'summer', terrain: 'forest', timeOfDay: 'dawn', text: 'In the dawn dampness, the mushrooms have emerged overnight — a fairy ring of pale caps circling an old oak stump. The earthy smell is intoxicating, promising minerals and trace nutrients your summer browse lacks. But some of those caps carry compounds that would shut down your liver in hours.' },

  // ── Roadside scenarios ──
  { terrain: 'plain', text: 'The grass along the road verge is impossibly green, fertilized by runoff, dense and nutritious. But the road hisses with traffic, and every car that passes sends a gust of wind and noise that makes your whole body flinch. The food is right there. The death is right there too.' },
  { terrain: 'plain', timeOfDay: 'night', text: 'The highway is quiet at this hour, the traffic reduced to an occasional pair of lights that sweep across the landscape and vanish. The roadside growth is thick and green, better than anything the forest offers. You step closer, ears pinned forward, one hoof on the asphalt. The surface is warm and alien beneath your foot.' },

  // ── Generic risky foraging ──
  { text: 'The food is abundant, richer than anything the forest provides, and that alone should be warning enough. Easy calories are never free. Something watches, waits, or lurks in the chemistry of what looks like a gift. But your stomach makes its own arguments, and they are persuasive.' },
  { text: 'You stand at the boundary between the wild and the managed, where the browse is dense and the danger is invisible. Your body leans forward. Your instincts pull back. For a long moment, you are perfectly balanced between hunger and caution.' },
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
