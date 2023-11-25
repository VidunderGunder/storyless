import { sql } from "drizzle-orm";
import {
  index,
  mysqlTableCreator,
  primaryKey,
  timestamp,
  varchar,
  boolean,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator(
  (name) => `feasy-t3-drizzle_${name}`
);

export const toggles = mysqlTable(
  "toggle",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    enabled: boolean("enabled").notNull().default(false),
    userId: varchar("userId", { length: 255 }).notNull(),
    orgId: varchar("orgId", { length: 255 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt").onUpdateNow(),
  },
  (toggle) => ({
    nameIdx: index("name_idx").on(toggle.name),
    userIdx: index("userId_idx").on(toggle.userId),
    orgIdx: index("orgId_idx").on(toggle.orgId),
  })
);

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    fsp: 3,
  }).default(sql`CURRENT_TIMESTAMP(3)`),
  image: varchar("image", { length: 255 }),
});
