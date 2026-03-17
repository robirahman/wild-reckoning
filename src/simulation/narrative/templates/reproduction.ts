import type { Rng } from '../../../engine/RandomUtils';
import type { ContextualFragment } from './shared';

// ══════════════════════════════════════════════════
//  REPRODUCTION NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Rut Display Openings ──

export interface RutDisplayFragment {
  quality: 'impressive' | 'adequate' | 'any';
  text: string;
}

export const RUT_DISPLAYS: RutDisplayFragment[] = [
  { quality: 'impressive', text: 'You approach with the stiff-legged, head-high gait of courtship, your neck swollen, your polished antlers catching the light.' },
  { quality: 'impressive', text: 'The heavy rack, the thick neck, the deep chest. You present it all. The broadside turn, the raised head, the slow measured walk.' },
  { quality: 'impressive', text: 'The broadside turn comes without effort. Raised head, slow measured walk, your full size on display.' },
  { quality: 'adequate', text: 'You arch your neck and present your antlers, but your condition shows. The doe watches, motionless.' },
  { quality: 'adequate', text: 'You approach carefully. The courtship display must be convincing despite your condition, so you put everything you have into the posture and the gait.' },
  { quality: 'any', text: 'A doe stands at the meadow edge, testing the wind. Your scent reaches her. She watches, motionless.' },
  { quality: 'impressive', text: 'You step into the open meadow where the does are grazing, the morning light catching the polished tines of your rack. The flat ground and long sightlines show your full size. Every doe in the clearing lifts her head.' },
  { quality: 'adequate', text: 'The forest is dense, the sightlines short. You thread between the trunks with your head tilted to clear the branches, each step a careful negotiation between display and obstacle. The doe can smell you before she can see you, and scent tells a harder truth than posture.' },
  { quality: 'any', text: 'You scrape the ground with your forehooves, gouging the earth, marking it with the musk glands between your toes. The scent is a territorial broadcast: I am here, I am ready, I am not leaving. Somewhere in the timber, a doe pauses to read it.' },
];

// ── Mating Chase ──

export interface ChaseFragment {
  successful: boolean;
  text: string;
}

export const MATING_CHASES: ChaseFragment[] = [
  { successful: true, text: 'You follow her for hours through the forest, matching her pace. She tests your endurance at every turn. When she finally stops and allows you to approach, the chase is over.' },
  { successful: true, text: 'She leads you through dense brush, across a frozen stream, up a ridge and down the other side. Each obstacle is a test. You pass them all, and when she turns to face you at last, you know.' },
  { successful: false, text: 'The doe accelerates with a burst of speed you cannot match. She vanishes into the tree line. Her scent lingers but fades.' },
  { successful: false, text: 'She watches your approach, measures you, and turns away with a flick of her tail that means: not good enough. You follow, persistent, but she does not slow.' },
];

// ── Birthing ──

export interface BirthFragment {
  viability: 'healthy' | 'weak' | 'stillborn';
  text: string;
}

export const BIRTH_DESCRIPTIONS: BirthFragment[] = [
  { viability: 'healthy', text: 'The fawn arrives wet and steaming into the spring air, and within minutes is struggling to its feet on legs that seem impossibly long and impossibly fragile. It finds its footing, wobbles, and looks up at you with dark, wet eyes.' },
  { viability: 'healthy', text: 'You clean the fawn with long, methodical strokes of your tongue, imprinting your scent, removing the birth smell that would draw predators. The fawn nuzzles toward warmth and finds what it needs.' },
  { viability: 'weak', text: 'The fawn is smaller than it should be. It struggles to stand, falls, struggles again. You wait.' },
  { viability: 'weak', text: 'Something is not right. The fawn lies too still, its breathing shallow and rapid. You nudge it gently, urgently, willing it to stand. After a long, terrible moment, it tries.' },
  { viability: 'stillborn', text: 'The fawn does not move. You nudge it, lick it, push at it with your nose. The small body is warm but emptied of whatever it is that makes warmth matter. You stand over it for a long time before you understand.' },
  { viability: 'healthy', text: 'Rain falls softly on the fawn as it enters the world, washing away the birth-scent almost as fast as you can imprint your own. The fawn shivers, sneezes, and begins the urgent business of standing. The rain will hide you both from noses that hunt.' },
  { viability: 'healthy', text: 'Dense hawthorn on three sides, the canopy so thick the light is green and dim. The fawn arrives in this green half-dark, its first breaths muffled by the foliage, its spotted coat already invisible against the forest floor.' },
  { viability: 'weak', text: 'The rain has not stopped for two days and the fawn arrives into a world of cold water and gray light. It is small and trembling, its legs folding under it each time it tries to stand. You shelter it with your body, but your warmth is not enough to replace what the weather is stealing.' },
];

// ── Fawn Rearing ──

export const FAWN_HIDING: string[] = [
  'You leave the fawn in a patch of tall grass. It lies still, spotted coat against the stems.',
  'The fawn presses itself against the earth, chin down, ears flat, breathing shallow. You move away, stop, listen, move again.',
  'You settle the fawn in a hollow between two fallen logs, hidden from above and downwind of the main trail. It blinks at you once, then goes perfectly still.',
  'The meadow grass is tall enough to cover the fawn. You guide it to a spot where the stems are thickest, where the wildflowers break up any outline. It sinks into the green and vanishes.',
  'You tuck the fawn beneath a low-hanging spruce, its branches sweeping the ground like a curtain. The forest floor here is soft with needles, and the fawn curls into them, its spots mimicking the fragments of light that filter through the canopy.',
  'The fawn lies at the water\'s edge where the reeds grow dense and the mud holds the warmth of the afternoon sun. It is hidden from the land side by cattails and from the water by its own stillness. You back away along the shoreline, leaving no trail through the soft ground.',
];

export const FAWN_NURSING: string[] = [
  'The fawn butts against your flank with an urgency that makes your legs brace. The nursing draws hard on your reserves. Each feeding costs calories you can barely spare.',
  'You stand patient and still while the fawn nurses, feeling the tug of each swallow, the caloric debt accumulating in your body. Lactation is expensive. But the fawn is growing stronger every day.',
  'The fawn finds you at dawn, stumbling through the brush with the clumsy confidence of youth. It nurses greedily while you scan the tree line, alert for anything that might have followed its noise.',
];

// ── Fawn Defense ──

export interface FawnDefenseFragment {
  predator: 'coyote' | 'wolf' | 'eagle' | 'general';
  text: string;
}

export const FAWN_DEFENSE_OPENINGS: FawnDefenseFragment[] = [
  { predator: 'coyote', text: 'A coyote materializes at the meadow\'s edge, nose low, moving with the deliberate focus of a hunter who has found something small and helpless.' },
  { predator: 'coyote', text: 'Two coyotes pace the tree line, exchanging yipping calls. They are not looking at you. They are looking for fawns.' },
  { predator: 'wolf', text: 'Gray shapes at the perimeter. They are not hunting you. Their attention is focused lower, searching the grass for the spotted hide of something that cannot run.' },
  { predator: 'eagle', text: 'A shadow slides across the grass, vast and silent. A golden eagle circles low, its eyes fixed on your fawn.' },
  { predator: 'general', text: 'Something is hunting your fawn. The predator moves low, ignoring you entirely.' },
  { predator: 'coyote', text: 'A lone coyote emerges from the brush downwind, its nose working the air where the fawn nursed an hour ago. It follows the milk-scent trail with surgical precision, closing the distance to the hiding spot with every breath.' },
  { predator: 'wolf', text: 'The wolf moves through the meadow, quartering the tall grass, nose low, ears forward, working through every place a fawn might hide.' },
  { predator: 'general', text: 'A rustle in the undergrowth, then silence, then another rustle, closer. Something is working through the brush toward the place where you left the fawn. The birds have gone quiet.' },
];

export const FAWN_DEFENSE_CHARGES: string[] = [
  'You lower your head and charge, front hooves striking hard. The fury in you is total, a chemical certainty that you will kill or die to protect the small thing behind you.',
  'You launch yourself between the predator and your fawn, rearing up and striking with your forelegs. The hooves connect with a crack that sends the hunter stumbling backward.',
  'You rush forward with a snort of rage, ears flat, every line of your body a promise of violence. The predator hesitates, and in that hesitation you close the distance.',
];

export const FAWN_DEFENSE_DISTRACTIONS: string[] = [
  'You feign injury, dragging one leg, bleating in distress, leading the predator away from where the fawn lies hidden. The performance is not conscious. Your body does it without your permission.',
  'You crash through the brush in the opposite direction, making yourself loud and visible, a more attractive target than the motionless fawn. The predator\'s head swivels toward you. Good.',
  'You stomp and snort, drawing attention to yourself, circling wide to pull the threat away from the fawn\'s hiding spot. Every moment the predator watches you is a moment it isn\'t searching.',
];

// ── Nursing Narratives ──

export const NURSING_NARRATIVES: ContextualFragment[] = [
  {
    season: 'spring',
    text: 'The fawn is new and small, its muzzle barely reaching your flank. It butts with blind urgency. You shift to guide it. The rich first milk draws on everything you have eaten this spring.',
  },
  {
    season: 'summer',
    text: 'The fawn is growing fast now, its legs lengthening, its spots beginning to fade. It nurses with the confident efficiency of a creature that has done this a hundred times, draining you with long, rhythmic pulls. You can feel the cost in your own thinning flanks, but the fawn is strong. That is what matters.',
  },
  {
    season: 'summer',
    text: 'Late summer heat presses down on the forest and the fawn seeks you out in the shade, nursing briefly before collapsing beside you to sleep. Each session is shorter, each interval longer. Soon the milk will stop.',
  },
  {
    text: 'Your body is in good condition, the browse plentiful, and the milk comes rich and easy. The fawn grows visibly between feedings, its haunches filling out, its movements gaining the first hints of the explosive speed it will need to survive.',
  },
  {
    text: 'You are running on empty. The browse is thin and your body is cannibalizing its own reserves to produce milk. Each nursing session leaves you lightheaded, your ribs showing sharper than yesterday. But the fawn needs what you have, and you give it without hesitation.',
  },
];

// ── Birth Scene Narratives ──

export const BIRTH_SCENE_NARRATIVES: ContextualFragment[] = [
  {
    weather: 'rain',
    text: 'Spring rain patters on the canopy overhead, and the fawn arrives into a world that smells of wet earth and new growth. The rain washes the birth-scent from the ground almost immediately. You clean the fawn quickly, your tongue working against the chill.',
  },
  {
    weather: 'clear',
    text: 'The day is warm and still, the air heavy with pollen and the hum of insects. You chose a sun-dappled clearing ringed by young birches, and the fawn is born into warmth and soft light. It lies steaming in the grass, blinking at a world that, for this one moment, is gentle.',
  },
  {
    terrain: 'forest',
    text: 'Deep in the thicket where the hawthorn grows impenetrable, you labor in near-darkness. The canopy is so dense that the birth happens in a green twilight, hidden from every eye. The fawn\'s first sound is swallowed by the foliage, and when it stands, it stands in a fortress of thorns that nothing larger than a fox could breach.',
  },
  {
    terrain: 'meadow',
    text: 'You chose the meadow edge where the tall grass meets the tree line. Close enough to cover for a quick retreat, open enough to see danger from any direction. The fawn arrives as the sun crests the ridge. You have minutes to clean it and move it to deeper cover.',
  },
  {
    text: 'The contractions come faster now and you fold your legs beneath you, your breath sharp and rhythmic. The world narrows to this: the pressure, the push, the sudden release, and then the wet warmth of a new life against your flank. You turn to it immediately, tongue already working, the sequence, clean, dry, stand, nurse, running through your body without thought.',
  },
];

// ── Utility ──

export function pickRutDisplay(quality: string, rng: Rng): RutDisplayFragment {
  let candidates = RUT_DISPLAYS.filter((f) => f.quality === quality);
  if (candidates.length === 0) {
    candidates = RUT_DISPLAYS.filter((f) => f.quality === 'any');
  }
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickMatingChase(successful: boolean, rng: Rng): ChaseFragment {
  const candidates = MATING_CHASES.filter((f) => f.successful === successful);
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickBirth(bcs: number, rng: Rng): BirthFragment {
  const viability: BirthFragment['viability'] =
    bcs >= 3 ? 'healthy' : bcs >= 2 ? 'weak' : 'stillborn';
  const candidates = BIRTH_DESCRIPTIONS.filter((f) => f.viability === viability);
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickFawnDefenseOpening(predator: string, rng: Rng): FawnDefenseFragment {
  let candidates = FAWN_DEFENSE_OPENINGS.filter((f) => f.predator === predator);
  if (candidates.length === 0) {
    candidates = FAWN_DEFENSE_OPENINGS.filter((f) => f.predator === 'general');
  }
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickFrom(pool: string[], rng: Rng): string {
  return pool[rng.int(0, pool.length - 1)];
}
