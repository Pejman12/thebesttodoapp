import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import { protectedProcedure, router } from "@/lib/trpc/init";

export const todosRouter = router({
  getAll: protectedProcedure.query(async ({ctx}) => {
    return await db().query.todos.findMany({
      where: eq(todos.userId, ctx.auth.userId),
    });
  }),

  create: protectedProcedure
  .input(
    z.object({
      text: z.string().min(1),
    }),
  )
  .mutation(async ({ctx, input}) => {
    const userId = ctx.auth.userId;

    await db().transaction(async (tx) => {
      await tx.insert(todos).values({
        userId,
        text: input.text,
      });
    });
  }),

  update: protectedProcedure
  .input(z.object({id: z.number(), done: z.boolean()}))
  .mutation(async ({input}) => {
    await db().transaction(async (tx) => {
      await tx
      .update(todos)
      .set({done: input.done})
      .where(eq(todos.id, input.id));
    });
  }),

  delete: protectedProcedure
  .input(z.object({id: z.number()}))
  .mutation(async ({input}) => {
    await db().transaction(async (tx) => {
      await tx.delete(todos).where(eq(todos.id, input.id));
    });
  }),
});
