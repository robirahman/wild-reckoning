import type { Rng } from '../../../engine/RandomUtils';
import type { ContextualFragment } from './shared';

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
  { season: 'autumn', text: 'The first frost silvers the grass at dawn and something ancient tightens in your chest — a cold-triggered clockwork that says: move now, or the snow will bury you where you stand.' },
  { season: 'autumn', text: 'Ice crystals form on the edges of the creek overnight. You wake with your muscles already angled southwest, your body making the decision before your mind catches up.' },
  { season: 'spring', text: 'A warm chinook rolls down from the ridgeline, carrying the scent of bare earth and running water. The wind undoes something the cold had locked inside you, and you lift your head northward.' },
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
  { routeType: 'ancestral', text: 'The mountain pass narrows to a thread of trail between granite walls. Wind funnels through the gap, carrying the faint musk of deer who crossed here weeks before you. The footing is treacherous — loose shale and ice — but the path is certain.' },
  { routeType: 'any', text: 'The valley route follows the river southward, the water a constant murmur at your flank. The terrain is gentle here, the browse plentiful along the banks, but the open ground leaves you exposed to anything watching from the ridges above.' },
  { routeType: 'new', text: 'You follow the river where it bends through unfamiliar bottomland, the current your only compass. The bank is soft and muddy, sucking at your hooves, but the water knows where it is going and you trust its direction.' },
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
  { timeOfDay: 'night', text: 'Rain hammers the asphalt, turning headlights into smeared halos that give no warning of speed or distance. The hiss of tires on wet pavement sounds like the whole road is breathing.' },
  { timeOfDay: 'any', text: 'Fog sits heavy on the road, reducing the world to a gray wall twenty meters deep. You cannot see the vehicles, but you can feel them — the vibration in the ground, the pressure wave of displaced air arriving seconds before the metal does.' },
  { timeOfDay: 'day', text: 'A cold rain slicks the highway, and the vehicles move faster than they should, throwing up curtains of spray. Visibility is poor for you and worse for the drivers. Timing a crossing in this is a matter of sound as much as sight.' },
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
  'You arrive in a whiteout, the snowstorm erasing everything beyond the length of your own body. But the scent is unmistakable — cedar, packed snow, the warm musk of huddled deer. You push toward it blind, and the yard receives you.',
  'The sky is clear and the sun almost warm as you descend into the wintering grounds. Steam rises from the backs of deer already bedded in the shelter of the hemlocks. It feels, impossibly, like arriving home.',
  'Sleet drives sideways through the canopy as you stumble into the yard, ice crusting your coat, your legs trembling from the final push through deep snow. Other deer lift their heads, then look away. Another survivor. The yard makes room.',
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

// ── Travel Hazard Narratives ──

export const TRAVEL_HAZARD_NARRATIVES: ContextualFragment[] = [
  {
    terrain: 'mountain',
    text: 'The pass steepens until you are climbing more than walking, hooves scraping for purchase on bare rock. A shelf of shale shifts under your weight and clatters into the void below. One wrong step and the mountain will swallow you without a sound.',
  },
  {
    terrain: 'mountain',
    text: 'A rockslide has obliterated the trail ahead — a fresh scar of raw granite and uprooted saplings blocking the pass. You pick your way across the debris field, each stone wobbling underfoot, the slope below you steep enough to kill.',
  },
  {
    terrain: 'river',
    text: 'The river is swollen with meltwater, running fast and brown and cold. You wade in and the current seizes your legs immediately, pulling you downstream. Your hooves find the bottom, lose it, find it again. The far bank seems impossibly distant.',
  },
  {
    terrain: 'river',
    text: 'Ice shelves line both banks but the center runs open and black. You step onto the ice and it groans beneath you, then cracks. The plunge into the current is a shock that empties your lungs. You swim, legs churning, until your hooves scrape gravel on the far side.',
  },
  {
    weather: 'storm',
    text: 'The storm arrives mid-crossing of an open ridge, wind slamming into your flank hard enough to stagger you sideways. Snow drives horizontal, filling your eyes and nose. You lower your head and push forward into the white void, navigating by the slope of the ground alone.',
  },
  {
    weather: 'storm',
    text: 'Thunder cracks overhead and the sky opens. Rain comes in sheets so heavy you cannot see the trail. The ground turns to mud beneath your hooves, each step a negotiation with gravity. A flash of lightning reveals the forest edge — still far, too far.',
  },
  {
    text: 'The trail narrows to a ledge above a steep ravine. The drop is sheer, the footing crumbling, and the wind pushes at your ribs with casual malice. You press your shoulder against the rock face and move one careful hoof at a time, not breathing until the path widens again.',
  },
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
