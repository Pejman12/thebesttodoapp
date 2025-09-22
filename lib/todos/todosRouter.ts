import { createHash } from "node:crypto";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { files, todos } from "@/lib/db/schema";
import { protectedProcedure, router } from "@/lib/trpc/init";

const MAX_FILE_SIZE = 1024 * 1024 * 5;

function createHashName(name: string) {
  const hashedName = createHash("sha256").update(name).digest("hex");
  const extension = /\S+\.(\S+)/.exec(name)?.pop() ?? "bin";
  return `${hashedName}.${extension}`;
}

const toPojo = (formData: FormData) => {
  const filesKey = "files";
  const formEntries = formData.entries().reduce(
    (prev, curr) => {
      const [key, value] = curr;
      if (key === "text") {
        prev[key] = z.string().min(1).parse(value);
      } else if (key === "files[]") {
        if (!prev[filesKey]) prev[filesKey] = [];
        if (value instanceof File && value.size <= MAX_FILE_SIZE) {
          prev[filesKey].push(value);
        }
      }
      return prev;
    },
    {} as { text: string; files?: File[] },
  );
  if (!formEntries.text) {
    throw new TRPCError({
      message: "Todo must contain text",
      code: "BAD_REQUEST",
    });
  }
  return formEntries;
};

export const todosRouter = router({
  getAll: protectedProcedure.query(({ctx}) =>
    ctx.db.query.todos.findMany({
      with: {
        files: true,
      },
      where: (todos, {eq}) => eq(todos.userId, ctx.auth.userId),
    }),
  ),

  create: protectedProcedure
  .input(z.instanceof(FormData).transform(toPojo))
  .mutation(async ({ctx, input}) => {
    const userId = ctx.auth.userId;
    let filenames: string[] = [];
    if (input.files) {
      filenames = await Promise.all(
        input.files.map(async (file) => {
          const filename = createHashName(`${userId}/${file.name}`);
          await ctx.filestore.put(filename, file);
          return filename;
        }),
      );
    }

    await ctx.db.transaction(async (tx) => {
      const todoData = await tx
      .insert(todos)
      .values({
        userId: ctx.auth.userId,
        text: input.text,
      })
      .returning();
      const todoId = todoData[0].id;
      await Promise.all(
        filenames.map((filename) =>
          tx.insert(files).values({
            todoId,
            name: filename,
          }),
        ),
      );
    });
  }),

  update: protectedProcedure
  .input(z.object({id: z.number(), done: z.boolean()}))
  .mutation(async ({ctx, input}) => {
    await ctx.db.transaction(async (tx) => {
      await tx
      .update(todos)
      .set({done: input.done})
      .where(eq(todos.id, input.id));
    });
  }),

  delete: protectedProcedure
  .input(z.object({id: z.number()}))
  .mutation(async ({ctx, input}) => {
    const filenames = await ctx.db.transaction(async (tx) => {
      const filesData = await tx.query.files.findMany({
        columns: {
          id: true,
          name: true,
        },
        where: (files, {eq}) => eq(files.todoId, input.id),
      });
      await tx.delete(todos).where(eq(todos.id, input.id));
      return filesData.map((file) => file.name);
    });
    await Promise.all(
      filenames.map((filename) => ctx.filestore.delete(filename)),
    );
  }),
});
