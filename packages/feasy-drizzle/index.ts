import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import * as schema from "./schema";
export * as schema from "./schema";
import { Client } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { env } from "./env.mjs";

export const db = drizzle(
  new Client({
    url: env.DATABASE_URL,
  }).connection(),
  {
    schema,
  }
);

const { toggles } = schema;

export type DB = PlanetScaleDatabase<typeof schema>;

export async function createToggle({
  db,
  name,
  userId,
  orgId,
}: {
  db: DB;
  name: string;
  userId: string;
  orgId?: string;
}) {
  if (typeof orgId === "string") {
    await db.execute(sql`
      INSERT INTO ${toggles} (id, name, userId, orgId)
      VALUES (${nanoid()}, ${name}, ${userId}, ${orgId})
    `);
    return;
  }
  await db.execute(sql`
    INSERT INTO ${toggles} (id, name, userId)
    VALUES (${nanoid()}, ${name}, ${userId})
  `);
}

export async function deleteToggle({ db, id }: { db: DB; id: string }) {
  await db.execute(sql`
    DELETE FROM ${toggles}
    WHERE id = ${id}
  `);
}

export async function updateToggle({
  db,
  id,
  enabled,
}: {
  db: DB;
  id: string;
  enabled: boolean;
}) {
  await db
    .update(toggles)
    .set({ enabled })
    .where(sql`id = ${id}`)
    .execute();
}

/**
 * Get a single toggle, all toggles for a user or all toggles for an organization
 */
export async function getToggle({
  db,
  id,
  userId,
  orgId,
}: {
  db: DB;
} & (
  | {
      id: string;
      userId?: undefined;
      orgId?: undefined;
    }
  | {
      id?: undefined;
      userId: string;
      orgId?: undefined;
    }
  | {
      id?: undefined;
      userId?: undefined;
      orgId: string;
    }
)) {
  if (typeof id === "string") {
    return await db
      .select()
      .from(toggles)
      .where(sql`id = ${id}`)
      .execute();
  }
  if (typeof userId === "string") {
    return await db
      .select()
      .from(toggles)
      .where(sql`userId = ${userId}`)
      .execute();
  }
  if (typeof orgId === "string") {
    return await db
      .select()
      .from(toggles)
      .where(sql`orgId = ${orgId}`)
      .execute();
  }
  throw new Error("Must provide id, userId or orgId");
}
