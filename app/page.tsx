import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Navbar } from "@/lib/components/Navbar";
import { AddTodoForm } from "@/lib/todos/AddTodoForm";
import { Todos } from "@/lib/todos/Todos";
import TodosLoading from "@/lib/todos/TodosLoading";
import { trpc } from "@/lib/trpc/server";

export default async function Home() {
  void trpc.todos.getAll.prefetch();
  return (
    <main>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Todos</h1>
          <AddTodoForm />
          <ErrorBoundary fallback={<div>Something went wrong</div>}>
            <Suspense fallback={<TodosLoading />}>
              <Todos />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </main>
  );
}
