import type { AnatomyIndex, BodyPart, TissueType, BodyZone } from '../anatomy/types';
import type { BodyState, ConditionType } from '../anatomy/bodyState';
import type { HarmEvent, HarmType, HarmResult, PartDamageResult, CapabilityImpairmentDelta } from './types';
import { recomputeCapabilities } from '../anatomy/capabilities';
import type { Rng } from '../../engine/RandomUtils';

/**
 * Resolve a HarmEvent against an anatomy, producing tissue damage, conditions,
 * capability impairment, and secondary effects (pain, blood loss, infection risk).
 *
 * This is the core simulation function: force → target → tissue damage → consequences.
 */
export function resolveHarm(
  harm: HarmEvent,
  anatomy: AnatomyIndex,
  bodyState: BodyState,
  rng: Rng,
): HarmResult {
  // 1. Select target body parts
  const targetParts = selectTargetParts(harm, anatomy, bodyState, rng);

  // 2. Apply damage to each target part
  const damagedParts: PartDamageResult[] = [];
  let totalPain = 0;
  let totalBloodLoss = 0;
  let maxInfectionRisk = 0;
  let fatal = false;
  let fatalReason: string | undefined;

  // Distribute force across target parts based on spread
  const forcePerPart = targetParts.length > 0
    ? harm.magnitude / (harm.spread > 0 ? targetParts.length : 1)
    : 0;

  for (const part of targetParts) {
    // Concentrated force: first part gets full magnitude, rest get reduced
    const partForce = harm.spread > 0
      ? forcePerPart
      : (part === targetParts[0] ? harm.magnitude : harm.magnitude * 0.2);

    const partResult = applyDamageToPart(part, partForce, harm.harmType, anatomy, bodyState, rng);
    if (partResult.tissueDamage.length > 0 || partResult.conditionProduced) {
      damagedParts.push(partResult);
    }

    // Accumulate secondary effects
    for (const td of partResult.tissueDamage) {
      const tissue = anatomy.tissueById.get(td.tissueId);
      if (!tissue) continue;
      totalPain += td.damageInflicted * tissue.painSensitivity;
      totalBloodLoss += td.damageInflicted * tissue.bleedRate;
      maxInfectionRisk = Math.max(maxInfectionRisk, tissue.infectionSusceptibility * (td.damageInflicted / 100));
    }

    // Check for fatal damage to vital parts
    if (part.vital && !fatal) {
      const partState = bodyState.parts[part.id];
      if (partState) {
        const maxDamage = Math.max(0, ...Object.values(partState.tissueDamage));
        if (maxDamage >= 90) {
          fatal = true;
          fatalReason = `Fatal damage to ${part.label}`;
        }
      }
    }
  }

  // 3. Recompute capabilities to get impairment deltas
  const capBefore = { ...bodyState.capabilities };
  const { capabilities: capAfter } = recomputeCapabilities(bodyState, anatomy);
  const capabilityImpairment: CapabilityImpairmentDelta[] = [];

  for (const [capId, newEff] of Object.entries(capAfter)) {
    const oldEff = capBefore[capId] ?? 100;
    const delta = oldEff - newEff;
    if (delta > 0) {
      const capDef = anatomy.capabilityById.get(capId);
      capabilityImpairment.push({
        capabilityId: capId,
        capabilityLabel: capDef?.label ?? capId,
        impairmentDelta: delta,
        newEffectiveness: newEff,
      });

      // Check survival-critical capability failure
      if (capDef?.survivalCritical && newEff <= 0 && !fatal) {
        fatal = true;
        fatalReason = capDef.deathCause ?? `Critical ${capDef.label} failure`;
      }
    }
  }

  // Update body state capabilities
  bodyState.capabilities = capAfter;

  // Normalize secondary effects to 0-100 scale
  const painGenerated = Math.min(100, totalPain);
  const bloodLoss = Math.min(100, totalBloodLoss);
  const infectionRisk = Math.min(1, maxInfectionRisk);

  return {
    harmEventId: harm.id,
    damagedParts,
    capabilityImpairment,
    painGenerated,
    bloodLoss,
    infectionRisk,
    fatal,
    fatalReason,
  };
}

// ── Internal helpers ──

/**
 * Select which body parts are hit by a harm event.
 * Uses zone-based targeting with target weight for probability.
 */
function selectTargetParts(
  harm: HarmEvent,
  anatomy: AnatomyIndex,
  bodyState: BodyState,
  rng: Rng,
): BodyPart[] {
  // Direct targeting: specific body part
  if (harm.targetPartId) {
    const part = anatomy.partById.get(harm.targetPartId);
    return part ? [part] : [];
  }

  // Zone-based targeting
  let candidates: BodyPart[];
  if (harm.targetZone === 'random') {
    candidates = anatomy.definition.bodyParts.filter(
      (p) => !bodyState.parts[p.id]?.destroyed,
    );
  } else {
    candidates = (anatomy.partsByZone.get(harm.targetZone as BodyZone) ?? []).filter(
      (p) => !bodyState.parts[p.id]?.destroyed,
    );
  }

  if (candidates.length === 0) return [];

  // How many parts to hit depends on spread
  const hitCount = harm.spread > 0.5
    ? Math.min(candidates.length, Math.ceil(candidates.length * harm.spread))
    : 1;

  // Weighted selection by targetWeight
  const selected: BodyPart[] = [];
  const remaining = [...candidates];

  for (let i = 0; i < hitCount && remaining.length > 0; i++) {
    const weights = remaining.map((p) => p.targetWeight);
    const idx = rng.weightedSelect(weights);
    selected.push(remaining[idx]);
    remaining.splice(idx, 1);
  }

  return selected;
}

/**
 * Apply damage to a single body part's tissues.
 * Compares force against each tissue's fracture threshold, considering existing damage.
 */
function applyDamageToPart(
  part: BodyPart,
  force: number,
  harmType: HarmType,
  anatomy: AnatomyIndex,
  bodyState: BodyState,
  rng: Rng,
): PartDamageResult {
  const partState = bodyState.parts[part.id];
  if (!partState) {
    return { bodyPartId: part.id, bodyPartLabel: part.label, tissueDamage: [] };
  }

  const tissueDamageResults: PartDamageResult['tissueDamage'] = [];
  let worstDamage = 0;
  let worstTissue: TissueType | undefined;

  for (const tissueId of part.tissues) {
    const tissue = anatomy.tissueById.get(tissueId);
    if (!tissue) continue;

    // Existing damage lowers the effective threshold (weakened tissue)
    const existingDamage = partState.tissueDamage[tissueId] ?? 0;
    const effectiveThreshold = tissue.fractureThreshold * (1 - existingDamage / 200);

    // Harm type affinity: sharp does more to skin/muscle, blunt does more to bone
    const typeMultiplier = getHarmTypeMultiplier(harmType, tissueId);

    // Effective force against this tissue
    const effectiveForce = force * typeMultiplier;

    // Damage is proportional to how much force exceeds the threshold
    if (effectiveForce > effectiveThreshold * 0.5) {
      // Some chance of damage even below threshold, guaranteed above
      const exceedRatio = effectiveForce / effectiveThreshold;
      const damageChance = Math.min(1, exceedRatio * 0.8);

      if (rng.chance(damageChance)) {
        const rawDamage = (effectiveForce - effectiveThreshold * 0.3) * 0.8;
        const damage = Math.max(1, Math.round(rawDamage));
        const newTotal = Math.min(100, existingDamage + damage);

        partState.tissueDamage[tissueId] = newTotal;

        tissueDamageResults.push({
          tissueId,
          tissueLabel: tissue.label,
          damageInflicted: damage,
          newTotal,
        });

        if (damage > worstDamage) {
          worstDamage = damage;
          worstTissue = tissue;
        }
      }
    }
  }

  // Determine if a body condition was produced
  let conditionProduced: PartDamageResult['conditionProduced'];
  if (worstDamage > 0 && worstTissue) {
    const conditionType = determineConditionType(harmType, worstTissue.id);
    const severity = determineSeverity(worstDamage);

    if (conditionType) {
      conditionProduced = { type: conditionType, severity };

      // Add to body state conditions
      bodyState.conditions.push({
        id: `${conditionType}-${part.id}-${Date.now()}`,
        type: conditionType,
        bodyPartId: part.id,
        severity,
        turnsActive: 0,
        healing: false,
        infectionLevel: 0,
      });
    }
  }

  return { bodyPartId: part.id, bodyPartLabel: part.label, tissueDamage: tissueDamageResults, conditionProduced };
}

/** Harm type multipliers: how effective each harm type is against each tissue */
function getHarmTypeMultiplier(harmType: HarmType, tissueId: string): number {
  const multipliers: Record<HarmType, Record<string, number>> = {
    blunt: { bone: 1.2, muscle: 0.8, skin: 0.6, tendon: 0.9, nerve: 0.5, organ: 1.0, cartilage: 1.0, 'eye-tissue': 0.8, antler: 1.3 },
    sharp: { bone: 0.5, muscle: 1.3, skin: 1.5, tendon: 1.2, nerve: 0.8, organ: 1.4, cartilage: 0.7, 'eye-tissue': 1.5, antler: 0.3 },
    'thermal-cold': { bone: 0.3, muscle: 0.5, skin: 1.2, tendon: 0.4, nerve: 0.8, organ: 0.3, cartilage: 0.3, 'eye-tissue': 0.6, antler: 0.1 },
    'thermal-heat': { bone: 0.2, muscle: 0.6, skin: 1.4, tendon: 0.5, nerve: 0.7, organ: 0.4, cartilage: 0.3, 'eye-tissue': 0.8, antler: 0.1 },
    chemical: { bone: 0.1, muscle: 0.4, skin: 1.0, tendon: 0.3, nerve: 0.6, organ: 1.5, cartilage: 0.2, 'eye-tissue': 1.3, antler: 0.0 },
    biological: { bone: 0.2, muscle: 0.5, skin: 0.8, tendon: 0.3, nerve: 0.8, organ: 1.2, cartilage: 0.2, 'eye-tissue': 0.5, antler: 0.0 },
  };

  return multipliers[harmType]?.[tissueId] ?? 1.0;
}

/** Map harm type + tissue to the type of condition produced */
function determineConditionType(harmType: HarmType, tissueId: string): ConditionType | undefined {
  if (tissueId === 'bone') {
    return harmType === 'blunt' ? 'fracture' : 'fracture';
  }
  if (tissueId === 'muscle' || tissueId === 'tendon') {
    return harmType === 'blunt' ? 'contusion' : 'laceration';
  }
  if (tissueId === 'skin') {
    if (harmType === 'sharp') return 'laceration';
    if (harmType === 'blunt') return 'contusion';
    if (harmType === 'thermal-cold') return 'frostbite';
    if (harmType === 'thermal-heat') return 'burn';
    return 'puncture';
  }
  if (tissueId === 'organ') {
    return harmType === 'sharp' ? 'puncture' : 'hemorrhage';
  }
  if (tissueId === 'nerve') {
    return 'contusion';
  }
  return undefined;
}

/** Map raw damage amount to a severity level (0-3) */
function determineSeverity(damage: number): number {
  if (damage >= 60) return 3; // critical
  if (damage >= 35) return 2; // severe
  if (damage >= 15) return 1; // moderate
  return 0; // minor
}
