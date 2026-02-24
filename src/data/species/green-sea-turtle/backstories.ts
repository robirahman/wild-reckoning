import type { Backstory } from '../../../types/species';

export const GREEN_SEA_TURTLE_BACKSTORIES: Backstory[] = [
  {
    type: 'open-ocean-survivor',
    label: 'Open Ocean Survivor',
    description:
      'You spent your first fifteen years in the open ocean, drifting with Sargassum mats and feeding on whatever the currents brought you. Most of your siblings were eaten within hours of hatching. You survived the gauntlet of frigatebirds, the open water predators, and the years of solitary wandering through featureless blue. Now you have returned to the coastal shallows, a sub-adult grazing on seagrass meadows for the first time. The reef is a revelation after years of nothing but open water.',
    monthsSinceEvent: 12,
    statAdjustments: [
      { stat: 'WIS', amount: 5 },
      { stat: 'HEA', amount: 5 },
    ],
  },
  {
    type: 'rescued-from-net',
    label: 'Rescued from Net',
    description:
      'Six months ago, you became entangled in a ghost net — a discarded fishing net drifting through open water. The monofilament cut into your left front flipper and wrapped around your neck, slowly tightening as you struggled. A marine rescue team found you floating at the surface, too exhausted to dive. They cut you free, treated your wounds, and released you with a notch in your shell for identification. The scars on your flipper are still visible, and the memory of being unable to move haunts your dives.',
    monthsSinceEvent: 6,
    statAdjustments: [
      { stat: 'TRA', amount: 10 },
      { stat: 'ADV', amount: 8 },
      { stat: 'NOV', amount: 5 },
    ],
  },
  {
    type: 'satellite-tracked',
    label: 'Satellite Tracked',
    description:
      'Marine biologists captured you on a nesting beach and fitted a satellite transmitter to your carapace. You are twenty-five years old and have been tracked for three nesting seasons. The device is a minor annoyance — a hard lump on your shell that slightly increases drag when you swim — but you have learned to compensate. The researchers have mapped your migration routes, your feeding grounds, and your fidelity to this particular stretch of coastline. You are, without knowing it, one of the most studied turtles in the Caribbean.',
    monthsSinceEvent: 0,
    statAdjustments: [
      { stat: 'WIS', amount: 8 },
      { stat: 'HOM', amount: 3 },
    ],
  },
];
