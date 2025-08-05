import { IncomingMessage, ServerResponse } from 'http';
import { getPostData } from '../utils/getPostData';
import { NodeService } from '../services/service';
import prisma from '../utils/prisma';
import { sendJson } from '../utils/respond';

const nodeService = new NodeService();

// GET Full tree
export const getTree = async (req: IncomingMessage, res: ServerResponse) => {
  const body = await nodeService.getTree();
    if (!body){
      return sendJson(res, 400, "Error finding Tree");
    }
  return sendJson(res, 200, "Success", body)
};

export const getTreeById = async (req: any, res: ServerResponse) => {
  const treeId = parseInt(req.params?.treeId);
  console.log('Params:', req.params);
  if (isNaN(treeId)) return sendJson(res, 400, 'Invalid treeId');

  const body = await nodeService.getTreeById((treeId));
  return sendJson(res, 200, "Success, Found by Id", body);
};

export const postTree = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await getPostData(req);
    const { label, parentId } = JSON.parse(body);

    if (!label) {
      return sendJson(res, 400, "Label is required");
    }

    if (parentId === null || parentId === undefined) {
      return sendJson(res, 400, "Cannot create root node through this endpoint");
    }

    const newNode = await nodeService.createNode(label, parentId);

    if (newNode === "DUPLICATE") {
      return sendJson(res, 409, "Node with same label already exists under this parent");
    }

    if (!newNode) {
      return sendJson(res, 404, `Parent node with id ${parentId} does not exist`);
    }

    return sendJson(res, 200, "Node created", newNode);
  } catch (err) {
    console.error("postTree error:", err);
    return sendJson(res, 500, "Server error");
  }
};

// export const updateTree = async (req: IncomingMessage, res: ServerResponse) => {
//     const { label, parentId } = JSON.parse(body);
//     const body = await updateNode(label, id);
// } 