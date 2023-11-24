import path from "path";

// Temporary solution to fix bun build "import.meta.require" error
const pathToBuiltFile = path.resolve(import.meta.dir, "build/index.js");

const file = Bun.file(pathToBuiltFile);

let fileText = await file.text();

if (!fileText.includes('import { createRequire } from "module";')) {
  fileText = fileText.replace(
    "var __require = (id) => {",
    'import { createRequire } from "module"; var __require = (id) => {'
  );
}

if (!fileText.includes("return createRequire(import.meta.url)(id);")) {
  fileText = fileText.replace(
    "return import.meta.require(id);",
    "return createRequire(import.meta.url)(id);"
  );
}

await Bun.write(file, fileText);

// bun build ./index.ts --outdir ./build --target node
