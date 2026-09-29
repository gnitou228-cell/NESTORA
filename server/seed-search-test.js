const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seed() {
  const user = await prisma.user.findFirst({ where: { role: 'OWNER' } }) || await prisma.user.findFirst();
  if (!user) return console.log('No user found');

  const country = await prisma.country.findFirst();
  const region = await prisma.region.findFirst();
  const city = await prisma.city.findFirst();
  
  if (!country || !region || !city) return console.log('Missing locations');

  const neighborhood1 = await prisma.neighborhood.findFirst();
  const neighborhood2 = await prisma.neighborhood.findFirst({ skip: 1 });

  const amenities = await prisma.amenity.findMany();
  
  const propertiesToCreate = [];
  
  for (let i = 1; i <= 25; i++) {
    const isRent = i % 2 === 0;
    const isAppart = i % 3 === 0;
    
    const prop = {
      title: `Propriété Test ${i} - ${isAppart ? 'Appartement' : 'Villa'} ${isRent ? 'à louer' : 'à vendre'}`,
      description: `Description pour la propriété test ${i}. C'est une belle opportunité.`,
      transactionType: isRent ? 'RENT' : 'SALE',
      propertyType: isAppart ? 'APARTMENT' : 'VILLA',
      price: isRent ? 150000 + (i * 10000) : 25000000 + (i * 1000000),
      currency: 'XOF',
      surface: 50 + (i * 5),
      bedrooms: (i % 4) + 1,
      bathrooms: (i % 3) + 1,
      ownerId: user.id,
      countryId: country.id,
      regionId: region.id,
      cityId: city.id,
      neighborhoodId: i % 2 === 0 && neighborhood2 ? neighborhood2.id : neighborhood1?.id || null,
      status: i === 25 ? 'DRAFT' : 'PUBLISHED', // test one draft
    };
    
    propertiesToCreate.push(prop);
  }

  for (const prop of propertiesToCreate) {
    await prisma.property.create({ data: prop });
  }

  console.log('Seeded 25 properties successfully');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
