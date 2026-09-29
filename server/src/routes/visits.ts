import express from 'express';
import { prisma } from '../index';
import { requireAuth, requireOwnerOrAgency } from '../middleware/auth';

const router = express.Router();

// Get visits I requested
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const visits = await prisma.visit.findMany({
      where: { requesterId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          include: {
            images: { orderBy: { position: 'asc' }, take: 1 },
            city: true,
            neighborhood: true,
          }
        }
      }
    });

    res.json(visits);
  } catch (error: any) {
    console.error('Error fetching my visits:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des visites' });
  }
});

// Get visits requested on my properties (For Owners / Agencies)
router.get('/received', requireAuth, requireOwnerOrAgency, async (req, res) => {
  try {
    const whereClause: any = {};
    if (req.role === 'AGENCY' && req.agencyId) {
      whereClause.property = { agencyId: req.agencyId };
    } else {
      whereClause.property = { ownerId: req.user.id };
    }

    const visits = await prisma.visit.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        requester: {
          include: { profile: true }
        },
        property: {
          include: {
            images: { orderBy: { position: 'asc' }, take: 1 },
            city: true,
          }
        }
      }
    });

    res.json(visits);
  } catch (error: any) {
    console.error('Error fetching received visits:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des demandes reçues' });
  }
});

// Request a visit
router.post('/:propertyId', requireAuth, async (req, res) => {
  try {
    const propertyId = String(req.params.propertyId);
    const { requestedDate, requestedTime, message } = req.body;

    if (!requestedDate || !requestedTime) {
      return res.status(400).json({ message: 'Date et heure sont obligatoires' });
    }

    // Check future date
    const visitDate = new Date(`${requestedDate}T${requestedTime}:00`);
    if (visitDate < new Date()) {
      return res.status(400).json({ message: 'La date de visite doit être dans le futur' });
    }

    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété introuvable' });
    }

    if (property.status !== 'PUBLISHED') {
      return res.status(400).json({ message: 'Propriété non disponible' });
    }

    if (property.ownerId === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas visiter votre propre bien' });
    }

    const visit = await prisma.visit.create({
      data: {
        propertyId,
        requesterId: req.user.id,
        agencyId: property.agencyId,
        requestedDate: new Date(requestedDate),
        requestedTime,
        message,
        status: 'PENDING'
      }
    });

    // Notify owner/agency
    const receiverId = property.ownerId; // Or if it's an agency, maybe notify agency members. For now, ownerId is always populated with the user who created it.
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'NEW_VISIT_REQUEST',
        title: 'Nouvelle demande de visite',
        message: `Quelqu'un a demandé une visite pour ${property.title}`
      }
    });

    res.json(visit);
  } catch (error: any) {
    console.error('Error requesting visit:', error);
    res.status(500).json({ message: 'Erreur lors de la demande de visite' });
  }
});

// Cancel a visit (Requester)
router.patch('/:id/cancel', requireAuth, async (req, res) => {
  try {
    const visitId = String(req.params.id);

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { property: true }
    });

    if (!visit) {
      return res.status(404).json({ message: 'Visite introuvable' });
    }

    if (visit.requesterId !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    if (visit.status === 'CANCELLED' || visit.status === 'COMPLETED' || visit.status === 'DECLINED') {
      return res.status(400).json({ message: 'Cette visite ne peut plus être annulée' });
    }

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: { status: 'CANCELLED' }
    });

    res.json(updatedVisit);
  } catch (error: any) {
    console.error('Error canceling visit:', error);
    res.status(500).json({ message: 'Erreur lors de l\'annulation' });
  }
});

// Update visit status (Owner/Agency)
router.patch('/:id/status', requireAuth, requireOwnerOrAgency, async (req, res) => {
  try {
    const visitId = String(req.params.id);
    const { status } = req.body; // e.g., CONFIRMED, DECLINED

    if (!['CONFIRMED', 'DECLINED'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const visit = await prisma.visit.findUnique({
      where: { id: visitId },
      include: { property: true }
    });

    if (!visit) {
      return res.status(404).json({ message: 'Visite introuvable' });
    }

    // Verify ownership
    if (req.role === 'AGENCY' && req.agencyId) {
      if (visit.property.agencyId !== req.agencyId) return res.status(403).json({ message: 'Non autorisé' });
    } else {
      if (visit.property.ownerId !== req.user.id) return res.status(403).json({ message: 'Non autorisé' });
    }

    const updatedVisit = await prisma.visit.update({
      where: { id: visitId },
      data: { status }
    });

    // Notify requester
    await prisma.notification.create({
      data: {
        userId: visit.requesterId,
        type: 'NEW_VISIT_REQUEST', // Reuse type or create a new one, NEW_VISIT_REQUEST is what we have in enum
        title: `Visite ${status === 'CONFIRMED' ? 'confirmée' : 'refusée'}`,
        message: `Votre demande de visite pour ${visit.property.title} a été ${status === 'CONFIRMED' ? 'confirmée' : 'refusée'}.`
      }
    });

    res.json(updatedVisit);
  } catch (error: any) {
    console.error('Error updating visit status:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour' });
  }
});

export default router;
