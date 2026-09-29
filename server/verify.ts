import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const propertyCount = await prisma.property.count();
    const agencyCount = await prisma.agency.count();
    
    console.log('✅ Connexion Prisma réussie à Supabase PostgreSQL !');
    console.log(`- Tables accessibles.`);
    console.log(`- Utilisateurs: ${userCount}`);
    console.log(`- Propriétés: ${propertyCount}`);
    console.log(`- Agences: ${agencyCount}`);
    
  } catch (e) {
    console.error('❌ Erreur de connexion Prisma:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
