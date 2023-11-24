import path from "node:path";
import type { BuildConfig } from "bun";
import packageJson from "./package.json";

export async function build(options?: BuildConfig): Promise<void> {
  const t0 = performance.now();
  const external = Object.keys(
    packageJson.peerDependencies
  ) as (keyof typeof packageJson.peerDependencies)[];

  await Bun.build({
    entrypoints: [path.join(__dirname, "./index.tsx")],
    outdir: path.join(__dirname, "./build/bundle"),
    external,
    ...options,
  });

  const t1 = performance.now();

  // eslint-disable-next-line no-console -- CLI
  console.log(`🏗️ Built @storyless/react in ${(t1 - t0).toFixed(2)} ms.`);

  const t2 = performance.now();

  const pathToIndexJS = path.resolve(
    import.meta.url.replace("file://", ""),
    "../build/bundle/index.js"
  );

  const indexJS = Bun.file(pathToIndexJS);
  const indexJSText = await indexJS.text();

  await Bun.write(
    indexJS,
    `"use client"\n${indexJSText.replaceAll('"use client";', "")}`
  );

  const t3 = performance.now();

  // eslint-disable-next-line no-console -- CLI
  console.log(
    `🏗️ Fixed @storyless/react bundle in ${(t3 - t2).toFixed(2)} ms.`
  );
}

void build();
