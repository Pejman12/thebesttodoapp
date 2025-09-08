import { randomUUID } from "node:crypto";
import { type InferSelectModel, relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp, uuid, } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Todo = InferSelectModel<typeof todos>;

export const todosRelations = relations(todos, ({ many }) => ({
  s3files: many(s3files),
}));

export const s3files = pgTable("s3files", {
  id: uuid("id").default(randomUUID()).primaryKey(),
  todoId: integer("todo_id")
    .references(() => todos.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type S3File = InferSelectModel<typeof s3files>;

export const s3filesRelations = relations(s3files, ({ one }) => ({
  todo: one(todos, {
    fields: [s3files.todoId],
    references: [todos.id],
  }),
}));
