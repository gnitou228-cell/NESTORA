import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import locationsRoutes from './routes/locations';
import propertiesRoutes from './routes/properties';
import favoritesRoutes from './routes/favorites';
import visitsRoutes from './routes/visits';
import conversationsRoutes from './routes/conversations';
import dashboardRoutes from './routes/dashboard';
import paymentsRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import reportsRoutes from './routes/reports';
import statsRoutes from './routes/stats';
import housingRequestsRoutes from './routes/housing-requests';
import agencyRoutes from './routes/agency';
import { PrismaClient } from '@prisma/client';
import { initCronJobs } from './jobs/subscriptionCron';

dotenv.config();

const app = express();
export const prisma = new PrismaClient();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/locations', locationsRoutes);
app.use('/api/properties', propertiesRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/housing-requests', housingRequestsRoutes);
app.use('/api/agency', agencyRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Nestora Backend API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Une erreur interne est survenue', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Initialisation des tâches planifiées (cron jobs)
  initCronJobs();
});
