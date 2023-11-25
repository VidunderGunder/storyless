import { type Config } from "drizzle-kit";
import { env } from "./env.mjs";

export default {
  schema: "./schema.ts",
  out: "./generated",
  driver: "mysql2",
  dbCredentials: {
    uri: env.DATABASE_URL ?? "",
  },
  tablesFilter: ["feasy-t3-drizzle_*"],
} satisfies Config;
