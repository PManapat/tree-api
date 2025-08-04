import prisma from '../utils/prisma';

export const createNode = async (label: string, parentId: number) => {
  const parent = await prisma.treeNode.findUnique({ where: { id: parentId } });

  if (!parent) {
      return null; 
  }

  const existing = await prisma.treeNode.findFirst({where: { label: label.toLowerCase(), parentId }});
  
  if (existing) {
      return 'DUPLICATE';
  }

  return prisma.treeNode.create({
    data: {
      label,
      parentId,
    },

  });
};