# 🦘 JSON Switcheroo

A CLI tool to override JSON files.

Why?

An example use case, and the motivation for making this, is to override a monorepo package's `package.json` for release.

When releasing you want to point to the built files `build/index.js` and `build/index.js`, but during development you want to point to the source `index.ts` for transpilation in monorepo apps, so that everything is fast and works as expected without an extra build step or watching for changes.

Given the following files:

```json
// package.json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts"
}
```

```json
// package.release.json
{
  "main": "build/index.js",
  "types": "build/index.js"
}
```

Run the following command to override `package.json` with the `package.override.json` file:

```bash
json-switcheroo package.json package.release.json
```

Now the `package.json` file looks like this:

```json
// package.json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "build/index.js",
  "types": "build/index.d.ts"
}
```

### 🔄 Revert

You can then revert the changes by running

```bash
json-switcheroo --revert
```

```bash
json-switcheroo package.json package.default.json
```

You can manually make a default file, like so:

```json
// package.default.json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts"
}
```

Or by just specifying the fields you want to override:

```json
// package.default.json
{
  "main": "index.ts",
  "types": "index.ts"
}
```

If no default file is provided, the original file will be saved as `package.default.json`.

## 🌲 Nested Example

```json
// package.json (original)
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts",
  "scripts": {
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "18.2.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2",
    "oxlint": "latest"
  }
}
```

```json
// package.release.json
{
  "scripts": {},
  "dependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
```

```bash
json-switcheroo package.json package.release.json
```

```json
// package.json (overridden)
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.ts",
  "types": "index.ts",
  "scripts": {},
  "dependencies": {
    "react": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.2.2"
  }
}
```
