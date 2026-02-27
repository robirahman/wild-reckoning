import type { SimulationTrigger } from '../types';
import { StatId } from '../../../types/stats';
import { resolveSocial } from '../../interactions/social';
import { resolveFight } from '../../interactions/fight';
import { rivalBuckEntity } from '../../narrative/perspective';
import { buildEnvironment, action, buildNarrativeContext, conspecificEntity } from '../../narrative/contextBuilder';
// resolveChase reserved for yearling road crossing

// ══════════════════════════════════════════════════
//  1. HERD ALARM
// ══════════════════════════════════════════════════
// Replaces legacy: deer-herd-alarm

export const herdAlarmTrigger: SimulationTrigger = {
  id: 'sim-herd-alarm',
  category: 'social',
  tags: ['social', 'herd', 'alarm'],

  isPlausible(ctx) {
    // Alarms happen when other deer are nearby (ally NPC or female sociability)
    const hasAlly = ctx.npcs?.some((n) => n.type === 'ally' && n.alive);
    return hasAlly || ctx.behavior.sociability >= 3;
  },

  computeWeight(ctx) {
    let base = 0.04;
    // More likely in open terrain (more visible threats)
    if (ctx.currentNodeType === 'plain') base *= 1.5;
    // Higher caution = more alert herd
    base *= 0.5 + ctx.behavior.caution * 0.15;
    return base;
  },

  resolve(ctx) {
    const allyName = ctx.npcs?.find((n) => n.type === 'ally' && n.alive)?.name ?? 'A doe nearby';
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [],
      consequences: [],
      narrativeText: `${allyName} sees it before you do. Her head snaps up mid-browse, ears locked forward, nostrils flaring. Then the alarm snort — a sharp, percussive exhalation that carries across the clearing like a gunshot. Your body responds before your mind catches up: muscles tensing, head swiveling, legs coiling. The white flag of her tail is already up and pumping as she bolts, and the signal cascades through every deer within earshot.`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'herd-alarm',
        entities: [conspecificEntity(`${allyName}'s alarm snort`, `${allyName} (herd member) alarm signaling`, 'sound')],
        actions: [action(
          `${allyName} snorts — a sharp, percussive exhalation. The white flag of her tail goes up and she bolts. The signal cascades through every deer within earshot.`,
          `Herd alarm response initiated by ${allyName}. Conspecific alarm snort detected; flight response triggered.`,
          'high',
        )],
        environment: env,
        emotionalTone: 'fear',
      }),
    };
  },

  getChoices(ctx) {
    const groupSize = (ctx.npcs?.filter((n) => (n.type === 'ally' || n.type === 'mate') && n.alive).length ?? 0) + 1;

    return [
      {
        id: 'follow-alarm',
        label: 'Follow the alarm and bolt',
        description: 'Trust the signal. Run first, assess later.',
        style: 'default',
        narrativeResult: 'You launch yourself into motion without thought, matching the herd\'s trajectory through the trees. The alarm was real — behind you, something large crashes through the brush where you stood moments ago. The herd\'s collective vigilance saved you the critical seconds you needed.',
        modifyOutcome(base, innerCtx) {
          const social = resolveSocial(innerCtx, {
            interactionType: 'alarm-response',
            groupSize,
          });
          return {
            ...base,
            statEffects: social.statEffects,
            consequences: [
              { type: 'add_calories' as const, amount: -10, source: 'alarm-sprint' },
            ],
            footnote: '(Herd alarm — escaped)',
          };
        },
      },
      {
        id: 'assess-alarm',
        label: 'Pause and assess the threat',
        description: 'Sometimes alarms are false. But sometimes they aren\'t.',
        style: 'default',
        narrativeResult: 'You freeze rather than flee, scanning the tree line for the source of the alarm. Long seconds tick past. Your heart hammers. The other deer are already gone, their white tails vanishing into the undergrowth. You are alone, exposed, trying to read the forest for whatever triggered the panic.',
        modifyOutcome(base, innerCtx) {
          // 20% chance the threat was real and you're now exposed
          const threatened = innerCtx.rng.chance(0.2);
          return {
            ...base,
            statEffects: threatened
              ? [{ stat: StatId.TRA, amount: 6, duration: 2, label: '+TRA' }, { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }]
              : [{ stat: StatId.WIS, amount: 3, label: '+WIS' }, { stat: StatId.TRA, amount: -2, label: '-TRA' }],
            consequences: [],
            footnote: threatened ? '(The threat was real)' : '(False alarm — good judgment)',
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  2. BACHELOR GROUP
// ══════════════════════════════════════════════════
// Replaces legacy: deer-bachelor-group

export const bachelorGroupTrigger: SimulationTrigger = {
  id: 'sim-bachelor-group',
  category: 'social',
  tags: ['social', 'herd', 'seasonal'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    // Bachelor groups form in spring/summer, dissolve during rut
    return ctx.time.season === 'spring' || ctx.time.season === 'summer';
  },

  computeWeight(ctx) {
    let base = 0.03;
    base *= 0.5 + ctx.behavior.sociability * 0.2;
    // Young bucks more social
    if (ctx.animal.age < 36) base *= 1.5;
    return base;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: -3, label: '-TRA' },
        { stat: StatId.ADV, amount: -2, label: '-ADV' },
        { stat: StatId.WIS, amount: 2, label: '+WIS' },
      ],
      consequences: [],
      narrativeText: 'You find them in a sun-dappled clearing — three other bucks, antlers still in velvet, grazing with the lazy confidence of animals that have nothing to prove. There is no aggression here, not yet. This is the summer brotherhood, a temporary peace between males who will be enemies in autumn. One looks up as you approach, assesses you with dark, calm eyes, and returns to feeding. You are accepted.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'bachelor-group',
        entities: [conspecificEntity('three other bucks with velvet antlers', 'bachelor group of 3 male deer')],
        actions: [action(
          'Three other bucks grazing in a clearing. Summer brotherhood — no aggression. One assesses you and returns to feeding. You are accepted.',
          'Joined bachelor group. Non-agonistic male social bonding during summer antler growth period.',
          'low',
        )],
        environment: env,
        emotionalTone: 'calm',
      }),
    };
  },

  getChoices() {
    return []; // Passive event
  },
};

// ══════════════════════════════════════════════════
//  3. DOE HIERARCHY
// ══════════════════════════════════════════════════
// Replaces legacy: deer-doe-hierarchy

export const doeHierarchyTrigger: SimulationTrigger = {
  id: 'sim-doe-hierarchy',
  category: 'social',
  tags: ['social', 'herd', 'hierarchy', 'female-competition'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'female') return false;
    if (ctx.animal.flags?.has?.('challenged-doe-hierarchy')) return false;
    return true;
  },

  computeWeight(ctx) {
    let base = 0.02;
    // More likely during fawning season
    if (ctx.time.season === 'spring') base *= 2;
    // Higher belligerence triggers more confrontations
    base *= 0.5 + ctx.behavior.belligerence * 0.2;
    return base;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [{ stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' }],
      consequences: [],
      narrativeText: 'She approaches with stiff, deliberate steps — an older doe, scarred and experienced, her posture broadcasting challenge. This is about territory, about the best fawning cover, about hierarchy. She stops three body lengths away and stares, ears pinned back, one front hoof pawing the ground. The message is clear: yield, or be made to yield.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'doe-hierarchy',
        entities: [conspecificEntity('an older doe with scars, posture broadcasting challenge', 'dominant doe, hierarchical challenge for fawning territory')],
        actions: [action(
          'She stops three body lengths away and stares, ears pinned back, one hoof pawing the ground. Yield, or be made to yield.',
          'Female dominance challenge. Intraspecific competition for fawning territory access.',
          'medium',
        )],
        environment: env,
        emotionalTone: 'aggression',
      }),
    };
  },

  getChoices() {
    return [
      {
        id: 'challenge-doe',
        label: 'Stand your ground and challenge',
        description: 'Contest the hierarchy. Winner gets prime fawning territory.',
        style: 'default',
        narrativeResult: 'You mirror her posture — ears back, head high, weight forward. For a long, tense moment you stare at each other. Then she lunges, rearing up on hind legs, forelegs striking. You meet her, hooves clashing, and the contest becomes a shoving, kicking scramble for dominance.',
        modifyOutcome(base, innerCtx) {
          const social = resolveSocial(innerCtx, {
            interactionType: 'dominance-display',
            opponentRank: 'peer',
            groupSize: 2,
          });
          const won = social.rankChange > 0;
          return {
            ...base,
            harmEvents: social.harmEvents,
            statEffects: social.statEffects,
            consequences: [
              { type: 'set_flag' as const, flag: 'challenged-doe-hierarchy' as const },
              ...(won ? [{ type: 'set_flag' as const, flag: 'nest-quality-prime' as const }] : []),
            ],
            footnote: won ? '(Won — prime fawning territory)' : '(Lost the challenge)',
          };
        },
      },
      {
        id: 'yield-doe',
        label: 'Yield to the dominant doe',
        description: 'Accept subordinate status. Safer, but poorer fawning ground.',
        style: 'default',
        narrativeResult: 'You break eye contact and turn aside, ceding the ground. The dominant doe watches you go, satisfied, and reclaims the clearing with a proprietary air. You will find fawning cover elsewhere — not the best, but adequate. Some fights are not worth the injuries.',
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
              { stat: StatId.WIS, amount: 2, label: '+WIS' },
            ],
            consequences: [
              { type: 'set_flag' as const, flag: 'challenged-doe-hierarchy' as const },
              { type: 'set_flag' as const, flag: 'nest-quality-poor' as const },
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  4. FAWN PLAY
// ══════════════════════════════════════════════════
// Replaces legacy: deer-fawn-play

export const fawnPlayTrigger: SimulationTrigger = {
  id: 'sim-fawn-play',
  category: 'social',
  tags: ['social', 'psychological', 'fawn'],

  isPlausible(ctx) {
    if (!ctx.animal.flags?.has?.('has-fawns')) return false;
    return ctx.time.season === 'spring' || ctx.time.season === 'summer';
  },

  computeWeight(_ctx) {
    return 0.04; // Moderate frequency — feels like a recurring slice of life
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.TRA, amount: -4, label: '-TRA' },
        { stat: StatId.ADV, amount: -3, label: '-ADV' },
        { stat: StatId.NOV, amount: -2, label: '-NOV' },
      ],
      consequences: [],
      narrativeText: 'Your fawns are playing. They chase each other through the tall grass in looping, ecstatic sprints, legs flying at angles that seem physically impossible, white spots flashing in the dappled light. One stumbles, rolls, springs back up without breaking stride. The other leaps clean over a fallen log with a joy so pure it is almost painful to watch. They are alive, and they are yours, and for this moment the forest feels safe.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'fawn-play',
        entities: [conspecificEntity('your fawns chasing each other through tall grass', 'offspring play behavior')],
        actions: [action(
          'Your fawns chase each other in looping sprints, white spots flashing in dappled light. They are alive, and they are yours.',
          'Fawn play behavior observed. Locomotive play bouts indicating healthy development and adequate nutrition.',
          'low',
        )],
        environment: env,
        emotionalTone: 'relief',
      }),
    };
  },

  getChoices() {
    return []; // Passive event
  },
};

// ══════════════════════════════════════════════════
//  5. TERRITORIAL SCRAPE
// ══════════════════════════════════════════════════
// Replaces legacy: deer-territorial-scrape

export const territorialScrapeTrigger: SimulationTrigger = {
  id: 'sim-territorial-scrape',
  category: 'social',
  tags: ['social', 'territorial', 'rut'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.time.season !== 'autumn') return false;
    if (ctx.animal.age < 18) return false;
    return true;
  },

  computeWeight(ctx) {
    let base = 0.04;
    base *= 0.5 + ctx.behavior.belligerence * 0.2;
    // Already scraping increases frequency
    if (ctx.animal.flags?.has?.('territorial-scrape-active')) base *= 0.5;
    return base;
  },

  resolve(ctx) {
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
        { stat: StatId.NOV, amount: -3, label: '-NOV' },
      ],
      consequences: [
        { type: 'set_flag' as const, flag: 'territorial-scrape-active' as const },
        { type: 'add_calories' as const, amount: -8, source: 'territorial-scraping' },
      ],
      narrativeText: 'The urge comes on like a tide — not a thought but a compulsion, rising from somewhere deep in your hindbrain. You find a low-hanging branch and work it with your antlers, twisting and scraping until the bark peels away in long, fragrant strips. Then you paw the earth beneath it into a bare oval, urinate on your tarsal glands, and rub them together until the scent is overpowering. Every buck within half a mile will know you were here. The chemical message is ancient and unmistakable: this is mine.',
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'territorial-scrape',
        actions: [action(
          'You find a low-hanging branch and work it with your antlers. Then paw the earth into a bare oval. Every buck within half a mile will know you were here.',
          'Territorial marking behavior. Antler rub on overhanging branch, ground scrape with tarsal gland scent deposition. Chemical signaling to conspecific males.',
          'low',
        )],
        environment: env,
        emotionalTone: 'aggression',
      }),
    };
  },

  getChoices() {
    return []; // Instinct-driven, not a choice event
  },
};

// ══════════════════════════════════════════════════
//  6. RIVAL RETURNS
// ══════════════════════════════════════════════════
// Replaces legacy: deer-rival-returns

export const rivalReturnsTrigger: SimulationTrigger = {
  id: 'sim-rival-returns',
  category: 'social',
  tags: ['social', 'confrontation', 'territorial'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.time.season !== 'autumn' && ctx.time.season !== 'winter') return false;
    const hasRival = ctx.npcs?.some((n) => n.type === 'rival' && n.alive);
    return !!hasRival;
  },

  computeWeight(ctx) {
    let base = 0.03;
    base *= 0.5 + ctx.behavior.belligerence * 0.2;
    // More likely if rut is active
    if (ctx.time.season === 'autumn') base *= 2;
    return base;
  },

  resolve(ctx) {
    const rivalName = ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.name ?? 'The rival buck';
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
        { stat: StatId.TRA, amount: 3, duration: 2, label: '+TRA' },
      ],
      consequences: [],
      narrativeText: `You smell ${rivalName} before you see the buck — that distinctive musk, sharp and aggressive, carried on the wind like a declaration of war. Then the shape materializes between the trees: familiar scarred rack, thick neck, the same contemptuous stare. The buck has been here before. This is not the first time, and something in the set of the rival's shoulders says it won't be the last.`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'rival-returns',
        entities: [rivalBuckEntity(rivalName)],
        actions: [action(
          `${rivalName} materializes between the trees: familiar scarred rack, thick neck, the same contemptuous stare. This is not the first time.`,
          `Recurring rival encounter. ${rivalName} returning to contested territory during rut.`,
          'high',
        )],
        environment: env,
        emotionalTone: 'aggression',
      }),
    };
  },

  getChoices(ctx) {
    const rivalName = ctx.npcs?.find((n) => n.type === 'rival' && n.alive)?.name ?? 'the rival';
    const rivalWeight = ctx.rng.int(100, 180);
    const rivalStrength = 40 + rivalWeight * 0.1 + ctx.rng.int(-5, 5);

    return [
      {
        id: 'confront-rival',
        label: 'Charge and confront',
        description: `Meet ${rivalName} head-on.${ctx.animal.weight > rivalWeight ? ' You outweigh the rival.' : ''}`,
        style: ctx.animal.weight < rivalWeight * 0.8 ? 'danger' : 'default',
        narrativeResult: `You lower your antlers and close the distance. ${rivalName} meets you without flinching — the crack of antler on antler echoes through the forest. This is personal now.`,
        modifyOutcome(base, innerCtx) {
          const fight = resolveFight(innerCtx, {
            opponentStrength: rivalStrength,
            opponentWeight: rivalWeight,
            opponentWeaponType: 'blunt',
            opponentTargetZone: innerCtx.rng.pick(['head', 'neck', 'front-legs'] as const),
            opponentDamageRange: [30, 60],
            opponentStrikeLabel: 'antler strike',
            engagementType: 'charge',
            canDisengage: true,
            mutual: true,
          });

          return {
            ...base,
            harmEvents: fight.harmToPlayer,
            statEffects: fight.won
              ? [{ stat: StatId.WIS, amount: 3, label: '+WIS' }, { stat: StatId.HOM, amount: 5, duration: 2, label: '+HOM' }]
              : [{ stat: StatId.TRA, amount: 6, duration: 3, label: '+TRA' }],
            consequences: [
              { type: 'set_flag' as const, flag: 'fought-rut-rival' as const },
              ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'rival-fight' }] : []),
              ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
            ],
            footnote: fight.won ? `(Defeated ${rivalName})` : `(Lost to ${rivalName})`,
          };
        },
      },
      {
        id: 'display-rival',
        label: 'Posture and display',
        description: 'Show your size without committing to combat.',
        style: 'default',
        narrativeResult: `You turn broadside, presenting the full span of your rack, muscles tensed, neck arched. ${rivalName} evaluates you with cold calculation.`,
        modifyOutcome(base, innerCtx) {
          const social = resolveSocial(innerCtx, {
            interactionType: 'dominance-display',
            opponentRank: 'peer',
            groupSize: 2,
          });
          const won = social.rankChange > 0;
          return {
            ...base,
            harmEvents: social.harmEvents,
            statEffects: social.statEffects,
            consequences: [],
            footnote: won ? `(${rivalName} backed down)` : `(${rivalName} wasn't impressed)`,
          };
        },
      },
      {
        id: 'yield-rival',
        label: 'Yield the ground',
        description: 'Turn away. Live to fight another day.',
        style: 'default',
        narrativeResult: `You break eye contact and drift back into the trees. ${rivalName} watches you go, claiming the clearing without a blow. Discretion. Not cowardice. That's what you tell yourself.`,
        modifyOutcome(base) {
          return {
            ...base,
            statEffects: [
              { stat: StatId.TRA, amount: 4, duration: 2, label: '+TRA' },
              { stat: StatId.ADV, amount: 5, duration: 2, label: '+ADV' },
            ],
            consequences: [
              { type: 'set_flag' as const, flag: 'lost-rut-contest' as const },
            ],
          };
        },
      },
    ];
  },
};

// ══════════════════════════════════════════════════
//  7. ALLY WARNS
// ══════════════════════════════════════════════════
// Replaces legacy: deer-ally-warns

export const allyWarnsTrigger: SimulationTrigger = {
  id: 'sim-ally-warns',
  category: 'social',
  tags: ['social', 'herd'],

  isPlausible(ctx) {
    const hasAlly = ctx.npcs?.some((n) => n.type === 'ally' && n.alive);
    return !!hasAlly;
  },

  computeWeight(ctx) {
    let base = 0.025;
    // Better allies (more encounters) warn more effectively
    const ally = ctx.npcs?.find((n) => n.type === 'ally' && n.alive);
    if (ally && ally.encounters > 5) base *= 1.3;
    return base;
  },

  resolve(ctx) {
    const allyName = ctx.npcs?.find((n) => n.type === 'ally' && n.alive)?.name ?? 'Your companion';
    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.ADV, amount: -3, label: '-ADV' },
        { stat: StatId.TRA, amount: -2, label: '-TRA' },
        { stat: StatId.WIS, amount: 3, label: '+WIS' },
      ],
      consequences: [],
      narrativeText: `${allyName} freezes mid-step, head cocked, one ear swiveled hard to the left. You know this posture. You've learned to trust it. The doe's body language is subtle but unmistakable to anyone who has traveled with her: danger, that direction, close. She doesn't bolt — not yet — but the slight shift of her weight onto her hind legs tells you she's ready. Without the warning, you would have walked straight into whatever she's detected.`,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'ally-warns',
        entities: [conspecificEntity(`${allyName} frozen mid-step, ear swiveled`, `${allyName} (ally) early warning signal`, 'sight')],
        actions: [action(
          `${allyName} freezes mid-step, body language unmistakable: danger, that direction, close. Without the warning, you would have walked straight into it.`,
          `Ally early warning. ${allyName} detected threat and communicated via body language, preventing direct encounter.`,
          'medium',
        )],
        environment: env,
        emotionalTone: 'tension',
      }),
    };
  },

  getChoices() {
    return []; // Passive — the ally warns, you benefit
  },
};

// ══════════════════════════════════════════════════
//  8. YEARLING DISPERSAL
// ══════════════════════════════════════════════════
// Replaces legacy: deer-yearling-restlessness + deer-dispersal-push

export const yearlingDispersalTrigger: SimulationTrigger = {
  id: 'sim-yearling-dispersal',
  category: 'social',
  tags: ['social'],

  isPlausible(ctx) {
    if (ctx.animal.sex !== 'male') return false;
    if (ctx.animal.age < 12 || ctx.animal.age > 24) return false;
    // Don't fire if already dispersed
    if (ctx.animal.flags?.has?.('dispersal-begun')) return false;
    if (ctx.animal.flags?.has?.('dispersal-settled')) return false;
    return true;
  },

  computeWeight(ctx) {
    let base = 0.03;
    // Pressure increases with age
    if (ctx.animal.age >= 18) base *= 2;
    // Already feeling pressure
    if (ctx.animal.flags?.has?.('dispersal-pressure')) base *= 2;
    // Autumn rut activity drives dispersal
    if (ctx.time.season === 'autumn') base *= 1.5;
    return base;
  },

  resolve(ctx) {
    const hasDispersalPressure = ctx.animal.flags?.has?.('dispersal-pressure');

    const narrative = hasDispersalPressure
      ? 'The dominant buck finds you in the cedar thicket and there is nothing casual about the approach. Head low, ears pinned, moving with the coiled deliberation of an animal about to attack. The message has moved beyond chemical signals and body language — this is a physical eviction. You are not welcome here anymore. The home range that sheltered you since birth has become hostile territory.'
      : 'Something has shifted inside you over the past weeks — a restlessness that won\'t quiet. The familiar trails feel confining rather than safe. The mature bucks, who tolerated you through summer, now watch you with flat, hostile eyes. Your mother passed you this morning without a flicker of recognition. The message is biological and unavoidable: it is time to leave.';

    const env = buildEnvironment(ctx);
    return {
      harmEvents: [],
      statEffects: [
        { stat: StatId.NOV, amount: 6, duration: 2, label: '+NOV' },
        { stat: StatId.ADV, amount: 4, duration: 2, label: '+ADV' },
      ],
      consequences: hasDispersalPressure
        ? []
        : [{ type: 'set_flag' as const, flag: 'dispersal-pressure' as const }],
      narrativeText: narrative,
      narrativeContext: buildNarrativeContext({
        eventCategory: 'social',
        eventType: 'yearling-dispersal',
        actions: [action(
          narrative,
          hasDispersalPressure
            ? 'Forced dispersal. Dominant buck physically evicting yearling male from natal range.'
            : 'Dispersal instinct onset. Yearling male experiencing restlessness and conspecific aggression signaling need to establish new range.',
          hasDispersalPressure ? 'high' : 'medium',
        )],
        environment: env,
        emotionalTone: hasDispersalPressure ? 'fear' : 'tension',
      }),
    };
  },

  getChoices(ctx) {
    const hasDispersalPressure = ctx.animal.flags?.has?.('dispersal-pressure');

    if (!hasDispersalPressure) {
      // First encounter: internal struggle, no forced action
      return [
        {
          id: 'resist-dispersal',
          label: 'Resist the urge to leave',
          description: 'Cling to the familiar. The pressure will only grow.',
          style: 'default',
          narrativeResult: 'You press yourself deeper into the thicket, refusing to acknowledge the chemical imperative in your blood. This is home. You were born here. Every trail, every bedding site, every water source is mapped in your memory. Leaving feels like dying.',
          modifyOutcome(base) {
            return {
              ...base,
              statEffects: [
                { stat: StatId.TRA, amount: 5, duration: 3, label: '+TRA' },
              ],
            };
          },
        },
        {
          id: 'accept-dispersal',
          label: 'Accept the restlessness',
          description: 'Begin to scout unfamiliar territory.',
          style: 'default',
          narrativeResult: 'You stop fighting it. The next morning, instead of following the familiar trails, you turn north — into country you have never explored. Every step takes you further from everything you know. The forest smells different here. The fear is real, but so is the exhilaration.',
          modifyOutcome(base, innerCtx) {
            const social = resolveSocial(innerCtx, {
              interactionType: 'dispersal',
              groupSize: 1,
            });
            return {
              ...base,
              harmEvents: social.harmEvents,
              statEffects: social.statEffects,
              consequences: [
                ...social.flagsToSet.map(f => ({ type: 'set_flag' as const, flag: f })),
                ...social.flagsToRemove.map(f => ({ type: 'remove_flag' as const, flag: f })),
                { type: 'add_calories' as const, amount: -20, source: 'dispersal-travel' },
              ],
            };
          },
        },
      ];
    }

    // Second encounter (with pressure): forced dispersal
    return [
      {
        id: 'leave-home',
        label: 'Leave your home range',
        description: 'The dominant buck leaves you no choice.',
        style: 'default',
        narrativeResult: 'The charge catches you off-guard — a blur of antlers and fury that sends you stumbling backwards. You don\'t fight. You can\'t. This is a full-grown buck in rut, and you are a yearling who weighs thirty pounds less. You run, and you keep running, past the boundary markers you\'ve known your whole life, into unfamiliar forest.',
        modifyOutcome(base, innerCtx) {
          const social = resolveSocial(innerCtx, {
            interactionType: 'dispersal',
            groupSize: 1,
          });
          return {
            ...base,
            harmEvents: [
              ...social.harmEvents,
              {
                id: `dispersal-charge-${innerCtx.time.turn}`,
                sourceLabel: 'dominant buck charge',
                magnitude: innerCtx.rng.int(15, 30),
                targetZone: innerCtx.rng.pick(['torso', 'hind-legs'] as const),
                spread: 0.3,
                harmType: 'blunt' as const,
              },
            ],
            statEffects: social.statEffects,
            consequences: [
              ...social.flagsToSet.map(f => ({ type: 'set_flag' as const, flag: f })),
              ...social.flagsToRemove.map(f => ({ type: 'remove_flag' as const, flag: f })),
              { type: 'add_calories' as const, amount: -25, source: 'forced-dispersal' },
            ],
          };
        },
      },
      {
        id: 'fight-dominant',
        label: 'Stand and fight the dominant buck',
        description: 'A desperate, likely futile stand.',
        style: 'danger',
        narrativeResult: 'Something snaps inside you — not courage exactly, but a refusal to be driven like prey. You wheel to face the charging buck, lowering your small antlers. The impact is devastating.',
        modifyOutcome(base, innerCtx) {
          const fight = resolveFight(innerCtx, {
            opponentStrength: 60,
            opponentWeight: innerCtx.rng.int(140, 200),
            opponentWeaponType: 'blunt',
            opponentTargetZone: innerCtx.rng.pick(['head', 'neck', 'torso'] as const),
            opponentDamageRange: [40, 70],
            opponentStrikeLabel: 'dominant buck charge',
            engagementType: 'charge',
            canDisengage: true,
            mutual: true,
          });

          return {
            ...base,
            harmEvents: fight.harmToPlayer,
            statEffects: fight.won
              ? [{ stat: StatId.WIS, amount: 5, label: '+WIS' }, { stat: StatId.NOV, amount: 8, duration: 3, label: '+NOV' }]
              : [{ stat: StatId.TRA, amount: 8, duration: 3, label: '+TRA' }, { stat: StatId.NOV, amount: 6, duration: 2, label: '+NOV' }],
            consequences: [
              { type: 'set_flag' as const, flag: 'dispersal-begun' as const },
              { type: 'remove_flag' as const, flag: 'dispersal-pressure' as const },
              ...(fight.caloriesCost > 0 ? [{ type: 'add_calories' as const, amount: -fight.caloriesCost, source: 'dispersal-fight' }] : []),
              ...(fight.deathCause ? [{ type: 'death' as const, cause: fight.deathCause }] : []),
            ],
            footnote: fight.won ? '(Stood your ground — barely)' : '(Defeated and driven out)',
          };
        },
      },
    ];
  },
};
