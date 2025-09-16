"use server";

import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";

export async function addTodo(text: string) {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated");
  await db().insert(todos).values({ text, userId: user.id });
  revalidatePath("/");
}

export async function toggleTodo(id: number, done: boolean) {
  await db().update(todos).set({ done }).where(eq(todos.id, id));
  revalidatePath("/");
}
