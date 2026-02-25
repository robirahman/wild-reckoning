import type { Offspring, IteroparousReproductionState } from '../types/reproduction';
import type { AnimalState } from '../types/species';
import type { TimeState, Season } from '../types/world';
import { StatId, computeEffectiveValue } from '../types/stats';
import type { Rng } from './RandomUtils';

/** Determine fawn count based on mother's condition */
export function determineFawnCount(weight: number, heaStat: number, rng: Rng): number {
  // Well-nourished does have higher chance of twins/triplets
  // Base: ~40% single, ~50% twins, ~10% triplets
  const conditionBonus =
    ((weight - 80) / 80) * 0.15 + ((heaStat - 40) / 60) * 0.15;
  const bonus = Math.max(-0.2, Math.min(0.3, conditionBonus));

  const roll = rng.random();
  const twinThreshold = 0.40 - bonus;
  const tripletThreshold = 0.90 - bonus;

  if (roll < twinThreshold) return 1;
  if (roll < tripletThreshold) return 2;
  return 3;
}

/** Create fawn records at birth */
export function createFawns(
  count: number,
  turn: number,
  year: number,
  motherWis: number,
  siredByPlayer: boolean,
  rng: Rng,
): Offspring[] {
  const fawns: Offspring[] = [];
  for (let i = 0; i < count; i++) {
    fawns.push({
      id: `fawn-${turn}-${i}`,
      sex: rng.chance(0.5) ? 'male' : 'female',
      bornOnTurn: turn,
      bornInYear: year,
      motherWisAtBirth: motherWis,
      alive: true,
      independent: siredByPlayer, // Male player's fawns are immediately independent (no paternal care)
      matured: false,
      ageTurns: 0,
      siredByPlayer,
    });
  }
  return fawns;
}

/** Per-turn survival roll for an independent, non-matured fawn */
export function rollFawnSurvival(fawn: Offspring, season: Season, rng: Rng, motherFlags?: ReadonlySet<string>): boolean {
  // Base weekly survival ~98.5% → ~34% survive 72 weeks to 18 months
  let survivalProb = 0.985;

  // Mother's WIS at birth: higher = slightly better survival
  survivalProb += (fawn.motherWisAtBirth - 50) / 5000;

  // Seasonal pressure
  if (season === 'winter') survivalProb -= 0.008;
  if (season === 'summer') survivalProb += 0.003;

  // Young independent fawns (just became independent, <8 months) are more vulnerable
  if (fawn.ageTurns < 32) survivalProb -= 0.005;

  // Nest/den site quality from female competition
  if (motherFlags?.has('nest-quality-prime')) survivalProb += 0.006;
  if (motherFlags?.has('nest-quality-poor')) survivalProb -= 0.008;

  survivalProb = Math.max(0.90, Math.min(0.998, survivalProb));
  return rng.chance(survivalProb);
}

/** Compute win probability for male buck competition */
export function computeBuckWinProbability(
  hea: number,
  weight: number,
  str: number,
  injuryCount: number,
  parasiteCount: number,
): number {
  // Base: 15% — males should lose MOST of the time
  let prob = 0.15;

  // HEA: +0.3% per point above 50
  prob += (hea - 50) * 0.003;

  // Weight: +0.1% per lb above 130
  prob += Math.max(0, (weight - 130) * 0.001);

  // Low STR is good (less stressed): up to +6% for very low stress
  prob += Math.max(0, (30 - str) * 0.002);

  // Penalties for injuries and parasites
  prob -= injuryCount * 0.05;
  prob -= parasiteCount * 0.03;

  // Clamp: never guaranteed, max 45% for a peak-condition buck
  return Math.max(0.02, Math.min(0.45, prob));
}

const FAWN_DEATH_CAUSES = [
  'Killed by predators',
  'Died of exposure',
  'Succumbed to disease',
  'Lost to starvation',
];

/** Tick reproduction state each turn */
export function tickReproduction(
  reproduction: IteroparousReproductionState,
  animal: AnimalState,
  time: TimeState,
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

  // 1. Tick pregnancy
  if (updated.pregnancy) {
    const newTurnsRemaining = updated.pregnancy.turnsRemaining - 1;

    if (newTurnsRemaining <= 0) {
      // Birth
      const wis = computeEffectiveValue(animal.stats[StatId.WIS]);
      const count = updated.pregnancy.offspringCount;
      const fawns = createFawns(count, time.turn, time.year, wis, false, rng);
      updated = {
        ...updated,
        offspring: [...updated.offspring, ...fawns],
        pregnancy: null,
      };
      flagsToAdd.push('fawns-dependent');
      flagsToRemove.push('pregnant');

      const fawnWord =
        count === 1 ? 'a single fawn' : count === 2 ? 'twin fawns' : 'triplet fawns';
      narratives.push(
        `You have given birth to ${fawnWord}. They are small, spotted, and impossibly ` +
        `fragile. Every instinct tells you to protect them with your life.`,
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

  const updatedOffspring = updated.offspring.map((fawn) => {
    if (!fawn.alive) return fawn;

    const f = { ...fawn, ageTurns: fawn.ageTurns + 1 };

    // Independence check: ~20 turns = ~5 months
    if (!f.independent && f.ageTurns >= 20) {
      f.independent = true;
      anyJustBecameIndependent = true;
    }

    // Survival roll for independent, non-matured fawns
    if (f.independent && !f.matured) {
      if (!rollFawnSurvival(f, time.season, rng, animal.flags)) {
        f.alive = false;
        f.causeOfDeath = rng.pick(FAWN_DEATH_CAUSES);
        narratives.push(
          `You sense, in the way that animals do, that one of your offspring has not survived. ` +
          `${f.causeOfDeath}.`,
        );
      }
    }

    // Maturation check: 72 turns = 18 months
    if (f.alive && f.independent && f.ageTurns >= 72 && !f.matured) {
      f.matured = true;
      narratives.push(
        `One of your offspring has reached reproductive age. They will carry your bloodline forward.`,
      );
    }

    if (f.alive && !f.independent) {
      anyDependent = true;
    }

    return f;
  });

  updated = { ...updated, offspring: updatedOffspring };

  // Update dependent flag
  if (!anyDependent && animal.flags.has('fawns-dependent')) {
    flagsToRemove.push('fawns-dependent');
  }
  if (anyJustBecameIndependent) {
    flagsToAdd.push('fawns-just-independent');
  }

  // Season reset: first week of September → reset mating flags for new rut season
  if (time.month === 'September' && time.week === 1) {
    updated = { ...updated, matedThisSeason: false };
    flagsToRemove.push('mated-this-season', 'rut-seen', 'nest-quality-prime', 'nest-quality-poor');
  }

  // Remove temporary flags
  if (animal.flags.has('fawns-just-independent')) {
    flagsToRemove.push('fawns-just-independent');
  }

  // Recompute fitness
  updated = {
    ...updated,
    totalFitness: updated.offspring.filter((o) => o.matured).length,
  };

  return { reproduction: updated, narratives, flagsToAdd, flagsToRemove };
}
