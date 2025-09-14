import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import { s3files, todos } from "@/lib/db/schema";
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
        console.log({ formData });
        const filesKey = "files";
        const formEntries = formData.entries().reduce(
          (prev, curr) => {
            const [key, value] = curr;
            console.log({ key, value });
            if (key === "files[]") {
              if (!prev[filesKey]) prev[filesKey] = [];
              if (value instanceof File && value.size <= MAX_FILE_SIZE) {
                console.log("Adding file", value.name);
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
      console.log(JSON.stringify(input, null, 2));
      await db.transaction(async (tx) => {
        const todoData = await tx
          .insert(todos)
          .values({
            userId: ctx.auth.userId,
            text: input.text,
          })
          .returning();
        if (input.files) {
          for (const file of input.files) {
            console.log({ fileName: file.name });
            const [{ id }] = await tx
              .insert(s3files)
              .values({
                todoId: todoData[0].id,
              })
              .returning();
            console.log({ id });
            await ctx.filestore.put(id, file);
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
        const files = await tx
          .select()
          .from(s3files)
          .where(eq(s3files.todoId, input.id));
        await tx.delete(todos).where(eq(todos.id, input.id));
        for (const file of files) {
          await ctx.filestore.delete(file.id);
        }
      });
    }),
});
