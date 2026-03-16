import type { SimulationContext } from '../events/types';
import type { InstinctNudge } from './types';

/**
 * Compute the animal's instinct nudges for this turn.
 *
 * Pure function: takes simulation context, returns 0-3 active nudges.
 * Each nudge represents a primal urge, anxiety, or drive that the animal
 * is experiencing based on its physiological state, environment, and context.
 *
 * Nudges are advisory only — they describe what the animal "feels" but
 * do not auto-adjust behavioral settings. The player decides.
 */
export function computeInstincts(ctx: SimulationContext): InstinctNudge[] {
  const nudges: InstinctNudge[] = [];

  // ── Terrain exposure ──
  checkExposure(ctx, nudges);

  // ── Physiological state ──
  checkHunger(ctx, nudges);
  checkCold(ctx, nudges);
  checkImmune(ctx, nudges);

  // ── Injury impairment ──
  checkInjury(ctx, nudges);

  // ── Weather ──
  checkWeather(ctx, nudges);

  // ── Reproductive drive ──
  checkReproductive(ctx, nudges);

  // ── Social isolation ──
  checkSocial(ctx, nudges);

  // ── Predator scent / proximity ──
  checkPredatorProximity(ctx, nudges);

  // ── Unfamiliar territory ──
  checkTerritoryFamiliarity(ctx, nudges);

  // ── Dawn/dusk alertness ──
  checkCrepuscularAlertness(ctx, nudges);

  // ── Vision impairment anxiety ──
  checkVisionAnxiety(ctx, nudges);

  // ── Weight / body condition ──
  checkWeightCondition(ctx, nudges);

  // Sort by priority (high first), then take top 3
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  nudges.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return nudges.slice(0, 3);
}

// ── Individual nudge checks ──

function checkExposure(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const nodeType = ctx.currentNodeType;
  const cover = ctx.currentNodeResources?.cover ?? 50;

  // Open terrain anxiety
  if (nodeType === 'plain' || cover < 25) {
    nudges.push({
      id: 'exposed',
      label: 'Exposed',
      description: 'Open ground. No cover within a sprint. Your ears keep turning.',
      suggestedBehavior: 'caution',
      suggestedDirection: 'increase',
      priority: 'medium',
      source: 'terrain',
    });
  }

  // Mountain vertigo / unease
  if (nodeType === 'mountain') {
    const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
    if (locomotion < 70) {
      nudges.push({
        id: 'precarious',
        label: 'Precarious',
        description: 'Steep ground. Your injured leg slips on the rock. Bad footing here.',
        suggestedBehavior: 'exploration',
        suggestedDirection: 'decrease',
        priority: 'medium',
        source: 'terrain',
      });
    }
  }
}

function checkHunger(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const physio = ctx.animal.physiologyState;
  if (!physio) return;

  if (physio.bodyConditionScore <= 1) {
    nudges.push({
      id: 'starving',
      label: 'Starving',
      description: 'Your body is eating itself. The hollowness under your ribs overrides everything. You will walk into the open for food.',
      suggestedBehavior: 'foraging',
      suggestedDirection: 'increase',
      priority: 'high',
      source: 'physiology',
    });
  } else if (physio.bodyConditionScore <= 2 && physio.negativeEnergyBalance) {
    nudges.push({
      id: 'hunger-drive',
      label: 'Hunger Drive',
      description: 'Persistent ache below your ribs. Your attention keeps pulling toward food-smell. The open ground feels less dangerous than the hunger.',
      suggestedBehavior: 'foraging',
      suggestedDirection: 'increase',
      priority: 'medium',
      source: 'physiology',
    });
  }
}

function checkCold(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const physio = ctx.animal.physiologyState;
  if (!physio) return;

  if (physio.coreTemperatureDeviation < -4) {
    nudges.push({
      id: 'freezing',
      label: 'Freezing',
      description: 'Deep cold in your core. Your legs are numb. Moving burns what little you have left, but standing still the cold gets worse.',
      suggestedBehavior: 'exploration',
      suggestedDirection: 'decrease',
      priority: 'high',
      source: 'physiology',
    });
  } else if (physio.coreTemperatureDeviation < -2) {
    nudges.push({
      id: 'chilled',
      label: 'Chilled',
      description: 'Constant low shivering. It drains you. Somewhere out of the wind would help.',
      suggestedBehavior: 'caution',
      suggestedDirection: 'increase',
      priority: 'low',
      source: 'physiology',
    });
  }
}

function checkImmune(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const physio = ctx.animal.physiologyState;
  if (!physio) return;

  if (physio.immunocompromised) {
    nudges.push({
      id: 'sickly',
      label: 'Sickly',
      description: 'Your body feels heavy and wrong. Deep fatigue. Your legs want to fold. Everything says lie down.',
      suggestedBehavior: 'caution',
      suggestedDirection: 'increase',
      priority: 'medium',
      source: 'physiology',
    });
  }
}

function checkInjury(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;

  if (locomotion < 50) {
    nudges.push({
      id: 'crippled',
      label: 'Crippled',
      description: 'Your injured leg barely holds weight. Running is not possible. Stay near cover.',
      suggestedBehavior: 'caution',
      suggestedDirection: 'increase',
      priority: 'high',
      source: 'injury',
    });
  } else if (locomotion < 80) {
    nudges.push({
      id: 'limping',
      label: 'Limping',
      description: 'Your gait hitches. You favor the good side. At speed the bad leg will not keep up.',
      suggestedBehavior: 'exploration',
      suggestedDirection: 'decrease',
      priority: 'low',
      source: 'injury',
    });
  }
}

function checkWeather(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const weather = ctx.currentWeather;
  if (!weather) return;

  if (weather.type === 'blizzard') {
    nudges.push({
      id: 'storm-dread',
      label: 'Storm Dread',
      description: 'Wind and ice, constant. You cannot smell, cannot hear over it. Your body says find shelter and stop moving.',
      suggestedBehavior: 'exploration',
      suggestedDirection: 'decrease',
      priority: 'high',
      source: 'weather',
    });
  } else if (weather.type === 'heat_wave') {
    nudges.push({
      id: 'heat-lethargy',
      label: 'Heat Lethargy',
      description: 'Heat on your body, pressing. You pant. Your legs want shade and stillness.',
      suggestedBehavior: 'foraging',
      suggestedDirection: 'decrease',
      priority: 'low',
      source: 'weather',
    });
  }
}

function checkReproductive(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const season = ctx.time.season;
  const sex = ctx.animal.sex;

  // Rut fever for males in autumn
  if (sex === 'male' && season === 'autumn' && ctx.animal.age >= 18) {
    nudges.push({
      id: 'rut-fever',
      label: 'Rut Fever',
      description: 'Heat in your muscles, swelling in your neck. Doe-scent on the wind pulls you. The drive to move toward it overrides the drive to eat or rest.',
      suggestedBehavior: 'mating',
      suggestedDirection: 'increase',
      priority: 'medium',
      source: 'reproductive',
    });
  }

  // Nesting / fawn-rearing for females in spring/summer
  if (sex === 'female' && (season === 'spring' || season === 'summer')) {
    const hasFawns = ctx.animal.flags?.has?.('has-fawns');
    if (hasFawns) {
      nudges.push({
        id: 'maternal',
        label: 'Maternal',
        description: 'A pull back toward where you left them. The scent-memory of the small ones at the edge of your attention, constant.',
        suggestedBehavior: 'exploration',
        suggestedDirection: 'decrease',
        priority: 'medium',
        source: 'reproductive',
      });
    }
  }
}

function checkSocial(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  // Check if the animal is alone (no nearby herd)
  const hasAlly = ctx.npcs?.some((n) => n.type === 'ally' && n.alive);
  const hasMate = ctx.npcs?.some((n) => n.type === 'mate' && n.alive);

  if (!hasAlly && !hasMate && ctx.animal.sex === 'female') {
    // Doe herd instinct
    nudges.push({
      id: 'herd-anxiety',
      label: 'Herd Anxiety',
      description: 'Alone. No other ears scanning, no other noses testing the wind. Your alertness is higher without the others near.',
      suggestedBehavior: 'sociability',
      suggestedDirection: 'increase',
      priority: 'low',
      source: 'social',
    });
  }
}

function checkPredatorProximity(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  if (!ctx.npcs || !ctx.npcBehaviorStates) return;

  // Check if any predator NPC is nearby and hunting
  const nearbyHunter = ctx.npcs.some(npc => {
    if (!npc.alive || npc.type !== 'predator') return false;
    const behavior = ctx.npcBehaviorStates?.[npc.id];
    if (!behavior || behavior.intent !== 'hunting') return false;
    return npc.currentNodeId === ctx.currentNodeId;
  });

  if (nearbyHunter) {
    nudges.push({
      id: 'predator-scent',
      label: 'Predator Scent',
      description: 'Sharp musk on the wind. Fresh. Close. Every muscle locks. Your weight shifts to your hindquarters.',
      suggestedBehavior: 'caution',
      suggestedDirection: 'increase',
      priority: 'high',
      source: 'predator',
    });
  } else {
    // Check threat map for recent encounters in this area
    const nodeId = ctx.currentNodeId;
    if (nodeId && ctx.worldMemory?.nodeMemory[nodeId]) {
      const nodeMem = ctx.worldMemory.nodeMemory[nodeId];
      if (nodeMem.killCount > 0 && (ctx.time.turn - nodeMem.lastKillTurn) < 6) {
        nudges.push({
          id: 'death-scent',
          label: 'Death Scent',
          description: 'Old blood smell on the ground here. Something died recently. Your body wants to be somewhere else.',
          suggestedBehavior: 'exploration',
          suggestedDirection: 'increase',
          priority: 'medium',
          source: 'predator',
        });
      }
    }
  }
}

function checkTerritoryFamiliarity(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  if (!ctx.worldMemory?.nodeMemory || !ctx.currentNodeId) return;

  const nodeMem = ctx.worldMemory.nodeMemory[ctx.currentNodeId];
  // If the animal has spent very little time in this node, it's unfamiliar
  if (!nodeMem || nodeMem.turnsOccupied <= 1) {
    nudges.push({
      id: 'unfamiliar-ground',
      label: 'Unfamiliar Ground',
      description: 'No scent-marks you recognize. The paths are wrong. You do not know the escape routes here.',
      suggestedBehavior: 'caution',
      suggestedDirection: 'increase',
      priority: 'low',
      source: 'territory',
    });
  }
}

function checkCrepuscularAlertness(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const timeOfDay = ctx.time.timeOfDay;

  // Dawn and dusk are peak predator activity times
  if (timeOfDay === 'dusk' || timeOfDay === 'dawn') {
    // Only trigger if there are predators in the ecosystem
    const hasPredators = ctx.ecosystem && Object.entries(ctx.ecosystem.populations).some(
      ([key, pop]) => (key.includes('Wolf') || key.includes('Cougar') || key.includes('Coyote')) && pop.level > -2,
    );

    if (hasPredators) {
      nudges.push({
        id: 'twilight-alert',
        label: 'Twilight Alert',
        description: timeOfDay === 'dusk'
          ? 'Light fading. The scent-thermals are shifting and your nose is less reliable. Your ears rotate faster.'
          : 'First light. The wind has not settled yet. Scent-reading is difficult. Your ears work harder.',
        suggestedBehavior: 'caution',
        suggestedDirection: 'increase',
        priority: 'low',
        source: 'circadian',
      });
    }
  }
}

function checkVisionAnxiety(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const vision = ctx.animal.bodyState?.capabilities['vision'] ?? 100;

  if (vision < 40) {
    nudges.push({
      id: 'blind-terror',
      label: 'Blind Terror',
      description: 'Shapes without edges. Movement you cannot resolve. Every sound is louder because your eyes give you almost nothing.',
      suggestedBehavior: 'caution',
      suggestedDirection: 'increase',
      priority: 'high',
      source: 'injury',
    });
  }
}

function checkWeightCondition(ctx: SimulationContext, nudges: InstinctNudge[]): void {
  const config = ctx.config;
  const weight = ctx.animal.weight;

  // Skip if the physiology engine already handles hunger nudges
  if (ctx.animal.physiologyState) return;

  const { starvationDeath, starvationDebuff, maximumBiologicalWeight } = config.weight;

  if (weight <= starvationDebuff) {
    // Critically underweight — visceral hunger
    const severity = weight <= starvationDeath * 1.2 ? 'high' : 'medium';
    nudges.push({
      id: 'body-wasting',
      label: severity === 'high' ? 'Wasting' : 'Hungry',
      description: severity === 'high'
        ? 'Your ribs press against your skin. Each step costs more. The emptiness is not hunger anymore. Your body is taking itself apart.'
        : 'Hollow ache below your ribs. Your body feels lighter than it should. Food-smell pulls your attention away from everything else.',
      suggestedBehavior: 'foraging',
      suggestedDirection: 'increase',
      priority: severity,
      source: 'physiology',
    });
  } else if (weight >= maximumBiologicalWeight * 0.9) {
    // Well-fed / peak condition
    nudges.push({
      id: 'well-fed',
      label: 'Sated',
      description: 'Your body feels solid. The urgency to eat has faded. You can afford to be careful.',
      suggestedBehavior: 'foraging',
      suggestedDirection: 'decrease',
      priority: 'low',
      source: 'physiology',
    });
  }
}
