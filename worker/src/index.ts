import { handleApiRequest } from './handler';

export interface Env {
  GAME_STATE: KVNamespace;
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Session-Id',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    if (!url.pathname.includes('/api/')) {
      return new Response(
        JSON.stringify({
          name: 'Wild Reckoning API',
          endpoints: [
            'GET  /api/species',
            'GET  /api/backstories',
            'GET  /api/status',
            'POST /api/start',
            'POST /api/turn',
            'POST /api/choice',
            'POST /api/end-turn',
            'POST /api/resolve-death-roll',
            'POST /api/reset',
          ],
          session:
            'Pass X-Session-Id header or ?session= query param (default: "default")',
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    }

    const response = await handleApiRequest(request, url, env);

    // Add CORS headers to every response
    const corsResponse = new Response(response.body, response);
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      corsResponse.headers.set(key, value);
    }
    return corsResponse;
  },
} satisfies ExportedHandler<Env>;
