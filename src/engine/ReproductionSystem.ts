import type { Offspring, IteroparousReproductionState } from '../types/reproduction';
import type { AnimalState } from '../types/species';
import type { TimeState, Season } from '../types/world';
import { StatId, computeEffectiveValue } from '../types/stats';
import type { Rng } from './RandomUtils';
import type { SpeciesConfig } from '../types/speciesConfig';

/** Determine offspring count based on condition and formula */
export function determineOffspringCount(
  weight: number, 
  heaStat: number, 
  config: SpeciesConfig, 
  rng: Rng
): number {
  const repro = config.reproduction;
  if (repro.type !== 'iteroparous') return 0;

  const formula = repro.offspringCountFormula;
  
  // Calculate a condition score [0, 1]
  const weightScore = (weight - formula.weightReference) / formula.weightDivisor;
  const heaScore = (heaStat - formula.heaReference) / formula.heaDivisor;
  const score = Math.max(0, Math.min(1, (weightScore + heaScore) / 2));

  if (formula.maxOffspring === 1) return 1;

  const roll = rng.random();
  
  // Adjust thresholds based on score
  // High score reduces thresholds (making higher counts more likely)
  const singleLimit = formula.singleThreshold - (score * 0.2);
  const tripleLimit = formula.tripletThreshold - (score * 0.2);

  if (roll < singleLimit) return 1;
  if (roll < tripleLimit) return 2;
  return Math.min(formula.maxOffspring, 3);
}

/** Create offspring records at birth */
export function createOffspring(
  count: number,
  turn: number,
  year: number,
  motherWis: number,
  siredByPlayer: boolean,
  config: SpeciesConfig,
  rng: Rng,
): Offspring[] {
  const offspring: Offspring[] = [];
  const speciesId = config.id;
  for (let i = 0; i < count; i++) {
    offspring.push({
      id: `${speciesId}-offspring-${turn}-${i}`,
      sex: rng.chance(0.5) ? 'male' : 'female',
      bornOnTurn: turn,
      bornInYear: year,
      motherWisAtBirth: motherWis,
      alive: true,
      independent: siredByPlayer, // Male player's offspring are immediately independent
      matured: false,
      ageTurns: 0,
      siredByPlayer,
    });
  }
  return offspring;
}

/** Per-turn survival roll for an independent, non-matured offspring */
export function rollOffspringSurvival(
  offspring: Offspring, 
  season: Season, 
  config: SpeciesConfig,
  rng: Rng, 
  motherFlags?: ReadonlySet<string>
): boolean {
  const repro = config.reproduction;
  if (repro.type !== 'iteroparous') return true;

  let survivalProb = repro.offspringBaseSurvival;

  // Mother's WIS at birth: higher = slightly better survival
  survivalProb += (offspring.motherWisAtBirth - 50) / 5000;

  // Seasonal pressure
  if (season === 'winter') survivalProb -= repro.offspringSurvivalWinterPenalty;
  if (season === 'summer') survivalProb += repro.offspringSurvivalSummerBonus;

  // Young independent offspring are more vulnerable
  if (offspring.ageTurns < repro.offspringSurvivalYoungThreshold) {
    survivalProb -= repro.offspringSurvivalYoungPenalty;
  }

  // Nest/den site quality
  if (motherFlags?.has('nest-quality-prime')) survivalProb += 0.006;
  if (motherFlags?.has('nest-quality-poor')) survivalProb -= 0.008;

  survivalProb = Math.max(repro.offspringSurvivalMin, Math.min(repro.offspringSurvivalMax, survivalProb));
  return rng.chance(survivalProb);
}

/** Tick reproduction state each turn */
export function tickReproduction(
  reproduction: IteroparousReproductionState,
  animal: AnimalState,
  time: TimeState,
  config: SpeciesConfig,
  rng: Rng,
): {
  reproduction: IteroparousReproductionState;
  narratives: string[];
  flagsToAdd: string[];
  flagsToRemove: string[];
} {
  const narratives: string[] = [];
  const flagsToAdd: string[] = [];
  const flagsToRemove: string[] = [];
  let updated = { ...reproduction };
  const reproConfig = config.reproduction;

  if (reproConfig.type !== 'iteroparous') {
    return { reproduction, narratives, flagsToAdd, flagsToRemove };
  }

  // 1. Tick pregnancy
  if (updated.pregnancy) {
    const newTurnsRemaining = updated.pregnancy.turnsRemaining - 1;

    if (newTurnsRemaining <= 0) {
      // Birth
      const wis = computeEffectiveValue(animal.stats[StatId.WIS]);
      const count = updated.pregnancy.offspringCount;
      const offspring = createOffspring(count, time.turn, time.year, wis, false, config, rng);
      updated = {
        ...updated,
        offspring: [...updated.offspring, ...offspring],
        pregnancy: null,
      };
      flagsToAdd.push(reproConfig.dependentFlag);
      flagsToRemove.push(reproConfig.pregnantFlag);

      const label = count === 1 
        ? reproConfig.offspringLabelSingle 
        : (count === 2 ? reproConfig.offspringLabelTwin : reproConfig.offspringLabelTriple);
        
      narratives.push(
        `The time has come. ${label} have been born. They are small, weak, and utterly ` +
        `dependent on you for warmth and nutrition. Your life is no longer just your own.`,
      );
    } else {
      updated = {
        ...updated,
        pregnancy: { ...updated.pregnancy, turnsRemaining: newTurnsRemaining },
      };
    }
  }

  // 2. Tick all living offspring
  let anyDependent = false;
  let anyJustBecameIndependent = false;

  const updatedOffspring = updated.offspring.map((off) => {
    if (!off.alive) return off;

    const o = { ...off, ageTurns: off.ageTurns + 1 };

    // Independence check
    if (!o.independent && o.ageTurns >= reproConfig.dependenceTurns) {
      o.independent = true;
      anyJustBecameIndependent = true;
    }

    // Survival roll for independent, non-matured offspring
    if (o.independent && !o.matured) {
      if (!rollOffspringSurvival(o, time.season, config, rng, animal.flags)) {
        o.alive = false;
        o.causeOfDeath = rng.pick(reproConfig.offspringDeathCauses);
        narratives.push(
          `A cold realization settles over you: one of your offspring has not survived. ` +
          `${o.causeOfDeath}.`,
        );
      }
    }

    // Maturation check
    if (o.alive && o.independent && o.ageTurns >= reproConfig.maturationTurns && !o.matured) {
      o.matured = true;
      narratives.push(
        `One of your offspring has reached maturity. They disappear into the wild to find their own path, ` +
        `carrying your genetic legacy with them.`,
      );
    }

    if (o.alive && !o.independent) {
      anyDependent = true;
    }

    return o;
  });

  updated = { ...updated, offspring: updatedOffspring };

  // Infanticide: if the flag is set, kill all dependent offspring
  if (animal.flags.has('infanticide-occurred')) {
    const afterInfanticide = updated.offspring.map((o) => {
      if (o.alive && !o.independent) {
        return { ...o, alive: false, causeOfDeath: 'Killed by infanticidal male' };
      }
      return o;
    });
    const hadDependents = updated.offspring.some((o) => o.alive && !o.independent);
    updated = { ...updated, offspring: afterInfanticide };
    if (hadDependents) {
      narratives.push(
        'The loss is absolute. Your dependent offspring have been killed, and your body begins to cycle back toward readiness.',
      );
    }
    flagsToRemove.push('infanticide-occurred');
    anyDependent = false;
  }

  // Update dependent flag
  if (!anyDependent && animal.flags.has(reproConfig.dependentFlag)) {
    flagsToRemove.push(reproConfig.dependentFlag);
  }
  if (anyJustBecameIndependent) {
    flagsToAdd.push(reproConfig.independenceFlag);
  }

  // Season reset: reset mating flags for new season
  if (time.month === reproConfig.matingSeasonResetMonth && time.week === 1) {
    updated = { ...updated, matedThisSeason: false };
    flagsToRemove.push(
      reproConfig.maleCompetition.matedFlag, 
      'rut-seen', 
      'courtship-success',
      'nest-quality-prime', 
      'nest-quality-poor'
    );
  }

  // Remove temporary flags
  if (animal.flags.has(reproConfig.independenceFlag)) {
    flagsToRemove.push(reproConfig.independenceFlag);
  }

  // Recompute fitness
  updated = {
    ...updated,
    totalFitness: updated.offspring.filter((o) => o.matured).length,
  };

  return { reproduction: updated, narratives, flagsToAdd, flagsToRemove };
}

/** Compute probability of winning a male-male competition */
export function computeBuckWinProbability(
  heaStat: number,
  weight: number,
  strStat: number,
  injuries: number,
  parasites: number,
  config: SpeciesConfig
): number {
  const comp = config.reproduction.type === 'iteroparous' ? config.reproduction.maleCompetition : null;
  if (!comp || !comp.enabled) return 0;

  let prob = comp.baseWinProb;
  prob += heaStat * comp.heaFactor;
  prob += (weight - comp.weightReferencePoint) * comp.weightFactor;
  prob += (strStat - 50) * 0.002; 

  prob -= injuries * comp.injuryPenalty;
  prob -= parasites * comp.parasitePenalty;

  return Math.max(comp.minWinProb, Math.min(comp.maxWinProb, prob));
}
