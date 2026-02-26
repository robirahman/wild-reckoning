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
      description: 'The open ground makes your skin crawl. Every instinct screams for cover — a tree line, a thicket, anything between you and the sky.',
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
        description: 'The steep terrain is treacherous with your injured leg. One misstep on these rocks could be your last.',
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
      description: 'Your body is consuming itself. The desperate need for food overrides every other instinct — caution, fear, pain. Nothing matters except calories.',
      suggestedBehavior: 'foraging',
      suggestedDirection: 'increase',
      priority: 'high',
      source: 'physiology',
    });
  } else if (physio.bodyConditionScore <= 2 && physio.negativeEnergyBalance) {
    nudges.push({
      id: 'hunger-drive',
      label: 'Hunger Drive',
      description: 'The persistent ache of hunger is eroding your caution. Your body wants food more than safety. The risk of the open feels tolerable.',
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
      description: 'A deep cold has settled into your core. Your body needs shelter and warmth — moving burns calories but generates heat. Staying still saves energy but lets the cold win.',
      suggestedBehavior: 'exploration',
      suggestedDirection: 'decrease',
      priority: 'high',
      source: 'physiology',
    });
  } else if (physio.coreTemperatureDeviation < -2) {
    nudges.push({
      id: 'chilled',
      label: 'Chilled',
      description: 'The shivering has become constant, a low-grade tremor that drains your energy. You would feel better somewhere sheltered from the wind.',
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
      description: 'Your body feels heavy and wrong. A deep fatigue clouds your thinking. Every instinct says to rest, to conserve, to let your body fight its invisible battles.',
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
      description: 'Your injured leg can barely hold you. Running is agony, and fleeing a predator may be impossible. Stay near cover. Avoid anything that might force you to sprint.',
      suggestedBehavior: 'caution',
      suggestedDirection: 'increase',
      priority: 'high',
      source: 'injury',
    });
  } else if (locomotion < 80) {
    nudges.push({
      id: 'limping',
      label: 'Limping',
      description: 'The injury slows you, each stride a reminder of your vulnerability. You compensate, favoring the good leg, but the old confidence in your speed is gone.',
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
      description: 'The storm is a living thing, howling and tearing at the world. Every fiber of your being says to hunker down, to find the deepest shelter and wait it out.',
      suggestedBehavior: 'exploration',
      suggestedDirection: 'decrease',
      priority: 'high',
      source: 'weather',
    });
  } else if (weather.type === 'heat_wave') {
    nudges.push({
      id: 'heat-lethargy',
      label: 'Heat Lethargy',
      description: 'The heat presses down like a weight. Your body wants to lie still in the shade, conserving energy, waiting for the cool of evening.',
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
      description: 'A chemical imperative burns through your blood, overriding caution and common sense. The need to find does, to fight rivals, to establish dominance — it is not a thought but a compulsion.',
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
        description: 'Your fawns need you close. The urge to return to them, to check on them, to feed them is a constant pull at the edge of your attention.',
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
      description: 'Being alone makes your skin crawl. Every sound could be a predator, and there are no other eyes or ears to share the watch. You want to be near other deer.',
      suggestedBehavior: 'sociability',
      suggestedDirection: 'increase',
      priority: 'low',
      source: 'social',
    });
  }
}
