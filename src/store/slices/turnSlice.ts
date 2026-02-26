import type { GameSlice, TurnSlice } from './types';
import { advanceTime } from '../../engine/TimeSystem';
import { getRegionDefinition } from '../../data/regions';
import { generateWeather, tickWeather, computeWeatherPenalty, weatherLabel } from '../../engine/WeatherSystem';
import { tickSocial } from '../../engine/SocialSystem';
import { StatId, computeEffectiveValue } from '../../types/stats';
import { addModifier, tickModifiers, removeModifiersBySource } from '../../engine/StatCalculator';
import { tickReproduction, determineOffspringCount, createOffspring } from '../../engine/ReproductionSystem';
import { DIFFICULTY_PRESETS } from '../../types/difficulty';
import { TERRITORIAL_SPECIES, territoryWeightModifier } from '../../engine/TerritorySystem';
import { modifyPopulation } from '../../engine/EcosystemSystem';
import { introduceNPC } from '../../engine/NPCSystem';
import { tickPhysiology } from '../../engine/PhysiologySystem';
import type { GameFlag } from '../../types/flags';

export const createTurnSlice: GameSlice<TurnSlice> = (set, get) => ({
  currentEvents: [],
  pendingChoices: [],
  revocableChoices: {},
  turnHistory: [],
  eventCooldowns: {},

  setEvents: (events) => {
    const pendingChoices = events
      .filter((e) => e.definition.choices && e.definition.choices.length > 0 && !e.choiceMade)
      .map((e) => e.definition.id);
    set({ currentEvents: events, pendingChoices });
  },

  makeChoice: (eventId, choiceId) => {
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

  applyStatEffects: (effects) => {
    const state = get();
    let stats = { ...state.animal.stats };

    for (const effect of effects) {
      const modifier = {
        id: `effect-${state.time.turn}-${effect.stat}-${Math.random().toString(36).slice(2, 6)}`,
        source: effect.label,
        sourceType: 'event' as const,
        stat: effect.stat,
        amount: effect.amount,
        duration: effect.duration,
      };
      stats = addModifier(stats, modifier);
    }

    set({ animal: { ...state.animal, stats } });
  },

  applyConsequence: (consequence) => {
    const state = get();
    const animal = { ...state.animal };
    const config = state.speciesBundle.config;

    switch (consequence.type) {
      case 'add_parasite': {
        const newParasite = {
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

        const newInjury = {
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
        newFlags.add(consequence.flag as GameFlag);
        animal.flags = newFlags;
        set({ animal });
        break;
      }
      case 'remove_flag': {
        const newFlags = new Set(animal.flags);
        newFlags.delete(consequence.flag as GameFlag);
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
        if (state.reproduction.type === 'iteroparous' && !state.reproduction.pregnancy) {
          const reproConfig = config.reproduction;
          if (reproConfig.type !== 'iteroparous') break;

          const hea = computeEffectiveValue(animal.stats[StatId.HEA]);
          const count = consequence.offspringCount > 0
            ? consequence.offspringCount
            : determineOffspringCount(animal.weight, hea, config, state.rng);

          const newFlags = new Set(animal.flags);
          newFlags.add(reproConfig.pregnantFlag as GameFlag);
          newFlags.add(reproConfig.maleCompetition.matedFlag as GameFlag);
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
            : determineOffspringCount(animal.weight, hea, config, state.rng);

          const wis = computeEffectiveValue(animal.stats[StatId.WIS]);
          const fawns = createOffspring(count, state.time.turn, state.time.year, wis, true, config, state.rng);

          const newFlags = new Set(animal.flags);
          newFlags.add(reproConfig.maleCompetition.matedFlag as GameFlag);
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
          newFlags.add(reproConfig.spawningCompleteFlag as GameFlag);
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

  advanceTurn: () => {
    const state = get();
    const config = state.speciesBundle.config;
    const difficultyMult = DIFFICULTY_PRESETS[state.difficulty];
    const turnUnit = config.turnUnit ?? 'week';
    const iterations = state.fastForward ? 12 : 1;
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

      // Climate Shift
      if (newTime.year > currentTime.year) {
         currentClimateShift += 0.1;
      }
      
      // Tick Social
      currentAnimal.social = tickSocial(currentAnimal.social, state.rng);
      
      // Tick Physiology (Metabolism, Stress, Nutrients, Circadian)
      const physResult = tickPhysiology(
        currentAnimal,
        newTime,
        newWeather,
        config,
        state.behavioralSettings
      );
      currentAnimal = physResult.animal;
      for (const mod of physResult.modifiers) {
        tickedStats = addModifier(tickedStats, mod);
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
        const debuffModifier = {
          id: 'starvation-debuff',
          source: 'Near-starvation',
          sourceType: 'condition' as const,
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
            sourceType: 'condition' as const,
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
        currentMap = {
          ...currentMap,
          nodes: currentMap.nodes.map(n => {
            let scent = Math.max(0, n.scentLevel - 15);
            let noise = Math.max(0, n.noiseLevel - 10);
            if (newWeather && newWeather.windSpeed > 30) {
              scent = Math.max(0, scent - (newWeather.windSpeed / 5));
            }
            if (state.rng.chance(0.05)) scent += 40;
            if (n.type === 'plain' && state.rng.chance(0.02)) noise += 60;
            return { ...n, scentLevel: scent, noiseLevel: noise };
          })
        };

        const node = currentMap.nodes.find(n => n.id === currentMap!.currentLocationId);
        if (node) {
          if (node.noiseLevel > 50) {
            tickedStats = addModifier(tickedStats, {
              id: 'noise-stress',
              source: 'Anthropogenic Noise',
              sourceType: 'condition' as const,
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
              const resources = { ...n.resources };
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
            sourceType: 'condition' as const,
            stat: mod.stat,
            amount: mod.amount,
          });
        }
      }

      const newFlags = new Set(currentAnimal.flags);
      if (currentReproduction.type === 'iteroparous') {
        const reproResult = tickReproduction(currentReproduction, currentAnimal, newTime, config, state.rng);
        for (const f of reproResult.flagsToAdd) newFlags.add(f as GameFlag);
        for (const f of reproResult.flagsToRemove) newFlags.delete(f as GameFlag);
        currentReproduction = reproResult.reproduction;
      }

      if (config.migration) {
        const mig = config.migration;
        if (newTime.season === mig.migrationSeason && newFlags.has(mig.migrationFlag as GameFlag) && !newFlags.has(mig.migratedFlag as GameFlag)) {
          newFlags.add(mig.migratedFlag as GameFlag);
          newFlags.delete(mig.migrationFlag as GameFlag);
        }
        if (newTime.season === mig.returnSeason && newFlags.has(mig.migratedFlag as GameFlag)) {
          newFlags.delete(mig.migratedFlag as GameFlag);
          newFlags.add(mig.returnFlag as GameFlag);
        } else if (newFlags.has(mig.returnFlag as GameFlag)) {
          newFlags.delete(mig.returnFlag as GameFlag);
        }
      }

      let newRegion = currentAnimal.region;
      if (config.migration) {
        if (newFlags.has(config.migration.migratedFlag as GameFlag)) {
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

  setEventCooldowns: (cooldowns) => {
    const state = get();
    set({ eventCooldowns: { ...state.eventCooldowns, ...cooldowns } });
  },

  resolveDeathRoll: (eventId, escapeOptionId) => {
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
});
