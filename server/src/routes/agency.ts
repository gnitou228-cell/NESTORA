import { Router } from 'express';
import { PrismaClient, Role, UserStatus } from '@prisma/client';
import { requireAuth, requireOwnerOrAgency } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Helper to get user's agency
async function getUserAgency(userId: string) {
  let agency = await prisma.agency.findUnique({
    where: { ownerUserId: userId }
  });

  if (!agency) {
    const member = await prisma.agencyMember.findUnique({
      where: { userId },
      include: { agency: true }
    });
    if (member) agency = member.agency;
  }

  return agency;
}

// GET /api/agency/agents - List all agents for the current agency
router.get('/agents', requireAuth, requireOwnerOrAgency, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const agency = await getUserAgency(userId);

    if (!agency) {
      return res.json([]);
    }

    const members = await prisma.agencyMember.findMany({
      where: { agencyId: agency.id },
      include: {
        user: {
          include: {
            profile: true,
            _count: {
              select: { properties: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const agents = members.map((m: any) => ({
      id: m.id,
      userId: m.userId,
      firstName: m.user.profile?.firstName || '',
      lastName: m.user.profile?.lastName || '',
      name: `${m.user.profile?.firstName || ''} ${m.user.profile?.lastName || ''}`.trim() || m.user.email,
      email: m.user.email,
      phone: m.user.phone || '',
      role: m.role === 'AGENT' ? 'Agent' : m.role === 'AGENCY' ? 'Manager' : m.role,
      status: m.status === 'ACTIVE' ? 'Actif' : 'En attente',
      properties: m.user._count?.properties || 0,
      joinedAt: m.createdAt
    }));

    res.json(agents);
  } catch (error: any) {
    console.error('Error fetching agency agents:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des agents' });
  }
});

// POST /api/agency/agents - Add/Invite an agent to the agency
router.post('/agents', requireAuth, requireOwnerOrAgency, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const agency = await getUserAgency(userId);

    if (!agency) {
      return res.status(404).json({ error: 'Agence introuvable pour cet utilisateur' });
    }

    const { email, firstName, lastName, phone, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: "L'adresse email est requise" });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: { agencyMember: true }
    });

    if (user?.agencyMember) {
      return res.status(400).json({ error: "Cet utilisateur appartient déjà à une agence." });
    }

    if (!user) {
      // Create new user for this agent
      user = await prisma.user.create({
        data: {
          email,
          phone: phone || null,
          role: Role.AGENT,
          status: UserStatus.ACTIVE,
          profile: {
            create: {
              firstName: firstName || 'Agent',
              lastName: lastName || ''
            }
          }
        },
        include: { agencyMember: true }
      });
    }

    // Create AgencyMember
    const memberRole = role === 'Manager' ? Role.AGENCY : Role.AGENT;
    const member = await prisma.agencyMember.create({
      data: {
        agencyId: agency.id,
        userId: user.id,
        role: memberRole,
        status: UserStatus.ACTIVE
      },
      include: {
        user: {
          include: {
            profile: true,
            _count: { select: { properties: true } }
          }
        }
      }
    });

    res.status(201).json({
      id: member.id,
      userId: member.userId,
      firstName: member.user.profile?.firstName || '',
      lastName: member.user.profile?.lastName || '',
      name: `${member.user.profile?.firstName || ''} ${member.user.profile?.lastName || ''}`.trim() || member.user.email,
      email: member.user.email,
      phone: member.user.phone || '',
      role: member.role === 'AGENT' ? 'Agent' : 'Manager',
      status: 'Actif',
      properties: 0,
      joinedAt: member.createdAt
    });
  } catch (error: any) {
    console.error('Error adding agent:', error);
    res.status(500).json({ error: error.message || "Erreur lors de l'ajout de l'agent" });
  }
});

// PUT /api/agency/agents/:id - Update an agent's details and role
router.put('/agents/:id', requireAuth, requireOwnerOrAgency, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const agency = await getUserAgency(userId);
    const { id } = req.params;
    const { firstName, lastName, phone, role, status } = req.body;

    if (!agency) {
      return res.status(404).json({ error: 'Agence introuvable' });
    }

    // Verify member belongs to this agency
    const member = await prisma.agencyMember.findFirst({
      where: { id, agencyId: agency.id },
      include: { user: { include: { profile: true } } }
    });

    if (!member) {
      return res.status(404).json({ error: 'Agent introuvable dans votre agence' });
    }

    // Update user and profile in transaction
    const targetUserId = member.userId;
    const memberRole = role === 'Manager' ? Role.AGENCY : Role.AGENT;
    const memberStatus = status === 'Actif' ? UserStatus.ACTIVE : UserStatus.INACTIVE;

    await prisma.$transaction(async (tx) => {
      // Update AgencyMember role & status
      await tx.agencyMember.update({
        where: { id },
        data: {
          role: memberRole,
          status: memberStatus
        }
      });

      // Update phone if provided
      if (phone !== undefined) {
        await tx.user.update({
          where: { id: targetUserId },
          data: { phone }
        });
      }

      // Update Profile
      if (firstName !== undefined || lastName !== undefined) {
        await tx.profile.upsert({
          where: { userId: targetUserId },
          create: {
            userId: targetUserId,
            firstName: firstName || '',
            lastName: lastName || ''
          },
          update: {
            firstName: firstName !== undefined ? firstName : member.user.profile?.firstName || '',
            lastName: lastName !== undefined ? lastName : member.user.profile?.lastName || ''
          }
        });
      }
    });

    // Fetch updated
    const updatedMember = await prisma.agencyMember.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
            _count: { select: { properties: true } }
          }
        }
      }
    });

    if (!updatedMember) {
      return res.status(404).json({ error: 'Agent introuvable après mise à jour' });
    }

    res.json({
      id: updatedMember.id,
      userId: updatedMember.userId,
      firstName: updatedMember.user.profile?.firstName || '',
      lastName: updatedMember.user.profile?.lastName || '',
      name: `${updatedMember.user.profile?.firstName || ''} ${updatedMember.user.profile?.lastName || ''}`.trim() || updatedMember.user.email,
      email: updatedMember.user.email,
      phone: updatedMember.user.phone || '',
      role: updatedMember.role === 'AGENT' ? 'Agent' : 'Manager',
      status: updatedMember.status === 'ACTIVE' ? 'Actif' : 'En attente',
      properties: updatedMember.user._count?.properties || 0,
      joinedAt: updatedMember.createdAt
    });
  } catch (error: any) {
    console.error('Error updating agent:', error);
    res.status(500).json({ error: error.message || "Erreur lors de la modification de l'agent" });
  }
});

// DELETE /api/agency/agents/:id - Remove an agent from agency
router.delete('/agents/:id', requireAuth, requireOwnerOrAgency, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const agency = await getUserAgency(userId);
    const { id } = req.params;

    if (!agency) {
      return res.status(404).json({ error: 'Agence introuvable' });
    }

    const member = await prisma.agencyMember.findFirst({
      where: { id, agencyId: agency.id }
    });

    if (!member) {
      return res.status(404).json({ error: 'Agent introuvable' });
    }

    await prisma.agencyMember.delete({ where: { id } });
    res.json({ message: 'Agent retiré avec succès' });
  } catch (error: any) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de l\'agent' });
  }
});

// GET /api/agency/leads - Real leads for the agency or owner
router.get('/leads', requireAuth, requireOwnerOrAgency, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const isAgency = req.role === 'AGENCY';
    const agencyId = req.agencyId || req.user.agency?.id;

    const propertyWhere: any = isAgency
      ? (agencyId ? { OR: [{ agencyId }, { ownerId: userId }] } : { ownerId: userId })
      : { ownerId: userId };

    const properties = await prisma.property.findMany({
      where: propertyWhere,
      select: { id: true, title: true, transactionType: true, price: true, city: true }
    });

    const propertyIds = properties.map(p => p.id);

    if (propertyIds.length === 0) {
      return res.json([]);
    }

    // Fetch visits for these properties
    const visits = await prisma.visit.findMany({
      where: { propertyId: { in: propertyIds } },
      include: {
        requester: {
          include: { profile: true }
        },
        property: {
          select: { id: true, title: true, transactionType: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Format leads
    const leads = visits.map((v: any) => {
      const requesterName = v.requester.profile 
        ? `${v.requester.profile.firstName || ''} ${v.requester.profile.lastName || ''}`.trim()
        : '';
      
      let statusLabel = 'Nouveau';
      if (v.status === 'CONFIRMED') statusLabel = 'Visite planifiée';
      else if (v.status === 'COMPLETED') statusLabel = 'Conclu';
      else if (v.status === 'PENDING') statusLabel = 'En attente';
      else if (v.status === 'CANCELLED') statusLabel = 'Annulé';

      return {
        id: v.id,
        name: requesterName || v.requester.email.split('@')[0],
        email: v.requester.email,
        phone: v.requester.phone || '',
        avatar: v.requester.profile?.avatar || '',
        property: v.property.title,
        propertyId: v.property.id,
        type: v.property.transactionType === 'SALE' ? 'Vente' : 'Location',
        status: statusLabel,
        date: v.createdAt,
        visitDate: v.date
      };
    });

    res.json(leads);
  } catch (error: any) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Erreur lors du chargement des prospects' });
  }
});

export default router;
