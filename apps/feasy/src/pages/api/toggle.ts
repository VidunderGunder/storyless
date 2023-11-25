import type { NextApiRequest, NextApiResponse } from "next";

import { drizzle } from "drizzle-orm/planetscale-serverless";
import { getToggle, schema } from "@feasy/drizzle";
import { Type as t, type Static } from "@sinclair/typebox";
import { Value, type ValueError } from "@sinclair/typebox/value";
import { Client } from "@planetscale/database";
import { env } from "~/env.mjs";

export const db = drizzle(
  new Client({
    url: env.DATABASE_URL,
  }).connection(),
  {
    schema,
  },
);

type ResponseSuccessDataPromise = ReturnType<typeof getToggle>;
type ResponseSuccessData = ResponseSuccessDataPromise extends Promise<infer T>
  ? T
  : never;
type ResponseErrorData = { errors: ValueError[] };
type ResponseData = ResponseSuccessData | ResponseErrorData;

const querySchema = t.Object({
  id: t.Optional(t.String()),
  userId: t.Optional(t.String()),
  orgId: t.Optional(t.String()),
});
type Query = Static<typeof querySchema>;

const responseSchema = t.Array(
  t.Object({
    id: t.String(),
    userId: t.String(),
    orgId: t.Union([t.String(), t.Null()]),
  }),
);

async function getResponseJson({
  id,
  userId,
  orgId,
}: Query): Promise<ResponseSuccessData> {
  if (!id && !userId && !orgId)
    throw new Error("Must provide either id or userId");
  if (id) return await getToggle({ db, id });
  if (userId) return await getToggle({ db, userId });
  if (orgId) return await getToggle({ db, orgId });
  return [];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  const { query } = req;

  let errors = [...Value.Errors(querySchema, query as Query)];
  if (errors.length) return res.status(400).json({ errors });

  const data = await getResponseJson(query as Query);

  errors = [...Value.Errors(responseSchema, data)];
  if (errors.length) return res.status(400).json({ errors });

  res.status(200).json(data);
}
