export type Currency = 'FCFA' | 'EUR' | 'USD';
export type Country = 'BF' | 'CI' | 'SN' | 'ML' | 'FR';

export interface Plan {
  id: string;
  durationInDays: number;
  label: string;
  price: number;
  isPopular?: boolean;
  isBestValue?: boolean;
}

export const MONETIZATION_CONFIG = {
  defaultCountry: 'BF' as Country,
  defaultCurrency: 'FCFA' as Currency,
  
  countries: [
    { code: 'BF', name: 'Burkina Faso', currency: 'FCFA', taxRate: 0.18 },
    { code: 'CI', name: 'Côte d\'Ivoire', currency: 'FCFA', taxRate: 0.18 },
    { code: 'SN', name: 'Sénégal', currency: 'FCFA', taxRate: 0.18 },
  ],

  paymentProviders: ['Orange Money', 'Moov Money', 'MTN Mobile Money', 'Wave', 'Carte Bancaire'],

  chercheurPlans: [
    { id: 'c_15d', durationInDays: 15, label: '15 jours', price: 2000 },
    { id: 'c_1m', durationInDays: 30, label: '1 mois', price: 3500, isPopular: true },
    { id: 'c_3m', durationInDays: 90, label: '3 mois', price: 8500 },
    { id: 'c_6m', durationInDays: 180, label: '6 mois', price: 15000 },
    { id: 'c_1y', durationInDays: 365, label: '1 an', price: 25000, isBestValue: true },
  ] as Plan[],

  proprietairePlans: [
    { id: 'p_15d', durationInDays: 15, label: '15 jours', price: 3500 },
    { id: 'p_1m', durationInDays: 30, label: '1 mois', price: 5500, isPopular: true },
    { id: 'p_3m', durationInDays: 90, label: '3 mois', price: 12500 },
    { id: 'p_6m', durationInDays: 180, label: '6 mois', price: 22000 },
    { id: 'p_1y', durationInDays: 365, label: '1 an', price: 40000, isBestValue: true },
  ] as Plan[],

  agencePlans: {
    starter: [
      { id: 'a_s_1m', durationInDays: 30, label: '1 mois', price: 15000 },
      { id: 'a_s_3m', durationInDays: 90, label: '3 mois', price: 40000 },
      { id: 'a_s_6m', durationInDays: 180, label: '6 mois', price: 75000 },
      { id: 'a_s_1y', durationInDays: 365, label: '1 an', price: 135000 },
    ],
    pro: [
      { id: 'a_p_1m', durationInDays: 30, label: '1 mois', price: 30000 },
      { id: 'a_p_3m', durationInDays: 90, label: '3 mois', price: 80000, isPopular: true },
      { id: 'a_p_6m', durationInDays: 180, label: '6 mois', price: 150000 },
      { id: 'a_p_1y', durationInDays: 365, label: '1 an', price: 270000 },
    ],
    business: [
      { id: 'a_b_1m', durationInDays: 30, label: '1 mois', price: 60000 },
      { id: 'a_b_3m', durationInDays: 90, label: '3 mois', price: 160000 },
      { id: 'a_b_6m', durationInDays: 180, label: '6 mois', price: 300000 },
      { id: 'a_b_1y', durationInDays: 365, label: '1 an', price: 540000, isBestValue: true },
    ]
  },

  boostPlans: [
    { id: 'b_3d', durationInDays: 3, label: '3 jours', price: 2000 },
    { id: 'b_7d', durationInDays: 7, label: '7 jours', price: 4000, isPopular: true },
    { id: 'b_15d', durationInDays: 15, label: '15 jours', price: 7000 },
    { id: 'b_30d', durationInDays: 30, label: '30 jours', price: 12000, isBestValue: true },
  ] as Plan[],
};

export const formatPrice = (amount: number, currency: Currency = MONETIZATION_CONFIG.defaultCurrency) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: currency === 'FCFA' ? 'XOF' : currency, maximumFractionDigits: 0 })
    .format(amount)
    .replace('XOF', 'FCFA');
};
