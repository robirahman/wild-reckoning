import type { Rng } from '../../../engine/RandomUtils';
import type { ContextualFragment } from './shared';

// ══════════════════════════════════════════════════
//  SOCIAL / INTRASPECIFIC NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Rut Combat Openings ──

export const RUT_OPENINGS: string[] = [
  'The scraping sound reaches you first. Antler against bark, rhythmic and hard. Another buck rakes a sapling, stripping pale ribbons of wood from the trunk.',
  'The smell hits before the sight. Musk and urine, thick in the air. Another buck stands at the clearing edge, rack lowered, hooves pawing the ground.',
  'A flash of movement through the trees: antlers, wide and heavy. The other buck turns, sees you, and begins walking toward you with a stiff-legged gait.',
];

// ── Combat Actions ──

export const CHARGE_DESCRIPTIONS: string[] = [
  'You lower your rack and drive forward. The impact cracks like a breaking branch as antler meets antler, tines interlocking, muscles straining.',
  'You charge. The collision of bone on bone reverberates through your skull, down your spine, into your legs. The other buck shoves back with everything he has.',
  'Antlers crash together with a sound that echoes through the forest. You dig your hooves in, pushing, twisting, trying to throw the other buck off balance.',
];

export const POSTURE_DESCRIPTIONS: string[] = [
  'You turn broadside, making yourself as large as possible, neck arched, muscles taut. You rake the ground with a hoof and snort.',
  'You draw yourself up to full height, ears forward, presenting the widest possible profile of your antlers. A deep grunt escapes your throat.',
  'You arch your neck and stamp, tossing your antlers in the light. The display says: look at what you would be fighting.',
];

export const RETREAT_DESCRIPTIONS: string[] = [
  'You break eye contact first, turning your body away. The other buck watches you go, legs stiff, head high.',
  'You lower your antlers. Not to charge, but to yield. You turn and walk away. Body intact.',
  'You back off, step by careful step, never quite turning your back but giving ground. The other buck snorts but does not pursue.',
];

// ── Combat Outcomes ──

export interface CombatOutcomeFragment {
  won: boolean;
  text: string;
}

export const COMBAT_OUTCOMES: CombatOutcomeFragment[] = [
  { won: true, text: 'With one final heave, you throw the other buck sideways. He stumbles, catches himself, and retreats with antlers lowered. The clearing is yours.' },
  { won: true, text: 'The other buck\'s legs give first. He staggers back, breaking the antler lock, and turns away. You watch him go, chest heaving.' },
  { won: false, text: 'The other buck is stronger. Your legs slide backward and he throws you off balance. You stagger, nearly fall, and break away.' },
  { won: false, text: 'A twist of his neck catches a tine against yours at the wrong angle. Pain shoots through your skull and your grip breaks. The other buck presses forward and you yield.' },
];

// ── Rival Intimidation Outcomes ──

export interface IntimidationFragment {
  backedDown: boolean;
  text: string;
}

export const INTIMIDATION_OUTCOMES: IntimidationFragment[] = [
  { backedDown: true, text: 'The other buck hesitates, measures you, and after a tense moment turns away. Not worth the risk. Your display was convincing.' },
  { backedDown: true, text: 'Your rival takes one step forward, then stops. His ears flatten. He turns broadside and walks away.' },
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

// ══════════════════════════════════════════════════
//  CONTEXTUAL SOCIAL FRAGMENTS
// ══════════════════════════════════════════════════

// ── Herd Alarm Narratives ──

export const HERD_ALARM_NARRATIVES: ContextualFragment[] = [
  {
    text: 'A sharp exhalation cuts through the grey half-light, somewhere to your left. In this thin dawn air, the sound carries far. Your muscles lock. Your ears swivel.',
    timeOfDay: 'dawn',
  },
  {
    text: 'A doe\'s alarm bark breaks the dusk stillness. In the fading light every shadow could hide a predator, every rustle a threat. The white flash of her tail catches the last light as she bounds away, and your hind legs coil to follow.',
    timeOfDay: 'dusk',
  },
  {
    text: 'The alarm snort echoes between the trunks, bouncing and multiplying until it seems to come from everywhere. In this dense timber you cannot see the source. You run.',
    terrain: 'forest',
  },
  {
    text: 'Across the open ground you see it before you hear it. A doe\'s head snaps up, her whole body goes rigid, tail flagging white against the green. Then the snort reaches you, and every deer in the meadow is running.',
    terrain: 'meadow',
  },
  {
    text: 'The winter yard erupts. One snort becomes three, becomes ten, and the packed snow churns under dozens of hooves. You are running before you know what triggered it.',
    season: 'winter',
  },
  {
    text: 'The alarm comes from a yearling at the far edge of the scattered summer group. The snort is short and uncertain, but your body does not wait. Your legs drive you forward through the tall grass before the sound fades.',
    season: 'summer',
  },
];

// ── Bachelor Group Narratives ──

export const BACHELOR_GROUP_NARRATIVES: ContextualFragment[] = [
  {
    text: 'Three bucks stand chest-deep in wildflowers, antlers still wrapped in thick velvet. They graze slowly, unbothered. One flicks an ear as you approach but does not lift its head.',
    season: 'summer',
  },
  {
    text: 'Two young bucks drink side by side at the creek, their growing antlers forked and tender beneath soft velvet. They lift dripping muzzles to look at you, then return to the water. There is space for one more.',
    season: 'spring',
  },
  {
    text: 'The bachelor group is restless. The first cool nights of autumn have started something. Two bucks spar with half-force, antlers clicking, testing. The tolerance between them is thinning.',
    season: 'autumn',
  },
  {
    text: 'A pair of bucks lie bedded in the shade, chewing cud with half-closed eyes. Their velvet antlers are swollen with blood, soft to the touch. One stretches, yawns, and shifts to make room.',
    season: 'summer',
  },
];

// ── Doe Hierarchy Narratives ──

export const DOE_HIERARCHY_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The older doe blocks the trail to the best browse, fawn tucked behind her. Her ears pin flat and she stamps once, hard. You stop. The fawn eats first.',
    season: 'spring',
  },
  {
    text: 'The dominant doe walks directly to the richest patch of clover and begins to eat. She does not look at you. The other does drift aside without being pushed.',
  },
  {
    text: 'Two does face each other across the last unfrozen browse, breath steaming in the cold air. The larger one rears without warning, front hooves striking, and the smaller doe flinches backward.',
    season: 'winter',
  },
  {
    text: 'The dominant doe walks toward you, head low, eyes fixed. You give ground step by step. No blows are struck. She does not need to.',
  },
];

// ── Fawn Play Narratives ──

export const FAWN_PLAY_NARRATIVES: ContextualFragment[] = [
  {
    text: 'Your fawns burst from the underbrush, chasing each other between the trunks in tight loops. One skids on leaf litter, tumbles, and is up again before you can flinch.',
    terrain: 'forest',
  },
  {
    text: 'In the open meadow your fawns run flat out, legs a blur, ears pinned back. They wheel and dodge through the tall grass, which parts around them and closes behind.',
    terrain: 'meadow',
  },
  {
    text: 'The fawns have found a shallow creek crossing and are leaping it back and forth, each jump more extravagant than the last. Water sprays in silver arcs around their hooves. One misjudges the bank, splashes belly-deep, and scrambles out shaking, already turning to try again.',
  },
  {
    text: 'Your fawns spar in the dappled light, rising on hind legs to box with soft hooves. They are clumsy and slow, repeating the motions the adults make.',
  },
];

// ── Territorial Narratives ──

export const TERRITORIAL_NARRATIVES: ContextualFragment[] = [
  {
    text: 'Your neck muscles tighten at the forest edge. You find a young maple and rake it with your rack, stripping bark in long, pale ribbons, working the wood until the fresh cambium scent mingles with your own musk.',
    terrain: 'forest',
    season: 'autumn',
  },
  {
    text: 'You paw the earth beneath an overhanging branch, scraping away leaves and duff down to the dark, moist soil. The scrape is a message board, a chemical declaration scratched into the forest floor. You urinate on your tarsal glands and rub them into the raw earth. Let them come and read it.',
    season: 'autumn',
  },
  {
    text: 'At the meadow edge you find another buck\'s rub, his scent still sharp on the mangled bark. You attack the same tree with your own antlers, grinding his marks away, layering your scent over his.',
    terrain: 'meadow',
    season: 'autumn',
  },
  {
    text: 'The licking branch hangs at exactly the right height. You work your forehead gland against it until the wood is dark and slick with secretion, then hook it with a tine and twist until it creaks. The scent will linger for days.',
    season: 'autumn',
  },
];

// ── Yearling Dispersal Narratives ──

export const YEARLING_DISPERSAL_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The spring air carries new scents from beyond the ridge. Unfamiliar soil, unknown water, the smell of growth in places you have never been. A pulling sensation in your chest makes the familiar trails feel wrong.',
    season: 'spring',
  },
  {
    text: 'Your mother does not respond when you approach. She turns away, the new fawns at her side pressing close. When you step closer she pins her ears. The bond from winter is gone.',
    season: 'spring',
  },
  {
    text: 'The mature bucks tolerate you less each day. A sideways look becomes a lowered head, becomes a stiff-legged approach. One stamps and snorts when you come near the feeding area.',
  },
];
