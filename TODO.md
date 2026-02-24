# Wild Reckoning — Feature Roadmap

## Gameplay Depth

- [x] **More events per species** — Double the event count for each species (~18→36+). Add event chaining where surviving one event can trigger follow-up events in subsequent turns (e.g., surviving a wolf attack triggers PTSD flashbacks, fleeing hunters leads to discovering new foraging grounds).
- [x] **Seasonal weight/food economy** — Implement a reliable seasonal food cycle where winter drains weight consistently and summer restores it. Foraging events should be the primary weight-gain mechanism, with seasonal modifiers making food scarce in winter and abundant in summer/autumn. Add a per-turn passive weight change based on season and foraging behavioral setting.
- [x] **Migration system for deer** — Make the migration choice event functional: moving to a winter yard changes the region, unlocks winter-specific events (sheltered foraging, reduced predation, increased competition/disease), and returning in spring opens spring-specific events. Region changes should affect which events are eligible.
- [x] **Aging progression** — Add age-gated event pools and stat modifiers. Young animals (< 18 months) get vulnerability penalties and learning events. Prime adults (2-6 years for deer) get peak stats. Elderly animals (> 8 years) get declining HEA, slower healing, and wisdom-based events. Age phases should be visible in the UI.

## Narrative & Atmosphere

- [ ] **Persistent NPCs** — Track named herd members, a recurring rival buck, a specific wolf pack. Store NPC state in the game store. Reference NPCs by name in events. NPC deaths trigger grief/social events.
- [ ] **Multi-turn storylines** — Create event chains that span 4-6 turns: drought arcs, poacher camp arcs, relationship arcs with a specific mate. Use flags to track arc progress and fire sequential events.
- [ ] **Illustrations** — Add images to events by category. Generate or source illustrations for foraging, predator, seasonal, social, health, and reproduction event types. Display in the event card UI.

## UI/UX

- [ ] **Stat trend indicators** — Show arrows or sparklines next to each stat showing the trend over the last 3-5 turns. Store stat snapshots in turn history and compute deltas.
- [ ] **Event history log** — Add a scrollable timeline panel showing past turns with their events, choices made, and stat changes. Accessible from the main game screen.
- [ ] **Tooltips on stats** — Hovering over a stat shows: full name, description, current modifiers contributing to it (parasites, injuries, events), and whether higher is good or bad.
- [ ] **Tutorial / first-turn guidance** — Add an optional tutorial overlay for the first 3 turns explaining: what stats mean, how choices work, what behavioral settings do, and what the goal is.
- [ ] **Mobile layout** — Make the game responsive for phone screens. Stack panels vertically, adjust font sizes, make buttons touch-friendly.

## Systems

- [ ] **Save/load** — Persist game state to localStorage. Auto-save each turn. Resume button on start screen if a save exists. Zustand persist middleware.
- [ ] **Difficulty modes** — Easy (lower death chances, slower stat decay, more foraging), Normal (current), Hard (more predators, harsher winters, faster parasite progression). Difficulty multipliers in the species config.
- [ ] **Achievement/unlock system** — Track milestones: "Survive 5 winters," "Reach fitness 3+," "Complete salmon migration without injury," "Survive to old age." Show on start/death screens. Persist to localStorage.
- [ ] **Sound design** — Ambient seasonal sounds, music shifts, audio stings on predator events and death. Use Web Audio API or Howler.js.
