import type { NPC, NPCType } from '../types/npc';
import type { Rng } from './RandomUtils';
import { NPC_TEMPLATES } from '../data/npcs';

/**
 * Introduce a new NPC of a given type for a species.
 * Returns the new NPC or null if no template exists.
 */
export function introduceNPC(
  speciesId: string,
  type: NPCType,
  turn: number,
  existingNPCs: NPC[],
  rng: Rng,
): NPC | null {
  const templates = NPC_TEMPLATES[speciesId];
  if (!templates) return null;

  const template = templates.find((t) => t.type === type);
  if (!template) return null;

  // Avoid duplicate names
  const usedNames = new Set(existingNPCs.map((n) => n.name));
  const availableNames = template.namePool.filter((n) => !usedNames.has(n));
  if (availableNames.length === 0) return null;

  const name = rng.pick(availableNames);

  return {
    id: `npc-${type}-${turn}-${rng.int(1000, 9999)}`,
    name,
    type,
    speciesLabel: template.speciesLabel,
    relationship: type === 'predator' ? 'hostile' : type === 'rival' ? 'hostile' : 'neutral',
    alive: true,
    introducedOnTurn: turn,
    lastSeenTurn: turn,
  };
}

/**
 * Get an NPC by type (returns the first alive NPC of that type).
 */
export function getNPCByType(npcs: NPC[], type: NPCType): NPC | undefined {
  return npcs.find((n) => n.type === type && n.alive);
}
