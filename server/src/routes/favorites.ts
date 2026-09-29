import express from 'express';
import { prisma } from '../index';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Get user's favorites
router.get('/', requireAuth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
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

    res.json(favorites);
  } catch (error: any) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des favoris' });
  }
});

// Check if a property is favorited
router.get('/check/:propertyId', requireAuth, async (req, res) => {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId: String(req.params.propertyId)
        }
      }
    });
    res.json({ isFavorite: !!favorite });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur lors de la vérification du favori' });
  }
});

// Add a favorite
router.post('/:propertyId', requireAuth, async (req, res) => {
  try {
    const propertyId = String(req.params.propertyId);

    // Check if property exists and is published
    const property = await prisma.property.findUnique({
      where: { id: propertyId }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété introuvable' });
    }

    if (property.status !== 'PUBLISHED') {
      return res.status(400).json({ message: 'Impossible d\'ajouter cette propriété aux favoris' });
    }

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId
        }
      },
      update: {},
      create: {
        userId: req.user.id,
        propertyId
      }
    });

    res.json(favorite);
  } catch (error: any) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris' });
  }
});

// Remove a favorite
router.delete('/:propertyId', requireAuth, async (req, res) => {
  try {
    const propertyId = String(req.params.propertyId);

    await prisma.favorite.delete({
      where: {
        userId_propertyId: {
          userId: req.user.id,
          propertyId
        }
      }
    });

    res.json({ message: 'Favori retiré' });
  } catch (error: any) {
    // Ignore error if it doesn't exist
    if (error.code === 'P2025') {
      return res.json({ message: 'Favori retiré' });
    }
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du favori' });
  }
});

export default router;
