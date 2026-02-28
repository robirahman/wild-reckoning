import type { Rng } from '../../../engine/RandomUtils';
import type { ContextualFragment } from './shared';

// ══════════════════════════════════════════════════
//  PREDATOR ENCOUNTER NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// Each pool is an array of interchangeable fragments.
// The renderer picks one per slot and composes them.

// ── Detection Openings ──
// How the animal first becomes aware of the predator.

export interface DetectionOpening {
  sense: 'sight' | 'smell' | 'sound' | 'touch' | 'vibration';
  timeOfDay?: 'dawn' | 'day' | 'dusk' | 'night';
  season?: string;
  terrain?: string;
  text: string;
}

export const CANID_DETECTIONS: DetectionOpening[] = [
  { sense: 'smell', text: 'You smell them before you see them — the sharp, acrid musk that makes every muscle in your body lock rigid.' },
  { sense: 'sound', text: 'A sound that isn\'t wind. A movement that isn\'t branch-sway. Your head snaps up and your nostrils flare.' },
  { sense: 'sight', timeOfDay: 'dusk', text: 'Gray shapes materialize from the tree line, low and deliberate, spreading in a loose arc. Their eyes catch the last light.' },
  { sense: 'sight', timeOfDay: 'night', text: 'Points of light in the darkness — paired, unblinking, arranged at the wrong height for fireflies. Eyes.' },
  { sense: 'vibration', text: 'The ground carries a rhythm that doesn\'t belong to the forest — synchronized footfalls, too many, too deliberate.' },
  { sense: 'sound', text: 'A long, wavering howl splits the air behind you. Then another, from a different direction. A third. They are triangulating.' },
  // Winter variants
  { sense: 'sight', season: 'winter', text: 'Dark paw prints crater the snow crust in a deliberate line — fresh, steaming faintly in the frozen air. The pack passed here moments ago.' },
  { sense: 'sound', season: 'winter', text: 'The brittle snow crust shatters in staccato bursts somewhere behind the frozen thicket. Too many feet. Too fast. The sound carries for miles in the still, cold air.' },
  { sense: 'smell', season: 'winter', text: 'The winter air is so clean that the wolf-musk hits you like a wall — rank, predatory, impossibly close. The cold has preserved every molecule of their scent trail.' },
  // Spring variants
  { sense: 'sound', season: 'spring', text: 'A chorus of high, yipping calls rises from the draw below — not the deep hunting howl, but the urgent bark of adults rallying near a den. Pups are close, which means the pack will kill anything that wanders near.' },
];

export const FELID_DETECTIONS: DetectionOpening[] = [
  { sense: 'sound', text: 'The birds have stopped singing. A prickling sensation crawls up the back of your neck — the ancient alarm of being watched by something that does not blink.' },
  { sense: 'sight', text: 'A shadow moves where shadows should be still. Something large, tawny, pressed against the rock face above.' },
  { sense: 'touch', text: 'The hair along your spine lifts without reason. Every instinct screams a single word you don\'t have: above.' },
  { sense: 'smell', text: 'A sharp, feline musk hits your nostrils — close, very close. Something is crouched just upwind.' },
  // Mountain / ledge variants
  { sense: 'sight', terrain: 'mountain', text: 'A flicker of tawny movement along the granite ledge above — barely distinguishable from the sun-bleached stone. It is perfectly still now, but it was not still a moment ago. Something is flattened against the rock, watching.' },
  { sense: 'vibration', terrain: 'mountain', text: 'A scatter of loose pebbles rattles down the scree slope. You freeze. Nothing falls in the mountains without a reason, and whatever dislodged those stones is large and directly above you.' },
  // Forest canopy variant
  { sense: 'sight', terrain: 'forest', text: 'A thick branch overhead dips under a weight that is not wind. You catch a glimpse of a long, heavy tail hanging motionless among the pine boughs — the tawny rope of a cat waiting to drop.' },
];

export const HUMAN_DETECTIONS: DetectionOpening[] = [
  { sense: 'smell', text: 'Strange smells drift between the trees — acrid, chemical, wrong. The forest itself seems to recoil from them.' },
  { sense: 'sound', text: 'A sharp, flat crack splits the air and sends every bird screaming upward. The thunder rolls from the direction of the ridge.' },
  { sense: 'sight', text: 'Bright shapes move where there should be stillness. Upright shapes that don\'t belong among the trees, colored in impossible oranges that nature never makes.' },
  { sense: 'sound', text: 'Dry leaves crunch in a pattern too regular for any four-legged thing. Something walks on two legs, slowly, pausing often.' },
  // Autumn / hunting season variants
  { sense: 'smell', season: 'autumn', text: 'The autumn wind carries a cocktail of wrongness — gun oil, rubber, the sour tang of human sweat masked under something chemical and piney. The forest is full of them today.' },
  { sense: 'sound', season: 'autumn', text: 'A metallic click carries through the dry autumn air, sharp and alien. You have heard thunder follow that sound before. Every deer who survived a season knows it.' },
  // Summer / hiker variants
  { sense: 'sound', season: 'summer', text: 'Voices — high, careless, carrying over the meadow without any attempt at silence. The two-legged ones with their bright shells and jangling metal, crashing through the underbrush like they own every path.' },
];

// ── Chase / Pursuit ──

export interface PursuitFragment {
  locomotionThreshold: number; // min locomotion % for this variant
  escaped: boolean;
  terrain?: string;
  text: string;
}

export const CANID_PURSUITS: PursuitFragment[] = [
  { locomotionThreshold: 70, escaped: true, text: 'You explode into motion, hooves tearing at the earth. The forest blurs. Behind you, the pack gives chase — but your legs are sound and the fear drives you faster than they can follow. After an agonizing minute of all-out sprint, the sounds of pursuit fade.' },
  { locomotionThreshold: 70, escaped: true, text: 'Your legs answer the call of panic. You run without thought, leaping deadfall, crashing through brush, and the distance opens between you and the gray shapes. They fall back, one by one, conserving energy. They will try again later — but not now.' },
  { locomotionThreshold: 0, escaped: false, text: 'You run. You run with everything you have, but the ground betrays you — your gait is uneven, favoring the damaged leg, and each stride sends a lance of fire through your body. The shapes behind you sense the weakness. They are gaining.' },
  { locomotionThreshold: 0, escaped: false, text: 'Your body tries to sprint but the mechanics are wrong — something in the hind leg catches, drags, and the rhythm of your gallop breaks. The gray shapes close the distance with terrible efficiency.' },
  // Open terrain — harder to escape, no cover
  { locomotionThreshold: 80, escaped: true, terrain: 'open', text: 'The open plain offers nothing to hide behind, nothing to slow them. You pour everything into raw speed, lungs searing, hooves hammering the hard-packed earth. You are faster — barely — and the distance stretches out one agonizing stride at a time until the gray shapes shrink to specks behind you.' },
  { locomotionThreshold: 0, escaped: false, terrain: 'open', text: 'Open ground. No cover, no obstacles, nowhere to turn. The wolves fan out wide behind you, running the long relay they were born for. Your sprint burns bright and brief, but their endurance is a thing without mercy. The gap closes.' },
  // Forest — obstacle advantage for deer
  { locomotionThreshold: 50, escaped: true, terrain: 'forest', text: 'You plunge into the dense timber and the forest becomes your ally. You thread between trunks that force the pack to break formation, leap deadfall that tangles their wider bodies. The pursuit dissolves into frustrated barking somewhere behind you as you weave deeper into the green labyrinth.' },
];

export const FELID_PURSUITS: PursuitFragment[] = [
  { locomotionThreshold: 0, escaped: false, text: 'There is no chase. The weight hits you from above and behind, a hundred pounds of coiled muscle slamming into your spine. The ambush is over in the space between one heartbeat and the next.' },
  { locomotionThreshold: 60, escaped: true, text: 'The cat launches and misses — claws rake your flank but find no purchase on the winter coat. You bolt before the second strike can come. Cats do not chase. You feel the predator\'s gaze on your back for thirty strides, then the pressure lifts. It will not follow.' },
  { locomotionThreshold: 40, escaped: true, text: 'You stumble sideways at the last instant and the tawny shape hurtles past, hitting the ground where you stood. For one frozen moment you see its face — wide, flat, furious — and then your legs are carrying you away. It does not pursue. The ambush has failed, and it knows it.' },
  { locomotionThreshold: 0, escaped: false, text: 'You never see it move. One moment the trail is empty; the next, an immense pressure clamps across the back of your neck and the world tilts. The cat\'s jaws have found the killing grip, and your legs fold beneath you.' },
];

// ── Confrontation Moments ──

export const CANID_CONFRONTATIONS: string[] = [
  'They do not rush. They circle, patient, taking turns darting forward and pulling back, testing your defenses.',
  'The pack spreads, flanking. One approaches from the front while others ghost through the brush at your sides.',
  'You can feel their breath on your hind legs. One lunges and you kick — a glancing blow — but there are always more.',
];

export const FELID_STRIKES: string[] = [
  'The shape launches from above, silent and enormous, all muscle and claw, aimed directly at your neck.',
  'It drops from the rock face in a blur of tawny fur, forelimbs extended, the impact designed to drive you to the ground.',
  'The attack comes from behind and above — a crushing weight slamming into your hindquarters, claws anchoring into your flesh.',
];

// ── Winter / Snow Conditions ──

export const WINTER_MODIFIERS: string[] = [
  'The snow is deep and crusted, and your hooves punch through with every stride while the gray shapes behind you run on top of it.',
  'Deep snow swallows your legs to the knee. Each stride is an exhausting lunge while your pursuers skim the frozen surface.',
  'Ice has formed beneath the snow, turning each step into a gamble between footing and speed.',
];

// ── Escape / Resolution ──

export interface ResolutionFragment {
  outcome: 'escaped' | 'injured' | 'near-miss' | 'lethal';
  season?: string;
  terrain?: string;
  text: string;
}

export const PREDATOR_RESOLUTIONS: ResolutionFragment[] = [
  { outcome: 'escaped', text: 'The sounds of pursuit fade behind you. You slow to a walk, sides heaving, legs trembling. You are alive.' },
  { outcome: 'escaped', text: 'You reach the far side of the clearing and the shapes do not follow. Your heart pounds so hard you can feel it in your hooves.' },
  { outcome: 'injured', text: 'You are still running, but something is wrong — warmth spreading across your hindquarter, the leg not answering properly. You got away. Mostly.' },
  { outcome: 'near-miss', text: 'Teeth snap shut on empty air where your leg was a heartbeat ago. You kick free and run, the narrow margin of survival burning in your mind.' },
  { outcome: 'lethal', text: 'The strength leaves your legs. The ground rushes up. The gray shapes close in, and the world narrows to a single point of sensation before it goes quiet.' },
  // Winter escape — snow exhaustion
  { outcome: 'escaped', season: 'winter', text: 'You flounder through the last drift and find hard ground beneath the spruce canopy. Your legs shake from the effort of punching through crusted snow, but the wolves have fallen back — even they tire when the snow is this deep. Steam pours off your body into the frozen air.' },
  { outcome: 'injured', season: 'winter', text: 'The ice-crusted snow has opened gashes along both forelegs where you broke through the crust again and again. Blood stains the white trail behind you, but the cold numbs the pain and the predators have lost interest. You stand in the spruce shadows, bleeding and breathing.' },
  // Summer escape — water crossing
  { outcome: 'escaped', season: 'summer', text: 'The river appears through the willows and you do not hesitate — you plunge in, the cold current seizing your chest, hooves scrabbling on slick stones. The wolves pace the bank, unwilling to follow. The far shore receives you, soaked and shaking, but whole.' },
  // Forest terrain escape
  { outcome: 'escaped', terrain: 'forest', text: 'You vanish into a cathedral of old-growth timber so dense that pursuit is impossible. The ancient trunks close around you like a fortress. You stand motionless among them, sides heaving, listening to the frustrated sounds of predators circling the perimeter of a maze they cannot solve.' },
];

// ══════════════════════════════════════════════════
//  FULL ENCOUNTER NARRATIVES (ContextualFragment)
// ══════════════════════════════════════════════════

// ── Wolf Pack Encounters ──

export const WOLF_ENCOUNTER_NARRATIVES: ContextualFragment[] = [
  // Winter variants
  {
    season: 'winter',
    text: 'The pack finds you at the edge of the cedar yard where the snow is trampled to brown slush by a hundred desperate hooves. You smell them first — rank, wild, close — and then the gray shapes appear at the tree line, fanning out with the practiced geometry of killers who have done this a thousand times. In winter, there is nowhere to hide and the snow is a traitor beneath your feet.',
  },
  {
    season: 'winter',
    timeOfDay: 'night',
    text: 'Moonlight turns the snow field into a bright, merciless stage. You see their shadows first, long and black and moving fast across the white expanse. The pack runs in single file, the lead wolf breaking trail for those behind, and they are angling to cut you off from the timber. The cold burns your lungs as you run. Everything is visible. Everything is exposed.',
  },
  // Night / dusk variants
  {
    timeOfDay: 'dusk',
    text: 'The last copper light drains from the sky and the wolves materialize as if the darkness itself has given them form. A howl rises from somewhere behind the ridge — not a hunting call, but a locating call. They know where you are. They are telling each other. The forest fills with the sound of coordinated intent.',
  },
  {
    timeOfDay: 'night',
    text: 'You cannot see them, but you can hear them — the soft, rhythmic padding of many feet, the occasional click of claw on stone. The darkness is absolute beneath the canopy, and every sound is magnified. A branch snaps to your left. Breathing, low and steady, to your right. They have surrounded you without ever being seen.',
  },
  // Open terrain
  {
    terrain: 'open',
    text: 'They appear on the far side of the meadow, seven gray shapes strung out in a loose crescent. There is no ambush here, no subtlety — just the open ground and the ancient calculation: can you outrun them before the crescent closes? Your legs answer before your mind decides, and the race begins across the open grass.',
  },
  // Forest
  {
    terrain: 'forest',
    text: 'The howl comes from deep in the timber, reverberating off trunks until it seems to come from everywhere. You freeze among the hemlocks, ears swiveling, trying to separate echo from source. A shape ghosts between two trees at the edge of your vision. Then another, on the opposite side. The forest that shelters you also shelters them, and they know it far better than you imagine.',
  },
  // Generic / fallback
  {
    text: 'The pack announces itself with a single, sustained howl that lifts the hair along your entire spine. Before the sound fades, you see them — gray and silent and inevitable, emerging from the landscape as though they had always been there, waiting for this exact moment. Your body floods with the oldest fear there is.',
  },
  {
    text: 'You spot the lead wolf standing motionless on the rise, watching you with an intelligence that is not hunger but something worse — assessment. It is deciding whether you are worth the effort. Behind it, the rest of the pack waits with the terrible patience of predators who have never known a world where they are not the final authority.',
  },
];

// ── Cougar / Mountain Lion Encounters ──

export const COUGAR_ENCOUNTER_NARRATIVES: ContextualFragment[] = [
  // Mountain terrain
  {
    terrain: 'mountain',
    text: 'The mountain trail narrows between boulders, and the feeling hits you like a physical blow — that crawling, electric certainty of being watched from above. You scan the granite ledges and see nothing. That is the worst part. The cougar is there, somewhere in the vertical world of rock and shadow, and it has been watching you for longer than you want to know.',
  },
  {
    terrain: 'mountain',
    timeOfDay: 'dusk',
    text: 'Dusk in the high country turns every outcrop into a hiding place. The cougar drops from a ledge you never thought to check — a tawny blur against the darkening stone — and the impact sends you staggering sideways on the narrow trail. Gravel showers into the canyon below. For one terrible moment, the struggle is not just against the cat but against gravity itself.',
  },
  // Dawn / dusk ambush variants
  {
    timeOfDay: 'dawn',
    text: 'The first gray light is still seeping through the trees when the shape detaches itself from the base of a fallen pine. It has been lying there all night, patient as stone, waiting for the moment you step into the kill zone. Dawn is the cougar\'s hour — enough light to strike, not enough for you to see it coming.',
  },
  {
    timeOfDay: 'dusk',
    text: 'Twilight erases depth and distance, and the cougar uses it like a weapon. One moment the trail ahead is empty; the next, a massive shape is airborne, launched from a stump you mistook for shadow. The last light catches its eyes — flat, gold, utterly focused — before the world becomes claws and weight and the desperate scramble to stay on your feet.',
  },
  // Generic
  {
    text: 'It is the silence that warns you. The forest has gone absolutely still — no birdsong, no insect hum, nothing. The quiet is so total it has texture. Somewhere very close, something enormous is holding its breath, and every nerve in your body knows what it is even before your eyes find the long, low shape crouched in the underbrush.',
  },
  {
    text: 'You never hear the cougar. You feel it — a displacement of air, a shadow that moves against the wind — and then instinct takes over, hurling your body sideways before conscious thought can form. Claws whisper through the space your neck occupied a half-second ago. The cat lands, pivots, and fixes you with a stare that is less anger than recalculation.',
  },
];

// ── Human Hunter Encounters ──

export const HUNTER_ENCOUNTER_NARRATIVES: ContextualFragment[] = [
  // Autumn / hunting season
  {
    season: 'autumn',
    text: 'The autumn woods are full of wrongness. You smell them everywhere — the chemical reek of scent-killer that only makes the human smell stranger, the faint petroleum tang of gun oil, the crushed-leaf odor of their camouflage. They sit in the trees, impossibly still for creatures so clumsy, and the thunder they carry can reach across distances that make running meaningless.',
  },
  {
    season: 'autumn',
    timeOfDay: 'dawn',
    text: 'Dawn in hunting season is the most dangerous hour. The humans arrive in darkness, climbing into their tree stands while the forest still sleeps, and by first light they are already watching every trail and clearing. You step into the meadow and the flat crack of a rifle splits the morning apart. Bark explodes from the oak beside your head. You do not think. You run.',
  },
  // Rifle variant
  {
    season: 'autumn',
    text: 'The thunder comes from nowhere — a sharp, percussive crack that rolls across the hollow and sets every living thing to flight. The bullet arrives before the sound, punching a hole through the leaves an arm\'s length from your shoulder. You have no concept of the weapon, only the primal understanding that distance offers no safety from this predator.',
  },
  // Bow variant
  {
    season: 'autumn',
    text: 'The arrow makes almost no sound — a brief, fibrous whisper — and buries itself in the trunk beside you with a solid thunk. No thunder this time, no warning. You see the human then, perched in the tree stand barely twenty yards away, already nocking another shaft. This predator kills from silence, and your margin of escape is measured in the seconds it takes to draw a bowstring.',
  },
  // Summer / non-hunting encounter
  {
    season: 'summer',
    text: 'The humans on the trail are loud and careless, swinging their arms and speaking in their strange, modulating calls. They carry no thunder, but their scent trail poisons the brush for hours and their dogs range ahead on long tethers, flushing every creature from cover. You melt into the bracken and hold perfectly still as they pass, your heart hammering, though these ones do not hunt.',
  },
  // Generic
  {
    text: 'The two-legged shape appears on the ridge, silhouetted against the sky, and every deer for a hundred yards freezes in place. It carries something long and angular — the shape that brings thunder. The forest holds its breath. You lower your profile, ease backward step by careful step, and pray that you are nothing more than another shadow among the trees.',
  },
];

// ── Utility ──

export function pickDetection(
  pool: DetectionOpening[],
  rng: Rng,
  preferredSense?: string,
  timeOfDay?: string,
  season?: string,
  terrain?: string,
): DetectionOpening {
  // Filter by season if available
  let candidates = pool;
  if (season) {
    const seasonMatched = pool.filter((d) => d.season === season);
    if (seasonMatched.length > 0) candidates = seasonMatched;
  }
  // Narrow by terrain if available
  if (terrain) {
    const terrainMatched = candidates.filter((d) => d.terrain === terrain);
    if (terrainMatched.length > 0) candidates = terrainMatched;
  }
  // Filter by time of day if available
  if (timeOfDay) {
    const timeMatched = candidates.filter((d) => d.timeOfDay === timeOfDay);
    if (timeMatched.length > 0) candidates = timeMatched;
  }
  // Prefer the specified sense if available
  if (preferredSense) {
    const senseMatched = candidates.filter((d) => d.sense === preferredSense);
    if (senseMatched.length > 0) candidates = senseMatched;
  }
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickPursuit(
  pool: PursuitFragment[],
  rng: Rng,
  locomotion: number,
  escaped: boolean,
  terrain?: string,
): PursuitFragment {
  let candidates = pool.filter(
    (p) => locomotion >= p.locomotionThreshold && p.escaped === escaped,
  );
  // Narrow by terrain if available
  if (terrain && candidates.length > 0) {
    const terrainMatched = candidates.filter((p) => p.terrain === terrain);
    if (terrainMatched.length > 0) candidates = terrainMatched;
  }
  if (candidates.length === 0) {
    // Fallback: any matching escape status
    const fallback = pool.filter((p) => p.escaped === escaped);
    return fallback.length > 0
      ? fallback[rng.int(0, fallback.length - 1)]
      : pool[0];
  }
  return candidates[rng.int(0, candidates.length - 1)];
}
