import type { Rng } from '../../../engine/RandomUtils';

// ══════════════════════════════════════════════════
//  ENVIRONMENTAL EVENT NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Blizzard / Cold Exposure ──

export interface WeatherFragment {
  weatherType: 'blizzard' | 'frost' | 'snow' | 'rain' | 'heat';
  intensity: 'moderate' | 'severe';
  text: string;
}

export const COLD_EXPOSURE: WeatherFragment[] = [
  { weatherType: 'blizzard', intensity: 'severe', text: 'The wind hits like a wall of frozen knives. Snow drives horizontally, stinging your eyes shut, packing into your nostrils. You cannot see. You cannot hear anything over the roar.' },
  { weatherType: 'blizzard', intensity: 'severe', text: 'The blizzard descends like a living thing, swallowing the forest whole. The temperature plummets by the minute and the wind strips the heat from your body faster than your metabolism can replace it.' },
  { weatherType: 'blizzard', intensity: 'moderate', text: 'Snow falls in thick curtains, muffling the world. The wind gusts hard enough to push you sideways. Visibility drops to a few body-lengths.' },
  { weatherType: 'frost', intensity: 'moderate', text: 'The cold deepens overnight into something that feels personal — malicious, searching, finding every thin patch of fur and pressing in.' },
  { weatherType: 'frost', intensity: 'severe', text: 'Frost crystallizes on your muzzle and around your eyes. Your legs feel leaden and stiff. Even the act of shivering is becoming exhausting.' },
  { weatherType: 'snow', intensity: 'moderate', text: 'The snow continues to fall, soft and silent, gradually burying the world. Your hooves break through the crust with each step, sapping your strength.' },
];

// ── Fall / Terrain Hazard ──

export interface TerrainFragment {
  terrainType: 'mountain' | 'ice' | 'forest' | 'general';
  text: string;
}

export const FALL_OPENINGS: TerrainFragment[] = [
  { terrainType: 'mountain', text: 'The trail narrows along a rocky ledge, loose shale sliding beneath your hooves. You step carefully, but the rock face crumbles — a section of trail simply vanishes, and you are scrabbling at empty air.' },
  { terrainType: 'mountain', text: 'A shelf of rock that looked solid gives way beneath your weight. For a sickening instant you are falling, hooves churning at nothing, the canyon wall spinning past.' },
  { terrainType: 'ice', text: 'The ground betrays you without warning. What looked like firm earth is a sheet of black ice beneath a dusting of snow, and your hooves lose purchase mid-stride.' },
  { terrainType: 'ice', text: 'You step onto what appears to be snow-covered ground, but beneath it is polished ice. Your legs splay in four directions at once.' },
  { terrainType: 'forest', text: 'A root hidden beneath the leaf litter catches your hoof at full stride. The world spins as your front legs buckle and momentum carries you forward.' },
  { terrainType: 'general', text: 'The earth shifts beneath you without warning — a bank giving way, a hidden hole swallowing your foreleg. You pitch forward into a rolling, crashing fall.' },
];

export const FALL_IMPACTS: string[] = [
  'The impact is hard, jarring, the world tilting sideways as you slam into the ground.',
  'You hit the ground wrong — shoulder first, then hip, the breath driven from your lungs.',
  'The slope catches you and you tumble, legs tangling, before sliding to a stop against a rocky outcrop.',
  'For one sickening moment you are weightless, and then the ground arrives, suddenly and without mercy.',
];

// ── Vehicle / Road ──

export const ROAD_OPENINGS: string[] = [
  'You step out of the tree line and something is wrong — the ground beneath your hooves is flat and hard and smells of tar.',
  'The open ground between the tree lines has an alien texture — smooth, dark, radiating warmth even at night. It smells of nothing that belongs in a forest.',
  'You cross the strange flat ground cautiously. The surface is wrong under your hooves — unnaturally smooth, faintly warm.',
];

export const VEHICLE_APPROACH: string[] = [
  'Two blazing lights appear, impossibly bright, growing at impossible speed, accompanied by a rising roar.',
  'A roar builds from the distance — not wind, not animal, something mechanical and furious, accompanied by twin points of light that swell like angry suns.',
  'The ground begins to vibrate. A sound like sustained thunder approaches, and the flat ground is illuminated by rushing light.',
];

// ── Shelter ──

export const SHELTER_FOUND: string[] = [
  'You lower your head and push into the wind, step by agonizing step, until the dark mass of the tree line swallows you. The wind drops instantly.',
  'Dense conifers block the worst of the wind. You wedge yourself between two fallen trunks and wait, trembling but alive.',
  'You find a hollow beneath a windfall, barely large enough, and press yourself into it. The storm rages above but cannot reach you here.',
];

// ── Utility ──

export function pickWeatherFragment(
  weatherType: string,
  rng: Rng,
  severe?: boolean,
): WeatherFragment | undefined {
  const intensity = severe ? 'severe' : 'moderate';
  const candidates = COLD_EXPOSURE.filter(
    (f) => f.weatherType === weatherType && f.intensity === intensity,
  );
  if (candidates.length === 0) {
    // Fallback to any matching weather type
    const fallback = COLD_EXPOSURE.filter((f) => f.weatherType === weatherType);
    return fallback.length > 0 ? fallback[rng.int(0, fallback.length - 1)] : undefined;
  }
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickFallOpening(terrainType: string, rng: Rng): TerrainFragment {
  const candidates = FALL_OPENINGS.filter((f) => f.terrainType === terrainType);
  if (candidates.length > 0) return candidates[rng.int(0, candidates.length - 1)];
  // Fallback to general
  const general = FALL_OPENINGS.filter((f) => f.terrainType === 'general');
  return general.length > 0 ? general[rng.int(0, general.length - 1)] : FALL_OPENINGS[0];
}

export function pickFrom(pool: string[], rng: Rng): string {
  return pool[rng.int(0, pool.length - 1)];
}
