import type { Rng } from '../../../engine/RandomUtils';
import type { ContextualFragment } from './shared';

// ══════════════════════════════════════════════════
//  ENVIRONMENTAL EVENT NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Blizzard / Cold Exposure ──

export interface WeatherFragment {
  weatherType: 'blizzard' | 'frost' | 'snow' | 'rain' | 'heat';
  intensity: 'moderate' | 'severe';
  text: string;
}

export const COLD_EXPOSURE: WeatherFragment[] = [
  { weatherType: 'blizzard', intensity: 'severe', text: 'The wind hits like a wall of frozen knives. Snow drives horizontally, stinging your eyes shut, packing into your nostrils. You cannot see. You cannot hear anything over the roar.' },
  { weatherType: 'blizzard', intensity: 'severe', text: 'The blizzard descends like a living thing, swallowing the forest whole. The temperature plummets by the minute and the wind strips the heat from your body faster than your metabolism can replace it.' },
  { weatherType: 'blizzard', intensity: 'moderate', text: 'Snow falls in thick curtains, muffling the world. The wind gusts hard enough to push you sideways. Visibility drops to a few body-lengths.' },
  { weatherType: 'frost', intensity: 'moderate', text: 'The cold deepens overnight into something that feels personal — malicious, searching, finding every thin patch of fur and pressing in.' },
  { weatherType: 'frost', intensity: 'severe', text: 'Frost crystallizes on your muzzle and around your eyes. Your legs feel leaden and stiff. Even the act of shivering is becoming exhausting.' },
  { weatherType: 'snow', intensity: 'moderate', text: 'The snow continues to fall, soft and silent, gradually burying the world. Your hooves break through the crust with each step, sapping your strength.' },
];

// ── Fall / Terrain Hazard ──

export interface TerrainFragment {
  terrainType: 'mountain' | 'ice' | 'forest' | 'general';
  text: string;
}

export const FALL_OPENINGS: TerrainFragment[] = [
  { terrainType: 'mountain', text: 'The trail narrows along a rocky ledge, loose shale sliding beneath your hooves. You step carefully, but the rock face crumbles — a section of trail simply vanishes, and you are scrabbling at empty air.' },
  { terrainType: 'mountain', text: 'A shelf of rock that looked solid gives way beneath your weight. For a sickening instant you are falling, hooves churning at nothing, the canyon wall spinning past.' },
  { terrainType: 'ice', text: 'The ground betrays you without warning. What looked like firm earth is a sheet of black ice beneath a dusting of snow, and your hooves lose purchase mid-stride.' },
  { terrainType: 'ice', text: 'You step onto what appears to be snow-covered ground, but beneath it is polished ice. Your legs splay in four directions at once.' },
  { terrainType: 'forest', text: 'A root hidden beneath the leaf litter catches your hoof at full stride. The world spins as your front legs buckle and momentum carries you forward.' },
  { terrainType: 'general', text: 'The earth shifts beneath you without warning — a bank giving way, a hidden hole swallowing your foreleg. You pitch forward into a rolling, crashing fall.' },
];

// ── Vehicle / Road ──

export const ROAD_OPENINGS: ContextualFragment[] = [
  { text: 'You step out of the tree line and something is wrong — the ground beneath your hooves is flat and hard and smells of tar.' },
  { text: 'The open ground between the tree lines has an alien texture — smooth, dark, radiating warmth even at night. It smells of nothing that belongs in a forest.', timeOfDay: 'night' },
  { text: 'You cross the strange flat ground cautiously. The surface is wrong under your hooves — unnaturally smooth, faintly warm.' },
  { text: 'The tree line ends abruptly and the world opens onto a strip of grey hardness. The air here tastes of chemicals and old rubber, a wrongness that prickles every hair on your body.', timeOfDay: 'day' },
];

export const VEHICLE_APPROACH: ContextualFragment[] = [
  { text: 'Two blazing lights appear, impossibly bright, growing at impossible speed, accompanied by a rising roar.', timeOfDay: 'night' },
  { text: 'A roar builds from the distance — not wind, not animal, something mechanical and furious, accompanied by twin points of light that swell like angry suns.', timeOfDay: 'dusk' },
  { text: 'The ground begins to vibrate. A sound like sustained thunder approaches, and the flat ground is illuminated by rushing light.' },
  { text: 'A dark shape hurtles toward you along the hard ground, its roar building into a scream of displaced air and spinning metal.', timeOfDay: 'day' },
];

// ── Shelter ──

export const SHELTER_FOUND: ContextualFragment[] = [
  { text: 'You lower your head and push into the wind, step by agonizing step, until the dark mass of the tree line swallows you. The wind drops instantly.' },
  { text: 'Dense conifers block the worst of the wind. You wedge yourself between two fallen trunks and wait, trembling but alive.', weather: 'blizzard' },
  { text: 'You find a hollow beneath a windfall, barely large enough, and press yourself into it. The storm rages above but cannot reach you here.', weather: 'blizzard' },
  { text: 'A rocky overhang offers just enough cover. You press against the cold stone, out of the wind, and feel the trembling in your legs begin to slow.', terrain: 'mountain' },
];

// ── Blizzard / Cold Exposure (Full Narrative) ──

export const BLIZZARD_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The wind hits like a wall of frozen knives. Snow drives horizontally, stinging your eyes shut, packing into your nostrils. You cannot see. You cannot hear anything over the roar. The temperature is dropping by the minute and the wind strips the heat from your body faster than your metabolism can replace it. You need shelter. Now.',
    weather: 'blizzard',
  },
  {
    text: 'The blizzard rolls down from the ridgeline like a white avalanche of sound and cold. Visibility collapses to nothing — you cannot see your own forelegs. Ice crusts your eyelashes and seals your nostrils shut. Each breath is a knife of frozen air drawn into burning lungs.',
    weather: 'blizzard',
    terrain: 'mountain',
  },
  {
    text: 'Night and blizzard merge into a single featureless darkness that screams. The wind finds gaps in the canopy and drives snow into your fur in horizontal sheets. Your body temperature is falling. You can feel it — a creeping numbness in your ears, your muzzle, the thin skin of your legs.',
    weather: 'blizzard',
    timeOfDay: 'night',
  },
  {
    text: 'The trees offer some protection, breaking the worst gusts into eddies that swirl the snow in confused spirals. But the cold is relentless. It seeps through your winter coat and finds the skin beneath. Your muscles clench and tremble involuntarily, burning fuel you cannot afford to lose.',
    weather: 'blizzard',
    terrain: 'forest',
  },
  {
    text: 'The cold deepens overnight into something that feels personal — malicious, searching, finding every thin patch of fur and pressing in. Frost crystallizes on your muzzle and around your eyes. Your legs feel leaden and stiff. Even the act of shivering is becoming exhausting.',
    weather: 'frost',
  },
  {
    text: 'Dawn arrives grey and pitiless. The frost has painted everything in white crystal — every branch, every blade of dead grass, your own fur. You try to stand and your joints refuse, locked by cold into rigid angles. It takes three attempts before your legs will bear your weight.',
    weather: 'frost',
    timeOfDay: 'dawn',
  },
  {
    text: 'The wind screams across the open ground with nothing to slow it. There is no tree line, no ridge, no hollow — just flat expanse and driving snow. The white-out is total. You could be walking in circles and would never know. The cold is a predator, patient and thorough, and it is winning.',
    weather: 'blizzard',
    terrain: 'plain',
  },
  {
    text: 'Snow accumulates on your back faster than you can shake it loose. The weight of it presses down, and beneath it your muscles tremble with the effort of generating heat. Your body is a furnace running low on fuel, and the blizzard is a thief stealing warmth faster than you can produce it.',
    weather: 'blizzard',
  },
];

// ── Fall / Terrain Hazard (Full Narrative) ──

export const FALL_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The trail narrows along a rocky ledge, loose shale sliding beneath your hooves. You step carefully, but the rock face crumbles — a section of trail simply vanishes, and you are scrabbling at empty air, hind legs kicking at nothing, before the slope catches you and you tumble downward in a cascade of loose stone.',
    terrain: 'mountain',
  },
  {
    text: 'A shelf of rock that looked solid gives way beneath your weight. For a sickening instant you are falling, hooves churning at nothing, the canyon wall spinning past. The impact comes hard — shoulder first against an outcrop, then hip, then the sliding, tumbling descent until friction and pain bring you to a stop.',
    terrain: 'mountain',
  },
  {
    text: 'The ridgeline trail crumbles at its edge. One hoof punches through into empty space and your weight follows, tipping you over the lip. You slam against the slope and slide, rocks tearing at your hide, until a stunted pine catches your body and holds.',
    terrain: 'mountain',
  },
  {
    text: 'The ground betrays you without warning. What looked like firm earth is a sheet of black ice beneath a dusting of snow, and your hooves lose purchase mid-stride. For one sickening moment you are weightless, legs splaying in four directions, and then the impact — hard, jarring, the world tilting sideways as you slam into the frozen ground.',
    season: 'winter',
  },
  {
    text: 'Ice forms a treacherous glaze over the rock. Your front hooves slip first, then your hind legs go out from under you. You crash onto your side and slide downhill, the frozen surface offering no purchase, until you fetch up against a snowbank with a jarring thud that drives the breath from your lungs.',
    season: 'winter',
    terrain: 'mountain',
  },
  {
    text: 'A root hidden beneath the leaf litter catches your hoof at full stride. The world spins as your front legs buckle and momentum carries you forward into a rolling, crashing fall through the undergrowth. Branches rake your sides and a log stops your tumble with a blow to the ribs.',
    terrain: 'forest',
  },
  {
    text: 'The forest floor is a minefield of hidden obstacles — roots, holes, half-buried logs slick with moss. Your foreleg plunges into a gap between rocks and your body pitches forward with sickening momentum. Something in your leg twists as you wrench it free and crash onto your shoulder.',
    terrain: 'forest',
  },
  {
    text: 'The earth shifts beneath you without warning — a bank giving way, a hidden hole swallowing your foreleg. You pitch forward into a rolling, crashing fall. The impact drives the air from your chest and for several breaths you lie still, stunned, waiting for the pain to declare itself.',
  },
];

// ── Vehicle Strike (Full Narrative) ──

export const VEHICLE_NARRATIVES: ContextualFragment[] = [
  {
    text: 'You step out of the tree line and something is wrong — the ground beneath your hooves is flat and hard and smells of tar. Two blazing lights appear, impossibly bright, growing at impossible speed, accompanied by a rising roar. Every nerve in your body fires at once. The lights swallow the world.',
    timeOfDay: 'night',
  },
  {
    text: 'The darkness is split by twin beams of white light that pin you in place like a speared fish. The roar behind the lights builds to something unbearable. Your legs lock. Your pupils contract to pinpoints. The light is everywhere and you cannot move, cannot think, cannot run.',
    timeOfDay: 'night',
  },
  {
    text: 'You cross the hard, grey strip between the tree lines at a cautious walk. A dark shape appears in the distance, growing impossibly fast, its roar filling the air. By the time instinct overrides caution and your legs begin to move, the machine is upon you — a wall of metal and displaced air.',
    timeOfDay: 'day',
  },
  {
    text: 'The road shimmers in the afternoon heat. You step onto its alien surface, ears swiveling at the distant hum of something approaching. The hum becomes a growl, the growl becomes a shriek, and a shape hurtles toward you faster than any predator, faster than thought.',
    timeOfDay: 'day',
  },
  {
    text: 'In the half-light of dusk, the road is a grey river between dark banks of forest. You step onto it and the world changes — headlights crest the hill, their glow turning the mist gold, and behind them comes the mechanical roar. Shadows stretch and swing. Your body freezes between flight and paralysis.',
    timeOfDay: 'dusk',
  },
  {
    text: 'Dawn paints the road in pale pink light. You linger at the edge, browsing the tender shoots that grow in the ditch, then step onto the hard surface. The truck comes around the bend without warning — engine roaring, horn blaring, a monster of steel bearing down at impossible speed.',
    timeOfDay: 'dawn',
  },
];

// ── Forest Fire (Full Narrative) ──

export const FIRE_NARRATIVES: ContextualFragment[] = [
  {
    text: 'You smell it before the sky turns — smoke, acrid and thickening, rolling through the understory in low, grey waves that sting your eyes and coat the back of your throat. Then the sound reaches you: a distant, continuous roar, like a river made of heat. Through the trees you see an orange glow that is not sunset — it is fire, and it is coming toward you at the speed of wind.',
    season: 'summer',
  },
  {
    text: 'The air tastes wrong — metallic, dry, laced with an acrid sharpness that makes your nostrils burn. Ash drifts through the canopy like grey snow. Then you hear it: a sound like the breathing of something vast, a roar and crackle that builds from the west. The undergrowth ahead glows amber and the heat hits your face like an open furnace.',
    season: 'summer',
    terrain: 'forest',
  },
  {
    text: 'Smoke has been pooling in the hollows all morning, and now it thickens into a choking blanket that stings your eyes to slits. Embers float past on the wind — tiny, glowing seeds of destruction. The fire crowns in the canopy to the south, leaping from treetop to treetop with a sound like tearing canvas, and the heat is a wall pressing against your body.',
    season: 'autumn',
  },
  {
    text: 'The drought has turned the forest into kindling. Every leaf crackles underfoot, every branch is a dry bone waiting to burn. When the fire comes, it comes fast — a line of flame racing through the dead understory, throwing sparks into the canopy, consuming everything in its path with a hunger that feels alive.',
    season: 'summer',
  },
];

// ── Flood (Full Narrative) ──

export const FLOOD_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The creek that you crossed yesterday at ankle depth is unrecognizable. Muddy water surges bank to bank, carrying branches, leaves, and the occasional drowned rodent spinning in the current. The far side holds better browse — you can see the green from here — but the water between you and it is fast, cold, and deep enough to swallow you whole.',
    season: 'spring',
  },
  {
    text: 'Snowmelt has turned the stream into a torrent. Brown water churns over rocks that were exposed just days ago, and the banks are crumbling as the current eats at them. Whole sections of trail have been undercut and swept away. The roar of the water drowns out every other sound.',
    season: 'spring',
  },
  {
    text: 'The rain has not stopped for two days and the land is drowning. Every gully runs with muddy water, every depression has become a pond. The creek at the bottom of the valley is a rolling brown river now, carrying debris and filling the air with a dull, continuous thunder.',
    weather: 'rain',
  },
  {
    text: 'The storm breaks the sky open and rain falls in sheets so thick you can barely see. Within an hour the creek has risen from a trickle to a surging flood, the water brown and angry, tearing at the banks, swallowing the low ground. Your usual crossing is gone — replaced by a moving wall of water that carries whole saplings in its grip.',
    weather: 'rain',
  },
];

// ── Fall Impacts (Contextual) ──

export const FALL_IMPACTS: ContextualFragment[] = [
  { text: 'The impact is hard, jarring, the world tilting sideways as you slam into the ground.' },
  { text: 'You hit the ground wrong — shoulder first, then hip, the breath driven from your lungs.' },
  { text: 'The slope catches you and you tumble, legs tangling, before sliding to a stop against a rocky outcrop.', terrain: 'mountain' },
  { text: 'For one sickening moment you are weightless, and then the ground arrives, suddenly and without mercy.' },
  { text: 'You crash through frozen brush and hit the ice-hardened earth with a crack that reverberates through your skeleton.', season: 'winter' },
];

// ── Utility ──

export function pickWeatherFragment(
  weatherType: string,
  rng: Rng,
  severe?: boolean,
): WeatherFragment | undefined {
  const intensity = severe ? 'severe' : 'moderate';
  const candidates = COLD_EXPOSURE.filter(
    (f) => f.weatherType === weatherType && f.intensity === intensity,
  );
  if (candidates.length === 0) {
    // Fallback to any matching weather type
    const fallback = COLD_EXPOSURE.filter((f) => f.weatherType === weatherType);
    return fallback.length > 0 ? fallback[rng.int(0, fallback.length - 1)] : undefined;
  }
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickFallOpening(terrainType: string, rng: Rng): TerrainFragment {
  const candidates = FALL_OPENINGS.filter((f) => f.terrainType === terrainType);
  if (candidates.length > 0) return candidates[rng.int(0, candidates.length - 1)];
  // Fallback to general
  const general = FALL_OPENINGS.filter((f) => f.terrainType === 'general');
  return general.length > 0 ? general[rng.int(0, general.length - 1)] : FALL_OPENINGS[0];
}

export function pickFrom(pool: string[], rng: Rng): string {
  return pool[rng.int(0, pool.length - 1)];
}
