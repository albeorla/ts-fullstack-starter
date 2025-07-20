import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Roles
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Administrator with all permissions",
    },
  });

  const userRole = await prisma.role.upsert({
    where: { name: "USER" },
    update: {},
    create: {
      name: "USER",
      description: "Standard user with basic permissions",
    },
  });

  console.log("Created roles:", { adminRole, userRole });

  // Create Permissions
  const manageUsersPermission = await prisma.permission.upsert({
    where: { name: "manage:users" },
    update: {},
    create: {
      name: "manage:users",
      description: "Allows managing users and their roles",
    },
  });

  console.log("Created permissions:", { manageUsersPermission });

  // Assign Permissions to Roles
  const adminPermission = await prisma.rolePermission.upsert({
    where: {
      roleId_permissionId: {
        roleId: adminRole.id,
        permissionId: manageUsersPermission.id,
      },
    },
    update: {},
    create: {
      roleId: adminRole.id,
      permissionId: manageUsersPermission.id,
    },
  });

  console.log("Assigned permissions to roles:", { adminPermission });

  // Create a default admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
    },
  });

  // Assign ADMIN role to the admin user
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  console.log("Created admin user:", adminUser);

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
