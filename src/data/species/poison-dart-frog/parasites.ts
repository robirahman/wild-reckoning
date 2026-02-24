import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const POISON_DART_FROG_PARASITES: Record<string, ParasiteDefinition> = {
  'chytrid-fungus': {
    id: 'chytrid-fungus',
    name: 'Chytrid Fungus',
    scientificName: 'Batrachochytrium dendrobatidis',
    description: 'The most devastating amphibian pathogen on Earth. Bd infects the keratinized skin cells that amphibians rely on for respiration and osmoregulation. In frogs, the skin is not just a barrier — it is a lung, a kidney, and a chemical defense system. Chytrid disrupts all three. Global declines of hundreds of frog species trace directly to this fungus, spread by human trade in amphibians.',
    transmissionMethod: 'Waterborne zoospores contact permeable skin during pool visits or rain',
    affectedSpecies: ['poison-dart-frog'],
    stages: [
      {
        severity: 'minor',
        description: 'A faint cloudiness has appeared on the skin of your belly and thighs. Your toxin secretion feels slightly diminished.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
          { stat: StatId.HOM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.15,
        remissionChance: 0.10,
      },
      {
        severity: 'moderate',
        description: 'Your skin is thickening and losing its vibrant red coloration. Breathing through your skin has become labored. You are drinking more water but your electrolyte balance is deteriorating. The alkaloid toxins that protect you are leaching away.',
        statEffects: [
          { stat: StatId.IMM, amount: 18 },
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 14 },
        ],
        secondaryEffects: ['impaired cutaneous respiration', 'electrolyte imbalance'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.12,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Your skin is sloughing off in patches. You can no longer regulate sodium and potassium across your skin membrane. Your heart rhythm is erratic. The brilliant warning coloration that kept predators away has faded to a dull orange. You are defenseless and dying.',
        statEffects: [
          { stat: StatId.IMM, amount: 26 },
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.HOM, amount: 20 },
        ],
        secondaryEffects: ['cardiac arrhythmia', 'complete loss of toxin defense'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'frog-nematode': {
    id: 'frog-nematode',
    name: 'Lung Nematode',
    scientificName: 'Rhabdias pseudosphaerocephala',
    description: 'A parasitic roundworm that colonizes the lungs of tropical frogs. Larvae penetrate the skin from contaminated soil and migrate through the body to the lungs, where adult worms feed on blood and tissue. Heavy infections reduce respiratory capacity and leave the frog chronically fatigued.',
    transmissionMethod: 'Skin penetration by larvae in contaminated leaf litter and soil',
    affectedSpecies: ['poison-dart-frog'],
    stages: [
      {
        severity: 'minor',
        description: 'A few nematode larvae have migrated to your lungs. You occasionally wheeze after exertion.',
        statEffects: [
          { stat: StatId.IMM, amount: 6 },
          { stat: StatId.HOM, amount: 4 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 7 },
        progressionChance: 0.14,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description: 'Adult worms are established in both lungs. Your breathing is audibly labored. You tire quickly when calling for mates or fleeing from threats. Your body is diverting energy to immune responses, leaving less for growth.',
        statEffects: [
          { stat: StatId.IMM, amount: 14 },
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['reduced calling ability', 'chronic fatigue'],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.10,
        remissionChance: 0.05,
      },
      {
        severity: 'severe',
        description: 'Your lungs are packed with adult nematodes. Blood-tinged mucus fills your airways. You can barely breathe, let alone call or hunt. Every movement is exhausting. Secondary bacterial infections are setting in.',
        statEffects: [
          { stat: StatId.IMM, amount: 22 },
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 16 },
        ],
        secondaryEffects: ['respiratory failure risk', 'secondary bacterial pneumonia'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0.02,
      },
    ],
  },

  'myxosporidian': {
    id: 'myxosporidian',
    name: 'Myxosporidian Protozoan',
    scientificName: 'Myxobolus sp.',
    description: 'A microscopic protozoan parasite acquired by eating infected prey. Myxosporidian spores form cysts in muscle tissue and internal organs, gradually degrading the host\'s physical condition. In small frogs, even a modest infection can significantly impair mobility and hunting ability.',
    transmissionMethod: 'Ingestion of infected arthropod prey items',
    affectedSpecies: ['poison-dart-frog'],
    stages: [
      {
        severity: 'minor',
        description: 'Small cysts are forming in your leg muscles. You feel slightly stiff when jumping.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
          { stat: StatId.HOM, amount: 3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 6 },
        progressionChance: 0.12,
        remissionChance: 0.10,
      },
      {
        severity: 'moderate',
        description: 'Cysts have spread to your leg muscles and liver. Your jumps are noticeably shorter. Hunting requires more effort as your reaction time has slowed. You are losing weight despite eating regularly.',
        statEffects: [
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 8 },
        ],
        secondaryEffects: ['impaired jumping ability', 'reduced hunting efficiency'],
        turnDuration: { min: 2, max: 4 },
        progressionChance: 0.08,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Your muscles are riddled with protozoan cysts. Your liver is enlarged and failing. You can barely hop, let alone leap to catch prey. Your body is consuming itself to fuel the immune response.',
        statEffects: [
          { stat: StatId.IMM, amount: 20 },
          { stat: StatId.HEA, amount: -18 },
          { stat: StatId.HOM, amount: 14 },
        ],
        secondaryEffects: ['organ failure risk', 'severe muscle wasting'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },
};
