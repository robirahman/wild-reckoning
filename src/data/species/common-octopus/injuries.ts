import type { InjuryDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const COMMON_OCTOPUS_INJURIES: Record<string, InjuryDefinition> = {
  'arm-loss': {
    id: 'arm-loss',
    name: 'Arm Loss',
    bodyParts: [
      'arm-1',
      'arm-2',
      'arm-3',
      'arm-4',
      'arm-5',
      'arm-6',
      'arm-7',
      'arm-8',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'The tip of one arm was bitten off by a moray eel. You pulled free in time. The arm will regenerate over several weeks, but for now your grip is weaker.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 8,
        worseningChance: 0.08,
        permanentDebuffChance: 0.05,
      },
      {
        severity: 'moderate',
        description: 'Half an arm is gone — torn away in a struggle. The wound has sealed itself with a clamp of muscle, but you have lost dozens of suckers and their chemoreceptors. Hunting and manipulating objects is noticeably harder.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.WIS, amount: -5 },
          { stat: StatId.HOM, amount: 8 },
        ],
        baseHealingTime: 14,
        worseningChance: 0.12,
        permanentDebuffChance: 0.15,
      },
      {
        severity: 'severe',
        description: 'An entire arm has been ripped from the base. The wound is a raw crater of white muscle. This will take months to regenerate — if it regenerates at all. You are down to seven arms, and the missing one held your strongest suckers.',
        statEffects: [
          { stat: StatId.HEA, amount: -15 },
          { stat: StatId.WIS, amount: -10 },
          { stat: StatId.HOM, amount: 14 },
        ],
        baseHealingTime: 24,
        worseningChance: 0.05,
        permanentDebuffChance: 0.30,
      },
    ],
  },

  'arm-damage': {
    id: 'arm-damage',
    name: 'Arm Damage',
    bodyParts: [
      'first right arm',
      'first left arm',
      'second right arm',
      'second left arm',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'The distal third of one arm is torn and ragged — bitten during a grappling contest with another male. The suckers at the tip are gone, ripped away along with a strip of pale muscle. You can still taste and grip with the remaining length, but the precision is reduced. The arm will regenerate in time. Your kind has that luxury. But for now, every hunt is slightly clumsier, every grip slightly weaker.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.06,
        permanentDebuffChance: 0.04,
      },
      {
        severity: 'moderate',
        description: 'Half the arm is gone — severed by the beak of a rival male during a vicious territorial grapple. The wound sealed itself within seconds, the muscles clamping shut with the same reflex that allows a severed arm to keep crawling on its own. But the loss is significant. Dozens of chemoreceptive suckers are gone, and with them a substantial portion of your ability to taste the water, manipulate objects, and anchor yourself during a jet escape. Regeneration will take weeks, and the replacement tissue is never quite as sensitive as the original.',
        statEffects: [
          { stat: StatId.HEA, amount: -7 },
          { stat: StatId.WIS, amount: -4 },
          { stat: StatId.HOM, amount: 8 },
        ],
        baseHealingTime: 16,
        worseningChance: 0.08,
        permanentDebuffChance: 0.10,
      },
    ],
  },

  'beak-damage': {
    id: 'beak-damage',
    name: 'Beak Damage',
    bodyParts: [
      'upper beak',
      'lower beak',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A chip in your beak from cracking a particularly hard crab shell. Biting is slightly less efficient.',
        statEffects: [
          { stat: StatId.HEA, amount: -2 },
          { stat: StatId.HOM, amount: 3 },
        ],
        baseHealingTime: 6,
        worseningChance: 0.08,
        permanentDebuffChance: 0.10,
      },
      {
        severity: 'moderate',
        description: 'Your beak is cracked along its length. Every bite sends pain through your body. You can still eat, but breaking into hard-shelled prey is agonizing.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.ADV, amount: 8 },
        ],
        baseHealingTime: 12,
        worseningChance: 0.10,
        permanentDebuffChance: 0.25,
      },
      {
        severity: 'severe',
        description: 'Your beak is shattered. The chitin has split in multiple places and the underlying tissue is exposed. You cannot bite through crab shells at all. You are reduced to hunting soft-bodied prey — if you can find any.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 16 },
          { stat: StatId.ADV, amount: 14 },
        ],
        baseHealingTime: 20,
        worseningChance: 0.06,
        permanentDebuffChance: 0.50,
      },
    ],
  },

  'mantle-puncture': {
    id: 'mantle-puncture',
    name: 'Mantle Puncture',
    bodyParts: [
      'dorsal mantle',
      'ventral mantle',
    ],
    severityLevels: [
      {
        severity: 'minor',
        description: 'A small puncture in your mantle from a moray eel\'s teeth. The wound is superficial but it leaks slightly when you jet, reducing your speed.',
        statEffects: [
          { stat: StatId.HEA, amount: -4 },
          { stat: StatId.ADV, amount: 5 },
        ],
        baseHealingTime: 5,
        worseningChance: 0.12,
        permanentDebuffChance: 0.08,
      },
      {
        severity: 'moderate',
        description: 'A deep tear in your mantle cavity. Water leaks in and out with every breath. Your jet propulsion is compromised — you can\'t generate enough pressure for a proper escape jet. Every predator encounter is now more dangerous.',
        statEffects: [
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.ADV, amount: 12 },
          { stat: StatId.HOM, amount: 8 },
        ],
        baseHealingTime: 10,
        worseningChance: 0.15,
        permanentDebuffChance: 0.20,
      },
      {
        severity: 'severe',
        description: 'Your mantle is torn open. One of your three hearts is visible through the wound. Water floods your gill cavity uncontrollably. You cannot jet at all. You are reduced to crawling along the seafloor, hoping nothing finds you.',
        statEffects: [
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.ADV, amount: 18 },
          { stat: StatId.HOM, amount: 14 },
        ],
        baseHealingTime: 16,
        worseningChance: 0.08,
        permanentDebuffChance: 0.45,
      },
    ],
  },
};
