import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AddTodoForm } from "@/lib/todos/AddTodoForm";
import { Todos } from "@/lib/todos/Todos";
import TodosLoading from "@/lib/todos/TodosLoading";
import { trpc } from "@/lib/trpc/server";

export const dynamic = "force-dynamic";

export default function Home() {
  void trpc.todos.getAll.prefetch();
  return (
    <main className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Todos</h1>
      <AddTodoForm />
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense fallback={<TodosLoading />}>
          <Todos />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
}
