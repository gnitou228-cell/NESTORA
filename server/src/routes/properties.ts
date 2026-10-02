import { Router } from 'express';
import { prisma } from '../index';
import { requireAuth, requireOwnerOrAgency } from '../middleware/auth';
import { PropertyStatus } from '@prisma/client';

const router = Router();

// POST /api/properties - Create a new property
router.post('/', requireAuth, requireOwnerOrAgency, async (req, res) => {
  try {
    const {
      title,
      description,
      transactionType,
      propertyType,
      price,
      currency,
      surface,
      bedrooms,
      bathrooms,
      countryId,
      regionId,
      cityId,
      neighborhoodId,
      address,
      latitude,
      longitude,
      images, // array of strings (URLs)
      amenities // array of strings (Amenity names or IDs)
    } = req.body;

    // Validate required fields
    if (!title || !description || !transactionType || !propertyType || !price || !countryId || !regionId || !cityId) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires' });
    }

    if (price < 0) {
      return res.status(400).json({ message: 'Le prix ne peut pas être négatif' });
    }

    // Prepare data
    const propertyData: any = {
      title,
      description,
      transactionType,
      propertyType,
      price: parseFloat(price),
      currency: currency || 'XOF',
      surface: surface ? parseFloat(surface) : null,
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      countryId,
      regionId,
      cityId,
      neighborhoodId: neighborhoodId || null,
      address: address || null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      ownerId: req.user.id,
      status: PropertyStatus.PUBLISHED, // Direct publish for now
    };

    if (req.role === 'AGENCY' && req.agencyId) {
      propertyData.agencyId = req.agencyId;
    }

    // Insert property
    const property = await prisma.property.create({
      data: propertyData
    });

    // Handle Images
    if (images && Array.isArray(images) && images.length > 0) {
      const imageRecords = images.map((url: string, index: number) => ({
        propertyId: property.id,
        url,
        position: index
      }));
      await prisma.propertyImage.createMany({
        data: imageRecords
      });
    }

    // Handle Amenities (Optional for now, assuming array of strings)
    if (amenities && Array.isArray(amenities) && amenities.length > 0) {
      for (const amenityName of amenities) {
        // Find or create amenity
        let amenity = await prisma.amenity.findUnique({ where: { name: amenityName } });
        if (!amenity) {
          amenity = await prisma.amenity.create({ data: { name: amenityName } });
        }
        await prisma.propertyAmenity.create({
          data: {
            propertyId: property.id,
            amenityId: amenity.id
          }
        });
      }
    }

    // Fetch the complete property to return
    const completeProperty = await prisma.property.findUnique({
      where: { id: property.id },
      include: {
        images: true,
        amenities: { include: { amenity: true } },
        country: true,
        city: true
      }
    });

    res.status(201).json(completeProperty);
  } catch (error: any) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Erreur lors de la création de la propriété', error: error.message });
  }
});

// GET /api/properties/my - Get properties for the current user
router.get('/my', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const isAgency = req.role === 'AGENCY';
    const agencyId = req.agencyId || req.user.agency?.id;

    const whereClause: any = isAgency
      ? (agencyId ? { OR: [{ agencyId }, { ownerId: userId }] } : { ownerId: userId })
      : { ownerId: userId };

    const properties = await prisma.property.findMany({
      where: whereClause,
      include: {
        images: {
          orderBy: { position: 'asc' },
          take: 1
        },
        city: true,
        country: true,
        boosts: {
          where: { status: 'ACTIVE', endDate: { gt: new Date() } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(properties);
  } catch (error: any) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des propriétés' });
  }
});

// GET /api/properties/map - Map specific search
router.get('/map', async (req, res) => {
  try {
    const {
      countryId,
      regionId,
      cityId,
      neighborhoodId,
      transactionType,
      propertyType,
      minPrice,
      maxPrice,
      minBedrooms,
      minArea,
      bounds, // format: "swLat,swLng,neLat,neLng"
      latitude,
      longitude,
      radius // in kilometers
    } = req.query;

    const where: any = { 
      status: PropertyStatus.PUBLISHED,
      latitude: { not: null },
      longitude: { not: null }
    };

    if (countryId) where.countryId = String(countryId);
    if (regionId) where.regionId = String(regionId);
    if (cityId) where.cityId = String(cityId);
    if (neighborhoodId) where.neighborhoodId = String(neighborhoodId);
    if (transactionType) where.transactionType = String(transactionType);
    if (propertyType) where.propertyType = String(propertyType);

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }
    if (minBedrooms) where.bedrooms = { gte: parseInt(String(minBedrooms)) };
    if (minArea) where.surface = { gte: parseFloat(String(minArea)) };

    // Bounds filtering
    if (bounds) {
      const [swLat, swLng, neLat, neLng] = String(bounds).split(',').map(parseFloat);
      if (!isNaN(swLat) && !isNaN(swLng) && !isNaN(neLat) && !isNaN(neLng)) {
        where.latitude = { gte: swLat, lte: neLat };
        where.longitude = { gte: swLng, lte: neLng };
      }
    }

    const properties = await prisma.property.findMany({
      where,
      take: 500, // Limit to 500 for map performance
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
        propertyType: true,
        transactionType: true,
        latitude: true,
        longitude: true,
        surface: true,
        bedrooms: true,
        city: { select: { name: true } },
        neighborhood: { select: { name: true } },
        images: { orderBy: { position: 'asc' }, take: 1, select: { url: true } }
      }
    });

    // Handle Radius filtering in JS since Prisma doesn't support PostGIS directly out of the box without raw query
    let filteredProperties = properties;
    if (latitude && longitude && radius) {
      const lat = parseFloat(String(latitude));
      const lng = parseFloat(String(longitude));
      const r = parseFloat(String(radius)); // in km

      if (!isNaN(lat) && !isNaN(lng) && !isNaN(r)) {
        filteredProperties = properties.filter(p => {
          if (!p.latitude || !p.longitude) return false;
          // Haversine formula
          const R = 6371; // Radius of earth in km
          const dLat = (p.latitude - lat) * (Math.PI/180);
          const dLon = (p.longitude - lng) * (Math.PI/180);
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat * (Math.PI/180)) * Math.cos(p.latitude * (Math.PI/180)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
          const distance = R * c;
          return distance <= r;
        });
      }
    }

    res.json(filteredProperties);
  } catch (error: any) {
    console.error('Error in map search:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des propriétés pour la carte', error: error.message });
  }
});

// GET /api/properties/search - Search and filter properties
router.get('/search', async (req, res) => {
  try {
    const {
      q,
      countryId,
      regionId,
      cityId,
      neighborhoodId,
      transactionType,
      propertyType,
      minPrice,
      maxPrice,
      minBedrooms,
      minBathrooms,
      minArea,
      maxArea,
      amenities,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const where: any = { status: PropertyStatus.PUBLISHED };

    if (q) {
      where.OR = [
        { title: { contains: String(q), mode: 'insensitive' } },
        { description: { contains: String(q), mode: 'insensitive' } },
        { city: { name: { contains: String(q), mode: 'insensitive' } } },
        { neighborhood: { name: { contains: String(q), mode: 'insensitive' } } },
      ];
    }

    if (countryId) where.countryId = String(countryId);
    if (regionId) where.regionId = String(regionId);
    if (cityId) where.cityId = String(cityId);
    if (neighborhoodId) where.neighborhoodId = String(neighborhoodId);
    
    if (transactionType) where.transactionType = String(transactionType);
    if (propertyType) where.propertyType = String(propertyType);

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(String(minPrice));
      if (maxPrice) where.price.lte = parseFloat(String(maxPrice));
    }

    if (minBedrooms) where.bedrooms = { gte: parseInt(String(minBedrooms)) };
    if (minBathrooms) where.bathrooms = { gte: parseInt(String(minBathrooms)) };

    if (minArea || maxArea) {
      where.surface = {};
      if (minArea) where.surface.gte = parseFloat(String(minArea));
      if (maxArea) where.surface.lte = parseFloat(String(maxArea));
    }

    if (amenities) {
      const amenityIds = String(amenities).split(',');
      const andConditions = amenityIds.map(id => ({
        amenities: { some: { amenityId: id } }
      }));
      
      if (where.AND) {
        where.AND.push(...andConditions);
      } else {
        where.AND = andConditions;
      }
    }

    let orderBy: any = { createdAt: 'desc' };
    
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'area_asc') orderBy = { surface: 'asc' };
    if (sort === 'area_desc') orderBy = { surface: 'desc' };
    if (sort === 'newest') orderBy = { createdAt: 'desc' };

    const pageNum = parseInt(String(page)) > 0 ? parseInt(String(page)) : 1;
    const limitNum = parseInt(String(limit)) > 0 ? parseInt(String(limit)) : 20;
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limitNum,
        include: {
          images: { orderBy: { position: 'asc' }, take: 1 },
          city: true,
          neighborhood: true,
          boosts: {
            where: { status: 'ACTIVE', endDate: { gt: new Date() } }
          }
        }
      }),
      prisma.property.count({ where })
    ]);

    res.json({
      properties,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });

  } catch (error: any) {
    console.error('Error in search:', error);
    res.status(500).json({ message: 'Erreur lors de la recherche des propriétés', error: error.message });
  }
});

// GET /api/properties/:id - Get a specific property
router.get('/:id', async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: String(req.params.id) },
      include: {
        images: { orderBy: { position: 'asc' } },
        amenities: { include: { amenity: true } },
        country: true,
        region: true,
        city: true,
        neighborhood: true,
        owner: {
          include: { profile: true }
        },
        agency: true
      }
    });

    if (property) {
      // Increment views asynchronously
      prisma.property.update({
        where: { id: property.id },
        data: { views: { increment: 1 } }
      }).catch(err => console.error("Could not increment views", err));
    }

    if (!property) {
      return res.status(404).json({ message: 'Propriété introuvable' });
    }

    if (property.status !== 'PUBLISHED') {
      // In a real app we'd check if req.user.id === property.ownerId, 
      // but this is a public endpoint right now.
      return res.status(404).json({ message: 'Cette annonce n\'est pas disponible publiquement.' });
    }

    res.json(property);
  } catch (error: any) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de la propriété' });
  }
});

// DELETE /api/properties/:id - Delete a property
router.delete('/:id', requireAuth, requireOwnerOrAgency, async (req, res) => {
  try {
    const property = await prisma.property.findUnique({
      where: { id: String(req.params.id) }
    });

    if (!property) {
      return res.status(404).json({ message: 'Propriété introuvable' });
    }

    // Verify ownership
    if (property.ownerId !== req.user.id && req.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Vous n\'êtes pas autorisé à supprimer cette propriété' });
    }

    await prisma.property.delete({
      where: { id: String(req.params.id) }
    });

    res.json({ message: 'Propriété supprimée avec succès' });
  } catch (error: any) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
});

export default router;
