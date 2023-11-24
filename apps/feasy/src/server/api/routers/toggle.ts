import { z } from "zod";

import {
  type TRPCContext,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  createToggle,
  deleteToggle,
  updateToggle,
  getToggle,
} from "@feasy/drizzle";
import { TRPCError } from "@trpc/server";

/**
 * Returns the user ID if it exists, otherwise throws a tRPC error
 */
function strictUserId(ctx: TRPCContext): string {
  const userId = ctx.auth.userId;
  if (typeof userId !== "string" || userId.length === 0) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User ID not found. Please log in.",
    });
  }
  return userId;
}

export const toggle = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input: { name } }) => {
      const userId = strictUserId(ctx);
      return await createToggle({
        db: ctx.db,
        name,
        userId,
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      const userId = strictUserId(ctx);
      return await deleteToggle({
        db: ctx.db,
        id,
        userId,
      });
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().min(1), enabled: z.boolean() }))
    .mutation(async ({ ctx, input: { id, enabled } }) => {
      const userId = strictUserId(ctx);
      return await updateToggle({
        db: ctx.db,
        id,
        enabled,
        userId,
      });
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string().min(1).optional() }))
    .query(async ({ ctx, input: { id } }) => {
      const userId = strictUserId(ctx);
      return await getToggle({
        db: ctx.db,
        id,
        userId,
      });
    }),
});
