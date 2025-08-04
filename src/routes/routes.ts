import { Router } from '../lib/router';
import { getTree, postTree } from '../controllers/controller';

const router = new Router();

router.get('/api/tree', getTree);
router.post('/api/tree', postTree);

export default router;
