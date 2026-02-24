import type { ParasiteDefinition } from '../../../types/health';
import { StatId } from '../../../types/stats';

export const FIG_WASP_PARASITES: Record<string, ParasiteDefinition> = {
  'fig-nematode': {
    id: 'fig-nematode',
    name: 'Fig Nematode',
    scientificName: 'Parasitodiplogaster laevigata',
    description: 'A microscopic roundworm that inhabits fig syconia and parasitizes developing fig wasp larvae. The nematode enters the gall and feeds on the larva\'s hemolymph, weakening it during the critical development phase. Heavy infections can prevent successful pupation.',
    transmissionMethod: 'Direct invasion of gall by free-living nematodes within the fig syconium',
    affectedSpecies: ['fig-wasp'],
    stages: [
      {
        severity: 'minor',
        description: 'A few nematodes have entered your gall. You feel a faint drain on your resources, but development continues.',
        statEffects: [
          { stat: StatId.IMM, amount: 8 },
          { stat: StatId.HOM, amount: 5 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 5 },
        progressionChance: 0.20,
        remissionChance: 0.10,
      },
      {
        severity: 'moderate',
        description: 'Multiple nematodes are feeding on your hemolymph. Your development is slowing, and your body is visibly smaller than it should be at this stage. Pupation may be compromised.',
        statEffects: [
          { stat: StatId.IMM, amount: 15 },
          { stat: StatId.HEA, amount: -10 },
          { stat: StatId.HOM, amount: 12 },
        ],
        secondaryEffects: ['delayed development', 'reduced body size'],
        turnDuration: { min: 2, max: 4 },
        progressionChance: 0.15,
        remissionChance: 0.03,
      },
      {
        severity: 'severe',
        description: 'The nematodes have consumed most of your hemolymph reserves. You are emaciated inside the gall, barely alive. If you pupate at all, you will emerge stunted and weak.',
        statEffects: [
          { stat: StatId.IMM, amount: 25 },
          { stat: StatId.HEA, amount: -20 },
          { stat: StatId.HOM, amount: 20 },
        ],
        secondaryEffects: ['failed pupation risk', 'severe developmental damage'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0,
        remissionChance: 0.01,
      },
    ],
  },

  'parasitoid-wasp': {
    id: 'parasitoid-wasp',
    name: 'Non-Pollinating Fig Wasp',
    scientificName: 'Idarnes sp.',
    description: 'A parasitoid wasp that has evolved to exploit the fig-pollinator mutualism without contributing. It drills through the fig wall with a long ovipositor and lays eggs in the galls created by pollinator wasps. Its larvae consume the pollinator larvae, turning the mutualism into a one-sided exploitation.',
    transmissionMethod: 'External oviposition through the fig wall by adult parasitoid females',
    affectedSpecies: ['fig-wasp'],
    stages: [
      {
        severity: 'minor',
        description: 'A parasitoid egg has been deposited near your gall. The larva has not yet reached you, but it is burrowing closer.',
        statEffects: [
          { stat: StatId.ADV, amount: 10 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 4 },
        progressionChance: 0.30,
        remissionChance: 0.08,
      },
      {
        severity: 'moderate',
        description: 'The parasitoid larva has reached your gall and begun feeding on you. It is consuming you from the outside in, gradually replacing you in the gall that was meant to be your nursery.',
        statEffects: [
          { stat: StatId.HEA, amount: -15 },
          { stat: StatId.ADV, amount: 18 },
          { stat: StatId.HOM, amount: 15 },
        ],
        secondaryEffects: ['tissue consumption', 'progressive replacement'],
        turnDuration: { min: 1, max: 3 },
        progressionChance: 0.25,
        remissionChance: 0.01,
      },
      {
        severity: 'severe',
        description: 'The parasitoid has consumed most of your body. A non-pollinating wasp will emerge from your gall instead of you — another free-rider in a system built on cooperation.',
        statEffects: [
          { stat: StatId.HEA, amount: -30 },
        ],
        secondaryEffects: ['fatal parasitism', 'gall takeover'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0,
      },
    ],
  },

  'fungal-infection': {
    id: 'fungal-infection',
    name: 'Fig Cavity Fungus',
    scientificName: 'Fusarium solani',
    description: 'An opportunistic fungus that colonizes the interior of figs, particularly in humid conditions. It invades weakened galls and consumes the developing larvae. In tropical climates, fungal infections can destroy a significant proportion of the wasp brood.',
    transmissionMethod: 'Spore infiltration through damaged gall walls in humid fig interiors',
    affectedSpecies: ['fig-wasp'],
    stages: [
      {
        severity: 'minor',
        description: 'Fungal hyphae are growing on the outer surface of your gall. The infection has not yet penetrated the wall.',
        statEffects: [
          { stat: StatId.IMM, amount: 6 },
        ],
        secondaryEffects: [],
        turnDuration: { min: 2, max: 6 },
        progressionChance: 0.18,
        remissionChance: 0.12,
      },
      {
        severity: 'moderate',
        description: 'The fungus has breached your gall wall. White mycelial threads are growing inside your chamber, consuming the nutritive tissue you depend on.',
        statEffects: [
          { stat: StatId.IMM, amount: 14 },
          { stat: StatId.HEA, amount: -8 },
          { stat: StatId.HOM, amount: 10 },
        ],
        secondaryEffects: ['nutrient deprivation', 'developmental stress'],
        turnDuration: { min: 2, max: 4 },
        progressionChance: 0.12,
        remissionChance: 0.04,
      },
      {
        severity: 'severe',
        description: 'Your gall is completely colonized by fungus. The nutritive tissue is gone, replaced by dense fungal mycelium. You are being digested alive.',
        statEffects: [
          { stat: StatId.IMM, amount: 22 },
          { stat: StatId.HEA, amount: -22 },
          { stat: StatId.HOM, amount: 18 },
        ],
        secondaryEffects: ['gall destruction', 'fatal mycosis'],
        turnDuration: { min: 1, max: 2 },
        progressionChance: 0,
        remissionChance: 0,
      },
    ],
  },
};
