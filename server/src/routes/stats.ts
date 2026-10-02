import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireOwnerOrAgency } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/stats/dashboard
router.get('/dashboard', requireAuth, requireOwnerOrAgency, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const isAgency = req.role === 'AGENCY';
    const agencyId = req.agencyId || req.user.agency?.id;

    // For agency, check either their agencyId or their ownerId
    const whereClause: any = isAgency
      ? (agencyId ? { OR: [{ agencyId }, { ownerId: userId }] } : { ownerId: userId })
      : { ownerId: userId };

    const properties = await prisma.property.findMany({
      where: whereClause,
      select: {
        id: true,
        status: true,
        views: true,
        _count: {
          select: {
            favorites: true,
            visits: true,
            conversations: true
          }
        }
      }
    });

    const activeProperties = properties.filter(p => p.status === 'PUBLISHED').length;
    const totalProperties = properties.length;
    const totalViews = properties.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalFavorites = properties.reduce((acc, curr) => acc + (curr._count?.favorites || 0), 0);
    const totalVisits = properties.reduce((acc, curr) => acc + (curr._count?.visits || 0), 0);
    const totalConversations = properties.reduce((acc, curr) => acc + (curr._count?.conversations || 0), 0);

    const boosts = await prisma.boost.count({
      where: {
        property: whereClause,
        status: 'ACTIVE',
        endDate: { gt: new Date() }
      }
    });

    res.json({
      activeProperties: activeProperties || 0,
      totalProperties: totalProperties || 0,
      totalViews: totalViews || 0,
      totalFavorites: totalFavorites || 0,
      totalVisits: totalVisits || 0,
      totalConversations: totalConversations || 0,
      activeBoosts: boosts || 0
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques' });
  }
});

export default router;
