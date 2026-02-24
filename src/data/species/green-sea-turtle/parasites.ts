import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const GREEN_SEA_TURTLE_PARASITES: Record<string, ParasiteDefinition> = {
  fibropapillomatosis: {
    id: 'fibropapillomatosis',
    name: 'Fibropapillomatosis',
    scientificName: 'Chelonid herpesvirus 5',
    description:
      'A devastating tumor-forming disease caused by a herpesvirus specific to sea turtles. It produces cauliflower-like growths on the skin, eyes, and internal organs. Widespread in warm tropical waters, it is one of the greatest threats to green sea turtle populations worldwide.',
    transmissionMethod: 'Waterborne viral particles, possibly vectored by parasitic leeches in degraded coastal habitats',
    affectedSpecies: ['green-sea-turtle'],
    stages: [
      {
        severity: 'minor',
        description: 'A few small, pale tumors have appeared on your skin — rubbery growths no larger than a coin. They do not yet impair your movement or vision, but your immune system is responding to the viral invasion.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.12,
        remissionChance: 0.10,
      },
      {
        severity: 'moderate',
        description: 'Multiple tumors have spread across your flippers, neck, and around your eyes. Some are beginning to obstruct your peripheral vision. Swimming requires more effort as the growths increase drag and restrict flipper movement.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.ADV, amount: 8 },
        ],
        secondaryEffects: ['impaired vision', 'reduced swimming efficiency'],
        turnDuration: { min: 4, max: 12 },
        progressionChance: 0.10,
        remissionChance: 0.05,
      },
      {
        severity: 'severe',
        description: 'Large tumors cover your eyes, blocking most of your vision. Internal tumors are growing on your kidneys and lungs. You struggle to find food, and every breath feels labored. Foraging has become a matter of blind groping along the seabed.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.WIS, amount: -10 },
        ],
        secondaryEffects: ['near-blindness', 'organ compromise', 'severe foraging impairment'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.08,
        remissionChance: 0.02,
      },
      {
        severity: 'critical',
        description: 'Systemic fibropapillomatosis. Tumors have infiltrated your lungs, liver, and kidneys. You float listlessly at the surface, unable to dive effectively. Your immune system has collapsed under the viral load. Without intervention that will never come in the wild, organ failure is approaching.',
        statEffects: [
          { stat: StatId.HEA, amount: -30 },
          { stat: StatId.IMM, amount: 25 },
        ],
        secondaryEffects: ['organ failure risk', 'buoyancy disorder', 'starvation risk'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'barnacle-overload': {
    id: 'barnacle-overload',
    name: 'Barnacle Overload',
    scientificName: 'Chelonibia testudinaria',
    description:
      'A heavy infestation of turtle barnacles that attach to the carapace, plastron, and skin. While a moderate barnacle load is normal, excessive colonization indicates a weakened or lethargic turtle and further impairs swimming by increasing hydrodynamic drag.',
    transmissionMethod: 'Larval settlement from surrounding water, accelerated by reduced swimming activity or poor health',
    affectedSpecies: ['green-sea-turtle'],
    stages: [
      {
        severity: 'minor',
        description: 'Your shell carries a heavier-than-normal load of barnacles. They cluster along the trailing edge of your carapace and on your rear flippers, adding drag and extra weight. You feel slightly sluggish in the water.',
        statEffects: [
          { stat: StatId.HOM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.10,
        remissionChance: 0.20,
      },
      {
        severity: 'moderate',
        description: 'Barnacles encrust nearly every surface of your shell and have colonized the soft skin of your neck and flippers. Swimming is noticeably harder — you must work your flippers more vigorously to maintain speed. The constant drag is exhausting and you find yourself resting more often.',
        statEffects: [
          { stat: StatId.HEA, amount: -6 },
          { stat: StatId.HOM, amount: 10 },
          { stat: StatId.CLI, amount: 5 },
        ],
        secondaryEffects: ['impaired swimming', 'increased energy expenditure'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0,
        remissionChance: 0.12,
      },
    ],
  },
};
