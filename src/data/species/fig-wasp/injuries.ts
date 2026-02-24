import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const FIG_WASP_INJURIES: Record<string, InjuryDefinition> = {
  'wing-loss': {
    id: 'wing-loss',
    name: 'Wing Loss',
    bodyParts: [
      'right forewing',
      'left forewing',
      'right hindwing',
      'left hindwing',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'One wing is crumpled and partially torn. Flight is erratic but possible.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 6 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.15,
        permanentDebuffChance: 0.80,
      },
      {
        severity: 'moderate',
        description: 'Both forewings are severely damaged from squeezing through the ostiole. Flight is labored and you cannot gain altitude.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.ADV, amount: 10 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.10,
        permanentDebuffChance: 0.95,
      },
      {
        severity: 'severe',
        description: 'Your wings are gone. Torn off completely as you squeezed through the ostiole into the fig. This is normal — this is how it is supposed to work. You will never fly again. You will never leave this fig. You are where you need to be.',
        statEffects: [
          { stat: StatId.HEA, amount: -5 },
          { stat: StatId.HOM, amount: 8 },
        ],
        baseHealingTime: 99,
        worseningChance: 0,
        permanentDebuffChance: 1.0,
      },
    ],
  },

  'antenna-damage': {
    id: 'antenna-damage',
    name: 'Antenna Damage',
    bodyParts: [
      'right antenna',
      'left antenna',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'The tip of one antenna snapped off during entry. Your chemoreception is slightly reduced.',
        statEffects: [
          { stat: StatId.WIS, amount: -3 },
          { stat: StatId.NOV, amount: 5 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.08,
        permanentDebuffChance: 0.60,
      },
      {
        severity: 'moderate',
        description: 'Both antennae are shortened by half. Your ability to detect fig volatiles and navigate by scent is severely compromised. Finding a receptive fig will be much harder.',
        statEffects: [
          { stat: StatId.WIS, amount: -8 },
          { stat: StatId.NOV, amount: 12 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.05,
        permanentDebuffChance: 0.90,
      },
      {
        severity: 'severe',
        description: 'Your antennae are reduced to stubs. You can barely sense the chemical world around you. Without them, finding a receptive fig is nearly impossible. You are flying blind.',
        statEffects: [
          { stat: StatId.WIS, amount: -15 },
          { stat: StatId.NOV, amount: 20 },
          { stat: StatId.ADV, amount: 15 },
        ],
        baseHealingTime: 99,
        worseningChance: 0,
        permanentDebuffChance: 1.0,
      },
    ],
  },

  'mandible-damage': {
    id: 'mandible-damage',
    name: 'Mandible Damage',
    bodyParts: [
      'left mandible',
      'right mandible',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A chip in one mandible from combat. Chewing is slightly less efficient.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.10,
        permanentDebuffChance: 0.30,
      },
      {
        severity: 'moderate',
        description: 'One mandible is cracked and misaligned from a rival male\'s grip. Tunnel chewing will be painful and slow. You may not be able to create a viable exit tunnel.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 99,
        worseningChance: 0.12,
        permanentDebuffChance: 0.65,
      },
      {
        severity: 'severe',
        description: 'Both mandibles are shattered. A rival male crushed them in combat. You cannot chew through the fig wall. Without a tunnel, the females cannot escape. Your combat loss may doom the entire brood.',
        statEffects: [
          { stat: StatId.HEA, amount: -15 },
          { stat: StatId.HOM, amount: 18 },
          { stat: StatId.ADV, amount: 15 },
        ],
        baseHealingTime: 99,
        worseningChance: 0,
        permanentDebuffChance: 1.0,
      },
    ],
  },
};
