import { describe, it, expect, vi } from 'vitest';
import { getAllSpeciesBundles } from '../species';
import { STORYLINES } from '../storylines';
import { getRegionDefinition } from '../regions';
import { TEMPLATE_VARIABLES, resolveTemplate, type GenerationContext } from '../../engine/EventGenerator';
import { createRng } from '../../engine/RandomUtils';
import { createInitialTime } from '../../engine/TimeSystem';
import { createInitialAnimal } from '../../store/slices/helpers';
import { DEFAULT_BEHAVIORAL_SETTINGS } from '../../types/behavior';
import type { EventChoice, GameEvent } from '../../types/events';
import type { NPC } from '../../types/npc';
import type { SpeciesDataBundle } from '../../types/speciesConfig';

const TOKEN = /\{\{\s*([\w.]+)\s*\}\}/g;
const supported = new Set<string>(TEMPLATE_VARIABLES);

function choiceTexts(choices?: EventChoice[]): string[] {
  return (choices ?? []).flatMap((c) => [
    c.label,
    c.description ?? '',
    c.narrativeResult ?? '',
    c.deathChance?.cause ?? '',
    ...(c.deathChance?.escapeOptions ?? []).flatMap((o) => [o.label, o.description]),
  ]);
}

function eventTexts(e: GameEvent): string[] {
  return [e.narrativeText, ...(e.subEvents ?? []).map((s) => s.narrativeText), ...choiceTexts(e.choices)];
}

/** Every piece of authored text the player can see, with where it lives */
const sources: { where: string; texts: string[]; bundle?: SpeciesDataBundle }[] = [
  ...getAllSpeciesBundles().flatMap((bundle) =>
    bundle.events.map((e) => ({ where: `${bundle.config.id}/${e.id}`, texts: eventTexts(e), bundle }))),
  ...STORYLINES.flatMap((def) =>
    def.steps.map((step) => ({ where: `storyline ${def.id}/${step.id}`, texts: [step.narrativeText, ...choiceTexts(step.choices)] }))),
];

function npc(type: NPC['type'], name: string): NPC {
  return {
    id: `npc-${type}`, name, type, speciesId: 'x', speciesLabel: 'x', relationship: 'neutral',
    alive: true, introducedOnTurn: 1, lastSeenTurn: 1, encounters: 2,
  } as NPC;
}

function contextFor(bundle: SpeciesDataBundle, sex: 'male' | 'female', withNPCs: boolean): GenerationContext {
  return {
    animal: createInitialAnimal(bundle.config, bundle.backstories[0], sex),
    time: createInitialTime(5, 1),
    behavior: DEFAULT_BEHAVIORAL_SETTINGS,
    cooldowns: {},
    rng: createRng(1),
    events: [],
    config: bundle.config,
    npcs: withNPCs
      ? [npc('rival', 'Scar'), npc('ally', 'Fern'), npc('predator', 'Gray'), npc('mate', 'Ash')]
      : [],
    regionDef: getRegionDefinition(bundle.config.defaultRegion),
  };
}

describe('authored text', () => {
  it('only uses template variables the resolver supports', () => {
    const unknown = sources.flatMap((src) =>
      src.texts.flatMap((text) => [...text.matchAll(TOKEN)]
        .map((m) => m[1])
        .filter((name) => !supported.has(name))
        .map((name) => `${src.where}: {{${name}}}`)));
    expect(unknown).toEqual([]);
  });

  it('renders completely for either sex, with or without named NPCs', () => {
    const deer = getAllSpeciesBundles().find((b) => b.config.id === 'white-tailed-deer')!;
    const leftovers: string[] = [];
    for (const sex of ['female', 'male'] as const) {
      for (const withNPCs of [true, false]) {
        for (const src of sources) {
          const ctx = contextFor(src.bundle ?? deer, sex, withNPCs);
          for (const text of src.texts) {
            const rendered = resolveTemplate(text, ctx);
            if (rendered.includes('{{') || rendered.includes('}}')) leftovers.push(`${src.where}: ${rendered.slice(0, 80)}`);
          }
        }
      }
    }
    expect(leftovers).toEqual([]);
  });
});

describe('template resolver', () => {
  const deer = getAllSpeciesBundles().find((b) => b.config.id === 'white-tailed-deer')!;

  it('uses object pronouns where the sentence needs them', () => {
    expect(resolveTemplate('It let {{animal.sex_object}} pass.', contextFor(deer, 'male', false))).toBe('It let him pass.');
    expect(resolveTemplate('It let {{animal.sex_object}} pass.', contextFor(deer, 'female', false))).toBe('It let her pass.');
  });

  it('capitalizes a fallback name that opens a sentence', () => {
    const ctx = contextFor(deer, 'female', false);
    expect(resolveTemplate('{{npc.ally.name}} grazes nearby. You watch {{npc.ally.name}}.', ctx))
      .toBe('A companion grazes nearby. You watch a companion.');
  });

  it('never shows braces for an unknown variable', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rendered = resolveTemplate('Fresh signs of another {{species}} appear.', contextFor(deer, 'female', false));
    expect(rendered).toBe('Fresh signs of another white-tailed deer appear.');
    warn.mockRestore();
  });
});

describe('seasonal wording', () => {
  // Deer and wolves live where summers are warm, so snow and ice need winter
  const COLD = /\b(snow|snowy|snowdrifts?|frozen|icy|blizzard)\b/i;
  const HOT_GROUND = /\bhot\s+(black\s+)?(ground|pavement|asphalt|road|surface|tar)\b/i;

  it("doesn't describe snow in summer or hot pavement in winter for northern forest animals", () => {
    const problems: string[] = [];
    for (const bundle of getAllSpeciesBundles().filter((b) => ['white-tailed-deer', 'gray-wolf'].includes(b.config.id))) {
      for (const e of bundle.events) {
        // Simulation-mode species never see events the simulation replaces
        if (e.simulated && bundle.config.anatomyId) continue;
        const seasons = e.conditions.find((c) => c.type === 'season');
        const weather = e.conditions.find((c) => c.type === 'weather');
        // Cold weather (a blizzard, snow, frost) only happens in winter
        const coldWeatherOnly = weather?.type === 'weather' && weather.weatherTypes.every((w) => ['blizzard', 'snow', 'frost'].includes(w));
        const allowed = coldWeatherOnly ? ['winter']
          : seasons?.type === 'season' ? seasons.seasons : ['spring', 'summer', 'autumn', 'winter'];
        const text = eventTexts(e).join(' ');
        if (COLD.test(text) && allowed.includes('summer')) problems.push(`${e.id}: cold wording in summer`);
        if (HOT_GROUND.test(text) && allowed.includes('winter')) problems.push(`${e.id}: hot ground in winter`);
      }
    }
    expect(problems).toEqual([]);
  });
});
