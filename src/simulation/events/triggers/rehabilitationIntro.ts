import type { SimulationTrigger, SimulationContext, SimulationOutcome, SimulationChoice } from '../types';
import { StatId } from '../../../types/stats';

// ══════════════════════════════════════════════════
//  REHABILITATION INTRO — first 3 turns for rehab backstory
//  Per simulation_refactor.md: skip early childhood via
//  rehabilitation release, giving the player a controlled
//  introduction before the wild takes over.
// ══════════════════════════════════════════════════

export const rehabilitationIntroTrigger: SimulationTrigger = {
  id: 'sim-rehab-intro',
  category: 'milestone',
  tags: ['milestone', 'narrative'],
  guaranteed: true,

  isPlausible(ctx) {
    // Only fires for rehabilitation backstory in the first 3 turns
    if (ctx.animal.backstory.type !== 'rehabilitation') return false;
    if (ctx.time.turn > 3) return false;
    // Don't repeat: check flags for each stage
    if (ctx.time.turn === 1 && ctx.animal.flags.has('rehab-released')) return false;
    if (ctx.time.turn === 2 && ctx.animal.flags.has('rehab-first-night')) return false;
    if (ctx.time.turn === 3 && ctx.animal.flags.has('rehab-first-forage')) return false;
    return true;
  },

  computeWeight(ctx) {
    // Very high weight — intro events should always fire when plausible
    return 1.0;
  },

  resolve(ctx): SimulationOutcome {
    if (ctx.time.turn === 1) {
      return resolveRelease(ctx);
    } else if (ctx.time.turn === 2) {
      return resolveFirstNight(ctx);
    } else {
      return resolveFirstForage(ctx);
    }
  },

  getChoices(ctx): SimulationChoice[] {
    if (ctx.time.turn === 1) {
      return getReleaseChoices(ctx);
    } else if (ctx.time.turn === 3) {
      return getForageChoices(ctx);
    }
    return [];
  },
};

// ── Turn 1: Release from rehabilitation center ──

function resolveRelease(ctx: SimulationContext): SimulationOutcome {
  return {
    harmEvents: [],
    statEffects: [
      { stat: StatId.NOV, amount: 10, duration: 3, label: '+NOV' },
      { stat: StatId.TRA, amount: 5, duration: 2, label: '+TRA' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'rehab-released' },
    ],
    narrativeText: 'The enclosure gate swings open — not the way it usually does, when a figure in heavy gloves brings food and checks your leg. This time it stays open. The figure stands to one side, very still, watching. Beyond the gate is a world you have only ever seen through wire mesh: the treeline dark and close, the ground uneven and damp, the air carrying a thousand scents that have no name. Your legs, healed now but stiff from months of confinement, carry you forward. The gravel gives way to soil. The soil gives way to leaf litter. Behind you, the gate closes. The sound it makes is very final.',
  };
}

function getReleaseChoices(ctx: SimulationContext): SimulationChoice[] {
  return [
    {
      id: 'bolt-into-trees',
      label: 'Bolt into the trees',
      description: 'Instinct screams: run. Put distance between yourself and the enclosure.',
      style: 'default',
      narrativeResult: 'You run. Your hooves find their rhythm on the forest floor — clumsy at first, then steadier, muscles remembering what wire mesh had made them forget. You run until the smell of antiseptic and processed grain is gone, replaced by moss and rotting wood and the cold mineral scent of a stream somewhere ahead. When you stop, your flanks heaving, the enclosure is nowhere behind you. You are alone in a way you have never been.',
      modifyOutcome(base) {
        return {
          ...base,
          statEffects: [
            { stat: StatId.NOV, amount: 12, duration: 3, label: '+NOV' },
            { stat: StatId.ADV, amount: -5, duration: 2, label: '-ADV' },
          ],
          consequences: [
            ...base.consequences,
            { type: 'modify_weight', amount: -1 },
          ],
        };
      },
    },
    {
      id: 'step-cautiously',
      label: 'Step out cautiously',
      description: 'The world outside the gate is enormous. Take it slowly.',
      style: 'default',
      narrativeResult: 'You cross the threshold with deliberate care, testing each step. The ground feels different under your hooves — softer, less predictable. You lower your nose to the leaf litter and breathe in: fungal decay, earthworm casings, the distant musk of something that might be another deer. You drift toward the nearest cover, a stand of young hemlocks, and stand there for a long time, ears turning, watching the world assemble itself around you.',
      modifyOutcome(base) {
        return {
          ...base,
          statEffects: [
            { stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' },
            { stat: StatId.WIS, amount: -3, duration: 2, label: '-WIS' },
          ],
        };
      },
    },
  ];
}

// ── Turn 2: First night in the wild ──

function resolveFirstNight(ctx: SimulationContext): SimulationOutcome {
  return {
    harmEvents: [],
    statEffects: [
      { stat: StatId.TRA, amount: 8, duration: 2, label: '+TRA' },
      { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'rehab-first-night' },
    ],
    narrativeText: 'Night falls, and it is nothing like the enclosure. There are no walls to put your back against, no roof to seal out the sky. The darkness is absolute in a way that artificial light had made you forget was possible. Every sound is amplified by the absence of everything familiar: a branch cracking, the scrabble of small claws on bark, a long descending howl from somewhere in the hills that makes the hair along your spine stand rigid. You do not sleep. You stand with your back to a fallen oak, ears pivoting, eyes straining against the dark, learning the first lesson of the wild: everything out here is awake when you are.',
  };
}

// ── Turn 3: First foraging attempt ──

function resolveFirstForage(ctx: SimulationContext): SimulationOutcome {
  const isSummer = ctx.time.season === 'summer';
  const isWinter = ctx.time.season === 'winter';

  let narrative: string;
  let weightChange: number;

  if (isWinter) {
    weightChange = -1;
    narrative = 'Hunger drives you to eat, but eating in the wild is nothing like the grain and alfalfa pellets of the rehabilitation center. The browse is sparse — dry twigs, frozen lichen, bark stripped from saplings by others before you. You chew on cedar needles and find them bitter, resinous, barely worth the effort. Your rumen, accustomed to processed feed, cramps around the unfamiliar roughage. You will have to learn what the forest offers, and quickly. Winter does not wait.';
  } else if (isSummer) {
    weightChange = 1;
    narrative = 'The rehabilitation center fed you on schedule — pellets in a trough, hay in a rack, water in a steel basin. The forest feeds you on its own terms. You nose through the undergrowth and discover abundance you did not expect: clover in the clearings, tender maple shoots, mushrooms pushing through the damp litter. Your instincts, dormant through months of confinement, begin to surface. You know which leaves to take without being taught. The knowledge is older than you are.';
  } else {
    weightChange = 0;
    narrative = 'Your first real forage is tentative and clumsy. You nose at plants you have never seen before, tasting and spitting, tasting and swallowing. Some of it is good — your body knows, even if your mind does not, which greens carry the nutrients you need. The processed feed of the rehabilitation center is already a fading memory. Out here, eating is work: walking, searching, testing, chewing through tough stems for the soft growth inside. But with each mouthful, something is waking up — an instinct that was always there, waiting for the wire mesh to open.';
  }

  return {
    harmEvents: [],
    statEffects: [
      { stat: StatId.NOV, amount: -5, label: '-NOV' },
      { stat: StatId.WIS, amount: -3, label: '-WIS' },
    ],
    consequences: [
      { type: 'set_flag', flag: 'rehab-first-forage' },
      { type: 'modify_weight', amount: weightChange },
    ],
    narrativeText: narrative,
  };
}

function getForageChoices(ctx: SimulationContext): SimulationChoice[] {
  return [
    {
      id: 'eat-everything',
      label: 'Eat whatever you find',
      description: 'You are hungry. Caution is a luxury.',
      style: 'default',
      narrativeResult: 'You eat indiscriminately — leaves, shoots, bark, berries whose color you do not recognize. Most of it sits well enough. Your stomach is full for the first time since the gate opened, and the fullness feels like safety.',
      modifyOutcome(base) {
        // Replace weight change: eat more = gain a bit more
        const nonWeightConsequences = base.consequences.filter(c => c.type !== 'modify_weight');
        return {
          ...base,
          statEffects: [
            { stat: StatId.HOM, amount: -4, label: '-HOM' },
            { stat: StatId.NOV, amount: -3, label: '-NOV' },
          ],
          consequences: [
            ...nonWeightConsequences,
            { type: 'modify_weight' as const, amount: 1 },
          ],
        };
      },
    },
    {
      id: 'forage-selective',
      label: 'Follow your instincts carefully',
      description: 'Something inside you knows which plants are safe. Trust it.',
      style: 'default',
      narrativeResult: 'You let your nose lead. There is a quiet intelligence in the way you test each plant — a sniff, a tentative bite, then either acceptance or rejection. The knowledge is not learned; it is inherited, encoded in the same genes that tell your heart to beat. You eat less but eat well.',
      modifyOutcome(base) {
        return {
          ...base,
          statEffects: [
            { stat: StatId.WIS, amount: -5, label: '-WIS' },
            { stat: StatId.NOV, amount: -4, label: '-NOV' },
          ],
        };
      },
    },
  ];
}
