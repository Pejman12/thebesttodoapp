"use client";

import { formOptions, useForm } from "@tanstack/react-form";
import { FileIcon, FilePlus2 } from "lucide-react";
import { z } from "zod/v4";
import { trpc } from "@/lib/trpc/client";
import { Button } from "../components/ui/button";

const addTodoSchema = z.object({
  text: z.string().min(1),
  files: z.array(z.instanceof(File)).optional(),
});
type AddTodo = z.infer<typeof addTodoSchema>;
const formOpts = formOptions({
  defaultValues: {
    text: "",
    files: [],
  } as AddTodo,
});

export function AddTodoForm() {
  const utils = trpc.useUtils();
  const addTodo = trpc.todos.create.useMutation({
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      if (!value) return;
      const formData = new FormData();
      formData.append("text", value.text);
      value.files?.forEach((file) => {
        formData.append("files[]", file);
      });
      console.log({ formData });
      await addTodo(formData);
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
      className="flex gap-2"
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
      <form.Field name="files">
        {(field) => (
          <>
            <label
              htmlFor={field.name}
              className="cursor-pointer border-2 p-2 rounded-md"
            >
              <FilePlus2 />
            </label>
            <input
              type="file"
              name={field.name}
              id={field.name}
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                if (!e.target.files) return;
                const files = Array.from(e.target.files);
                field.handleChange(files);
              }}
            />
            {field.state.value?.map((file) => (
              <div
                key={file.name}
                className="bg-muted rounded-md p-1 flex gap-2 items-center text-xs text-muted-foreground"
              >
                <FileIcon className="size-8" />
                {file.name}
              </div>
            ))}
          </>
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
