import express from 'express';
import { PrismaClient, TransactionType, PropertyType, HousingReqStatus } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

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
            email: true,
            phone: true,
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
      email: req.seeker?.email,
      phone: req.seeker?.phone,
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
router.post('/', requireAuth, async (req: any, res) => {
  try {
    const { propertyType, budget, countryId, regionId, cityId, neighborhoodId, description, customCityName, customNeighborhoodName } = req.body;
    
    let finalCityId = cityId;
    if (customCityName && regionId) {
      const newCity = await prisma.city.create({
        data: { name: customCityName, regionId }
      });
      finalCityId = newCity.id;
    }

    let finalNeighborhoodId = neighborhoodId;
    if (customNeighborhoodName && finalCityId) {
      const newNeigh = await prisma.neighborhood.create({
        data: { name: customNeighborhoodName, cityId: finalCityId }
      });
      finalNeighborhoodId = newNeigh.id;
    }

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
        cityId: finalCityId || undefined,
        neighborhoodId: finalNeighborhoodId || undefined,
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

// Get my requests (authenticated seeker)
router.get('/my', requireAuth, async (req: any, res) => {
  try {
    const requests = await prisma.housingRequest.findMany({
      where: { seekerId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        country: { select: { name: true } },
        region: { select: { name: true } },
        city: { select: { name: true } },
        neighborhood: { select: { name: true } }
      }
    });

    const formatted = requests.map((req: any) => ({
      id: req.id,
      title: req.title,
      status: req.status,
      type: req.transactionType === 'RENT' ? 'Location' : 'Achat',
      propertyType: req.propertyType,
      location: [req.neighborhood?.name, req.city?.name].filter(Boolean).join(', ') || 'Zone non spécifiée',
      budget: req.maxPrice ? `Max ${req.maxPrice.toLocaleString('fr-FR')} CFA` : 'Non défini',
      description: req.description,
      date: new Date(req.createdAt).toLocaleDateString('fr-FR')
    }));

    res.json(formatted);
  } catch (error) {
    console.error('Error fetching my housing requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete my request (authenticated seeker)
router.delete('/:id', requireAuth, async (req: any, res) => {
  try {
    const request = await prisma.housingRequest.findUnique({
      where: { id: req.params.id }
    });
    
    if (!request || request.seekerId !== req.user.id) {
      return res.status(403).json({ message: 'Accès refusé' });
    }
    
    await prisma.housingRequest.delete({
      where: { id: req.params.id }
    });
    
    res.json({ message: 'Demande supprimée' });
  } catch (error) {
    console.error('Error deleting housing request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
