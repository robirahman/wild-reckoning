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

/** What a confined animal perceives, keyed by its species' habitat */
const CONFINEMENT_DESCRIPTIONS: Record<string, string[]> = {
  'industrial shed': [
    'Fans drone overhead. The light never changes, never dims toward dusk. Bodies press against you on every side.',
    'Ammonia stings your eyes. The litter underfoot is damp and packed hard. Somewhere a feeder line rattles and thousands of beaks turn toward it.',
    'Warm bodies, noise, and the smell of droppings. There is nowhere to step that is not beside another bird.',
  ],
  'concrete pen': [
    'Concrete under your hooves, slatted where the waste falls through. Steel bars at your shoulder. The air is thick and sour.',
    'A feeder clanks and the others shove toward it. There is no mud to root in, no corner without a neighbor.',
    'Fans roar. Through the bars you can see the next pen, and the next, and the next.',
  ],
};

const FALLBACK_CONFINEMENT = [
  'Walls, bars, and the smell of too many animals in too little space.',
];

/** A stable description for this turn (no game RNG, so re-renders don't change it) */
export function describeConfinement(habitat: string, turn: number): string {
  const pool = CONFINEMENT_DESCRIPTIONS[habitat] ?? FALLBACK_CONFINEMENT;
  return pool[turn % pool.length];
}
