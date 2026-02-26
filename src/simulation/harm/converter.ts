import type { HarmResult } from './types';
import type { Consequence, StatEffect } from '../../types/events';
import type { ConditionType } from '../anatomy/bodyState';
import { StatId } from '../../types/stats';

/**
 * Convert a HarmResult from the simulation harm resolver into legacy
 * Consequence[] and StatEffect[] that the existing game systems can process.
 *
 * This is the adapter layer that lets the new harm physics coexist with
 * the existing injury/health UI without changes.
 */
export function convertHarmToLegacy(result: HarmResult): {
  consequences: Consequence[];
  statEffects: StatEffect[];
} {
  const consequences: Consequence[] = [];
  const statEffects: StatEffect[] = [];

  // Convert damaged parts to legacy injury consequences
  for (const part of result.damagedParts) {
    if (!part.conditionProduced) continue;

    const legacyInjuryId = mapConditionToLegacyInjury(part.conditionProduced.type as ConditionType);
    if (legacyInjuryId) {
      consequences.push({
        type: 'add_injury',
        injuryId: legacyInjuryId,
        severity: part.conditionProduced.severity,
        bodyPart: part.bodyPartLabel,
      });
    }
  }

  // Convert pain to TRA stat effect
  if (result.painGenerated > 0) {
    const traAmount = Math.round(result.painGenerated * 0.4); // Scale 0-100 pain to 0-40 TRA
    if (traAmount > 0) {
      statEffects.push({
        stat: StatId.TRA,
        amount: traAmount,
        duration: Math.max(2, Math.round(result.painGenerated / 20)),
        label: '+TRA',
      });
    }
  }

  // Convert blood loss to HEA stat effect
  if (result.bloodLoss > 0) {
    const heaAmount = -Math.round(result.bloodLoss * 0.3); // Scale 0-100 bleed to 0-30 HEA loss
    if (heaAmount !== 0) {
      statEffects.push({
        stat: StatId.HEA,
        amount: heaAmount,
        duration: Math.max(3, Math.round(result.bloodLoss / 15)),
        label: '-HEA',
      });
    }
  }

  // Convert infection risk to IMM stat effect
  if (result.infectionRisk > 0.1) {
    const immAmount = Math.round(result.infectionRisk * 25); // Scale 0-1 risk to 0-25 IMM pressure
    if (immAmount > 0) {
      statEffects.push({
        stat: StatId.IMM,
        amount: immAmount,
        duration: Math.max(4, Math.round(result.infectionRisk * 10)),
        label: '+IMM',
      });
    }
  }

  // Convert capability impairment to stat effects
  for (const cap of result.capabilityImpairment) {
    if (cap.capabilityId === 'locomotion' && cap.impairmentDelta > 5) {
      statEffects.push({
        stat: StatId.STR,
        amount: Math.round(cap.impairmentDelta * 0.2),
        label: '+STR',
      });
    }
  }

  // Fatal result -> death consequence
  if (result.fatal) {
    consequences.push({
      type: 'death',
      cause: result.fatalReason ?? 'Fatal injuries',
    });
  }

  return { consequences, statEffects };
}

/**
 * Map a simulation ConditionType to the closest existing legacy injury ID.
 * Returns undefined if there's no good match (the condition exists only
 * in the new system).
 */
function mapConditionToLegacyInjury(conditionType: ConditionType): string | undefined {
  const mapping: Partial<Record<ConditionType, string>> = {
    fracture: 'leg-fracture',
    laceration: 'antler-wound', // closest match to a cut/tear
    contusion: 'antler-wound', // bruise, mapped to generic wound
    puncture: 'antler-wound',
    burn: 'antler-wound',
    frostbite: 'antler-wound',
    sprain: 'leg-fracture',
    dislocation: 'leg-fracture',
    hemorrhage: 'antler-wound',
  };

  return mapping[conditionType];
}
