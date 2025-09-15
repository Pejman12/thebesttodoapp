import { type InferSelectModel, relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp, uuid, } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  text: text("text").notNull(),
  done: boolean("done").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const todosRelations = relations(todos, ({ many }) => ({
  s3files: many(files),
}));

export const files = pgTable("files", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  todoId: integer("todo_id")
    .references(() => todos.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type S3File = InferSelectModel<typeof files>;

export const s3filesRelations = relations(files, ({ one }) => ({
  todo: one(todos, {
    fields: [files.todoId],
    references: [todos.id],
  }),
}));
