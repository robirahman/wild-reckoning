import { GameAPI } from '../../src/api/GameAPI';
import { createGameStore } from '../../src/store/gameStore';
import { serializeState, deserializeState } from '../../src/store/persistence';
import type { Env } from './index';

function getSessionId(request: Request): string {
  return (
    request.headers.get('X-Session-Id') ||
    new URL(request.url).searchParams.get('session') ||
    'default'
  );
}

async function runWithAPI(
  env: Env,
  sessionId: string,
  fn: (api: GameAPI) => Response,
): Promise<Response> {
  const saved = await env.GAME_STATE.get(sessionId, 'json');
  const initialState = saved ? deserializeState(saved as any) : {};
  const store = createGameStore(initialState);
  const api = new GameAPI(store);

  const result = fn(api);

  const newState = serializeState(store.getState());
  await env.GAME_STATE.put(sessionId, JSON.stringify(newState), {
    expirationTtl: 86400,
  });

  return result;
}

export async function handleApiRequest(
  request: Request,
  url: URL,
  env: Env,
): Promise<Response> {
  const path = url.pathname.split('/api/')[1];
  const sessionId = getSessionId(request);

  try {
    switch (path) {
      case 'status':
        return await runWithAPI(env, sessionId, (api) =>
          jsonResponse(api.getSnapshot()),
        );

      case 'start': {
        if (request.method !== 'POST')
          return errorResponse('Method Not Allowed', 405);
        const body = await request.json();
        return await runWithAPI(env, sessionId, (api) =>
          jsonResponse(api.start(body as any)),
        );
      }

      case 'turn': {
        if (request.method !== 'POST')
          return errorResponse('Method Not Allowed', 405);
        return await runWithAPI(env, sessionId, (api) =>
          jsonResponse(api.generateTurn()),
        );
      }

      case 'choice': {
        if (request.method !== 'POST')
          return errorResponse('Method Not Allowed', 405);
        const { eventId, choiceId } = (await request.json()) as {
          eventId: string;
          choiceId: string;
        };
        return await runWithAPI(env, sessionId, (api) => {
          api.makeChoice(eventId, choiceId);
          return jsonResponse({ success: true });
        });
      }

      case 'end-turn': {
        if (request.method !== 'POST')
          return errorResponse('Method Not Allowed', 405);
        return await runWithAPI(env, sessionId, (api) =>
          jsonResponse(api.endTurn()),
        );
      }

      case 'resolve-death-roll': {
        if (request.method !== 'POST')
          return errorResponse('Method Not Allowed', 405);
        const { eventId, escapeOptionId } = (await request.json()) as {
          eventId: string;
          escapeOptionId: string;
        };
        return await runWithAPI(env, sessionId, (api) =>
          jsonResponse(api.resolveDeathRoll(eventId, escapeOptionId)),
        );
      }

      case 'reset': {
        if (request.method !== 'POST')
          return errorResponse('Method Not Allowed', 405);
        return await runWithAPI(env, sessionId, (api) => {
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
    return errorResponse(err.message || 'Internal Error', 400);
  }
}

function jsonResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
}

function errorResponse(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
