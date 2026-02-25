/** Phase 5: Ecosystem Web data — predator-prey links and population events */

import type { EcosystemLink, EcosystemEvent } from '../types/ecosystem';

export const ECOSYSTEM_LINKS: EcosystemLink[] = [
  // North American forest & meadow (Shared by Deer, Wolf, Monarch, Bee)
  { predator: 'Gray Wolf', prey: 'White-tailed Deer', regionIds: ['northern-forest', 'great-lakes-forest', 'appalachian-forest'], strength: 0.8 },
  { predator: 'Gray Wolf', prey: 'Elk', regionIds: ['northern-forest'], strength: 0.6 },
  { predator: 'Cougar', prey: 'White-tailed Deer', regionIds: ['northern-forest', 'appalachian-forest'], strength: 0.5 },
  { predator: 'Coyote', prey: 'White-tailed Deer', regionIds: ['northern-forest', 'great-lakes-forest', 'appalachian-forest', 'great-lakes-milkweed'], strength: 0.3 }, // Primarily fawns
  { predator: 'Coyote', prey: 'Rabbit', regionIds: ['northern-forest', 'great-lakes-forest', 'appalachian-forest'], strength: 0.4 },
  { predator: 'White-tailed Deer', prey: 'Milkweed', regionIds: ['great-lakes-milkweed'], strength: 0.1 }, // Accidental consumption
  { predator: 'Monarch Butterfly', prey: 'Milkweed', regionIds: ['great-lakes-milkweed'], strength: 0.6 },
  { predator: 'Honeybee Worker', prey: 'Wildflowers', regionIds: ['great-lakes-milkweed', 'northern-forest'], strength: 0.5 },

  // African savanna
  { predator: 'Lion', prey: 'Zebra', regionIds: ['east-african-savanna', 'amboseli-basin'], strength: 0.7 },
  { predator: 'Lion', prey: 'Wildebeest', regionIds: ['east-african-savanna'], strength: 0.6 },
  { predator: 'Hyena', prey: 'Wildebeest', regionIds: ['east-african-savanna'], strength: 0.5 },
  { predator: 'Leopard', prey: 'Impala', regionIds: ['east-african-savanna', 'amboseli-basin'], strength: 0.5 },

  // Arctic (Shared by Polar Bear, Arctic Tern)
  { predator: 'Polar Bear', prey: 'Ringed Seal', regionIds: ['hudson-bay-coast', 'arctic-sea-ice'], strength: 0.9 },
  { predator: 'Polar Bear', prey: 'Arctic Tern', regionIds: ['arctic-breeding-colony'], strength: 0.3 },
  { predator: 'Arctic Fox', prey: 'Lemming', regionIds: ['hudson-bay-coast', 'arctic-sea-ice'], strength: 0.7 },
  { predator: 'Arctic Fox', prey: 'Arctic Tern', regionIds: ['arctic-breeding-colony'], strength: 0.4 },
  { predator: 'Polar Bear', prey: 'Arctic Fox', regionIds: ['hudson-bay-coast'], strength: 0.2 }, // Occasional predation/competition
  { predator: 'Great Skua', prey: 'Arctic Tern', regionIds: ['arctic-breeding-colony'], strength: 0.5 },

  // Pacific Northwest (Shared by Salmon, Arctic Tern - migration overlap)
  { predator: 'Grizzly Bear', prey: 'Chinook Salmon', regionIds: ['pacific-northwest-river'], strength: 0.6 },
  { predator: 'Bald Eagle', prey: 'Chinook Salmon', regionIds: ['pacific-northwest-river'], strength: 0.4 },
  { predator: 'Arctic Tern', prey: 'Chinook Salmon', regionIds: ['pacific-northwest-river'], strength: 0.2 }, // Terns eat salmon smolts in estuaries

  // Marine
  { predator: 'Great White Shark', prey: 'Green Sea Turtle', regionIds: ['caribbean-reef', 'atlantic-coast'], strength: 0.3 },
  { predator: 'Tiger Shark', prey: 'Green Sea Turtle', regionIds: ['caribbean-reef'], strength: 0.4 },

  // Mediterranean reef (Shared by Octopus)
  { predator: 'Common Octopus', prey: 'Crab', regionIds: ['mediterranean-reef'], strength: 0.7 },
  { predator: 'Moray Eel', prey: 'Common Octopus', regionIds: ['mediterranean-reef'], strength: 0.5 },
  { predator: 'Moray Eel', prey: 'Crab', regionIds: ['mediterranean-reef'], strength: 0.6 },

  // Tropical
  { predator: 'Cat-eyed Snake', prey: 'Poison Dart Frog', regionIds: ['costa-rican-rainforest'], strength: 0.4 },
];

export const ECOSYSTEM_EVENTS: EcosystemEvent[] = [
  // Prey decline narratives
  {
    threshold: -1,
    direction: 'below',
    speciesName: 'White-tailed Deer',
    narrativeText: 'The deer herds in this region have thinned noticeably. Tracks and browse marks are scarce.',
  },
  {
    threshold: -1,
    direction: 'below',
    speciesName: 'Ringed Seal',
    narrativeText: 'Seal breathing holes are harder to find. The ice seems emptier than usual.',
  },
  {
    threshold: -1,
    direction: 'below',
    speciesName: 'Chinook Salmon',
    narrativeText: 'The salmon runs are thin this year. The river feels strangely quiet.',
  },
  {
    threshold: -1,
    direction: 'below',
    speciesName: 'Rabbit',
    narrativeText: 'Rabbit warrens sit empty. The usual rustling in the underbrush has gone silent.',
  },
  {
    threshold: -1,
    direction: 'below',
    speciesName: 'Crab',
    narrativeText: 'The reef\'s crab population is noticeably sparse. Hunting takes longer.',
  },

  // Predator pressure narratives
  {
    threshold: 1,
    direction: 'above',
    speciesName: 'Gray Wolf',
    narrativeText: 'Wolf packs are thriving in the region. Their howls echo more frequently at dusk.',
  },
  {
    threshold: 1,
    direction: 'above',
    speciesName: 'Lion',
    narrativeText: 'Lion prides have grown bold. Multiple prides patrol overlapping territories.',
  },

  // Abundance narratives
  {
    threshold: 1,
    direction: 'above',
    speciesName: 'White-tailed Deer',
    narrativeText: 'Deer are abundant this season. Herds gather in large numbers at feeding grounds.',
  },
  {
    threshold: 1,
    direction: 'above',
    speciesName: 'Wildebeest',
    narrativeText: 'The wildebeest migration is massive this year. The plains darken with their numbers.',
  },

  // Severe decline
  {
    threshold: -2,
    direction: 'below',
    speciesName: 'Ringed Seal',
    narrativeText: 'Seals have almost vanished from these waters. Starvation looms for those who depend on them.',
  },
  {
    threshold: -2,
    direction: 'below',
    speciesName: 'Chinook Salmon',
    narrativeText: 'The salmon run has nearly collapsed. Bears, eagles, and the forest itself will feel the absence.',
  },
];
