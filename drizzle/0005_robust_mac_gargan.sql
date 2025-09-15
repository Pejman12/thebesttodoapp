ALTER TABLE "s3files" RENAME TO "files";--> statement-breakpoint
ALTER TABLE "files" RENAME COLUMN "type" TO "name";--> statement-breakpoint
ALTER TABLE "files" DROP CONSTRAINT "s3files_todo_id_todos_id_fk";
--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;