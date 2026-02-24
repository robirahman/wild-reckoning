import { create } from 'zustand';
import type { AnimalState, Backstory } from '../types/species';
import type { TimeState } from '../types/world';
import type { BehavioralSettings } from '../types/behavior';
import type { ResolvedEvent, StatEffect, Consequence } from '../types/events';
import type { StatModifier } from '../types/stats';
import type { ActiveParasite, ActiveInjury } from '../types/health';
import type { ReproductionState } from '../types/reproduction';
import type { SpeciesDataBundle } from '../types/speciesConfig';
import type { SpeciesConfig } from '../types/speciesConfig';
import { StatId } from '../types/stats';
import { DEFAULT_BEHAVIORAL_SETTINGS } from '../types/behavior';
import { INITIAL_ITEROPAROUS_STATE, INITIAL_SEMELPAROUS_STATE } from '../types/reproduction';
import { createStatBlock, addModifier, tickModifiers, removeModifiersBySource } from '../engine/StatCalculator';
import { createInitialTime, advanceTime } from '../engine/TimeSystem';
import { createRng, type Rng } from '../engine/RandomUtils';
import { computeEffectiveValue } from '../types/stats';
import { tickReproduction, determineFawnCount, createFawns } from '../engine/ReproductionSystem';
import { getSpeciesBundle } from '../data/species';

export type GamePhase = 'menu' | 'playing' | 'dead';

export interface TurnRecord {
  turn: number;
  events: ResolvedEvent[];
  statSnapshot: Record<StatId, number>;
}

export interface GameState {
  // Meta
  phase: GamePhase;
  rng: Rng;
  seed: number;

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

  // History
  turnHistory: TurnRecord[];
  eventCooldowns: Record<string, number>;

  // Actions
  startGame: (speciesId: string, backstory: Backstory, sex: 'male' | 'female') => void;
  setEvents: (events: ResolvedEvent[]) => void;
  makeChoice: (eventId: string, choiceId: string) => void;
  applyStatEffects: (effects: StatEffect[]) => void;
  applyConsequence: (consequence: Consequence) => void;
  advanceTurn: () => void;
  updateBehavioralSetting: (key: keyof BehavioralSettings, value: 1 | 2 | 3 | 4 | 5) => void;
  killAnimal: (cause: string) => void;
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
    turnHistory: [],
    eventCooldowns: {},

    startGame(speciesId, backstory, sex) {
      const newSeed = Date.now();
      const bundle = getSpeciesBundle(speciesId);
      set({
        phase: 'playing',
        seed: newSeed,
        rng: createRng(newSeed),
        speciesBundle: bundle,
        animal: createInitialAnimal(bundle.config, backstory, sex),
        time: createInitialTime(5, 1),
        behavioralSettings: { ...DEFAULT_BEHAVIORAL_SETTINGS },
        reproduction: initialReproduction(bundle.config),
        currentEvents: [],
        pendingChoices: [],
        revocableChoices: {},
        turnHistory: [],
        eventCooldowns: {},
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
          const newInjury: ActiveInjury = {
            definitionId: consequence.injuryId,
            currentSeverity: consequence.severity ?? 0,
            turnsRemaining: 8,
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
            const survivalRate = reproConfig.eggSurvivalBase + wis * reproConfig.eggSurvivalWisFactor;
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
        default:
          break;
      }
    },

    advanceTurn() {
      const state = get();
      const config = state.speciesBundle.config;

      const newTime = advanceTime(state.time);
      let tickedStats = tickModifiers(state.animal.stats);

      // Tick cooldowns
      const newCooldowns: Record<string, number> = {};
      for (const [eventId, turns] of Object.entries(state.eventCooldowns)) {
        if (turns > 1) {
          newCooldowns[eventId] = turns - 1;
        }
      }

      // Age the animal (1 month per 4 turns)
      const newAge = state.animal.age + (newTime.week === 1 ? 1 : 0);

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

      // Save turn to history
      const record: TurnRecord = {
        turn: state.time.turn,
        events: state.currentEvents,
        statSnapshot: {} as Record<StatId, number>,
      };

      set({
        time: newTime,
        animal: {
          ...state.animal,
          stats: tickedStats,
          age: newAge,
          flags: newFlags,
        },
        reproduction: updatedReproduction,
        currentEvents: [],
        pendingChoices: [],
        turnHistory: [...state.turnHistory, record],
        eventCooldowns: newCooldowns,
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

    killAnimal(cause) {
      const state = get();

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
