import type { AnimalState } from '../types/species';
import type { TimeState } from '../types/world';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { WeatherState } from './WeatherSystem';
import type { StatModifier } from '../types/stats';
import type { BehavioralSettings } from '../types/behavior';
import { StatId, computeEffectiveValue } from '../types/stats';
import { getScaling } from './SpeciesScale';

export interface PhysiologyResult {
  animal: AnimalState;
  modifiers: StatModifier[];
}

/**
 * Ticks core biological and psychological processes for a single turn.
 * Handles metabolism, physical stressors (cold, hunger), and mental stress feedback loops.
 */
export function tickPhysiology(
  animal: AnimalState,
  time: TimeState,
  weather: WeatherState | null,
  config: SpeciesConfig,
  behavior: BehavioralSettings
): PhysiologyResult {
  const newAnimal = { ...animal };
  const modifiers: StatModifier[] = [];
  const scaling = getScaling(config.massType);

  // --- 1. PHYSICAL ENERGETICS ---

  // Energy Drain (Metabolic Engine)
  // Higher foraging intensity increases metabolic demand (physical exertion)
  const exertionFactor = 0.8 + (behavior.foraging * 0.1); // 0.9x to 1.3x metabolic rate
  newAnimal.energy = Math.max(0, newAnimal.energy - (scaling.metabolicRate * exertionFactor));
  
  // Nutrient Decay
  newAnimal.nutrients.minerals = Math.max(0, newAnimal.nutrients.minerals - 2);
  newAnimal.nutrients.vitamins = Math.max(0, newAnimal.nutrients.vitamins - 3);
  
  if (newAnimal.nutrients.minerals < 20) {
    modifiers.push({
      id: `mineral-deficiency-${time.turn}`,
      source: 'Mineral Deficiency',
      sourceType: 'condition',
      stat: StatId.STR,
      amount: -15,
      duration: 1
    });
  }

  if (newAnimal.energy === 0) {
    modifiers.push({
      id: `exhaustion-${time.turn}`,
      source: 'Exhaustion',
      sourceType: 'condition',
      stat: StatId.HOM,
      amount: 10,
      duration: 1
    });
  }

  // --- 2. ENVIRONMENTAL STRESS ---

  // Hypothermia (linked to CLI and weather)
  const cliStress = computeEffectiveValue(newAnimal.stats[StatId.CLI]);
  const coldWeather = weather?.type === 'blizzard' || weather?.type === 'frost' || weather?.type === 'snow';
  if (cliStress > 60 || (coldWeather && cliStress > 40)) {
    newAnimal.physiologicalStress.hypothermia = Math.min(100, newAnimal.physiologicalStress.hypothermia + 10);
  } else {
    newAnimal.physiologicalStress.hypothermia = Math.max(0, newAnimal.physiologicalStress.hypothermia - 15);
  }

  // Starvation (linked to weight and nutrients)
  if (newAnimal.weight < config.weight.starvationDebuff) {
    newAnimal.physiologicalStress.starvation = Math.min(100, newAnimal.physiologicalStress.starvation + 8);
  } else {
    newAnimal.physiologicalStress.starvation = Math.max(0, newAnimal.physiologicalStress.starvation - 10);
  }

  // Panic (decays slowly)
  newAnimal.physiologicalStress.panic = Math.max(0, newAnimal.physiologicalStress.panic - 20);

  // --- 3. MENTAL STRESS & BEHAVIORAL PRESSURE ---

  // Passive Mental Stress Accumulation/Decay
  let traChange = -2; // Base trauma decay
  let advChange = -4; // Base adversity decay
  let novChange = -5; // Base novelty decay

  // Behavioral Pressures
  // Caution: High caution prevents trauma but increases adversity (stress of alertness)
  if (behavior.caution >= 4) {
    traChange -= 2;
    advChange += (behavior.caution - 2); 
  } else if (behavior.caution <= 2) {
    advChange -= 2;
    // Low caution increases vulnerability to rest exposure
    const isActivePeriod = 
      (config.diurnalType === 'diurnal' && (time.timeOfDay === 'day' || time.timeOfDay === 'dawn')) ||
      (config.diurnalType === 'nocturnal' && (time.timeOfDay === 'night' || time.timeOfDay === 'dusk')) ||
      (config.diurnalType === 'crepuscular' && (time.timeOfDay === 'dawn' || time.timeOfDay === 'dusk'));
    
    if (!isActivePeriod && !newAnimal.flags.has('territory-established')) {
      traChange += 5;
    }
  }

  // Sociability: Social buffering reduces trauma, but increases disease pressure (IMM)
  if (behavior.sociability >= 4) {
    traChange -= 3;
    modifiers.push({
      id: `social-disease-risk-${time.turn}`,
      source: 'Social Crowding',
      sourceType: 'behavioral',
      stat: StatId.IMM,
      amount: (behavior.sociability - 3) * 5,
      duration: 1
    });
  }

  // Foraging: High intensity foraging adds to daily adversity and physical strain (HOM)
  if (behavior.foraging >= 4) {
    advChange += (behavior.foraging - 2);
    modifiers.push({
      id: `foraging-exertion-${time.turn}`,
      source: 'Foraging Exertion',
      sourceType: 'behavioral',
      stat: StatId.HOM,
      amount: (behavior.foraging - 3) * 4,
      duration: 1
    });
  }

  // Apply Changes to Base Stats (Gradual Accumulation/Decay)
  // We use modifiers for feedback effects, but base stats for the slow-moving "state"
  // Wait, current engine uses base stats for the permanent underlying level.
  // I will add permanent-ish modifiers or adjust base? 
  // Let's use modifiers with long durations for the "current state" of mental health.
  
  const currentTra = computeEffectiveValue(newAnimal.stats[StatId.TRA]);
  const currentAdv = computeEffectiveValue(newAnimal.stats[StatId.ADV]);
  const currentNov = computeEffectiveValue(newAnimal.stats[StatId.NOV]);

  // Adjust base stats directly for these slow-moving "mental pools"
  newAnimal.stats[StatId.TRA].base = Math.max(0, Math.min(100, newAnimal.stats[StatId.TRA].base + traChange));
  newAnimal.stats[StatId.ADV].base = Math.max(0, Math.min(100, newAnimal.stats[StatId.ADV].base + advChange));
  newAnimal.stats[StatId.NOV].base = Math.max(0, Math.min(100, newAnimal.stats[StatId.NOV].base + novChange));

  // --- 4. PSYCHOLOGICAL FEEDBACK LOOPS (MECHANICAL IMPACT) ---

  // High Trauma (Fear/Anxiety) -> Reduced Health and Wisdom (Panic overrides experience)
  if (currentTra > 60) {
    const intensity = (currentTra - 60) / 40; // 0.0 to 1.0
    modifiers.push({
      id: `trauma-feedback-hea-${time.turn}`,
      source: 'Psychological Trauma',
      sourceType: 'condition',
      stat: StatId.HEA,
      amount: -Math.round(intensity * 15),
      duration: 1
    });
    modifiers.push({
      id: `trauma-feedback-wis-${time.turn}`,
      source: 'Panic & Anxiety',
      sourceType: 'condition',
      stat: StatId.WIS,
      amount: -Math.round(intensity * 20),
      duration: 1
    });
  }

  // High Adversity (Burnout) -> Increased Homeostatic Disruption and reduced Resilience (STR)
  if (currentAdv > 60) {
    const intensity = (currentAdv - 60) / 40;
    modifiers.push({
      id: `adversity-feedback-hom-${time.turn}`,
      source: 'Burnout & Fatigue',
      sourceType: 'condition',
      stat: StatId.HOM,
      amount: Math.round(intensity * 12),
      duration: 1
    });
    modifiers.push({
      id: `adversity-feedback-str-${time.turn}`,
      source: 'Systemic Adversity',
      sourceType: 'condition',
      stat: StatId.STR,
      amount: -Math.round(intensity * 10),
      duration: 1
    });
  }

  // High Novelty (Sensory Overload) -> Increases Trauma
  if (currentNov > 70) {
    newAnimal.stats[StatId.TRA].base = Math.min(100, newAnimal.stats[StatId.TRA].base + 2);
  }

  return { animal: newAnimal, modifiers };
}
