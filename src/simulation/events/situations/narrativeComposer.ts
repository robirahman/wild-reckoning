import type { SimulationContext } from '../types';
import type { Situation, NarrativeSlot } from './types';
import type { NarrativeEnvironment } from '../../narrative/types';
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
    { text: 'The wind is a living thing, shrieking through the trees and driving ice crystals into your eyes. The world has been reduced to a white, howling void.' },
    { text: 'Snow falls so thick it erases the boundary between ground and sky. Each breath is a mouthful of ice crystals.' },
  ],
  heavy_rain: [
    { text: 'Rain hammers the canopy overhead, turning every surface to mud and every sound to white noise. Water streams down your flanks in cold rivulets.' },
    { text: 'The downpour is relentless. Visibility shrinks to a few body lengths and the ground gives way beneath your hooves with every step.' },
  ],
  heat_wave: [
    { text: 'The heat presses down like a weight. The air shimmers above the baked earth and every breath feels thick and insufficient.' },
    { text: 'The sun is merciless. Flies orbit your head in a persistent cloud and every patch of shade draws you like water draws the thirsty.' },
  ],
  fog: [
    { text: 'Fog has swallowed the forest. Trees dissolve into gray ghosts three strides ahead, and every sound is muffled and displaced.' },
    { text: 'The fog turns the world into a place of uncertain distances. Shapes loom and vanish. Your ears become more important than your eyes.' },
  ],
  snow: [
    { text: 'Fresh snow muffles every footstep and transforms the landscape into an alien white expanse. Your dark form is visible for a mile.', season: 'winter' },
  ],
};

/**
 * Build complication hooks for body impairments.
 */
export const IMPAIRMENT_COMPLICATION_FRAGMENTS: Record<string, ContextualFragment[]> = {
  locomotion: [
    { text: 'Your injured leg protests every step, sending a hot lance of pain through your body that makes your gait hitch and stumble.' },
    { text: 'The damaged leg drags, refusing to answer at speed. Every stride is a negotiation between urgency and anatomy.' },
  ],
  vision: [
    { text: 'The world blurs at the edges, shapes dissolving into indistinct smears that could be anything — or nothing.' },
    { text: 'Your damaged eyes struggle to resolve detail. Shadows become threats and threats become shadows.' },
  ],
  'open-wound': [
    { text: 'The wound on your flank weeps with every movement, leaving a trail of scent that announces your vulnerability to everything downwind.' },
    { text: 'Blood-scent clings to you like a second skin. Every predator within a mile knows you are hurt.' },
  ],
  hunger: [
    { text: 'Your body is consuming itself. The hollowness in your gut makes it hard to think about anything except food.' },
    { text: 'Hunger has eroded your caution. The desperate need to feed overrides the instinct to stay hidden.' },
  ],
};
