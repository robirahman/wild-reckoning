import type { Rng } from '../../../engine/RandomUtils';
import type { ContextualFragment } from './shared';

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

// ══════════════════════════════════════════════════
//  CONTEXTUAL SOCIAL FRAGMENTS
// ══════════════════════════════════════════════════

// ── Herd Alarm Narratives ──

export const HERD_ALARM_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The alarm snort cuts through the grey half-light like a blade — a sharp, percussive exhalation from somewhere to your left. In this thin dawn air, the sound carries impossibly far. Your muscles lock, your ears swivel, and the world narrows to a single question: where?',
    timeOfDay: 'dawn',
  },
  {
    text: 'A doe\'s alarm bark shatters the dusk stillness. In the fading light every shadow becomes a predator, every rustle a threat. The white flash of her tail catches the last copper light as she bounds away, and your hind legs are already coiling to follow.',
    timeOfDay: 'dusk',
  },
  {
    text: 'The alarm snort echoes strangely between the trunks, bouncing and multiplying until it seems to come from everywhere at once. In this dense timber you cannot see the source, but the sound is unmistakable — danger, close, move now.',
    terrain: 'forest',
  },
  {
    text: 'Across the open ground the alarm is visible before it is audible — a doe\'s head snapping up, her whole body going rigid, tail flagging white against the green. Then the snort reaches you, and every deer in the meadow is running.',
    terrain: 'meadow',
  },
  {
    text: 'The winter yard erupts. In these close quarters the alarm cascades like wildfire — one snort becomes three, becomes ten, and suddenly the packed snow is churning under dozens of hooves. You are swept up in the stampede before you even know what triggered it.',
    season: 'winter',
  },
  {
    text: 'The alarm comes from a yearling on the far edge of the scattered summer group. The snort is hesitant, almost questioning, but your body does not wait for confirmation. Every nerve fires at once, legs driving you forward through the tall grass, instinct overriding thought.',
    season: 'summer',
  },
];

// ── Bachelor Group Narratives ──

export const BACHELOR_GROUP_NARRATIVES: ContextualFragment[] = [
  {
    text: 'Three bucks stand chest-deep in wildflowers, antlers still wrapped in velvet so thick it looks like moss. They graze with the slow, companionable ease of animals who have nothing to prove and nowhere to be. One flicks an ear as you approach. You are tolerated. You are even welcome.',
    season: 'summer',
  },
  {
    text: 'You find them at the creek — two young bucks drinking side by side, their growing antlers forked and tender beneath soft velvet. Spring has dissolved the winter\'s hierarchies. They lift dripping muzzles to regard you, then return to the water. There is space for one more.',
    season: 'spring',
  },
  {
    text: 'The bachelor group is restless today. The first cool nights of autumn have started something in the blood, and the easy camaraderie of summer is fraying at the edges. Two bucks spar half-heartedly, antlers clicking, testing. The friendship has an expiration date, and everyone knows it.',
    season: 'autumn',
  },
  {
    text: 'You encounter a pair of bucks bedded in the shade, chewing cud with half-closed eyes. Their velvet antlers are swollen with blood and growth, grotesquely soft. One stretches, yawns, and shifts to make room. The summer brotherhood asks nothing of you but presence.',
    season: 'summer',
  },
];

// ── Doe Hierarchy Narratives ──

export const DOE_HIERARCHY_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The older doe blocks the trail to the best browse with her body, fawn tucked behind her. Her ears pin flat and she stamps once, hard. The message is maternal and absolute: my fawn eats first, and you will wait.',
    season: 'spring',
  },
  {
    text: 'She appears at the feeding site as if she owns it — because she does. The dominant doe walks directly to the richest patch of clover and begins to eat, ignoring you with a contempt that is itself a statement of rank. The other does drift aside without being told.',
  },
  {
    text: 'Two does face each other across the last unfrozen browse, breath steaming in the cold air. The larger one rears without warning, front hooves striking, and the smaller doe flinches backward. In winter, hierarchy is not politics — it is survival.',
    season: 'winter',
  },
  {
    text: 'The confrontation is silent and brutal in its efficiency. The dominant doe simply walks toward you, head low, eyes fixed, and you find yourself giving ground step by step. No blows are struck. None need to be. Her rank is written in the certainty of her stride.',
  },
];

// ── Fawn Play Narratives ──

export const FAWN_PLAY_NARRATIVES: ContextualFragment[] = [
  {
    text: 'Your fawns explode from the underbrush in a tangle of spotted legs and boundless energy, chasing each other between the trunks in tight, spiraling loops. One skids on leaf litter, tumbles, and is up again before you can flinch. The forest is their playground.',
    terrain: 'forest',
  },
  {
    text: 'In the open meadow your fawns run flat out, legs a blur, ears pinned back with speed. They wheel and dodge like swallows, inventing rules to games only they understand. The tall grass parts around them and closes behind, erasing all evidence of their passage.',
    terrain: 'meadow',
  },
  {
    text: 'The fawns have found a shallow creek crossing and are leaping it back and forth, each jump more extravagant than the last. Water sprays in silver arcs around their hooves. One misjudges the bank, splashes belly-deep, and scrambles out shaking, already turning to try again.',
  },
  {
    text: 'Your fawns spar in the dappled light, rising on hind legs to box with soft hooves, mimicking the dominance contests they have watched the adults perform. They are clumsy and earnest and utterly absorbed. The play is practice for a world that will demand everything of them.',
  },
];

// ── Territorial Narratives ──

export const TERRITORIAL_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The compulsion seizes you at the forest edge — a need as old as antlers. You find a young maple and rake it with your rack, stripping bark in long, pale ribbons, working the wood until the fresh cambium scent mingles with your own musk. This tree now speaks your name.',
    terrain: 'forest',
    season: 'autumn',
  },
  {
    text: 'You paw the earth beneath an overhanging branch, scraping away leaves and duff down to the dark, moist soil. The scrape is a message board, a chemical declaration scratched into the forest floor. You urinate on your tarsal glands and rub them into the raw earth. Let them come and read it.',
    season: 'autumn',
  },
  {
    text: 'At the meadow\'s edge you find a signpost rub — another buck\'s work, his scent still sharp on the mangled bark. The rage is immediate and irrational. You attack the same tree with your own antlers, obliterating his marks with yours, layering your scent over his until nothing remains of the original claim.',
    terrain: 'meadow',
    season: 'autumn',
  },
  {
    text: 'The licking branch hangs at exactly the right height. You work your forehead gland against it until the wood is dark and slick with secretion, then hook it with a tine and twist until it creaks. The scent will linger for days — a territorial broadcast to every buck who passes beneath it.',
    season: 'autumn',
  },
];

// ── Yearling Dispersal Narratives ──

export const YEARLING_DISPERSAL_NARRATIVES: ContextualFragment[] = [
  {
    text: 'The spring air carries new scents from beyond the ridge — unfamiliar soil, unknown water, the green urgency of growth in places you have never been. Something in your chest answers that call, a pulling sensation that makes the familiar trails feel like chains.',
    season: 'spring',
  },
  {
    text: 'Your mother looks through you now. Not with hostility, but with a blankness that is worse — as though the bond that kept you alive through winter has simply dissolved. The new fawns at her side regard you with indifferent curiosity. You are a stranger in the place where you were born.',
    season: 'spring',
  },
  {
    text: 'The mature bucks tolerate you less with each passing day. A sideways look becomes a lowered head, becomes a stiff-legged approach that says leave in the only language that matters. The pressure builds like weather, and you can feel the storm about to break.',
  },
];
