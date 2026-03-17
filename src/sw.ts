/// <reference lib="webworker" />
import { GameAPI } from './api/GameAPI';
import { createGameStore } from './store/gameStore';
import { serializeState, deserializeState } from './store/persistence';

const DB_NAME = 'wild-reckoning-api';
const STORE_NAME = 'game-state';
const STATE_KEY = 'current';

/** Open/Create IndexedDB */
async function openDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/** Save state to DB */
async function saveState(state: any) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(state, STATE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/** Load state from DB */
async function loadState() {
  const db = await openDB();
  return new Promise<any>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const request = tx.objectStore(STORE_NAME).get(STATE_KEY);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(tx.error);
  });
}

/** Helper to run GameAPI with persisted state */
async function runWithAPI(fn: (api: GameAPI) => any) {
  const saved = await loadState();
  const initialState = saved ? deserializeState(saved) : {};
  const store = createGameStore(initialState);
  const api = new GameAPI(store);
  
  const result = await fn(api);
  
  const newState = serializeState(store.getState());
  await saveState(newState);
  
  return result;
}

self.addEventListener('install', () => {
  (self as any).skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((self as any).clients.claim());
});

self.addEventListener('fetch', (event: FetchEvent) => {
  const url = new URL(event.request.url);
  
  // Intercept /api/ routes
  if (url.pathname.includes('/api/')) {
    event.respondWith(handleApiRequest(event.request, url));
  }
});

async function handleApiRequest(request: Request, url: URL): Promise<Response> {
  const path = url.pathname.split('/api/')[1];
  
  try {
    switch (path) {
      case 'status':
        return await runWithAPI(api => jsonResponse(api.getSnapshot()));
        
      case 'start': {
        if (request.method !== 'POST') return errorResponse('Method Not Allowed', 405);
        const body = await request.json();
        return await runWithAPI(api => jsonResponse(api.start(body)));
      }
      
      case 'turn': {
        if (request.method !== 'POST') return errorResponse('Method Not Allowed', 405);
        return await runWithAPI(api => jsonResponse(api.generateTurn()));
      }
      
      case 'choice': {
        if (request.method !== 'POST') return errorResponse('Method Not Allowed', 405);
        const { eventId, choiceId } = await request.json();
        return await runWithAPI(api => {
          api.makeChoice(eventId, choiceId);
          return jsonResponse({ success: true });
        });
      }
      
      case 'end-turn': {
        if (request.method !== 'POST') return errorResponse('Method Not Allowed', 405);
        return await runWithAPI(api => jsonResponse(api.endTurn()));
      }
      
      case 'resolve-death-roll': {
        if (request.method !== 'POST') return errorResponse('Method Not Allowed', 405);
        const { eventId, escapeOptionId } = await request.json();
        return await runWithAPI(api => jsonResponse(api.resolveDeathRoll(eventId, escapeOptionId)));
      }
      
      case 'reset': {
        if (request.method !== 'POST') return errorResponse('Method Not Allowed', 405);
        return await runWithAPI(api => {
          api.reset();
          return jsonResponse({ success: true });
        });
      }

      case 'species':
        return jsonResponse(GameAPI.speciesIds);
        
      case 'backstories':
        return jsonResponse(GameAPI.backstoryOptions);

      default:
        return errorResponse('Not Found', 404);
    }
  } catch (err: any) {
    return errorResponse(err.message, 400);
  }
}

function jsonResponse(data: any) {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' }
  });
}

function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}
