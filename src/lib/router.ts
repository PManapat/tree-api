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

    const matchedRoute = this.routes.find(
      (r) => r.method === method && r.path === pathname
    );

    if (matchedRoute) {
      try {
        const data = await matchedRoute.handler(req, res);
        return sendJson(res, 200, 'Success', data);
      } catch (err) {
        console.error('Route handler error:', err);
        return sendJson(res, 500, 'Server Error');
      }
    }

    return sendJson(res, 404, 'Not Found');
  }
}
