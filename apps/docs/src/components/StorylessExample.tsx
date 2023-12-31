"use client";
// Transpilation and deep import allows bundling Storyless to production
import { Storyless } from "@storyless/react/storyless";
import { Combinations } from "@storyless/react/combinations";
import Link from "next/link";
import { type ComponentPropsWithoutRef } from "react";
import { Button, buttonColorKeys } from "./ButtonExample";

const StorylessComponents: ComponentPropsWithoutRef<
  typeof Storyless
>["components"] = {
  Hello: (
    <h1 className="text-[min(max(3rem,12vw),7rem)] font-black leading-none text-slate-800 drop-shadow-sm">
      Hello World!
    </h1>
  ),
  Button: (
    <Combinations
      component={Button}
      propsToCombine={{
        color: buttonColorKeys,
        size: ["lg", "sm"],
        square: [false, true],
        disabled: [false, true],
        children: ["Button"],
      }}
    />
  ),
  "HTML Tag": (
    <Combinations
      component="div"
      propsToCombine={{
        children: ["This is a div", "This is another div"],
        className: [
          "bg-slate-300 p-5 rounded-xl",
          "bg-pink-200 p-5 rounded-xl",
        ],
      }}
    />
  ),
  Catagotchi: (
    <div className="h-full w-full py-3">
      <iframe
        src="https://catagotchi.vercel.app/"
        width="100%"
        height="100%"
        className="rounded-xl border-2 border-slate-300 "
      />
    </div>
  ),
  Typography: (
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
      <Link href="/">Link</Link>
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
  return <Storyless components={StorylessComponents} />;
}
