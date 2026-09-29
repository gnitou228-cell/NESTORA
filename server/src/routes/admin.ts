import { Router } from 'express';
import { PrismaClient, PropertyStatus } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Middleware to check if user is admin
const requireAdmin = async (req: any, res: any, next: any) => {
  if (req.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Accès non autorisé. Administrateurs uniquement.' });
  }
  next();
};

// Apply auth and admin middleware to all routes in this file
router.use(requireAuth, requireAdmin);

// Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalProperties = await prisma.property.count();
    const totalRevenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS' }
    });
    const pendingProperties = await prisma.property.count({
      where: { status: 'PENDING' }
    });

    res.json({
      totalUsers,
      totalProperties,
      totalRevenue: totalRevenueResult._sum.amount || 0,
      pendingProperties
    });
  } catch (error) {
    console.error('Error fetching admin stats', error);
    res.status(500).json({ error: 'Erreur lors du chargement des statistiques' });
  }
});

// Users management
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isVerified: true,
        createdAt: true,
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des utilisateurs' });
  }
});

// Properties moderation
router.get('/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { firstName: true, lastName: true, email: true } }
      }
    });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des propriétés' });
  }
});

router.patch('/properties/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(PropertyStatus).includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { status }
    });

    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

// Payments & Invoices
router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        invoice: true
      }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des paiements' });
  }
});

export default router;
