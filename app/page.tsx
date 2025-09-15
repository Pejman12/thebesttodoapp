import { Suspense } from "react";
import { db } from "@/lib/db";
import AddTodoForm from "@/lib/todos/AddTodoForm";
import Todos from "@/lib/todos/Todos";

export const dynamic = "force-dynamic";

export default function Home() {
  const todos = db().query.todos.findMany();

  return (
    <main className="container mx-auto py-12 space-y-4">
      <h1 className="text-2xl font-bold">Todos</h1>
      <AddTodoForm />
      <Suspense fallback={<p>Loading todos...</p>}>
        <Todos todos={todos} />
      </Suspense>
    </main>
  );
}
