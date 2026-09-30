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

    const whereClause = isAgency ? { agencyId: req.user.agencyId } : { ownerId: userId };

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
    const totalViews = properties.reduce((acc, curr) => acc + curr.views, 0);
    const totalFavorites = properties.reduce((acc, curr) => acc + curr._count.favorites, 0);
    const totalVisits = properties.reduce((acc, curr) => acc + curr._count.visits, 0);
    const totalConversations = properties.reduce((acc, curr) => acc + curr._count.conversations, 0);

    const boosts = await prisma.boost.count({
      where: {
        property: whereClause,
        status: 'ACTIVE',
        endDate: { gt: new Date() }
      }
    });

    res.json({
      activeProperties,
      totalProperties,
      totalViews,
      totalFavorites,
      totalVisits,
      totalConversations,
      activeBoosts: boosts
    });
  } catch (error: any) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Erreur lors du calcul des statistiques' });
  }
});

export default router;
