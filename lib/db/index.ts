import { neonConfig, Pool } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
import env from "@/lib/utils/env";
import * as schema from "./schema";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

export const db = () => {
  const pool = new Pool({connectionString: env.databaseUrl});
  return drizzle({client: pool, ws, schema});
};
