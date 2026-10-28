import { describe, it, expect, beforeAll } from 'vitest';
import { installLocalStorage } from '../../test-utils/localStorage';
import { createMockRng } from './testHelpers';
import { createGameStore } from '../../store/gameStore';
import { getSpeciesBundle } from '../../data/species';
import { beginTurn, commitTurn, dismissResults } from '../TurnPipeline';
import { tickStorylines } from '../StorylineSystem';
import { generateAmbientText } from '../AmbientTextGenerator';
import { AMBIENT_TEXTS } from '../../data/ambientText';
import { buildActionContext, getAvailableActions } from '../ActionSystem';
import { behaviorPointsUsed, DEFAULT_BEHAVIORAL_SETTINGS, fitBehaviorToBudget } from '../../types/behavior';
import { getLifeOutcome } from '../LifeOutcome';
import { formatAge, describeTurnSpan } from '../../utils/timeSpan';
import { pluralize } from '../../utils/pluralize';

beforeAll(installLocalStorage);

function start(speciesId: string, backstoryType?: string, sex: 'male' | 'female' = 'female') {
  const store = createGameStore();
  const bundle = getSpeciesBundle(speciesId);
  const backstory = bundle.backstories.find((b) => b.type === backstoryType) ?? bundle.backstories[0];
  store.getState().startGame(speciesId, backstory, sex, 'normal', 99);
  return store;
}

function playTurn(store: ReturnType<typeof start>) {
  beginTurn(store);
  if (store.getState().phase !== 'playing') return;
  for (const e of store.getState().currentEvents) {
    const c = e.definition.choices?.[0];
    if (c && !e.choiceMade) store.getState().makeChoice(e.definition.id, c.id);
  }
  commitTurn(store);
  dismissResults(store);
}

describe('captive animals', () => {
  it('have no outdoor map or weather', () => {
    const store = start('chicken', 'broiler');
    expect(store.getState().map).toBeNull();
    for (let i = 0; i < 6 && store.getState().phase === 'playing'; i++) playTurn(store);
    expect(store.getState().currentWeather).toBeNull();
    expect(store.getState().map).toBeNull();
  });

  it('only hear ambient lines written for confinement', () => {
    const captiveIds = new Set(AMBIENT_TEXTS.filter((t) => t.settings?.includes('captive')).map((t) => t.text));
    for (let i = 0; i < 30; i++) {
      const text = generateAmbientText({
        season: 'summer', speciesId: 'pig', regionId: 'farmstead', weatherType: 'rain',
        rng: createMockRng({ random: i / 30 }), setting: 'captive',
      });
      expect(text === null || captiveIds.has(text)).toBe(true);
    }
  });

  it("don't get outdoor storylines like a polluted river", () => {
    const store = start('pig', 'grower-pig');
    const s = store.getState();
    const result = tickStorylines({
      animal: { ...s.animal, age: 24 },
      time: s.time,
      behavior: s.behavioralSettings,
      config: s.speciesBundle.config,
      rng: createMockRng({ chance: true }),
      npcs: [],
      activeStorylines: [],
    });
    expect(result.newStorylines).toEqual([]);
  });

  it('still get them as wild animals', () => {
    const store = start('white-tailed-deer');
    const s = store.getState();
    const result = tickStorylines({
      animal: s.animal, time: s.time, behavior: s.behavioralSettings, config: s.speciesBundle.config,
      rng: createMockRng({ chance: true }), npcs: [], activeStorylines: [],
    });
    expect(result.newStorylines.length).toBeGreaterThan(0);
  });
});

describe('voluntary actions', () => {
  it("don't offer a chick roaming, foraging, or a mate search", () => {
    const s = start('chicken', 'layer').getState();
    const ids = getAvailableActions(buildActionContext({ ...s, animal: { ...s.animal, nutrients: { minerals: 10, vitamins: 10 } } })).map((a) => a.id);
    expect(ids).toEqual(['rest']);
  });

  it('only offer a mate search once the animal is old enough to breed', () => {
    const s = start('white-tailed-deer', 'wild-born').getState();
    const autumn = { ...s.time, season: 'autumn' as const };
    const minAge = s.speciesBundle.config.reproduction.type === 'iteroparous'
      ? s.speciesBundle.config.reproduction.matingMinAge : 0;
    const young = buildActionContext({ ...s, time: autumn, animal: { ...s.animal, age: minAge - 1 } });
    const adult = buildActionContext({ ...s, time: autumn, animal: { ...s.animal, age: minAge } });
    expect(getAvailableActions(young).map((a) => a.id)).not.toContain('search-mate');
    expect(getAvailableActions(adult).map((a) => a.id)).toContain('search-mate');
  });
});

describe('attention budget', () => {
  it('starts every species within its budget', () => {
    for (const id of ['chicken', 'fig-wasp', 'monarch-butterfly', 'white-tailed-deer']) {
      const s = start(id).getState();
      expect(behaviorPointsUsed(s.behavioralSettings)).toBeLessThanOrEqual(s.speciesBundle.config.attentionBudget ?? 18);
    }
  });

  it('trims the least survival-critical settings first', () => {
    const fitted = fitBehaviorToBudget(DEFAULT_BEHAVIORAL_SETTINGS, 14);
    expect(behaviorPointsUsed(fitted)).toBe(14);
    expect(fitted.foraging).toBe(DEFAULT_BEHAVIORAL_SETTINGS.foraging);
    expect(fitted.exploration).toBeLessThan(DEFAULT_BEHAVIORAL_SETTINGS.exploration);
  });

  it('ignores increases past the budget but allows decreases', () => {
    const store = start('chicken');
    const before = store.getState().behavioralSettings;
    store.getState().updateBehavioralSetting('foraging', 5);
    expect(store.getState().behavioralSettings).toEqual(before);
    store.getState().updateBehavioralSetting('caution', 1);
    expect(store.getState().behavioralSettings.caution).toBe(1);
  });
});

describe('life outcome', () => {
  it('gives no grade to an animal that never had a chance to breed', () => {
    const chicken = getSpeciesBundle('chicken').config;
    const chick = start('chicken', 'layer', 'male').getState();
    const outcome = getLifeOutcome(chick.animal, chick.reproduction, chicken);
    expect(outcome.grade).toBeNull();
    expect(outcome.note).toMatch(/decided for you/);

    const deer = start('white-tailed-deer', 'wild-born').getState();
    const youngDeath = getLifeOutcome({ age: 3 }, deer.reproduction, deer.speciesBundle.config);
    expect(youngDeath.grade).toBeNull();
    expect(youngDeath.note).toMatch(/old enough to breed/);
  });

  it('grades a breeding-age animal by offspring raised', () => {
    const deer = start('white-tailed-deer', 'wild-born').getState();
    expect(getLifeOutcome({ age: 40 }, deer.reproduction, deer.speciesBundle.config).grade?.letter).toBe('F');
  });
});

describe('time wording', () => {
  it('describes short lives in hours or days and long ones in years', () => {
    expect(formatAge(0, 2, 'day')).toBe('12 hours');
    expect(formatAge(0, 4, 'day')).toBe('1 day');
    expect(formatAge(5, 0, 'week')).toBe('5 months');
    expect(formatAge(27, 0, 'week')).toBe('2 years, 3 months');
    expect(describeTurnSpan(12, 'day')).toBe('3 days');
    expect(pluralize(1, 'turn')).toBe('1 turn');
    expect(pluralize(2, 'turn')).toBe('2 turns');
  });
});
