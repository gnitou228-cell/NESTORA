/**
 * NESTORA — Configuration Officielle de Monétisation
 * 
 * ⚠️  Ce fichier ne contient QUE des données d'affichage (UI).
 *     Les PRIX RÉELS sont contrôlés côté backend/base de données.
 *     Ne jamais envoyer un prix depuis le frontend comme source de vérité.
 *     Toujours envoyer un planId et laisser le backend calculer le montant.
 */

export type Currency = 'FCFA';

// ── Tarifs officiels (affichage UI uniquement) ───────────────────────────────

export const PLAN_CODES = {
  // Propriétaire
  OWNER_PRO: 'OWNER_PRO',

  // Agences
  AGENCY_STARTER: 'AGENCY_STARTER',
  AGENCY_PRO: 'AGENCY_PRO',
  AGENCY_BUSINESS: 'AGENCY_BUSINESS',

  // Demandes prioritaires (Chercheur)
  PRIORITY_7D: 'PRIORITY_7D',
  PRIORITY_15D: 'PRIORITY_15D',
  PRIORITY_30D: 'PRIORITY_30D',

  // Boosts
  BOOST_3D: 'BOOST_3D',
  BOOST_7D: 'BOOST_7D',
  BOOST_15D: 'BOOST_15D',
  BOOST_30D: 'BOOST_30D',
} as const;

export type PlanCode = typeof PLAN_CODES[keyof typeof PLAN_CODES];

// ── Formateur de prix ─────────────────────────────────────────────────────────
export const formatPrice = (amount: number, currency: Currency = 'FCFA'): string => {
  return `${new Intl.NumberFormat('fr-FR').format(amount)} ${currency}`;
};

// ── Plans d'abonnement (données UI seulement) ─────────────────────────────────
export const SUBSCRIPTION_PLANS_UI = {
  /** NESTORA Pro — Propriétaire individuel */
  owner: [
    {
      code: PLAN_CODES.OWNER_PRO,
      name: 'NESTORA Pro',
      targetRole: 'OWNER',
      price: 3000,
      currency: 'FCFA' as Currency,
      duration: 30,
      popular: true,
      features: [
        'Statistiques avancées (vues, contacts, favoris)',
        'Accès aux demandes de logement compatibles',
        'Badge Pro visible sur vos annonces',
        'Outils de gestion et suivi des prospects',
        'Avantages sur les Boosts',
        'Messagerie prioritaire',
      ],
    },
  ],

  /** Abonnements Agence */
  agency: [
    {
      code: PLAN_CODES.AGENCY_STARTER,
      name: 'Agence Starter',
      targetRole: 'AGENCY',
      price: 7500,
      currency: 'FCFA' as Currency,
      duration: 30,
      popular: false,
      features: [
        'Profil agence professionnel',
        'Catalogue d\'annonces illimité',
        'Gestion des agents',
        'Accès aux demandes de logement compatibles',
        'Gestion des prospects',
        'Statistiques de base',
        'Messagerie',
        'Badge Agence',
      ],
    },
    {
      code: PLAN_CODES.AGENCY_PRO,
      name: 'Agence Pro',
      targetRole: 'AGENCY',
      price: 15000,
      currency: 'FCFA' as Currency,
      duration: 30,
      popular: true,
      features: [
        'Tout Starter inclus',
        'Plus d\'agents et d\'annonces',
        'Statistiques avancées',
        'Gestion avancée des prospects',
        'Meilleure visibilité dans les résultats',
        'Avantages Boost inclus',
      ],
    },
    {
      code: PLAN_CODES.AGENCY_BUSINESS,
      name: 'Agence Business',
      targetRole: 'AGENCY',
      price: 30000,
      currency: 'FCFA' as Currency,
      duration: 30,
      popular: false,
      features: [
        'Tout Pro inclus',
        'Limites maximales d\'agents et d\'annonces',
        'Gestion avancée des équipes',
        'Statistiques complètes et exports',
        'Gestion avancée des leads',
        'Priorité support',
        'Visibilité maximale',
      ],
    },
  ],
} as const;

/** Plans de demande prioritaire pour Chercheurs */
export const PRIORITY_PLANS_UI = [
  {
    code: PLAN_CODES.PRIORITY_7D,
    name: '7 jours',
    duration: 7,
    price: 1000,
    currency: 'FCFA' as Currency,
    popular: false,
  },
  {
    code: PLAN_CODES.PRIORITY_15D,
    name: '15 jours',
    duration: 15,
    price: 1500,
    currency: 'FCFA' as Currency,
    popular: true,
  },
  {
    code: PLAN_CODES.PRIORITY_30D,
    name: '30 jours',
    duration: 30,
    price: 2500,
    currency: 'FCFA' as Currency,
    popular: false,
  },
];

/** Plans Boost d'annonce */
export const BOOST_PLANS_UI = [
  {
    code: PLAN_CODES.BOOST_3D,
    name: 'Boost 3 jours',
    duration: 3,
    price: 1000,
    currency: 'FCFA' as Currency,
    popular: false,
  },
  {
    code: PLAN_CODES.BOOST_7D,
    name: 'Boost 7 jours',
    duration: 7,
    price: 2500,
    currency: 'FCFA' as Currency,
    popular: true,
  },
  {
    code: PLAN_CODES.BOOST_15D,
    name: 'Boost 15 jours',
    duration: 15,
    price: 5000,
    currency: 'FCFA' as Currency,
    popular: false,
  },
  {
    code: PLAN_CODES.BOOST_30D,
    name: 'Boost 30 jours',
    duration: 30,
    price: 8000,
    currency: 'FCFA' as Currency,
    popular: false,
  },
];

/** Ce qui est gratuit — pour affichage UI */
export const FREE_FEATURES = {
  seeker: [
    'Recherche de logement illimitée',
    'Consultation de toutes les annonces',
    'Gestion des favoris',
    'Contact direct propriétaire/agence',
    'Demande de visite',
    'Publication de demande de logement',
    'Matching avec les annonces compatibles',
  ],
  owner: [
    'Publication d\'annonces',
    'Réception de messages',
    'Gestion des demandes de visite',
    'Accès basique aux demandes de logement',
  ],
} as const;

/** Moyens de paiement disponibles */
export const PAYMENT_PROVIDERS = [
  { id: 'Orange Money', label: 'Orange Money', icon: '🟠' },
  { id: 'Moov Money', label: 'Moov Money', icon: '🔵' },
  { id: 'Wave', label: 'Wave', icon: '🌊' },
  { id: 'MTN Mobile Money', label: 'MTN Mobile Money', icon: '💛' },
  { id: 'Carte Bancaire', label: 'Carte Bancaire', icon: '💳' },
] as const;
