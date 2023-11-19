import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import path from "path";
import * as prompt from "@clack/prompts";
import color from "picocolors";
import { program } from "commander";
import packageJson from "./package.json";

// const url =
//   "https://www.figma.com/file/cdigx3rPzZGy3bPk9wm1uq/Real-estate?node-id=1111%3A724&mode=dev";
// const token = "figd_6d5tiFDns8c_VHni4zkTaZW9u-kPbmmo6twbzXG4";
// const outputPath = path.join(import.meta.dir, "/svgs/");

const programName = "@storyless/figma-to-svg";

type Component = {
  key: string;
  name: string;
  description: string;
  remote: boolean;
  componentSetId?: string;
  documentationLinks: unknown[];
};
type Components = Record<string, Component>;

const urlSymbolsRegex = /\/|\.|:|&|\?|=/g;

function urlToIds(url: string): {
  fileId: string;
  nodeId: string;
  projectId: string;
} {
  const urlParts = url.split(urlSymbolsRegex).filter((part) => part !== "");

  const fileIndex = urlParts.indexOf("file");
  if (fileIndex === -1) throw new Error("Invalid Figma URL");
  const fileIdIndex = fileIndex + 1;
  const fileId = urlParts[fileIdIndex];
  if (typeof fileId !== "string") throw new Error("Invalid Figma URL");

  const nodeIdIndex = urlParts.indexOf("node-id") + 1;
  if (nodeIdIndex === -1) throw new Error("Invalid Figma URL");
  const nodeId = urlParts[nodeIdIndex];
  if (typeof nodeId !== "string") throw new Error("Invalid Figma URL");

  const projectIdIndex = fileIdIndex + 1;
  const projectId = urlParts[projectIdIndex];
  if (typeof projectId !== "string") throw new Error("Invalid Figma URL");

  return { fileId, nodeId, projectId };
}

function getFigmaComponents(data: {
  components?: Components;
  componentSets?: Components;
  children?: any;
  [key: string]: any;
}): {
  components: Components;
  componentSets: Components;
} {
  let components: Components = {};
  let componentSets: Components = {};

  if (typeof data === "object") {
    if (data?.components) {
      components = { ...components, ...data.components };
    }

    if (data?.componentSets) {
      componentSets = { ...componentSets, ...data.componentSets };
    }

    for (const key in data) {
      const canHaveChildren = key === "nodes" || key.includes(":");
      if (!canHaveChildren) continue;

      const value = data[key];

      const child = getFigmaComponents(value);

      if (Object.keys(child?.components).length > 0) {
        components = { ...components, ...child.components };
      }
      if (Object.keys(child?.componentSets).length > 0) {
        componentSets = { ...componentSets, ...child.componentSets };
      }
    }
  }

  return {
    components,
    componentSets,
  };
}

async function figmaFetch(url: string, token: string) {
  const args = {
    headers: {
      "X-Figma-Token": token,
    },
  };
  return await fetch(url, args);
}

function apiUrlFromIds({ fileId, nodeId }: { fileId: string; nodeId: string }) {
  return `https://api.figma.com/v1/files/${fileId}/nodes?ids=${nodeId}`;
}

function regularUrlFromIds({
  fileId,
  nodeId,
  projectId,
}: {
  fileId: string;
  nodeId: string;
  projectId: string;
}) {
  return [
    "https://www.figma.com/file/",
    fileId,
    "/",
    projectId,
    "?node-id=",
    nodeId.replace(":", "%3A"),
    "&mode=dev",
  ].join("");
}

async function fetchComponentsAsSvgs({
  componentIds,
  fileId,
  token,
}: {
  componentIds: string[];
  fileId: string;
  token: string;
}) {
  const commaSeparatedComponentIds = componentIds.join(",");
  const url = `https://api.figma.com/v1/images/${fileId}/?ids=${commaSeparatedComponentIds}&format=svg`;
  const response = await figmaFetch(url, token);
  const json = await response.json();
  return json;
}

const slashesRegex = /\//g;
const allSymbolsExceptReservedRegex = /[^a-zA-Z0-9-_:]/g;
function formatFileName(originalName: string) {
  return originalName
    .replaceAll(slashesRegex, "_")
    .replace(allSymbolsExceptReservedRegex, "-")
    .replace(/-+/g, "-");
}

function removeDuplicates(array: string[]) {
  return Array.from(new Set(array));
}

/**
 * Gets the SVGs from a Figma frame and saves them to disk
 *
 * @example
 *
 * ```ts
 * import { getSvgs } from "figma-to-svg";
 *
 * await getSvgs({
 *   url: "https://www.figma.com/file/yourfileidhere/Project-Name?node-id=69%3A420&mode=dev",
 *   out: "./svgs/",
 *   token: "figd_secret_token",
 * });
 * ```
 */
export async function getSvgs({
  url,
  out,
  token,
}: {
  /**
   * The URL of the Figma frame
   */
  url: string;
  /**
   * The path to the folder where the SVGs will be saved
   */
  out: string;
  /**
   * Your Figma token
   */
  token: string;
}) {
  const { fileId, nodeId, projectId } = urlToIds(url);

  const apiUrl = apiUrlFromIds({
    fileId,
    nodeId,
  });

  const response = await figmaFetch(apiUrl, token);
  const json = await response.json();

  const { components, componentSets } = getFigmaComponents(json);

  const componentIds = removeDuplicates(Object.keys(components));
  const imagesResponse = await fetchComponentsAsSvgs({
    token,
    componentIds,
    fileId,
  });

  const idImages = imagesResponse?.images ?? {};
  const nameImages: Record<string, string> = {};

  const wasLikelySuccessful = componentIds.length > 0;

  await mkdir(out, { recursive: true });
  if (wasLikelySuccessful) {
    // Delete the previous folder contents from disk
    const files = await readdir(out);
    await Promise.allSettled(
      files.map(async (file) => {
        const filePath = path.join(out, file);
        try {
          const fileStat = await stat(filePath);
          if (fileStat.isFile()) await unlink(filePath);
        } catch (error) {
          console.log("💀 Couldn't delete", filePath, "\n", error);
        }
      })
    );
  }

  await Promise.allSettled(
    componentIds.map(async (id) => {
      const component = components[id];

      const setId = component.componentSetId;
      let imageName = component.name;

      if (typeof setId === "string") {
        const setComponent = componentSets[setId];
        imageName = `${setComponent.name}-${component.name}`;
      }

      imageName = formatFileName(imageName);

      const imageUrl = idImages[id];

      try {
        const response = await fetch(imageUrl);
        const svg = await response.text();
        if (svg === "") throw new Error("Empty SVG");
        nameImages[imageName] = svg;

        await writeFile(path.join(out, `${imageName}.svg`), svg);
      } catch (error) {
        const hasMessage =
          typeof error !== "undefined" &&
          error !== null &&
          typeof error === "object" &&
          "message" in error;
        console.warn(
          "Couldn't get",
          imageName,
          "\n┣━ Node: " + id,
          "\n┣━ Figma: " + regularUrlFromIds({ fileId, nodeId: id, projectId }),
          "\n┣━ URL: " + imageUrl + (hasMessage ? "" : "\n"),
          hasMessage ? "\n┗━ Error: " + error.message : error
        );
      }
    })
  );
}

const args = process.argv.slice(2);

async function main() {
  const allArgsWasPassed = args.includes("--url") && args.includes("--token");
  let url: string | symbol | null = null;
  let token: string | symbol | null = null;
  let out: string | symbol | null = null;

  if (args.includes("--url") || args.includes("-u")) {
    const urlIndex = args.indexOf("--url");
    url = args[urlIndex + 1];
  }

  if (args.includes("--token") || args.includes("-t")) {
    const tokenIndex = args.indexOf("--token");
    token = args[tokenIndex + 1];
  }

  if (args.includes("--out") || args.includes("-o")) {
    const outIndex = args.indexOf("--out");
    out = args[outIndex + 1];
  } else if (allArgsWasPassed) {
    out = "./svgs/";
  }

  if (args.includes("--version") || args.includes("-v")) {
    console.log(packageJson.version);
    return process.exit(0);
  }

  if (args.includes("--help") || args.includes("-h")) {
    /**
     * Commander was hard to use with Clack.js, so we're using it only for --help
     */
    program
      .name(programName)
      .version(packageJson.version)
      .option(
        "-u, --url <url>",
        "The URL of the Figma frame",
        "https://www.figma.com/file/yourfileidhere/Project-Name?node-id=69%3A420&mode=dev"
      )
      .option("-t, --token <token>", "Your Figma token", "figd_secret_token")
      .option(
        "-o, --out <path>",
        "The path to the folder where the SVGs will be saved",
        "./svgs/"
      )
      .help();

    return process.exit(0);
  }

  console.log();
  prompt.intro(color.magenta(color.bold(` 🖼️🥷 ${programName} 🥷🖼️ `)));
  prompt.note(
    [
      "This tool will fetch SVGs from a Figma frame and save them to disk.",
      "",
      "You can answer the prompts below or pass them as arguments:",
      "",
      color.italic(programName + " --url <url> --token <token> --out <path>"),
    ].join("\n")
  );

  if (typeof url !== "string" || url === "" || typeof url === "symbol") {
    url = await prompt.text({
      message: "What's the Figma frame's URL?",
      placeholder:
        "https://www.figma.com/file/yourfileidhere/Project-Name?node-id=69%3A420&mode=dev",
      validate(value) {
        try {
          urlToIds(value);
        } catch (error) {
          return "Must be a valid Figma URL";
        }
      },
    });

    if (prompt.isCancel(url) || url === "") {
      prompt.cancel("Operation cancelled");
      return process.exit(0);
    }
  } else {
    prompt.note("We got your URL from the command line arguments 👌");
  }

  await void 0; // Hack to make Bun stable

  if (typeof token !== "string" || token === "" || typeof token === "symbol") {
    token = await prompt.password({
      message:
        "What's your Figma token?" +
        color.dim(
          " https://help.figma.com/hc/en-us/articles/8085703771159-Manage-personal-access-tokens"
        ),
      validate(value) {
        const message = "Must be a valid Figma token, starting with figd_";
        if (typeof value !== "string") return message;
        if (!value.startsWith("figd_")) return message;
      },
    });

    if (prompt.isCancel(token) || token === "") {
      prompt.cancel("Operation cancelled");
      return process.exit(0);
    }
  } else {
    prompt.note("We got your Figma token from the command line arguments 👌");
  }

  await void 0; // Hack to make Bun stable

  if (
    !allArgsWasPassed &&
    (typeof out !== "string" || out === "" || typeof out === "symbol")
  ) {
    out = await prompt.text({
      message: "Where do you want your svgs?",
      placeholder: "./svgs/ (default - press ↵ enter)",
      defaultValue: "./svgs/",
      validate(value) {
        if (typeof value !== "string") return "Must be a valid path";
      },
    });

    if (prompt.isCancel(out) || out === "") {
      prompt.cancel("Operation cancelled");
      return process.exit(0);
    }
  } else {
    prompt.note(
      allArgsWasPassed
        ? "Using the default output path: ./svgs/"
        : "We got your output path from the command line arguments 👌"
    );
  }

  await void 0; // Hack to make Bun stable

  const s = prompt.spinner();
  s.start("🏃💨 Be right back with your svgs...");

  try {
    await getSvgs({
      url,
      out: out ?? "./svgs/",
      token,
    });
    s.stop("✅ All done");
  } catch (error) {
    s.stop("💥 Something went wrong");
    prompt.cancel("Operation cancelled");
    return process.exit(0);
  }

  prompt.outro(
    "👋 See you next time!" +
      (allArgsWasPassed
        ? ""
        : color.dim("\nPass parameters if you want to skip prompts 😉"))
  );
}

main().catch(console.error);

// https://www.figma.com/file/cdigx3rPzZGy3bPk9wm1uq/Real-estate?node-id=1111%3A724&mode=dev
// figd_6d5tiFDns8c_VHni4zkTaZW9u-kPbmmo6twbzXG4
// ./svgs/

// bun run index.ts --url "https://www.figma.com/file/cdigx3rPzZGy3bPk9wm1uq/Real-estate?node-id=1111%3A724&mode=dev" --token "figd_6d5tiFDns8c_VHni4zkTaZW9u-kPbmmo6twbzXG4" --out "./svgs/"
