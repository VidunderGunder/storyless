"use client";

// Transpilation and deep import allows bundling Storyless with your app
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
  button: <button type="button">Button</button>,
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
};

export function MyStoryless(): JSX.Element {
  return <Storyless components={StorylessComponents} wrapper={Wrapper} />;
}
