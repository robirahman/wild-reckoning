import type { Rng } from '../../../engine/RandomUtils';

// ══════════════════════════════════════════════════
//  MIGRATION NARRATIVE FRAGMENTS
// ══════════════════════════════════════════════════

// ── Migration Urge Openings ──

export interface MigrationUrgeFragment {
  season: 'autumn' | 'spring';
  text: string;
}

export const MIGRATION_URGES: MigrationUrgeFragment[] = [
  { season: 'autumn', text: 'Something deep in your memory stirs — not a thought, but a pull, a directional certainty inherited from your mother and her mother before her.' },
  { season: 'autumn', text: 'The first killing frost settles in overnight, and with it comes a restlessness you cannot name. Your body knows the way even if your mind does not.' },
  { season: 'autumn', text: 'You find yourself drifting southwest during your daily wanderings, drawn by a scent trail laid down by generations of hooves before yours.' },
  { season: 'spring', text: 'The snow is retreating and something in you is retreating with it — the huddled, enduring patience of winter giving way to a northward pull.' },
  { season: 'spring', text: 'A warm wind from the north carries the scent of green — new growth, tender shoots, the first herbs pushing through the thawing soil. The pull is irresistible.' },
  { season: 'spring', text: 'One by one, the deer begin to drift away from the yard, following the retreating snow line northward. The herd instinct says: follow.' },
];

// ── Route Descriptions ──

export interface RouteFragment {
  routeType: 'ancestral' | 'new' | 'any';
  text: string;
}

export const ROUTE_DESCRIPTIONS: RouteFragment[] = [
  { routeType: 'ancestral', text: 'You follow the scent-memory southwest, tracing paths beaten by generations of hooves. The route is familiar even though you may never have walked it — buried in the inherited map of your kind.' },
  { routeType: 'ancestral', text: 'The trail is ancient. Bark is worn smooth on the trees that mark the turns, and the ground is packed hard where thousands of hooves have passed before yours.' },
  { routeType: 'new', text: 'You break from the ancestral trail and push into unfamiliar ground. The forest here is different — the trees taller, the undergrowth thicker, the scent of other deer faint and old.' },
  { routeType: 'new', text: 'The terrain is unmapped by your blood memory. Every ridge, every stream crossing, every open meadow is a decision you must make yourself.' },
  { routeType: 'any', text: 'The journey stretches ahead of you, measured in ridgelines and stream crossings, in safe resting spots and exposed stretches.' },
];

// ── Road Crossing ──

export interface RoadCrossingFragment {
  timeOfDay: 'day' | 'night' | 'any';
  text: string;
}

export const ROAD_CROSSINGS: RoadCrossingFragment[] = [
  { timeOfDay: 'night', text: 'The road appears suddenly — a flat, pale scar cutting through the forest. Headlights sweep through the trees at irregular intervals, each pair a fast-moving predator with no scent and no sound until it is upon you.' },
  { timeOfDay: 'night', text: 'In the darkness, the road is marked only by the hiss of tires and the sweep of light. You stand at the edge, muscles coiled, waiting for a gap that may not come.' },
  { timeOfDay: 'day', text: 'The highway is a river of metal and noise. Cars, trucks, an eighteen-wheeler that shakes the ground as it passes. The gap between vehicles is your window, and it is closing fast.' },
  { timeOfDay: 'day', text: 'Traffic streams past in both directions. The asphalt radiates heat and stinks of rubber and exhaust. Twenty meters of open ground stand between you and the forest on the other side.' },
  { timeOfDay: 'any', text: 'The road lies ahead — flat, exposed, lethal. Every instinct screams that this is a killing ground. But the other side is where you need to be.' },
];

// ── Crossing Outcomes ──

export interface CrossingOutcome {
  result: 'safe' | 'near-miss' | 'hit';
  text: string;
}

export const CROSSING_OUTCOMES: CrossingOutcome[] = [
  { result: 'safe', text: 'You launch forward, hooves striking asphalt, and reach the far side without incident. Grass under your hooves, darkness around you, the road behind you.' },
  { result: 'safe', text: 'You cross in the dark, quickly but not desperately, and reach the far side. The delay cost time, but you are alive and unbroken.' },
  { result: 'near-miss', text: 'A horn blares. Wind slams your flank as metal passes close enough to touch. Your heart hammers as you reach the far side, alive by a margin measured in inches.' },
  { result: 'near-miss', text: 'Headlights pin you mid-crossing. The vehicle swerves, tires screaming, and passes so close you feel its heat. You scramble to the far ditch, trembling.' },
  { result: 'hit', text: 'The impact comes without warning — a wall of force that lifts you off your hooves and spins the world into a blur of pain and light and darkness.' },
  { result: 'hit', text: 'Metal meets bone. The sound is smaller than you\'d expect. Then the ground rushes up, and the pain arrives, and the night goes very quiet.' },
];

// ── Winter Yard Arrival ──

export const WINTER_YARD_ARRIVAL: string[] = [
  'The hemlock valley opens before you, dark and sheltered, the ancient trees forming a living windbreak. The packed snow is marked by dozens of hoofprints — other deer have already arrived.',
  'You push through the last ridge of deep snow and descend into the traditional wintering grounds. The air is warmer here, shielded from the wind, and the scent of other deer is everywhere.',
  'The yard is as your inherited memory promised: dense conifer cover, packed trails between feeding areas, and the warmth of many bodies in a sheltered place.',
];

// ── Spring Departure ──

export interface DepartureFragment {
  condition: 'good' | 'poor' | 'critical';
  text: string;
}

export const SPRING_DEPARTURES: DepartureFragment[] = [
  { condition: 'good', text: 'You are thinner than autumn, but the core of your strength survived the winter. The journey home will restore what the yard took.' },
  { condition: 'poor', text: 'Winter has hollowed you out. Your ribs are visible, your haunches gaunt. But the green is calling, and with it, the promise of recovery.' },
  { condition: 'critical', text: 'You are barely alive. The winter yard\'s browse ran out weeks ago. The walk north may be the last thing you do — but staying is certain death.' },
];

// ── Utility ──

export function pickMigrationUrge(season: string, rng: Rng): MigrationUrgeFragment {
  const candidates = MIGRATION_URGES.filter((f) => f.season === season);
  if (candidates.length === 0) return MIGRATION_URGES[0];
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickRoute(routeType: string, rng: Rng): RouteFragment {
  const candidates = ROUTE_DESCRIPTIONS.filter((f) => f.routeType === routeType || f.routeType === 'any');
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickRoadCrossing(timeOfDay: string, rng: Rng): RoadCrossingFragment {
  let candidates = ROAD_CROSSINGS.filter((f) => f.timeOfDay === timeOfDay);
  if (candidates.length === 0) {
    candidates = ROAD_CROSSINGS.filter((f) => f.timeOfDay === 'any');
  }
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickCrossingOutcome(result: 'safe' | 'near-miss' | 'hit', rng: Rng): CrossingOutcome {
  const candidates = CROSSING_OUTCOMES.filter((f) => f.result === result);
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickDeparture(bcs: number, rng: Rng): DepartureFragment {
  const condition: DepartureFragment['condition'] =
    bcs >= 3 ? 'good' : bcs >= 2 ? 'poor' : 'critical';
  const candidates = SPRING_DEPARTURES.filter((f) => f.condition === condition);
  return candidates[rng.int(0, candidates.length - 1)];
}

export function pickFrom(pool: string[], rng: Rng): string {
  return pool[rng.int(0, pool.length - 1)];
}
