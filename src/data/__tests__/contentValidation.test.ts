import { describe, it, expect, vi } from 'vitest';
import { getAllSpeciesBundles } from '../species';
import { STORYLINES } from '../storylines';
import { getRegionDefinition } from '../regions';
import { TEMPLATE_VARIABLES, resolveTemplate, type GenerationContext } from '../../engine/EventGenerator';
import { AMBIENT_TEXTS } from '../ambientText';
import { describeConfinement } from '../../engine/captivity';
import { INSTINCT_URGES } from '../../engine/needs';
import { timeSkipEvent } from '../../engine/FastForward';
import { MONTH_TO_SEASON } from '../../types/world';
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

describe('perspective', () => {
  // The game speaks from inside the animal, which knows nothing about the
  // game or its controls (see NARRATIVE_REWRITE.md)
  const TALKS_TO_PLAYER = /\b(behaviou?ral settings?|settings|buttons?|click on|fast-forward|stat bars?|game over|the player)\b|\b(raise|lower|increase|decrease)\s+(your\s+)?(foraging|caution|exploration|belligerence|sociability|mating)\b/i;

  it('never talks to the player about the game', () => {
    const texts = [
      ...sources.flatMap((src) => src.texts.map((text) => ({ where: src.where, text }))),
      ...AMBIENT_TEXTS.map((a) => ({ where: `ambient ${a.id}`, text: a.text })),
      ...['industrial shed', 'concrete pen', 'elsewhere'].flatMap((habitat) =>
        [0, 1, 2].map((turn) => ({ where: `confinement ${habitat}`, text: describeConfinement(habitat, turn) }))),
      ...Object.entries(INSTINCT_URGES).flatMap(([behavior, urges]) =>
        Object.values(urges).map((text) => ({ where: `instinct urge ${behavior}`, text }))),
    ];
    expect(texts.filter(({ text }) => TALKS_TO_PLAYER.test(text)).map(({ where, text }) => `${where}: ${text}`)).toEqual([]);
  });

  it('describes a fast-forward skip as the animal lived it', () => {
    const deer = getAllSpeciesBundles().find((b) => b.config.id === 'white-tailed-deer')!;
    const card = timeSkipEvent({
      turnsAdvanced: 12,
      turnsRequested: 12,
      from: { month: 'June', year: 1, season: 'summer' },
      to: { month: 'September', year: 1, season: 'autumn' },
      startWeight: 84,
      weightChange: 30,
      temperatureChange: -12,
      developments: ['The restless pull toward males has gone quiet. Something has changed inside you.'],
      stoppedFor: 'a birth',
    }, deer.config, 13).resolvedNarrative;
    expect(card).toBe('The days run together. It is colder now. Your body is heavier and fuller than it was. '
      + 'The restless pull toward males has gone quiet. Something has changed inside you.');
    // No calendar, units, concepts the animal can't have, or talk of the game itself
    expect(card).not.toMatch(/\d|June|September|weeks?\b|lbs?\b|pregnan|fast-forward|paused/i);
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
        const months = e.conditions.find((c) => c.type === 'month');
        const weather = e.conditions.find((c) => c.type === 'weather');
        // Cold weather (a blizzard, snow, frost) only happens in winter
        const coldWeatherOnly = weather?.type === 'weather' && weather.weatherTypes.every((w) => ['blizzard', 'snow', 'frost'].includes(w));
        const allowed = coldWeatherOnly ? ['winter']
          : months?.type === 'month' ? months.months.map((m) => MONTH_TO_SEASON[m])
          : seasons?.type === 'season' ? seasons.seasons : ['spring', 'summer', 'autumn', 'winter'];
        const text = eventTexts(e).join(' ');
        if (COLD.test(text) && allowed.includes('summer')) problems.push(`${e.id}: cold wording in summer`);
        if (HOT_GROUND.test(text) && allowed.includes('winter')) problems.push(`${e.id}: hot ground in winter`);
      }
    }
    expect(problems).toEqual([]);
  });
});
