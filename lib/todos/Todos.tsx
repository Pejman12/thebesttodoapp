"use client";

import type { inferProcedureOutput } from "@trpc/server";
import { Trash } from "lucide-react";
import { Button } from "@/lib/components/ui/button";
import { useDeleteTodo, useUpdateTodo } from "@/lib/todos/todosHooks";
import { trpc } from "@/lib/trpc/client";
import type { AppRouter } from "@/lib/trpc/router";
import { cn } from "@/lib/utils/ui";

export type Todo = inferProcedureOutput<
  AppRouter["_def"]["procedures"]["todos"]["getAll"]
>[number];

const Todo = ({todo}: { todo: Todo }) => {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  return (
    <div className="p-2 bg-muted shadow-sm rounded-lg w-full gap-4 flex items-center">
      <label className="cursor-pointer size-10 flex items-center justify-center">
        <input
          type="checkbox"
          className="cursor-pointer size-5"
          checked={todo.done}
          onChange={async () =>
            await updateTodo({id: todo.id, done: !todo.done})
          }
        />
      </label>
      <p className={cn("p-2.5", todo.done && "line-through")}>{todo.text}</p>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-white ml-auto px-2"
        onClick={() => deleteTodo({id: todo.id})}
      >
        <Trash className="size-5"/>
      </Button>
    </div>
  );
};

export default function Todos() {
  const [todos] = trpc.todos.getAll.useSuspenseQuery();

  return (
    <div className="space-y-4">
      {todos
      .filter((todo) => !todo.done)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((todo) => (
        <Todo key={todo.id} todo={todo as unknown as Todo}/>
      ))}
      {todos
      .filter((todo) => todo.done)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .map((todo) => (
        <Todo key={todo.id} todo={todo as unknown as Todo}/>
      ))}
    </div>
  );
}
