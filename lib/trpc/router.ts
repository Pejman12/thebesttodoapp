import { todosRouter as todos } from "@/lib/todos/todosRouter";
import { router } from "./init";

export const appRouter = router({
  todos,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
