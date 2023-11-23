import { z } from "zod";

import {
  type TRPCContext,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { toggles } from "~/server/db/schema";
import { nanoid } from "nanoid";
import { sql } from "drizzle-orm";
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
    .mutation(async ({ ctx, input }) => {
      const userId = strictUserId(ctx);
      await ctx.db.execute(sql`
        INSERT INTO ${toggles} (id, name, createdById)
        VALUES (${nanoid()}, ${input.name}, ${userId})
      `);
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input: { id } }) => {
      const userId = strictUserId(ctx);
      await ctx.db.execute(sql`
        DELETE FROM ${toggles}
        WHERE id = ${id}
        AND createdById = ${userId}
      `);
    }),
  update: protectedProcedure
    .input(z.object({ id: z.string().min(1), enabled: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const userId = strictUserId(ctx);
      await ctx.db
        .update(toggles)
        .set({ enabled: input.enabled })
        .where(sql`id = ${input.id} AND createdById = ${userId}`)
        .execute();
    }),
  get: protectedProcedure
    .input(z.object({ id: z.string().min(1).optional() }))
    .query(async ({ ctx, input }) => {
      const { id } = input ?? {};
      if (typeof id === "string") {
        const userId = strictUserId(ctx);
        return await ctx.db
          .select()
          .from(toggles)
          .where(sql`id = ${id} AND createdById = ${userId}`)
          .execute();
      }
      return await ctx.db.select().from(toggles).execute();
    }),
});
