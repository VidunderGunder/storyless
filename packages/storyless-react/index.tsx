"use client";
import { forwardRef } from "react";
import * as storyless from "./Storyless";

export const Storyless: (typeof storyless)["Storyless"] =
  process.env.NODE_ENV !== "development" ||
  process.env.BUNDLE_STORYLESS === "true" ||
  process.env.NEXT_PUBLIC_BUNDLE_STORYLESS === "true" ||
  process.env.REACT_APP_BUNDLE_STORYLESS === "true" ||
  // @ts-ignore
  (import.meta?.["env"]?.VITE_BUNDLE_STORYLESS ?? "false") === "true"
    ? forwardRef(function () {
        return null;
      })
    : storyless.Storyless;
