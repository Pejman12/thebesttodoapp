"use client";

import { useUser } from "@clerk/shared/react";
import { trpc } from "@/lib/trpc/client";

export function useAddTodo() {
  const { user } = useUser();
  const utils = trpc.useUtils();
  return trpc.todos.create.useMutation({
    onMutate: async (input) => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      const { text } = input;
      utils.todos.getAll.setData(undefined, (old) => [
        ...(old ?? []),
        {
          id: Date.now(), // Temporary ID
          text,
          userId: user!.id,
          done: false,
          createdAt: new Date().toISOString(),
        } satisfies NonNullable<typeof old>[number],
      ]);
      return { previousTodos };
    },
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
}

export function useUpdateTodo() {
  const utils = trpc.useUtils();
  return trpc.todos.update.useMutation({
    onMutate: async (variables) => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      utils.todos.getAll.setData(undefined, (old) =>
        old?.map((curr) => {
          if (curr.id === variables.id) {
            return { ...curr, done: variables.done };
          }
          return curr;
        }),
      );
      return { previousTodos };
    },
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
}

export function useDeleteTodo() {
  const utils = trpc.useUtils();
  return trpc.todos.delete.useMutation({
    onMutate: async (variables) => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      utils.todos.getAll.setData(undefined, (old) =>
        old?.filter((e) => e.id !== variables.id),
      );
      return { previousTodos };
    },
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
}
