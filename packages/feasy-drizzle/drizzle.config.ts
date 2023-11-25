import { type Config } from "drizzle-kit";

export default {
  schema: "./schema.ts",
  driver: "mysql2",
  out: "./generated",
  dbCredentials: {
    uri: process.env.DATABASE_URL ?? "",
  },
  tablesFilter: ["feasy-t3-drizzle_*"],
} satisfies Config;
