"use client";
import { use } from "react";
import { toggleTodo } from "@/lib/todos/actions";
import { cn } from "@/lib/utils/ui";

export default function Todos(props: {
  todos: Promise<{ id: number; text: string; done: boolean }[]>;
}) {
  const todos = use(props.todos);

  return (
    <ul className="space-y-4">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className="flex items-center gap-4 p-2 bg-muted rounded-lg w-full"
        >
          <label className="cursor-pointer size-10 flex items-center justify-center">
            <input
              type="checkbox"
              className="cursor-pointer size-5"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id, !todo.done)}
            />
          </label>
          <span className={cn(todo.done && "line-through")}>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}
