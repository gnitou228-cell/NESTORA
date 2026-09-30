import { Router } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.get('/stats', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    if (role === Role.SEEKER) {
      const [favoritesCount, visitsCount, conversationsCount, recentFavorites, recentVisits, allRecentProperties] = await Promise.all([
        prisma.favorite.count({ where: { userId } }),
        prisma.visit.count({ where: { requesterId: userId } }),
        prisma.conversationMember.count({ where: { userId } }),
        prisma.favorite.findMany({ 
          where: { userId }, 
          take: 4, 
          orderBy: { createdAt: 'desc' },
          include: { property: { include: { images: { orderBy: { position: 'asc' }, take: 1 }, city: true } } }
        }),
        prisma.visit.findMany({
          where: { requesterId: userId },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { property: { include: { city: true } } }
        }),
        prisma.property.findMany({
          where: { status: 'PUBLISHED' },
          take: 4,
          orderBy: { createdAt: 'desc' },
          include: { images: { orderBy: { position: 'asc' }, take: 1 }, city: true }
        })
      ]);

      const recentProperties = recentFavorites.map((f: any) => f.property);

      return res.json({
        favorites: favoritesCount,
        visits: visitsCount,
        conversations: conversationsCount,
        recentProperties,
        allRecentProperties,
        recentActivities: recentVisits.map((v: any) => ({
          type: 'VISIT_REQUEST',
          title: 'Demande de visite',
          desc: `Pour ${v.property.title}`,
          date: v.createdAt
        }))
      });
    }

    if (role === Role.OWNER) {
      const [totalProperties, publishedProperties, pendingProperties, expiredProperties, visitsCount, conversationsCount, recentProps, recentVisits] = await Promise.all([
        prisma.property.count({ where: { ownerId: userId } }),
        prisma.property.count({ where: { ownerId: userId, status: 'PUBLISHED' } }),
        prisma.property.count({ where: { ownerId: userId, status: 'PENDING' } }),
        prisma.property.count({ where: { ownerId: userId, status: 'EXPIRED' } }),
        prisma.visit.count({ where: { property: { ownerId: userId } } }),
        prisma.conversationMember.count({ where: { userId } }), // conversations of the owner
        prisma.property.findMany({ 
          where: { ownerId: userId }, 
          take: 4, 
          orderBy: { createdAt: 'desc' },
          include: { images: { orderBy: { position: 'asc' }, take: 1 }, city: true }
        }),
        prisma.visit.findMany({
          where: { property: { ownerId: userId } },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { property: { include: { city: true } }, requester: { include: { profile: true } } }
        })
      ]);

      return res.json({
        totalProperties,
        publishedProperties,
        pendingProperties,
        expiredProperties,
        visits: visitsCount,
        conversations: conversationsCount,
        recentProperties: recentProps,
        recentActivities: recentVisits.map((v: any) => ({
          type: 'VISIT_REQUEST',
          title: 'Nouvelle demande de visite',
          desc: `Pour ${v.property.title} par ${v.requester.profile?.firstName} ${v.requester.profile?.lastName}`,
          date: v.createdAt
        }))
      });
    }

    if (role === Role.AGENCY) {
      // Find the agency owned by the user
      const agency = await prisma.agency.findUnique({
        where: { ownerUserId: userId }
      });

      if (!agency) {
        return res.status(404).json({ error: 'Agence non trouvée' });
      }

      const [totalProperties, publishedProperties, pendingProperties, visitsCount, conversationsCount, agentsCount, recentProps, recentVisits] = await Promise.all([
        prisma.property.count({ where: { agencyId: agency.id } }),
        prisma.property.count({ where: { agencyId: agency.id, status: 'PUBLISHED' } }),
        prisma.property.count({ where: { agencyId: agency.id, status: 'PENDING' } }),
        prisma.visit.count({ where: { property: { agencyId: agency.id } } }),
        prisma.conversationMember.count({ where: { userId } }),
        prisma.agencyMember.count({ where: { agencyId: agency.id } }),
        prisma.property.findMany({ 
          where: { agencyId: agency.id }, 
          take: 4, 
          orderBy: { createdAt: 'desc' },
          include: { images: { orderBy: { position: 'asc' }, take: 1 }, city: true }
        }),
        prisma.visit.findMany({
          where: { property: { agencyId: agency.id } },
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { property: { include: { city: true } }, requester: { include: { profile: true } } }
        })
      ]);

      return res.json({
        totalProperties,
        publishedProperties,
        pendingProperties,
        visits: visitsCount,
        conversations: conversationsCount,
        agents: agentsCount,
        recentProperties: recentProps,
        recentActivities: recentVisits.map((v: any) => ({
          type: 'VISIT_REQUEST',
          title: 'Nouvelle demande de visite (Agence)',
          desc: `Pour ${v.property.title} par ${v.requester.profile?.firstName} ${v.requester.profile?.lastName}`,
          date: v.createdAt
        }))
      });
    }

    return res.status(400).json({ error: 'Rôle non supporté' });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
