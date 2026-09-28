import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const africanCountries = [
  { name: 'Algérie', code: 'DZ', phoneCode: '+213', currency: 'DZD', currencySymbol: 'DA', continent: 'Africa' },
  { name: 'Angola', code: 'AO', phoneCode: '+244', currency: 'AOA', currencySymbol: 'Kz', continent: 'Africa' },
  { name: 'Bénin', code: 'BJ', phoneCode: '+229', currency: 'XOF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Botswana', code: 'BW', phoneCode: '+267', currency: 'BWP', currencySymbol: 'P', continent: 'Africa' },
  { name: 'Burkina Faso', code: 'BF', phoneCode: '+226', currency: 'XOF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Burundi', code: 'BI', phoneCode: '+257', currency: 'BIF', currencySymbol: 'FBu', continent: 'Africa' },
  { name: 'Cameroun', code: 'CM', phoneCode: '+237', currency: 'XAF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Cap-Vert', code: 'CV', phoneCode: '+238', currency: 'CVE', currencySymbol: 'Esc', continent: 'Africa' },
  { name: 'République centrafricaine', code: 'CF', phoneCode: '+236', currency: 'XAF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Tchad', code: 'TD', phoneCode: '+235', currency: 'XAF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Comores', code: 'KM', phoneCode: '+269', currency: 'KMF', currencySymbol: 'CF', continent: 'Africa' },
  { name: 'République du Congo', code: 'CG', phoneCode: '+242', currency: 'XAF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'République démocratique du Congo', code: 'CD', phoneCode: '+243', currency: 'CDF', currencySymbol: 'FC', continent: 'Africa' },
  { name: 'Côte d’Ivoire', code: 'CI', phoneCode: '+225', currency: 'XOF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Djibouti', code: 'DJ', phoneCode: '+253', currency: 'DJF', currencySymbol: 'Fdj', continent: 'Africa' },
  { name: 'Égypte', code: 'EG', phoneCode: '+20', currency: 'EGP', currencySymbol: '£E', continent: 'Africa' },
  { name: 'Guinée équatoriale', code: 'GQ', phoneCode: '+240', currency: 'XAF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Érythrée', code: 'ER', phoneCode: '+291', currency: 'ERN', currencySymbol: 'Nfk', continent: 'Africa' },
  { name: 'Eswatini', code: 'SZ', phoneCode: '+268', currency: 'SZL', currencySymbol: 'L', continent: 'Africa' },
  { name: 'Éthiopie', code: 'ET', phoneCode: '+251', currency: 'ETB', currencySymbol: 'Br', continent: 'Africa' },
  { name: 'Gabon', code: 'GA', phoneCode: '+241', currency: 'XAF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Gambie', code: 'GM', phoneCode: '+220', currency: 'GMD', currencySymbol: 'D', continent: 'Africa' },
  { name: 'Ghana', code: 'GH', phoneCode: '+233', currency: 'GHS', currencySymbol: 'GH₵', continent: 'Africa' },
  { name: 'Guinée', code: 'GN', phoneCode: '+224', currency: 'GNF', currencySymbol: 'FG', continent: 'Africa' },
  { name: 'Guinée-Bissau', code: 'GW', phoneCode: '+245', currency: 'XOF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Kenya', code: 'KE', phoneCode: '+254', currency: 'KES', currencySymbol: 'KSh', continent: 'Africa' },
  { name: 'Lesotho', code: 'LS', phoneCode: '+266', currency: 'LSL', currencySymbol: 'L', continent: 'Africa' },
  { name: 'Liberia', code: 'LR', phoneCode: '+231', currency: 'LRD', currencySymbol: '$', continent: 'Africa' },
  { name: 'Libye', code: 'LY', phoneCode: '+218', currency: 'LYD', currencySymbol: 'LD', continent: 'Africa' },
  { name: 'Madagascar', code: 'MG', phoneCode: '+261', currency: 'MGA', currencySymbol: 'Ar', continent: 'Africa' },
  { name: 'Malawi', code: 'MW', phoneCode: '+265', currency: 'MWK', currencySymbol: 'MK', continent: 'Africa' },
  { name: 'Mali', code: 'ML', phoneCode: '+223', currency: 'XOF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Mauritanie', code: 'MR', phoneCode: '+222', currency: 'MRU', currencySymbol: 'UM', continent: 'Africa' },
  { name: 'Maurice', code: 'MU', phoneCode: '+230', currency: 'MUR', currencySymbol: '₨', continent: 'Africa' },
  { name: 'Maroc', code: 'MA', phoneCode: '+212', currency: 'MAD', currencySymbol: 'DH', continent: 'Africa' },
  { name: 'Mozambique', code: 'MZ', phoneCode: '+258', currency: 'MZN', currencySymbol: 'MT', continent: 'Africa' },
  { name: 'Namibie', code: 'NA', phoneCode: '+264', currency: 'NAD', currencySymbol: '$', continent: 'Africa' },
  { name: 'Niger', code: 'NE', phoneCode: '+227', currency: 'XOF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Nigeria', code: 'NG', phoneCode: '+234', currency: 'NGN', currencySymbol: '₦', continent: 'Africa' },
  { name: 'Rwanda', code: 'RW', phoneCode: '+250', currency: 'RWF', currencySymbol: 'FRw', continent: 'Africa' },
  { name: 'São Tomé-et-Príncipe', code: 'ST', phoneCode: '+239', currency: 'STN', currencySymbol: 'Db', continent: 'Africa' },
  { name: 'Sénégal', code: 'SN', phoneCode: '+221', currency: 'XOF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Seychelles', code: 'SC', phoneCode: '+248', currency: 'SCR', currencySymbol: '₨', continent: 'Africa' },
  { name: 'Sierra Leone', code: 'SL', phoneCode: '+232', currency: 'SLL', currencySymbol: 'Le', continent: 'Africa' },
  { name: 'Somalie', code: 'SO', phoneCode: '+252', currency: 'SOS', currencySymbol: 'Sh', continent: 'Africa' },
  { name: 'Afrique du Sud', code: 'ZA', phoneCode: '+27', currency: 'ZAR', currencySymbol: 'R', continent: 'Africa' },
  { name: 'Soudan du Sud', code: 'SS', phoneCode: '+211', currency: 'SSP', currencySymbol: '£', continent: 'Africa' },
  { name: 'Soudan', code: 'SD', phoneCode: '+249', currency: 'SDG', currencySymbol: '£', continent: 'Africa' },
  { name: 'Tanzanie', code: 'TZ', phoneCode: '+255', currency: 'TZS', currencySymbol: 'TSh', continent: 'Africa' },
  { name: 'Togo', code: 'TG', phoneCode: '+228', currency: 'XOF', currencySymbol: 'FCFA', continent: 'Africa' },
  { name: 'Tunisie', code: 'TN', phoneCode: '+216', currency: 'TND', currencySymbol: 'DT', continent: 'Africa' },
  { name: 'Ouganda', code: 'UG', phoneCode: '+256', currency: 'UGX', currencySymbol: 'USh', continent: 'Africa' },
  { name: 'Zambie', code: 'ZM', phoneCode: '+260', currency: 'ZMW', currencySymbol: 'ZK', continent: 'Africa' },
  { name: 'Zimbabwe', code: 'ZW', phoneCode: '+263', currency: 'ZWL', currencySymbol: '$', continent: 'Africa' },
];

async function main() {
  console.log('Seeding database with African geography...');
  
  // 1. Clear tables (in order to avoid foreign key issues)
  await prisma.neighborhood.deleteMany();
  await prisma.city.deleteMany();
  await prisma.region.deleteMany();
  await prisma.country.deleteMany();

  // 2. Create Countries
  for (const countryData of africanCountries) {
    await prisma.country.create({ data: countryData });
  }

  const bf = await prisma.country.findUnique({ where: { code: 'BF' } });
  const ci = await prisma.country.findUnique({ where: { code: 'CI' } });
  const sn = await prisma.country.findUnique({ where: { code: 'SN' } });

  if (bf) {
    const centre = await prisma.region.create({ data: { name: 'Centre', countryId: bf.id } });
    const hautsBassins = await prisma.region.create({ data: { name: 'Hauts-Bassins', countryId: bf.id } });
    const centreOuest = await prisma.region.create({ data: { name: 'Centre-Ouest', countryId: bf.id } });

    const ouaga = await prisma.city.create({ data: { name: 'Ouagadougou', regionId: centre.id } });
    await prisma.city.create({ data: { name: 'Bobo-Dioulasso', regionId: hautsBassins.id } });
    await prisma.city.create({ data: { name: 'Koudougou', regionId: centreOuest.id } });

    // Quelques quartiers
    await prisma.neighborhood.create({ data: { name: 'Ouaga 2000', cityId: ouaga.id } });
    await prisma.neighborhood.create({ data: { name: 'ZAD', cityId: ouaga.id } });
    await prisma.neighborhood.create({ data: { name: 'Patte d\'Oie', cityId: ouaga.id } });
  }

  if (ci) {
    const abidjanRegion = await prisma.region.create({ data: { name: 'District Autonome d\'Abidjan', countryId: ci.id } });
    const valleeBandama = await prisma.region.create({ data: { name: 'Vallée du Bandama', countryId: ci.id } });

    const abidjan = await prisma.city.create({ data: { name: 'Abidjan', regionId: abidjanRegion.id } });
    await prisma.city.create({ data: { name: 'Bouaké', regionId: valleeBandama.id } });

    await prisma.neighborhood.create({ data: { name: 'Cocody', cityId: abidjan.id } });
    await prisma.neighborhood.create({ data: { name: 'Marcory', cityId: abidjan.id } });
    await prisma.neighborhood.create({ data: { name: 'Yopougon', cityId: abidjan.id } });
  }
  
  if (sn) {
    const dakarRegion = await prisma.region.create({ data: { name: 'Dakar', countryId: sn.id } });
    const dakar = await prisma.city.create({ data: { name: 'Dakar', regionId: dakarRegion.id } });
    await prisma.neighborhood.create({ data: { name: 'Plateau', cityId: dakar.id } });
    await prisma.neighborhood.create({ data: { name: 'Almadies', cityId: dakar.id } });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
