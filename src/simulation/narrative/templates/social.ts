import type { Rng } from '../../../engine/RandomUtils';

// ══════════════════════════════════════════════════
//  SOCIAL / INTRASPECIFIC NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Rut Combat Openings ──

export const RUT_OPENINGS: string[] = [
  'The scraping sound reaches you first — antler against bark, rhythmic and aggressive. Then you see another buck, raking a sapling with slow, deliberate fury, leaving bright wounds in the wood.',
  'The smell hits you before the sight — testosterone and territorial rage, thick in the air. Another buck stands at the clearing\'s edge, rack lowered, hooves pawing the ground.',
  'A flash of movement through the trees: antlers, wide and heavy, carried with the aggressive confidence of a buck in rut. The other animal turns, sees you, and begins to walk toward you with the stiff-legged gait that means one thing.',
];

// ── Combat Actions ──

export const CHARGE_DESCRIPTIONS: string[] = [
  'You lower your rack and drive forward. The impact is tremendous — a crack like a breaking branch as antler meets antler, tines interlocking, muscles straining.',
  'You charge. The collision of bone on bone reverberates through your skull, down your spine, into your legs. The other buck shoves back with everything he has.',
  'Antlers crash together with a sound that echoes through the forest. You dig your hooves in, pushing, twisting, trying to throw the other buck off balance.',
];

export const POSTURE_DESCRIPTIONS: string[] = [
  'You turn broadside, making yourself as large as possible, neck arched, muscles taut. You rake the ground with a hoof and snort.',
  'You draw yourself up to full height, ears forward, presenting the widest possible profile of your antlers. A deep grunt escapes your throat.',
  'You arch your neck and stamp, tossing your antlers in the light. The display says: look at what you would be fighting.',
];

export const RETREAT_DESCRIPTIONS: string[] = [
  'You break eye contact first, turning your body away in the universal gesture of submission. The other buck watches you go with stiff, imperious posture.',
  'You lower your antlers — not to charge, but to signal. Enough. You turn and walk away, pride stinging, body intact.',
  'You back off, step by careful step, never quite turning your back but clearly yielding ground. The other buck snorts but does not pursue.',
];

// ── Combat Outcomes ──

export interface CombatOutcomeFragment {
  won: boolean;
  text: string;
}

export const COMBAT_OUTCOMES: CombatOutcomeFragment[] = [
  { won: true, text: 'With one final heave, you throw the other buck sideways. He stumbles, catches himself, and retreats — defeated, antlers lowered. The clearing is yours.' },
  { won: true, text: 'The other buck\'s legs give first. He staggers back, breaking the antler lock, and turns away. You watch him go, chest heaving, triumphant.' },
  { won: false, text: 'The other buck is stronger. You feel your legs sliding backward despite everything, and then he throws you off balance. You stagger, nearly fall, and break away.' },
  { won: false, text: 'A twist of his neck catches a tine against yours at the wrong angle. Pain lances through your skull and your grip breaks. The other buck presses forward and you have no choice but to yield.' },
];

// ── Rival Intimidation Outcomes ──

export interface IntimidationFragment {
  backedDown: boolean;
  text: string;
}

export const INTIMIDATION_OUTCOMES: IntimidationFragment[] = [
  { backedDown: true, text: 'The other buck hesitates, measures you, and after a tense moment turns away. Not worth the risk. Your display was convincing.' },
  { backedDown: true, text: 'Your rival takes one step forward, then stops. His ears flatten. He turns broadside — a concession — and walks away with forced casualness.' },
  { backedDown: false, text: 'The other buck is not impressed. He lowers his rack and charges, and you are not braced for it.' },
  { backedDown: false, text: 'Your bluff is called. The rival snorts, drops his antlers, and closes the distance before you can react.' },
];

// ── Utility ──

export function pickFrom(pool: string[], rng: Rng): string {
  return pool[rng.int(0, pool.length - 1)];
}

export function pickCombatOutcome(won: boolean, rng: Rng): CombatOutcomeFragment {
  const candidates = COMBAT_OUTCOMES.filter((f) => f.won === won);
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickIntimidation(backedDown: boolean, rng: Rng): IntimidationFragment {
  const candidates = INTIMIDATION_OUTCOMES.filter((f) => f.backedDown === backedDown);
  return candidates[rng.int(0, candidates.length - 1)];
}
