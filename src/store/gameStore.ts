import { create } from 'zustand';
import type { AnimalState, Backstory } from '../types/species';
import type { TimeState } from '../types/world';
import type { BehavioralSettings } from '../types/behavior';
import type { ResolvedEvent, StatEffect, Consequence } from '../types/events';
import type { StatModifier } from '../types/stats';
import type { ActiveParasite, ActiveInjury } from '../types/health';
import type { NPC } from '../types/npc';
import type { ActiveStoryline } from '../types/storyline';
import type { ReproductionState } from '../types/reproduction';
import type { SpeciesDataBundle } from '../types/speciesConfig';
import type { SpeciesConfig } from '../types/speciesConfig';
import type { TurnResult } from '../types/turnResult';
import type { Difficulty } from '../types/difficulty';
import type { EcosystemState } from '../types/ecosystem';
import type { TerritoryState } from '../types/territory';
import type { ScenarioDefinition } from '../types/scenario';
import type { LineageTraits } from '../types/lineage';
import { DIFFICULTY_PRESETS } from '../types/difficulty';
import { StatId } from '../types/stats';
import { DEFAULT_BEHAVIORAL_SETTINGS } from '../types/behavior';
import { INITIAL_ITEROPAROUS_STATE, INITIAL_SEMELPAROUS_STATE } from '../types/reproduction';
import { INITIAL_TERRITORY } from '../types/territory';
import { initializeEcosystem, modifyPopulation } from '../engine/EcosystemSystem';
import { territoryWeightModifier, TERRITORIAL_SPECIES } from '../engine/TerritorySystem';
import { createStatBlock, addModifier, tickModifiers, removeModifiersBySource } from '../engine/StatCalculator';
import { createInitialTime, advanceTime } from '../engine/TimeSystem';
import { createRng, type Rng } from '../engine/RandomUtils';
import { computeEffectiveValue } from '../types/stats';
import { tickReproduction, determineFawnCount, createFawns } from '../engine/ReproductionSystem';
import { getSpeciesBundle } from '../data/species';
import { loadGame, deleteSaveGame } from './persistence';
import { getRegionDefinition } from '../data/regions';
import { generateWeather, tickWeather, computeWeatherPenalty, weatherLabel } from '../engine/WeatherSystem';
import type { WeatherState } from '../engine/WeatherSystem';
import { introduceNPC } from '../engine/NPCSystem';
import { VOLUNTARY_ACTIONS, type ActionContext } from '../engine/ActionSystem';
import type { RegionMap } from '../types/map';
import { generateRegionMap } from '../engine/MapSystem';
import { INITIAL_SOCIAL_STATE } from '../types/social';
import { tickSocial } from '../engine/SocialSystem';
import type { EvolutionState, AncestorRecord } from '../types/evolution';
import { getAvailableMutations } from '../engine/EvolutionSystem';
import { getScaling } from '../engine/SpeciesScale';

export type GamePhase = 'menu' | 'playing' | 'dead' | 'evolving';

export interface TurnRecord {
  turn: number;
  month: string;
  year: number;
  season: string;
  events: ResolvedEvent[];
  statSnapshot: Record<StatId, number>;
}

export interface GameState {
  // Meta
  phase: GamePhase;
  rng: Rng;
  seed: number;
  difficulty: Difficulty;

  // Species
  speciesBundle: SpeciesDataBundle;

  // Core state
  animal: AnimalState;
  time: TimeState;
  behavioralSettings: BehavioralSettings;
  reproduction: ReproductionState;

  // Current turn
  currentEvents: ResolvedEvent[];
  pendingChoices: string[];
  revocableChoices: Record<string, string>;

  // NPCs
  npcs: NPC[];

  // Storylines
  activeStorylines: ActiveStoryline[];

  // Turn results (shown between turns)
  turnResult: TurnResult | null;
  showingResults: boolean;

  // Tutorial
  tutorialStep: number | null;

  // Weather
  currentWeather: WeatherState | null;

  // History
  turnHistory: TurnRecord[];
  eventCooldowns: Record<string, number>;

  // Ambient text
  ambientText: string | null;

  // Ecosystem
  ecosystem: EcosystemState;

  // Territory
  territory: TerritoryState;
  map: RegionMap | null;

  // Scenario
  scenario: ScenarioDefinition | null;

  // Climate
  climateShift: number; // Global temperature offset

  // Lineage
  lineage: LineageTraits | null;

  // Player-initiated actions
  actionsPerformed: string[];

  // Evolution
  evolution: EvolutionState;

  // Fast forward
  fastForward: boolean;

  // Actions
  startGame: (speciesId: string, backstory: Backstory, sex: 'male' | 'female', difficulty?: Difficulty, seed?: number) => void;
  setEvents: (events: ResolvedEvent[]) => void;
  makeChoice: (eventId: string, choiceId: string) => void;
  applyStatEffects: (effects: StatEffect[]) => void;
  applyConsequence: (consequence: Consequence) => void;
  advanceTurn: () => void;
  updateBehavioralSetting: (key: keyof BehavioralSettings, value: 1 | 2 | 3 | 4 | 5) => void;
  killAnimal: (cause: string) => void;
  setTurnResult: (result: TurnResult) => void;
  dismissResults: () => void;
  resumeGame: () => boolean;
  returnToMenu: () => void;
  setEventCooldowns: (cooldowns: Record<string, number>) => void;
  setNPCs: (npcs: NPC[]) => void;
  setActiveStorylines: (storylines: ActiveStoryline[]) => void;
  advanceTutorial: () => void;
  skipTutorial: () => void;
  performAction: (actionId: string) => void;
  resolveDeathRoll: (eventId: string, escapeOptionId: string) => void;
  toggleFastForward: () => void;
  moveLocation: (nodeId: string) => void;
  selectMutation: (mutationId: string) => void;
  sniff: () => void;
  tickNPCMovement: () => void;
}

function createInitialAnimal(config: SpeciesConfig, backstory: Backstory, sex: 'male' | 'female'): AnimalState {
  const baseBases: Record<StatId, number> = { ...config.baseStats };

  for (const adj of backstory.statAdjustments) {
    const statId = adj.stat as StatId;
    if (statId in baseBases) {
      baseBases[statId] = Math.max(0, Math.min(100, baseBases[statId] + adj.amount));
    }
  }

  return {
    speciesId: config.id,
    age: config.startingAge[backstory.type] ?? Object.values(config.startingAge)[0],
    weight: sex === 'female' ? config.startingWeight.female : config.startingWeight.male,
    sex,
    region: config.defaultRegion,
    stats: createStatBlock(baseBases),
    parasites: [],
    injuries: [],
    conditions: [],
    backstory,
    flags: new Set<string>(),
    alive: true,
    activeMutations: [],
    social: { ...INITIAL_SOCIAL_STATE },
    energy: 100,
    perceptionRange: 1,
    nutrients: { minerals: 80, vitamins: 80 },
    physiologicalStress: { hypothermia: 0, starvation: 0, panic: 0 },
  };
}

function initialReproduction(config: SpeciesConfig): ReproductionState {
  return config.reproduction.type === 'iteroparous'
    ? { ...INITIAL_ITEROPAROUS_STATE }
    : { ...INITIAL_SEMELPAROUS_STATE };
}

export const useGameStore = create<GameState>((set, get) => {
  const seed = Date.now();
  const rng = createRng(seed);
  const defaultBundle = getSpeciesBundle('white-tailed-deer');

  return {
    phase: 'menu',
    rng,
    seed,
    speciesBundle: defaultBundle,
    animal: createInitialAnimal(defaultBundle.config, defaultBundle.backstories[0], 'female'),
    time: createInitialTime(5, 1),
    behavioralSettings: { ...DEFAULT_BEHAVIORAL_SETTINGS },
    reproduction: initialReproduction(defaultBundle.config),
    currentEvents: [],
    pendingChoices: [],
    revocableChoices: {},
    difficulty: 'normal' as Difficulty,
    npcs: [],
    activeStorylines: [],
    tutorialStep: null,
    currentWeather: null,
    turnResult: null,
    showingResults: false,
    turnHistory: [],
    eventCooldowns: {},
    ambientText: null,
    ecosystem: initializeEcosystem(),
    territory: { ...INITIAL_TERRITORY },
    map: null,
    scenario: null,
    climateShift: 0,
    lineage: null,
    actionsPerformed: [],
    evolution: { activeMutations: [], availableChoices: [], generationCount: 0, lineageHistory: [] },
    fastForward: false,

    startGame(speciesId, backstory, sex, difficulty, seed) {
      const newSeed = seed ?? Date.now();
      const bundle = getSpeciesBundle(speciesId);
      const tutorialSeen = localStorage.getItem('wild-reckoning-tutorial-seen') === 'true';
      set({
        phase: 'playing',
        seed: newSeed,
        rng: createRng(newSeed),
        difficulty: difficulty ?? 'normal',
        speciesBundle: bundle,
        animal: createInitialAnimal(bundle.config, backstory, sex),
        time: createInitialTime(5, 1),
        behavioralSettings: { ...DEFAULT_BEHAVIORAL_SETTINGS },
        reproduction: initialReproduction(bundle.config),
        currentEvents: [],
        pendingChoices: [],
        revocableChoices: {},
        npcs: [],
        activeStorylines: [],
        tutorialStep: tutorialSeen ? null : 0,
        currentWeather: null,
        turnResult: null,
        showingResults: false,
        turnHistory: [],
        eventCooldowns: {},
        ambientText: null,
        ecosystem: initializeEcosystem(),
        territory: { ...INITIAL_TERRITORY },
        map: generateRegionMap(createRng(newSeed)),
        scenario: null,
        climateShift: 0,
        lineage: null,
        actionsPerformed: [],
        evolution: { activeMutations: [], availableChoices: [], generationCount: 0, lineageHistory: [] },
        fastForward: false,
      });
    },

    toggleFastForward() {
      set({ fastForward: !get().fastForward });
    },

    moveLocation(nodeId) {
      const state = get();
      if (!state.map) return;
      
      const currentNode = state.map.nodes.find(n => n.id === state.map!.currentLocationId);
      if (!currentNode?.connections.includes(nodeId)) return;
      
      const scaling = getScaling(state.speciesBundle.config.massType);
      
      const newMap = { ...state.map };
      newMap.currentLocationId = nodeId;
      newMap.nodes = newMap.nodes.map(n => n.id === nodeId ? { ...n, visited: true, discovered: true } : n);
      
      const newFlags = new Set(state.animal.flags);
      newFlags.add('just-moved');
      
      set({ 
        map: newMap, 
        animal: { 
          ...state.animal, 
          flags: newFlags,
          energy: Math.max(0, state.animal.energy - scaling.movementCost) 
        } 
      });
    },

    sniff() {
      const state = get();
      if (!state.map) return;
      
      const range = state.animal.perceptionRange;
      const currentNode = state.map.nodes.find(n => n.id === state.map!.currentLocationId);
      if (!currentNode) return;

      const discoveredIds = new Set<string>([currentNode.id]);
      let currentLevel = [currentNode.id];

      for (let i = 0; i < range; i++) {
        const nextLevel: string[] = [];
        for (const id of currentLevel) {
          const node = state.map.nodes.find(n => n.id === id);
          node?.connections.forEach(connId => {
            if (!discoveredIds.has(connId)) {
              discoveredIds.add(connId);
              nextLevel.push(connId);
            }
          });
        }
        currentLevel = nextLevel;
      }

      set({
        map: {
          ...state.map,
          nodes: state.map.nodes.map(n => discoveredIds.has(n.id) ? { ...n, discovered: true } : n)
        },
        animal: { ...state.animal, energy: Math.max(0, state.animal.energy - 5) }
      });
    },

    tickNPCMovement() {
      const state = get();
      if (!state.map) return;

      const updatedNPCs = state.npcs.map(npc => {
        if (!npc.alive || !npc.currentNodeId) return npc;
        if (state.rng.chance(0.3)) {
          const currentNode = state.map!.nodes.find(n => n.id === npc.currentNodeId);
          if (currentNode && currentNode.connections.length > 0) {
            const nextNodeId = state.rng.pick(currentNode.connections);
            return { ...npc, currentNodeId: nextNodeId };
          }
        }
        return npc;
      });

      set({ npcs: updatedNPCs });
    },

    selectMutation(mutationId) {
      const state = get();
      const choice = state.evolution.availableChoices.find(m => m.id === mutationId);
      if (!choice) return;

      const config = state.speciesBundle.config;
      const backstory = state.animal.backstory;
      const sex = state.rng.chance(0.5) ? 'male' as const : 'female' as const;

      const newAnimal = createInitialAnimal(config, backstory, sex);
      newAnimal.activeMutations = [...state.evolution.activeMutations, choice];
      
      if (choice.statModifiers) {
        for (const mod of choice.statModifiers) {
          newAnimal.stats = addModifier(newAnimal.stats, {
            id: `mutation-${choice.id}`,
            source: choice.name,
            sourceType: 'condition',
            stat: mod.stat,
            amount: mod.amount,
          });
        }
      }

      set({
        phase: 'playing',
        animal: newAnimal,
        reproduction: initialReproduction(config),
        evolution: {
          ...state.evolution,
          activeMutations: newAnimal.activeMutations,
          availableChoices: [],
          generationCount: state.evolution.generationCount + 1,
        },
        currentEvents: [],
        pendingChoices: [],
        revocableChoices: {},
        map: generateRegionMap(state.rng),
      });
    },

    setEvents(events) {
      const pendingChoices = events
        .filter((e) => e.definition.choices && e.definition.choices.length > 0 && !e.choiceMade)
        .map((e) => e.definition.id);
      set({ currentEvents: events, pendingChoices });
    },

    makeChoice(eventId, choiceId) {
      const state = get();
      const updatedEvents = state.currentEvents.map((e) => {
        if (e.definition.id === eventId) {
          return { ...e, choiceMade: choiceId };
        }
        return e;
      });

      const pending = state.pendingChoices.filter((id) => id !== eventId);

      const event = state.currentEvents.find((e) => e.definition.id === eventId);
      const choice = event?.definition.choices?.find((c) => c.id === choiceId);
      const revocable = { ...state.revocableChoices };
      if (choice?.revocable) {
        revocable[eventId] = choiceId;
      }

      set({
        currentEvents: updatedEvents,
        pendingChoices: pending,
        revocableChoices: revocable,
      });
    },

    applyStatEffects(effects) {
      const state = get();
      let stats = { ...state.animal.stats };

      for (const effect of effects) {
        const modifier: StatModifier = {
          id: `effect-${state.time.turn}-${effect.stat}-${Math.random().toString(36).slice(2, 6)}`,
          source: effect.label,
          sourceType: 'event',
          stat: effect.stat,
          amount: effect.amount,
          duration: effect.duration,
        };
        stats = addModifier(stats, modifier);
      }

      set({ animal: { ...state.animal, stats } });
    },

    applyConsequence(consequence) {
      const state = get();
      const animal = { ...state.animal };
      const config = state.speciesBundle.config;

      switch (consequence.type) {
        case 'add_parasite': {
          const newParasite: ActiveParasite = {
            definitionId: consequence.parasiteId,
            currentStage: consequence.startStage ?? 0,
            turnsAtCurrentStage: 0,
            acquiredOnTurn: state.time.turn,
          };
          animal.parasites = [...animal.parasites, newParasite];
          set({ animal });
          break;
        }
        case 'add_injury': {
          const injuryDef = state.speciesBundle.injuries[consequence.injuryId];
          const severity = consequence.severity ?? 0;
          const baseHealingTime = injuryDef?.severityLevels[severity]?.baseHealingTime ?? 8;

          let bodyPart = consequence.bodyPart;
          if (!bodyPart && injuryDef?.bodyParts && injuryDef.bodyParts.length > 0) {
            bodyPart = state.rng.pick(injuryDef.bodyParts);
          }

          const newInjury: ActiveInjury = {
            definitionId: consequence.injuryId,
            currentSeverity: severity,
            turnsRemaining: baseHealingTime,
            bodyPartDetail: bodyPart ?? 'unspecified',
            isResting: false,
            acquiredOnTurn: state.time.turn,
          };
          animal.injuries = [...animal.injuries, newInjury];
          set({ animal });
          break;
        }
        case 'remove_parasite': {
          animal.parasites = animal.parasites.filter(
            (p) => p.definitionId !== consequence.parasiteId
          );
          animal.stats = removeModifiersBySource(animal.stats, consequence.parasiteId);
          set({ animal });
          break;
        }
        case 'modify_weight': {
          animal.weight = Math.max(config.weight.minFloor, animal.weight + consequence.amount);
          set({ animal });
          break;
        }
        case 'modify_nutrients': {
          animal.nutrients[consequence.nutrient] = Math.max(0, Math.min(100, animal.nutrients[consequence.nutrient] + consequence.amount));
          set({ animal });
          break;
        }
        case 'change_region': {
          animal.region = consequence.regionId;
          set({ animal });
          break;
        }
        case 'set_flag': {
          const newFlags = new Set(animal.flags);
          newFlags.add(consequence.flag);
          animal.flags = newFlags;
          set({ animal });
          break;
        }
        case 'remove_flag': {
          const newFlags = new Set(animal.flags);
          newFlags.delete(consequence.flag);
          animal.flags = newFlags;
          set({ animal });
          break;
        }
        case 'death': {
          animal.alive = false;
          animal.causeOfDeath = consequence.cause;
          set({ animal });
          break;
        }
        case 'start_pregnancy': {
          if (animal.sex === 'female' && state.reproduction.type === 'iteroparous' && !state.reproduction.pregnancy) {
            const reproConfig = config.reproduction;
            if (reproConfig.type !== 'iteroparous') break;

            const hea = computeEffectiveValue(animal.stats[StatId.HEA]);
            const count = consequence.offspringCount > 0
              ? consequence.offspringCount
              : determineFawnCount(animal.weight, hea, state.rng);

            const newFlags = new Set(animal.flags);
            newFlags.add(reproConfig.pregnantFlag);
            newFlags.add(reproConfig.maleCompetition.matedFlag);
            animal.flags = newFlags;

            set({
              animal,
              reproduction: {
                ...state.reproduction,
                pregnancy: {
                  conceivedOnTurn: state.time.turn,
                  turnsRemaining: reproConfig.gestationTurns,
                  offspringCount: count,
                },
                matedThisSeason: true,
              },
            });
          }
          break;
        }
        case 'sire_offspring': {
          if (animal.sex === 'male' && state.reproduction.type === 'iteroparous') {
            const reproConfig = config.reproduction;
            if (reproConfig.type !== 'iteroparous') break;

            const hea = computeEffectiveValue(animal.stats[StatId.HEA]);
            const count = consequence.offspringCount > 0
              ? consequence.offspringCount
              : determineFawnCount(animal.weight, hea, state.rng);

            const wis = computeEffectiveValue(animal.stats[StatId.WIS]);
            const fawns = createFawns(count, state.time.turn, state.time.year, wis, true, state.rng);

            const newFlags = new Set(animal.flags);
            newFlags.add(reproConfig.maleCompetition.matedFlag);
            animal.flags = newFlags;

            set({
              animal,
              reproduction: {
                ...state.reproduction,
                offspring: [...state.reproduction.offspring, ...fawns],
                matedThisSeason: true,
              },
            });
          }
          break;
        }
        case 'introduce_npc': {
          const npc = introduceNPC(state.animal.speciesId, consequence.npcType, state.time.turn, state.npcs, state.rng);
          if (npc) {
            set({ npcs: [...state.npcs, npc] });
          }
          break;
        }
        case 'spawn': {
          if (state.reproduction.type === 'semelparous' && !state.reproduction.spawned) {
            const reproConfig = config.reproduction;
            if (reproConfig.type !== 'semelparous') break;

            const hea = computeEffectiveValue(animal.stats[StatId.HEA]);
            const wis = computeEffectiveValue(animal.stats[StatId.WIS]);
            const eggCount = Math.round(
              reproConfig.baseEggCount +
              hea * reproConfig.eggCountHeaFactor +
              animal.weight * reproConfig.eggCountWeightFactor
            );
            let survivalRate = reproConfig.eggSurvivalBase + wis * reproConfig.eggSurvivalWisFactor;
            if (animal.flags.has('nest-quality-prime')) survivalRate *= 1.5;
            if (animal.flags.has('nest-quality-poor')) survivalRate *= 0.5;
            const estimatedSurvivors = Math.round(eggCount * survivalRate);

            const newFlags = new Set(animal.flags);
            newFlags.add(reproConfig.spawningCompleteFlag);
            animal.flags = newFlags;

            set({
              animal,
              reproduction: {
                ...state.reproduction,
                spawned: true,
                eggCount,
                estimatedSurvivors,
                totalFitness: estimatedSurvivors,
              },
            });
          }
          break;
        }
        case 'modify_population': {
          const newEco = modifyPopulation(state.ecosystem, consequence.speciesName, consequence.amount);
          set({ ecosystem: newEco });
          break;
        }
        case 'modify_territory': {
          const t = { ...state.territory };
          if (consequence.sizeChange) t.size = Math.max(0, Math.min(100, t.size + consequence.sizeChange));
          if (consequence.qualityChange) t.quality = Math.max(0, Math.min(100, t.quality + consequence.qualityChange));
          set({ territory: t });
          break;
        }
        case 'establish_den': {
          const nodeId = consequence.nodeId || state.map?.currentLocationId;
          if (!nodeId || !state.map) break;
          
          const newTerritory = { ...state.territory, denNodeId: nodeId };
          const newMap = {
            ...state.map,
            nodes: state.map.nodes.map(n => n.id === nodeId ? { ...n, type: 'den' as const } : n)
          };
          
          set({ territory: newTerritory, map: newMap });
          break;
        }
        default:
          break;
      }
    },

    advanceTurn() {
      const state = get();
      const config = state.speciesBundle.config;
      const difficultyMult = DIFFICULTY_PRESETS[state.difficulty];
      const turnUnit = config.turnUnit ?? 'week';
      const iterations = state.fastForward ? 12 : 1;
      const scaling = getScaling(config.massType);
      const massScale = config.massType === 'micro' ? 0.000001 : (config.massType === 'mega' ? 5 : 1);

      let currentAnimal = { ...state.animal };
      let currentTime = { ...state.time };
      let currentReproduction = { ...state.reproduction };
      let currentWeather = state.currentWeather;
      let currentCooldowns = { ...state.eventCooldowns };
      let currentClimateShift = state.climateShift;
      let currentMap = state.map;
      const currentHistory = [...state.turnHistory];

      for (let i = 0; i < iterations; i++) {
        const newTime = advanceTime(currentTime, turnUnit);
        let tickedStats = tickModifiers(currentAnimal.stats);
        
        // Advance weather
        const regionDef = getRegionDefinition(currentAnimal.region);
        const climate = regionDef?.climate;
        const newWeather = currentWeather
          ? tickWeather(currentWeather, climate, newTime.season, newTime.monthIndex, state.rng, currentClimateShift)
          : generateWeather(climate, newTime.season, newTime.monthIndex, state.rng, currentClimateShift);

        // Climate Shift (Hardcore Mode)
        if (newTime.year > currentTime.year) {
           currentClimateShift += 0.1;
        }
        
        // Tick Social
        currentAnimal.social = tickSocial(currentAnimal.social, state.rng);
        
        // Circadian & Lunar Bonuses/Penalties
        const isActivePeriod = 
          (config.diurnalType === 'diurnal' && (newTime.timeOfDay === 'day' || newTime.timeOfDay === 'dawn')) ||
          (config.diurnalType === 'nocturnal' && (newTime.timeOfDay === 'night' || newTime.timeOfDay === 'dusk')) ||
          (config.diurnalType === 'crepuscular' && (newTime.timeOfDay === 'dawn' || newTime.timeOfDay === 'dusk'));
        
        if (!isActivePeriod && !currentAnimal.flags.has('territory-established')) {
          // Stress if inactive and exposed
          tickedStats = addModifier(tickedStats, {
            id: 'circadian-stress',
            source: 'Exposed during rest',
            sourceType: 'condition',
            stat: StatId.TRA,
            amount: 5,
            duration: 1
          });
        }

        // Energy Drain (Metabolic Engine)
        currentAnimal.energy = Math.max(0, currentAnimal.energy - scaling.metabolicRate);
        
        // Physiological Stress
        // 1. Hypothermia (linked to CLI and weather)
        const cliStress = computeEffectiveValue(currentAnimal.stats[StatId.CLI]);
        const coldWeather = newWeather?.type === 'blizzard' || newWeather?.type === 'frost' || newWeather?.type === 'snow';
        if (cliStress > 60 || (coldWeather && cliStress > 40)) {
          currentAnimal.physiologicalStress.hypothermia = Math.min(100, currentAnimal.physiologicalStress.hypothermia + 10);
        } else {
          currentAnimal.physiologicalStress.hypothermia = Math.max(0, currentAnimal.physiologicalStress.hypothermia - 15);
        }

        // 2. Starvation (linked to weight and nutrients)
        if (currentAnimal.weight < config.weight.starvationDebuff) {
          currentAnimal.physiologicalStress.starvation = Math.min(100, currentAnimal.physiologicalStress.starvation + 8);
        } else {
          currentAnimal.physiologicalStress.starvation = Math.max(0, currentAnimal.physiologicalStress.starvation - 10);
        }

        // 3. Panic (decays slowly)
        currentAnimal.physiologicalStress.panic = Math.max(0, currentAnimal.physiologicalStress.panic - 20);

        // Nutrient Decay
        currentAnimal.nutrients.minerals = Math.max(0, currentAnimal.nutrients.minerals - 2);
        currentAnimal.nutrients.vitamins = Math.max(0, currentAnimal.nutrients.vitamins - 3);
        
        if (currentAnimal.nutrients.minerals < 20) {
          // Brittle bones / weakness
          tickedStats = addModifier(tickedStats, {
            id: 'mineral-deficiency',
            source: 'Mineral Deficiency',
            sourceType: 'condition',
            stat: StatId.STR,
            amount: -15,
            duration: 1
          });
        }

        if (currentAnimal.energy === 0) {
          tickedStats = addModifier(tickedStats, {
            id: 'exhaustion',
            source: 'Exhaustion',
            sourceType: 'condition',
            stat: StatId.HOM,
            amount: 10,
            duration: 1
          });
        }

        // Tick NPC Movement
        get().tickNPCMovement();

        // Tick cooldowns
        const newCooldowns: Record<string, number> = {};
        for (const [eventId, turns] of Object.entries(currentCooldowns)) {
          if (turns > 1) {
            newCooldowns[eventId] = turns - 1;
          }
        }
        currentCooldowns = newCooldowns;

        // Age the animal
        let ageIncrement = 0;
        if (turnUnit === 'month') {
          ageIncrement = 1;
        } else if (turnUnit === 'week') {
          if (newTime.week === 1) ageIncrement = 1;
        } else if (turnUnit === 'day') {
          if (newTime.dayInMonth === 1) ageIncrement = 1;
        }
        const newAge = currentAnimal.age + ageIncrement;

        // Starvation debuffs
        tickedStats = removeModifiersBySource(tickedStats, 'starvation-debuff');
        if (currentAnimal.weight < config.weight.starvationDebuff && currentAnimal.weight >= config.weight.starvationDeath) {
          const severity = (config.weight.starvationDebuff - currentAnimal.weight) /
            (config.weight.starvationDebuff - config.weight.starvationDeath);
          const debuffModifier: StatModifier = {
            id: 'starvation-debuff',
            source: 'Near-starvation',
            sourceType: 'condition',
            stat: StatId.HEA,
            amount: -Math.round(severity * config.weight.debuffMaxPenalty),
            duration: 1,
          };
          tickedStats = addModifier(tickedStats, debuffModifier);
        }

        // Apply weather survival penalties
        if (newWeather) {
          const weatherPenalty = computeWeatherPenalty(newWeather);
          for (const mod of weatherPenalty.statModifiers) {
            tickedStats = addModifier(tickedStats, {
              id: `weather-${mod.stat}-${newTime.turn}`,
              source: weatherLabel(newWeather.type),
              sourceType: 'condition',
              stat: mod.stat,
              amount: mod.amount,
              duration: mod.duration,
            });
          }
        }

        // Seasonal weight
        let seasonalWeightChange = config.seasonalWeight[newTime.season]
          + config.seasonalWeight.foragingBonus * state.behavioralSettings.foraging
          + (newWeather ? computeWeatherPenalty(newWeather).weightChange : 0);

        // Map Node Integration
        if (currentMap) {
          // Sensory Dispersion logic
          currentMap = {
            ...currentMap,
            nodes: currentMap.nodes.map(n => {
              let scent = Math.max(0, n.scentLevel - 15); // Natural decay
              let noise = Math.max(0, n.noiseLevel - 10); // Noise dissipation
              
              // Wind-driven scent dispersion (simplified)
              if (newWeather && newWeather.windSpeed > 30) {
                // High winds clear scent faster
                scent = Math.max(0, scent - (newWeather.windSpeed / 5));
              }

              // Periodic random spikes (carcasses, human activity)
              if (state.rng.chance(0.05)) scent += 40;
              if (n.type === 'plain' && state.rng.chance(0.02)) noise += 60; // road/human activity

              return { ...n, scentLevel: scent, noiseLevel: noise };
            })
          };

          const node = currentMap.nodes.find(n => n.id === currentMap!.currentLocationId);
          if (node) {
            // Apply Noise Stress
            if (node.noiseLevel > 50) {
              tickedStats = addModifier(tickedStats, {
                id: 'noise-stress',
                source: 'Anthropogenic Noise',
                sourceType: 'condition',
                stat: StatId.TRA,
                amount: 8,
                duration: 1
              });
            }

            const foodModifier = (node.resources.food - 50) / 50 * 0.5 * massScale;
            seasonalWeightChange += foodModifier;
            const coverModifier = (node.resources.cover - 50) / 100 * 0.2 * massScale;
            seasonalWeightChange += coverModifier;
            
            const depletion = state.behavioralSettings.foraging * 0.5;
            currentMap = {
              ...currentMap,
              nodes: currentMap.nodes.map(n => 
                n.id === currentMap!.currentLocationId 
                  ? { ...n, resources: { ...n.resources, food: Math.max(0, n.resources.food - depletion) } }
                  : n
              )
            };
          }

          if (newTime.dayInMonth === 1 || (turnUnit === 'week' && newTime.week === 1) || turnUnit === 'month') {
            currentMap = {
              ...currentMap,
              nodes: currentMap.nodes.map(n => {
                let type = n.type;
                let resources = { ...n.resources };
                if (newTime.season === 'winter' && type === 'water' && state.rng.chance(0.7)) {
                  type = 'plain';
                } else if (newTime.season !== 'winter' && type === 'plain' && n.id.includes('water')) {
                  type = 'water';
                }
                if (newTime.season === 'summer' && newWeather?.type === 'heat_wave') {
                  resources.food = Math.max(0, resources.food - 10);
                }
                if (newTime.season === 'spring') resources.food = Math.min(100, resources.food + 15);
                else resources.food = Math.min(100, resources.food + 5);
                return { ...n, type, resources };
              })
            };
          }
        }

        if (climate) {
          const temp = climate.temperatureByMonth[newTime.monthIndex];
          if (temp < 20) {
            seasonalWeightChange -= (20 - temp) * 0.05;
          }
        }

        if (TERRITORIAL_SPECIES.has(currentAnimal.speciesId) && state.territory.established) {
          seasonalWeightChange *= territoryWeightModifier(state.territory);
        }

        if (config.thermalProfile && newWeather) {
          const tp = config.thermalProfile;
          const intensity = newWeather.intensity;
          if (tp.type === 'ectotherm') {
            if (newWeather.type === 'heat_wave') seasonalWeightChange -= tp.heatPenalty * intensity;
            if (newWeather.type === 'frost' || newWeather.type === 'blizzard') seasonalWeightChange += tp.coldBenefit * intensity;
          } else {
            if (newWeather.type === 'blizzard' || newWeather.type === 'frost') seasonalWeightChange -= tp.coldPenalty * intensity;
            if (newWeather.type === 'heat_wave') seasonalWeightChange -= tp.heatPenalty * intensity;
          }
        }

        if (seasonalWeightChange < 0) {
          seasonalWeightChange *= difficultyMult.weightLossFactor;
        } else {
          seasonalWeightChange *= difficultyMult.weightGainFactor;
        }

        const newWeight = Math.max(config.weight.minFloor, currentAnimal.weight + seasonalWeightChange);

        tickedStats = removeModifiersBySource(tickedStats, 'age-phase');
        const currentAgePhase = config.agePhases.find(
          (p) => newAge >= p.minAge && (p.maxAge === undefined || newAge < p.maxAge)
        );
        if (currentAgePhase?.statModifiers) {
          for (const mod of currentAgePhase.statModifiers) {
            tickedStats = addModifier(tickedStats, {
              id: `age-phase-${mod.stat}`,
              source: 'age-phase',
              sourceType: 'condition',
              stat: mod.stat,
              amount: mod.amount,
            });
          }
        }

        const newFlags = new Set(currentAnimal.flags);
        if (currentReproduction.type === 'iteroparous') {
          const reproResult = tickReproduction(currentReproduction, currentAnimal, newTime, state.rng);
          for (const f of reproResult.flagsToAdd) newFlags.add(f);
          for (const f of reproResult.flagsToRemove) newFlags.delete(f);
          currentReproduction = reproResult.reproduction;
        }

        if (config.migration) {
          const mig = config.migration;
          if (newTime.season === mig.migrationSeason && newFlags.has(mig.migrationFlag) && !newFlags.has(mig.migratedFlag)) {
            newFlags.add(mig.migratedFlag);
            newFlags.delete(mig.migrationFlag);
          }
          if (newTime.season === mig.returnSeason && newFlags.has(mig.migratedFlag)) {
            newFlags.delete(mig.migratedFlag);
            newFlags.add(mig.returnFlag);
          } else if (newFlags.has(mig.returnFlag)) {
            newFlags.delete(mig.returnFlag);
          }
        }

        let newRegion = currentAnimal.region;
        if (config.migration) {
          if (newFlags.has(config.migration.migratedFlag)) {
            newRegion = config.migration.winterRegionId;
          } else {
            newRegion = config.defaultRegion;
          }
        }

        currentAnimal = {
          ...currentAnimal,
          stats: tickedStats,
          age: newAge,
          weight: newWeight,
          region: newRegion,
          flags: newFlags,
        };
        currentTime = newTime;
        currentWeather = newWeather;

        if (i === iterations - 1) {
          const statSnapshot = {} as Record<StatId, number>;
          for (const id of Object.values(StatId)) {
            statSnapshot[id] = computeEffectiveValue(currentAnimal.stats[id]);
          }
          currentHistory.push({
            turn: currentTime.turn,
            month: currentTime.month,
            year: currentTime.year,
            season: currentTime.season,
            events: state.currentEvents,
            statSnapshot,
          });
        }
      }

      set({
        time: currentTime,
        animal: currentAnimal,
        reproduction: currentReproduction,
        currentWeather,
        map: currentMap,
        currentEvents: [],
        pendingChoices: [],
        turnHistory: currentHistory,
        eventCooldowns: currentCooldowns,
        actionsPerformed: [],
        climateShift: currentClimateShift,
      });
    },

    updateBehavioralSetting(key, value) {
      const state = get();
      set({
        behavioralSettings: {
          ...state.behavioralSettings,
          [key]: value,
        },
      });
    },

    setTurnResult(result) {
      set({ turnResult: result, showingResults: true });
    },

    dismissResults() {
      set({ turnResult: null, showingResults: false });
      get().advanceTurn();
    },

    setEventCooldowns(cooldowns) {
      const state = get();
      set({ eventCooldowns: { ...state.eventCooldowns, ...cooldowns } });
    },

    setNPCs(npcs) {
      set({ npcs });
    },

    setActiveStorylines(storylines) {
      set({ activeStorylines: storylines });
    },

    advanceTutorial() {
      const state = get();
      if (state.tutorialStep === null) return;
      const next = state.tutorialStep + 1;
      if (next >= 4) {
        localStorage.setItem('wild-reckoning-tutorial-seen', 'true');
        set({ tutorialStep: null });
      } else {
        set({ tutorialStep: next });
      }
    },

    skipTutorial() {
      localStorage.setItem('wild-reckoning-tutorial-seen', 'true');
      set({ tutorialStep: null });
    },

    resumeGame() {
      const saved = loadGame();
      if (!saved || saved.phase !== 'playing') return false;
      set(saved);
      return true;
    },

    returnToMenu() {
      deleteSaveGame();
      const newSeed = Date.now();
      set({
        phase: 'menu',
        seed: newSeed,
        rng: createRng(newSeed),
        turnResult: null,
        showingResults: false,
      });
    },

    performAction(actionId: string) {
      const state = get();
      const action = VOLUNTARY_ACTIONS.find((a) => a.id === actionId);
      if (!action || state.actionsPerformed.includes(actionId)) return;

      const ctx: ActionContext = {
        speciesId: state.animal.speciesId,
        config: state.speciesBundle.config,
        territory: state.territory,
        reproductionType: state.speciesBundle.config.reproduction.type,
        season: state.time.season,
        matingSeasons:
          state.speciesBundle.config.reproduction.type === 'iteroparous'
            ? (state.speciesBundle.config.reproduction as any).matingSeasons ?? 'any'
            : [],
        rng: state.rng,
        nutrients: state.animal.nutrients,
      };

      const result = action.execute(ctx);

      if (result.statEffects.length > 0) {
        get().applyStatEffects(result.statEffects);
      }

      for (const c of result.consequences) {
        get().applyConsequence(c);
      }

      const actionEvent: ResolvedEvent = {
        definition: {
          id: `action-${actionId}`,
          type: 'passive',
          category: 'environmental',
          narrativeText: result.narrative,
          statEffects: result.statEffects,
          consequences: result.consequences,
          conditions: [],
          weight: 0,
          tags: ['action'],
        },
        resolvedNarrative: result.narrative,
        triggeredSubEvents: [],
      };

      set({
        actionsPerformed: [...state.actionsPerformed, actionId],
        currentEvents: [...get().currentEvents, actionEvent],
      });
    },

    resolveDeathRoll(eventId: string, escapeOptionId: string) {
      const state = get();
      if (!state.turnResult?.pendingDeathRolls) return;

      const rollIndex = state.turnResult.pendingDeathRolls.findIndex((r) => r.eventId === eventId);
      if (rollIndex === -1) return;

      const roll = state.turnResult.pendingDeathRolls[rollIndex];
      const option = roll.escapeOptions.find((o) => o.id === escapeOptionId);
      if (!option) return;

      let modifiedProb = roll.baseProbability - option.survivalModifier;
      modifiedProb = Math.max(0.01, Math.min(0.95, modifiedProb));

      const died = state.rng.chance(modifiedProb);

      if (died) {
        const remaining = state.turnResult.pendingDeathRolls.filter((_, i) => i !== rollIndex);
        set({
          turnResult: {
            ...state.turnResult,
            pendingDeathRolls: remaining.length > 0 ? remaining : undefined,
          },
        });
        get().killAnimal(roll.cause);
      } else {
        if (option.statCost && option.statCost.length > 0) {
          get().applyStatEffects(option.statCost);
        }

        const remaining = state.turnResult.pendingDeathRolls.filter((_, i) => i !== rollIndex);
        set({
          turnResult: {
            ...get().turnResult!,
            pendingDeathRolls: remaining.length > 0 ? remaining : undefined,
          },
        });
      }
    },

    killAnimal(cause) {
      const state = get();
      const config = state.speciesBundle.config;

      if (config.lineageMode && state.reproduction.type === 'semelparous' && state.reproduction.spawned) {
        const availableChoices = getAvailableMutations(state.rng, 3);
        const ancestor: AncestorRecord = {
          generation: state.evolution.generationCount,
          speciesId: state.animal.speciesId,
          name: state.animal.name,
          causeOfDeath: cause,
          mutationChosen: state.evolution.activeMutations[state.evolution.activeMutations.length - 1],
        };

        set({
          phase: 'evolving',
          evolution: {
            ...state.evolution,
            availableChoices,
            lineageHistory: [...state.evolution.lineageHistory, ancestor],
          }
        });
        return;
      }

      deleteSaveGame();

      if (state.reproduction.type === 'iteroparous') {
        let updatedOffspring = state.reproduction.offspring;
        if (state.animal.sex === 'female') {
          updatedOffspring = updatedOffspring.map((o) => {
            if (o.alive && !o.independent) {
              return { ...o, alive: false, causeOfDeath: 'Mother died while dependent' };
            }
            return o;
          });
        }

        set({
          phase: 'dead',
          animal: { ...state.animal, alive: false, causeOfDeath: cause },
          reproduction: {
            ...state.reproduction,
            offspring: updatedOffspring,
            totalFitness: updatedOffspring.filter((o) => o.matured).length,
          },
        });
      } else {
        set({
          phase: 'dead',
          animal: { ...state.animal, alive: false, causeOfDeath: cause },
        });
      }
    },
  };
});
