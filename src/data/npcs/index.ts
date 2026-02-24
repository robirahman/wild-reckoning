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
  ],
};
