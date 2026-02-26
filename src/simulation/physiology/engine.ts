import type { PhysiologyState, PhysiologyTickInput, PhysiologyTickResult } from './types';
import type { StatModifier } from '../../types/stats';
import { StatId, computeEffectiveValue } from '../../types/stats';
import {
  computeForageQuality,
  getAmbientTemperature,
  computeAverageSkinDamage,
  computeBodyCondition,
} from './helpers';

/**
 * Core physiology tick. Runs once per turn for simulation-mode species.
 *
 * Computes caloric balance (intake vs expenditure), derives weight change,
 * thermal state, immune state, and produces stat modifiers. Pure function.
 */
export function tickPhysiologyEngine(input: PhysiologyTickInput): PhysiologyTickResult {
  const {
    animal, time, weather, config, metabolismConfig: mc,
    behavior, regionDef, currentNodeType, currentNodeResources,
    isPregnant, isLactating, ffMult,
  } = input;

  // Clone current state (caller will write back)
  const physio: PhysiologyState = { ...animal.physiologyState! };
  const modifiers: StatModifier[] = [];
  const narratives: string[] = [];
  let deathCause: string | undefined;

  // ═══════════════════════════════════════════
  //  STEP 1: CALORIC INTAKE
  // ═══════════════════════════════════════════

  // Base forage quality from region flora + season + node
  const forageQuality = computeForageQuality(regionDef, time, currentNodeType, currentNodeResources);

  // Digestive capability from anatomy (0-100). Gut injury → less caloric extraction.
  const digestiveCapability = animal.bodyState?.capabilities['digestion'] ?? 100;

  // Locomotion capability affects ability to reach food
  const locomotionCapability = animal.bodyState?.capabilities['locomotion'] ?? 100;

  // Foraging effort: behavioral setting ± locomotion impairment
  // At foraging=3 (neutral): effort = 1.0. At foraging=5: effort = 1.30. At foraging=1: effort = 0.70.
  const foragingEffort = Math.max(0.1,
    (1 + (behavior.foraging - 3) * mc.foragingBehaviorMultiplier)
    * (locomotionCapability / 100)
  );

  // Caloric intake from baseline foraging
  const baseIntake = mc.baseForagingRate * forageQuality * foragingEffort * (digestiveCapability / 100);

  // Add bonus calories from events (add_calories consequences accumulate here)
  const eventCalories = physio.caloricIntakeThisTurn;
  const totalIntake = (baseIntake + eventCalories) * ffMult;

  // Reset event intake for next turn
  physio.caloricIntakeThisTurn = 0;

  // ═══════════════════════════════════════════
  //  STEP 2: CALORIC EXPENDITURE
  // ═══════════════════════════════════════════

  // 2a. Basal metabolic rate, scaled by body mass (Kleiber's law)
  const massRatio = Math.max(0.3, animal.weight / mc.referenceWeight);
  const bmr = mc.basalMetabolicRate * Math.pow(massRatio, mc.metabolicScalingExponent);

  // 2b. Activity cost: foraging effort, movement, fleeing
  // ~25% of BMR at neutral activity; scales with foraging intensity
  const activityCost = bmr * 0.25 * foragingEffort;

  // 2c. Thermoregulation cost
  const ambientTemp = getAmbientTemperature(regionDef, time, weather);
  let thermoCost = 0;

  if (ambientTemp < mc.lowerCriticalTemp) {
    const deficit = mc.lowerCriticalTemp - ambientTemp;

    // Skin damage increases heat loss (damaged fur = less insulation)
    const skinDamage = computeAverageSkinDamage(animal.bodyState);
    const insulationPenalty = 1 + skinDamage * mc.insulationLossPerDamagePoint;

    // Node cover reduces exposure (50% cover ≈ 25% reduction)
    const coverReduction = currentNodeResources
      ? 1 - (currentNodeResources.cover / 200)
      : 1;

    thermoCost = deficit * mc.coldCostPerDegree * insulationPenalty * coverReduction;

    // Wind chill amplification (only when weather reports high wind)
    if (weather && weather.windSpeed > 20) {
      thermoCost *= 1 + (weather.windSpeed - 20) / 100;
    }
  } else if (ambientTemp > mc.upperCriticalTemp) {
    // Heat stress: less severe than cold for deer but still costly
    thermoCost = (ambientTemp - mc.upperCriticalTemp) * mc.coldCostPerDegree * 0.4;
  }
  physio.thermoregulationCost = thermoCost;

  // 2d. Immune response caloric cost
  const immuneCost = physio.immuneLoad * mc.immuneMetabolicCost;

  // 2e. Reproduction costs
  let reproCost = 0;
  if (isPregnant) reproCost += mc.gestationCost;
  if (isLactating) reproCost += mc.lactationCost;

  // 2f. Growth cost for young animals
  const agePhase = config.agePhases.find(p =>
    animal.age >= p.minAge && (p.maxAge === undefined || animal.age < p.maxAge)
  );
  const growthCost = (agePhase?.id === 'fawn' || agePhase?.id === 'yearling')
    ? bmr * 0.15 // 15% of BMR goes to skeletal/muscle growth
    : 0;

  const totalExpenditure = (bmr + activityCost + thermoCost + immuneCost + reproCost + growthCost) * ffMult;

  // ═══════════════════════════════════════════
  //  STEP 3: ENERGY BALANCE → WEIGHT CHANGE
  // ═══════════════════════════════════════════

  const caloricBalance = totalIntake - totalExpenditure;

  // Smoothed running average (exponential moving average, τ = 4 turns)
  physio.avgCaloricBalance = physio.avgCaloricBalance * 0.75 + (caloricBalance / ffMult) * 0.25;
  physio.negativeEnergyBalance = caloricBalance < 0;

  let weightChange: number;
  if (caloricBalance >= 0) {
    // Surplus → weight gain, capped by fat deposition rate
    weightChange = Math.min(
      mc.maxFatDeposition * ffMult,
      caloricBalance / mc.caloricDensityPerLb
    );
    // Asymptotic growth: harder to gain weight near maximum
    const growthSaturation = Math.pow(animal.weight / config.weight.maximumBiologicalWeight, 2);
    weightChange *= Math.max(0, 1 - growthSaturation);
  } else {
    // Deficit → weight loss, capped by fat mobilization rate
    weightChange = -Math.min(
      mc.maxFatMobilization * ffMult,
      Math.abs(caloricBalance) / mc.caloricDensityPerLb
    );
  }

  physio.caloricReserve = Math.max(0, physio.caloricReserve + caloricBalance);

  // ═══════════════════════════════════════════
  //  STEP 4: THERMOREGULATION STATE
  // ═══════════════════════════════════════════

  if (ambientTemp < mc.lowerCriticalTemp && thermoCost > bmr * 0.5) {
    // Cold exceeds what metabolism can comfortably compensate → core temp drifts down
    const excessCold = (thermoCost - bmr * 0.5) / bmr;
    physio.coreTemperatureDeviation -= excessCold * 0.5 * ffMult;
  } else {
    // Recovery toward normal (exponential decay)
    physio.coreTemperatureDeviation *= Math.pow(0.7, ffMult);
  }

  // Hypothermia death threshold
  if (physio.coreTemperatureDeviation < -8) {
    deathCause = 'Hypothermia';
    narratives.push('Your body has lost its battle against the cold.');
  }

  // Hyperthermia (less common for deer but possible)
  if (physio.coreTemperatureDeviation > 6) {
    deathCause = 'Heat stroke';
    narratives.push('The heat has become unbearable. Your body can no longer cool itself.');
  }

  // ═══════════════════════════════════════════
  //  STEP 5: IMMUNE SYSTEM
  // ═══════════════════════════════════════════

  const bodyCondition = computeBodyCondition(animal.weight + weightChange, config);
  physio.bodyConditionScore = bodyCondition;

  // Immune capacity: starts at baseline, reduced by malnutrition, stress, age
  let capacity = mc.baseImmuneCapacity;
  if (bodyCondition < 2) {
    capacity -= mc.malnutritionImmunePenalty * (2 - bodyCondition);
  }
  // High stress reduces immune function
  const strLevel = computeEffectiveValue(animal.stats[StatId.STR]);
  capacity -= strLevel * 0.15;
  // Old age reduces immune function
  if (agePhase?.id === 'elderly') capacity *= 0.7;
  physio.immuneCapacity = Math.max(10, Math.min(100, capacity));

  // Immune load: sum of all parasites + infected wounds
  let load = 0;
  for (const p of animal.parasites) {
    load += 8 + p.currentStage * 6;
  }
  if (animal.bodyState) {
    for (const cond of animal.bodyState.conditions) {
      if (cond.infectionLevel > 0) {
        load += cond.infectionLevel * 0.25;
      }
    }
  }
  physio.immuneLoad = load;
  physio.immunocompromised = load > physio.immuneCapacity;

  // ═══════════════════════════════════════════
  //  STEP 6: PRODUCE STAT MODIFIERS
  // ═══════════════════════════════════════════

  // Metabolic stress → HOM (higher when in sustained energy deficit)
  if (physio.negativeEnergyBalance) {
    const deficitFraction = Math.min(1, Math.abs(caloricBalance / ffMult) / bmr);
    const homAmount = Math.round(deficitFraction * 18);
    if (homAmount > 0) {
      modifiers.push({
        id: `physio-hom-${time.turn}`,
        source: 'Caloric Deficit',
        sourceType: 'condition',
        stat: StatId.HOM,
        amount: homAmount,
        duration: 1,
      });
    }
  }

  // Thermoregulatory stress → CLI
  if (physio.coreTemperatureDeviation < -2) {
    const severity = Math.min(1, Math.abs(physio.coreTemperatureDeviation) / 8);
    modifiers.push({
      id: `physio-cli-cold-${time.turn}`,
      source: 'Hypothermia',
      sourceType: 'condition',
      stat: StatId.CLI,
      amount: Math.round(severity * 25),
      duration: 1,
    });
  }
  if (physio.coreTemperatureDeviation > 2) {
    const severity = Math.min(1, physio.coreTemperatureDeviation / 6);
    modifiers.push({
      id: `physio-cli-heat-${time.turn}`,
      source: 'Heat Stress',
      sourceType: 'condition',
      stat: StatId.CLI,
      amount: Math.round(severity * 20),
      duration: 1,
    });
  }

  // Immune compromise → IMM
  if (physio.immunocompromised) {
    const overload = Math.min(2, (physio.immuneLoad - physio.immuneCapacity) / physio.immuneCapacity);
    modifiers.push({
      id: `physio-imm-${time.turn}`,
      source: 'Immune Compromise',
      sourceType: 'condition',
      stat: StatId.IMM,
      amount: Math.round(overload * 20),
      duration: 1,
    });
  }

  // Poor body condition → HEA (negative = reduced health)
  if (bodyCondition <= 2) {
    modifiers.push({
      id: `physio-hea-${time.turn}`,
      source: 'Malnutrition',
      sourceType: 'condition',
      stat: StatId.HEA,
      amount: -Math.round((2.5 - bodyCondition) * 12),
      duration: 1,
    });
  }

  // ═══════════════════════════════════════════
  //  STEP 7: NARRATIVE FRAGMENTS
  // ═══════════════════════════════════════════

  if (physio.negativeEnergyBalance && physio.avgCaloricBalance < -50) {
    if (bodyCondition <= 1) {
      narratives.push('Your ribs press against your hide like a cage too small for what\'s inside. Every step costs more than the last.');
    } else if (bodyCondition <= 2) {
      narratives.push('The persistent ache of hunger has become a companion. Your body is drawing on its last reserves.');
    }
  }

  if (physio.coreTemperatureDeviation < -3 && !deathCause) {
    narratives.push('A deep chill has settled into your bones. Your muscles shiver involuntarily, burning precious energy to stay warm.');
  }

  if (physio.immunocompromised && !deathCause) {
    narratives.push('Your body feels sluggish, as if fighting on too many fronts. Wounds that should have closed by now still weep.');
  }

  // ═══════════════════════════════════════════
  //  STEP 8: STARVATION DEATH CHECK
  // ═══════════════════════════════════════════

  const projectedWeight = animal.weight + weightChange;
  if (projectedWeight <= config.weight.starvationDeath) {
    deathCause = 'Starvation';
    narratives.push('Your body has nothing left to burn. The hunger that has been gnawing at you for weeks finally wins.');
  }

  return {
    physiology: physio,
    weightChange,
    modifiers,
    deathCause,
    narratives,
  };
}
