![Storyless](packages/react-storyless/hero.png)

# Storyless

**[👉 LIVE DEMO](https://storyless.vercel.app/)**

For when design system powerhouses like [Storybook](https://storybook.com/) is just too much.

Storyless is a UI DevTool that lets you build and test components in isolation inside of your app.

Direct interoperability with your app and main build tools means hard-to-integrate features like authentication, fetching, state management, themes, etc. will just work when you need them.

> [!CAUTION]  
> Storyless is currently in alpha and is not recommended for production use.

## 🚀 Getting Started

Install using your project's package manager:

```
npm i @storyless/react
yarn add @storyless/react
pnpm i @storyless/react
bun i @storyless/react
{the-new-thing} {add-package-command} @storyless/react
```

Then drop it in your app (we're using [Next.js](https://nextjs.org/) as an example here):

```tsx
import { Storyless } from "@storyless/react";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Storyless
        components={{
          Hello: <h1>Hello World!</h1>,
        }}
      />
    </>
  );
}
```

![Hello](packages/react-storyless/hello.png)

### 🎭 Combinations

We've added a nifty `<Combinations />` component to help you test your components with different props:

```tsx
import { Storyless, Combinations } from "@storyless/react";
import { Button } from "./ButtonExample";

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Storyless
        components={{
          Hello: <h1>Hello World!</h1>,
          // 🗑️ Delete this Button component if copy-pasting
          Button: (
            <Combinations
              component={Button}
              propsToCombine={{
                color: ["#57799F", "#43577E", "#313851", "#D4D195", "#A7C2D1"],
                size: ["lg", "sm"],
                square: [false, true],
                disabled: [false, true],
                children: ["Button"],
              }}
            />
        }}
      />
    </>
  );
}
```

![Button](packages/react-storyless/button.png)

> _Here's the `<Combinations />` documentation:_
>
> Display all combinations of props for a component.
>
> Main props:
>
> - `component` - The component to display.
> - `propsToCombine` - The props to display all combinations for.
> - `componentProps` - Props to pass to all instances of the component.
> - `columns` - Override the number of columns to display the combinations in.
> - `componentBackgroundColor` - Override the background color of the combinations.
>
> @example
>
> ```tsx
> <AllCombinations
>   component={Button} // props => <Button {...props} />
>   propsToCombine={{
>     color: ["slate", "emerald", "sky", "rose"],
>     size: ["lg", "sm"],
>     square: [false, true],
>     disabled: [false, true],
>     children: ["Button"],
>   }}
>   backgroundColor="#13191f"
>   columns={2} // Auto-calculated by default
> />
> ```

If you want to customize the preview window, you can replace the original Wrapper by passing a `wrapper` prop to your `<Storyless />` component. Here's a style agnostic starter wrapper you can use:

```tsx
import { Storyless, Combinations } from "@storyless/react";
import { Button } from "./ButtonExample";

function Wrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: "0.5rem",
        width: "100%",
        height: "100%",
        maxWidth: "100%",
        display: "grid",
        placeItems: "center",
        backgroundColor: "rgba(239, 239, 239, 0.1)",
        boxShadow: `
          inset 0 1px 0px 0px rgba(255, 255, 255, 0.1),
          inset 0 -2px 0px 0px rgba(0, 0, 0, 0.125),
          0 1px 0 7px rgba(0, 0, 0, 0.1)
        `,
        backdropFilter: "blur(30px)",
        padding: "1rem 2rem",
        margin: 0,
      }}
    >
      {children}
    </div>
  );
}

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Storyless
        wrapper={Wrapper}
        components={{
          Hello: <h1>Hello World!</h1>,
          // 🗑️ Delete this Button component if copy-pasting
          Button: (
            <Combinations
              component={Button}
              propsToCombine={{
                color: ["#57799F", "#43577E", "#313851", "#D4D195", "#A7C2D1"],
                size: ["lg", "sm"],
                square: [false, true],
                disabled: [false, true],
                children: ["Button"],
              }}
            />
        }}
      />
    </>
  );
}
```

That's it – now go nuts 🥜🐿️

_And don't worry, Storyless is automatically removed from your production bundle._

# 🥷 [Figma to SVG](https://github.com/VidunderGunder/storyless/tree/main/packages/figma-to-svg#readme)

Figma to SVG is a CLI tool that allows you to download SVGs from a specific frame in Figma

_it probably works for entire files too, but that's not our use case – so feel free to try it out and let us know!_

## 📋 You'll need

1. A Figma API token (see the guide [here](https://www.figma.com/developers/api#access-tokens))
2. A Figma file URL (you can get one by opening a file in Figma, selecting a frame and copying the URL)
3. Optionally, a path to save the SVGs to (defaults to `./svgs/`)

## 🚀 Usage

Prepare your icons and copy the frame's URL:

![Figma frame URL](./packages/figma-to-svg/frame.png)

Then, run the CLI:

```bash
npx @storyless/figma-to-svg # npm
yarn dlx @storyless/figma-to-svg # yarn
pnpx @storyless/figma-to-svg # pnpm
bunx @storyless/figma-to-svg # bun
```

![Figma to SVG CLI](./packages/figma-to-svg/cli.png)

You can also pass parameters to the CLI, to skip the prompts:

```bash
bunx @storyless/figma-to-svg --url "https://www.figma.com/file/yourfileidhere/Project-Name?node-id=69%3A420&mode=dev" --token "figd_23eredgfEegdf-0910g2ojsDjjek-kPbbzmmo6twXG4" --out "./some/folder/"
```

> [!NOTE]  
> The example uses `bunx`, but you can also use `npx`, `yarn dlx`, `pnpx` or any other package runner.

## 🚀 Getting Started (for Contributors)

_Note that all installs may require restarting the terminal – and in some cases a complete reboot – to work properly_

Clone this repo to your development environment

Install [node](https://nodejs.org/en/) `>=20.0.0 <21.0.0`\*

> \*Alternatively, you can use [Node Version Manager](https://github.com/nvm-sh/nvm#installing-and-updating) with the included `.nvmrc` file
>
> ```sh
> nvm use
> ```

Install [bun](https://bun.sh/) `>=1.0.13`

Install dependencies:

```sh
bun i
```

Start developing:

```sh
bun dev
```

Unless you're a veteran, it is _highly recommended_ to read through the [**🤯 Problems During Development?**](https://github.com/VidunderGunder/storyless#-problems-during-development) section before starting development.

## What's inside?

This Turborepo includes the following packages & apps:

### Apps and Packages

- 📂 **apps**
  - 📖 **docs** - _Next.js app for Storyless docs._
  - ...A bunch of framework-specific examples
- 📂 **packages**
  - 📚 **react-storyless** - _React (and Next.js) library for Storyless_
  - 📚 **ui** - _Shared UI components for the monorepo_
  - 🧙‍♂️ **tsconfig** - _Reusable TypeScript configurations_
  - 🧙‍♂️ **eslint-config-storyless** - _Reusable ESLint configurations_

## 📦 Publish

_Note: You need to be a member of the `@storyless` npm organization to publish packages_

```bash
npm login
bun publish-packages
```

## Useful TurboRepo Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## 🤯 Problems During Development?

Below are ways to solve them.

As of now we only support VSCode running on MacOS, Linux and WSL.

You are free to use anything else, but we can't guarantee that it will work.  
Please document your findings if you try something else <3

### Generally

Restart your IDE (VSCode) and/or terminal

Restart your computer

### Permission errors when running commands (MacOS/Linux)

Prefix the command with `sudo`, e.g.:

```bash
sudo whatever you were trying to run
```

### Pulling changes from the repository

Always check for and install new dependecies when you pull changes from the repository:

```bash
bun i
```

### Wrong version of Node

- Check your version with
  ```bash
  node -v
  ```
- Install the correct version according to `engines` in `package.json`

### Wrong version of bun

Check your version with

```bash
bun -v
```

Install the correct version according to `engines` in `package.json`

### Using 32-bit version of Node (Windows)

Getting `error Command failed with exit code 3221225477` or something similar?

Check if you're using 32-bit Node.js:

```bash
node -p "process.arch"
```

If so, ensure you're running on a 64-bit system, then install the 64-bit version instead.

### Divergent git branches

```bash
git config pull.rebase false
```

### Ports already in use

Kill the processes running on relevant ports:

```bash
bun run killports
```

### Weird TypeScript or ESLint errors

First, make sure you're running the workspace version of TypeScript and ESLint:

Open up any TypeScript file in the project and press...

<ul>
  <li>
    <kbd>⌘</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> on Mac  
  </li>
  <li>
    <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> on Windows
  </li>
</ul>

Then ask VSCode to use the workspace TypeScript version:

```
> TypeScript: Select TypeScript Version
```

Then restart the TypeScript server:

```
> TypeScript: Restart TS server
```

Same for ESLint:

```
> ESLint: Restart ESLint server
```
