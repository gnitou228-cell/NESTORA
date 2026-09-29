import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findFirst(); // Just get the first user
  if (user) {
    console.log('Found user:', user.id, user.role);
    
    // Update role to OWNER
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'OWNER' }
    });
    
    console.log('User role updated to OWNER');
  } else {
    console.log('No users found');
  }
}

run();
