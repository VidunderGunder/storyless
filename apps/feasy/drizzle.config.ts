import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  out: "./src/server/db/generated",
  dbCredentials: {
    uri: env.DATABASE_URL ?? "",
  },
  tablesFilter: ["feasy-t3-drizzle_*"],
} satisfies Config;
