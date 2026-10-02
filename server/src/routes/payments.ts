import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth';
import { randomUUID } from 'crypto';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-01-27.acacia' as any,
});

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

    if (!['SUBSCRIPTION', 'BOOST', 'PRIORITY_REQUEST'].includes(type)) {
      return res.status(400).json({ error: 'Type de paiement invalide' });
    }
    
    if (!provider) {
      return res.status(400).json({ error: 'Fournisseur de paiement requis' });
    }

    let plan;
    if (type === 'SUBSCRIPTION') {
      plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    } else if (type === 'BOOST') {
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
    } else if (type === 'PRIORITY_REQUEST') {
      const PRIORITY_PRICES = {
        PRIORITY_7D: { price: 1000, name: 'Priorité 7 jours', active: true, currency: 'FCFA' },
        PRIORITY_15D: { price: 1500, name: 'Priorité 15 jours', active: true, currency: 'FCFA' },
        PRIORITY_30D: { price: 2500, name: 'Priorité 30 jours', active: true, currency: 'FCFA' },
      };
      plan = PRIORITY_PRICES[planId as keyof typeof PRIORITY_PRICES];
      if (!propertyId) return res.status(400).json({ error: 'L\'ID de la demande (propertyId) est requis' });
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
        provider: 'Stripe',
        status: 'PENDING',
        metadata: JSON.stringify({ planId, propertyId })
      }
    });

    if (provider === 'Stripe') {
      const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: type === 'SUBSCRIPTION' ? `Abonnement - ${plan.name}` : type === 'BOOST' ? `Boost - ${plan.name}` : `Demande Prioritaire - ${plan.name}`,
              },
              unit_amount: Math.round(amount * 100), // Stripe expects amounts in cents (if EUR/USD, or CFA depending on Stripe support, but let's assume it's correctly mapped)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        billing_address_collection: 'required',
        success_url: `${origin}/checkout?status=success&session_id={CHECKOUT_SESSION_ID}&payment_id=${payment.id}`,
        cancel_url: `${origin}/checkout?status=canceled`,
        client_reference_id: payment.id,
        metadata: {
          paymentId: payment.id,
        }
      });

      return res.json({ 
        paymentId: payment.id, 
        amount, 
        currency,
        url: session.url
      });
    }

    if (provider === 'SaasPay') {
      const origin = req.headers.origin || process.env.FRONTEND_URL || 'http://localhost:5173';
      
      const { customerDetails } = req.body;
      const countryCode = customerDetails?.country || 'CI';
      
      const payload = {
        amount: amount.toFixed(2), // SasPay expects a string like "5000.00"
        currency: currency === 'FCFA' ? 'XOF' : currency,
        description: type === 'SUBSCRIPTION' ? `Abonnement - ${plan.name}` : type === 'BOOST' ? `Boost - ${plan.name}` : `Demande Prioritaire - ${plan.name}`,
        country: countryCode, 
        customer_email: customerDetails?.email || req.user?.email || 'client@nestora.com',
        customer_name: (customerDetails?.firstName || customerDetails?.lastName) 
                        ? `${customerDetails.firstName || ''} ${customerDetails.lastName || ''}`.trim() 
                        : `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || 'Client Nestora',
        reference: payment.id // Important pour retrouver le paiement dans le Webhook
      };

      const response = await fetch('https://api.saspay.me/api/v1/checkout-sessions/', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SAASPAY_API_KEY}`
        },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      const checkoutUrl = result.checkout_url || (result.data && result.data.checkout_url);
      
      if (response.ok && checkoutUrl) {
        return res.json({
          paymentId: payment.id,
          amount,
          currency,
          url: checkoutUrl
        });
      } else {
        console.error('SaasPay error:', result);
        return res.status(500).json({ error: 'Erreur lors de la création du lien SaasPay' });
      }
    }
    res.json({ 
      paymentId: payment.id, 
      amount, 
      currency,
      message: 'Transaction initialisée.'
    });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Erreur lors de l\'initialisation du paiement' });
  }
});

// Webhook to confirm payment (Simulated or Real provider endpoint)
router.post('/webhook/stripe', requireAuth, async (req, res) => {
  try {
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
      } else if (payment.type === 'PRIORITY_REQUEST') {
        const PRIORITY_DURATIONS = { PRIORITY_7D: 7, PRIORITY_15D: 15, PRIORITY_30D: 30 };
        const duration = PRIORITY_DURATIONS[meta.planId as keyof typeof PRIORITY_DURATIONS];
        if (duration && meta.propertyId) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + duration);
          await prisma.housingRequest.update({
            where: { id: meta.propertyId },
            data: { isPriority: true, priorityEndDate: endDate, priorityPaymentId: payment.id }
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

// Webhook for SasPay
router.post('/webhook/saaspay', async (req, res) => {
  try {
    const { event, data } = req.body;
    
    // SasPay n'envoie que transaction.success ou transaction.failed (entre autres)
    if (!event || !data) {
      return res.status(400).json({ error: 'Format invalide' });
    }

    // Nous utiliserons la "reference" pour stocker notre paymentId lors de la création
    const paymentId = data.reference; 
    const paymentStatus = data.status; // 'SUCCESS', 'FAILED', etc.
    
    if (!paymentId) {
      return res.status(400).json({ error: 'Reference manquante' });
    }

    const payment = await prisma.payment.findUnique({ where: { id: paymentId } });
    if (!payment) return res.status(404).json({ error: 'Paiement non trouvé' });
    if (payment.status !== 'PENDING') return res.json({ message: 'Paiement déjà traité' }); // Idempotency

    // TODO: Sécurité - Idéalement, vérifier la signature X-Webhook-Signature ici 
    // avec le PAYMENT_WEBHOOK_SECRET comme indiqué dans la doc SasPay.
    
    // Sécurité supplémentaire: vérifier le statut réel sur la passerelle
    const verifyResponse = await fetch(`https://api.saspay.me/api/v1/payments/${data.id}/verify/`, {
      headers: {
        'Authorization': `Bearer ${process.env.SAASPAY_API_KEY}`
      }
    });
    const verifyData = await verifyResponse.json();

    if (event === 'transaction.success' && paymentStatus === 'SUCCESS' && verifyData.status === 'SUCCESS') {
      await prisma.payment.update({
        where: { id: paymentId },
        data: { 
          status: 'SUCCESS',
          providerTransactionId: data.id // L'ID réel côté SasPay
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
          status: 'PAID'
        }
      });

      const meta = JSON.parse(payment.metadata || '{}');

      // Create Subscription or Boost
      if (payment.type === 'SUBSCRIPTION') {
        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: meta.planId } });
        if (plan) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + plan.duration);

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
      } else if (payment.type === 'PRIORITY_REQUEST') {
        const PRIORITY_DURATIONS = { PRIORITY_7D: 7, PRIORITY_15D: 15, PRIORITY_30D: 30 };
        const duration = PRIORITY_DURATIONS[meta.planId as keyof typeof PRIORITY_DURATIONS];
        if (duration && meta.propertyId) {
          const endDate = new Date();
          endDate.setDate(endDate.getDate() + duration);
          await prisma.housingRequest.update({
            where: { id: meta.propertyId },
            data: { isPriority: true, priorityEndDate: endDate, priorityPaymentId: payment.id }
          });
        }
      }
    } else {
      // Payment failed
      await prisma.payment.update({
        where: { id: paymentId },
        data: { status: 'FAILED' }
      });
    }

    res.json({ message: 'Webhook SaasPay traité avec succès' });
  } catch (error) {
    console.error('SaasPay Webhook error:', error);
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
