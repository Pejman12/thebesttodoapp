"use client";

import {formOptions, useForm} from "@tanstack/react-form";
import {FileIcon, FilePlus2} from "lucide-react";
import {z} from "zod/v4";
import compressImage from "@/lib/images/compress";
import {useAddTodo} from "@/lib/todos/todosHooks";
import {Button} from "../components/ui/button";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

const addTodoSchema = z.object({
  text: z.string().min(1),
  files: z.array(z.instanceof(File).optional()).optional(),
});
type AddTodo = z.infer<typeof addTodoSchema>;
const formOpts = formOptions({
  defaultValues: {
    text: "",
    files: [],
  } as AddTodo,
});

export function AddTodoForm() {
  const addTodo = useAddTodo();
  const form = useForm({
    ...formOpts,
    onSubmit: async ({value}) => {
      if (!value) return;
      form.reset();
      const formData = new FormData();
      formData.append("text", value.text);
      value.files?.map(async (file) => {
        if (file) formData.append("files[]", file);
      });
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
      className="flex flex-col lg:flex-row gap-2"
    >
      <form.Field name="text">
        {(field) => (
          <input
            id={field.name}
            name={field.name}
            value={field.state.value}
            type="text"
            autoFocus
            className="border p-2 rounded-md w-full"
            placeholder="Add a new todo"
            onChange={(e) => field.handleChange(e.target.value)}
          />
        )}
      </form.Field>
      <form.Field name="files">
        {(field) => (
          <div className="flex flex-col lg:flex-row gap-2">
            <div className="flex flex-wrap lg:flex-nowrap gap-2">
              {field.state.value
                    ?.filter((file) => !!file)
                    .map((file) => (
                      <div
                        key={file.name}
                        className="bg-muted rounded-md p-1 flex gap-2 items-center text-xs text-foreground border-2"
                      >
                        <FileIcon className="size-6"/>
                        <span className="truncate max-w-40">{file.name}</span>
                      </div>
                    ))}
            </div>
            <label
              className="cursor-pointer w-fit border-2 py-1.5 px-2 rounded-md flex items-center">
              <FilePlus2 className="size-6"/>
              <input
                type="file"
                name={field.name}
                id={field.name}
                accept="image/*"
                multiple
                className="sr-only"
                onChange={async (e) => {
                  if (!e.target.files) return;
                  const files = Array.from(e.target.files);
                  const compressedFiles = await Promise.all(
                    files.map((file) =>
                      compressImage(file).catch(() =>
                        file.size < MAX_FILE_SIZE ? file : undefined,
                      ),
                    ),
                  );
                  field.handleChange(compressedFiles);
                }}
              />
            </label>
          </div>
        )}
      </form.Field>
      <form.Subscribe
        selector={(state) => ({
          canSubmit: state.canSubmit,
          isSubmitting: state.isSubmitting,
        })}
      >
        {({canSubmit, isSubmitting}) => (
          <Button type="submit" isDisabled={!canSubmit}>
            {isSubmitting ? "..." : "Add Todo"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
