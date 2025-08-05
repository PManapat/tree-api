import prisma from '../utils/prisma';

// refactor into a cleaner service NodeService
export class NodeService{
  
  async createNode(label: string, parentId: number){
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
  }

  async getTree(){
    const allNodes = await prisma.treeNode.findMany();
    const nodeMap = new Map<number, any>();
    const tree: any = [];
  
    // loop through each node and add it to the nodemap with an empty child []
    allNodes.forEach((node: any) => {
      nodeMap.set(node.id, { ...node, children: [] });
    });
  
    //if no parentId it is the root, push to tree
    nodeMap.forEach((node) => {
      if (node.parentId === null) {
        tree.push(node);
      } else {
        //find its parent and push into the parents child array
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return tree;
  }

  async getTreeById(id: number){
    console.log('Service: getTreeById()')
    const nodeMap = new Map<number, any>();
    const tree: any = []

    const getNodes = await prisma.treeNode.findMany({where: {    
        OR: [
          { id: id },
          { parentId: id }
        ]
      } 
    })
    if (!getNodes){
      return null
    }

    getNodes.forEach((node: any) => {
      nodeMap.set(node.id, { ...node, children: [] });
    });

    nodeMap.forEach((node) => {
      console.log('Each2: ', node)
      if (node.id === id) {
        tree.push(node);
      } else {
        //find its parent and push into the parents child array
        const parent = nodeMap.get(node.parentId);
        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return tree
  }

  //needs to be tested
  async updateNode(label: string, id:number){
    const update = await prisma.treeNode.update({
      where: {id: id}, 
      data:{label: label}
    })
    if (!update) {
      return null
    }
    return update
  }

}

// export const createNode = async (label: string, parentId: number) => {
//   const parent = await prisma.treeNode.findUnique({ where: { id: parentId } });

//   if (!parent) {
//       return null; 
//   }

//   const existing = await prisma.treeNode.findFirst({where: { label: label.toLowerCase(), parentId }});
  
//   if (existing) {
//       return 'DUPLICATE';
//   }

//   return prisma.treeNode.create({
//     data: {
//       label,
//       parentId,
//     },

//   });
// };

// export const updateNode = async (label: string, id: number) => {
//     const update = await prisma.treeNode.update({
//     where: {id: id}, 
//     data:{label: label}
//   })
//   if (!update) {
//     return null
//   }
//   return update
// }