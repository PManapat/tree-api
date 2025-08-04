import { IncomingMessage, ServerResponse } from 'http';
import { getPostData } from '../utils/getPostData';
import { createNode } from '../services/service';
import prisma from '../utils/prisma';
import { sendJson } from '../utils/respond';

// GET /api/tree
export const getTree = async () => {
  const allNodes = await prisma.treeNode.findMany();
  const nodeMap = new Map<number, any>();
  
  allNodes.forEach((node: any) => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  const tree: any = [];
  nodeMap.forEach((node) => {
    if (node.parentId === null) {
      tree.push(node);
    } else {
      const parent = nodeMap.get(node.parentId);
      if (parent) parent.children.push(node);
    }
  });

  return tree;
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

    const newNode = await createNode(label, parentId);

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