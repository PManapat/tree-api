import http from 'http';

// Helper function to have a consistent response from api calls
export function sendJson(res: http.ServerResponse, status: number, message: string, data: any = null) {
  if (res.headersSent) return;

  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status, message, data }));
}
