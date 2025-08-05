import { Router } from '../lib/router';
import { getTree, postTree, getTreeById } from '../controllers/controller';

const router = new Router();

router.get('/api/tree', getTree);
router.post('/api/tree', postTree);
router.get('/api/tree/:treeId', getTreeById);

console.log('Intialized Routes');
(router as any).routes?.forEach((r: { method: any; path: any; }) =>
  console.log(`${r.method} ${r.path}`)
);

export default router;
