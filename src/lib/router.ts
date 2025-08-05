import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { sendJson } from '../utils/respond';

type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<any>;

interface Route {
  method: string;
  path: string;
  handler: Handler;
}

export class Router {
  private routes: Route[] = [];

  get(path: string, handler: Handler) {
    this.routes.push({ method: 'GET', path, handler });
  }

  post(path: string, handler: Handler) {
    this.routes.push({ method: 'POST', path, handler });
  }

  put(path: string, handler: Handler) {
    this.routes.push({ method: 'PUT', path, handler });
  }

  delete(path: string, handler: Handler) {
    this.routes.push({ method: 'DELETE', path, handler });
  }

  async handle(req: IncomingMessage, res: ServerResponse) {
    const { pathname } = parse(req.url || '', true);
    const method = req.method?.toUpperCase();
    if (!pathname || !method) return sendJson(res, 400, 'Invalid Request');

    const requestParts = pathname.split('/').filter(Boolean);

for (const route of this.routes) {
  console.log(`[DEBUG]: Checking route: ${route.method} ${route.path}`);

  if (route.method !== method) {
    console.log('[DEBUG]: Method does not match');
    continue;
  }

  const routeParts = route.path.split('/').filter(Boolean);
  const requestParts = pathname.split('/').filter(Boolean);

  if (routeParts.length !== requestParts.length) {
    console.log('[DEBUG]: Part lengths do not match');
    continue;
  }

  const params: Record<string, string> = {};
  let match = true;

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      params[routeParts[i].slice(1)] = requestParts[i];
    } else if (routeParts[i] !== requestParts[i]) {
      match = false;
      break;
    }
  }

  if (match) {
    console.log('[DEBUG]: Route matched! Calling handler...');
    (req as any).params = params;

    try {
      const data = await route.handler(req as any, res);
      if (!res.writableEnded) {
        return sendJson(res, 200, 'Success', data);
      }
    } catch (err) {
      console.error('Handler error:', err);
      if (!res.writableEnded) {
        return sendJson(res, 500, 'Server Error');
      }
    }
    return;
  }
}

console.log('[DEBUG]: No matching route found');

    return sendJson(res, 404, 'Not Found');
  }
}