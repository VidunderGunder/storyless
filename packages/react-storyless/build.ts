import path from "node:path";
import packageJson from "./package.json";

process.env.NODE_ENV = "production";
Bun.env.NODE_ENV = "production";

// console.log(process.env.NODE_ENV); // development 👈 culprit?
// console.log(Bun.env.NODE_ENV); // production

const external = Object.keys(
  packageJson.peerDependencies
) as (keyof typeof packageJson.peerDependencies)[];

await Bun.build({
  entrypoints: [path.join(__dirname, "./index.tsx")],
  outdir: path.join(__dirname, "./build"),
  external,
});
