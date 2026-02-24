import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const HONEYBEE_WORKER_PARASITES: Record<string, ParasiteDefinition> = {
  'varroa-mite': {
    id: 'varroa-mite',
    name: 'Varroa Mite',
    scientificName: 'Varroa destructor',
    description: 'The most devastating parasite in apiculture. This external mite feeds on the fat body of developing pupae and adult bees, weakening their immune system and vectoring lethal viruses. A single mite can reduce a worker\'s lifespan by half. Unchecked, Varroa will collapse an entire colony within two years.',
    transmissionMethod: 'Direct contact in the hive; reproductive mites invade brood cells before capping',
    affectedSpecies: ['honeybee-worker'],
    stages: [
      {
        severity: 'minor',
        description: 'A single mite clings to your thorax, feeding on your fat body. You can feel the tiny puncture wound but your immune system is holding.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
          { stat: StatId.HOM, amount: 4 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.20,
        remissionChance: 0.08,
      },
      {
        severity: 'moderate',
        description: 'Multiple mites are feeding on you. Your fat body is depleted and your immune system is compromised. You are now vulnerable to deformed wing virus and other pathogens the mites carry.',
        statEffects: [
          { stat: StatId.IMM, amount: 16 },
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['immune suppression', 'viral vulnerability'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0.15,
        remissionChance: 0.03,
      },
      {
        severity: 'severe',
        description: 'Your body is riddled with mites and the viruses they carry. Your wings are crumpled from deformed wing virus. You cannot fly. You crawl at the hive entrance, unable to contribute, waiting for the undertaker bees to remove you.',
        statEffects: [
          { stat: StatId.IMM, amount: 25 },
          { stat: StatId.HEA, amount: -25 },
          { stat: StatId.HOM, amount: 18 },
        ],
        secondaryEffects: ['deformed wing virus', 'flightless'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'nosema-ceranae': {
    id: 'nosema-ceranae',
    name: 'Nosema',
    scientificName: 'Nosema ceranae',
    description: 'A microsporidian fungus that infects the gut lining of honeybees. Nosema spores are ingested during feeding and germinate in the midgut, destroying epithelial cells. Infected bees have shorter lifespans, impaired navigation, and reduced foraging efficiency. The disease spreads rapidly through shared food stores.',
    transmissionMethod: 'Ingestion of contaminated food stores or fecal matter within the hive',
    affectedSpecies: ['honeybee-worker'],
    stages: [
      {
        severity: 'minor',
        description: 'A low-level Nosema infection in your gut. Your digestion is slightly impaired but you can still forage and contribute to the hive.',
        statEffects: [
          { stat: StatId.IMM, amount: 6 },
          { stat: StatId.HOM, amount: 4 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0.15,
        remissionChance: 0.10,
      },
      {
        severity: 'moderate',
        description: 'The Nosema spores have multiplied dramatically. Your midgut lining is badly damaged and you are losing nutrients faster than you can absorb them. Your navigation is becoming unreliable — you sometimes forget the way back to the hive.',
        statEffects: [
          { stat: StatId.IMM, amount: 14 },
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.WIS, amount: -8 },
        ],
        secondaryEffects: ['navigational impairment', 'malabsorption'],
        turnDuration: { min: 1, max: 4 },
        progressionChance: 0.12,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Your gut is destroyed. You defecate inside the hive — a sign of terminal infection that alarms your nestmates. Your flight muscles are atrophying. You will not survive another week.',
        statEffects: [
          { stat: StatId.IMM, amount: 22 },
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.WIS, amount: -15 },
        ],
        secondaryEffects: ['hive contamination', 'terminal dysentery'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'deformed-wing-virus': {
    id: 'deformed-wing-virus',
    name: 'Deformed Wing Virus',
    scientificName: 'Deformed wing virus (DWV)',
    description: 'A devastating RNA virus vectored primarily by Varroa mites. DWV infects developing pupae and causes wing deformities, shortened abdomens, and cognitive impairment. Symptomatic bees cannot fly and are rapidly ejected from the hive by undertaker bees.',
    transmissionMethod: 'Injection by Varroa mites during feeding; also transmitted via contaminated royal jelly',
    affectedSpecies: ['honeybee-worker'],
    stages: [
      {
        severity: 'minor',
        description: 'A low viral load. Your wings developed normally but you feel slightly weaker than your sisters. The virus is replicating slowly in your tissues.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.18,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description: 'The virus is attacking your flight muscles and nervous system. Your wings vibrate unevenly and your flight is labored. Navigation is becoming difficult. The colony can sense something is wrong with you.',
        statEffects: [
          { stat: StatId.IMM, amount: 15 },
          { stat: StatId.HEA, amount: -12 },
          { stat: StatId.ADV, amount: 10 },
        ],
        secondaryEffects: ['impaired flight', 'muscular degeneration'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0.14,
        remissionChance: 0.03,
      },
      {
        severity: 'severe',
        description: 'Your wings are crumpled and useless. You cannot fly. You crawl at the hive entrance, a liability to the colony. The undertaker bees are circling. Soon they will drag you out.',
        statEffects: [
          { stat: StatId.IMM, amount: 24 },
          { stat: StatId.HEA, amount: -28 },
          { stat: StatId.ADV, amount: 18 },
        ],
        secondaryEffects: ['flightless', 'colony ejection risk'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0,
      },
    ],
  },
};
