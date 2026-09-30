import { Router } from 'express';
import { PrismaClient, ReportCategory } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Create a report
router.post('/', requireAuth, async (req, res) => {
  try {
    const { propertyId, reportedUserId, category, description } = req.body;
    const reporterUserId = (req as any).user.id;

    if (!Object.values(ReportCategory).includes(category)) {
      return res.status(400).json({ error: 'Catégorie invalide' });
    }

    if (!propertyId && !reportedUserId) {
      return res.status(400).json({ error: 'Vous devez spécifier une annonce ou un utilisateur à signaler' });
    }

    const report = await prisma.report.create({
      data: {
        reporterUserId,
        propertyId: propertyId || null,
        reportedUserId: reportedUserId || null,
        category,
        description
      }
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error creating report', error);
    res.status(500).json({ error: 'Erreur lors de la création du signalement' });
  }
});

export default router;
