"use client";

import { formOptions, useForm } from "@tanstack/react-form";
import { z } from "zod/v4";
import { Button } from "@/lib/components/ui/button";
import { addTodo } from "@/lib/todos/actions";

const addTodoSchema = z.object({
  text: z.string().min(1),
});
type AddTodo = z.infer<typeof addTodoSchema>;
const formOpts = formOptions({
  defaultValues: {
    text: "",
  } as AddTodo,
});

export default function AddTodoForm() {
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      if (!value) return;
      await addTodo(value.text);
      form.reset();
    },
    validators: {
      onChange: addTodoSchema,
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="flex flex-col md:flex-row gap-2"
    >
      <form.Field name="text">
        {(field) => (
          <input
            id={field.name}
            name={field.name}
            value={field.state.value}
            type="text"
            className="border p-2 rounded-md w-full"
            placeholder="Add a new todo"
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({ canSubmit, isSubmitting }) => (
          <Button type="submit" isDisabled={!canSubmit}>
            {isSubmitting ? "..." : "Add Todo"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
