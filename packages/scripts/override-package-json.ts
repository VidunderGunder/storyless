import fs from "fs/promises";
import path from "path";
import { merge } from "lodash";

type Package = {
  originalPath: string;
  overridePaths: {
    [key: string]: string;
  };
};

const projectRoot = path.join(__dirname, "../../");

function shouldIgnorePath(
  filePath: string,
  ignorePatterns: string[] = []
): boolean {
  return ignorePatterns.some((pattern) => filePath.includes(pattern));
}

async function getAllPackageJSONOverridePaths({
  dir,
  searchDepth = Infinity,
  ignorePatterns = [],
  currentDepth = 0,
}: {
  dir: string;
  searchDepth?: number;
  ignorePatterns?: string[];
  currentDepth?: number;
}): Promise<Package[]> {
  if (currentDepth > searchDepth) return [];

  const entries = await fs.readdir(dir, { withFileTypes: true });

  const packagePromises: Promise<Package[]>[] = [];

  const packageInfo: Package = { originalPath: "", overridePaths: {} };

  for (const entry of entries) {
    const res = path.resolve(dir, entry.name);

    if (shouldIgnorePath(res, ignorePatterns)) continue;

    if (entry.isDirectory()) {
      packagePromises.push(
        getAllPackageJSONOverridePaths({
          dir: res,
          searchDepth,
          ignorePatterns,
          currentDepth: currentDepth + 1,
        })
      );
    } else {
      if (entry.name === "package.json") {
        packageInfo.originalPath = res;
      } else if (
        entry.name.includes("package.") &&
        entry.name.endsWith(".json")
      ) {
        const term = "package.";
        const extension = ".json";
        const index = entry.name.indexOf(term);
        const overrideKey = entry.name.slice(
          index + term.length,
          -extension.length
        );
        packageInfo.overridePaths[overrideKey] = res;
      }
    }
  }

  if (
    typeof packageInfo.originalPath === "string" &&
    Object.keys(packageInfo.overridePaths).length > 0
  ) {
    packagePromises.push(Promise.resolve([packageInfo]));
  }

  const packageArrays = await Promise.all(packagePromises);

  return packageArrays.flat();
}

async function overridePackageJSON({
  packagePath,
  overridePath,
}: {
  packagePath: string;
  overridePath: string;
}) {
  console.log(
    `⏳ Overriding ${packagePath.replace(
      projectRoot,
      ""
    )} with ${overridePath.replace(projectRoot, "")}...`
  );

  try {
    // Read the original package.json and its override
    const [originalPackage, overridePackage] = await Promise.all([
      fs.readFile(packagePath, "utf-8").then(JSON.parse),
      fs.readFile(overridePath, "utf-8").then(JSON.parse),
    ]);

    // Merge the two objects. The 'lodash.merge' function performs a deep merge.
    const mergedPackage = merge({}, originalPackage, overridePackage);

    // Write the merged object back to the original package.json file
    await fs.writeFile(packagePath, JSON.stringify(mergedPackage, null, 2));
    console.log(
      `✅ Successful ${packagePath.replace(projectRoot, "")} override`
    );
  } catch (error) {
    console.error(
      `❌ Failed to override package.json at ${packagePath.replace(
        projectRoot,
        ""
      )}: ${error}`
    );
  }
}

async function main() {
  console.log("Overriding package.json files...\n");

  const args = process.argv.slice(2); // Skip the first two elements (paths to the runner and script)
  const isPreRelease = args.includes("--release");
  const isPostRelease = args.includes("--development");

  const packageInfos = await getAllPackageJSONOverridePaths({
    dir: projectRoot,
    ignorePatterns: ["/node_modules/"],
  });

  for (const packageInfo of packageInfos) {
    if (isPreRelease) {
      const overridePath = packageInfo.overridePaths["release"];
      if (typeof overridePath !== "string") continue;
      overridePackageJSON({
        packagePath: packageInfo.originalPath,
        overridePath,
      });
    } else if (isPostRelease) {
      const overridePath = packageInfo.overridePaths["development"];
      if (typeof overridePath !== "string") continue;
      overridePackageJSON({
        packagePath: packageInfo.originalPath,
        overridePath,
      });
    }
  }
}

main();
