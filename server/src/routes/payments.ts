import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { randomUUID } from 'crypto';

const router = Router();
const prisma = new PrismaClient();

// Get subscription and boost plans
router.get('/plans', async (req, res) => {
  try {
    const subscriptionPlans = await prisma.subscriptionPlan.findMany({
      where: { active: true },
      orderBy: { price: 'asc' }
    });
    
    const boostPlans = await prisma.boostPlan.findMany({
      where: { active: true },
      orderBy: { price: 'asc' }
    });

    res.json({ subscriptionPlans, boostPlans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des plans' });
  }
});

// Initialize checkout
router.post('/checkout', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { type, planId, propertyId, provider } = req.body;

    if (!['SUBSCRIPTION', 'BOOST'].includes(type)) {
      return res.status(400).json({ error: 'Type de paiement invalide' });
    }
    
    if (!provider) {
      return res.status(400).json({ error: 'Fournisseur de paiement requis' });
    }

    let plan;
    if (type === 'SUBSCRIPTION') {
      plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    } else {
      plan = await prisma.boostPlan.findUnique({ where: { id: planId } });
      if (!propertyId) return res.status(400).json({ error: 'propertyId est requis pour un boost' });
      
      // Verify property belongs to user
      const property = await prisma.property.findUnique({ where: { id: propertyId } });
      if (!property || property.ownerId !== userId) {
        // Also check if user is agency owner
        let isAuthorized = false;
        if (property?.agencyId) {
           const agency = await prisma.agency.findUnique({ where: { id: property.agencyId } });
           if (agency?.ownerUserId === userId) isAuthorized = true;
        }
        if (!isAuthorized) return res.status(403).json({ error: 'Vous ne pouvez pas booster cette annonce' });
      }
    }

    if (!plan || !plan.active) {
      return res.status(404).json({ error: 'Plan introuvable ou inactif' });
    }

    const amount = plan.price;
    const currency = plan.currency;

    // Create a pending payment
    const payment = await prisma.payment.create({
      data: {
        userId,
        amount,
        currency,
        type: type as any,
        provider,
        status: 'PENDING',
        metadata: JSON.stringify({ planId, propertyId })
      }
    });

    // In a real system, here we would call the payment provider's API
    // e.g. OrangeMoneyProvider.initializePayment(...)
    // For now, we just return the pending transaction info
    
    res.json({ 
      paymentId: payment.id, 
      amount, 
      currency,
      message: 'Transaction initialisée. (Système de paiement réel à configurer)'
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Erreur lors de l\'initialisation du paiement' });
  }
});

// Webhook to confirm payment (Simulated or Real provider endpoint)
router.post('/webhook/:provider', async (req, res) => {
  try {
    const { provider } = req.params;
    // VERY IMPORTANT: In production, verify the webhook signature here using a secret
    // const signature = req.headers['x-provider-signature'];
    
    const { paymentId, status, providerTransactionId } = req.body;
    
    if (!paymentId || !status) {
      return res.status(400).json({ error: 'Données manquantes' });
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return res.status(404).json({ error: 'Paiement non trouvé' });
    if (payment.status !== 'PENDING') return res.json({ message: 'Paiement déjà traité' }); // Idempotency

    if (status === 'SUCCESS') {
      // Update payment
      await prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: 'SUCCESS',
          providerTransactionId: providerTransactionId || randomUUID()
        }
      });

      // Generate invoice
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      await prisma.invoice.create({
        data: {
          userId: payment.userId,
          paymentId: payment.id,
          invoiceNumber,
          amount: payment.amount,
          currency: payment.currency,
          status: 'PAID' // Assuming paid upon successful payment
        }
      });

      const meta = JSON.parse(payment.metadata || '{}');

      // Create Subscription or Boost
      if (payment.type === 'SUBSCRIPTION') {
        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: meta.planId } });
        if (plan) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + plan.duration);

          // Find existing active subscription to replace or just create new
          await prisma.subscription.create({
            data: {
              userId: payment.userId,
              planId: plan.id,
              status: 'ACTIVE',
              endDate
            }
          });
        }
      } else if (payment.type === 'BOOST') {
        const plan = await prisma.boostPlan.findUnique({ where: { id: meta.planId } });
        if (plan && meta.propertyId) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + plan.duration);

          await prisma.boost.create({
            data: {
              userId: payment.userId,
              propertyId: meta.propertyId,
              planId: plan.id,
              status: 'ACTIVE',
              endDate
            }
          });
        }
      }
    } else {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'FAILED' }
      });
    }

    res.json({ message: 'Webhook traité avec succès' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

// Get payment history
router.get('/history', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { invoice: true }
    });
    res.json(payments);
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

// Get invoices
router.get('/invoices', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const invoices = await prisma.invoice.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
      include: { payment: true }
    });
    res.json(invoices);
  } catch (error) {
    console.error('Invoices error:', error);
    res.status(500).json({ error: 'Erreur interne' });
  }
});

export default router;
