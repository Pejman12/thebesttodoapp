CREATE TABLE "s3files" (
	"id" uuid PRIMARY KEY DEFAULT '81bd9307-5272-4d15-ab19-a0957d0d538f' NOT NULL,
	"todo_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "s3files" ADD CONSTRAINT "s3files_todo_id_todos_id_fk" FOREIGN KEY ("todo_id") REFERENCES "public"."todos"("id") ON DELETE cascade ON UPDATE no action;