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
import { computeInheritedTraits, applyLineageBiases } from '../engine/LineageSystem';
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

export type GamePhase = 'menu' | 'playing' | 'dead';

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

  // Scenario
  scenario: ScenarioDefinition | null;

  // Lineage
  lineage: LineageTraits | null;

  // Player-initiated actions
  actionsPerformed: string[];

  // Actions
  startGame: (speciesId: string, backstory: Backstory, sex: 'male' | 'female', difficulty?: Difficulty) => void;
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
    scenario: null,
    lineage: null,
    actionsPerformed: [],

    startGame(speciesId, backstory, sex, difficulty) {
      const newSeed = Date.now();
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
        scenario: null,
        lineage: null,
        actionsPerformed: [],
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
          const newInjury: ActiveInjury = {
            definitionId: consequence.injuryId,
            currentSeverity: severity,
            turnsRemaining: baseHealingTime,
            bodyPartDetail: consequence.bodyPart ?? 'unspecified',
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
        default:
          break;
      }
    },

    advanceTurn() {
      const state = get();
      const config = state.speciesBundle.config;
      const difficultyMult = DIFFICULTY_PRESETS[state.difficulty];

      const turnUnit = config.turnUnit ?? 'week';
      const newTime = advanceTime(state.time, turnUnit);
      let tickedStats = tickModifiers(state.animal.stats);

      // Tick cooldowns
      const newCooldowns: Record<string, number> = {};
      for (const [eventId, turns] of Object.entries(state.eventCooldowns)) {
        if (turns > 1) {
          newCooldowns[eventId] = turns - 1;
        }
      }

      // Age the animal: monthly species age every turn, weekly species age every 4 turns
      const newAge = state.animal.age + (turnUnit === 'month' ? 1 : (newTime.week === 1 ? 1 : 0));

      // Starvation debuffs: approaching starvation weakens the animal
      tickedStats = removeModifiersBySource(tickedStats, 'starvation-debuff');
      if (state.animal.weight < config.weight.starvationDebuff && state.animal.weight >= config.weight.starvationDeath) {
        const severity = (config.weight.starvationDebuff - state.animal.weight) /
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

      // Advance weather
      const regionDef = getRegionDefinition(state.animal.region);
      const climate = regionDef?.climate;
      const newWeather = state.currentWeather
        ? tickWeather(state.currentWeather, climate, newTime.season, newTime.monthIndex, state.rng)
        : generateWeather(climate, newTime.season, newTime.monthIndex, state.rng);

      // Apply weather survival penalties (extreme weather causes direct harm)
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
        // Weather weight penalty applied below with seasonal weight
      }

      // Seasonal weight: passive gain/loss based on season and foraging behavior
      let seasonalWeightChange = config.seasonalWeight[newTime.season]
        + config.seasonalWeight.foragingBonus * state.behavioralSettings.foraging
        + (newWeather ? computeWeatherPenalty(newWeather).weightChange : 0);

      // Region climate modulation: extreme cold increases energy expenditure
      if (climate) {
        const temp = climate.temperatureByMonth[newTime.monthIndex];
        if (temp < 20) {
          seasonalWeightChange -= (20 - temp) * 0.05;
        }
      }

      // Apply territory quality modifier for territorial species
      if (TERRITORIAL_SPECIES.has(state.animal.speciesId) && state.territory.established) {
        seasonalWeightChange *= territoryWeightModifier(state.territory);
      }

      // Thermal stress: ectotherms/endotherms respond differently to extreme weather
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

      // Apply difficulty multipliers to seasonal weight change
      if (seasonalWeightChange < 0) {
        seasonalWeightChange *= difficultyMult.weightLossFactor;
      } else {
        seasonalWeightChange *= difficultyMult.weightGainFactor;
      }

      const newWeight = Math.max(
        config.weight.minFloor,
        state.animal.weight + seasonalWeightChange
      );

      // Age phase modifiers: apply/remove based on current age phase
      tickedStats = removeModifiersBySource(tickedStats, 'age-phase');
      const currentAgePhase = config.agePhases.find(
        (p) => newAge >= p.minAge && (p.maxAge === undefined || newAge < p.maxAge)
      );
      if (currentAgePhase?.statModifiers) {
        for (const mod of currentAgePhase.statModifiers) {
          const modifier: StatModifier = {
            id: `age-phase-${mod.stat}`,
            source: 'age-phase',
            sourceType: 'condition',
            stat: mod.stat,
            amount: mod.amount,
          };
          tickedStats = addModifier(tickedStats, modifier);
        }
      }

      // Tick reproduction (iteroparous only — semelparous handled via events)
      const newFlags = new Set(state.animal.flags);
      let updatedReproduction = state.reproduction;

      if (state.reproduction.type === 'iteroparous') {
        const reproResult = tickReproduction(
          state.reproduction,
          state.animal,
          newTime,
          state.rng,
        );
        for (const f of reproResult.flagsToAdd) newFlags.add(f);
        for (const f of reproResult.flagsToRemove) newFlags.delete(f);
        updatedReproduction = reproResult.reproduction;
      }

      // Auto-trigger migration: if will-migrate flag is set and season matches
      if (config.migration) {
        const mig = config.migration;
        if (newTime.season === mig.migrationSeason && state.animal.flags.has(mig.migrationFlag) && !state.animal.flags.has(mig.migratedFlag)) {
          newFlags.add(mig.migratedFlag);
          newFlags.delete(mig.migrationFlag);
          // Region change happens here — set animal region to winter yard
          // We'll apply it in the set() call below
        }
        // Auto-return in spring
        if (newTime.season === mig.returnSeason && state.animal.flags.has(mig.migratedFlag)) {
          newFlags.delete(mig.migratedFlag);
          newFlags.add(mig.returnFlag);
        }
        // Clear return flag after one turn
        if (state.animal.flags.has(mig.returnFlag)) {
          newFlags.delete(mig.returnFlag);
        }
      }

      // Determine region based on migration state
      let newRegion = state.animal.region;
      if (config.migration) {
        if (newFlags.has(config.migration.migratedFlag)) {
          newRegion = config.migration.winterRegionId;
        } else if (!newFlags.has(config.migration.migratedFlag)) {
          newRegion = config.defaultRegion;
        }
      }

      // Save turn to history with actual stat snapshot
      const statSnapshot = {} as Record<StatId, number>;
      for (const id of Object.values(StatId)) {
        statSnapshot[id] = computeEffectiveValue(state.animal.stats[id]);
      }
      const record: TurnRecord = {
        turn: state.time.turn,
        month: state.time.month,
        year: state.time.year,
        season: state.time.season,
        events: state.currentEvents,
        statSnapshot,
      };

      set({
        time: newTime,
        animal: {
          ...state.animal,
          stats: tickedStats,
          age: newAge,
          weight: newWeight,
          region: newRegion,
          flags: newFlags,
        },
        reproduction: updatedReproduction,
        currentWeather: newWeather,
        currentEvents: [],
        pendingChoices: [],
        turnHistory: [...state.turnHistory, record],
        eventCooldowns: newCooldowns,
        actionsPerformed: [],
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
        // Tutorial complete
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
        territory: state.territory,
        reproductionType: state.speciesBundle.config.reproduction.type,
        season: state.time.season,
        matingSeasons:
          state.speciesBundle.config.reproduction.type === 'iteroparous'
            ? (state.speciesBundle.config.reproduction as any).matingSeasons ?? 'any'
            : [],
        rng: state.rng,
      };

      const result = action.execute(ctx);

      // Apply stat effects
      if (result.statEffects.length > 0) {
        get().applyStatEffects(result.statEffects);
      }

      // Apply consequences
      for (const c of result.consequences) {
        get().applyConsequence(c);
      }

      // Add action as a passive event so it appears in the event feed
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

      // Calculate modified death probability: subtract survival modifier
      let modifiedProb = roll.baseProbability - option.survivalModifier;
      modifiedProb = Math.max(0.01, Math.min(0.95, modifiedProb));

      // Roll the dice
      const died = state.rng.chance(modifiedProb);

      if (died) {
        // Remove the pending roll and kill the animal
        const remaining = state.turnResult.pendingDeathRolls.filter((_, i) => i !== rollIndex);
        set({
          turnResult: {
            ...state.turnResult,
            pendingDeathRolls: remaining.length > 0 ? remaining : undefined,
          },
        });
        get().killAnimal(roll.cause);
      } else {
        // Survived: apply stat cost if any, then remove the pending roll
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

      // Lineage mode: if the species supports it and the animal has spawned,
      // continue as the next generation instead of ending the game
      if (config.lineageMode && state.reproduction.type === 'semelparous' && state.reproduction.spawned) {
        const backstory = state.animal.backstory;
        const sex = state.rng.chance(0.5) ? 'male' as const : 'female' as const;

        // Compute inherited traits for next generation
        const parentStats: Record<StatId, number> = {} as Record<StatId, number>;
        for (const id of Object.values(StatId)) {
          parentStats[id] = computeEffectiveValue(state.animal.stats[id]);
        }
        const newLineage = computeInheritedTraits(parentStats, state.lineage, config, state.rng);

        // Create new animal with inherited biases
        const newAnimal = createInitialAnimal(config, backstory, sex);
        const biasedBases = applyLineageBiases(
          Object.fromEntries(Object.values(StatId).map((id) => [id, config.baseStats[id]])) as Record<StatId, number>,
          newLineage,
        );
        newAnimal.stats = createStatBlock(biasedBases);

        set({
          animal: newAnimal,
          reproduction: { ...INITIAL_SEMELPAROUS_STATE },
          currentEvents: [],
          pendingChoices: [],
          revocableChoices: {},
          lineage: newLineage,
        });
        return;
      }

      deleteSaveGame();

      if (state.reproduction.type === 'iteroparous') {
        // Kill dependent offspring if the mother dies
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
