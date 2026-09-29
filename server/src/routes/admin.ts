import { Router } from 'express';
import { PrismaClient, PropertyStatus, UserStatus, ReportStatus, VerificationStatus } from '@prisma/client';
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

router.use(requireAuth, requireAdmin);

// Helper for AdminAuditLog
const logAdminAction = async (adminId: string, action: string, entityType: string, entityId: string, oldValue?: any, newValue?: any) => {
  try {
    await prisma.adminAuditLog.create({
      data: {
        adminId,
        action,
        entityType,
        entityId,
        oldValue: oldValue ? JSON.stringify(oldValue) : null,
        newValue: newValue ? JSON.stringify(newValue) : null
      }
    });
  } catch (error) {
    console.error('Failed to log admin action', error);
  }
};

// 1. Dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalSeekers = await prisma.user.count({ where: { role: 'SEEKER' } });
    const totalOwners = await prisma.user.count({ where: { role: 'OWNER' } });
    const totalAgencies = await prisma.agency.count();
    
    const totalProperties = await prisma.property.count();
    const pendingProperties = await prisma.property.count({ where: { status: 'PENDING' } });
    const rejectedProperties = await prisma.property.count({ where: { status: 'REJECTED' } });
    
    const totalReports = await prisma.report.count({ where: { status: 'PENDING' } });
    const totalVisits = await prisma.visit.count();
    const totalMessages = await prisma.message.count();
    const activeSubscriptions = await prisma.subscription.count({ where: { status: 'ACTIVE' } });
    const activeBoosts = await prisma.boost.count({ where: { status: 'ACTIVE' } });
    const totalPayments = await prisma.payment.count({ where: { status: 'SUCCESS' } });

    const totalRevenueResult = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: 'SUCCESS' }
    });

    res.json({
      totalUsers,
      totalSeekers,
      totalOwners,
      totalAgencies,
      totalProperties,
      pendingProperties,
      rejectedProperties,
      totalReports,
      totalVisits,
      totalMessages,
      activeSubscriptions,
      activeBoosts,
      totalPayments,
      totalRevenue: totalRevenueResult._sum.amount || 0
    });
  } catch (error) {
    console.error('Error fetching admin stats', error);
    res.status(500).json({ error: 'Erreur lors du chargement des statistiques' });
  }
});

// 2. Users management
router.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        phoneVerified: true,
        createdAt: true,
        profile: { select: { firstName: true, lastName: true } },
        _count: {
          select: { properties: true, reportsReceived: true }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des utilisateurs' });
  }
});

router.patch('/users/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = (req as any).user.id;

    if (!Object.values(UserStatus).includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const oldUser = await prisma.user.findUnique({ where: { id } });
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { status }
    });

    await logAdminAction(adminId, `USER_STATUS_UPDATED`, 'User', id, { status: oldUser?.status }, { status: updatedUser.status });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

// 3. Properties management
router.get('/properties', async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        country: { select: { name: true } },
        city: { select: { name: true } },
        _count: { select: { reports: true } },
        boosts: { where: { status: 'ACTIVE' }, select: { id: true } }
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
    const { status, reason } = req.body;
    const adminId = (req as any).user.id;

    if (!Object.values(PropertyStatus).includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const oldProperty = await prisma.property.findUnique({ where: { id } });
    const updatedProperty = await prisma.property.update({
      where: { id },
      data: { status }
    });

    await logAdminAction(adminId, `PROPERTY_${status}`, 'Property', id, { status: oldProperty?.status }, { status: updatedProperty.status, reason });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut' });
  }
});

// 6. Reports moderation
router.get('/reports', async (req, res) => {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        reportedUser: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        property: { select: { id: true, title: true } }
      }
    });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des signalements' });
  }
});

router.patch('/reports/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;
    const adminId = (req as any).user.id;

    if (!Object.values(ReportStatus).includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const oldReport = await prisma.report.findUnique({ where: { id } });
    const updatedReport = await prisma.report.update({
      where: { id },
      data: { status, adminNote }
    });

    await logAdminAction(adminId, `REPORT_STATUS_UPDATED`, 'Report', id, { status: oldReport?.status }, { status: updatedReport.status, adminNote });
    res.json(updatedReport);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du signalement' });
  }
});

// 7. Verifications
router.get('/verifications', async (req, res) => {
  try {
    const verifs = await prisma.verification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        agency: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } }
      }
    });
    res.json(verifs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des vérifications' });
  }
});

router.patch('/verifications/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = (req as any).user.id;

    if (!Object.values(VerificationStatus).includes(status)) {
      return res.status(400).json({ error: 'Statut invalide' });
    }

    const oldVerif = await prisma.verification.findUnique({ where: { id } });
    const updatedVerif = await prisma.verification.update({
      where: { id },
      data: { status, reviewedBy: adminId, verifiedAt: status === 'VERIFIED' ? new Date() : null }
    });

    await logAdminAction(adminId, `VERIFICATION_STATUS_UPDATED`, 'Verification', id, { status: oldVerif?.status }, { status: updatedVerif.status });
    res.json(updatedVerif);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// 8. Agencies management
router.get('/agencies', async (req, res) => {
  try {
    const agencies = await prisma.agency.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        _count: { select: { members: true, properties: true } }
      }
    });
    res.json(agencies);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des agences' });
  }
});

// 9. Subscriptions
router.get('/subscriptions', async (req, res) => {
  try {
    const subs = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        plan: true
      }
    });
    res.json(subs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des abonnements' });
  }
});

// 10. Boosts
router.get('/boosts', async (req, res) => {
  try {
    const boosts = await prisma.boost.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        property: { select: { id: true, title: true } },
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        plan: true
      }
    });
    res.json(boosts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des boosts' });
  }
});

// 11. Payments & Invoices
router.get('/payments', async (req, res) => {
  try {
    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } },
        invoice: true
      }
    });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement des paiements' });
  }
});

// 14. Audit Log
router.get('/audit', async (req, res) => {
  try {
    const logs = await prisma.adminAuditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        admin: { select: { id: true, email: true, profile: { select: { firstName: true, lastName: true } } } }
      },
      take: 100
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du chargement de l\'audit' });
  }
});

export default router;
