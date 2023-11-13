"use client";
import * as React from "react";
import { forwardRef } from "react";

export type ThemeToggleProps = {
  // Custom props here
} & React.ComponentPropsWithoutRef<"div">;

/**
 * TODO: Make the global theme toggle button
 */
export const ThemeToggle = forwardRef<HTMLDivElement, ThemeToggleProps>(
  function ThemeToggle({ children, ...props }, ref) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    return (
      <div ref={ref} {...props}>
        <button></button>
        {String(prefersDark)}
      </div>
    );
  }
);
