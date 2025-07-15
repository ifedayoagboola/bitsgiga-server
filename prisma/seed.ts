import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create store roles
  const storeRoles = ['OWNER', 'ATTENDANT', 'MANAGER'];
  
  for (const roleName of storeRoles) {
    try {
      const existingRole = await prisma.role.findUnique({
        where: { role: roleName }
      });

      if (!existingRole) {
        const role = await prisma.role.create({
          data: { role: roleName }
        });
        console.log(`✅ Created role: ${roleName} (ID: ${role.id})`);
      } else {
        console.log(`⏭️  Role already exists: ${roleName} (ID: ${existingRole.id})`);
      }
    } catch (error) {
      console.error(`❌ Error creating role ${roleName}:`, error);
    }
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 