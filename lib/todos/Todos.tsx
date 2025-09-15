import type { Dispatch, SetStateAction } from "react";

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
        <li key={todo.id} className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => handleCheckboxChange(todo.id)}
          />
          <span className={`flex-1 ${todo.done ? "line-through" : ""}`}>
            {todo.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
