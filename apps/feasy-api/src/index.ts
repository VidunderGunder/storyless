import { join } from "node:path";
import { Elysia, t } from "elysia";
import { env } from "../env.mjs";
import { connect } from "@planetscale/database";
import { swagger } from "@elysiajs/swagger";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { getToggle } from "@feasy/drizzle";
import { html } from "@elysiajs/html";
import packageJson from "../package.json";

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
        externalDocs: {
          url: "https://github.com/VidunderGunder/storyless",
          description: "GitHub",
        },
        info: {
          title: "🦩 Feasy API",
          description: packageJson.description,
          version: packageJson.version,
        },
      },
    })
  )
  .get(
    "/toggle",
    async ({ query }) => {
      const { id, userId, organizationId } = query;
      if (!id && !userId && !organizationId)
        throw new Error("Must provide either id or userId");
      if (id) return await getToggle({ db, id });
      if (userId) return await getToggle({ db, userId });
      if (organizationId) return await getToggle({ db, organizationId });
      return [];
    },
    {
      query: t.Object({
        id: t.Optional(t.String()),
        userId: t.Optional(t.String()),
        organizationId: t.Optional(t.String()),
      }),
      detail: {
        summary:
          "Get a single toggle, all user toggles or all organization toggles",
        tags: ["Toggle"],
        description: `You can provide either an id, userId or organizationId. The endpoint returns the first match in this order: \`id\` -> \`userId\` -> \`organizationId\`.
        `,
      },
    }
  )
  .use(html())
  .get("/", async () => await getFileAsText("index.html"), {
    detail: {
      summary: "Get API landing page",
      tags: ["Index"],
    },
  })
  .listen(6969);

console.log(
  [
    `🦩 ${server.server?.url} <- Feasy API`,
    `🦩 ${server.server?.url}swagger <- Swagger UI`,
  ].join("\n")
);

export type Server = typeof server;
