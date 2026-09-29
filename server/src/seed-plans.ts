import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const seekerPlans = [
  { name: '15 jours', targetRole: 'SEEKER', duration: 15, price: 2000, currency: 'FCFA', features: '["Publication immédiate","Visibilité","Alertes"]', popular: false },
  { name: '1 mois', targetRole: 'SEEKER', duration: 30, price: 3500, currency: 'FCFA', features: '["Publication immédiate","Visibilité","Alertes"]', popular: true },
  { name: '3 mois', targetRole: 'SEEKER', duration: 90, price: 8500, currency: 'FCFA', features: '["Publication immédiate","Visibilité","Alertes"]', popular: false },
  { name: '6 mois', targetRole: 'SEEKER', duration: 180, price: 15000, currency: 'FCFA', features: '["Publication immédiate","Visibilité","Alertes"]', popular: false },
  { name: '1 an', targetRole: 'SEEKER', duration: 365, price: 25000, currency: 'FCFA', features: '["Publication immédiate","Visibilité","Alertes"]', popular: false },
];

const ownerPlans = [
  { name: '15 jours', targetRole: 'OWNER', duration: 15, price: 3500, currency: 'FCFA', features: '["Photos HQ","Contact direct","Stats"]', popular: false },
  { name: '1 mois', targetRole: 'OWNER', duration: 30, price: 5500, currency: 'FCFA', features: '["Photos HQ","Contact direct","Stats"]', popular: true },
  { name: '3 mois', targetRole: 'OWNER', duration: 90, price: 12500, currency: 'FCFA', features: '["Photos HQ","Contact direct","Stats"]', popular: false },
  { name: '6 mois', targetRole: 'OWNER', duration: 180, price: 22000, currency: 'FCFA', features: '["Photos HQ","Contact direct","Stats"]', popular: false },
  { name: '1 an', targetRole: 'OWNER', duration: 365, price: 40000, currency: 'FCFA', features: '["Photos HQ","Contact direct","Stats"]', popular: false },
];

const agencyPlans = [
  { name: 'STARTER - 1 mois', targetRole: 'AGENCY', duration: 30, price: 15000, currency: 'FCFA', features: '["10 annonces","1 agent"]', popular: false },
  { name: 'PRO - 3 mois', targetRole: 'AGENCY', duration: 90, price: 80000, currency: 'FCFA', features: '["50 annonces","5 agents"]', popular: true },
  { name: 'BUSINESS - 1 an', targetRole: 'AGENCY', duration: 365, price: 540000, currency: 'FCFA', features: '["Illimité","API"]', popular: false },
];

const boostPlans = [
  { name: 'Standard - 3 jours', duration: 3, price: 2000, currency: 'FCFA' },
  { name: 'Premium - 7 jours', duration: 7, price: 4000, currency: 'FCFA' },
  { name: 'VIP - 30 jours', duration: 30, price: 12000, currency: 'FCFA' },
];

async function main() {
  console.log('Seeding plans...');

  const allSubPlans = [...seekerPlans, ...ownerPlans, ...agencyPlans];
  
  for (const plan of allSubPlans) {
    await prisma.subscriptionPlan.create({
      data: {
        name: plan.name,
        targetRole: plan.targetRole as Role,
        duration: plan.duration,
        price: plan.price,
        currency: plan.currency,
        features: plan.features,
        popular: plan.popular
      }
    });
  }

  for (const boost of boostPlans) {
    await prisma.boostPlan.create({
      data: {
        name: boost.name,
        duration: boost.duration,
        price: boost.price,
        currency: boost.currency
      }
    });
  }

  console.log('Plans seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
