"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";

export async function addTodo(text: string) {
  await db().insert(todos).values({ text });
  revalidatePath("/");
}

export async function toggleTodo(id: number, done: boolean) {
  await db().update(todos).set({ done }).where(eq(todos.id, id));
  revalidatePath("/");
}
