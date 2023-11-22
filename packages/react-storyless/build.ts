import path from "node:path";
import packageJson from "./package.json";

const external = Object.keys(
  packageJson.peerDependencies
) as (keyof typeof packageJson.peerDependencies)[];

await Bun.build({
  entrypoints: [path.join(__dirname, "./index.tsx")],
  outdir: path.join(__dirname, "./build"),
  external,
});
