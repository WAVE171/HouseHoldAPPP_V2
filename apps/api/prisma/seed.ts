import { PrismaClient, Role } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcryptjs';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://household:household_secret@localhost:5432/household_db?schema=public';

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed (clean UAT)...');

  // ============================================
  // Create SUPER ADMIN user (System Administrator)
  // ============================================
  const superAdminPassword = await bcrypt.hash('SuperAdmin@2026', 10);

  // Check if super admin already exists
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: 'superadmin@householdhero.com' },
  });

  if (!existingSuperAdmin) {
    const superAdmin = await prisma.user.create({
      data: {
        email: 'superadmin@householdhero.com',
        password: superAdminPassword,
        role: Role.SUPER_ADMIN,
      },
    });

    // Create super admin profile (without household)
    await prisma.userProfile.create({
      data: {
        userId: superAdmin.id,
        firstName: 'Super',
        lastName: 'Administrator',
        language: 'en',
        timezone: 'UTC',
      },
    });

    console.log('✅ Super Admin created: superadmin@householdhero.com / SuperAdmin@2026');
  } else {
    console.log('ℹ️ Super Admin already exists, skipping...');
  }

  // ============================================
  // Create regular admin user with household
  // ============================================
  const adminPassword = await bcrypt.hash('admin123', 10);

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@household.com' },
  });

  let household;
  if (!existingAdmin) {
    household = await prisma.household.create({
      data: {
        name: 'My Household',
        creator: {
          create: {
            email: 'admin@household.com',
            password: adminPassword,
            role: Role.ADMIN,
          },
        },
      },
      include: { creator: true },
    });

    // Create admin profile
    await prisma.userProfile.create({
      data: {
        userId: household.creatorId,
        firstName: 'Admin',
        lastName: 'User',
        householdId: household.id,
        language: 'pt-PT',
        timezone: 'Africa/Luanda',
      },
    });

    console.log('✅ Household Admin created: admin@household.com / admin123');
  } else {
    console.log('ℹ️ Household Admin already exists, skipping...');
    // Get existing household
    const profile = await prisma.userProfile.findUnique({
      where: { userId: existingAdmin.id },
    });
    if (profile?.householdId) {
      household = await prisma.household.findUnique({
        where: { id: profile.householdId },
      });
    }
  }

  // Create default inventory categories (only if household exists and categories don't)
  if (household) {
    const existingCategories = await prisma.inventoryCategory.count({
      where: { householdId: household.id },
    });

    if (existingCategories === 0) {
      await prisma.inventoryCategory.createMany({
        data: [
          { name: 'Pantry', icon: 'package', color: '#8B4513', householdId: household.id },
          { name: 'Refrigerator', icon: 'snowflake', color: '#4169E1', householdId: household.id },
          { name: 'Freezer', icon: 'thermometer', color: '#00CED1', householdId: household.id },
          { name: 'Cleaning', icon: 'spray', color: '#32CD32', householdId: household.id },
          { name: 'Bathroom', icon: 'bath', color: '#9370DB', householdId: household.id },
        ],
      });
      console.log('✅ Default inventory categories created');
    } else {
      console.log('ℹ️ Inventory categories already exist, skipping...');
    }
  }

  console.log('\n🎉 Clean UAT database seed completed!');
  console.log('\n📋 Login credentials:');
  console.log('  ┌─────────────────────────────────────────────────────────────┐');
  console.log('  │ SUPER ADMIN (System Administrator)                          │');
  console.log('  │   Email:    superadmin@householdhero.com                    │');
  console.log('  │   Password: SuperAdmin@2026                                 │');
  console.log('  │   Access:   Full platform access, manage all households     │');
  console.log('  ├─────────────────────────────────────────────────────────────┤');
  console.log('  │ HOUSEHOLD ADMIN                                             │');
  console.log('  │   Email:    admin@household.com                             │');
  console.log('  │   Password: admin123                                        │');
  console.log('  │   Access:   Manage single household                         │');
  console.log('  └─────────────────────────────────────────────────────────────┘');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
