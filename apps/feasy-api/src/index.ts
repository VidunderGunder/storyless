import { join } from "node:path";
import { Elysia, t } from "elysia";
import { env } from "../env.mjs";
import { connect } from "@planetscale/database";
import { swagger } from "@elysiajs/swagger";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import {
  createToggle,
  deleteToggle,
  updateToggle,
  getToggle,
} from "@feasy/drizzle";
import { html } from "@elysiajs/html";

async function getFileAsText(filePath: string): Promise<string> {
  return await Bun.file(join(import.meta.dir, filePath)).text();
}

const connection = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
});
const db = drizzle(connection);

const server = new Elysia()
  .use(
    swagger({
      documentation: {
        tags: [
          {
            name: "Feature Toggle",
            description: "Endpoints for toggle operations",
          },
        ],
      },
    })
  )
  .use(html())
  .get("/", async () => await getFileAsText("index.html"), {
    detail: {
      summary: "Get index.html",
      tags: ["Index"],
    },
  })
  .post(
    "/toggle",
    async ({ body }) => {
      const { name, userId } = body;
      await createToggle({ db, name, userId });
      return { message: "Toggle created successfully" };
    },
    {
      body: t.Object({
        name: t.String(),
        userId: t.String(),
      }),
      detail: {
        summary: "Create a new toggle",
        tags: ["Toggle"],
      },
    }
  )
  .delete(
    "/toggle",
    async ({ body }) => {
      const { id, userId } = body;
      await deleteToggle({ db, id, userId });
      return { message: "Toggle deleted successfully" };
    },
    {
      body: t.Object({
        id: t.String(),
        userId: t.String(),
      }),
      detail: {
        summary: "Delete a toggle",
        tags: ["Toggle"],
      },
    }
  )
  .put(
    "/toggle",
    async ({ body }) => {
      const { id, enabled, userId } = body;
      await updateToggle({ db, id, enabled, userId });
      return { message: "Toggle updated successfully" };
    },
    {
      body: t.Object({
        id: t.String(),
        enabled: t.Boolean(),
        userId: t.String(),
      }),
      detail: {
        summary: "Update a toggle",
        tags: ["Toggle"],
      },
    }
  )
  .get(
    "/toggle",
    async ({ query }) => {
      const { id, userId } = query;
      const toggles = await getToggle({ db, id, userId });
      return { toggles };
    },
    {
      query: t.Object({
        id: t.Optional(t.String()),
        userId: t.String(),
      }),
      detail: {
        summary: "Get toggles",
        tags: ["Toggle"],
      },
    }
  )
  .listen(6969);

console.log(
  [
    `🦩 ${server.server?.url} <- Feasy API`,
    `🦩 ${server.server?.url}swagger <- Swagger UI`,
  ].join("\n")
);

export type Server = typeof server;
