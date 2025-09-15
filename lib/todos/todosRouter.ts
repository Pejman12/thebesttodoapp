import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { files, todos } from "@/lib/db/schema";
import { protectedProcedure, router } from "@/lib/trpc/init";

const MAX_FILE_SIZE = 1024 * 1024 * 5;

export const todosRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.query.todos.findMany({
      with: {
        s3files: true,
      },
      where: eq(todos.userId, ctx.auth.userId),
    });
  }),

  create: protectedProcedure
    .input(
      z.instanceof(FormData).transform((formData) => {
        const filesKey = "files";
        const formEntries = formData.entries().reduce(
          (prev, curr) => {
            const [key, value] = curr;
            if (key === "files[]") {
              if (!prev[filesKey]) prev[filesKey] = [];
              if (value instanceof File && value.size <= MAX_FILE_SIZE) {
                prev[filesKey].push(value);
              }
            } else if (key === "text") {
              prev[key] = z.string().min(1).parse(value);
            }
            return prev;
          },
          {} as { text: string; files?: File[] },
        );
        if (!formEntries["text"]) {
          throw new Error("Text is required");
        }
        return formEntries;
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;
      await db.transaction(async (tx) => {
        const todoData = await tx
          .insert(todos)
          .values({
            userId: ctx.auth.userId,
            text: input.text,
          })
          .returning();
        const todoId = todoData[0].id;
        if (input.files) {
          for (const file of input.files) {
            await tx.insert(files).values({
              todoId,
              name: file.name,
            });
            await ctx.filestore.put(`${userId}/${todoId}/${file.name}`, file);
          }
        }
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), done: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await db
        .update(todos)
        .set({ done: input.done })
        .where(eq(todos.id, input.id));
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.transaction(async (tx) => {
        const filesData = await tx
          .select()
          .from(files)
          .where(eq(files.todoId, input.id));
        await tx.delete(todos).where(eq(todos.id, input.id));
        for (const file of filesData) {
          await ctx.filestore.delete(
            `${ctx.auth.userId}/${input.id}/${file.name}`,
          );
        }
      });
    }),
});
