import { create } from 'zustand';
import type { AnimalState, Backstory } from '../types/species';
import type { TimeState } from '../types/world';
import type { BehavioralSettings } from '../types/behavior';
import type { ResolvedEvent, StatEffect, Consequence } from '../types/events';
import type { StatModifier } from '../types/stats';
import type { ActiveParasite, ActiveInjury } from '../types/health';
import type { ReproductionState } from '../types/reproduction';
import { StatId } from '../types/stats';
import { DEFAULT_BEHAVIORAL_SETTINGS } from '../types/behavior';
import { BACKSTORY_OPTIONS } from '../types/species';
import { INITIAL_REPRODUCTION_STATE } from '../types/reproduction';
import { createStatBlock, addModifier, tickModifiers, removeModifiersBySource } from '../engine/StatCalculator';
import { createInitialTime, advanceTime } from '../engine/TimeSystem';
import { createRng, type Rng } from '../engine/RandomUtils';
import { computeEffectiveValue } from '../types/stats';
import { tickReproduction, determineFawnCount, createFawns } from '../engine/ReproductionSystem';

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

function createInitialAnimal(backstory: Backstory, sex: 'male' | 'female'): AnimalState {
  const baseBases: Record<StatId, number> = {
    [StatId.IMM]: 40,
    [StatId.CLI]: 20,
    [StatId.HOM]: 35,
    [StatId.TRA]: 30,
    [StatId.ADV]: 30,
    [StatId.NOV]: 40,
    [StatId.WIS]: 25,
    [StatId.HEA]: 60,
    [StatId.STR]: 35,
  };

  for (const adj of backstory.statAdjustments) {
    const statId = adj.stat as StatId;
    if (statId in baseBases) {
      baseBases[statId] = Math.max(0, Math.min(100, baseBases[statId] + adj.amount));
    }
  }

  return {
    speciesId: 'white-tailed-deer',
    age: backstory.type === 'rehabilitation' ? 17 : 12,
    weight: sex === 'female' ? 84 : 110,
    sex,
    region: 'northern-minnesota',
    stats: createStatBlock(baseBases),
    parasites: [],
    injuries: [],
    conditions: [],
    backstory,
    flags: new Set<string>(),
    alive: true,
  };
}

export const useGameStore = create<GameState>((set, get) => {
  const seed = Date.now();
  const rng = createRng(seed);

  return {
    phase: 'menu',
    rng,
    seed,
    animal: createInitialAnimal(BACKSTORY_OPTIONS[0], 'female'),
    time: createInitialTime(5, 1),
    behavioralSettings: { ...DEFAULT_BEHAVIORAL_SETTINGS },
    reproduction: { ...INITIAL_REPRODUCTION_STATE },
    currentEvents: [],
    pendingChoices: [],
    revocableChoices: {},
    turnHistory: [],
    eventCooldowns: {},

    startGame(speciesId, backstory, sex) {
      const newSeed = Date.now();
      set({
        phase: 'playing',
        seed: newSeed,
        rng: createRng(newSeed),
        animal: createInitialAnimal(backstory, sex),
        time: createInitialTime(5, 1),
        behavioralSettings: { ...DEFAULT_BEHAVIORAL_SETTINGS },
        reproduction: { ...INITIAL_REPRODUCTION_STATE },
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
          animal.weight = Math.max(20, animal.weight + consequence.amount);
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
          if (animal.sex === 'female' && !state.reproduction.pregnancy) {
            const hea = computeEffectiveValue(animal.stats[StatId.HEA]);
            const fawnCount = consequence.fawnCount > 0
              ? consequence.fawnCount
              : determineFawnCount(animal.weight, hea, state.rng);

            const newFlags = new Set(animal.flags);
            newFlags.add('pregnant');
            newFlags.add('mated-this-season');
            animal.flags = newFlags;

            set({
              animal,
              reproduction: {
                ...state.reproduction,
                pregnancy: {
                  conceivedOnTurn: state.time.turn,
                  turnsRemaining: 28,
                  fawnCount,
                },
                matedThisSeason: true,
              },
            });
          }
          break;
        }
        case 'sire_offspring': {
          if (animal.sex === 'male') {
            const hea = computeEffectiveValue(animal.stats[StatId.HEA]);
            const fawnCount = consequence.fawnCount > 0
              ? consequence.fawnCount
              : determineFawnCount(animal.weight, hea, state.rng);

            const wis = computeEffectiveValue(animal.stats[StatId.WIS]);
            const fawns = createFawns(fawnCount, state.time.turn, state.time.year, wis, true, state.rng);

            const newFlags = new Set(animal.flags);
            newFlags.add('mated-this-season');
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
        default:
          break;
      }
    },

    advanceTurn() {
      const state = get();

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
      if (state.animal.weight < 60 && state.animal.weight >= 35) {
        const severity = (60 - state.animal.weight) / 25;
        const debuffModifier: StatModifier = {
          id: 'starvation-debuff',
          source: 'Near-starvation',
          sourceType: 'condition',
          stat: StatId.HEA,
          amount: -Math.round(severity * 15),
          duration: 1,
        };
        tickedStats = addModifier(tickedStats, debuffModifier);
      }

      // Tick reproduction
      const reproResult = tickReproduction(
        state.reproduction,
        state.animal,
        newTime,
        state.rng,
      );

      // Apply reproduction flag changes
      const newFlags = new Set(state.animal.flags);
      for (const f of reproResult.flagsToAdd) newFlags.add(f);
      for (const f of reproResult.flagsToRemove) newFlags.delete(f);

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
        reproduction: reproResult.reproduction,
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

      // Kill dependent fawns if the mother dies
      let updatedOffspring = state.reproduction.offspring;
      if (state.animal.sex === 'female') {
        updatedOffspring = updatedOffspring.map((fawn) => {
          if (fawn.alive && !fawn.independent) {
            return {
              ...fawn,
              alive: false,
              causeOfDeath: 'Mother died while dependent',
            };
          }
          return fawn;
        });
      }

      set({
        phase: 'dead',
        animal: {
          ...state.animal,
          alive: false,
          causeOfDeath: cause,
        },
        reproduction: {
          ...state.reproduction,
          offspring: updatedOffspring,
          totalFitness: updatedOffspring.filter((o) => o.matured).length,
        },
      });
    },
  };
});
