import { getAllSpeciesBundles } from '../src/data/species';

let errors = 0;

function error(msg: string): void {
  console.error(`ERROR: ${msg}`);
  errors++;
}

const bundles = getAllSpeciesBundles();

for (const bundle of bundles) {
  const speciesId = bundle.config.id;
  const parasiteIds = new Set(Object.keys(bundle.parasites));
  const injuryIds = new Set(Object.keys(bundle.injuries));

  // Check all events
  for (const event of bundle.events) {
    // Check event consequences
    if (event.consequences) {
      for (const c of event.consequences) {
        if (c.type === 'add_parasite' && !parasiteIds.has(c.parasiteId)) {
          error(`[${speciesId}] Event "${event.id}": unknown parasite "${c.parasiteId}"`);
        }
        if (c.type === 'add_injury' && !injuryIds.has(c.injuryId)) {
          error(`[${speciesId}] Event "${event.id}": unknown injury "${c.injuryId}"`);
        }
      }
    }

    // Check choice consequences
    if (event.choices) {
      for (const choice of event.choices) {
        for (const c of choice.consequences) {
          if (c.type === 'add_parasite' && !parasiteIds.has(c.parasiteId)) {
            error(`[${speciesId}] Event "${event.id}" choice "${choice.id}": unknown parasite "${c.parasiteId}"`);
          }
          if (c.type === 'add_injury' && !injuryIds.has(c.injuryId)) {
            error(`[${speciesId}] Event "${event.id}" choice "${choice.id}": unknown injury "${c.injuryId}"`);
          }
        }
      }
    }

    // Check sub-event consequences
    if (event.subEvents) {
      for (const sub of event.subEvents) {
        for (const c of sub.consequences) {
          if (c.type === 'add_parasite' && !parasiteIds.has(c.parasiteId)) {
            error(`[${speciesId}] Event "${event.id}" sub-event "${sub.eventId}": unknown parasite "${c.parasiteId}"`);
          }
          if (c.type === 'add_injury' && !injuryIds.has(c.injuryId)) {
            error(`[${speciesId}] Event "${event.id}" sub-event "${sub.eventId}": unknown injury "${c.injuryId}"`);
          }
        }
      }
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} validation error(s) found.`);
  process.exit(1);
} else {
  console.log(`All species data validated successfully (${bundles.length} species checked).`);
}
