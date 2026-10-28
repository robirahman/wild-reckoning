import { describe, it, expect, beforeAll } from 'vitest';
import { installLocalStorage } from '../../test-utils/localStorage';
import { createGameStore } from '../../store/gameStore';
import { getSpeciesBundle } from '../../data/species';
import { instinctUrge, mostPressingSensation } from '../needs';
import { BEHAVIOR_LABELS } from '../../types/behavior';
import { resolveTurn } from '../TurnProcessor';
import { StatId, STAT_DESCRIPTIONS, STAT_POLARITY } from '../../types/stats';
import type { ResolvedEvent } from '../../types/events';

beforeAll(installLocalStorage);

function startWolf() {
  const store = createGameStore();
  const bundle = getSpeciesBundle('gray-wolf');
  store.getState().startGame('gray-wolf', bundle.backstories[0], 'female', 'normal', 3);
  return store;
}

describe('most pressing sensation', () => {
  it('is what the animal feels, never advice about the game', () => {
    const sensation = mostPressingSensation([
      { id: 'cold', label: 'Cold', description: 'Constant low shivering.', priority: 'medium', source: 'weather' },
      { id: 'starving', label: 'Starving', description: 'Your ribs press against your hide.', suggestedBehavior: 'foraging', suggestedDirection: 'increase', priority: 'high', source: 'physiology' },
    ]);
    expect(sensation).toBe('Your ribs press against your hide.');
  });

  it('stays quiet when nothing presses', () => {
    expect(mostPressingSensation([])).toBeNull();
    expect(mostPressingSensation([
      { id: 'sated', label: 'Well Fed', description: 'Your body feels solid.', priority: 'low', source: 'physiology' },
    ])).toBeNull();
  });
});

describe('instinct urges', () => {
  it('give every pull as a feeling, never a setting to change', () => {
    const names = new RegExp(`\\b(${Object.values(BEHAVIOR_LABELS).join('|')}|settings?|increase|decrease|raise|lower)\\b`, 'i');
    for (const behavior of Object.keys(BEHAVIOR_LABELS) as (keyof typeof BEHAVIOR_LABELS)[]) {
      for (const direction of ['increase', 'decrease'] as const) {
        const urge = instinctUrge(behavior, direction);
        expect(urge, `${behavior} ${direction}`).toMatch(/^[A-Z].*\.$/);
        expect(urge, `${behavior} ${direction}`).not.toMatch(names);
      }
    }
  });
});

describe('turn results', () => {
  it('separate what the encounter did from what the choice did', () => {
    const store = startWolf();
    const event: ResolvedEvent = {
      definition: {
        id: 'test-encounter', type: 'active', category: 'environmental', narrativeText: 'A test.',
        statEffects: [{ stat: StatId.TRA, amount: 4, label: '+TRA' }],
        choices: [{
          id: 'go', label: 'Go', statEffects: [{ stat: StatId.WIS, amount: 2, label: '+WIS' }],
          consequences: [], revocable: false, style: 'default',
        }],
        conditions: [], weight: 1, tags: [],
      },
      resolvedNarrative: 'A test.',
      triggeredSubEvents: [],
      choiceMade: 'go',
    };
    store.setState({ currentEvents: [event] });
    const outcome = resolveTurn(store.getState()).turnResult.eventOutcomes[0];
    expect(outcome.statEffects.map((e) => e.label)).toEqual(['+TRA', '+WIS']);
    expect(outcome.choiceStatEffects?.map((e) => e.label)).toEqual(['+WIS']);
  });
});

describe('stat descriptions', () => {
  it('say which direction is good, matching each stat\'s polarity', () => {
    for (const id of Object.values(StatId)) {
      const expected = STAT_POLARITY[id] === 'positive' ? 'Higher is better' : 'Lower is better';
      expect(STAT_DESCRIPTIONS[id], id).toContain(expected);
    }
  });
});
