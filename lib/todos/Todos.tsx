"use client";

import type { inferProcedureOutput } from "@trpc/server";
import { Trash } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import type { AppRouter } from "@/lib/trpc/router";
import { cn } from "@/lib/utils/ui";

export type Todo = inferProcedureOutput<
  AppRouter["_def"]["procedures"]["todos"]["getAll"]
>[number];

const Todo = ({ todo }: { todo: Todo }) => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateTodo,
    variables: optimistTodo,
    isPending,
  } = trpc.todos.update.useMutation({
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
  });
  const { mutateAsync: deleteTodo } = trpc.todos.delete.useMutation({
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
  });
  const done = isPending ? optimistTodo.done : todo.done;

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
          variant="destructive"
          size="icon"
          className="border-none hover:bg-muted"
          onClick={() => deleteTodo({ id: todo.id })}
        >
          <Trash className="size-5" />
        </Button>
      </div>
      <p className={cn("p-2.5", done && "line-through")}>{todo.text}</p>
      {todo.s3files.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {todo.s3files.map(({ id }) => (
            <picture key={todo.id}>
              <source src={`https://bucket.thebesttodoapp.com/${id}`} />
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
