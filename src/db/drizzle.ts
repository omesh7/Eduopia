import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "@/db/schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const connectionString = process.env.DATABASE_URL;

const client = postgres(connectionString, { prepare: false });

const drizzleConfig = {
  schema: { ...schema },
  logger: true,
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
};

const db = drizzle(client, drizzleConfig);

export default db;
