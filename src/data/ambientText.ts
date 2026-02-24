import type { Season } from '../types/world';

export interface AmbientTextEntry {
  id: string;
  text: string;
  /** Restrict to specific seasons */
  seasons?: Season[];
  /** Restrict to specific species */
  speciesIds?: string[];
  /** Restrict to specific regions */
  regionIds?: string[];
  /** Restrict to specific weather types */
  weatherTypes?: string[];
  /** Selection weight (default 1) */
  weight?: number;
}

export const AMBIENT_TEXTS: AmbientTextEntry[] = [
  // ── Spring ──
  { id: 'spring-1', text: 'Buds swell on every branch, and the air is thick with the promise of new growth.', seasons: ['spring'] },
  { id: 'spring-2', text: 'Meltwater gurgles beneath the softening earth, feeding roots that have waited all winter.', seasons: ['spring'] },
  { id: 'spring-3', text: 'Birdsong fills the canopy in overlapping waves, each species staking its claim on the morning.', seasons: ['spring'] },
  { id: 'spring-4', text: 'A warm breeze carries the scent of damp soil and unfurling ferns.', seasons: ['spring'] },
  { id: 'spring-5', text: 'Pale green shoots push through last year\'s leaf litter, fragile and determined.', seasons: ['spring'] },
  { id: 'spring-6', text: 'The days stretch longer now, and the forest hums with quiet urgency.', seasons: ['spring'] },

  // ── Summer ──
  { id: 'summer-1', text: 'Heat shimmers above the ground, bending the horizon into liquid glass.', seasons: ['summer'] },
  { id: 'summer-2', text: 'Cicadas drone in an unbroken wall of sound, their rhythm the heartbeat of the season.', seasons: ['summer'] },
  { id: 'summer-3', text: 'Shadows pool like dark water beneath the heavy canopy, offering brief respite from the sun.', seasons: ['summer'] },
  { id: 'summer-4', text: 'Thunderheads build on the horizon, their undersides bruised purple-black.', seasons: ['summer'] },
  { id: 'summer-5', text: 'The air is drowsy with pollen and the sweet rot of overripe fruit.', seasons: ['summer'] },
  { id: 'summer-6', text: 'Every water source draws creatures from miles around, a truce enforced by thirst.', seasons: ['summer'] },

  // ── Autumn ──
  { id: 'autumn-1', text: 'Leaves drift down in slow spirals, each one a small surrender to the turning year.', seasons: ['autumn'] },
  { id: 'autumn-2', text: 'The air carries a sharp edge now — woodsmoke and frost and the last of the wild apples.', seasons: ['autumn'] },
  { id: 'autumn-3', text: 'Geese pass overhead in ragged chevrons, their calls fading into the gray sky.', seasons: ['autumn'] },
  { id: 'autumn-4', text: 'The forest floor is a tapestry of amber, crimson, and gold, ankle-deep and rustling.', seasons: ['autumn'] },
  { id: 'autumn-5', text: 'Acorns drop with soft thuds, and every creature is busy with the arithmetic of winter.', seasons: ['autumn'] },
  { id: 'autumn-6', text: 'Fog gathers in the hollows at dawn, slow to burn off, lending the world a muted hush.', seasons: ['autumn'] },

  // ── Winter ──
  { id: 'winter-1', text: 'Frost glitters on every surface, turning the world into a cathedral of crystal.', seasons: ['winter'] },
  { id: 'winter-2', text: 'Snow muffles all sound. The silence presses in, broken only by the crack of freezing sap.', seasons: ['winter'] },
  { id: 'winter-3', text: 'The wind scours exposed ridgelines, driving needles of ice before it.', seasons: ['winter'] },
  { id: 'winter-4', text: 'Tracks in the snow tell stories the forest keeps secret in other seasons.', seasons: ['winter'] },
  { id: 'winter-5', text: 'Bare branches etch themselves against a sky the color of hammered pewter.', seasons: ['winter'] },
  { id: 'winter-6', text: 'The land holds its breath beneath the snow, waiting for a thaw that seems impossibly far away.', seasons: ['winter'] },

  // ── Weather-specific ──
  { id: 'rain-1', text: 'Rain drums steadily on the canopy above, a thousand tiny percussions.', weatherTypes: ['rain'] },
  { id: 'rain-2', text: 'The earth drinks deeply, and every leaf wears a trembling jewel of water.', weatherTypes: ['rain'] },
  { id: 'storm-1', text: 'Lightning forks across the sky, and thunder rolls through your bones.', weatherTypes: ['storm'] },
  { id: 'storm-2', text: 'The wind howls through the trees, bending trunks that have stood for decades.', weatherTypes: ['storm'] },
  { id: 'snow-1', text: 'Snowflakes descend in fat, lazy spirals, softening every edge and angle.', weatherTypes: ['snow'] },
  { id: 'fog-1', text: 'Fog erases the world beyond a few body lengths, muffling sound and sight alike.', weatherTypes: ['fog'] },
  { id: 'clear-1', text: 'The sky is painfully clear, a blue so deep it seems to have weight.', weatherTypes: ['clear'] },

  // ── Deer-specific ──
  { id: 'deer-spring-1', text: 'New velvet itches on your growing antlers, soft and warm with blood.', speciesIds: ['white-tailed-deer'], seasons: ['spring'] },
  { id: 'deer-autumn-1', text: 'The rut hangs in the air — musk and adrenaline and the clatter of antlers in the distance.', speciesIds: ['white-tailed-deer'], seasons: ['autumn'] },
  { id: 'deer-winter-1', text: 'Your winter coat is thick and hollow-haired, each fiber a tiny insulator against the cold.', speciesIds: ['white-tailed-deer'], seasons: ['winter'] },

  // ── Elephant-specific ──
  { id: 'elephant-1', text: 'Dust rises in great plumes as the herd moves, each footfall a small earthquake.', speciesIds: ['african-elephant'] },
  { id: 'elephant-2', text: 'The rumble of infrasound passes through the ground — a message from a herd miles distant.', speciesIds: ['african-elephant'] },
  { id: 'elephant-dry-1', text: 'The baobabs stand like sentinels, their swollen trunks hoarding the last of the season\'s water.', speciesIds: ['african-elephant'], seasons: ['winter'] },

  // ── Salmon-specific ──
  { id: 'salmon-1', text: 'The current speaks in a language older than memory, pulling you toward something you cannot name.', speciesIds: ['chinook-salmon'] },
  { id: 'salmon-2', text: 'Shafts of light pierce the green water, illuminating drifting motes of sediment like tiny stars.', speciesIds: ['chinook-salmon'] },

  // ── Wolf-specific ──
  { id: 'wolf-1', text: 'The pack moves as one body through the snow, each wolf stepping in the tracks of the one before.', speciesIds: ['gray-wolf'], seasons: ['winter'] },
  { id: 'wolf-2', text: 'A howl rises from somewhere beyond the treeline, and every nerve in your body answers.', speciesIds: ['gray-wolf'] },

  // ── Polar bear-specific ──
  { id: 'polar-1', text: 'The sea ice groans and shifts beneath you, a living floor of frozen ocean.', speciesIds: ['polar-bear'] },
  { id: 'polar-2', text: 'Northern lights ripple across the sky in curtains of green and violet.', speciesIds: ['polar-bear'], seasons: ['winter'] },

  // ── Sea turtle-specific ──
  { id: 'turtle-1', text: 'Sunlight dapples the seafloor through swaying seagrass, casting patterns that shift like dreams.', speciesIds: ['green-sea-turtle'] },
  { id: 'turtle-2', text: 'A current carries you effortlessly, warm and steady as a river in the open ocean.', speciesIds: ['green-sea-turtle'] },

  // ── Monarch butterfly-specific ──
  { id: 'monarch-1', text: 'The wind is a vast, invisible river, and you ride its currents like a leaf made conscious.', speciesIds: ['monarch-butterfly'] },
  { id: 'monarch-2', text: 'Milkweed sways in the meadow below, its flowers like tiny pink crowns.', speciesIds: ['monarch-butterfly'], seasons: ['summer'] },

  // ── Octopus-specific ──
  { id: 'octopus-1', text: 'Light refracts through the water in shifting prisms, painting the reef in impossible colors.', speciesIds: ['common-octopus'] },
  { id: 'octopus-2', text: 'The reef clicks and pops with the sounds of a thousand hidden lives.', speciesIds: ['common-octopus'] },

  // ── Honeybee-specific ──
  { id: 'bee-1', text: 'The hive hums with a low, warm vibration — ten thousand sisters breathing as one.', speciesIds: ['honeybee-worker'] },
  { id: 'bee-2', text: 'Sunlight slants through the hive entrance, turning the air gold with drifting pollen.', speciesIds: ['honeybee-worker'] },

  // ── Fig wasp-specific ──
  { id: 'figwasp-1', text: 'The interior of the fig is a warm, dark universe, close and sweet with ripening fruit.', speciesIds: ['fig-wasp'] },
  { id: 'figwasp-2', text: 'Chemical signals drift through the air — volatile compounds from a fig tree, faint but unmistakable.', speciesIds: ['fig-wasp'] },

  // ── Savanna/African regions ──
  { id: 'savanna-1', text: 'The savanna stretches to the horizon, golden grass rippling like an inland sea.', regionIds: ['east-african-savanna'] },
  { id: 'savanna-summer-1', text: 'Termite mounds rise like red cathedrals from the baked earth.', regionIds: ['east-african-savanna'], seasons: ['summer'] },

  // ── Marine/Reef regions ──
  { id: 'reef-1', text: 'Coral polyps extend their tiny tentacles into the current, feeding on the drift of plankton.', regionIds: ['mediterranean-reef', 'hawaiian-reef'] },

  // ── Arctic/Polar regions ──
  { id: 'arctic-1', text: 'The ice stretches endlessly, white meeting white at a seam where sky becomes ground.', regionIds: ['hudson-bay-coast', 'arctic-breeding-colony', 'antarctic-pack-ice-edge'] },

  // ── General (no conditions — fill gaps) ──
  { id: 'general-1', text: 'The world turns on its ancient axis, indifferent and beautiful.', weight: 0.5 },
  { id: 'general-2', text: 'Somewhere distant, a sound you cannot identify breaks the silence, then fades.', weight: 0.5 },
  { id: 'general-3', text: 'The light shifts, and for a moment everything looks unfamiliar.', weight: 0.5 },
  { id: 'general-4', text: 'Time passes with the steady rhythm of breath and heartbeat.', weight: 0.5 },
];
