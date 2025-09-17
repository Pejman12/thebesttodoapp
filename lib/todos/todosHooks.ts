"use client";

import { useUser } from "@clerk/shared/react";
import { trpc } from "@/lib/trpc/client";

export function useAddTodo() {
  const {user} = useUser();
  const utils = trpc.useUtils();
  return trpc.todos.create.useMutation({
    onMutate: async (formData) => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      const text = formData.get("text")?.valueOf() as string;
      utils.todos.getAll.setData(undefined, (old) => [
        ...(old ?? []),
        {
          id: -1,
          text,
          userId: user!.id,
          done: false,
          files: [],
          createdAt: new Date().toISOString(),
        } satisfies NonNullable<typeof old>[number],
      ]);
      return {previousTodos};
    },
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
}

export function useUpdateTodo() {
  const utils = trpc.useUtils();
  return trpc.todos.update.useMutation({
    onMutate: async ({id, done}) => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      utils.todos.getAll.setData(undefined, (old) =>
        old?.map((todo) => (todo.id === id ? {...todo, done} : todo)),
      );
      return {previousTodos};
    },
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
}

export function useDeleteTodo() {
  const utils = trpc.useUtils();
  return trpc.todos.delete.useMutation({
    onMutate: async ({id}) => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      utils.todos.getAll.setData(undefined, (old) =>
        old?.filter((todo) => todo.id !== id),
      );
      return {previousTodos};
    },
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
}
