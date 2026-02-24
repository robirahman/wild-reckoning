import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const AFRICAN_ELEPHANT_PARASITES: Record<string, ParasiteDefinition> = {
  'elephant-roundworm': {
    id: 'elephant-roundworm',
    name: 'Elephant Roundworm',
    scientificName: 'Murshidia sp.',
    description:
      'A nematode that colonizes the large intestine of elephants, feeding on gut contents and causing progressive nutritional impairment. Heavy burdens lead to chronic wasting.',
    transmissionMethod: 'Ingesting larvae from contaminated mud or water while digging for water',
    affectedSpecies: ['african-elephant'],
    stages: [
      {
        severity: 'minor',
        description: 'A small population of roundworms has established in your gut. You feel slightly less nourished after meals.',
        statEffects: [
          { stat: StatId.HOM, amount: 5 },
          { stat: StatId.HEA, amount: -3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.15,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description: 'The roundworm burden is growing. Your dung is loose and foul-smelling, and you are losing weight despite eating constantly.',
        statEffects: [
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.HEA, amount: -8 },
        ],
        secondaryEffects: ['reduced nutritive efficiency'],
        turnDuration: { min: 5, max: 12 },
        progressionChance: 0.10,
        remissionChance: 0.06,
      },
      {
        severity: 'severe',
        description: 'Massive roundworm infestation. Your gut is inflamed and barely functional. You eat and eat but gain nothing.',
        statEffects: [
          { stat: StatId.HOM, amount: 22 },
          { stat: StatId.HEA, amount: -15 },
        ],
        secondaryEffects: ['chronic wasting', 'secondary infection risk'],
        turnDuration: { min: 4, max: 8 },
        progressionChance: 0.08,
        remissionChance: 0.02,
      },
      {
        severity: 'critical',
        description: 'Critical helminth burden. Your intestinal lining is severely damaged. Organ failure is approaching.',
        statEffects: [
          { stat: StatId.HOM, amount: 30 },
          { stat: StatId.HEA, amount: -25 },
          { stat: StatId.IMM, amount: 15 },
        ],
        secondaryEffects: ['organ failure risk'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'elephant-tick': {
    id: 'elephant-tick',
    name: 'Elephant Tick',
    scientificName: 'Amblyomma tholloni',
    description:
      'A large, hard-bodied tick that preferentially parasitizes elephants, embedding in thin-skinned areas such as behind the ears, between the legs, and around the anus. Heavy infestations drain blood and suppress immune function.',
    transmissionMethod: 'Contact with tick-infested vegetation or mud at waterholes',
    affectedSpecies: ['african-elephant'],
    stages: [
      {
        severity: 'minor',
        description: 'A handful of ticks have embedded themselves. Minor irritation and immune drain.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
          { stat: StatId.HEA, amount: -2 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 7 },
        progressionChance: 0.15,
        remissionChance: 0.25,
      },
      {
        severity: 'moderate',
        description: 'A heavy tick load is suppressing your immune system. The skin around the attachment sites is inflamed and weeping.',
        statEffects: [
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.HEA, amount: -6 },
        ],
        secondaryEffects: ['increased susceptibility to secondary infections'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.08,
        remissionChance: 0.15,
      },
      {
        severity: 'severe',
        description: 'Massive tick infestation. Blood loss is significant and your immune system is critically compromised. Secondary infections are likely.',
        statEffects: [
          { stat: StatId.IMM, amount: 20 },
          { stat: StatId.HEA, amount: -12 },
        ],
        secondaryEffects: ['anemia risk', 'secondary infection risk'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0,
        remissionChance: 0.08,
      },
    ],
  },

  trypanosomiasis: {
    id: 'trypanosomiasis',
    name: 'Trypanosomiasis',
    scientificName: 'Trypanosoma sp.',
    description:
      'A protozoan blood parasite transmitted by tsetse flies. In elephants it causes progressive lethargy, neurological impairment, and immune suppression. Often called "sleeping sickness" in humans, the elephant form is equally debilitating.',
    transmissionMethod: 'Bite of an infected tsetse fly (Glossina sp.)',
    affectedSpecies: ['african-elephant'],
    stages: [
      {
        severity: 'minor',
        description: 'The parasites are circulating in your blood. You feel unusually tired and your immune system is working overtime.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
          { stat: StatId.HEA, amount: -3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.12,
        remissionChance: 0.08,
      },
      {
        severity: 'moderate',
        description: 'The trypanosomes are crossing the blood-brain barrier. You experience confusion, disorientation, and bouts of lethargy that leave you standing in place for hours.',
        statEffects: [
          { stat: StatId.IMM, amount: 15 },
          { stat: StatId.WIS, amount: -8 },
          { stat: StatId.HEA, amount: -8 },
        ],
        secondaryEffects: ['neurological impairment', 'reduced awareness'],
        turnDuration: { min: 6, max: 14 },
        progressionChance: 0.08,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Severe neurological damage. You stagger when you walk, forget where waterholes are, and can barely keep up with the herd. Your immune system is in collapse.',
        statEffects: [
          { stat: StatId.IMM, amount: 22 },
          { stat: StatId.WIS, amount: -18 },
          { stat: StatId.HEA, amount: -15 },
        ],
        secondaryEffects: ['severe motor impairment', 'high predation vulnerability', 'organ failure risk'],
        turnDuration: { min: 4, max: 8 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },
};
