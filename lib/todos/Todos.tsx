"use client";

import type {inferProcedureOutput} from "@trpc/server";
import {Trash} from "lucide-react";
import {Button} from "@/lib/components/ui/button";
import {useDeleteTodo, useUpdateTodo} from "@/lib/todos/todosHooks";
import {trpc} from "@/lib/trpc/client";
import type {AppRouter} from "@/lib/trpc/router";
import env from "@/lib/utils/env";
import {cn} from "@/lib/utils/ui";

export type Todo = inferProcedureOutput<
  AppRouter["_def"]["procedures"]["todos"]["getAll"]
>[number];

function Todo({todo}: { todo: Todo }) {
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  return (
    <div
      id={todo.id.toString()}
      className="transition-transform ease-in-out duration-300 p-2 rounded-md space-y-4 odd:bg-muted shadow-md"
    >
      <div className="flex justify-between items-center">
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
        <Button
          variant="ghost"
          size="icon"
          className="border-none data-[hovered]:bg-foreground/10"
          onClick={() => deleteTodo({id: todo.id})}
        >
          <Trash className="size-5"/>
        </Button>
      </div>
      <p className={cn("p-2.5", todo.done && "line-through")}>{todo.text}</p>
      {todo.files.length > 0 && (
        <div
          className={cn(
            "grid grid-cols-2 gap-2",
       todo.files.length === 1 && "grid-cols-1",
          )}
        >
          {todo.files.map(({id, name}) => (
            <picture key={id}>
              <source srcSet={`${env.bucketUrl}/${name}`}/>
              <img src={`${env.bucketUrl}/${name}`} alt={name}/>
            </picture>
          ))}
        </div>
      )}
    </div>
  );
}

function getTimeSafe(date: Date | string) {
  return new Date(date).getTime();
}

function dateSort(a?: Date | string, b?: Date | string) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return getTimeSafe(b) - getTimeSafe(a);
}

export function Todos() {
  const [todos] = trpc.todos.getAll.useSuspenseQuery();
  const orderedTodos = [
    ...todos
      .filter((todo) => !todo.done)
      .sort((a, b) => dateSort(a.createdAt, b.createdAt)),
    ...todos
      .filter((todo) => todo.done)
      .sort((a, b) => dateSort(a.createdAt, b.createdAt)),
  ];

  return (
    <>
      {orderedTodos.map((todo) => (
        <Todo key={todo.id} todo={todo}/>
      ))}
    </>
  );
}
