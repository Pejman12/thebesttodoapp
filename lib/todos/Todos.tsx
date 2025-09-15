import type { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils/ui";

export default function Todos({
  todos,
  setTodos,
}: {
  todos: { id: number; text: string; done: boolean }[];
  setTodos: Dispatch<
    SetStateAction<{ id: number; text: string; done: boolean }[]>
  >;
}) {
  const handleCheckboxChange = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo,
      ),
    );
  };

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
              onChange={() => handleCheckboxChange(todo.id)}
            />
          </label>
          <span className={cn(todo.done && "line-through")}>{todo.text}</span>
        </li>
      ))}
    </ul>
  );
}
