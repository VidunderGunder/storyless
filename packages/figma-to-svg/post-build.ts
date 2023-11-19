import path from "path";

// Temporary solution to fix bun build "import.meta.require" error
const pathToBuiltFile = path.resolve(import.meta.dir, "build/index.js");

const inputFile = Bun.file(pathToBuiltFile);
const outputFile = Bun.file(pathToBuiltFile);

let inputFileText = await inputFile.text();

if (!inputFileText.includes('import { createRequire } from "module";')) {
  inputFileText = inputFileText.replace(
    "var __require = (id) => {",
    'import { createRequire } from "module"; var __require = (id) => {'
  );
}

if (!inputFileText.includes("return createRequire(import.meta.url)(id);")) {
  inputFileText = inputFileText.replace(
    "return import.meta.require(id);",
    "return createRequire(import.meta.url)(id);"
  );
}

await Bun.write(outputFile, inputFileText);

// bun build ./index.ts --outdir ./build --target node
