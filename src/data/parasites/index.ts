import type { ParasiteDefinition } from '../../types/health';
import { StatId } from '../../types/stats';

export const parasiteDefinitions: Record<string, ParasiteDefinition> = {
  'gi-roundworm': {
    id: 'gi-roundworm',
    name: 'GI Roundworm',
    scientificName: 'Haemonchus contortus',
    description: 'A blood-feeding nematode that attaches to the abomasal lining, causing progressive anemia and protein loss.',
    transmissionMethod: 'Ingesting larvae from contaminated vegetation',
    affectedSpecies: ['white-tailed-deer'],
    stages: [
      {
        severity: 'minor',
        description: 'A small population of roundworms has established in your gut. Nutritive efficiency is slightly reduced.',
        statEffects: [
          { stat: StatId.HOM, amount: 8 },
          { stat: StatId.HEA, amount: -3 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.2,
        remissionChance: 0.1,
      },
      {
        severity: 'moderate',
        description: 'The roundworm population is growing. You feel weaker after eating, and your coat is becoming dull.',
        statEffects: [
          { stat: StatId.HOM, amount: 15 },
          { stat: StatId.HEA, amount: -8 },
        ],
        secondaryEffects: ['minor anemia'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.15,
        remissionChance: 0.05,
      },
      {
        severity: 'severe',
        description: 'The roundworm infestation is critical. Food provides little nourishment. You are visibly emaciated and anemic.',
        statEffects: [
          { stat: StatId.HOM, amount: 25 },
          { stat: StatId.HEA, amount: -15 },
        ],
        secondaryEffects: ['leads to helminthiasis'],
        turnDuration: { min: 4, max: 12 },
        progressionChance: 0.1,
        remissionChance: 0.02,
      },
      {
        severity: 'critical',
        description: 'Massive helminth burden. Severe anemia, edema, and organ failure are imminent without intervention.',
        statEffects: [
          { stat: StatId.HOM, amount: 35 },
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

  'meningeal-worm': {
    id: 'meningeal-worm',
    name: 'Meningeal Worm',
    scientificName: 'Parelaphostrongylus tenuis',
    description: 'A nematode whose larvae migrate through the spinal cord and brain. White-tailed deer are the definitive host and usually tolerate it, but it can still cause neurological issues in young or stressed animals.',
    transmissionMethod: 'Accidentally ingesting infected gastropods (slugs/snails) while foraging',
    affectedSpecies: ['white-tailed-deer'],
    stages: [
      {
        severity: 'minor',
        description: 'Larvae have embedded in your meninges. Your immune system is working to contain them.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
        ],
        secondaryEffects: ['minor chance of developing neurodegenerative disease'],
        turnDuration: { min: 6, max: 16 },
        progressionChance: 0.08,
        remissionChance: 0.15,
      },
      {
        severity: 'moderate',
        description: 'The meningeal worm burden is growing. You experience occasional disorientation and loss of coordination.',
        statEffects: [
          { stat: StatId.IMM, amount: 15 },
          { stat: StatId.ADV, amount: 10 },
          { stat: StatId.WIS, amount: -5 },
        ],
        secondaryEffects: ['risk of cerebrospinal nematodiasis'],
        turnDuration: { min: 8, max: 20 },
        progressionChance: 0.05,
        remissionChance: 0.1,
      },
      {
        severity: 'severe',
        description: 'Significant neurological damage. You stumble frequently, lose spatial awareness, and cannot flee effectively.',
        statEffects: [
          { stat: StatId.IMM, amount: 20 },
          { stat: StatId.ADV, amount: 20 },
          { stat: StatId.WIS, amount: -15 },
          { stat: StatId.HEA, amount: -10 },
        ],
        secondaryEffects: ['severe motor impairment', 'high predation vulnerability'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0,
        remissionChance: 0.03,
      },
    ],
  },

  'lone-star-tick': {
    id: 'lone-star-tick',
    name: 'Lone Star Tick',
    scientificName: 'Amblyomma americanum',
    description: 'An aggressive ectoparasite that feeds on blood and can transmit multiple pathogens. Heavy infestations drain energy and suppress immune function.',
    transmissionMethod: 'Walking through tick-heavy brush, tall grass, or forest edge habitat',
    affectedSpecies: ['white-tailed-deer'],
    stages: [
      {
        severity: 'minor',
        description: 'A few ticks have latched on. Minor irritation and immune drain.',
        statEffects: [
          { stat: StatId.IMM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0.15,
        remissionChance: 0.3,
      },
      {
        severity: 'moderate',
        description: 'A growing tick load is suppressing your immune defenses. You are increasingly susceptible to secondary infections.',
        statEffects: [
          { stat: StatId.IMM, amount: 12 },
          { stat: StatId.HEA, amount: -5 },
        ],
        secondaryEffects: ['large increase in susceptibility to infections'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.1,
        remissionChance: 0.2,
      },
      {
        severity: 'severe',
        description: 'Massive tick infestation. Blood loss is significant, and your immune system is critically compromised.',
        statEffects: [
          { stat: StatId.IMM, amount: 22 },
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['anemia risk', 'secondary infection risk'],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0,
        remissionChance: 0.1,
      },
    ],
  },

  'liver-fluke': {
    id: 'liver-fluke',
    name: 'Liver Fluke',
    scientificName: 'Fascioloides magna',
    description: 'A large trematode that migrates through and encysts in the liver, causing progressive hepatic damage.',
    transmissionMethod: 'Ingesting metacercariae on aquatic vegetation near wetlands',
    affectedSpecies: ['white-tailed-deer'],
    stages: [
      {
        severity: 'minor',
        description: 'Immature flukes are migrating through your liver tissue, causing minor inflammation.',
        statEffects: [
          { stat: StatId.HEA, amount: -5 },
          { stat: StatId.HOM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 6, max: 12 },
        progressionChance: 0.12,
        remissionChance: 0.05,
      },
      {
        severity: 'moderate',
        description: 'Adult flukes have encysted in your liver. Fibrosis is developing around the cysts.',
        statEffects: [
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 12 },
        ],
        secondaryEffects: ['hepatic fibrosis'],
        turnDuration: { min: 8, max: 20 },
        progressionChance: 0.06,
        remissionChance: 0.02,
      },
      {
        severity: 'severe',
        description: 'Extensive liver damage from fluke migration and encystment. Liver function is significantly impaired.',
        statEffects: [
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 20 },
          { stat: StatId.IMM, amount: 10 },
        ],
        secondaryEffects: ['liver failure risk'],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'nasal-bot-fly': {
    id: 'nasal-bot-fly',
    name: 'Nasal Bot Fly',
    scientificName: 'Cephenemyia stimulator',
    description: 'Larvae deposited in the nasal passages by adult flies, where they mature and cause respiratory distress.',
    transmissionMethod: 'Adult flies depositing larvae near the nostrils during warmer months',
    affectedSpecies: ['white-tailed-deer'],
    stages: [
      {
        severity: 'minor',
        description: 'First-instar larvae are developing in your nasal passages. Occasional sneezing and mild discomfort.',
        statEffects: [
          { stat: StatId.HOM, amount: 5 },
          { stat: StatId.ADV, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 4, max: 10 },
        progressionChance: 0.2,
        remissionChance: 0.15,
      },
      {
        severity: 'moderate',
        description: 'Larger larvae are obstructing your nasal airways. Breathing is labored, especially during exertion.',
        statEffects: [
          { stat: StatId.HOM, amount: 12 },
          { stat: StatId.ADV, amount: 10 },
          { stat: StatId.HEA, amount: -5 },
        ],
        secondaryEffects: ['reduced flight speed from respiratory stress'],
        turnDuration: { min: 3, max: 8 },
        progressionChance: 0.1,
        remissionChance: 0.25, // Often self-resolving as larvae are sneezed out
      },
    ],
  },
};
