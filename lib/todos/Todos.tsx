"use client";

import type { inferProcedureOutput } from "@trpc/server";
import { Trash } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import type { AppRouter } from "@/lib/trpc/router";
import env from "@/lib/utils/env";
import { cn } from "@/lib/utils/ui";

export type Todo = inferProcedureOutput<
  AppRouter["_def"]["procedures"]["todos"]["getAll"]
>[number];

const Todo = ({ todo }: { todo: Todo }) => {
  const utils = trpc.useUtils();
  const updateTodo = trpc.todos.update.useMutation({
    onMutate: async (variables) => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      utils.todos.getAll.setData(undefined, (old) =>
        old?.map((curr) => {
          if (curr.id === todo.id) {
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
  const deleteTodo = trpc.todos.delete.useMutation({
    onMutate: async () => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      utils.todos.getAll.setData(undefined, (old) =>
        old?.filter((e) => e.id !== todo.id),
      );
      return { previousTodos };
    },
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
  const done = todo.done;

  return (
    <div
      id={todo.id.toString()}
      className="transition-transform ease-in-out duration-300 p-2 space-y-4 odd:bg-muted shadow-md"
    >
      <div className="flex justify-between items-center">
        <label className="cursor-pointer size-10 flex items-center justify-center">
          <input
            type="checkbox"
            className="cursor-pointer size-5"
            checked={done}
            onChange={async () =>
              await updateTodo({ id: todo.id, done: !done })
            }
          />
        </label>
        <Button
          variant="ghost"
          size="icon"
          className="border-none hover:bg-muted"
          onClick={() => deleteTodo({ id: todo.id })}
        >
          <Trash className="size-5" />
        </Button>
      </div>
      <p className={cn("p-2.5", done && "line-through")}>{todo.text}</p>
      {todo.files.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-2 gap-2",
            todo.files.length === 1 && "grid-cols-1",
          )}
        >
          {todo.files.map(({ id, name }) => (
            <picture key={id}>
              <source src={`${env.bucketUrl}/${name}`} />
              <img src={`${env.bucketUrl}/${name}`} alt={name} />
            </picture>
          ))}
        </div>
      )}
    </div>
  );
};

export function Todos() {
  const [todos] = trpc.todos.getAll.useSuspenseQuery();

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {todos
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map((todo) =>
          todo.done ? null : (
            <Todo key={todo.id} todo={todo as unknown as Todo} />
          ),
        )}
      {todos
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
        .map(
          (todo) =>
            todo.done && <Todo key={todo.id} todo={todo as unknown as Todo} />,
        )}
    </div>
  );
}
