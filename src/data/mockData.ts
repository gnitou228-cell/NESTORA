export type Role = 'CHERCHEUR' | 'PROPRIETAIRE' | 'AGENCE';

export const currentUser = {
  id: 'u1',
  name: 'Amadou Traoré',
  avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80',
  location: 'Ouagadougou, Burkina Faso',
  memberSince: 'Mars 2023',
};

export const properties = [
  {
    id: 'p1',
    title: 'Villa moderne à Ouaga 2000',
    location: 'Ouagadougou',
    type: 'À louer',
    price: '350 000 FCFA / mois',
    beds: 4,
    baths: 3,
    area: '300 m²',
    status: 'En ligne',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p2',
    title: 'Appartement meublé à Koulouba',
    location: 'Ouagadougou',
    type: 'À louer',
    price: '250 000 FCFA / mois',
    beds: 2,
    baths: 2,
    area: '120 m²',
    status: 'En ligne',
    image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p3',
    title: 'Maison à Bobo-Dioulasso',
    location: 'Bobo-Dioulasso',
    type: 'À louer',
    price: '180 000 FCFA / mois',
    beds: 3,
    baths: 2,
    area: '200 m²',
    status: 'En attente',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'p4',
    title: 'Terrain à Saaba',
    location: 'Ouagadougou',
    type: 'À vendre',
    price: '75 000 000 FCFA',
    beds: 0,
    baths: 0,
    area: '1000 m²',
    status: 'Expirée',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
  },
];

export const activities = [
  {
    id: 'a1',
    type: 'visit',
    title: 'Nouvelle demande de visite',
    desc: 'Maison à louer - Ouaga 2000',
    time: 'Il y a 2 heures',
  },
  {
    id: 'a2',
    type: 'message',
    title: 'Message reçu',
    desc: 'Appartement 3 pièces - Koulouba',
    time: 'Il y a 4 heures',
  },
  {
    id: 'a3',
    type: 'listing',
    title: 'Annonce publiée',
    desc: 'Studio meublé - Zone du bois',
    time: 'Il y a 1 jour',
  },
  {
    id: 'a4',
    type: 'boost',
    title: 'Boost activé',
    desc: 'Villa 4 chambres - Ouaga 2000',
    time: 'Il y a 2 jours',
  },
];

export const visitRequests = [
  {
    id: 'v1',
    property: 'Villa moderne à Ouaga 2000',
    datetime: '12/04/2025 - 10:30',
    status: 'Confirmée',
  },
  {
    id: 'v2',
    property: 'Appartement meublé à Koulouba',
    datetime: '14/04/2025 - 15:00',
    status: 'En attente',
  },
];

export const invoices = [
  {
    id: 'i1',
    desc: 'Abonnement Standard',
    date: '25/03/2025 - 25/04/2025',
    amount: '2 000 FCFA',
    status: 'Payée',
  },
  {
    id: 'i2',
    desc: 'Boost annonce',
    date: '10/04/2025 - 13/04/2025',
    amount: '1 000 FCFA',
    status: 'Payée',
  },
];

export const chartData = [
  { name: '12/04', vues: 20, contacts: 5 },
  { name: '13/04', vues: 35, contacts: 10 },
  { name: '14/04', vues: 45, contacts: 15 },
  { name: '15/04', vues: 30, contacts: 8 },
  { name: '16/04', vues: 60, contacts: 25 },
  { name: '17/04', vues: 55, contacts: 20 },
  { name: '18/04', vues: 85, contacts: 30 },
];

export const pieData = [
  { name: 'À louer', value: 4, fill: '#0B1F3A' },
  { name: 'À vendre', value: 2, fill: '#C9A227' },
  { name: 'En attente', value: 1, fill: '#f59e0b' },
  { name: 'Expirée', value: 0, fill: '#ef4444' },
];
