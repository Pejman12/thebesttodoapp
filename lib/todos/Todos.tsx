"use client";

import type { inferProcedureOutput } from "@trpc/server";
import { Trash } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import type { AppRouter } from "@/lib/trpc/router";
import { cn } from "@/lib/utils/ui";

type Todo = inferProcedureOutput<
  AppRouter["_def"]["procedures"]["todos"]["getAll"]
>[number];

const Todo = ({ todo }: { todo: Todo }) => {
  const utils = trpc.useUtils();
  const updateTodo = trpc.todos.update.useMutation({
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
  const deleteTodo = trpc.todos.delete.useMutation({
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  });

  return (
    <div
      key={todo.id}
      className="rounded p-2 flex gap-4 justify-between items-center odd:bg-muted"
    >
      <input
        type="checkbox"
        className="cursor-pointer"
        checked={todo.done}
        onChange={async () =>
          await updateTodo({ id: todo.id, done: !todo.done })
        }
      />
      <span className={cn("grow", todo.done ? "line-through" : "")}>
        {todo.text}
      </span>
      {todo.s3files.map(({ id }) => (
        <picture key={todo.id}>
          <source src={`https://bucket.thebesttodoapp.com/${id}`} />
        </picture>
      ))}
      <Button
        variant="destructive"
        size="fit"
        className="p-2 rounded"
        onClick={() => deleteTodo.mutate({ id: todo.id })}
      >
        <Trash className="size-5" />
      </Button>
    </div>
  );
};

export function Todos() {
  const [todos] = trpc.todos.getAll.useSuspenseQuery();
  const doneTodos = todos.filter((t) => t.done);
  const pendingTodos = todos.filter((t) => !t.done);

  return (
    <div className="space-y-2">
      {pendingTodos
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((todo) => (
          <Todo key={todo.id} todo={todo as unknown as Todo} />
        ))}
      {doneTodos
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((todo) => (
          <Todo key={todo.id} todo={todo as unknown as Todo} />
        ))}
    </div>
  );
}
