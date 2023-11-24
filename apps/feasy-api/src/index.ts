import { Elysia } from "elysia";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";
import { env } from "../env.mjs";
import {
  createToggle,
  deleteToggle,
  updateToggle,
  getToggle,
} from "@feasy/drizzle";

const connection = connect({
  host: env.DATABASE_HOST,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
});
const db = drizzle(connection);

const app = new Elysia()
  .get("/", () => "🦩 Hello")
  .get("/toggle", async (req) => {
    console.log("🦩 GET /toggle");
    console.log("🦩 req", req);
  })
  .listen(6969);

console.log(`🦩 Feasy API is ready at ${app.server?.url}`);
