import { schema } from "@feasy/drizzle";
import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "~/env.mjs";

export const db = drizzle(
  new Client({
    url: env.DATABASE_URL,
  }).connection(),
  {
    schema,
  },
);
