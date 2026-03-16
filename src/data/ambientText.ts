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
  { id: 'spring-1', text: 'Swelling buds on every branch. Wet bark smell, strong.', seasons: ['spring'] },
  { id: 'spring-2', text: 'Water running under the softening ground. The soil smells different now.', seasons: ['spring'] },
  { id: 'spring-3', text: 'Overlapping calls from the branches overhead, constant, loud.', seasons: ['spring'] },
  { id: 'spring-4', text: 'Warm air carrying damp soil and green growth smell.', seasons: ['spring'] },
  { id: 'spring-5', text: 'Pale shoots pushing through the dead leaf layer.', seasons: ['spring'] },
  { id: 'spring-6', text: 'Longer light. More sound. Everything moving.', seasons: ['spring'] },

  // ── Summer ──
  { id: 'summer-1', text: 'Heat rising off the ground. The air shimmers.', seasons: ['summer'] },
  { id: 'summer-2', text: 'Steady droning from the branches, unbroken, filling the air.', seasons: ['summer'] },
  { id: 'summer-3', text: 'Dense shade under the heavy canopy. Cooler in the dark patches.', seasons: ['summer'] },
  { id: 'summer-4', text: 'Heavy cloud-shapes building, dark undersides. The air pressure shifts.', seasons: ['summer'] },
  { id: 'summer-5', text: 'Pollen in the air. Sweet rot from fallen fruit somewhere nearby.', seasons: ['summer'] },
  { id: 'summer-6', text: 'Many scent-trails converging on the water source.', seasons: ['summer'] },

  // ── Autumn ──
  { id: 'autumn-1', text: 'Dry leaves falling, drifting. They crunch underfoot.', seasons: ['autumn'] },
  { id: 'autumn-2', text: 'Cold edge to the air. Smoke smell from somewhere. Frost at dawn.', seasons: ['autumn'] },
  { id: 'autumn-3', text: 'Calls overhead, many, moving in one direction. Fading.', seasons: ['autumn'] },
  { id: 'autumn-4', text: 'Thick layer of dry leaves on the ground, deep, noisy to walk through.', seasons: ['autumn'] },
  { id: 'autumn-5', text: 'Acorns hitting the ground. The tannin smell is heavy.', seasons: ['autumn'] },
  { id: 'autumn-6', text: 'Wet air in the low places at dawn. Sound muffled. Visibility short.', seasons: ['autumn'] },

  // ── Winter ──
  { id: 'winter-1', text: 'Ice on every surface. The cold bites the thin skin of your ears and legs.', seasons: ['winter'] },
  { id: 'winter-2', text: 'Snow muffles sound. Only the crack of freezing wood breaks the quiet.', seasons: ['winter'] },
  { id: 'winter-3', text: 'Wind across the exposed ridgeline, driving ice particles into your face.', seasons: ['winter'] },
  { id: 'winter-4', text: 'Tracks in the snow. Every path and scent trail visible on the white ground.', seasons: ['winter'] },
  { id: 'winter-5', text: 'Bare branches against a flat gray sky. No cover overhead.', seasons: ['winter'] },
  { id: 'winter-6', text: 'Deep snow. Cold ground. The browse is buried or stripped.', seasons: ['winter'] },

  // ── Weather-specific ──
  { id: 'rain-1', text: 'Rain drumming on the leaves overhead. All ground-scent amplified.', weatherTypes: ['rain'] },
  { id: 'rain-2', text: 'Wet everywhere. Water dripping from every surface.', weatherTypes: ['rain'] },
  { id: 'storm-1', text: 'Bright flash. Then the concussion rolls through your body.', weatherTypes: ['storm'] },
  { id: 'storm-2', text: 'Wind bending the trunks. Branches cracking above.', weatherTypes: ['storm'] },
  { id: 'snow-1', text: 'Flakes drifting down, slow and thick. Sound dampened. Your tracks fill in behind you.', weatherTypes: ['snow'] },
  { id: 'fog-1', text: 'Visibility ends a few body lengths out. Sound displaced. Your ears are more useful than your eyes.', weatherTypes: ['fog'] },
  { id: 'clear-1', text: 'Open sky overhead. No cloud cover. You are visible from above.', weatherTypes: ['clear'] },

  // ── Deer-specific ──
  { id: 'deer-spring-1', text: 'The velvet on your growing antlers itches, warm with blood underneath.', speciesIds: ['white-tailed-deer'], seasons: ['spring'] },
  { id: 'deer-autumn-1', text: 'Buck musk on the wind. Tarsal gland and urine. Antler-clack in the distance.', speciesIds: ['white-tailed-deer'], seasons: ['autumn'] },
  { id: 'deer-winter-1', text: 'Your winter coat holds heat against your body. Snow sits on your back without melting.', speciesIds: ['white-tailed-deer'], seasons: ['winter'] },

  // ── Elephant-specific ──
  { id: 'elephant-1', text: 'The ground shakes with each step of the herd. Dust rises.', speciesIds: ['african-elephant'] },
  { id: 'elephant-2', text: 'A low vibration through the ground, from far away. Others, moving.', speciesIds: ['african-elephant'] },
  { id: 'elephant-dry-1', text: 'The big swollen-trunk growths hold water inside. You can smell it through the bark.', speciesIds: ['african-elephant'], seasons: ['winter'] },

  // ── Salmon-specific ──
  { id: 'salmon-1', text: 'The current pushes against your flank. A chemical trace in the water, faint, familiar.', speciesIds: ['chinook-salmon'] },
  { id: 'salmon-2', text: 'Light from above cuts into the green water. Particles drift in the beams.', speciesIds: ['chinook-salmon'] },

  // ── Wolf-specific ──
  { id: 'wolf-1', text: 'Single file through the snow. Your paws land in the tracks of the one ahead.', speciesIds: ['gray-wolf'], seasons: ['winter'] },
  { id: 'wolf-2', text: 'A howl from beyond the ridge. Your throat tightens and the sound rises in you before you choose it.', speciesIds: ['gray-wolf'] },

  // ── Polar bear-specific ──
  { id: 'polar-1', text: 'The ice shifts under your weight. A low groan through the surface. Salt smell from the cracks.', speciesIds: ['polar-bear'] },
  { id: 'polar-2', text: 'Faint shifting light overhead, green, rippling. The snow reflects it.', speciesIds: ['polar-bear'], seasons: ['winter'] },

  // ── Sea turtle-specific ──
  { id: 'turtle-1', text: 'Light through the water onto the bottom. Grass-shapes swaying in the current.', speciesIds: ['green-sea-turtle'] },
  { id: 'turtle-2', text: 'Warm current carrying you. Steady pressure against your shell.', speciesIds: ['green-sea-turtle'] },

  // ── Monarch butterfly-specific ──
  { id: 'monarch-1', text: 'Wind lifts you. Your wings catch the moving air and you drift without effort.', speciesIds: ['monarch-butterfly'] },
  { id: 'monarch-2', text: 'Chemical pull from the flowering plants below. Strong, specific.', speciesIds: ['monarch-butterfly'], seasons: ['summer'] },

  // ── Octopus-specific ──
  { id: 'octopus-1', text: 'Light shifts through the water, bending. Chemical traces from every direction.', speciesIds: ['common-octopus'] },
  { id: 'octopus-2', text: 'Clicking, popping from the hard surfaces around you. Vibrations in the water.', speciesIds: ['common-octopus'] },

  // ── Honeybee-specific ──
  { id: 'bee-1', text: 'Vibration from every surface of the hive. Warm. Chemical signals dense in the air.', speciesIds: ['honeybee-worker'] },
  { id: 'bee-2', text: 'Light at the entrance. Pollen particles suspended in the warm air.', speciesIds: ['honeybee-worker'] },

  // ── Fig wasp-specific ──
  { id: 'figwasp-1', text: 'Warm, dark, close. The chemical gradient is everything. You follow it.', speciesIds: ['fig-wasp'] },
  { id: 'figwasp-2', text: 'Volatile compounds on the air, from a distance. The pull is specific and strong.', speciesIds: ['fig-wasp'] },

  // ── Savanna/African regions ──
  { id: 'savanna-1', text: 'Dry grass to the horizon. Hot wind. Dust.', regionIds: ['east-african-savanna'] },
  { id: 'savanna-summer-1', text: 'Tall mounds of baked earth rising from the ground. Insects moving on the surfaces.', regionIds: ['east-african-savanna'], seasons: ['summer'] },

  // ── Marine/Reef regions ──
  { id: 'reef-1', text: 'Small soft things extending from the hard surfaces, swaying in the current. Food particles drifting past.', regionIds: ['mediterranean-reef', 'hawaiian-reef'] },

  // ── Arctic/Polar regions ──
  { id: 'arctic-1', text: 'White ground meeting white sky. No edge between them. Wind.', regionIds: ['hudson-bay-coast', 'arctic-breeding-colony', 'antarctic-pack-ice-edge'] },

  // ── General (no conditions — fill gaps) ──
  { id: 'general-1', text: 'A sound you do not recognize, distant. Then gone.', weight: 0.5 },
  { id: 'general-2', text: 'The light shifts. For a moment the shapes around you look different.', weight: 0.5 },
  { id: 'general-3', text: 'Stillness. Your ears turn, sampling. Nothing.', weight: 0.5 },
  { id: 'general-4', text: 'Breathing. Heartbeat. The ground under you.', weight: 0.5 },
];
