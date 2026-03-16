import type { SimulationContext } from '../types';
import type { Situation, NarrativeSlot } from './types';
import type { ContextualFragment } from '../../narrative/templates/shared';
import { pickContextualText, toFragmentContext } from '../../narrative/templates/shared';
import { buildEnvironment } from '../../narrative/contextBuilder';

// ══════════════════════════════════════════════════
//  NARRATIVE COMPOSER
// ══════════════════════════════════════════════════
//
// Collects narrative hooks from all active situations and layers
// them into a composed narrative. Slots:
//   atmosphere  → weather/terrain mood setting
//   detection   → entity detection opening (handled by template)
//   complication → wounds, impairment, terrain difficulty
//   aftermath   → resolution/escape (handled by template)
//

/**
 * Compose a narrative opening from situation hooks + a base narrative.
 * The base narrative (from the template) is the core; hooks from
 * other situations layer in atmosphere and complication fragments.
 */
export function composeNarrative(
  ctx: SimulationContext,
  situations: Situation[],
  baseNarrative: string,
  options?: {
    maxAtmosphere?: number;
    maxComplications?: number;
  },
): string {
  const env = buildEnvironment(ctx);
  const fragmentCtx = toFragmentContext(env);
  const maxAtmo = options?.maxAtmosphere ?? 1;
  const maxComp = options?.maxComplications ?? 2;

  // Collect all narrative hooks from situations, sorted by priority
  const allHooks = situations
    .flatMap(s => s.narrativeHooks ?? [])
    .sort((a, b) => b.priority - a.priority);

  // Layer 1: Atmosphere (weather/terrain mood, placed before base narrative)
  const atmosphereFragments = collectSlotText(allHooks, 'atmosphere', fragmentCtx, ctx, maxAtmo);

  // Layer 2: Complications (wounds/impairment, woven after base narrative)
  const complicationFragments = collectSlotText(allHooks, 'complication', fragmentCtx, ctx, maxComp);

  // Compose: atmosphere → base → complications
  const parts: string[] = [];
  if (atmosphereFragments.length > 0) {
    parts.push(atmosphereFragments.join(' '));
  }
  parts.push(baseNarrative);
  if (complicationFragments.length > 0) {
    parts.push(complicationFragments.join(' '));
  }

  return parts.join('\n\n');
}

/**
 * Collect resolved text for a specific narrative slot.
 */
function collectSlotText(
  hooks: { slot: NarrativeSlot; fragments: ContextualFragment[]; priority: number }[],
  slot: NarrativeSlot,
  fragmentCtx: ReturnType<typeof toFragmentContext>,
  ctx: SimulationContext,
  max: number,
): string[] {
  return hooks
    .filter(h => h.slot === slot)
    .slice(0, max)
    .map(h => pickContextualText(h.fragments, fragmentCtx, ctx.rng));
}

/**
 * Build atmosphere hooks for common weather conditions.
 * Used by the detector to attach narrative hooks to weather situations.
 */
export const WEATHER_ATMOSPHERE_FRAGMENTS: Record<string, ContextualFragment[]> = {
  blizzard: [
    { text: 'Wind drives ice into your eyes. You cannot smell anything through it. White in every direction, no horizon.' },
    { text: 'Snow so thick the ground and sky merge. Each breath pulls ice crystals into your throat.' },
  ],
  heavy_rain: [
    { text: 'Rain pounding the canopy, constant. Water running down your flanks. The ground softens and gives under your weight. All sound flattened to noise.' },
    { text: 'Visibility closes in to a few body lengths. The ground breaks apart underfoot. Every scent on the ground blooms strong and muddy.' },
  ],
  heat_wave: [
    { text: 'Heat on your back and face, pressing. The air is thick. Each breath feels insufficient. You pant.' },
    { text: 'Biting things circling your head in a cloud that will not disperse. Every shaded spot pulls you toward it.' },
  ],
  fog: [
    { text: 'Shapes dissolve three strides ahead. Sound muffled and directionless. Your ears turn but cannot locate the source.' },
    { text: 'Distances collapse. Things appear and vanish. You rely on your nose and ears; your eyes give you almost nothing.' },
  ],
  snow: [
    { text: 'Fresh snow on the ground, muffling your steps. Your body stands out dark against the white. Exposed.', season: 'winter' },
  ],
};

/**
 * Build complication hooks for body impairments.
 */
export const IMPAIRMENT_COMPLICATION_FRAGMENTS: Record<string, ContextualFragment[]> = {
  locomotion: [
    { text: 'Hot pain through your injured leg with each step. Your gait hitches and catches.' },
    { text: 'The damaged leg drags. At speed, it will not answer. You favor the other side.' },
  ],
  vision: [
    { text: 'Shapes blur at the edges of your field. You cannot resolve what is moving out there.' },
    { text: 'Your damaged eye gives you smears where there should be detail. Your good eye works harder.' },
  ],
  'open-wound': [
    { text: 'The wound weeps with each movement. Blood-scent trails behind you on the air.' },
    { text: 'Your own blood-smell is strong on you. Anything downwind knows.' },
  ],
  hunger: [
    { text: 'Hollowness in your gut. Your attention keeps pulling toward any food-smell.' },
    { text: 'The hunger has worn through your caution. You stay in the open longer than you should, eating.' },
  ],
};
