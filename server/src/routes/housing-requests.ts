import express from 'express';
import { PrismaClient, TransactionType, PropertyType, HousingReqStatus } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get all published requests
router.get('/', async (req, res) => {
  try {
    const requests = await prisma.housingRequest.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
      include: {
        seeker: {
          select: { 
            id: true,
            profile: {
              select: { firstName: true, lastName: true }
            }
          },
        },
        country: { select: { name: true } },
        region: { select: { name: true } },
        city: { select: { name: true } },
        neighborhood: { select: { name: true } }
      }
    });

    const formatted = requests.map((req: any) => ({
      id: req.id,
      seekerName: req.seeker?.profile ? `${req.seeker.profile.firstName} ${req.seeker.profile.lastName?.charAt(0)}.` : 'Chercheur',
      seekerId: req.seekerId,
      type: req.transactionType === 'RENT' ? 'Location' : 'Achat',
      propertyType: req.propertyType,
      location: [req.neighborhood?.name, req.city?.name].filter(Boolean).join(', ') || 'Zone non spécifiée',
      budget: req.maxPrice ? `Max ${req.maxPrice.toLocaleString('fr-FR')} CFA` : 'Non défini',
      bedrooms: req.bedrooms ? req.bedrooms.toString() : 'N/A',
      description: req.description,
      date: new Date(req.createdAt).toLocaleDateString('fr-FR')
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching housing requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new request (authenticated)
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { propertyType, budget, countryId, regionId, cityId, neighborhoodId, description } = req.body;
    
    // We assume default RENT if not provided, but usually seekers could want SALE too. Defaulting to RENT for now based on form.
    const newRequest = await prisma.housingRequest.create({
      data: {
        seekerId: req.user.id,
        title: `Recherche ${propertyType}`,
        description,
        transactionType: 'RENT',
        propertyType: propertyType as PropertyType,
        countryId,
        regionId: regionId || undefined,
        cityId: cityId || undefined,
        neighborhoodId: neighborhoodId || undefined,
        maxPrice: budget ? parseFloat(budget) : null,
        status: 'PUBLISHED',
        publishedAt: new Date()
      }
    });

    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating housing request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
