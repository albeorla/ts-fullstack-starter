import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.user.findMany({ include: { roles: { include: { role: true } } } });
  }),

  setUserRoles: adminProcedure
    .input(z.object({ userId: z.string(), roleNames: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const { userId, roleNames } = input;

      const roles = await ctx.db.role.findMany({
        where: { name: { in: roleNames } },
      });

      if (roles.length !== roleNames.length) {
        throw new Error("One or more roles not found.");
      }

      return ctx.db.$transaction(async (prisma) => {
        await prisma.userRole.deleteMany({
          where: { userId },
        });

        const newUserRoles = roles.map((role) => ({
          userId,
          roleId: role.id,
        }));

        await prisma.userRole.createMany({
          data: newUserRoles,
        });

        return prisma.user.findUnique({
          where: { id: userId },
          include: { roles: { include: { role: true } } },
        });
      });
    }),
});
