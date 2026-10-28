import { describe, it, expect } from 'vitest';
import type { ResolvedEvent } from '../../../types/events';
import { eventSignature, nextRevealCount, revealThroughFirstUnanswered } from '../revealProgress';

function event(id: string, type: 'active' | 'passive', choiceMade?: string): ResolvedEvent {
  return {
    definition: {
      id,
      type,
      category: 'environmental',
      narrativeText: id,
      statEffects: [],
      conditions: [],
      weight: 1,
      tags: [],
      choices: type === 'active'
        ? [{ id: 'a', label: 'A', statEffects: [], consequences: [], revocable: true, style: 'default' }]
        : undefined,
    },
    resolvedNarrative: id,
    triggeredSubEvents: [],
    choiceMade,
  };
}

const turn = 7;
const opening = [event('release', 'active'), event('food', 'active'), event('rain', 'passive'), event('road', 'active')];

describe('event reveal position', () => {
  it('keeps the player on the event they just answered (the jump-back-to-event-1 bug)', () => {
    const prev = { signature: eventSignature(opening, turn), count: 2 };
    const answered = [opening[0], { ...opening[1], choiceMade: 'a' }, opening[2], opening[3]];
    expect(nextRevealCount(prev, answered, turn)).toBe(2);
  });

  it('keeps position when a choice is undone', () => {
    const prev = { signature: eventSignature(opening, turn), count: 4 };
    expect(nextRevealCount(prev, opening, turn)).toBe(4);
  });

  it('reveals appended events such as an action result', () => {
    const prev = { signature: eventSignature(opening, turn), count: 4 };
    const withAction = [...opening, event('action-rest', 'passive')];
    expect(nextRevealCount(prev, withAction, turn)).toBe(5);
  });

  it('starts a new turn from the first event, even if it repeats last turn\'s events', () => {
    const prev = { signature: eventSignature(opening, turn), count: 4 };
    expect(nextRevealCount(prev, [event('owl', 'passive'), event('wolf', 'active')], turn + 1)).toBe(1);
    expect(nextRevealCount(prev, opening, turn + 1)).toBe(1);
  });

  it('resumes a saved turn at the first event still waiting for a choice', () => {
    const resumed = [
      { ...opening[0], choiceMade: 'a' },
      { ...opening[1], choiceMade: 'a' },
      opening[2],
      opening[3],
    ];
    expect(nextRevealCount(null, resumed, turn)).toBe(4);
    expect(revealThroughFirstUnanswered(resumed.map((e) => ({ ...e, choiceMade: 'a' })))).toBe(4);
  });

  it('shows nothing for an empty turn', () => {
    expect(nextRevealCount(null, [], turn)).toBe(0);
  });
});
