import React from 'react';

export const WebAPIDoc: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', fontFamily: 'monospace', lineHeight: '1.5' }}>
      <h1>Wild Reckoning Web API</h1>
      <p>
        The game provides a REST-like API through a Service Worker. All logic runs entirely in your browser.
        State is persisted in IndexedDB and is independent from the main UI session.
      </p>

      <h2>Endpoints</h2>
      <ul>
        <li><code>GET /api/status</code> - Get current game state</li>
        <li><code>POST /api/start</code> - Start a new game
          <pre>{`{
  "species": "white-tailed-deer",
  "backstory": "wild-born",
  "sex": "female",
  "difficulty": "normal"
}`}</pre>
        </li>
        <li><code>POST /api/turn</code> - Advance the clock and generate events</li>
        <li><code>POST /api/choice</code> - Select a choice for an event
          <pre>{`{ "eventId": "...", "choiceId": "..." }`}</pre>
        </li>
        <li><code>POST /api/end-turn</code> - Resolve all choices and apply effects</li>
        <li><code>POST /api/resolve-death-roll</code> - Resolve a pending lethal encounter
          <pre>{`{ "eventId": "...", "escapeOptionId": "..." }`}</pre>
        </li>
        <li><code>POST /api/reset</code> - Reset to menu state</li>
        <li><code>GET /api/species</code> - List available species</li>
        <li><code>GET /api/backstories</code> - List backstory options</li>
      </ul>

      <h2>Quick Test (from Console)</h2>
      <pre>{`fetch('/wild-reckoning/api/start', {
  method: 'POST',
  body: JSON.stringify({
    species: 'white-tailed-deer',
    backstory: 'wild-born',
    sex: 'female'
  })
}).then(r => r.json()).then(console.log)`}</pre>

      <p><a href="/wild-reckoning/">← Back to Game</a></p>
    </div>
  );
};
