import type { SimulationContext } from '../events/types';
import type { HarmEvent } from '../harm/types';
import type { FightParams, FightResult } from './types';
import { computeEffectiveValue } from '../../types/stats';
import { StatId } from '../../types/stats';

/**
 * Resolve a fight interaction between the player animal and an opponent.
 *
 * The fight resolver encapsulates physical combat dynamics. Instead of each
 * trigger computing its own win probability and damage, all fights flow
 * through this function, which considers:
 * - animal weight, health, and existing injuries
 * - locomotion capability (maneuverability)
 * - opponent strength, weight, and weapon type
 * - engagement type (charge favors mass, grapple favors endurance, strike favors speed)
 * - body condition (malnourished animals fight poorly)
 *
 * Returns win/loss, harm events, caloric cost, and dominance change.
 */
export function resolveFight(ctx: SimulationContext, params: FightParams): FightResult {
  const rng = ctx.rng;

  // ── Player combat stats ──
  const locomotion = ctx.animal.bodyState?.capabilities['locomotion'] ?? 100;
  const hea = computeEffectiveValue(ctx.animal.stats[StatId.HEA]);
  const weight = ctx.animal.weight;
  const bodyCondition = ctx.animal.physiologyState?.bodyConditionScore ?? 3;
  const injuryCount = ctx.animal.injuries.length;

  // Existing conditions that affect combat
  const bodyConditions = ctx.animal.bodyState?.conditions ?? [];
  const hasFracture = bodyConditions.some(c => c.type === 'fracture');
  const hasSevereInjury = bodyConditions.some(c => c.severity >= 2);

  // ── Combat power computation ──
  // Player's fighting power: base from weight/health, modified by capability and condition
  let playerPower = 0;

  // Weight advantage: heavier animals push harder
  const weightAdvantage = (weight - params.opponentWeight) * 0.15;

  // Health contributes to stamina and resilience
  const healthBonus = (hea - 50) * 0.2;

  // Locomotion = maneuverability in combat
  const maneuverBonus = (locomotion - 70) * 0.15;

  // Body condition: malnourished animals have less strength
  const conditionBonus = (bodyCondition - 3) * 5;

  // Injury penalties
  const injuryPenalty = injuryCount * 3 + (hasFracture ? 8 : 0) + (hasSevereInjury ? 5 : 0);

  playerPower = 50 + weightAdvantage + healthBonus + maneuverBonus + conditionBonus - injuryPenalty;

  // ── Engagement type modifiers ──
  // Charge: favors mass (weight matters more)
  // Grapple: favors endurance (health and body condition matter more)
  // Strike: favors speed (locomotion matters more)
  switch (params.engagementType) {
    case 'charge':
      playerPower += weightAdvantage * 0.5; // double weight effect
      break;
    case 'grapple':
      playerPower += healthBonus * 0.5 + conditionBonus * 0.5;
      break;
    case 'strike':
      playerPower += maneuverBonus * 0.8;
      break;
  }

  // Opponent power: simpler, based on configured strength
  const opponentPower = params.opponentStrength;

  // ── Win probability ──
  const powerDiff = playerPower - opponentPower;
  const winChance = Math.min(0.85, Math.max(0.05,
    0.5 + powerDiff * 0.008
  ));

  const won = rng.chance(winChance);

  // ── Harm resolution ──
  const harmToPlayer: HarmEvent[] = [];

  if (!won) {
    // Loser takes a full hit
    const magnitude = rng.int(params.opponentDamageRange[0], params.opponentDamageRange[1]);
    harmToPlayer.push({
      id: `fight-hit-${ctx.time.turn}`,
      sourceLabel: params.opponentStrikeLabel,
      magnitude,
      targetZone: params.opponentTargetZone,
      spread: params.engagementType === 'grapple' ? 0.4 : 0.2,
      harmType: params.opponentWeaponType,
    });
  } else if (params.mutual) {
    // In mutual combat (antler vs antler), even the winner may take damage
    if (rng.chance(0.35)) {
      const grazeMagnitude = rng.int(
        Math.round(params.opponentDamageRange[0] * 0.4),
        Math.round(params.opponentDamageRange[1] * 0.6),
      );
      harmToPlayer.push({
        id: `fight-graze-${ctx.time.turn}`,
        sourceLabel: `${params.opponentStrikeLabel} (glancing)`,
        magnitude: grazeMagnitude,
        targetZone: params.opponentTargetZone,
        spread: 0.3,
        harmType: params.opponentWeaponType,
      });
    }
  }

  // ── Lethal outcomes ──
  let deathCause: string | undefined;

  if (params.engagementType === 'grapple' && params.mutual) {
    // Antler lock: rare but lethal for both combatants
    if (rng.chance(0.015)) {
      deathCause = `Killed in combat — antlers locked with opponent, unable to break free`;
    }
  }

  if (!won && params.opponentWeaponType === 'sharp') {
    // Sharp weapons (predator claws/teeth) can be lethal
    const lethality = (params.opponentDamageRange[1] / 100) * 0.3;
    if (rng.chance(lethality)) {
      deathCause = `Killed by ${params.opponentStrikeLabel.replace(/ strike| attack| blow/g, '')}`;
    }
  }

  // ── Caloric cost ──
  // Fighting is very expensive: 8-25 kcal-units depending on engagement type
  const baseCost = params.engagementType === 'grapple' ? 20 : params.engagementType === 'charge' ? 12 : 8;
  const caloriesCost = Math.round(baseCost * (1 + (100 - locomotion) * 0.003));

  // ── Dominance change ──
  const dominanceChange = won ? 0.5 : -0.5;

  return {
    won,
    harmToPlayer,
    caloriesCost,
    dominanceChange,
    deathCause,
  };
}
