import type { Rng } from '../../../engine/RandomUtils';

// ══════════════════════════════════════════════════
//  REPRODUCTION NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Rut Display Openings ──

export interface RutDisplayFragment {
  quality: 'impressive' | 'adequate' | 'any';
  text: string;
}

export const RUT_DISPLAYS: RutDisplayFragment[] = [
  { quality: 'impressive', text: 'You approach with the stiff-legged, head-high gait of courtship, your neck swollen, your polished antlers catching the light. You are advertising everything you are.' },
  { quality: 'impressive', text: 'Your body is a resume written in muscle and bone: the heavy rack, the thick neck, the deep chest. You present it all with the instinctive confidence of a buck in his prime.' },
  { quality: 'impressive', text: 'The display comes naturally — the broadside turn, the raised head, the slow measured walk that says: I am large, I am healthy, I have survived.' },
  { quality: 'adequate', text: 'You arch your neck and present your antlers, but the display feels thin — your condition betraying the effort. The doe watches with clinical assessment.' },
  { quality: 'adequate', text: 'You approach carefully. The courtship display must be convincing despite your condition, so you put everything you have into the posture and the gait.' },
  { quality: 'any', text: 'A doe stands at the meadow\'s edge, testing the wind. Your scent reaches her — the chemical resume of your fitness. She watches, motionless, assessing.' },
];

// ── Mating Chase ──

export interface ChaseFragment {
  successful: boolean;
  text: string;
}

export const MATING_CHASES: ChaseFragment[] = [
  { successful: true, text: 'You follow her for hours through the forest, matching her pace. The courtship chase is a test of endurance — she is measuring your stamina. When she finally stops and allows you to approach, the relief is as physical as the triumph.' },
  { successful: true, text: 'She leads you through dense brush, across a frozen stream, up a ridge and down the other side. Each obstacle is a test. You pass them all, and when she turns to face you at last, you know.' },
  { successful: false, text: 'The doe accelerates with a burst of speed you cannot match. She vanishes into the tree line, leaving you with nothing but the lingering scent of what might have been.' },
  { successful: false, text: 'She watches your approach, measures you, and turns away with a flick of her tail that means: not good enough. You follow, persistent, but she does not slow.' },
];

// ── Birthing ──

export interface BirthFragment {
  viability: 'healthy' | 'weak' | 'stillborn';
  text: string;
}

export const BIRTH_DESCRIPTIONS: BirthFragment[] = [
  { viability: 'healthy', text: 'The fawn arrives wet and steaming into the spring air, and within minutes is struggling to its feet on legs that seem impossibly long and impossibly fragile. It finds its footing, wobbles, and looks up at you with dark, ancient eyes.' },
  { viability: 'healthy', text: 'You clean the fawn with long, methodical strokes of your tongue, imprinting your scent, removing the birth smell that would draw predators. The fawn nuzzles toward warmth and finds what it needs.' },
  { viability: 'weak', text: 'The fawn is smaller than it should be — your depleted body could not provide what growing bones and muscles demanded. It struggles to stand, falls, struggles again. You wait, patient and afraid.' },
  { viability: 'weak', text: 'Something is not right. The fawn lies too still, its breathing shallow and rapid. You nudge it gently, urgently, willing it to stand. After a long, terrible moment, it tries.' },
  { viability: 'stillborn', text: 'The fawn does not move. You nudge it, lick it, push at it with your nose. The small body is warm but emptied of whatever it is that makes warmth matter. You stand over it for a long time before you understand.' },
];

// ── Fawn Rearing ──

export const FAWN_HIDING: string[] = [
  'You leave the fawn in a patch of tall grass, its spotted coat blending perfectly with the dappled light. It lies motionless — the ancient instinct to freeze, to be invisible, already stronger than the instinct to follow you.',
  'The fawn presses itself against the earth, chin down, ears flat, breathing shallow. You back away, every maternal instinct screaming to stay, but you know the pattern: your presence would draw attention the fawn\'s camouflage is designed to avoid.',
  'You settle the fawn in a hollow between two fallen logs, hidden from above and downwind of the main trail. It blinks at you once, then goes perfectly still.',
];

export const FAWN_NURSING: string[] = [
  'The fawn butts against your flank with an urgency that makes your legs brace. The nursing draws hard on your reserves — each feeding costs calories you can barely spare — but the fawn needs them more than you do.',
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
  { predator: 'coyote', text: 'Two coyotes pace the tree line, exchanging yipping calls, coordinating. They are not looking at you — they are looking for fawns.' },
  { predator: 'wolf', text: 'Gray shapes at the perimeter — but they\'re not hunting you. Their attention is focused lower, searching the grass for the spotted hide of something that cannot run.' },
  { predator: 'eagle', text: 'A shadow slides across the grass — vast, silent, purposeful. A golden eagle circles low, its talons the size of a man\'s hand, its eyes fixed on your fawn.' },
  { predator: 'general', text: 'Something is hunting your fawn. You can see it in the way the predator moves — the low, focused trajectory that ignores you entirely.' },
];

export const FAWN_DEFENSE_CHARGES: string[] = [
  'You lower your head and charge, front hooves striking hard. The maternal fury in you is older than thought — a chemical certainty that you will kill or die to protect the small thing behind you.',
  'You launch yourself between the predator and your fawn, rearing up and striking with your forelegs. The hooves connect with a crack that sends the hunter stumbling backward.',
  'You rush forward with a snort of rage, ears flat, every line of your body a promise of violence. The predator hesitates, and in that hesitation you close the distance.',
];

export const FAWN_DEFENSE_DISTRACTIONS: string[] = [
  'You feign injury, dragging one leg, bleating in distress, leading the predator away from where the fawn lies hidden. The performance is not conscious — it is instinct, pure and ancient.',
  'You crash through the brush in the opposite direction, making yourself loud and visible, a more attractive target than the motionless fawn. The predator\'s head swivels toward you. Good.',
  'You stomp and snort, drawing attention to yourself, circling wide to pull the threat away from the fawn\'s hiding spot. Every moment the predator watches you is a moment it isn\'t searching.',
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
