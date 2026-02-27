import type { Rng } from '../../../engine/RandomUtils';

// ══════════════════════════════════════════════════
//  FORAGING NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Browse Discovery Openings ──

export interface ForageOpening {
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'any';
  quality: 'good' | 'poor' | 'any';
  text: string;
}

export const BROWSE_OPENINGS: ForageOpening[] = [
  { season: 'spring', quality: 'good', text: 'The forest floor is erupting. Green shoots push through the leaf litter everywhere you look — hepatica, trillium, fiddlehead ferns still curled tight with stored energy. After months of woody browse and bark, the abundance is almost disorienting.' },
  { season: 'spring', quality: 'good', text: 'You lower your nose to the earth and breathe in the green perfume of new growth. The tender shoots are everywhere, soft and rich with the nutrients your winter-depleted body craves.' },
  { season: 'summer', quality: 'good', text: 'The forest canopy is dense and generous. Beneath it, a wealth of browse presents itself — clover, wild lettuce, the tender tips of maple saplings, mushrooms pushing through the damp litter.' },
  { season: 'summer', quality: 'any', text: 'You drift through the understory, browsing as you go, picking the tenderest leaves from each shrub and moving on. The routine of summer feeding is meditative, almost peaceful.' },
  { season: 'autumn', quality: 'good', text: 'The oaks and beeches are dropping their cargo. Acorns and beechnuts litter the forest floor, crunching beneath your hooves, and the smell of ripe fruit drifts from abandoned orchards.' },
  { season: 'autumn', quality: 'any', text: 'You forage with an urgency that builds with each shorter day. The fat you put on now will carry you through winter, and your body knows it — every calorie matters.' },
  { season: 'winter', quality: 'poor', text: 'The snow covers everything. What browse remains is woody, dry, and bitter — cedar twigs, stripped bark, frozen lichen pried from tree trunks. Each mouthful costs more energy to find than it seems to return.' },
  { season: 'winter', quality: 'poor', text: 'You paw through the snow crust, searching for anything beneath — dried grass, frozen sedge, the shriveled remnants of autumn\'s abundance. The pickings are meager.' },
  { season: 'any', quality: 'good', text: 'Your nose leads you to a patch of browse so abundant your body floods with something like relief. You eat with steady, grinding efficiency, filling the rumen to capacity.' },
  { season: 'any', quality: 'poor', text: 'You have been walking for hours, and every promising patch turns out to be already stripped by other mouths or frozen beyond usefulness. Your stomach aches with emptiness.' },
];

// ── Risky Foraging Scenarios ──

export interface RiskyForageFragment {
  scenario: 'orchard' | 'cornfield' | 'mushroom' | 'roadside';
  text: string;
}

export const RISKY_FORAGES: RiskyForageFragment[] = [
  { scenario: 'orchard', text: 'The apples hang low on unpruned branches, their scent carrying far on the evening air. A human dwelling sits dark beyond the tree line — the lights are off, but the scent of dogs and machinery lingers.' },
  { scenario: 'orchard', text: 'Rotting fruit sweetens the air beneath the orchard trees. The fallen apples are browning but still rich with sugar, a caloric windfall if the humans don\'t notice.' },
  { scenario: 'cornfield', text: 'The corn stands taller than your head, a dense wall of green and gold. Once inside, you\'ll be invisible — but also unable to see anything coming.' },
  { scenario: 'cornfield', text: 'The cornfield is a maze of plenty. Each ear you strip from the stalk is dense with energy, but the rustling of your movement in the dry leaves announces your presence to anything listening.' },
  { scenario: 'mushroom', text: 'A cluster of mushrooms pushes through the leaf litter, pale and glistening. Some are safe — your instincts tell you so — but others look identical to the ones that would cramp your gut for days.' },
  { scenario: 'roadside', text: 'The grass along the road verge is impossibly green, fertilized by runoff, dense and nutritious. But the road hisses with traffic, and every car that passes sends a gust of wind and noise.' },
];

// ── Toxic Plant Encounters ──

export const TOXIC_DISCOVERIES: string[] = [
  'You eat without thinking — the plant looks like a dozen others you\'ve consumed safely. But the taste is wrong, bitter and sharp, and by the time you stop chewing the damage is done.',
  'The leaves are appealing — broad, green, tender. Your mouth waters as you take the first bite. Within minutes, a cramping wrongness begins to build in your gut.',
  'It looked right. It smelled close enough. But your body knows before your mind does — a sudden, violent rebellion in your stomach that says this was a mistake.',
];

// ── Caloric State Descriptions ──

export interface CaloricFragment {
  state: 'surplus' | 'balanced' | 'deficit' | 'critical';
  text: string;
}

export const CALORIC_STATES: CaloricFragment[] = [
  { state: 'surplus', text: 'Your gut is full, the rumen working steadily. Fat is building along your ribs and haunches — reserves against leaner times.' },
  { state: 'surplus', text: 'You chew your cud with the slow satisfaction of a body that has, for now, more than it needs.' },
  { state: 'balanced', text: 'You are neither hungry nor full — the steady equilibrium of an animal meeting its needs day by day.' },
  { state: 'deficit', text: 'The hunger is constant now, a low hum beneath every other thought. You eat what you find, but what you find is not enough.' },
  { state: 'deficit', text: 'Your ribs are beginning to show through the winter coat. Each foraging bout yields less than your body demands.' },
  { state: 'critical', text: 'You are starving. The word doesn\'t capture it — the hollowness, the weakness in your legs, the way the world dims at the edges when you lower your head to chew.' },
  { state: 'critical', text: 'Your body has begun consuming itself. Muscle first, then the last reserves of fat. Each day you are less than you were yesterday.' },
];

// ── Utility ──

export function pickBrowseOpening(
  season: string,
  quality: 'good' | 'poor',
  rng: Rng,
): ForageOpening {
  // Try exact match
  let candidates = BROWSE_OPENINGS.filter(
    (f) => (f.season === season || f.season === 'any') && (f.quality === quality || f.quality === 'any'),
  );
  if (candidates.length === 0) {
    candidates = BROWSE_OPENINGS.filter((f) => f.season === 'any');
  }
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickRiskyForage(scenario: string, rng: Rng): RiskyForageFragment | undefined {
  const candidates = RISKY_FORAGES.filter((f) => f.scenario === scenario);
  if (candidates.length === 0) return undefined;
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickCaloricState(bcs: number, rng: Rng): CaloricFragment {
  const state: CaloricFragment['state'] =
    bcs >= 4 ? 'surplus' : bcs >= 3 ? 'balanced' : bcs >= 2 ? 'deficit' : 'critical';
  const candidates = CALORIC_STATES.filter((f) => f.state === state);
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickFrom(pool: string[], rng: Rng): string {
  return pool[rng.int(0, pool.length - 1)];
}
