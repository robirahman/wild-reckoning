import type { Rng } from '../../../engine/RandomUtils';

// ══════════════════════════════════════════════════
//  INJURY NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// These fragments describe the somatic experience of taking damage.
// They're composed by the renderer after the harm resolver runs.

// ── Impact Descriptions (by harm type) ──

export interface ImpactFragment {
  harmType: 'blunt' | 'sharp' | 'thermal-cold' | 'thermal-heat' | 'chemical' | 'biological';
  intensity: 'low' | 'medium' | 'high' | 'extreme';
  text: string;
}

export const IMPACT_FRAGMENTS: ImpactFragment[] = [
  // Blunt
  { harmType: 'blunt', intensity: 'low', text: 'A dull thud of impact that you feel in your bones.' },
  { harmType: 'blunt', intensity: 'medium', text: 'The blow lands hard enough to make the world ring. Your vision swims for a moment.' },
  { harmType: 'blunt', intensity: 'high', text: 'The impact is tremendous — a crack like a breaking branch, and then white-hot pain.' },
  { harmType: 'blunt', intensity: 'extreme', text: 'The force of it folds your body in a direction bodies aren\'t meant to fold. Something inside gives way.' },

  // Sharp
  { harmType: 'sharp', intensity: 'low', text: 'A thin line of pain, sharp and precise, across your skin.' },
  { harmType: 'sharp', intensity: 'medium', text: 'Teeth — or claws — tear through skin and into the muscle beneath. The pain comes a heartbeat after the wound.' },
  { harmType: 'sharp', intensity: 'high', text: 'Something bites deep, past skin, past muscle, grating against what feels like the core of you. Warmth spills freely.' },
  { harmType: 'sharp', intensity: 'extreme', text: 'The wound opens you. There is no barrier left between your insides and the air. Things that should stay inside are not staying inside.' },

  // Thermal-cold
  { harmType: 'thermal-cold', intensity: 'low', text: 'The cold presses in, numbing the surface of your skin, making your muscles stiff and slow.' },
  { harmType: 'thermal-cold', intensity: 'medium', text: 'The cold deepens into something that feels personal — searching, finding every thin patch of fur and pressing in.' },
  { harmType: 'thermal-cold', intensity: 'high', text: 'Your extremities have stopped reporting. The cold has moved past the skin and is working on the muscle beneath.' },
  { harmType: 'thermal-cold', intensity: 'extreme', text: 'The cold has become the world. Your body is a thing that is slowly stopping, and the stopping feels almost peaceful.' },

  // Thermal-heat
  { harmType: 'thermal-heat', intensity: 'low', text: 'Heat prickles across your skin, uncomfortable but bearable.' },
  { harmType: 'thermal-heat', intensity: 'medium', text: 'The heat sears through your fur, raising blisters on the skin beneath.' },
  { harmType: 'thermal-heat', intensity: 'high', text: 'The burning is everywhere, inescapable, the smell of singed fur thick in your nostrils.' },
  { harmType: 'thermal-heat', intensity: 'extreme', text: 'The pain transcends what you knew pain could be. Your body convulses, trying to escape the heat by any means.' },

  // Biological
  { harmType: 'biological', intensity: 'low', text: 'A faint wrongness, like a sour note in the symphony of your body.' },
  { harmType: 'biological', intensity: 'medium', text: 'Something inside you is not right. A creeping wrongness that ebbs and flows but does not leave.' },
  { harmType: 'biological', intensity: 'high', text: 'Your body is fighting something you cannot see or touch or flee from. The battle rages inside you.' },
  { harmType: 'biological', intensity: 'extreme', text: 'You are burning from the inside. Your body has become a battleground and you are losing.' },

  // Chemical
  { harmType: 'chemical', intensity: 'low', text: 'A bitter taste spreads through your mouth, and your stomach clenches.' },
  { harmType: 'chemical', intensity: 'medium', text: 'Your stomach cramps violently and you double over, saliva dripping from your jaw.' },
  { harmType: 'chemical', intensity: 'high', text: 'The world tilts. Your legs buckle. Everything inside you is trying to come out at once.' },
  { harmType: 'chemical', intensity: 'extreme', text: 'Your body convulses with a violence you didn\'t know it possessed. The poison has found your center.' },
];

// ── Body Zone Pain Descriptions ──
// How pain in a specific zone feels to the animal.

export const ZONE_PAIN: Record<string, string[]> = {
  'head': [
    'Your skull rings like a struck bell.',
    'White light explodes behind your eyes.',
    'The world spins and your jaw clamps involuntarily.',
  ],
  'neck': [
    'Your neck seizes, every muscle locking rigid.',
    'You can\'t turn your head without a lance of pain.',
    'The vulnerability of it — the soft throat, the windpipe — makes your legs want to run.',
  ],
  'torso': [
    'The breath is driven from your lungs.',
    'Something deep in your chest shifts in a way it shouldn\'t.',
    'Your ribs protest every inhalation.',
  ],
  'front-legs': [
    'Your front leg buckles and you stumble, catching yourself at the last moment.',
    'The leg tries to fold beneath you. You shift your weight desperately to the other side.',
    'A grinding sensation in the leg that makes your stomach lurch.',
  ],
  'hind-legs': [
    'Your hind leg drags, leaving a furrow in the earth.',
    'The leg that powers your sprint stutters, and you feel speed leaving you.',
    'A deep ache that turns to sharp fire with every stride.',
  ],
  'tail': [
    'A sharp sting at your hindquarters makes you flinch.',
  ],
  'skin': [
    'Your hide splits and warmth runs freely down your flank.',
    'The skin tears like wet paper, and the air touches what should never touch air.',
  ],
  'internal': [
    'Something inside shifts — a nauseating, deep wrongness that has no surface.',
    'The pain has no location you can point to. It radiates from everywhere and nowhere.',
  ],
};

// ── Capability Impairment Descriptions ──

export const CAPABILITY_IMPAIRMENT: Record<string, { moderate: string; severe: string; critical: string }> = {
  locomotion: {
    moderate: 'Your gait falters. Each stride costs more than it should.',
    severe: 'Running is agony now. Your legs betray you with every step.',
    critical: 'You can barely stand. The idea of running is a cruel joke your body can\'t deliver.',
  },
  vision: {
    moderate: 'The world blurs at the edges. Shapes swim and double.',
    severe: 'You can barely see. The forest has become a dim, threatening blur.',
    critical: 'Darkness crowds the edges of your vision. The world shrinks to a tunnel.',
  },
  breathing: {
    moderate: 'Each breath is labored. Your lungs can\'t keep up with what your body demands.',
    severe: 'You are drowning in open air. Each breath is a conscious, desperate effort.',
    critical: 'Your lungs are failing. The air won\'t come. The world darkens at the edges.',
  },
  digestion: {
    moderate: 'Your stomach cramps. The thought of food nauseates you.',
    severe: 'Your gut is in revolt. Nothing stays down, and the cramps come in waves.',
    critical: 'Your body has forgotten how to process food. You are starving in the midst of plenty.',
  },
};

// ── Utility ──

export function pickImpact(
  harmType: string,
  magnitude: number,
  rng: Rng,
): ImpactFragment | undefined {
  const intensity = magnitudeToIntensity(magnitude);
  const candidates = IMPACT_FRAGMENTS.filter(
    (f) => f.harmType === harmType && f.intensity === intensity,
  );
  if (candidates.length === 0) return undefined;
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickZonePain(zone: string, rng: Rng): string {
  const pool = ZONE_PAIN[zone];
  if (!pool || pool.length === 0) return 'Pain flares where you were struck.';
  return pool[rng.int(0, pool.length - 1)];
}

export function describeCapabilityImpairment(
  capabilityId: string,
  effectiveness: number,
): string | undefined {
  const desc = CAPABILITY_IMPAIRMENT[capabilityId];
  if (!desc) return undefined;
  if (effectiveness < 20) return desc.critical;
  if (effectiveness < 50) return desc.severe;
  if (effectiveness < 80) return desc.moderate;
  return undefined; // no notable impairment
}

function magnitudeToIntensity(magnitude: number): 'low' | 'medium' | 'high' | 'extreme' {
  if (magnitude >= 80) return 'extreme';
  if (magnitude >= 55) return 'high';
  if (magnitude >= 30) return 'medium';
  return 'low';
}
