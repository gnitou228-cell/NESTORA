import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '../index';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

// Extend Express Request to include user and role
declare global {
  namespace Express {
    interface Request {
      user?: any;
      role?: string;
      agencyId?: string;
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentification requise (Header manquant)' });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ message: 'Session invalide ou expirée' });
    }

    // Récupérer l'utilisateur dans la BDD pour avoir son rôle (OWNER, SEEKER, etc.)
    let dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { agency: true }
    });

    if (!dbUser) {
      // Sync user from Supabase to Prisma if it doesn't exist
      const role = user.user_metadata?.role || 'SEEKER';
      const email = user.email || '';
      const firstName = user.user_metadata?.first_name || '';
      const lastName = user.user_metadata?.last_name || '';

      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email,
          role,
          status: 'ACTIVE',
          profile: {
            create: {
              firstName,
              lastName
            }
          }
        },
        include: { agency: true }
      });
    }

    req.user = dbUser;
    req.role = dbUser.role;
    req.agencyId = dbUser.agency?.id;

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Erreur lors de la vérification de l\'authentification' });
  }
};

export const requireOwnerOrAgency = (req: Request, res: Response, next: NextFunction) => {
  if (!req.role || (req.role !== 'OWNER' && req.role !== 'AGENCY' && req.role !== 'ADMIN')) {
    return res.status(403).json({ message: 'Accès refusé. Réservé aux propriétaires et agences.' });
  }
  next();
};
