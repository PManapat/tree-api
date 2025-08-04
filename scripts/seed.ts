import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  const root = await prisma.treeNode.create({
    data: { label: "root" },
  });

  const key = await prisma.apiKey.create({
    data: { key: "dev-key-123", label: "Local Dev Key" },
  });

  console.log("Seeded:", { root, key });
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('Seed error:', e);
  prisma.$disconnect();
});