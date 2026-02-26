/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatId } from '../types/stats';
import { createRng } from './RandomUtils';
import { DIFFICULTY_PRESETS, type Difficulty } from '../types/difficulty';

/** 
 * Minimized copy of engine logic for the worker.
 * We avoid importing complex modules to keep worker size small and avoid circular dependencies.
 */

function computeEffectiveValue(statState: any): number {
  if (!statState) return 0;
  return Math.max(0, Math.min(100, statState.base + statState.modifiers.reduce((acc: number, m: any) => acc + m.amount, 0)));
}

function checkCondition(cond: any, ctx: any): boolean {
  switch (cond.type) {
    case 'season': return cond.seasons.includes(ctx.time.season);
    case 'region': return cond.regionIds.includes(ctx.animal.region);
    case 'species': return cond.speciesIds.includes(ctx.animal.speciesId);
    case 'diet': return cond.diets.includes(ctx.config.diet);
    case 'stat_above': return computeEffectiveValue(ctx.animal.stats[cond.stat]) > cond.threshold;
    case 'stat_below': return computeEffectiveValue(ctx.animal.stats[cond.stat]) < cond.threshold;
    case 'has_parasite': return ctx.animal.parasites.some((p: any) => p.definitionId === cond.parasiteId);
    case 'no_parasite': return !ctx.animal.parasites.some((p: any) => p.definitionId === cond.parasiteId);
    case 'has_injury':
      if (cond.injuryId) return ctx.animal.injuries.some((i: any) => i.definitionId === cond.injuryId);
      return ctx.animal.injuries.length > 0;
    case 'no_injury': return !ctx.animal.injuries.some((i: any) => i.definitionId === cond.injuryId);
    case 'age_range':
      if (cond.min !== undefined && ctx.animal.age < cond.min) return false;
      if (cond.max !== undefined && ctx.animal.age > cond.max) return false;
      return true;
    case 'has_flag': return ctx.animal.flags.has(cond.flag);
    case 'no_flag': return !ctx.animal.flags.has(cond.flag);
    case 'weight_above': return ctx.animal.weight > cond.threshold;
    case 'weight_below': return ctx.animal.weight < cond.threshold;
    case 'sex': return ctx.animal.sex === cond.sex;
    case 'weather': return !!ctx.currentWeather && cond.weatherTypes.includes(ctx.currentWeather.type);
    case 'population_above': {
      const pop = ctx.ecosystem?.populations[cond.speciesName];
      return pop ? pop.level > cond.threshold : false;
    }
    case 'population_below': {
      const pop = ctx.ecosystem?.populations[cond.speciesName];
      return pop ? pop.level < cond.threshold : false;
    }
    case 'has_npc': return !!ctx.npcs?.some((n: any) => n.type === cond.npcType && n.alive);
    case 'no_npc': return !ctx.npcs?.some((n: any) => n.type === cond.npcType && n.alive);
    case 'node_type': return !ctx.currentNodeType || cond.nodeTypes.includes(ctx.currentNodeType);
    case 'social_rank': return cond.ranks.includes(ctx.animal.social.rank);
    case 'mutation_active': return ctx.animal.activeMutations.some((m: any) => m.id === cond.mutationId);
    default: return true;
  }
}

function behaviorMultiplier(event: any, behavior: any): number {
  let mult = 1.0;
  const tags = event.tags;
  if (tags.includes('foraging') || tags.includes('food')) mult *= 0.5 + behavior.foraging * 0.3;
  if (tags.includes('predator') || tags.includes('danger')) mult *= 1.5 - behavior.caution * 0.2;
  if (tags.includes('social') || tags.includes('herd')) mult *= 0.5 + behavior.sociability * 0.3;
  if (tags.includes('mating') || tags.includes('reproductive')) mult *= 0.3 + behavior.mating * 0.3;
  if (tags.includes('exploration') || tags.includes('travel')) mult *= 0.5 + behavior.exploration * 0.3;
  if (tags.includes('confrontation') || tags.includes('territorial')) mult *= 0.3 + behavior.belligerence * 0.3;
  return mult;
}

function contextMultiplier(event: any, ctx: any): number {
  let mult = 1.0;
  if (event.category === 'psychological') {
    mult *= 0.5 + (computeEffectiveValue(ctx.animal.stats[StatId.TRA]) / 100) * 1.5;
  }
  if (event.category === 'health') {
    mult *= 1.5 - (computeEffectiveValue(ctx.animal.stats[StatId.HEA]) / 100);
    mult *= 0.8 + (computeEffectiveValue(ctx.animal.stats[StatId.IMM]) / 100) * 0.8;
  }
  if (event.category === 'environmental' || event.category === 'seasonal') {
    mult *= 0.7 + (computeEffectiveValue(ctx.animal.stats[StatId.CLI]) / 100) * 1.0;
  }
  if (event.category === 'migration') {
    mult *= 0.6 + (computeEffectiveValue(ctx.animal.stats[StatId.NOV]) / 100) * 1.0;
  }
  if (event.category === 'predator') {
    mult *= 0.7 + (computeEffectiveValue(ctx.animal.stats[StatId.ADV]) / 100) * 0.8;
  }
  return mult;
}

function resolveTemplate(text: string, ctx: any): string {
  const tv = ctx.config.templateVars;
  return text
    .replace(/\{\{animal\.species\}\}/g, tv.speciesName)
    .replace(/\{\{animal\.sex_pronoun\}\}/g, ctx.animal.sex === 'female' ? 'she' : 'he')
    .replace(/\{\{animal\.sex_possessive\}\}/g, ctx.animal.sex === 'female' ? 'her' : 'his')
    .replace(/\{\{animal\.weight\}\}/g, String(ctx.animal.weight))
    .replace(/\{\{animal\.age\}\}/g, String(ctx.animal.age))
    .replace(/\{\{time\.season\}\}/g, ctx.time.season)
    .replace(/\{\{time\.month\}\}/g, ctx.time.month)
    .replace(/\{\{region\.name\}\}/g, tv.regionName)
    .replace(/\{\{species\.youngNoun\}\}/g, tv.youngNoun)
    .replace(/\{\{species\.youngNounPlural\}\}/g, tv.youngNounPlural)
    .replace(/\{\{species\.maleNoun\}\}/g, tv.maleNoun)
    .replace(/\{\{species\.femaleNoun\}\}/g, tv.femaleNoun)
    .replace(/\{\{species\.groupNoun\}\}/g, tv.groupNoun)
    .replace(/\{\{species\.habitat\}\}/g, tv.habitat)
    .replace(/\{\{npc\.rival\.name\}\}/g, ctx.npcs?.find((n: any) => n.type === 'rival' && n.alive)?.name ?? 'a rival')
    .replace(/\{\{npc\.rival\.encounters\}\}/g, String(ctx.npcs?.find((n: any) => n.type === 'rival' && n.alive)?.encounters ?? 0))
    .replace(/\{\{npc\.ally\.name\}\}/g, ctx.npcs?.find((n: any) => n.type === 'ally' && n.alive)?.name ?? 'a companion')
    .replace(/\{\{npc\.ally\.encounters\}\}/g, String(ctx.npcs?.find((n: any) => n.type === 'ally' && n.alive)?.encounters ?? 0))
    .replace(/\{\{npc\.predator\.name\}\}/g, ctx.npcs?.find((n: any) => n.type === 'predator' && n.alive)?.name ?? 'a predator')
    .replace(/\{\{npc\.predator\.encounters\}\}/g, String(ctx.npcs?.find((n: any) => n.type === 'predator' && n.alive)?.encounters ?? 0))
    .replace(/\{\{npc\.mate\.name\}\}/g, ctx.npcs?.find((n: any) => n.type === 'mate' && n.alive)?.name ?? 'a mate')
    .replace(/\{\{npc\.mate\.encounters\}\}/g, String(ctx.npcs?.find((n: any) => n.type === 'mate' && n.alive)?.encounters ?? 0))
    .replace(/\{\{weather\.type\}\}/g, ctx.currentWeather?.type ?? 'clear')
    .replace(/\{\{weather\.description\}\}/g, ctx.currentWeather?.description ?? '');
}

function resolveEvent(event: any, ctx: any): any {
  const resolvedNarrative = resolveTemplate(event.narrativeText, ctx);
  const triggeredSubEvents: any[] = [];
  if (event.subEvents) {
    for (const sub of event.subEvents) {
      const conditionsMet = !sub.conditions || sub.conditions.every((c: any) => checkCondition(c, ctx));
      if (conditionsMet && ctx.rng.chance(sub.chance)) {
        triggeredSubEvents.push({
          eventId: sub.eventId,
          narrativeText: resolveTemplate(sub.narrativeText, ctx),
          footnote: sub.footnote,
          statEffects: sub.statEffects,
          consequences: sub.consequences,
        });
      }
    }
  }
  return {
    definition: event,
    resolvedNarrative,
    triggeredSubEvents,
  };
}

self.onmessage = (e) => {
  const ctx = e.data;
  ctx.animal.flags = new Set(ctx.animal.flags);
  const rng = createRng(ctx.rngState);
  ctx.rng = rng;

  // In simulation mode, filter out events tagged as simulated (replaced by triggers)
  const isSimMode = !!ctx.config?.anatomyId;

  const eligible = ctx.events.filter((event: any) => {
    if (ctx.cooldowns[event.id] && ctx.cooldowns[event.id] > 0) return false;
    if (isSimMode && event.simulated) return false;
    return event.conditions.every((cond: any) => checkCondition(cond, ctx));
  });

  const activePool = eligible.filter((e: any) => e.type === 'active');
  const passivePool = eligible.filter((e: any) => e.type === 'passive');
  
  const difficulty: Difficulty = ctx.difficulty ?? 'normal';
  const predatorFactor = DIFFICULTY_PRESETS[difficulty].predatorEncounterFactor;

  const activeWeights = activePool.map((e: any) => {
    let w = e.weight * behaviorMultiplier(e, ctx.behavior) * contextMultiplier(e, ctx);
    if (e.tags.includes('predator') || e.tags.includes('danger')) w *= predatorFactor;
    return w;
  });

  const results: any[] = [];
  const baseActiveCount = rng.int(1, Math.min(3, activePool.length));
  const activeCount = ctx.fastForward ? Math.min(baseActiveCount * 3, activePool.length) : baseActiveCount;
  const selectedActiveIndices = new Set<number>();

  for (let i = 0; i < activeCount && selectedActiveIndices.size < activePool.length; i++) {
    const adjustedWeights = activeWeights.map((w: number, idx: number) => selectedActiveIndices.has(idx) ? 0 : w);
    const idx = rng.weightedSelect(adjustedWeights);
    selectedActiveIndices.add(idx);
  }

  for (const idx of selectedActiveIndices) {
    results.push(resolveEvent(activePool[idx], ctx));
  }

  const passiveWeights = passivePool.map((e: any) => e.weight * contextMultiplier(e, ctx));
  const basePassiveCount = rng.int(0, Math.min(2, passivePool.length));
  const passiveCount = ctx.fastForward ? Math.min(basePassiveCount * 3, passivePool.length) : basePassiveCount;
  const selectedPassiveIndices = new Set<number>();

  for (let i = 0; i < passiveCount && selectedPassiveIndices.size < passivePool.length; i++) {
    const adjustedWeights = passiveWeights.map((w: number, idx: number) => selectedPassiveIndices.has(idx) ? 0 : w);
    const idx = rng.weightedSelect(adjustedWeights);
    selectedPassiveIndices.add(idx);
  }

  for (const idx of selectedPassiveIndices) {
    results.push(resolveEvent(passivePool[idx], ctx));
  }

  self.postMessage({ results, rngState: rng.getState() });
};
