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
        narrativeText: 'You discover a creature of your kind, badly injured and unable to move. It watches you with desperate eyes.',
        statEffects: [],
        consequences: [],
        completionFlag: 'storyline-wounded-stranger-discovered',
        choices: [
          {
            id: 'help',
            label: 'Help the stranger',
            description: 'Approach carefully and offer what aid you can.',
            narrativeResult: 'You approach cautiously, lowering your guard. The wounded creature tenses, then relaxes as it senses your intent. You stay close, sharing warmth and vigilance through the long hours.',
            statEffects: [
              { stat: StatId.WIS, amount: 5, duration: 6, label: '+WIS (compassion)' },
              { stat: StatId.HEA, amount: -3, duration: 4, label: '-HEA (exhausting care)' },
            ],
            consequences: [],
            revocable: false,
            style: 'default',
          },
          {
            id: 'ignore',
            label: 'Move on',
            description: 'The harsh reality of survival leaves no room for charity.',
            narrativeResult: 'You turn away. The wounded creature watches you go, its eyes dimming with resignation. You press on, the weight of the moment settling behind you like a stone.',
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
        narrativeText: 'The memory of the wounded creature fades, replaced by the demands of survival. You wonder briefly whether it found help elsewhere, or whether the forest reclaimed it in silence.',
        statEffects: [],
        consequences: [],
        completionFlag: 'storyline-wounded-stranger-ignore',
      },
      // Step 2: Help conclusion (branch target for 'help')
      {
        id: 'wounded-stranger-reunion',
        delayMin: 3,
        delayMax: 6,
        narrativeText: 'The creature you helped has recovered. You encounter it again on a familiar trail — it recognizes you, approaching without fear. A bond has formed, quiet but unmistakable. In this harsh world, you have gained something rare: an ally.',
        statEffects: [
          { stat: StatId.WIS, amount: 5, duration: 8, label: '+WIS (kindness repaid)' },
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
        narrativeText: 'A rival has been encroaching on your territory with increasing boldness. Fresh scent marks overlay your own along the boundary. Each day the intruder pushes deeper, testing your resolve.',
        statEffects: [],
        consequences: [],
        completionFlag: 'storyline-territorial-dispute-started',
        choices: [
          {
            id: 'confront',
            label: 'Confront the rival',
            description: 'Drive the intruder out with a direct display of force.',
            narrativeResult: 'You charge toward the boundary with all the ferocity you can muster. The rival meets your challenge head-on, and for a tense, violent moment the outcome is uncertain.',
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
            description: 'Cede the contested area and avoid conflict.',
            narrativeResult: 'You withdraw from the boundary, surrendering the contested ground. The rival claims it immediately, marking it with impunity. Your territory shrinks, but you are unharmed.',
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
            description: 'Attempt to coexist by defining a clear border through displays and patience.',
            narrativeResult: 'You approach the boundary not with aggression but with deliberate, measured signals — marking, watching, retreating in turn. The rival hesitates, then mirrors your restraint.',
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
        narrativeText: 'Your display of strength has driven the intruder away — for now. The boundary is yours again, and the scent of the rival fades with each passing day. Your territory feels more secure than before.',
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
        narrativeText: 'You have ceded part of your territory. The rival patrols its new range openly, and you must learn to subsist on less. The reduced space presses in around you, a constant reminder of what was lost.',
        statEffects: [],
        consequences: [],
        completionFlag: 'storyline-territorial-dispute-yield',
      },
      // Step 3: Negotiate result
      {
        id: 'territorial-dispute-negotiate',
        delayMin: 2,
        delayMax: 4,
        narrativeText: 'An uneasy truce holds. You and the rival have established a shared boundary, each respecting the other\'s marks. The arrangement is fragile, but it endures. Your territory is smaller, yet richer for the peace.',
        statEffects: [],
        consequences: [
          { type: 'modify_territory', qualityChange: 5 },
        ],
        completionFlag: 'storyline-territorial-dispute-negotiate',
      },
    ],
  },
];
