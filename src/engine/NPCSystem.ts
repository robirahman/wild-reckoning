import type { NPC, NPCType, NPCRelationship } from '../types/npc';
import type { Rng } from './RandomUtils';
import { NPC_TEMPLATES } from '../data/npcs';

const RELATIONSHIP_THRESHOLDS: Record<NPCType, { friendly: number; bonded: number }> = {
  rival: { friendly: 8, bonded: 15 },
  ally: { friendly: 3, bonded: 8 },
  mate: { friendly: 2, bonded: 5 },
  predator: { friendly: Infinity, bonded: Infinity },
  offspring: { friendly: 1, bonded: 3 },
};

/**
 * Progress NPC relationships based on encounter counts.
 * Returns updated NPC array (only changed if any relationship shifted).
 */
export function progressRelationship(npcs: NPC[]): NPC[] {
  let changed = false;
  const result = npcs.map((npc) => {
    if (!npc.alive) return npc;
    const thresholds = RELATIONSHIP_THRESHOLDS[npc.type];

    let newRel: NPCRelationship = npc.relationship;
    if (npc.encounters >= thresholds.bonded && npc.relationship !== 'bonded') {
      newRel = 'bonded';
    } else if (npc.encounters >= thresholds.friendly && (npc.relationship === 'neutral' || npc.relationship === 'hostile')) {
      // Rival special: hostile -> neutral at 5 encounters (grudging respect)
      if (npc.type === 'rival' && npc.relationship === 'hostile' && npc.encounters >= 5) {
        newRel = 'neutral';
      } else if (npc.relationship === 'neutral') {
        newRel = 'friendly';
      }
    }

    if (newRel !== npc.relationship) {
      changed = true;
      return { ...npc, relationship: newRel };
    }
    return npc;
  });
  return changed ? result : npcs;
}

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
    encounters: 0,
  };
}

/**
 * Get an NPC by type (returns the first alive NPC of that type).
 */
export function getNPCByType(npcs: NPC[], type: NPCType): NPC | undefined {
  return npcs.find((n) => n.type === type && n.alive);
}

/**
 * Increment the encounter count for an NPC by ID.
 * Returns the updated NPC array.
 */
export function incrementEncounter(npcs: NPC[], npcId: string, turn: number): NPC[] {
  return npcs.map((n) => {
    if (n.id === npcId) {
      return { ...n, encounters: n.encounters + 1, lastSeenTurn: turn };
    }
    return n;
  });
}
