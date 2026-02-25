import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const POLAR_BEAR_PARASITES: Record<string, ParasiteDefinition> = {
  trichinella: {
    id: 'trichinella',
    name: 'Trichinella',
    scientificName: 'Trichinella nativa',
    description:
      'A parasitic roundworm acquired by consuming infected seal or walrus meat. Larvae encyst in muscle tissue, causing progressive gastrointestinal and muscular symptoms. Trichinella nativa is cold-adapted and can survive freezing, making it endemic in Arctic marine mammals.',
    transmissionMethod: 'Ingesting raw seal or walrus meat containing encysted larvae',
    affectedSpecies: ['polar-bear'],
    stages: [
      {
        severity: 'minor',
        description:
          'A mild intestinal infection has established. You experience occasional nausea and loose stools after feeding, but can still hunt effectively.',
        statEffects: [
          { stat: StatId.HOM, amount: 5 },
          { stat: StatId.HEA, amount: -3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.12,
        remissionChance: 0.10,
      },
      {
        severity: 'moderate',
        description:
          'The larvae have migrated from your gut into your muscle tissue. Your limbs ache with every step, and your jaw is stiff and sore. Hunting requires more energy than it should.',
        statEffects: [
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.HEA, amount: -8 },
        ],
        secondaryEffects: ['reduced hunting efficiency', 'muscle inflammation'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.08,
        remissionChance: 0.05,
      },
      {
        severity: 'severe',
        description:
          'Massive larval migration has inflamed your diaphragm and intercostal muscles. Breathing is labored, especially during exertion. Long-distance swimming — essential for reaching distant floes — is now dangerously exhausting.',
        statEffects: [
          { stat: StatId.HOM, amount: 20 },
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.IMM, amount: 10 },
        ],
        secondaryEffects: ['respiratory compromise', 'cardiac inflammation risk', 'swimming impairment'],
        turnDuration: { min: 3, max: 7 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },

  'mange-mites': {
    id: 'mange-mites',
    name: 'Mange Mites',
    scientificName: 'Sarcoptes scabiei',
    description:
      'Sarcoptic mange mites burrow into the skin and cause intense itching, hair loss, and skin thickening. In polar bears, fur loss is particularly dangerous as it compromises insulation in sub-zero temperatures.',
    transmissionMethod: 'Direct contact with infected bears or contaminated den sites',
    affectedSpecies: ['polar-bear'],
    stages: [
      {
        severity: 'minor',
        description:
          'Patches of skin on your muzzle and forelegs itch intensely. You rub against ice ridges for relief, wearing the fur thin in small patches. The irritation is distracting but not debilitating.',
        statEffects: [
          { stat: StatId.IMM, amount: 6 },
          { stat: StatId.HEA, amount: -2 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.10,
        remissionChance: 0.15,
      },
      {
        severity: 'moderate',
        description:
          'Large patches of fur have fallen out, exposing raw, thickened skin to the Arctic wind. Your insulation is compromised and you burn more calories just staying warm. The itching is maddening — you scratch until you bleed.',
        statEffects: [
          { stat: StatId.CLI, amount: 10 },
          { stat: StatId.IMM, amount: 10 },
          { stat: StatId.HEA, amount: -8 },
        ],
        secondaryEffects: ['thermal insulation loss', 'secondary skin infection risk'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0,
        remissionChance: 0.08,
      },
    ],
  },

  'morbillivirus': {
    id: 'morbillivirus',
    name: 'Phocine Distemper',
    scientificName: 'Phocine distemper virus (PDV)',
    description:
      'A morbillivirus closely related to canine distemper that circulates in Arctic seal populations. Polar bears acquire the virus by consuming infected seals. As sea ice melts and bears spend more time near seal haul-outs, exposure rates are increasing. Causes respiratory distress, neurological symptoms, and immune suppression.',
    transmissionMethod: 'Consumption of infected seal tissue or close contact with infected marine mammals',
    affectedSpecies: ['polar-bear'],
    stages: [
      {
        severity: 'minor',
        description:
          'Mild respiratory symptoms. A persistent cough and watery eyes. You feel sluggish after feeding on seal.',
        statEffects: [
          { stat: StatId.IMM, amount: 6 },
          { stat: StatId.HEA, amount: -3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.15,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description:
          'The cough has deepened and breathing is labored. Nasal discharge is thick and constant. Your immune system is weakening, making you susceptible to secondary bacterial infections.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.IMM, amount: 14 },
          { stat: StatId.HOM, amount: 8 },
        ],
        secondaryEffects: ['respiratory distress', 'immune suppression'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.12,
        remissionChance: 0.08,
      },
      {
        severity: 'severe',
        description:
          'Neurological symptoms have appeared: muscle twitching, uncoordinated movements, and episodes of disorientation on the sea ice. Swimming is dangerous — you struggle to coordinate your strokes.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.IMM, amount: 20 },
          { stat: StatId.WIS, amount: -10 },
        ],
        secondaryEffects: ['neurological impairment', 'swimming impairment'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0.10,
        remissionChance: 0.04,
      },
      {
        severity: 'critical',
        description:
          'Severe encephalitis. You are barely conscious, lying on the ice unable to hunt. Pneumonia has set in. The virus has overwhelmed your immune defenses.',
        statEffects: [
          { stat: StatId.HEA, amount: -28 },
          { stat: StatId.IMM, amount: 25 },
          { stat: StatId.WIS, amount: -18 },
        ],
        secondaryEffects: ['encephalitis', 'pneumonia', 'organ failure imminent'],
        turnDuration: { min: 1, max: 4 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },
};
