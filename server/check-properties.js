const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.property.count();
  console.log(`Total properties: ${count}`);
}
check().finally(() => prisma.$disconnect());
