import http from 'http';
import supertest from 'supertest';
import prisma from '../src/utils/prisma';
import router from '../src/routes/routes';

const server = http.createServer((req, res) => {
  router.handle(req, res);
});


const request = supertest(server);

beforeAll(async () => {
    await prisma.treeNode.deleteMany(); // clean before testing
    await prisma.treeNode.create({
        data: {
            label: 'root',
            parentId: null
        }
    });
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('POST /api/tree', () => {
    //1.should create a valid child node under root
    it('should create a valid child node under root', async () => {
        const root = await prisma.treeNode.findFirst({ where: { parentId: null } });

        const res = await request.post('/api/tree').send({
            label: 'child1',
            parentId: root?.id
        });

        expect(res.status).toBe(200);
        expect(res.body.data.label).toBe('child1');
        expect(res.body.data.parentId).toBe(root?.id);
    });

    //2.should fail to create a node with invalid parentId
    it('should fail to create a node with invalid parentId', async () => {
        const res = await request.post('/api/tree').send({
            label: 'orphan',
            parentId: 9999
        });

        expect(res.status).toBe(404);
        expect(res.body.message).toMatch(/Parent node/);
    });

    //3.should fail to create a root node
    it('should fail to create a root node', async () => {
        const res = await request.post('/api/tree').send({
            label: 'new-root'
        });

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/Cannot create root node/);
    
    });

    //4.should not allow duplicate labels under the same parent
    it('should not allow duplicate labels under the same parent', async () => {
        // Find root node
        const root = await prisma.treeNode.findFirst({ where: { parentId: null } });

        // Create a child under root
        const res1 = await request.post('/api/tree').send({
            label: 'duplicate-me',
            parentId: root!.id,
        });

        expect(res1.status).toBe(200);
        expect(res1.body.data.label).toBe('duplicate-me');

        // Try to create the same label under the same parent
        const res2 = await request.post('/api/tree').send({
            label: 'duplicate-me',
            parentId: root!.id,
        });

        expect(res2.status).toBe(409);
        expect(res2.body.message).toMatch(/already exists/);
    });

    //5.should allow same label under different parents
    it('should allow same label under different parents', async () => {
        const root = await prisma.treeNode.findFirst({ where: { parentId: null } });

        const child1 = await prisma.treeNode.create({
            data: { label: 'child1', parentId: root!.id },
        });

        const res = await request.post('/api/tree').send({
            label: 'child2',
            parentId: child1.id,
        });

        expect(res.status).toBe(200);
        expect(res.body.data.label).toBe('child2');
        expect(res.body.data.parentId).toBe(child1.id);
    });

});

describe('GET /api/tree', () => {
    //1.should return a nested tree with root and children
    it('should return a nested tree with root and children', async () => {
        const root = await prisma.treeNode.findFirst({ where: { parentId: null } });

        const child1a = await prisma.treeNode.create({
            data: { label: 'child1', parentId: root!.id },
        });

        const child1b = await prisma.treeNode.create({
            data: { label: 'child1', parentId: root!.id },
        });

        const child2 = await prisma.treeNode.create({
            data: { label: 'child2', parentId: child1b.id },
        });

        const res = await request.get('/api/tree');
    
        expect(res.status).toBe(200);
    
        expect(Array.isArray(res.body.data)).toBe(true);

        const rootNode = res.body.data.find((node: any) => node.label === 'root');
        expect(rootNode).toBeDefined();

        const child1WithChildren = rootNode.children.find(
            (child: any) => child.children.length > 0
        );

        expect(child1WithChildren).toBeDefined();
        expect(child1WithChildren.label).toBe('child1');
        expect(child1WithChildren.children[0].label).toBe('child2');
    });

    //2.should return an empty array if there are no nodes
    it('should return an empty array if there are no nodes', async () => {
        // Clean slate
        await prisma.treeNode.deleteMany();

        const res = await request.get('/api/tree');

        expect(res.status).toBe(200);
        expect(res.body.data).toEqual([]);
    });

});

// should go here to reset the node 
describe('POST /api/tree', () => {
    it('should truncate TreeNode table and insert a fresh root node', async () => {
        // Truncate and reset the table
        await prisma.$executeRawUnsafe(
            `TRUNCATE TABLE "TreeNode" RESTART IDENTITY CASCADE;`
        );

        // Insert the new root node manually
        const root = await prisma.treeNode.create({
            data: { label: 'root', parentId: null },
        });

        expect(root).toBeDefined();
        expect(root.id).toBe(1); // ID should be reset to 1
        expect(root.label).toBe('root');
    });
})