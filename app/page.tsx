'use client';

import AddTodoForm from "@/lib/todos/AddTodoForm";
import Todos from "@/lib/todos/Todos";
import { useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<{ id: number; text: string; done: boolean }[]>([]);

  return (
    <main className="max-w-xl mx-auto py-12 space-y-4">
      <h1 className="text-2xl font-bold">Todos</h1>
      <AddTodoForm setTodos={setTodos} />
      <Todos todos={todos} setTodos={setTodos} />
    </main>
  );
}
