import { describe, it, expect, beforeAll } from 'vitest';
import { installLocalStorage } from '../../test-utils/localStorage';
import { createGameStore } from '../../store/gameStore';
import { getSpeciesBundle } from '../../data/species';
import { getRegionDefinition } from '../../data/regions';
import { beginTurn, commitTurn, dismissResults } from '../TurnPipeline';
import { buildActionContext, getAvailableActions } from '../ActionSystem';
import { TERRITORIAL_SPECIES } from '../TerritorySystem';
import { computeForageQuality } from '../../simulation/physiology/helpers';
import { createInitialTime } from '../TimeSystem';

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
    const autumn = { ...buck.time, season: 'autumn' as const };
    const actions = (s: typeof buck) => getAvailableActions(buildActionContext(s)).map((a) => a.id);
    expect(actions({ ...buck, time: autumn, animal: { ...buck.animal, age: 30 } })).toContain('rub-scrape');
    expect(actions({ ...buck, time: autumn, animal: { ...buck.animal, age: 8 } })).not.toContain('rub-scrape');
    expect(actions({ ...buck, animal: { ...buck.animal, age: 30 } })).not.toContain('rub-scrape'); // June

    const doe = startDeer('female').getState();
    expect(actions({ ...doe, time: autumn, animal: { ...doe.animal, age: 30 } })).not.toContain('rub-scrape');
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
