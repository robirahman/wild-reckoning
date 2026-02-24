import type { NPCTemplate } from '../../types/npc';

/** NPC templates keyed by species ID */
export const NPC_TEMPLATES: Record<string, NPCTemplate[]> = {
  'white-tailed-deer': [
    {
      type: 'rival',
      speciesLabel: 'buck',
      namePool: ['Scarface', 'The Old Ten-Point', 'Broken Tine', 'Shadow Buck', 'Red', 'Ghost'],
    },
    {
      type: 'ally',
      speciesLabel: 'doe',
      namePool: ['The Lead Doe', 'Patches', 'Willow', 'Ember', 'Sage', 'Aspen'],
    },
    {
      type: 'predator',
      speciesLabel: 'wolf',
      namePool: ['The Gray Ghost', 'Black Fang', 'The Lone Hunter', 'One-Eye', 'Silvermane'],
    },
    {
      type: 'mate',
      speciesLabel: 'doe',
      namePool: ['Clover', 'Hazel', 'Birch', 'Fern', 'Cedar', 'Maple'],
    },
  ],
  'african-elephant': [
    {
      type: 'rival',
      speciesLabel: 'bull',
      namePool: ['The Scarred Bull', 'Thunder', 'Ironside', 'Dust Devil', 'Big Tusker'],
    },
    {
      type: 'ally',
      speciesLabel: 'cow',
      namePool: ['The Matriarch', 'Gray Mother', 'Wise One', 'Storm Caller', 'River Walker'],
    },
    {
      type: 'predator',
      speciesLabel: 'lion',
      namePool: ['The Dark-Maned One', 'Pride Leader', 'The Stalker', 'Dusk Hunter'],
    },
    {
      type: 'mate',
      speciesLabel: 'bull',
      namePool: ['Kibo', 'Kilimanjaro', 'Ol Tukai', 'Amboseli', 'Tsavo'],
    },
  ],
  'chinook-salmon': [
    {
      type: 'rival',
      speciesLabel: 'male',
      namePool: ['Hook-Jaw', 'The Red One', 'Old Kype', 'Silver Flash', 'Deep Runner'],
    },
    {
      type: 'ally',
      speciesLabel: 'female',
      namePool: ['Bright Scales', 'The Swift One', 'Current Rider', 'Silver Side', 'Deep Diver'],
    },
    {
      type: 'predator',
      speciesLabel: 'bear',
      namePool: ['The Brown Shadow', 'Fishhook', 'River King', 'The Patient One'],
    },
    {
      type: 'mate',
      speciesLabel: 'salmon',
      namePool: ['Silver Current', 'The Red Hen', 'Deep Gravel', 'Swift Run'],
    },
  ],
  'gray-wolf': [
    {
      type: 'rival',
      speciesLabel: 'alpha',
      namePool: ['Ironjaw', 'The Gray Shadow', 'Scar', 'Old Blood', 'Midnight'],
    },
    {
      type: 'ally',
      speciesLabel: 'packmate',
      namePool: ['Swift Runner', 'Ember', 'The Quiet One', 'Frost', 'Birchbark'],
    },
    {
      type: 'predator',
      speciesLabel: 'bear',
      namePool: ['The Grizzled One', 'Honey Paws', 'Ridge Back', 'The Lumber'],
    },
    {
      type: 'mate',
      speciesLabel: 'she-wolf',
      namePool: ['Silver', 'Luna', 'Aspen', 'Storm', 'Willow', 'Mist'],
    },
  ],
  'polar-bear': [
    {
      type: 'rival',
      speciesLabel: 'boar',
      namePool: ['The Scarred Boar', 'Ice Breaker', 'Yellowfang', 'The Old One', 'Tundra King'],
    },
    {
      type: 'ally',
      speciesLabel: 'young bear',
      namePool: ['Snowdrift', 'The Curious One', 'Pale Shadow', 'Frost Walker'],
    },
    {
      type: 'predator',
      speciesLabel: 'human',
      namePool: ['The Hunter', 'The Helicopter', 'The Trapper', 'The Researcher'],
    },
    {
      type: 'mate',
      speciesLabel: 'sow',
      namePool: ['Aurora', 'Blizzard', 'Ice Crystal', 'The White Sow', 'Polar Star'],
    },
  ],
  'green-sea-turtle': [
    {
      type: 'rival',
      speciesLabel: 'bull',
      namePool: ['Mosscap', 'The Old Bull', 'Coral Scar', 'Barnacle Back', 'Deep Current'],
    },
    {
      type: 'ally',
      speciesLabel: 'cow',
      namePool: ['Gentle Tide', 'Shell Sister', 'Seagrass', 'The Ancient One', 'Reef Walker'],
    },
    {
      type: 'predator',
      speciesLabel: 'tiger shark',
      namePool: ['The Shadow Below', 'Stripe', 'The Circler', 'Deep Jaws'],
    },
    {
      type: 'mate',
      speciesLabel: 'bull',
      namePool: ['Driftwood', 'Blue Lagoon', 'The Gentle Giant', 'Tide Rider', 'Coral King'],
    },
  ],
  'monarch-butterfly': [
    {
      type: 'rival',
      speciesLabel: 'male',
      namePool: ['The Bright One', 'Orange Flash', 'Sun Wing', 'The Drifter'],
    },
    {
      type: 'ally',
      speciesLabel: 'female',
      namePool: ['Painted Lady', 'Milkweed Dancer', 'The Quiet Wing', 'Pollen Dust'],
    },
    {
      type: 'predator',
      speciesLabel: 'bird',
      namePool: ['The Oriole', 'Sharp Beak', 'The Grosbeak', 'Sky Stalker'],
    },
    {
      type: 'mate',
      speciesLabel: 'female',
      namePool: ['Amber Wing', 'The Dancer', 'Sunset', 'Golden Dust', 'Meadow'],
    },
  ],
  'fig-wasp': [
    {
      type: 'rival',
      speciesLabel: 'male fig wasp',
      namePool: ['The Big-Jawed One', 'Gall Fighter', 'The Dark One', 'Mandible', 'The Blind Brawler'],
    },
    {
      type: 'ally',
      speciesLabel: 'sibling',
      namePool: ['Gall Neighbor', 'The Early Emerger', 'Pollen Carrier', 'The Other Foundress Line'],
    },
    {
      type: 'predator',
      speciesLabel: 'parasitoid wasp',
      namePool: ['The Long Ovipositor', 'The Driller', 'The Wall-Piercer', 'The Cheater'],
    },
    {
      type: 'mate',
      speciesLabel: 'male',
      namePool: ['The First Emerged', 'Tunnel Maker', 'The Strong One', 'Gall Chewer'],
    },
  ],
};
