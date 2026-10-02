/**
 * NESTORA — Seed Officiel des Plans de Monétisation
 * 
 * Ce script insère ou met à jour les plans dans la base de données.
 * Les prix sont la source de vérité côté backend.
 * 
 * Usage: npx ts-node server/prisma/seed-plans.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const subscriptionPlans = [
  // ─── NESTORA Pro — Propriétaire ─────────────────────────────
  {
    code: 'OWNER_PRO',
    name: 'NESTORA Pro',
    targetRole: 'OWNER' as const,
    duration: 30,
    price: 3000,
    currency: 'FCFA',
    popular: true,
    active: true,
    features: JSON.stringify([
      'Statistiques avancées (vues, contacts, favoris)',
      'Accès aux demandes de logement compatibles',
      'Badge Pro visible sur vos annonces',
      'Outils de gestion et suivi des prospects',
      'Avantages sur les Boosts',
      'Messagerie prioritaire',
    ]),
    limits: JSON.stringify({
      maxProperties: 20,
      maxImages: 10,
      boostDiscount: 10,
    }),
  },

  // ─── Agence Starter ─────────────────────────────────────────
  {
    code: 'AGENCY_STARTER',
    name: 'Agence Starter',
    targetRole: 'AGENCY' as const,
    duration: 30,
    price: 7500,
    currency: 'FCFA',
    popular: false,
    active: true,
    features: JSON.stringify([
      'Profil agence professionnel',
      "Catalogue d'annonces illimité",
      'Gestion des agents (jusqu\'à 3)',
      'Accès aux demandes de logement compatibles',
      'Gestion des prospects',
      'Statistiques de base',
      'Messagerie',
      'Badge Agence',
    ]),
    limits: JSON.stringify({
      maxAgents: 3,
      maxProperties: 30,
      maxImages: 8,
      boostDiscount: 0,
    }),
  },

  // ─── Agence Pro ─────────────────────────────────────────────
  {
    code: 'AGENCY_PRO',
    name: 'Agence Pro',
    targetRole: 'AGENCY' as const,
    duration: 30,
    price: 15000,
    currency: 'FCFA',
    popular: true,
    active: true,
    features: JSON.stringify([
      'Tout Starter inclus',
      "Plus d'agents (jusqu'à 10)",
      'Statistiques avancées',
      'Gestion avancée des prospects',
      'Meilleure visibilité dans les résultats',
      'Avantages Boost inclus',
    ]),
    limits: JSON.stringify({
      maxAgents: 10,
      maxProperties: 100,
      maxImages: 12,
      boostDiscount: 10,
    }),
  },

  // ─── Agence Business ─────────────────────────────────────────
  {
    code: 'AGENCY_BUSINESS',
    name: 'Agence Business',
    targetRole: 'AGENCY' as const,
    duration: 30,
    price: 30000,
    currency: 'FCFA',
    popular: false,
    active: true,
    features: JSON.stringify([
      'Tout Pro inclus',
      "Agents illimités",
      'Gestion avancée des équipes',
      'Statistiques complètes et exports',
      'Gestion avancée des leads',
      'Priorité support',
      'Visibilité maximale',
    ]),
    limits: JSON.stringify({
      maxAgents: 9999,
      maxProperties: 9999,
      maxImages: 20,
      boostDiscount: 20,
    }),
  },
];

const boostPlans = [
  {
    code: 'BOOST_3D',
    name: 'Boost 3 jours',
    duration: 3,
    price: 1000,
    currency: 'FCFA',
    visibilityLevel: 3,
    active: true,
  },
  {
    code: 'BOOST_7D',
    name: 'Boost 7 jours',
    duration: 7,
    price: 2500,
    currency: 'FCFA',
    visibilityLevel: 7,
    active: true,
  },
  {
    code: 'BOOST_15D',
    name: 'Boost 15 jours',
    duration: 15,
    price: 5000,
    currency: 'FCFA',
    visibilityLevel: 15,
    active: true,
  },
  {
    code: 'BOOST_30D',
    name: 'Boost 30 jours',
    duration: 30,
    price: 8000,
    currency: 'FCFA',
    visibilityLevel: 30,
    active: true,
  },
];

// Priority plans are not stored as SubscriptionPlan but handled inline in the payment route.
// The backend extracts prices from a constants file to validate priority request payments.

async function main() {
  console.log('🌱 Seeding official NESTORA monetization plans...\n');

  // Upsert Subscription Plans
  for (const plan of subscriptionPlans) {
    const existing = await prisma.subscriptionPlan.findUnique({ where: { code: plan.code } });
    if (existing) {
      await prisma.subscriptionPlan.update({
        where: { code: plan.code },
        data: plan,
      });
      console.log(`✅ Updated SubscriptionPlan: ${plan.name} (${plan.price} FCFA)`);
    } else {
      await prisma.subscriptionPlan.create({ data: plan });
      console.log(`✅ Created SubscriptionPlan: ${plan.name} (${plan.price} FCFA)`);
    }
  }

  // Upsert Boost Plans
  for (const plan of boostPlans) {
    const existing = await prisma.boostPlan.findUnique({ where: { code: plan.code } });
    if (existing) {
      await prisma.boostPlan.update({
        where: { code: plan.code },
        data: plan,
      });
      console.log(`✅ Updated BoostPlan: ${plan.name} (${plan.price} FCFA)`);
    } else {
      await prisma.boostPlan.create({ data: plan });
      console.log(`✅ Created BoostPlan: ${plan.name} (${plan.price} FCFA)`);
    }
  }

  console.log('\n🎉 Monetization plans seeded successfully!');
  console.log('\nPlan summary:');
  console.log('  SubscriptionPlans:', subscriptionPlans.length);
  console.log('  BoostPlans:', boostPlans.length);
  console.log('  Priority requests handled inline via PRIORITY_PRICES constant');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
