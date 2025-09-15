import type { Dispatch, FormEvent, SetStateAction } from "react";
import { Button } from "@/lib/components/ui/button";

export default function AddTodoForm({
  setTodos,
}: {
  setTodos: Dispatch<
    SetStateAction<{ id: number; text: string; done: boolean }[]>
  >;
}) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const text = (form.elements.namedItem("text") as HTMLInputElement).value;
    if (text) {
      setTodos((prev) => [...prev, { id: Date.now(), text, done: false }]);
      form.reset();
    }
  };

  return (
    <form className="flex items-center gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        className="border p-2 rounded-md w-full"
        name="text"
        placeholder="add a new todo"
      />
      <Button type="submit">Add</Button>
    </form>
  );
}
