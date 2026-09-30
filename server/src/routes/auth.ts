import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { Role, UserStatus } from '@prisma/client';
import { requireAuth } from '../middleware/auth';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey_change_in_production';

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { 
      role, email, password, phone, whatsapp, 
      firstName, lastName, 
      countryId, regionId, cityId, neighborhoodId, 
      address, 
      agencyName, description, registrationNumber, agencyManager,
      ownerType
    } = req.body;

    if (!role || !email || !password || !firstName || !lastName || !phone) {
      return res.status(400).json({ message: 'Veuillez remplir tous les champs obligatoires communs.' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({ where: { OR: [{ email }, { phone }] } });
    if (existingUser) {
      return res.status(400).json({ message: 'Un utilisateur avec cet email ou ce téléphone existe déjà.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user and profile transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          role: role as Role,
          status: UserStatus.ACTIVE, // Assuming ACTIVE for now, but emailVerified is false
          profile: {
            create: {
              firstName,
              lastName,
              countryId: countryId || null,
              regionId: regionId || null,
              cityId: cityId || null,
              neighborhoodId: neighborhoodId || null,
              address: address || null,
              bio: ownerType === 'PRO' ? 'Propriétaire Professionnel' : null
            }
          }
        },
        include: { profile: true }
      });

      if (role === 'AGENCY') {
        if (!agencyName) throw new Error("Le nom de l'agence est requis.");
        await tx.agency.create({
          data: {
            ownerUserId: user.id,
            name: agencyName,
            phone: whatsapp || phone,
            email,
            address: address || null,
            countryId: countryId || null,
            regionId: regionId || null,
            cityId: cityId || null,
            neighborhoodId: neighborhoodId || null,
            description: description || null,
            registrationNumber: registrationNumber || null
          }
        });
      }
      return user;
    });

    const token = jwt.sign({ userId: newUser.id, role: newUser.role }, JWT_SECRET);
    res.status(201).json({ token, user: newUser, message: 'Inscription réussie. Veuillez vérifier votre email.' });
  } catch (error: any) {
    res.status(400).json({ message: error.message || 'Erreur lors de l\'inscription' });
  }
});

// Connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true, agency: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    if (user.status === 'BANNED' || user.status === 'SUSPENDED') {
      return res.status(403).json({ message: 'Ce compte est suspendu ou banni.' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'Veuillez utiliser votre fournisseur de connexion (ex: Google) pour ce compte.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    res.json({ token, user });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Me (Get current user)
router.get('/me', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, agency: true }
    });

    if (!user) return res.status(404).json({ message: 'Utilisateur introuvable' });

    res.json({ user });
  } catch (error: any) {
    res.status(401).json({ message: 'Session invalide ou expirée' });
  }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Pour éviter le scanning d'emails, on renvoie un succès même si l'email n'existe pas
      return res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
    }
    // Simulation de l'envoi d'email
    console.log(`[EMAIL] Lien de réinitialisation envoyé à ${email}`);
    res.json({ message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Verify Email
router.post('/verify-email', async (req, res) => {
  try {
    // A implémenter avec un vrai token d'email
    const { email } = req.body;
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true }
    });
    res.json({ message: 'Email vérifié avec succès.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Update Profile
router.put('/profile', requireAuth, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, bio, avatar, countryId, regionId, cityId, neighborhoodId, address } = req.body;

    const updatedUser = await prisma.$transaction(async (tx) => {
      if (phone) {
        const existing = await tx.user.findFirst({ where: { phone, id: { not: userId } } });
        if (existing) throw new Error("Ce numéro de téléphone est déjà utilisé.");
        await tx.user.update({ where: { id: userId }, data: { phone } });
      }

      await tx.profile.upsert({
        where: { userId },
        create: {
          userId, firstName, lastName, bio, avatar, countryId, regionId, cityId, neighborhoodId, address
        },
        update: {
          firstName, lastName, bio, avatar, countryId, regionId, cityId, neighborhoodId, address
        }
      });
      return await tx.user.findUnique({ where: { id: userId }, include: { profile: true, agency: true } });
    });

    res.json({ message: "Profil mis à jour", user: updatedUser });
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Erreur lors de la mise à jour du profil" });
  }
});

export default router;
