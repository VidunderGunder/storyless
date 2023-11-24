import { sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { toggles } from "./schema/toggle";
import { PlanetScaleDatabase } from "drizzle-orm/planetscale-serverless";
import { schema } from "./schema";

export { schema };

export type DB = PlanetScaleDatabase<typeof schema>;

export async function createToggle({
  db,
  name,
  userId,
}: {
  db: DB;
  name: string;
  userId: string;
}) {
  await db.execute(sql`
    INSERT INTO ${toggles} (id, name, createdById)
    VALUES (${nanoid()}, ${name}, ${userId})
  `);
}

export async function deleteToggle({
  db,
  id,
  userId,
}: {
  db: DB;
  id: string;
  userId: string;
}) {
  await db.execute(sql`
    DELETE FROM ${toggles}
    WHERE id = ${id}
    AND createdById = ${userId}
  `);
}

export async function updateToggle({
  db,
  id,
  enabled,
  userId,
}: {
  db: DB;
  id: string;
  enabled: boolean;
  userId: string;
}) {
  await db
    .update(toggles)
    .set({ enabled })
    .where(sql`id = ${id} AND createdById = ${userId}`)
    .execute();
}

export async function getToggle({
  db,
  id,
  userId,
}: {
  db: DB;
  id: string | undefined;
  userId: string;
}) {
  if (typeof id === "string") {
    return await db
      .select()
      .from(toggles)
      .where(sql`id = ${id} AND createdById = ${userId}`)
      .execute();
  }
  return await db
    .select()
    .from(toggles)
    .where(sql`createdById = ${userId}`)
    .execute();
}
