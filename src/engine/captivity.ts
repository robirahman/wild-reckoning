/** Wild vs. captive animals: which systems apply, and how confinement is described */

import type { Setting, SpeciesConfig } from '../types/speciesConfig';

export function settingOf(config: Pick<SpeciesConfig, 'setting'>): Setting {
  return config.setting ?? 'wild';
}

/** Farm animals live confined under human control: no outdoor map, weather, or roaming */
export function isCaptive(config: Pick<SpeciesConfig, 'setting'>): boolean {
  return settingOf(config) === 'captive';
}

/** Whether content tagged for `settings` (default: wild only) can happen to this animal */
export function fitsSetting(settings: readonly Setting[] | undefined, config: Pick<SpeciesConfig, 'setting'>): boolean {
  return (settings ?? ['wild']).includes(settingOf(config));
}

/**
 * What a confined animal perceives, keyed by its species' habitat. Written from
 * inside the animal: no fans, feeder lines or concrete, which it has no idea
 * of, only the drone, the rattle, the hard cold ground.
 */
const CONFINEMENT_DESCRIPTIONS: Record<string, string[]> = {
  'industrial shed': [
    'A drone overhead that never stops. The light never changes and never dims. Bodies press against you on every side.',
    'A sharp smell stings your eyes. The ground underfoot is damp and packed hard. Something overhead rattles, and every beak turns toward it.',
    'Warm bodies, peeping, the smell of droppings. Nowhere to step without touching another body.',
  ],
  'concrete pen': [
    'Hard cold ground under your hooves, with gaps where the waste falls through. Cold metal at your shoulder. The air is thick and sour.',
    'Something clanks, and the others shove toward the food smell. No mud to root in. No corner without another body in it.',
    'Through the bars, the smell of more pigs, and more beyond them. A roar overhead pushes hot air down on all of you.',
  ],
};

const FALLBACK_CONFINEMENT = [
  'Walls and bars, and the smell of many bodies close together.',
];

/** A stable description for this turn (no game RNG, so re-renders don't change it) */
export function describeConfinement(habitat: string, turn: number): string {
  const pool = CONFINEMENT_DESCRIPTIONS[habitat] ?? FALLBACK_CONFINEMENT;
  return pool[turn % pool.length];
}
