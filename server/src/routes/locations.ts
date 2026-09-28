import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get Countries
router.get('/countries', async (req, res) => {
  try {
    const { q } = req.query;
    const where = q ? { name: { contains: String(q), mode: 'insensitive' as any } } : {};
    const countries = await prisma.country.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des pays' });
  }
});

// Get Regions for a country
router.get('/regions', async (req, res) => {
  try {
    const { countryId, q } = req.query;
    if (!countryId) return res.json([]);
    
    const where: any = { countryId: String(countryId) };
    if (q) where.name = { contains: String(q), mode: 'insensitive' };
    
    const regions = await prisma.region.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    res.json(regions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des régions' });
  }
});

// Get Cities for a region
router.get('/cities', async (req, res) => {
  try {
    const { regionId, q } = req.query;
    if (!regionId) return res.json([]);
    
    const where: any = { regionId: String(regionId) };
    if (q) where.name = { contains: String(q), mode: 'insensitive' };
    
    const cities = await prisma.city.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des villes' });
  }
});

// Get Neighborhoods for a city
router.get('/neighborhoods', async (req, res) => {
  try {
    const { cityId, q } = req.query;
    if (!cityId) return res.json([]);
    
    const where: any = { cityId: String(cityId) };
    if (q) where.name = { contains: String(q), mode: 'insensitive' };
    
    const neighborhoods = await prisma.neighborhood.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    res.json(neighborhoods);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des quartiers' });
  }
});

export default router;
