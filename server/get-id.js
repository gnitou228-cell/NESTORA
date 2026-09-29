const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.property.findFirst().then(prop => console.log('ID:', prop.id)).finally(() => p.$disconnect());
