/**
 * Animal-perspective sensory descriptions for the navigation UI.
 *
 * Replaces abstract map data (node types, resource numbers) with
 * prose the animal would actually perceive — scents, sounds, ground
 * feel, moisture, danger cues.
 *
 * Wisdom-gated: low WIS → vague impressions, high WIS → specifics.
 */

import type { MapNode, NodeType } from '../types/map';
import type { AnimalState } from '../types/species';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { WeatherState } from './WeatherSystem';
import type { WorldMemory, NodeMemory } from '../simulation/memory/types';
import type { Rng } from './RandomUtils';

// ── Types ────────────────────────────────────────────────────────────

export interface SensoryDirection {
  nodeId: string;
  sensoryLabel: string;
  effortLabel: string;
  dangerCue?: string;
  waterCue?: string;
}

export interface SensoryDescription {
  current: string;
  directions: SensoryDirection[];
  sniffLabel: string;
}

// ── Current location descriptions ────────────────────────────────────

const CURRENT_LOCATION: Record<NodeType, string[]> = {
  forest: [
    'Thick canopy overhead. The air smells of damp earth and decay. Forage grows in patches where light breaks through.',
    'Trees press close on every side. Leaf litter muffles your steps. The understory is dense with browse.',
    'A closed canopy filters the light to green shadow. The ground is soft. Insects hum in the warm air.',
  ],
  plain: [
    'Open ground in every direction. The wind carries scent from far away. You feel exposed.',
    'Grass stretches to the horizon. The sky presses down. There is nowhere to hide.',
    'Flat, dry ground. The sun is direct. The air shimmers with heat off the bare earth.',
  ],
  water: [
    'The sound of moving water. The bank mud smells of silt and minerals. You drink deeply.',
    'A pool reflects the sky. The ground is soft and cool near the edge. Water.',
    'The creek bends here, slowing into a shallow pool. The water tastes of earth and iron.',
  ],
  mountain: [
    'Steep ground underfoot. The footing is uncertain — loose rock and thin soil. Little grows here.',
    'The ridge rises sharply. Wind pushes at you from the exposed face. The air is thinner.',
    'Rocky ground, sparse vegetation. The view is wide but the climb took effort.',
  ],
  den: [
    'A sheltered hollow. The air is still and warm. The ground is worn smooth by use.',
    'An overhang of rock and roots creates a pocket of calm. You feel safe here.',
    'Your resting place. The scent is familiar — your own, layered over many visits.',
  ],
};

// ── Adjacent node sensory labels ─────────────────────────────────────

const DIRECTION_LABELS: Record<NodeType, string[]> = {
  forest: ['Move deeper into the trees', 'Follow the tree line', 'Head into the thicket'],
  plain: ['Head toward open ground', 'Cross into the grassland', 'Step out into the open'],
  water: ['Follow the water scent', 'Move toward the sound of water', 'Head downhill toward moisture'],
  mountain: ['Climb the ridge', 'Head uphill over loose rock', 'Scramble toward higher ground'],
  den: ['Return to the sheltered hollow', 'Head back to familiar ground', 'Move toward shelter'],
};

// ── Effort descriptions ──────────────────────────────────────────────

function effortLabel(movementCost: number, energy: number): string {
  const fraction = movementCost / Math.max(1, energy);
  if (movementCost <= 8) return 'a short walk';
  if (movementCost <= 15) return 'a moderate trek';
  if (movementCost <= 25) return 'a difficult journey';
  if (fraction > 0.8) return 'exhausting — nearly all your strength';
  return 'a long, hard push';
}

// ── Danger cues from node memory ─────────────────────────────────────

function dangerCue(nodeMemory: NodeMemory | undefined, wisdom: number): string | undefined {
  if (!nodeMemory) return undefined;
  if (nodeMemory.perceivedDanger > 70 && wisdom > 30) {
    return 'The scent of blood and fear lingers. Something died here recently.';
  }
  if (nodeMemory.perceivedDanger > 50 && wisdom > 40) {
    return 'Something feels wrong about that direction.';
  }
  if (nodeMemory.killCount > 0 && nodeMemory.lastKillTurn > 0 && wisdom > 50) {
    return 'You remember danger there. The memory is vivid.';
  }
  return undefined;
}

// ── Water cues for elephants ─────────────────────────────────────────

/**
 * Water cues for elephants, gated by matriarch knowledge reliability.
 *
 * - permanent knowledge (original matriarch): always correct, confident
 * - new matriarch (seasonal/unconfirmed knowledge): gives uncertain hints
 *   that use IDENTICAL language whether the node actually has water or not.
 *   The player cannot distinguish correct from incorrect hints — they must
 *   follow the matriarch and learn through experience, just as the herd does.
 */
function waterCue(
  node: MapNode,
  waterKnowledge: WorldMemory['waterKnowledge'],
  speciesId: string,
  flags: ReadonlySet<string>,
  turn: number,
): string | undefined {
  if (speciesId !== 'african-elephant') return undefined;
  if (!waterKnowledge) return undefined;
  if (!waterKnowledge.matriarchAlive) return undefined;

  const known = waterKnowledge.knownSources[node.id];

  // Permanent knowledge — always correct, confident language
  if (known?.reliability === 'permanent') {
    return 'The matriarch turns her head. She knows this place. Water.';
  }

  // New matriarch uncertain hints — same language whether right or wrong.
  // She hints at: (a) seasonal-reliability nodes she visited before, AND
  // (b) ~20% of other nodes she vaguely misremembers. The player cannot
  // tell which hints lead to water and which don't.
  const isNewMatriarch = flags.has('new-matriarch-emerged');
  if (!isNewMatriarch) return undefined;

  const hash = simpleHash(node.id + ':' + turn);
  const uncertainTexts = [
    'The lead cow pauses, testing the air. She turns this way. She is not certain.',
    'The lead cow lifts her trunk toward this direction. A memory, maybe. Or maybe just wind.',
    'The oldest cow shifts her weight, facing this way. Something pulls at her. She does not commit.',
  ];
  const text = uncertainTexts[hash % uncertainTexts.length];

  // Known seasonal node — always give an uncertain hint (sometimes right, sometimes wrong)
  if (known?.reliability === 'seasonal') {
    return text;
  }

  // Unknown node — ~20% chance of a false-positive uncertain hint
  if (hash % 5 === 0) {
    return text;
  }

  // Actual water nodes the matriarch hasn't learned yet also get ~30% uncertain hints
  // (she can smell water faintly but isn't sure)
  if (node.type === 'water' && hash % 3 === 0) {
    return text;
  }

  return undefined;
}

/** Simple deterministic hash for consistent per-node-per-turn behavior */
function simpleHash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// ── Species-specific sniff action labels ─────────────────────────────

const SNIFF_LABELS: Record<string, string> = {
  'white-tailed-deer': 'Test the wind',
  'gray-wolf': 'Test the wind',
  'african-elephant': 'Raise your trunk',
  'polar-bear': 'Sample the air',
  'poison-dart-frog': 'Press against the earth',
  'arctic-tern': 'Circle higher',
  'monarch-butterfly': 'Drift on the wind',
};

// ── Resource descriptions ────────────────────────────────────────────

function foodCue(food: number): string {
  if (food > 70) return 'Food is plentiful here.';
  if (food > 40) return 'Some forage available.';
  if (food > 15) return 'Slim pickings. The ground has been grazed hard.';
  return 'Almost nothing edible remains.';
}

function coverCue(cover: number): string {
  if (cover > 70) return 'You feel sheltered.';
  if (cover > 40) return 'Some cover, but gaps.';
  return 'Exposed. Nowhere to hide.';
}

// ── Main function ────────────────────────────────────────────────────

export function describeSurroundings(
  currentNode: MapNode,
  adjacentNodes: MapNode[],
  animal: AnimalState,
  config: SpeciesConfig,
  weather: WeatherState | null,
  worldMemory: WorldMemory,
  wisdom: number,
  rng: Rng,
  turn: number = 0,
): SensoryDescription {
  // Current location
  const locationPool = CURRENT_LOCATION[currentNode.type] ?? CURRENT_LOCATION.plain;
  const baseDesc = locationPool[rng.int(0, locationPool.length - 1)];

  const parts = [baseDesc];
  if (wisdom > 25) parts.push(foodCue(currentNode.resources.food));
  if (wisdom > 35) parts.push(coverCue(currentNode.resources.cover));

  // Weather overlay
  if (weather) {
    if (weather.type === 'rain' || weather.type === 'heavy_rain') {
      parts.push('Rain falls steadily.');
    } else if (weather.type === 'snow' || weather.type === 'blizzard') {
      parts.push('Snow covers everything. The cold is constant.');
    } else if (weather.type === 'heat_wave') {
      parts.push('The heat is oppressive. Your mouth is dry.');
    }
  }

  // Directions
  const directions: SensoryDirection[] = adjacentNodes.map(node => {
    const labelPool = DIRECTION_LABELS[node.type] ?? DIRECTION_LABELS.plain;
    const label = labelPool[rng.int(0, labelPool.length - 1)];

    const nodeMemory = worldMemory.nodeMemory[node.id];
    const danger = wisdom > 20 ? dangerCue(nodeMemory, wisdom) : undefined;
    const water = waterCue(node, worldMemory.waterKnowledge, animal.speciesId, animal.flags, turn);

    return {
      nodeId: node.id,
      sensoryLabel: label,
      effortLabel: effortLabel(node.movementCost, animal.energy),
      dangerCue: danger,
      waterCue: water,
    };
  });

  return {
    current: parts.join(' '),
    directions,
    sniffLabel: SNIFF_LABELS[animal.speciesId] ?? 'Test the wind',
  };
}
