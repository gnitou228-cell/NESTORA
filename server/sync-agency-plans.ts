import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updates = [
    { duration: 15, price: 3900, name: 'Premium 15 Jours' },
    { duration: 30, price: 5900, name: 'Premium 1 Mois' },
    { duration: 90, price: 9900, name: 'Premium 3 Mois' },
    { duration: 180, price: 14900, name: 'Premium 6 Mois' }
  ];
  await prisma.subscriptionPlan.deleteMany({ where: { targetRole: 'AGENCY' } });
  for (const u of updates) {
    await prisma.subscriptionPlan.create({
      data: {
        name: u.name,
        targetRole: 'AGENCY',
        duration: u.duration,
        price: u.price,
        currency: 'FCFA',
        features: '["Accès Premium"]'
      }
    });
  }
  console.log('Agency plans updated to match Owner plans');
}
main().then(() => process.exit(0)).catch(e => console.error(e));
