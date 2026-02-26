import type { AnimalState } from '../types/species';
import type { TimeState } from '../types/world';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { WeatherState } from './WeatherSystem';
import type { StatModifier } from '../types/stats';
import { StatId, computeEffectiveValue } from '../types/stats';
import { getScaling } from './SpeciesScale';
import { addModifier } from './StatCalculator';

export interface PhysiologyResult {
  animal: AnimalState;
  modifiers: StatModifier[];
}

export function tickPhysiology(
  animal: AnimalState,
  time: TimeState,
  weather: WeatherState | null,
  config: SpeciesConfig,
  behaviorForaging: number
): PhysiologyResult {
  const newAnimal = { ...animal };
  const modifiers: StatModifier[] = [];
  const scaling = getScaling(config.massType);

  // 1. Circadian & Lunar Bonuses/Penalties
  const isActivePeriod = 
    (config.diurnalType === 'diurnal' && (time.timeOfDay === 'day' || time.timeOfDay === 'dawn')) ||
    (config.diurnalType === 'nocturnal' && (time.timeOfDay === 'night' || time.timeOfDay === 'dusk')) ||
    (config.diurnalType === 'crepuscular' && (time.timeOfDay === 'dawn' || time.timeOfDay === 'dusk'));
  
  if (!isActivePeriod && !newAnimal.flags.has('territory-established')) {
    // Stress if inactive and exposed
    modifiers.push({
      id: `circadian-stress-${time.turn}`,
      source: 'Exposed during rest',
      sourceType: 'condition',
      stat: StatId.TRA,
      amount: 5,
      duration: 1
    });
  }

  // 2. Energy Drain (Metabolic Engine)
  newAnimal.energy = Math.max(0, newAnimal.energy - scaling.metabolicRate);
  
  // 3. Physiological Stress
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

  // 4. Nutrient Decay
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

  return { animal: newAnimal, modifiers };
}
