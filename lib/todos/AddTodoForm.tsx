"use client";

import { useUser } from "@clerk/nextjs";
import { formOptions, useForm } from "@tanstack/react-form";
import imageCompression from "browser-image-compression";
import { FileIcon, FilePlus2 } from "lucide-react";
import { z } from "zod/v4";
import { trpc } from "@/lib/trpc/client";
import { Button } from "../components/ui/button";

const imageCompressOptions = {
  maxSizeMB: 0.3,
  maxWidthOrHeight: 1080,
  useWebWorker: true,
} as const;

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

const compressFile = async (file: File) => {
  return new File(
    [await imageCompression(file, imageCompressOptions)],
    file.name,
    { type: file.type },
  );
};

export function AddTodoForm() {
  const { user } = useUser();
  const utils = trpc.useUtils();
  const addTodo = trpc.todos.create.useMutation({
    onMutate: async (formData) => {
      await utils.todos.getAll.cancel();
      const previousTodos = utils.todos.getAll.getData();
      const text = formData.get("text")?.valueOf() as string;
      utils.todos.getAll.setData(undefined, (old) => [
        ...(old ?? []),
        {
          id: -1,
          text,
          userId: user!.id,
          done: false,
          files: [],
          createdAt: new Date().toISOString(),
        } satisfies NonNullable<typeof old>[number],
      ]);
      return { previousTodos };
    },
    onSuccess: async () => {
      await utils.todos.getAll.invalidate();
    },
  }).mutateAsync;
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      if (!value) return;
      form.reset();
      const formData = new FormData();
      formData.append("text", value.text);
      await Promise.all(
        value.files?.map(async (file) => {
          try {
            const compressedFile = await compressFile(file);
            formData.append("files[]", compressedFile);
          } catch (error) {
            formData.append("files[]", file);
          }
        }) ?? [],
      );
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
      <form.Field name="files">
        {(field) => (
          <div className="flex gap-2">
            <label
              htmlFor={field.name}
              className="cursor-pointer border-2 py-1.5 px-2 rounded-md flex items-center"
            >
              <FilePlus2 className="size-6" />
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
                className="bg-muted rounded-md p-1 flex gap-2 items-center text-xs text-foreground border-2 "
              >
                <FileIcon className="size-6" />
                <span className="truncate max-w-40">{file.name}</span>
              </div>
            ))}
          </div>
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
