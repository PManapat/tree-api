import http from "http";
import router from './routes/routes';
import { validateApiKey } from './middleware/apiKeyAuth';
import { sendJson } from "./utils/respond";

const server = http.createServer(async (req, res) => {
  if (!(await validateApiKey(req))) {
    return sendJson(res, 403, 'Invalid or missing API key');
  }

  await router.handle(req, res);
});

server.listen(3000, () => {
  console.log('HTTP server listening on port 3000');
});
