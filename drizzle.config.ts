import { defineConfig } from "drizzle-kit";
import env from "@/lib/utils/env";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.databaseUrl,
  },
});
