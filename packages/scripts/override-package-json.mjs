import fs from "fs/promises";
import path from "path";
import { merge } from "lodash";

/**
 * Represents a package, including its original path and any override paths.
 * @typedef {Object} Package
 * @property {string} originalPath - The path to the original package.
 * @property {Object.<string, string>} overridePaths - A mapping of keys to override paths.
 */
const projectRoot = path.join(__dirname, "../../");

/**
 * Determines if a given file path should be ignored based on provided patterns.
 *
 * @param {string} filePath - The file path to check.
 * @param {string[]} [ignorePatterns=[]] - An array of patterns to test against the filePath.
 * @returns {boolean} - Returns true if the filePath matches any of the ignorePatterns, otherwise false.
 */
function shouldIgnorePath(filePath, ignorePatterns = []) {
  return ignorePatterns.some((pattern) => filePath.includes(pattern));
}

/**
 * Recursively retrieves all override paths for package.json files in a directory.
 *
 * @param {Object} param0 - Parameters.
 * @param {string} param0.dir - Directory to search in.
 * @param {number} [param0.searchDepth=Infinity] - Maximum depth to search.
 * @param {string[]} [param0.ignorePatterns=[]] - Patterns to ignore during the search.
 * @param {number} [param0.currentDepth=0] - Current depth of the search.
 * @returns {Promise<Package[]>} - Promise that resolves with an array of Package objects.
 */
async function getAllPackageJSONOverridePaths({
  dir,
  searchDepth = Infinity,
  ignorePatterns = [],
  currentDepth = 0,
}) {
  if (currentDepth > searchDepth) return [];

  const entries = await fs.readdir(dir, { withFileTypes: true });

  /**
   * @type {Promise<Package[]>[]}
   */
  const packagePromises = [];

  /**
   * @type {Package}
   */
  const packageInfo = { originalPath: "", overridePaths: {} };

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

/**
 * Overrides the contents of a package.json file with data from an override file.
 *
 * @param {Object} param0 - Parameters.
 * @param {string} param0.packagePath - Path to the original package.json file.
 * @param {string} param0.overridePath - Path to the override package.json file.
 * @returns {Promise<void>}
 */
async function overridePackageJSON({ packagePath, overridePath }) {
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
  } catch (error) {
    console.error(`Failed to override package.json: ${error}`);
  }
}

async function main() {
  const args = process.argv.slice(2); // Skip the first two elements
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
