"use client";

// Transpilation and deep import allows bundling Storyless with our docs app
import { Storyless } from "@storyless/react/Storyless";
import { type ComponentPropsWithoutRef } from "react";
import styles from "./my-storyless.module.css";

function Wrapper({ children }): JSX.Element {
  return <div className={styles.storylessWrapper}>{children}</div>;
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

export function MyStoryless(): JSX.Element {
  return <Storyless components={StorylessComponents} wrapper={Wrapper} />;
}
