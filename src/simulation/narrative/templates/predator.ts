import type { Rng } from '../../../engine/RandomUtils';

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
  text: string;
}

export const CANID_DETECTIONS: DetectionOpening[] = [
  { sense: 'smell', text: 'You smell them before you see them — the sharp, acrid musk that makes every muscle in your body lock rigid.' },
  { sense: 'sound', text: 'A sound that isn\'t wind. A movement that isn\'t branch-sway. Your head snaps up and your nostrils flare.' },
  { sense: 'sight', timeOfDay: 'dusk', text: 'Gray shapes materialize from the tree line, low and deliberate, spreading in a loose arc. Their eyes catch the last light.' },
  { sense: 'sight', timeOfDay: 'night', text: 'Points of light in the darkness — paired, unblinking, arranged at the wrong height for fireflies. Eyes.' },
  { sense: 'vibration', text: 'The ground carries a rhythm that doesn\'t belong to the forest — synchronized footfalls, too many, too deliberate.' },
  { sense: 'sound', text: 'A long, wavering howl splits the air behind you. Then another, from a different direction. A third. They are triangulating.' },
];

export const FELID_DETECTIONS: DetectionOpening[] = [
  { sense: 'sound', text: 'The birds have stopped singing. A prickling sensation crawls up the back of your neck — the ancient alarm of being watched by something that does not blink.' },
  { sense: 'sight', text: 'A shadow moves where shadows should be still. Something large, tawny, pressed against the rock face above.' },
  { sense: 'touch', text: 'The hair along your spine lifts without reason. Every instinct screams a single word you don\'t have: above.' },
  { sense: 'smell', text: 'A sharp, feline musk hits your nostrils — close, very close. Something is crouched just upwind.' },
];

export const HUMAN_DETECTIONS: DetectionOpening[] = [
  { sense: 'smell', text: 'Strange smells drift between the trees — acrid, chemical, wrong. The forest itself seems to recoil from them.' },
  { sense: 'sound', text: 'A sharp, flat crack splits the air and sends every bird screaming upward. The thunder rolls from the direction of the ridge.' },
  { sense: 'sight', text: 'Bright shapes move where there should be stillness. Upright shapes that don\'t belong among the trees, colored in impossible oranges that nature never makes.' },
  { sense: 'sound', text: 'Dry leaves crunch in a pattern too regular for any four-legged thing. Something walks on two legs, slowly, pausing often.' },
];

// ── Chase / Pursuit ──

export interface PursuitFragment {
  locomotionThreshold: number; // min locomotion % for this variant
  escaped: boolean;
  text: string;
}

export const CANID_PURSUITS: PursuitFragment[] = [
  { locomotionThreshold: 70, escaped: true, text: 'You explode into motion, hooves tearing at the earth. The forest blurs. Behind you, the pack gives chase — but your legs are sound and the fear drives you faster than they can follow. After an agonizing minute of all-out sprint, the sounds of pursuit fade.' },
  { locomotionThreshold: 70, escaped: true, text: 'Your legs answer the call of panic. You run without thought, leaping deadfall, crashing through brush, and the distance opens between you and the gray shapes. They fall back, one by one, conserving energy. They will try again later — but not now.' },
  { locomotionThreshold: 0, escaped: false, text: 'You run. You run with everything you have, but the ground betrays you — your gait is uneven, favoring the damaged leg, and each stride sends a lance of fire through your body. The shapes behind you sense the weakness. They are gaining.' },
  { locomotionThreshold: 0, escaped: false, text: 'Your body tries to sprint but the mechanics are wrong — something in the hind leg catches, drags, and the rhythm of your gallop breaks. The gray shapes close the distance with terrible efficiency.' },
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
  text: string;
}

export const PREDATOR_RESOLUTIONS: ResolutionFragment[] = [
  { outcome: 'escaped', text: 'The sounds of pursuit fade behind you. You slow to a walk, sides heaving, legs trembling. You are alive.' },
  { outcome: 'escaped', text: 'You reach the far side of the clearing and the shapes do not follow. Your heart pounds so hard you can feel it in your hooves.' },
  { outcome: 'injured', text: 'You are still running, but something is wrong — warmth spreading across your hindquarter, the leg not answering properly. You got away. Mostly.' },
  { outcome: 'near-miss', text: 'Teeth snap shut on empty air where your leg was a heartbeat ago. You kick free and run, the narrow margin of survival burning in your mind.' },
  { outcome: 'lethal', text: 'The strength leaves your legs. The ground rushes up. The gray shapes close in, and the world narrows to a single point of sensation before it goes quiet.' },
];

// ── Utility ──

export function pickDetection(
  pool: DetectionOpening[],
  rng: Rng,
  preferredSense?: string,
  timeOfDay?: string,
): DetectionOpening {
  // Filter by time of day if available
  let candidates = pool;
  if (timeOfDay) {
    const timeMatched = pool.filter((d) => d.timeOfDay === timeOfDay);
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
): PursuitFragment {
  const candidates = pool.filter(
    (p) => locomotion >= p.locomotionThreshold && p.escaped === escaped,
  );
  if (candidates.length === 0) {
    // Fallback: any matching escape status
    const fallback = pool.filter((p) => p.escaped === escaped);
    return fallback.length > 0
      ? fallback[rng.int(0, fallback.length - 1)]
      : pool[0];
  }
  return candidates[rng.int(0, candidates.length - 1)];
}
