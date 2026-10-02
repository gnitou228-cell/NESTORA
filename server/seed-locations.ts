import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const countries = [
  { name: 'Togo', code: 'TG', phoneCode: '+228', currency: 'XOF', currencySymbol: 'FCFA', regions: ['Maritime', 'Plateaux', 'Centrale', 'Kara', 'Savanes'] },
  { name: 'Bénin', code: 'BJ', phoneCode: '+229', currency: 'XOF', currencySymbol: 'FCFA', regions: ['Littoral', 'Atlantique', 'Ouémé', 'Zou', 'Borgou'] },
  { name: 'Côte d\'Ivoire', code: 'CI', phoneCode: '+225', currency: 'XOF', currencySymbol: 'FCFA', regions: ['Abidjan', 'Yamoussoukro', 'Bouaké', 'San-Pédro'] },
  { name: 'Sénégal', code: 'SN', phoneCode: '+221', currency: 'XOF', currencySymbol: 'FCFA', regions: ['Dakar', 'Thiès', 'Diourbel', 'Saint-Louis'] },
  { name: 'Mali', code: 'ML', phoneCode: '+223', currency: 'XOF', currencySymbol: 'FCFA', regions: ['Bamako', 'Sikasso', 'Koulikoro', 'Ségou'] },
  { name: 'Burkina Faso', code: 'BF', phoneCode: '+226', currency: 'XOF', currencySymbol: 'FCFA', regions: ['Centre', 'Hauts-Bassins', 'Centre-Ouest', 'Boucle du Mouhoun'] },
  { name: 'Niger', code: 'NE', phoneCode: '+227', currency: 'XOF', currencySymbol: 'FCFA', regions: ['Niamey', 'Zinder', 'Maradi', 'Tahoua'] },
  { name: 'Guinée', code: 'GN', phoneCode: '+224', currency: 'GNF', currencySymbol: 'FG', regions: ['Conakry', 'Kindia', 'Labé', 'Kankan'] },
  { name: 'Ghana', code: 'GH', phoneCode: '+233', currency: 'GHS', currencySymbol: 'GH₵', regions: ['Greater Accra', 'Ashanti', 'Western', 'Eastern'] },
  { name: 'Nigéria', code: 'NG', phoneCode: '+234', currency: 'NGN', currencySymbol: '₦', regions: ['Lagos', 'Abuja', 'Kano', 'Rivers'] },
  { name: 'Cameroun', code: 'CM', phoneCode: '+237', currency: 'XAF', currencySymbol: 'FCFA', regions: ['Centre', 'Littoral', 'Ouest', 'Nord-Ouest'] },
  { name: 'Gabon', code: 'GA', phoneCode: '+241', currency: 'XAF', currencySymbol: 'FCFA', regions: ['Estuaire', 'Haut-Ogooué', 'Moyen-Ogooué', 'Ogooué-Maritime'] },
  { name: 'Congo', code: 'CG', phoneCode: '+242', currency: 'XAF', currencySymbol: 'FCFA', regions: ['Brazzaville', 'Pointe-Noire', 'Niari', 'Pool'] },
  { name: 'RDC', code: 'CD', phoneCode: '+243', currency: 'CDF', currencySymbol: 'FC', regions: ['Kinshasa', 'Kongo Central', 'Haut-Katanga', 'Nord-Kivu'] },
  { name: 'Tchad', code: 'TD', phoneCode: '+235', currency: 'XAF', currencySymbol: 'FCFA', regions: ['N\'Djamena', 'Logone Occidental', 'Logone Oriental', 'Moyen-Chari'] }
];

async function seed() {
  console.log('Seeding locations...');
  for (const c of countries) {
    let country = await prisma.country.findUnique({ where: { code: c.code } });
    if (!country) {
      country = await prisma.country.create({
        data: {
          name: c.name,
          code: c.code,
          phoneCode: c.phoneCode,
          currency: c.currency,
          currencySymbol: c.currencySymbol,
        }
      });
      console.log(`Created country: ${c.name}`);
    }

    for (const r of c.regions) {
      let region = await prisma.region.findFirst({ where: { name: r, countryId: country.id } });
      if (!region) {
        region = await prisma.region.create({
          data: {
            name: r,
            countryId: country.id
          }
        });
        console.log(`Created region: ${r} for ${c.name}`);
      }
      
      // Add a default "Autre" city for each region to allow custom fallback if needed,
      // but actually we'll handle "Autre" in the frontend.
      let city = await prisma.city.findFirst({ where: { name: 'Capitale / Principale', regionId: region.id } });
      if (!city) {
        await prisma.city.create({
          data: {
            name: 'Capitale / Principale',
            regionId: region.id
          }
        });
      }
    }
  }
  console.log('Locations seeded successfully!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
