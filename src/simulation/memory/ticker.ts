import type { ResolvedEvent } from '../../types/events';
import type {
  WorldMemory,
  EventMemoryEntry,
  ThreatAssessment,
} from './types';
import {
  MAX_RECENT_EVENTS,
  THREAT_WINDOW_TURNS,
  SCENT_FADE_TURNS,
  createSeasonalTotals,
  createNodeMemory,
} from './types';

// ── Predator/threat tag sets for classification ──

const PREDATOR_TAGS = new Set(['predator', 'danger', 'human']);
const FORAGING_TAGS = new Set(['foraging', 'food']);

/**
 * Classify whether an event outcome was harmful based on its consequences.
 * An event is harmful if it includes injury, death roll, significant stat damage,
 * or harm events.
 */
function classifyHarmful(event: ResolvedEvent): boolean {
  const def = event.definition;
  const consequences = def.consequences ?? [];

  // Check for death, injury, or harm consequences
  for (const c of consequences) {
    if (c.type === 'death' || c.type === 'add_injury' || c.type === 'apply_harm') return true;
  }

  // Check if the player's choice had dangerous consequences
  if (event.choiceMade && def.choices) {
    const choice = def.choices.find(ch => ch.id === event.choiceMade);
    if (choice) {
      if (choice.deathChance) return true;
      for (const c of choice.consequences) {
        if (c.type === 'death' || c.type === 'add_injury' || c.type === 'apply_harm') return true;
      }
    }
  }

  return false;
}

/**
 * Classify whether the player survived/escaped a predator event.
 */
function classifyEscaped(event: ResolvedEvent): boolean | undefined {
  const tags = event.definition.tags;
  if (!tags.some(t => PREDATOR_TAGS.has(t))) return undefined;

  // If the event had a death consequence but the animal is still being processed,
  // we mark it as "not escaped" — the store will handle actual death separately.
  const consequences = event.definition.consequences ?? [];
  const choiceMade = event.choiceMade;
  if (choiceMade && event.definition.choices) {
    const choice = event.definition.choices.find(ch => ch.id === choiceMade);
    if (choice) {
      for (const c of choice.consequences) {
        if (c.type === 'death') return false;
      }
    }
  }
  for (const c of consequences) {
    if (c.type === 'death') return false;
  }

  return true; // survived predator event
}

/**
 * Determine the threat source from an event (for threat map tracking).
 * Returns undefined if the event doesn't represent a classifiable threat.
 */
function getThreatSource(event: ResolvedEvent): string | undefined {
  const id = event.definition.id;

  // Simulation triggers use predictable naming
  if (id.includes('wolf')) return 'Gray Wolf';
  if (id.includes('coyote')) return 'Coyote';
  if (id.includes('cougar')) return 'Cougar';
  if (id.includes('hunting') || id.includes('hunter')) return 'Human Hunter';
  if (id.includes('vehicle')) return 'Vehicle';
  if (id.includes('fire')) return 'Wildfire';
  if (id.includes('flood')) return 'Flooding';
  if (id.includes('blizzard')) return 'Blizzard';

  // Fall back to category for unrecognized events
  if (event.definition.category === 'predator') return 'Unknown Predator';
  if (event.definition.category === 'environmental') return 'Environmental Hazard';

  return undefined;
}

/**
 * Compute a severity score (0-100) for an event outcome.
 * Higher = more dangerous / impactful.
 */
function computeSeverity(event: ResolvedEvent): number {
  let severity = 0;
  const consequences = getAllConsequences(event);

  for (const c of consequences) {
    if (c.type === 'death') severity = 100;
    if (c.type === 'apply_harm') severity = Math.max(severity, 50 + (c.harm.magnitude ?? 0) * 0.3);
    if (c.type === 'add_injury') severity = Math.max(severity, 30 + (c.severity ?? 0) * 15);
    if (c.type === 'add_parasite') severity = Math.max(severity, 20);
  }

  // Death chance on choices
  if (event.choiceMade && event.definition.choices) {
    const choice = event.definition.choices.find(ch => ch.id === event.choiceMade);
    if (choice?.deathChance) {
      severity = Math.max(severity, choice.deathChance.probability * 100);
    }
  }

  return Math.min(100, severity);
}

/**
 * Get all consequences from an event, including the chosen choice's consequences.
 */
function getAllConsequences(event: ResolvedEvent) {
  const consequences = [...(event.definition.consequences ?? [])];

  if (event.choiceMade && event.definition.choices) {
    const choice = event.definition.choices.find(ch => ch.id === event.choiceMade);
    if (choice) consequences.push(...choice.consequences);
  }

  for (const sub of event.triggeredSubEvents) {
    consequences.push(...sub.consequences);
  }

  return consequences;
}

// ── Main ticker ──

/**
 * Update WorldMemory based on the events that occurred last turn.
 * Pure function: returns a new WorldMemory object.
 *
 * Called at the start of each turn with the previous turn's resolved events.
 */
export function tickWorldMemory(
  memory: WorldMemory,
  lastTurnEvents: ResolvedEvent[],
  currentTurn: number,
  currentNodeId: string | undefined,
  currentSeason: string,
): WorldMemory {
  // Clone to avoid mutation
  const recentEvents = [...memory.recentEvents];
  const nodeMemory = { ...memory.nodeMemory };
  const threatMap = { ...memory.threatMap };
  let seasonalTotals = memory.seasonalTotals;

  // Reset seasonal totals on season change
  if (seasonalTotals.season !== currentSeason) {
    seasonalTotals = createSeasonalTotals(currentSeason);
  } else {
    seasonalTotals = { ...seasonalTotals, nodesVisited: new Set(seasonalTotals.nodesVisited) };
  }

  // ── Process each event from last turn ──

  for (const event of lastTurnEvents) {
    const harmful = classifyHarmful(event);
    const escaped = classifyEscaped(event);
    const tags = event.definition.tags;

    // 1. Add to recent events ring buffer
    const entry: EventMemoryEntry = {
      turn: currentTurn - 1,
      triggerId: event.definition.id,
      category: event.definition.category,
      choiceId: event.choiceMade,
      harmful,
      escaped,
      nodeId: currentNodeId,
      tags,
    };
    recentEvents.unshift(entry);

    // 2. Update node memory
    if (currentNodeId) {
      const node = nodeMemory[currentNodeId] ?? createNodeMemory();

      if (harmful && tags.some(t => PREDATOR_TAGS.has(t))) {
        node.killCount++;
        node.lastKillTurn = currentTurn - 1;
        node.perceivedDanger = Math.min(100, node.perceivedDanger + 20);
      }

      if (tags.some(t => FORAGING_TAGS.has(t))) {
        node.foragingPressure += 5;
      }

      nodeMemory[currentNodeId] = node;
    }

    // 3. Update threat map
    const source = getThreatSource(event);
    if (source) {
      const existing: ThreatAssessment = threatMap[source] ?? {
        source,
        recentEncounters: 0,
        lastEncounterTurn: 0,
        averageSeverity: 0,
        hasBeenEncountered: false,
      };

      const severity = computeSeverity(event);
      const newCount = existing.recentEncounters + 1;

      threatMap[source] = {
        ...existing,
        recentEncounters: newCount,
        lastEncounterTurn: currentTurn - 1,
        averageSeverity: (existing.averageSeverity * existing.recentEncounters + severity) / newCount,
        hasBeenEncountered: true,
      };
    }

    // 4. Update seasonal totals
    if (tags.some(t => FORAGING_TAGS.has(t))) {
      seasonalTotals.foragingEvents++;
      // Check if positive outcome (no harmful consequences from foraging)
      if (!harmful) seasonalTotals.foragingSuccesses++;
    }
    if (tags.some(t => PREDATOR_TAGS.has(t))) {
      seasonalTotals.predatorEncounters++;
      if (escaped) seasonalTotals.predatorEscapes++;
    }
    if (harmful) seasonalTotals.harmEventsReceived++;

    // Track calorie changes from consequences
    const allConsequences = getAllConsequences(event);
    for (const c of allConsequences) {
      if (c.type === 'add_calories') {
        if (c.amount > 0) seasonalTotals.caloriesGained += c.amount;
        else seasonalTotals.caloriesLost += Math.abs(c.amount);
      }
    }
  }

  // ── Per-turn maintenance ──

  // Trim ring buffer
  while (recentEvents.length > MAX_RECENT_EVENTS) {
    recentEvents.pop();
  }

  // Track current node visit
  if (currentNodeId) {
    const node = nodeMemory[currentNodeId] ?? createNodeMemory();
    node.turnsOccupied++;
    nodeMemory[currentNodeId] = node;
    seasonalTotals.nodesVisited.add(currentNodeId);
  }

  // Decay node-level state
  for (const nodeId of Object.keys(nodeMemory)) {
    const node = { ...nodeMemory[nodeId] };

    // Forage pressure decays slowly (regrowth)
    node.foragingPressure = Math.max(0, node.foragingPressure - 1);

    // Perceived danger decays toward baseline
    node.perceivedDanger = Math.max(0, node.perceivedDanger - 2);

    // Scent marks fade
    node.scentMarks = node.scentMarks.filter(
      mark => (currentTurn - mark.turn) < SCENT_FADE_TURNS,
    );

    nodeMemory[nodeId] = node;
  }

  // Decay threat assessments: drop encounters outside the window
  for (const source of Object.keys(threatMap)) {
    const threat = { ...threatMap[source] };
    const turnsAgo = currentTurn - threat.lastEncounterTurn;

    if (turnsAgo > THREAT_WINDOW_TURNS) {
      // Gradually reduce encounter count for stale threats
      threat.recentEncounters = Math.max(0, threat.recentEncounters - 1);
      if (threat.recentEncounters === 0) {
        delete threatMap[source];
        continue;
      }
    }

    threatMap[source] = threat;
  }

  return {
    recentEvents,
    nodeMemory,
    threatMap,
    seasonalTotals,
  };
}
