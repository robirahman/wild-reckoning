import type { MortalityProfile } from '../types';

/**
 * White-tailed deer mortality data calibrated from real-world sources.
 *
 * Sources: QDMA whitetail reports, state DNR studies (Minnesota, Wisconsin).
 * Adult annual survival ~70-80%. Fawn survival ~50% first year (handled by reproduction system).
 *
 * These rates are for adults in average condition. The simulation triggers
 * use these as base rates, then modify based on the animal's actual
 * condition (injuries, weight, capabilities).
 */
export const DEER_MORTALITY: MortalityProfile = {
  speciesId: 'white-tailed-deer',
  baseAnnualSurvival: 0.75,
  turnsPerYear: 52, // weekly turns

  causes: [
    {
      id: 'predation-canid',
      label: 'Wolf/Coyote Predation',
      annualRate: 0.06,
      seasonalWeights: {
        spring: 0.8,
        summer: 0.6,
        autumn: 0.8,
        winter: 1.8, // wolves succeed much more often in deep snow
      },
      eventCategory: 'predator',
    },
    {
      id: 'predation-felid',
      label: 'Cougar/Bobcat Predation',
      annualRate: 0.02,
      seasonalWeights: {
        spring: 1.0,
        summer: 0.8,
        autumn: 1.0,
        winter: 1.2,
      },
      eventCategory: 'predator',
    },
    {
      id: 'hunting',
      label: 'Human Hunting',
      annualRate: 0.12,
      seasonalWeights: {
        spring: 0.1, // turkey season only, minimal deer
        summer: 0.0,
        autumn: 3.5, // firearm + bow season
        winter: 0.4, // late muzzleloader in some states
      },
      eventCategory: 'predator',
    },
    {
      id: 'vehicle-strike',
      label: 'Vehicle Strike',
      annualRate: 0.03,
      seasonalWeights: {
        spring: 0.8,
        summer: 0.6,
        autumn: 2.0, // rut-driven road crossings
        winter: 0.6,
      },
      eventCategory: 'environmental',
    },
    {
      id: 'starvation-exposure',
      label: 'Starvation & Exposure',
      annualRate: 0.04,
      seasonalWeights: {
        spring: 1.0, // late winter lingering effects
        summer: 0.1,
        autumn: 0.1,
        winter: 2.8, // primary starvation season
      },
      eventCategory: 'environmental',
    },
    {
      id: 'disease',
      label: 'Disease & Parasites',
      annualRate: 0.03,
      seasonalWeights: {
        spring: 1.2,
        summer: 1.5, // peak parasite transmission
        autumn: 0.8,
        winter: 0.5,
      },
      eventCategory: 'health',
    },
    {
      id: 'intraspecific',
      label: 'Intraspecific Combat',
      annualRate: 0.01,
      seasonalWeights: {
        spring: 0.2,
        summer: 0.3,
        autumn: 3.0, // rut
        winter: 0.5,
      },
      eventCategory: 'social',
    },
  ],
};
