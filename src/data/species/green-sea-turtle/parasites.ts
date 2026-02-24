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

  'spirorchid-fluke': {
    id: 'spirorchid-fluke',
    name: 'Spirorchid Blood Fluke',
    scientificName: 'Neospirorchis spp.',
    description:
      'A parasitic blood fluke that infects sea turtles through cercariae released by infected marine snails. The flukes colonize blood vessels in the brain, heart, and major organs, causing inflammation and vascular damage. Spirorchid infections are widespread in wild green sea turtle populations and are a significant contributor to strandings.',
    transmissionMethod: 'Penetration by free-swimming cercariae shed by infected marine snails encountered while foraging on seagrass and reef surfaces',
    affectedSpecies: ['green-sea-turtle'],
    stages: [
      {
        severity: 'minor',
        description: 'A small number of blood flukes have established in your cardiovascular system. Your immune system mounts a response, but the parasites are difficult to dislodge from the blood vessel walls.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.10,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description: 'The fluke population is growing. Eggs deposited in your blood vessels are causing inflammation in your brain and heart. You experience occasional disorientation while navigating and your swimming feels sluggish.',
        statEffects: [
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.WIS, amount: -5 },
          { stat: StatId.HEA, amount: -6 },
        ],
        secondaryEffects: ['vascular inflammation', 'mild neurological impairment'],
        turnDuration: { min: 4, max: 12 },
        progressionChance: 0.08,
        remissionChance: 0.06,
      },
      {
        severity: 'severe',
        description: 'Spirorchid flukes have heavily colonized the blood vessels of your brain and heart. Egg granulomas obstruct blood flow, causing frequent disorientation, impaired diving ability, and cardiovascular stress. You struggle to navigate and forage effectively.',
        statEffects: [
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.WIS, amount: -12 },
          { stat: StatId.HEA, amount: -15 },
        ],
        secondaryEffects: ['severe neurological impairment', 'cardiovascular compromise', 'stranding risk'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },

  'gut-fluke': {
    id: 'gut-fluke',
    name: 'Intestinal Fluke',
    scientificName: 'Cricocephalus spp.',
    description:
      'A trematode parasite that colonizes the intestinal tract of sea turtles. Acquired through ingestion of infected intermediate hosts or contaminated seagrass, gut flukes attach to the intestinal lining and feed on blood and tissue, causing inflammation and reduced nutrient absorption.',
    transmissionMethod: 'Ingesting metacercariae encysted on seagrass blades, algae, or in small invertebrates while foraging',
    affectedSpecies: ['green-sea-turtle'],
    stages: [
      {
        severity: 'minor',
        description: 'A small colony of intestinal flukes has established in your gut. Nutrient absorption is slightly reduced, and you feel hungrier than usual after grazing.',
        statEffects: [
          { stat: StatId.HEA, amount: -3 },
          { stat: StatId.HOM, amount: 4 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 5, max: 12 },
        progressionChance: 0.10,
        remissionChance: 0.08,
      },
      {
        severity: 'moderate',
        description: 'The fluke burden in your intestines is growing. Inflammation along your gut lining is causing persistent discomfort, and your body is losing weight despite regular grazing. Your shell growth has slowed.',
        statEffects: [
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['intestinal inflammation', 'impaired nutrient absorption'],
        turnDuration: { min: 6, max: 16 },
        progressionChance: 0.06,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Massive fluke infestation throughout your intestinal tract. The gut lining is severely inflamed and ulcerated. You are losing weight rapidly despite constant grazing, and secondary bacterial infections are taking hold in the damaged tissue.',
        statEffects: [
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 18 },
          { stat: StatId.IMM, amount: 10 },
        ],
        secondaryEffects: ['severe malnutrition', 'secondary infection risk', 'intestinal ulceration'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },

  'turtle-leech': {
    id: 'turtle-leech',
    name: 'Marine Turtle Leech',
    scientificName: 'Ozobranchus branchiatus',
    description:
      'A marine leech that specifically parasitizes sea turtles, attaching to soft tissue around the neck, flippers, and cloaca. These leeches feed on blood and are suspected vectors for fibropapillomatosis virus. Heavy infestations drain energy and may facilitate the spread of other diseases.',
    transmissionMethod: 'Direct attachment from free-swimming leeches encountered in warm, shallow coastal waters, particularly near resting and foraging areas',
    affectedSpecies: ['green-sea-turtle'],
    stages: [
      {
        severity: 'minor',
        description: 'A few leeches have attached to the soft skin around your neck and flippers. They are a minor irritation, their presence more unsettling than painful.',
        statEffects: [
          { stat: StatId.IMM, amount: 4 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0.12,
        remissionChance: 0.25,
      },
      {
        severity: 'moderate',
        description: 'A growing colony of leeches clusters around your flippers, eyes, and cloaca. The constant blood loss is weakening you, and the bite wounds are becoming inflamed. Cleaning fish at the reef station pick off a few, but more keep coming.',
        statEffects: [
          { stat: StatId.IMM, amount: 10 },
          { stat: StatId.HEA, amount: -5 },
        ],
        secondaryEffects: ['increased susceptibility to fibropapillomatosis', 'blood loss'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.08,
        remissionChance: 0.15,
      },
      {
        severity: 'severe',
        description: 'Your body is covered with leeches — dozens of them clustered on every patch of exposed skin. The blood loss is significant, and the wounds they leave behind are inflamed and infected. Your immune system is critically taxed, leaving you vulnerable to every pathogen in the water.',
        statEffects: [
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 8 },
        ],
        secondaryEffects: ['anemia', 'secondary infection risk', 'high fibropapillomatosis transmission risk'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0,
        remissionChance: 0.08,
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
