"use client";
// Transpilation and deep import allows bundling Storyless to production
import { Storyless } from "@storyless/react/Storyless";
import { type ComponentPropsWithoutRef } from "react";

function Wrapper({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="grid h-full w-full place-items-center overflow-auto bg-white p-4 shadow-[0_0_0.5rem_rgba(0,0,0,0.1)] dark:bg-[#12191f]">
      {children}
    </div>
  );
}

const StorylessComponents: ComponentPropsWithoutRef<
  typeof Storyless
>["components"] = {
  hello: <h1>Hello World!</h1>,
  button: (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <button
        style={{
          width: "120px",
        }}
        type="button"
      >
        Button
      </button>
      <button
        disabled
        style={{
          width: "120px",
        }}
        type="button"
      >
        Disabled
      </button>
    </div>
  ),
  typography: (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
      <h6>Heading 6</h6>
      <p>Pargraph</p>
      <i>Italic</i>
      <b>Bold</b>
      <a href="/">Link</a>
    </div>
  ),
  "Super Long": (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {Array.from({ length: 100 }).map((_, index) => {
        const opacity = 1 - index / (100 * 1.1);
        return (
          <div
            key={opacity}
            style={{
              opacity,
            }}
          >
            element {index + 1}
          </div>
        );
      })}
    </div>
  ),
  "Super Wide": (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      {Array.from({ length: 50 }).map((_, index) => {
        const opacity = 1 - index / (50 * 1.1);
        return (
          <div
            key={opacity}
            style={{
              opacity,
              // width: "100%",
              width: "max-content",
            }}
          >
            element {index + 1}
          </div>
        );
      })}
    </div>
  ),
};

export function StorylessExample(): JSX.Element {
  return <Storyless components={StorylessComponents} wrapper={Wrapper} />;
}
