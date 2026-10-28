import { describe, it, expect, beforeAll } from 'vitest';
import { installLocalStorage } from '../../test-utils/localStorage';
import { createGameStore } from '../../store/gameStore';
import { getSpeciesBundle } from '../../data/species';
import { getRegionDefinition } from '../../data/regions';
import { beginTurn, commitTurn, dismissResults } from '../TurnPipeline';
import { buildActionContext, getAvailableActions } from '../ActionSystem';
import { TERRITORIAL_SPECIES } from '../TerritorySystem';
import { computeBodyCondition, computeForageQuality } from '../../simulation/physiology/helpers';
import { tickPhysiologyEngine } from '../../simulation/physiology/engine';
import { getMetabolismConfig } from '../../simulation/physiology/configs';
import { createRng } from '../RandomUtils';
import { createInitialTime } from '../TimeSystem';
import { tickReproduction } from '../ReproductionSystem';
import { createMockRng } from './testHelpers';

beforeAll(installLocalStorage);

function startDeer(sex: 'male' | 'female' = 'female') {
  const store = createGameStore();
  const bundle = getSpeciesBundle('white-tailed-deer');
  store.getState().startGame('white-tailed-deer', bundle.backstories.find((b) => b.type === 'wild-born')!, sex, 'normal', 5);
  return store;
}

describe('white-tailed deer keep home ranges, not territories', () => {
  it('never establish or mark a territory', () => {
    expect(TERRITORIAL_SPECIES.has('white-tailed-deer')).toBe(false);
    const store = startDeer();
    for (let i = 0; i < 15 && store.getState().phase === 'playing'; i++) {
      beginTurn(store);
      if (store.getState().phase !== 'playing') break;
      const ids = getAvailableActions(buildActionContext(store.getState())).map((a) => a.id);
      expect(ids).not.toContain('mark-territory');
      expect(store.getState().currentEvents.map((e) => e.definition.id).some((id) => id.startsWith('territory-'))).toBe(false);
      for (const e of store.getState().currentEvents) {
        const c = e.definition.choices?.[0];
        if (c && !e.choiceMade) store.getState().makeChoice(e.definition.id, c.id);
      }
      commitTurn(store);
      for (const roll of store.getState().turnResult?.pendingDeathRolls ?? []) {
        store.getState().resolveDeathRoll(roll.eventId, roll.escapeOptions[0].id);
      }
      dismissResults(store);
    }
    expect(store.getState().territory.established).toBe(false);
  });

  it('let does defend only the spot where their fawns are hidden', () => {
    const event = getSpeciesBundle('white-tailed-deer').events.find((e) => e.id === 'deer-birth-site-defense');
    expect(event?.conditions).toEqual(expect.arrayContaining([
      { type: 'sex', sex: 'female' },
      { type: 'has_flag', flag: 'fawns-dependent' },
    ]));
  });

  it('give adult bucks rubs and scrapes during the rut only', () => {
    const buck = startDeer('male').getState();
    const rut = { ...buck.time, season: 'autumn' as const, month: 'October' as const };
    const september = { ...buck.time, season: 'autumn' as const, month: 'September' as const };
    const actions = (s: typeof buck) => getAvailableActions(buildActionContext(s)).map((a) => a.id);
    expect(actions({ ...buck, time: rut, animal: { ...buck.animal, age: 30 } })).toContain('rub-scrape');
    expect(actions({ ...buck, time: rut, animal: { ...buck.animal, age: 8 } })).not.toContain('rub-scrape');
    expect(actions({ ...buck, time: september, animal: { ...buck.animal, age: 30 } })).not.toContain('rub-scrape');
    expect(actions({ ...buck, animal: { ...buck.animal, age: 30 } })).not.toContain('rub-scrape'); // June

    const doe = startDeer('female').getState();
    expect(actions({ ...doe, time: rut, animal: { ...doe.animal, age: 30 } })).not.toContain('rub-scrape');
  });
});

describe('the rut', () => {
  it('is when does conceive: November and the December second estrus, not September', () => {
    const doe = startDeer('female').getState();
    const repro = doe.reproduction;
    if (repro.type !== 'iteroparous') throw new Error('deer are iteroparous');
    const adult = { ...doe.animal, age: 30 };
    const conceives = (month: 'September' | 'October' | 'November' | 'December', season: 'autumn' | 'winter') =>
      !!tickReproduction(repro, adult, { ...doe.time, month, season }, doe.speciesBundle.config,
        createMockRng({ chance: true })).reproduction.pregnancy;
    expect(conceives('September', 'autumn')).toBe(false);
    expect(conceives('October', 'autumn')).toBe(false);
    expect(conceives('November', 'autumn')).toBe(true);
    expect(conceives('December', 'winter')).toBe(true);
  });

  it('times mating events to the rut', () => {
    const events = getSpeciesBundle('white-tailed-deer').events;
    const months = (id: string) => events.find((e) => e.id === id)?.conditions.find((c) => c.type === 'month');
    expect(months('reproduction-doe-mating')).toEqual({ type: 'month', months: ['November', 'December'] });
    expect(months('deer-autumn-rut')).toEqual({ type: 'month', months: ['October', 'November'] });
  });
});

describe('winter browse', () => {
  it('treats northern white-cedar as nutritious but scarce, without changing winter food supply', () => {
    const region = getRegionDefinition('northern-minnesota')!;
    const cedar = region.flora.find((f) => f.id === 'white-cedar-browse')!;
    const browse = region.flora.find((f) => f.id === 'forest-browse')!;
    expect(cedar.nutritiveValue).toBeGreaterThan(browse.nutritiveValue);

    // Same total nutrition as the old values (30 nutrition at 0.6 abundance in January)
    const january = { ...createInitialTime(0, 1) };
    const withOldCedar = {
      ...region,
      flora: region.flora.map((f) => f.id === 'white-cedar-browse'
        ? { ...f, nutritiveValue: 30, abundanceByMonth: [0.6, 0.5, 0.3, 0.2, 0, 0, 0, 0, 0, 0, 0.3, 0.6] }
        : f),
    };
    expect(computeForageQuality(region, january, 'forest', undefined))
      .toBeCloseTo(computeForageQuality(withOldCedar, january, 'forest', undefined), 2);
  });
});

describe("a deer's weight through the year", () => {
  // A doe on the best ground there is, so the seasonal limits are what bind
  function weeklyGain(month: number, weight: number, regionId = 'northern-minnesota', food = 100, sex: 'male' | 'female' = 'female') {
    const s = startDeer(sex).getState();
    const regionDef = getRegionDefinition(regionId);
    return tickPhysiologyEngine({
      animal: { ...s.animal, weight, age: 30, region: regionId },
      time: createInitialTime(month, 1),
      weather: null,
      config: s.speciesBundle.config,
      metabolismConfig: getMetabolismConfig('white-tailed-deer')!,
      behavior: { ...s.behavioralSettings, foraging: 5 },
      regionDef,
      currentNodeType: 'forest',
      currentNodeResources: { food, cover: 50, water: 50 } as never,
      isPregnant: false,
      isLactating: false,
      rng: createRng(1),
      ffMult: 1,
    }).weightChange;
  }

  it('fattens slowly in summer and fastest in autumn', () => {
    const july = weeklyGain(6, 90);
    const october = weeklyGain(9, 90);
    expect(july).toBeGreaterThan(0);
    expect(july).toBeLessThanOrEqual(2);
    expect(october).toBeGreaterThan(0);
    expect(october).toBeLessThanOrEqual(2.5);
  });

  it('loses winter weight in proportion to body size', () => {
    // Bare ground in the yard in January: a deep deficit, so the mobilization limit binds
    expect(weeklyGain(0, 80, 'minnesota-winter-yard', 0)).toBeCloseTo(-0.8, 1);
    expect(weeklyGain(0, 160, 'minnesota-winter-yard', 0, 'male')).toBeCloseTo(-1.6, 1);
  });

  it('still finds food in November, between the last leaves and winter browse', () => {
    const region = getRegionDefinition('northern-minnesota')!;
    expect(computeForageQuality(region, createInitialTime(10, 1), 'forest', { food: 50 })).toBeGreaterThan(0.2);
  });

  it('reads a doe carrying normal autumn reserves as well fed, not fat', () => {
    const config = getSpeciesBundle('white-tailed-deer').config;
    expect(computeBodyCondition(160, config, 'female', 40)).toBe(4);
  });
});
