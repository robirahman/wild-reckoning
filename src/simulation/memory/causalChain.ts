import type { EventMemoryEntry, WorldMemory } from './types';
import type { ConditionProgression } from '../conditions/types';

/**
 * Causal Chain System
 *
 * Connects events to their downstream consequences so the debriefing
 * can show how a wolf bite led to infection → fever → starvation.
 */

/** A single link in a causal chain */
export interface CausalLink {
  /** Turn this link was established */
  turn: number;
  /** What caused this link (trigger ID, condition phase, physiology state) */
  causeType: 'event' | 'condition_progression' | 'physiology' | 'starvation' | 'hypothermia';
  /** ID of the causing event/trigger */
  causeId: string;
  /** Human-readable description of the cause */
  causeLabel: string;
  /** What resulted (injury, infection phase, stat change, death) */
  effectType: 'injury' | 'infection' | 'fever' | 'sepsis' | 'weight_loss' | 'stat_decline' | 'death';
  /** Human-readable description of the effect */
  effectLabel: string;
  /** Body part involved, if applicable */
  bodyPartId?: string;
  /** Condition ID, if this link involves a condition progression */
  conditionId?: string;
}

/** A complete causal chain from initial event to final outcome */
export interface CausalChain {
  /** Unique ID for this chain */
  id: string;
  /** The root event that started this chain */
  rootEventTurn: number;
  rootEventId: string;
  rootEventLabel: string;
  /** Ordered sequence of cause → effect links */
  links: CausalLink[];
  /** Whether this chain ended in death */
  fatal: boolean;
  /** Summary narrative for the debriefing */
  summary: string;
}

/**
 * Build causal chains from world memory and condition progression state.
 *
 * Traces backward from the current state to find connected sequences:
 * - Events that caused injuries (harm events)
 * - Injuries that became infected (condition phase transitions)
 * - Infections that caused fever (fever level > 0)
 * - Fever/infection that led to sepsis
 * - Starvation cascades (weight loss from compounding factors)
 *
 * Returns chains sorted by severity (fatal chains first).
 */
export function buildCausalChains(
  memory: WorldMemory,
  conditionProgressions: Record<string, ConditionProgression>,
  deathCause?: string,
): CausalChain[] {
  const chains: CausalChain[] = [];

  // Find harm-producing events and trace their consequences
  const harmEvents = memory.recentEvents.filter(e => e.harmful);

  for (const event of harmEvents) {
    const chain = traceChainFromEvent(event, memory, conditionProgressions);
    if (chain.links.length > 0) {
      chains.push(chain);
    }
  }

  // If the animal died, find or create the chain that ends in death
  if (deathCause) {
    const deathChain = findOrCreateDeathChain(chains, memory, conditionProgressions, deathCause);
    if (deathChain) {
      // Move to front if not already there
      const idx = chains.indexOf(deathChain);
      if (idx > 0) {
        chains.splice(idx, 1);
        chains.unshift(deathChain);
      } else if (idx === -1) {
        chains.unshift(deathChain);
      }
    }
  }

  return chains;
}

/**
 * Trace a causal chain forward from a harmful event.
 */
function traceChainFromEvent(
  event: EventMemoryEntry,
  memory: WorldMemory,
  conditionProgressions: Record<string, ConditionProgression>,
): CausalChain {
  const links: CausalLink[] = [];
  const chainId = `chain-${event.turn}-${event.triggerId}`;

  // Link 1: The initial event caused harm
  links.push({
    turn: event.turn,
    causeType: 'event',
    causeId: event.triggerId,
    causeLabel: formatTriggerLabel(event.triggerId),
    effectType: 'injury',
    effectLabel: `Injury from ${formatTriggerLabel(event.triggerId)}`,
  });

  // Check if any condition progressions were sourced from this event's turn
  for (const [condId, prog] of Object.entries(conditionProgressions)) {
    if (prog.acquiredTurn !== event.turn) continue;

    // Trace the condition through its phases
    if (prog.phase === 'infected' || prog.phase === 'septic' || prog.phase === 'recovering' || prog.phase === 'chronic') {
      links.push({
        turn: prog.acquiredTurn + 3, // approximate: inflammatory → infected transition
        causeType: 'condition_progression',
        causeId: condId,
        causeLabel: 'Wound became infected',
        effectType: 'infection',
        effectLabel: `Infection in ${condId}`,
        conditionId: condId,
      });
    }

    if (prog.feverLevel > 0) {
      links.push({
        turn: prog.acquiredTurn + 5, // approximate
        causeType: 'condition_progression',
        causeId: condId,
        causeLabel: 'Infection caused fever',
        effectType: 'fever',
        effectLabel: `Fever (${prog.feverLevel.toFixed(1)}°)`,
        conditionId: condId,
      });
    }

    if (prog.phase === 'septic') {
      links.push({
        turn: prog.acquiredTurn + 7, // approximate
        causeType: 'condition_progression',
        causeId: condId,
        causeLabel: 'Infection spread to blood',
        effectType: 'sepsis',
        effectLabel: 'Systemic infection (sepsis)',
        conditionId: condId,
      });
    }
  }

  const fatal = links.some(l => l.effectType === 'death');

  return {
    id: chainId,
    rootEventTurn: event.turn,
    rootEventId: event.triggerId,
    rootEventLabel: formatTriggerLabel(event.triggerId),
    links,
    fatal,
    summary: buildChainSummary(links, event),
  };
}

/**
 * Find the chain that led to death, or create one if no existing chain connects.
 */
function findOrCreateDeathChain(
  chains: CausalChain[],
  memory: WorldMemory,
  _conditionProgressions: Record<string, ConditionProgression>,
  deathCause: string,
): CausalChain | undefined {
  // Check if any existing chain has a sepsis or infection link → death
  if (deathCause === 'Sepsis') {
    const sepsisChain = chains.find(c => c.links.some(l => l.effectType === 'sepsis'));
    if (sepsisChain) {
      sepsisChain.links.push({
        turn: memory.recentEvents[0]?.turn ?? 0,
        causeType: 'condition_progression',
        causeId: 'sepsis-death',
        causeLabel: 'Sepsis overwhelmed immune system',
        effectType: 'death',
        effectLabel: 'Death from sepsis',
      });
      sepsisChain.fatal = true;
      sepsisChain.summary = buildChainSummary(sepsisChain.links, undefined);
      return sepsisChain;
    }
  }

  if (deathCause === 'Starvation') {
    // Find the chain with the most weight-loss factors
    const harmChain = chains.find(c => c.links.some(l =>
      l.effectType === 'fever' || l.effectType === 'infection',
    ));
    if (harmChain) {
      harmChain.links.push({
        turn: memory.recentEvents[0]?.turn ?? 0,
        causeType: 'starvation',
        causeId: 'starvation-death',
        causeLabel: 'Compounding factors led to starvation',
        effectType: 'death',
        effectLabel: 'Death from starvation',
      });
      harmChain.fatal = true;
      harmChain.summary = buildChainSummary(harmChain.links, undefined);
      return harmChain;
    }
  }

  // Generic death chain
  const currentTurn = memory.recentEvents[0]?.turn ?? 0;
  return {
    id: `chain-death-${currentTurn}`,
    rootEventTurn: currentTurn,
    rootEventId: 'unknown',
    rootEventLabel: deathCause,
    links: [{
      turn: currentTurn,
      causeType: 'event',
      causeId: deathCause.toLowerCase().replace(/\s+/g, '-'),
      causeLabel: deathCause,
      effectType: 'death',
      effectLabel: `Death from ${deathCause.toLowerCase()}`,
    }],
    fatal: true,
    summary: `Died from ${deathCause.toLowerCase()}.`,
  };
}

/**
 * Build a human-readable summary from a chain of links.
 */
function buildChainSummary(links: CausalLink[], rootEvent?: EventMemoryEntry): string {
  if (links.length === 0) return '';

  const parts: string[] = [];

  if (rootEvent) {
    parts.push(`Turn ${rootEvent.turn}: ${formatTriggerLabel(rootEvent.triggerId)}`);
  }

  for (const link of links) {
    if (link.effectType === 'injury') continue; // Already described by root
    parts.push(`Turn ${link.turn}: ${link.effectLabel}`);
  }

  return parts.join(' → ');
}

/**
 * Convert a trigger ID like 'sim-wolf-pack' to a human-readable label.
 */
function formatTriggerLabel(triggerId: string): string {
  return triggerId
    .replace(/^sim-/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}
