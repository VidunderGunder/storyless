import { type Config } from "drizzle-kit";

import { env } from "~/env.mjs";

export default {
  schema: "./src/server/db/schema.ts",
  driver: "mysql2",
  dbCredentials: {
    // @ts-expect-error-next-line -- T3 told us to do this, but it could be deprecated soon
    connectionString: env.DATABASE_URL ?? "",
  },
  tablesFilter: ["feasy-t3-drizzle_*"],
} satisfies Config;
