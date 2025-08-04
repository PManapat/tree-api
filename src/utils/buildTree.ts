import prisma from './prisma';

type TreeNodeShape = {
  id: number;
  label: string;
  children: TreeNodeShape[];
};

export const buildTree = async (node: any): Promise<TreeNodeShape> => {
    console.log('buildTree()')
    const children = await prisma.treeNode.findMany({ where: { parentId: node.id } });
    const resolvedChildren = await Promise.all(children.map(buildTree));
    
    return {
        id: node.id,
        label: node.label,
        children: resolvedChildren
    };
}
