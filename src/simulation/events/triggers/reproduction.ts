import { createReproductionTrigger } from '../factories/reproductionFactory';
import { FAWN_BIRTH_CONFIG, FAWN_DEFENSE_CONFIG, RUT_DISPLAY_CONFIG } from '../data/reproductionConfigs';
// resolveSocial reserved for future mating social dynamics

// ══════════════════════════════════════════════════
//  FAWN BIRTH — spring birthing event
// ══════════════════════════════════════════════════

export const fawnBirthTrigger = createReproductionTrigger(FAWN_BIRTH_CONFIG);

// ══════════════════════════════════════════════════
//  FAWN DEFENSE — doe protecting fawn from predator
// ══════════════════════════════════════════════════

export const fawnDefenseTrigger = createReproductionTrigger(FAWN_DEFENSE_CONFIG);

// ══════════════════════════════════════════════════
//  RUT DISPLAY — mating approach and courtship
// ══════════════════════════════════════════════════

export const rutDisplayTrigger = createReproductionTrigger(RUT_DISPLAY_CONFIG);
