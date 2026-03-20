import type { StorylineDefinition } from '../../types/storyline';
import { StatId } from '../../types/stats';

export const DECISION_ARC_STORYLINES: StorylineDefinition[] = [
  // ── The Wounded Stranger (all species) ──
  {
    id: 'wounded-stranger',
    name: 'The Wounded Stranger',
    speciesIds: [],
    startConditions: [
      { type: 'age_range', min: 6 },
    ],
    startChance: 0.10,
    tags: ['social'],
    steps: [
      // Step 0: Discovery — active choice
      {
        id: 'wounded-stranger-discover',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'The signs of distress reach you before the sight. One of your kind, ahead, struggling. Its body labors with each breath.',
        statEffects: [],
        consequences: [],
        completionFlag: 'storyline-wounded-stranger-discovered',
        choices: [
          {
            id: 'help',
            label: 'Help the stranger',
            description: 'Move closer. Stay near.',
            narrativeResult: 'You step closer. The injured one flinches, then goes still as your scent registers. You settle nearby, body heat bleeding across the gap between you.',
            statEffects: [
              { stat: StatId.ADV, amount: -3, duration: 6, label: '-ADV (reduced vigilance)' },
              { stat: StatId.HEA, amount: -3, duration: 4, label: '-HEA (exhausting care)' },
            ],
            consequences: [],
            revocable: false,
            style: 'default',
          },
          {
            id: 'ignore',
            label: 'Move on',
            description: 'Keep moving. Do not stop.',
            narrativeResult: 'You turn and walk. Behind you, the injured one\'s breathing: fast, gurgling. Each step you take, quieter.',
            statEffects: [
              { stat: StatId.ADV, amount: 3, duration: 4, label: '+ADV (self-preservation)' },
            ],
            consequences: [],
            revocable: false,
            style: 'default',
          },
        ],
        branchMap: { 'help': 2, 'ignore': 1 },
      },
      // Step 1: Ignore conclusion (branch target for 'ignore')
      {
        id: 'wounded-stranger-forgotten',
        delayMin: 2,
        delayMax: 4,
        narrativeText: 'Days pass. The smell of that place does not return to you. Whatever happened there is behind you now.',
        statEffects: [],
        consequences: [],
        completionFlag: 'storyline-wounded-stranger-ignore',
      },
      // Step 2: Help conclusion (branch target for 'help')
      {
        id: 'wounded-stranger-reunion',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'A familiar scent on a trail you use often. The one you stayed with is moving again, upright and feeding. It approaches without alarm, no tension in its gait, no stress smell. You tolerate the closeness.',
        statEffects: [
          { stat: StatId.ADV, amount: -5, duration: 8, label: '-ADV (familiar ally nearby)' },
        ],
        consequences: [
          { type: 'introduce_npc', npcType: 'ally' },
        ],
        completionFlag: 'storyline-wounded-stranger-complete',
      },
    ],
  },

  // ── The Territorial Dispute (territorial species) ──
  {
    id: 'territorial-dispute',
    name: 'The Territorial Dispute',
    speciesIds: ['white-tailed-deer', 'gray-wolf', 'african-elephant', 'polar-bear', 'common-octopus', 'poison-dart-frog'],
    startConditions: [
      { type: 'age_range', min: 6 },
      { type: 'has_flag', flag: 'territory-established' },
    ],
    startChance: 0.10,
    tags: ['social', 'danger'],
    steps: [
      // Step 0: Confrontation choice — active
      {
        id: 'territorial-dispute-start',
        delayMin: 0,
        delayMax: 0,
        narrativeText: 'Fresh scent marks overlay your own along the boundary, still sharp. A rival is pushing into your range, marking over your marks, each pass bolder than the last.',
        statEffects: [],
        consequences: [],
        completionFlag: 'storyline-territorial-dispute-started',
        choices: [
          {
            id: 'confront',
            label: 'Confront the rival',
            description: 'Charge. Drive it out.',
            narrativeResult: 'You rush the boundary. The rival does not retreat. Contact is sudden, hard, and loud. For several seconds neither of you gives ground.',
            statEffects: [
              { stat: StatId.ADV, amount: 5, duration: 4, label: '+ADV (territorial aggression)' },
            ],
            consequences: [],
            revocable: false,
            style: 'danger',
            deathChance: { probability: 0.02, cause: 'killed in territorial dispute' },
          },
          {
            id: 'yield',
            label: 'Yield ground',
            description: 'Pull back. Avoid contact.',
            narrativeResult: 'You move off the boundary. The rival marks over your scent within the hour. Your usable range contracts, but your body is intact.',
            statEffects: [
              { stat: StatId.HOM, amount: -3, duration: 4, label: '-HOM (lost ground)' },
            ],
            consequences: [
              { type: 'modify_territory', sizeChange: -10 },
            ],
            revocable: false,
            style: 'default',
          },
          {
            id: 'negotiate',
            label: 'Establish a shared boundary',
            description: 'Mark carefully. Hold position without charging.',
            narrativeResult: 'You approach the boundary and mark. Wait. The rival marks in return, holds position, does not advance. You repeat. A pattern forms: mark, pause, withdraw.',
            statEffects: [
              { stat: StatId.WIS, amount: 5, duration: 6, label: '+WIS (diplomatic instinct)' },
              { stat: StatId.NOV, amount: 3, duration: 4, label: '+NOV (novel strategy)' },
            ],
            consequences: [],
            revocable: false,
            style: 'default',
          },
        ],
        branchMap: { 'confront': 1, 'yield': 2, 'negotiate': 3 },
      },
      // Step 1: Confront result
      {
        id: 'territorial-dispute-confront',
        delayMin: 1,
        delayMax: 2,
        narrativeText: 'The rival\'s scent fades from the boundary over the following days. Your marks go unchallenged. The range is yours again.',
        statEffects: [],
        consequences: [
          { type: 'modify_territory', qualityChange: 10 },
        ],
        completionFlag: 'storyline-territorial-dispute-confront',
      },
      // Step 2: Yield result
      {
        id: 'territorial-dispute-yield',
        delayMin: 1,
        delayMax: 2,
        narrativeText: 'The rival patrols the lost ground openly. Your range is smaller now. Food and cover are harder to find in what remains.',
        statEffects: [],
        consequences: [],
        completionFlag: 'storyline-territorial-dispute-yield',
      },
      // Step 3: Negotiate result
      {
        id: 'territorial-dispute-negotiate',
        delayMin: 2,
        delayMax: 4,
        narrativeText: 'The boundary holds. You smell the rival on the far side; the rival smells you. Neither crosses. The range is smaller but the marking pattern is stable.',
        statEffects: [],
        consequences: [
          { type: 'modify_territory', qualityChange: 5 },
        ],
        completionFlag: 'storyline-territorial-dispute-negotiate',
      },
    ],
  },
];
