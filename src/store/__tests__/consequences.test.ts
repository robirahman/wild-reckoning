import { describe, it, expect, beforeAll } from 'vitest';
import { installLocalStorage } from '../../test-utils/localStorage';
import { createGameStore } from '../gameStore';
import { getSpeciesBundle } from '../../data/species';

beforeAll(installLocalStorage);

function startWolf() {
  const store = createGameStore();
  const bundle = getSpeciesBundle('gray-wolf');
  store.getState().startGame('gray-wolf', bundle.backstories[0], 'male', 'normal', 1);
  return { store, max: bundle.config.weight.maximumBiologicalWeight };
}

describe('weight consequences', () => {
  it('never push an animal past its species maximum, however much it eats', () => {
    const { store, max } = startWolf();
    for (let i = 0; i < 200; i++) {
      store.getState().applyConsequence({ type: 'modify_weight', amount: 15 });
    }
    expect(store.getState().animal.weight).toBeLessThanOrEqual(max);
  });

  it('taper gains as the animal nears its maximum', () => {
    const { store, max } = startWolf();
    const lean = store.getState().animal.weight;
    store.getState().applyConsequence({ type: 'modify_weight', amount: 10 });
    const leanGain = store.getState().animal.weight - lean;

    store.setState({ animal: { ...store.getState().animal, weight: max * 0.9 } });
    store.getState().applyConsequence({ type: 'modify_weight', amount: 10 });
    const heavyGain = store.getState().animal.weight - max * 0.9;
    expect(heavyGain).toBeLessThan(leanGain);
  });

  it('still apply losses in full', () => {
    const { store } = startWolf();
    const before = store.getState().animal.weight;
    store.getState().applyConsequence({ type: 'modify_weight', amount: -5 });
    expect(store.getState().animal.weight).toBeCloseTo(before - 5 * Math.min(1, before / 100));
  });
});
