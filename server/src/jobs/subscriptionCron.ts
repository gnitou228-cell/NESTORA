import cron from 'node-cron';
import { PrismaClient, SubscriptionStatus } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour vérifier et désactiver les abonnements expirés
export const checkExpiredSubscriptions = async () => {
  console.log('Exécution de la tâche planifiée : Vérification des abonnements expirés...');
  try {
    const now = new Date();

    // Trouve tous les abonnements actifs dont la date de fin est passée
    const expiredSubscriptions = await prisma.subscription.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          lt: now, // less than now (expiré)
        },
      },
      include: {
        user: true,
      }
    });

    if (expiredSubscriptions.length === 0) {
      console.log('Aucun abonnement expiré trouvé.');
      return;
    }

    console.log(`${expiredSubscriptions.length} abonnement(s) expiré(s) trouvé(s). Désactivation en cours...`);

    // Met à jour le statut en 'INACTIVE'
    for (const sub of expiredSubscriptions) {
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { status: 'INACTIVE' },
      });

      // Ici on pourrait aussi envoyer un email ou une notification
      // await sendNotification(sub.user.id, "Votre abonnement Premium a expiré. Veuillez le renouveler.");
      console.log(`Abonnement ${sub.id} pour l'utilisateur ${sub.user.email} désactivé avec succès.`);
    }

  } catch (error) {
    console.error('Erreur lors de la vérification des abonnements expirés:', error);
  }
};

// Planifie la tâche pour s'exécuter tous les jours à minuit
export const initCronJobs = () => {
  cron.schedule('0 0 * * *', () => {
    checkExpiredSubscriptions();
  });
  console.log('Tâches planifiées (cron jobs) initialisées.');
};
